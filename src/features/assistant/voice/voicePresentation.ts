import type { FluiaVisualStatus } from "../fluiaVisualStatus";
import type { VoicePhase } from "./voiceSession";

export function getVoiceVisualStatus(phase: VoicePhase, isSpeaking = false): FluiaVisualStatus | null {
  if (isSpeaking) return "explicando";
  if (phase === "recording") return "ouvindo";
  if (["requesting", "processing", "canceling"].includes(phase)) return "pensando";
  if (phase === "error") return "erro";
  return null;
}
