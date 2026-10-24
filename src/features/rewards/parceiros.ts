import { RECOMPENSAS_DEMONSTRATIVAS } from "./catalog";

// Um posto é parceiro quando tem pelo menos uma recompensa de parceiro cadastrada.
export function ehEstacaoParceira(stationId: string): boolean {
  return RECOMPENSAS_DEMONSTRATIVAS.some((r) => r.estacaoId === stationId);
}
