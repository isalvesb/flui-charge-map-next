export const MAP_ORB_SIZE = 64;

export function getMapExperimentLayout(mapHeight: number, bottomInset: number) {
  const orbBottom = Math.max(12, bottomInset) + 10;
  const panelBottom = orbBottom + MAP_ORB_SIZE + 12;
  return { orbBottom, panelBottom, panelMaxHeight: Math.max(80, mapHeight - panelBottom - 196) };
}

export type OrbOrigin = { x: number; y: number; size: number };

export function getOrbRevealGeometry(width: number, height: number, origin: OrbOrigin) {
  const x = Math.min(width, Math.max(0, origin.x));
  const y = Math.min(height, Math.max(0, origin.y));
  const size = Math.max(44, origin.size);
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
  return { x, y, size, scale: Math.max(1, (radius * 2 + 4) / size) };
}
