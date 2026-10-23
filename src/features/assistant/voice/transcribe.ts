import { checkCanceled } from "./cancellation";
import { VoiceError } from "./voiceSession";

const messages: Record<string, string> = {
  UNAUTHORIZED: "Código de sessão inválido ou expirado. Confira o código no Mac.",
  CLOUD_AUTH: "O Mac precisa de autorização no Google Cloud. Confira ADC, API e permissões do projeto.",
  NO_SPEECH: "Não reconheci fala. Tente novamente, falando perto do microfone.",
  AUDIO_DURATION: "Grave uma frase de até 30 segundos.",
  INVALID_AUDIO: "O formato da gravação não foi aceito. Tente novamente na build do experimento.",
  SESSION_LIMIT: "O limite deste experimento foi atingido. Confira o consumo no Mac antes de continuar.",
  BUSY: "Já existe uma transcrição no Mac. Aguarde e tente novamente.",
  TIMEOUT: "A transcrição demorou demais. Verifique a conexão antes de tentar novamente.",
  DUPLICATE: "Este áudio já foi enviado. Grave uma nova frase para tentar novamente.",
};

export function validateSttEndpoint(endpoint: string) {
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || (url.pathname !== "/" && url.pathname !== "")) throw new Error();
    const host = url.hostname;
    const privateIp = /^\d+\.\d+\.\d+\.\d+$/.test(host)
      && host.split(".").every(part => Number(part) <= 255)
      && /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
    const localName = !host.includes(".") && /^[a-z][a-z0-9-]*$/i.test(host);
    if (!privateIp && !localName && !host.endsWith(".local")) throw new Error();
    return url.origin;
  } catch { throw new VoiceError("Configure o endereço HTTPS privado do intermediário local no Mac."); }
}

export async function transcribeAudio(endpoint: string, code: string, content: string, signal: AbortSignal, request: typeof fetch = fetch) {
  const base = validateSttEndpoint(endpoint);
  if (!/^[a-f0-9]{64}$/.test(code.trim())) throw new VoiceError("Informe o código de sessão gerado pelo intermediário no Mac.");
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, 28_000);
  try {
    checkCanceled(signal);
    const response = await request(`${base}/transcribe`, {
      method: "POST", signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${code.trim()}` },
      body: JSON.stringify({ content, requestId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}` }),
    });
    checkCanceled(signal);
    const result = await response.json();
    checkCanceled(signal);
    if (!response.ok) throw new VoiceError(messages[result.code] ?? "Serviço de transcrição indisponível. Confira a conexão e o intermediário no Mac.");
    if (typeof result.text !== "string" || !result.text.trim()) throw new VoiceError(messages.NO_SPEECH);
    return result.text.trim();
  } catch (error) {
    if (signal.aborted) throw error;
    if (error instanceof VoiceError) throw error;
    throw new VoiceError(controller.signal.aborted ? messages.TIMEOUT : "Sem conexão com o Mac. Confira a rede, o certificado HTTPS e a permissão de Rede Local nos Ajustes.");
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
  }
}
