import type { FluiaState } from "./fluiaState";
import { getEnergyOrbMotion } from "./energyOrbPresentation";

export function getOrbPrototypeMotion(state: FluiaState, reducedMotion: boolean, active: boolean) {
  const motion = getEnergyOrbMotion(state, reducedMotion, active);
  return { ...motion, showEffects: active && !reducedMotion };
}
