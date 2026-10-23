// RN 0.81 uses abort-controller, which has no AbortSignal.throwIfAborted().
export function checkCanceled(signal: AbortSignal) {
  if (signal.aborted) {
    const error = new Error("Operação de voz cancelada.");
    error.name = "AbortError";
    throw error;
  }
}
