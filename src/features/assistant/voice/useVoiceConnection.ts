import { useEffect, useSyncExternalStore } from "react";
import { AppState } from "react-native";
import { voiceConnection } from "./connectionStore";

export function useVoiceConnection() {
  const state = useSyncExternalStore(voiceConnection.subscribe, voiceConnection.getSnapshot, voiceConnection.getSnapshot);
  useEffect(() => {
    const listener = AppState.addEventListener("change", value => { if (value === "background") voiceConnection.clear(); });
    return () => listener.remove();
  }, []);
  return state;
}
