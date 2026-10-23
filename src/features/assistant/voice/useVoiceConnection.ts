import { useSyncExternalStore } from "react";
import { voiceConnection } from "./connectionStore";

export function useVoiceConnection() {
  // Capture is canceled independently on background; the authorized session
  // stays only in this app process until explicit deactivation or termination.
  return useSyncExternalStore(voiceConnection.subscribe, voiceConnection.getSnapshot, voiceConnection.getSnapshot);
}
