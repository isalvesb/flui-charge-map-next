// Chips de avaliação. Nesta etapa são só visuais: não são salvos.
export const CHIPS_AVALIACAO = [
  "Carregador funcionou",
  "Ambiente limpo",
  "Sem fila",
  "Boas comodidades",
  "Fácil acesso",
] as const;

// Identificador da visita. Uma visita rende pontos uma única vez.
export function criarVisitaId(stationId: string, agora: number): string {
  return `visita-${stationId}-${agora}`;
}
