import { checkCanceled } from "./cancellation";
import type { NativeAudioModule, AudioRecorder } from "expo-audio";
import { VoiceCleanupError, VoiceError, type Recording } from "./voiceSession";

async function loadIosDependencies() {
  // Load only after an explicit tap: an older development build must still open
  // FluIA and accept typed messages when ExpoAudio is not in its native binary.
  let audio: typeof import("expo-audio");
  let native: NativeAudioModule;
  try {
    audio = await import("expo-audio");
    const { requireNativeModule } = await import("expo-modules-core");
    native = requireNativeModule<NativeAudioModule>("ExpoAudio");
  } catch {
    throw new VoiceError("Esta build não tem o módulo de gravação. Instale a Development Build do experimento. O teclado continua disponível.");
  }
  const fs = await import("expo-file-system/legacy");
  return { audio, native, fs };
}

export async function beginIosRecording(signal: AbortSignal, interrupted: () => void, load = loadIosDependencies, completed: () => void = () => {}): Promise<Recording> {
  const { audio, native, fs } = await load();
  let recorder: AudioRecorder | undefined;
  const uris = new Set<string>();
  let subscription: { remove(): void } | undefined;
  let disposed: Promise<void> | undefined;
  let finishing = false;
  let startedAt = 0;
  const dispose = () => disposed ??= (async () => {
    let failed = false;
    subscription?.remove();
    if (recorder) {
      if (recorder.uri) uris.add(recorder.uri);
      try { await recorder.stop(); } catch { /* Recorder may already have stopped. */ }
      try { recorder.release(); } catch { failed = true; }
    }
    await audio.setAudioModeAsync({ allowsRecording: false, shouldPlayInBackground: false }).catch(() => { failed = true; });
    for (const uri of uris) {
      try { await fs.deleteAsync(uri, { idempotent: true }); } catch { failed = true; }
    }
    if (failed) throw new VoiceCleanupError("Não foi possível liberar o microfone ou apagar o áudio temporário. Reinicie o app do experimento antes de gravar novamente.");
  })();
  try {
    checkCanceled(signal);
    let permission = await audio.getRecordingPermissionsAsync();
    if (!permission.granted && permission.canAskAgain) permission = await audio.requestRecordingPermissionsAsync();
    checkCanceled(signal);
    if (!permission.granted) throw new VoiceError("Microfone não autorizado. Ative o acesso em Ajustes > Privacidade e Segurança > Microfone, ou use o teclado.");
    await audio.setAudioModeAsync({ allowsRecording: true, shouldPlayInBackground: false, allowsBackgroundRecording: false });
    checkCanceled(signal);
    // SDK 54 exposes the native constructor; unlike the React hook, it can be
    // created lazily after permission and released by the session owner.
    const options = {
      extension: ".wav", sampleRate: 16_000, numberOfChannels: 1, bitRate: 256_000,
      outputFormat: audio.IOSOutputFormat.LINEARPCM, audioQuality: audio.AudioQuality.HIGH,
      linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false,
    };
    recorder = new native.AudioRecorder(options);
    if (recorder.uri) uris.add(recorder.uri);
    await recorder.prepareToRecordAsync();
    if (recorder.uri) uris.add(recorder.uri);
    checkCanceled(signal);
    subscription = recorder.addListener("recordingStatusUpdate", (status) => {
      if (finishing || signal.aborted) return;
      if (status.url) uris.add(status.url);
      if (status.hasError) interrupted();
      else if (status.isFinished) {
        // An unexpected early stop is an interruption, not consent to upload.
        if (Date.now() - startedAt >= 29_500) completed();
        else interrupted();
      }
    });
    startedAt = Date.now();
    recorder.record({ forDuration: 30 });
    if (!recorder.getStatus().isRecording) throw new VoiceError("Não foi possível capturar áudio. Tente novamente.");
    return {
      dispose,
      finish: async () => {
        finishing = true;
        const uri = recorder!.uri;
        if (uri) uris.add(uri);
        await recorder!.stop();
        await audio.setAudioModeAsync({ allowsRecording: false });
        checkCanceled(signal);
        if (!uri) throw new VoiceError("Nenhum áudio foi gravado. Tente novamente.");
        try {
          const info = await fs.getInfoAsync(uri);
          if (!info.exists || !info.size || info.size > 1_024_000) throw new VoiceError("Gravação vazia ou longa demais. Grave uma frase de até 30 segundos.");
          return await fs.readAsStringAsync(uri, { encoding: fs.EncodingType.Base64 });
        } finally {
          await fs.deleteAsync(uri, { idempotent: true });
        }
      },
    };
  } catch (error) {
    await dispose();
    throw error;
  }
}
