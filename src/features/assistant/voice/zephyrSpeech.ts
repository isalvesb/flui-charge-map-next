import type { SpeechEngine, SpeechOptions } from "../speechPlayback";
import { validateSttEndpoint } from "./transcribe";
import { checkCanceled } from "./cancellation";

export const ZEPHYR_VOICE = "pt-BR-Chirp3-HD-Zephyr";
export type VoiceConnection = { endpoint: string; code: string };
export type PreparedSpeech = { start: () => void; stop: () => Promise<void> };

// Read-only capability check first: an older/disabled intermediary keeps the
// iPhone voice. Once Zephyr is advertised, errors do not silently change voices.
export async function synthesizeZephyr(text: string, connection: VoiceConnection, signal: AbortSignal, request: typeof fetch = fetch): Promise<string | null> {
  const base = validateSttEndpoint(connection.endpoint);
  if (!/^[a-f0-9]{64}$/.test(connection.code)) throw new Error("Conexão de voz indisponível.");
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, 25_000);
  try {
    checkCanceled(signal);
    const headers = { Authorization: `Bearer ${connection.code}`, "Content-Type": "application/json" };
    const health = await request(`${base}/health`, { headers, signal: controller.signal });
    const status = await health.json();
    checkCanceled(signal);
    if (!health.ok) throw new Error("Conexão de voz indisponível.");
    if (status.synthesis?.voice !== ZEPHYR_VOICE) return null;
    if (!text.trim() || text.length > 2000) throw new Error("Resposta longa demais para esta sessão de voz.");
    const response = await request(`${base}/synthesize`, {
      method: "POST", headers, signal: controller.signal,
      body: JSON.stringify({ text, requestId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}` }),
    });
    const result = await response.json();
    checkCanceled(signal);
    if (!response.ok) throw new Error(result.code === "TTS_LIMIT" ? "Limite da voz Zephyr atingido." : "Não foi possível preparar a voz Zephyr.");
    if (result.voice !== ZEPHYR_VOICE || result.encoding !== "MP3" || typeof result.audioContent !== "string" || !result.audioContent || result.audioContent.length > 2_000_000 || result.audioContent.length % 4 || !/^[A-Za-z0-9+/]+={0,2}$/.test(result.audioContent)) throw new Error("Áudio de resposta inválido.");
    return result.audioContent;
  } finally { clearTimeout(timer); signal.removeEventListener("abort", abort); }
}

type Dependencies = {
  connection: () => VoiceConnection | null;
  synthesize: typeof synthesizeZephyr;
  prepare: (audio: string, signal: AbortSignal, options: SpeechOptions) => Promise<PreparedSpeech>;
};

export function createZephyrSpeechEngine(fallback: SpeechEngine, dependencies: Dependencies): SpeechEngine {
  type Session = { controller: AbortController; preparing?: Promise<void>; player?: PreparedSpeech };
  let session: Session | null = null;
  return {
    async stop() {
      const previous = session; session = null;
      previous?.controller.abort();
      await fallback.stop();
      await previous?.preparing?.catch(() => {});
      await previous?.player?.stop();
    },
    async speak(text, options) {
      const connection = dependencies.connection();
      if (!connection) { await fallback.speak(text, options); return; }
      const current: Session = { controller: new AbortController() }; session = current;
      const { signal } = current.controller;
      const callbacks: SpeechOptions = {
        ...options,
        onStart: () => { if (session === current && !signal.aborted) options.onStart(); },
        onDone: () => { if (session === current && !signal.aborted) options.onDone(); },
        onStopped: () => { if (session === current && !signal.aborted) options.onStopped(); },
        onError: error => { if (session === current && !signal.aborted) options.onError(error); },
      };
      try {
        const audio = await dependencies.synthesize(text, connection, signal);
        if (session !== current || signal.aborted) return;
        if (audio === null) { await fallback.speak(text, callbacks); return; }
        current.preparing = (async () => { current.player = await dependencies.prepare(audio, signal, callbacks); })();
        await current.preparing;
        if (session !== current || signal.aborted) { await current.player?.stop(); return; }
        current.player!.start();
      } catch (error) {
        await current.player?.stop();
        if (session === current && !signal.aborted) options.onError(error instanceof Error ? error : new Error("Falha na leitura."));
      }
    },
  };
}
