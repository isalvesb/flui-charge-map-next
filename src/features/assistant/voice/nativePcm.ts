import { checkCanceled } from "./cancellation";
import { VoiceCleanupError, VoiceError } from "./voiceSession";
import type { CaptureFactory } from "./liveVoiceSession";

type PcmModule = {
  fluiaStartPcm: (id: string) => Promise<void>;
  fluiaStopPcm: (id: string) => Promise<void>;
  addListener: (event: string, callback: (data: { id: string; content: string; sequence: number; reason: string }) => void) => { remove: () => void };
};

export async function preparePcmCapture(signal: AbortSignal, prompt: (shown: boolean) => void): Promise<CaptureFactory> {
  const audio = await import("expo-audio");
  const { requireNativeModule } = await import("expo-modules-core");
  const native = requireNativeModule<PcmModule>("ExpoAudio");
  if (typeof native.fluiaStartPcm !== "function") throw new VoiceError("Esta atualização precisa da nova build Flui Voz 2.3.");
  checkCanceled(signal);
  let permission = await audio.getRecordingPermissionsAsync();
  if (!permission.granted && permission.canAskAgain) {
    prompt(true);
    try { permission = await audio.requestRecordingPermissionsAsync(); }
    finally { prompt(false); }
  }
  checkCanceled(signal);
  if (!permission.granted) throw new VoiceError("Ative o microfone para Flui Voz 2.3 nos Ajustes do iPhone, ou use o teclado.");
  return async (frame, ended) => {
    checkCanceled(signal);
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    let stopped = false, reason = "", stopPromise: Promise<void> | undefined;
    let resolveEnd!: () => void;
    const finished = new Promise<void>(resolve => { resolveEnd = resolve; });
    const frames = native.addListener("fluiaPcmChunk", data => { if (data.id === id && !stopped && !signal.aborted) frame({ content: data.content, sequence: data.sequence }); });
    const ends = native.addListener("fluiaPcmStopped", data => { if (data.id === id && !stopped) { stopped = true; reason = data.reason; resolveEnd(); ended(reason); } });
    const stop = () => stopPromise ??= (async () => {
      if (!stopped) await native.fluiaStopPcm(id);
      let timer: ReturnType<typeof setTimeout> | undefined;
      try { await Promise.race([finished, new Promise<never>((_resolve, reject) => { timer = setTimeout(() => reject(new VoiceCleanupError("Não foi possível encerrar o microfone. Reinicie o app.")), 2500); })]); }
      finally { clearTimeout(timer); }
      if (reason === "cleanup") throw new VoiceCleanupError("Não foi possível restaurar o áudio. Reinicie o app.");
    })();
    try {
      await native.fluiaStartPcm(id);
      checkCanceled(signal);
      return { stop, dispose: async () => { try { await stop(); } finally { frames.remove(); ends.remove(); } } };
    } catch (error) {
      // A failed native start has no ongoing engine; attempt explicit stop too.
      try { await native.fluiaStopPcm(id); } finally { frames.remove(); ends.remove(); }
      throw error;
    }
  };
}
