import { checkCanceled } from "./cancellation";
import { VoiceError } from "./voiceSession";
import { validateSttEndpoint } from "./transcribe";
import type { LiveWire, PcmFrame } from "./liveVoiceSession";

const errors: Record<string, string> = {
  UNAUTHORIZED: "Atualize o código da sessão nas Configurações.",
  CLOUD_AUTH: "O Mac precisa renovar a conexão com o Google Cloud.",
  NO_SPEECH: "Não reconheci a fala. Toque na Orb e tente novamente.",
  SESSION_LIMIT: "O limite da sessão de voz foi atingido. Confira o consumo no Mac.",
  BUSY: "A conexão de voz ainda está encerrando outra escuta. Tente novamente.",
  TIMEOUT: "A escuta demorou demais. Confira a rede e tente novamente.",
};
type SocketFactory = (url: string, code: string) => WebSocket;
const createSocket: SocketFactory = (url, code) => {
  const NativeSocket = WebSocket as unknown as new (url: string, protocols: null, options: { headers: Record<string, string> }) => WebSocket;
  return new NativeSocket(url, null, { headers: { Authorization: `Bearer ${code}` } });
};

export function openLiveStream(endpoint: string, code: string, signal: AbortSignal, partial: (text: string) => void, final: (text: string) => void, failed: (error: Error) => void, socketFactory = createSocket): Promise<LiveWire> {
  const base = validateSttEndpoint(endpoint);
  if (!/^[a-f0-9]{64}$/.test(code)) return Promise.reject(new VoiceError("Ative a voz da FluIA nas Configurações."));
  checkCanceled(signal);
  return new Promise((resolve, reject) => {
    const socket = socketFactory(base.replace(/^https:/, "wss:") + "/stream", code);
    let ready = false, ended = false, finishing = false;
    const close = () => {
      clearTimeout(timer); clearTimeout(deadline); ended = true; signal.removeEventListener("abort", aborted);
      socket.close();
    };
    const fail = (error: Error) => {
      if (ended) return;
      close();
      if (ready) failed(error); else reject(error);
    };
    const aborted = () => fail(new VoiceError("Escuta cancelada."));
    signal.addEventListener("abort", aborted, { once: true });
    const timer = setTimeout(() => fail(new VoiceError("Não foi possível abrir a conexão de voz. Confira a rede e as Configurações.")), 10_000);
    const deadline = setTimeout(() => fail(new VoiceError("A conexão de voz demorou demais. Toque na Orb para tentar novamente.")), 45_000);
    const send = (message: object) => {
      if (ended || signal.aborted || socket.readyState !== 1 || socket.bufferedAmount > 65_536) throw new VoiceError("A conexão de voz não acompanhou a gravação. Tente novamente.");
      socket.send(JSON.stringify(message));
    };
    socket.onopen = () => { try { send({ type: "start", id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}` }); } catch (error) { fail(error as Error); } };
    socket.onerror = () => fail(new VoiceError("Sem conexão de voz. Confira a rede, o certificado e as Configurações."));
    socket.onclose = () => { if (!ended) fail(new VoiceError("A conexão de voz foi interrompida.")); };
    socket.onmessage = event => {
      if (ended || signal.aborted) return;
      try {
        const message = JSON.parse(String(event.data));
        if (message.type === "error") { fail(new VoiceError(errors[message.code] ?? "Não foi possível reconhecer a fala. Confira a conexão nas Configurações.")); return; }
        if (message.type === "ready" && !ready) {
          ready = true; clearTimeout(timer);
          resolve({
            write: (frame: PcmFrame) => { if (!ended && !finishing) send({ type: "audio", ...frame }); },
            finish: () => { if (!ended && !finishing) { send({ type: "finish" }); finishing = true; } },
            cancel: () => { if (!ended) { try { send({ type: "cancel" }); } catch {} close(); } },
          }); return;
        }
        if (typeof message.text !== "string" || message.text.length > 6000) throw new Error();
        if (message.type === "transcript") partial(message.text);
        else if (message.type === "done") { close(); final(message.text); }
      } catch { fail(new VoiceError("Resposta de voz inválida. Tente novamente.")); }
    };
    if (signal.aborted) aborted();
  });
}
