import type { FluiaState } from "./fluiaState";
import { getEnergyOrbMotion } from "./energyOrbPresentation";

export const ORB_PROTOTYPE_DETAILS: Record<FluiaState, { label: string; dash: string; turn: number }> = {
  repouso: { label: "Halo suave · pulso lento", dash: "95 210", turn: 0 },
  digitando: { label: "Arcos curtos · energia concentrada", dash: "28 18", turn: 0 },
  pensando: { label: "Órbita contínua · pulso suave", dash: "65 30 12 198", turn: 360 },
  respondendo: { label: "Arcos abertos · energia em expansão", dash: "110 43", turn: 30 },
  aviso: { label: "Halo âmbar · estático", dash: "8 8", turn: 0 },
  alerta: { label: "Contorno duplo · estático", dash: "305 0", turn: 0 },
};

export function getOrbPrototypeMotion(state: FluiaState, reducedMotion: boolean, active: boolean) {
  const motion = getEnergyOrbMotion(state, reducedMotion, active);
  return { ...motion, showEffects: active && !reducedMotion, turn: motion.duration ? ORB_PROTOTYPE_DETAILS[state].turn : 0 };
}
