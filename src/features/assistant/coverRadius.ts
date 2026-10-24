export type AssistantRevealOrigin = {
  x: number;
  y: number;
  height: number;
};

/** Distance from the origin to the farthest canvas corner. */
export function coverRadius(
  cx: number,
  cy: number,
  width: number,
  height: number,
) {
  return Math.max(
    Math.hypot(cx, cy),
    Math.hypot(width - cx, cy),
    Math.hypot(cx, height - cy),
    Math.hypot(width - cx, height - cy),
  );
}
