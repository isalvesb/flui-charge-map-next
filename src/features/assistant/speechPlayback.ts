export type SpeechPlaybackState = "idle" | "speaking" | "error";
type SpeechOptions = { language: string; voice?: string; onStart: () => void; onDone: () => void; onStopped: () => void; onError: (error: Error) => void };
type SpeechEngine = { stop: () => Promise<void>; speak: (text: string, options: SpeechOptions) => void };

// Cada leitura tem sua geração: callbacks antigos não alteram a leitura atual.
export function createSpeechPlayback(engine: SpeechEngine, onState: (state: SpeechPlaybackState) => void, resolveVoice: () => Promise<string | undefined> = async () => undefined) {
  let generation = 0;
  const cancel = () => { generation += 1; void engine.stop().catch(() => {}); };
  return {
    cancel,
    stop() { cancel(); onState("idle"); },
    async stopAndWait() {
      generation += 1;
      onState("idle");
      // Recording starts only after the output engine has released its audio.
      await engine.stop();
    },
    async speak(text: string) {
      if (!text.trim()) return;
      const current = ++generation;
      const publish = (state: SpeechPlaybackState) => { if (current === generation) onState(state); };
      publish("idle");
      try {
        await engine.stop();
        if (current !== generation) return;
        const voice = await resolveVoice();
        if (current !== generation) return;
        engine.speak(text, {
          language: "pt-BR",
          ...(voice ? { voice } : {}),
          onStart: () => publish("speaking"),
          onDone: () => publish("idle"),
          onStopped: () => publish("idle"),
          onError: () => publish("error"),
        });
      } catch { publish("error"); }
    },
  };
}
