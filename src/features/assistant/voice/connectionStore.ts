import { validateSttEndpoint } from "./transcribe";
import { VoiceError } from "./voiceSession";

export function createVoiceConnectionStore(endpoint = "") {
  let connection: { endpoint: string; code: string } | null = null;
  let snapshot = { endpoint, ready: false };
  const listeners = new Set<() => void>();
  const publish = () => { for (const listener of listeners) listener(); };
  return {
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => snapshot,
    configure: (url: string, code: string) => {
      const endpoint = validateSttEndpoint(url);
      if (!/^[a-f0-9]{64}$/.test(code.trim())) throw new VoiceError("Informe o código temporário da sessão no Mac.");
      connection = { endpoint, code: code.trim() };
      snapshot = { endpoint, ready: true }; publish();
    },
    read: () => {
      if (!connection) throw new VoiceError("Ative a voz da FluIA nas Configurações.");
      return { ...connection };
    },
    clear: () => {
      connection = null;
      if (snapshot.ready) { snapshot = { ...snapshot, ready: false }; publish(); }
    },
  };
}
// No AsyncStorage, file, URL token or public Expo secret. Only this app process.
export const voiceConnection = createVoiceConnectionStore(process.env.EXPO_PUBLIC_FLUIA_STT_URL ?? "");
