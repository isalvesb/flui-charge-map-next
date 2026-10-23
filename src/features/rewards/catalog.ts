import type { Recompensa } from "./types";

export type IconeRecompensa = "carregador" | "cafe" | "vaga";

export type RecompensaExibicao = Recompensa & {
  parceiro: string;
  detalhe: string;
  icone: IconeRecompensa;
};

// Dados demonstrativos. Os estacaoId vêm de src/data/fixtures/chargingStations.ts.
export const RECOMPENSAS_DEMONSTRATIVAS: readonly RecompensaExibicao[] = [
  {
    id: "rec-higienopolis-desconto",
    estacaoId: "station-01",
    titulo: "10% de desconto na recarga",
    custoPontos: 200,
    validadeDias: 30,
    parceiro: "Higienópolis Prime Charge",
    detalhe: "Válido por 30 dias",
    icone: "carregador",
  },

  {
    id: "rec-vila-mariana-cafe",
    estacaoId: "station-06",
    titulo: "Café cortesia no lounge",
    custoPontos: 120,
    validadeDias: 30,
    parceiro: "Flui Vila Mariana Lins",
    detalhe: "No espaço de convivência",
    icone: "cafe",
  },

  {
    id: "rec-jardins-vaga",
    estacaoId: "station-04",
    titulo: "Prioridade de vaga reservada",
    custoPontos: 300,
    validadeDias: 30,
    parceiro: "Charge City Jardins",
    detalhe: "Reserva prévia de 20 min",
    icone: "vaga",
  },
];
