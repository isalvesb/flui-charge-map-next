export type RevealSession = {
  opening: boolean;
  closing: boolean;
};

export function stepReveal(
  session: RevealSession,
  shown: boolean,
): { session: RevealSession; action: "reset" | "hold" | "open" } {
  if (!shown) {
    return { session: { opening: false, closing: false }, action: "reset" };
  }
  if (session.closing || session.opening) {
    return { session, action: "hold" };
  }
  return { session: { opening: true, closing: false }, action: "open" };
}
