export type NivelFlui = "bronze" | "prata" | "ouro";

export type Recompensa = {
  id: string;
  estacaoId: string;
  titulo: string;
  custoPontos: number;
  validadeDias: number;
};

export type Voucher = {
  id: string;
  recompensaId: string;
  codigo: string;
  expiraEm: string;
  usado: boolean;
};

export type MovimentoPontos = {
  id: string;
  tipo: "ganho" | "resgate";
  valor: number;
  visitaId?: string;
  recompensaId?: string;
  criadoEm: string;
};

export type Pontos = {
  saldo: number;
  acumulado: number;
  nivel: NivelFlui;
  historico: MovimentoPontos[];
  // Além do modelo do PRD: impede que a mesma visita renda pontos mais de uma vez.
  visitasPontuadas: string[];
};
