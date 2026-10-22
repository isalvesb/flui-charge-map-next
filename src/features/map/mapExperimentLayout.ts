export const MAP_ORB_SIZE = 128;

export function getMapExperimentLayout(bottomInset: number) {
  return { orbBottom: Math.max(12, bottomInset) + 10 };
}

export type OrbOrigin = { x: number; y: number; size: number };

export function getOrbRevealGeometry(width: number, height: number, origin: OrbOrigin) {
  const x = Math.min(width, Math.max(0, origin.x));
  const y = Math.min(height, Math.max(0, origin.y));
  const size = Math.max(44, origin.size);
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
  return { x, y, size, scale: Math.max(1, (radius * 2 + 4) / size) };
}
