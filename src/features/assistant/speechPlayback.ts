export type SpeechPlaybackState = "idle" | "speaking" | "error";
type SpeechOptions = { language: string; onStart: () => void; onDone: () => void; onStopped: () => void; onError: (error: Error) => void };
type SpeechEngine = { stop: () => Promise<void>; speak: (text: string, options: SpeechOptions) => void };

// Cada leitura tem sua geração: callbacks antigos não alteram a leitura atual.
export function createSpeechPlayback(engine: SpeechEngine, onState: (state: SpeechPlaybackState) => void) {
  let generation = 0;
  const cancel = () => { generation += 1; void engine.stop().catch(() => {}); };
  return {
    cancel,
    stop() { cancel(); onState("idle"); },
    async speak(text: string) {
      if (!text.trim()) return;
      const current = ++generation;
      const publish = (state: SpeechPlaybackState) => { if (current === generation) onState(state); };
      publish("idle");
      try {
        await engine.stop();
        if (current !== generation) return;
        engine.speak(text, {
          language: "pt-BR",
          onStart: () => publish("speaking"),
          onDone: () => publish("idle"),
          onStopped: () => publish("idle"),
          onError: () => publish("error"),
        });
      } catch { publish("error"); }
    },
  };
}
