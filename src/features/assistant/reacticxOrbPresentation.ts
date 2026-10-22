import type { FluiaState } from "./fluiaState";
import { ENERGY_ORB_COLORS } from "./energyOrbPresentation";

export const REACTICX_SHADER_INTERVAL_MS = 1000 / 30;

const STATE_EFFECTS: Record<FluiaState, { speed: number; intensity: number; glowRadius: number }> = {
  repouso: { speed: 0.25, intensity: 1.1, glowRadius: 0.42 },
  digitando: { speed: 0.65, intensity: 1.3, glowRadius: 0.4 },
  pensando: { speed: 0.9, intensity: 1.5, glowRadius: 0.44 },
  respondendo: { speed: 0.5, intensity: 1.4, glowRadius: 0.46 },
  aviso: { speed: 0, intensity: 1.1, glowRadius: 0.42 },
  alerta: { speed: 0, intensity: 1.3, glowRadius: 0.44 },
};

export function getReacticxOrbPresentation(state: FluiaState, reducedMotion: boolean, active: boolean, mapVariant = false) {
  const colors = ENERGY_ORB_COLORS[state];
  const effect = STATE_EFFECTS[state];
  return {
    ...effect,
    colors: mapVariant ? ["#2B0055", "#C797FF", "#6F2DC4"] : [colors.core, colors.light, colors.rim],
    animate: active && !reducedMotion && effect.speed > 0,
  };
}

// Usado no worklet: ignora intervalos inválidos e evita saltos ao retomar a tela.
export function clampOrbFrameDelta(deltaMs: number | null) {
  "worklet";
  return deltaMs !== null && Number.isFinite(deltaMs) ? Math.min(64, Math.max(0, deltaMs)) : 0;
}

