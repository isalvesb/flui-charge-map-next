import type { AudioPlayer } from "expo-audio";
import type { SpeechOptions } from "../speechPlayback";
import type { PreparedSpeech } from "./zephyrSpeech";
import { checkCanceled } from "./cancellation";

async function loadDependencies() {
  return { audio: await import("expo-audio"), fs: await import("expo-file-system/legacy") };
}

// One temporary MP3 per response, never AsyncStorage/documents or a remote URL
// containing text/token. Both completion and interruption remove the file.
export async function prepareZephyrAudio(content: string, signal: AbortSignal, options: SpeechOptions, load = loadDependencies): Promise<PreparedSpeech> {
  const { audio, fs } = await load();
  checkCanceled(signal);
  if (!fs.cacheDirectory) throw new Error("Áudio temporário indisponível.");
  const directory = `${fs.cacheDirectory}fluia-tts/`;
  const uri = `${directory}${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}.mp3`;
  let player: AudioPlayer | undefined, subscription: { remove(): void } | undefined;
  let stopped: Promise<void> | undefined, timer: ReturnType<typeof setTimeout> | undefined;
  let started = false;
  const stop = () => stopped ??= (async () => {
    clearTimeout(timer); subscription?.remove(); signal.removeEventListener("abort", aborted);
    try { player?.pause(); } finally {
      try { player?.remove(); } finally { await fs.deleteAsync(uri, { idempotent: true }); }
    }
  })();
  const aborted = () => { void stop().catch(() => {}); };
  const finish = (event: "done" | "stopped" | "error") => {
    void stop().then(() => {
      if (signal.aborted) return;
      if (event === "done") options.onDone();
      else if (event === "stopped") options.onStopped();
      else options.onError(new Error("Não foi possível reproduzir a voz Zephyr."));
    }).catch(() => { if (!signal.aborted) options.onError(new Error("Não foi possível remover o áudio temporário.")); });
  };
  try {
    await fs.makeDirectoryAsync(directory, { intermediates: true });
    // This directory belongs only to generated speech. Clear leftovers from a
    // terminated app; serialized playback ensures there is no other active file.
    for (const name of await fs.readDirectoryAsync(directory)) {
      if (/^[a-z0-9]+-[a-z0-9]+\.mp3$/.test(name)) await fs.deleteAsync(directory + name, { idempotent: true });
    }
    checkCanceled(signal);
    await fs.writeAsStringAsync(uri, content, { encoding: fs.EncodingType.Base64 });
    checkCanceled(signal);
    await audio.setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true, shouldPlayInBackground: false });
    checkCanceled(signal);
    player = audio.createAudioPlayer({ uri }, { updateInterval: 100 });
    subscription = player.addListener("playbackStatusUpdate", status => {
      if (stopped || signal.aborted) return;
      if (status.playing && !started) {
        started = true; clearTimeout(timer); timer = setTimeout(() => finish("error"), 180_000); options.onStart();
      }
      if (status.didJustFinish) finish("done");
      else if (status.playbackState === "error" || status.playbackState === "failed") finish("error");
      else if (started && !status.playing && !status.isBuffering && status.timeControlStatus === "paused") finish("stopped");
    });
    signal.addEventListener("abort", aborted, { once: true });
    checkCanceled(signal);
    return {
      stop,
      start: () => {
        checkCanceled(signal);
        if (stopped) return;
        timer = setTimeout(() => finish("error"), 12_000);
        player!.play();
      },
    };
  } catch (error) { await stop(); throw error; }
}
