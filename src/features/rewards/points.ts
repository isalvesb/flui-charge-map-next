import { calcularNivel } from "./levels";
import type { MovimentoPontos, Pontos, Recompensa } from "./types";

export const BONUS_POR_VISITA = 50;
export const MAX_HISTORICO = 50;

export type ResultadoCredito = { pontos: Pontos; creditado: boolean };

export type ResultadoResgate =
  | { ok: true; pontos: Pontos; movimento: MovimentoPontos }
  | { ok: false; motivo: "recompensa_invalida" | "saldo_insuficiente" };

export function criarPontosIniciais(): Pontos {
  return {
    saldo: 0,
    acumulado: 0,
    nivel: "bronze",
    historico: [],
    visitasPontuadas: [],
  };
}

function inteiroNaoNegativo(valor: unknown): number {
  return typeof valor === "number" && Number.isFinite(valor) && valor > 0
    ? Math.floor(valor)
    : 0;
}

function normalizarMovimento(
  item: Record<string, unknown>,
): MovimentoPontos | null {
  if (
    typeof item.id !== "string" ||
    (item.tipo !== "ganho" && item.tipo !== "resgate") ||
    typeof item.valor !== "number" ||
    !Number.isFinite(item.valor) ||
    typeof item.criadoEm !== "string"
  ) {
    return null;
  }

  return {
    id: item.id,
    tipo: item.tipo,
    valor: item.valor,
    criadoEm: item.criadoEm,
    ...(typeof item.visitaId === "string" ? { visitaId: item.visitaId } : {}),
    ...(typeof item.recompensaId === "string"
      ? { recompensaId: item.recompensaId }
      : {}),
  };
}

// Aceita dados vindos do AsyncStorage em qualquer formato. O nível é sempre
// recalculado a partir do acumulado; o saldo nunca passa do acumulado.
export function normalizarPontos(entrada: unknown): Pontos {
  if (typeof entrada !== "object" || entrada === null) {
    return criarPontosIniciais();
  }

  const dados = entrada as Record<string, unknown>;
  const acumulado = inteiroNaoNegativo(dados.acumulado);
  const saldo = Math.min(inteiroNaoNegativo(dados.saldo), acumulado);

  const historico = Array.isArray(dados.historico)
    ? dados.historico
        .map((item: unknown) =>
          typeof item === "object" && item !== null
            ? normalizarMovimento(item as Record<string, unknown>)
            : null,
        )
        .filter((m): m is MovimentoPontos => m !== null)
        .slice(0, MAX_HISTORICO)
    : [];

  const visitasPontuadas = Array.isArray(dados.visitasPontuadas)
    ? Array.from(
        new Set(
          dados.visitasPontuadas.filter(
            (v: unknown): v is string => typeof v === "string" && v.length > 0,
          ),
        ),
      )
    : [];

  return {
    saldo,
    acumulado,
    nivel: calcularNivel(acumulado),
    historico,
    visitasPontuadas,
  };
}

// Concede o bônus uma única vez por visita. Editar a avaliação usa o mesmo
// visitaId e, portanto, não concede de novo.
export function creditarVisita(
  pontos: Pontos,
  visitaId: string,
  criadoEm: string,
  idMovimento: string,
): ResultadoCredito {
  if (!visitaId || pontos.visitasPontuadas.includes(visitaId)) {
    return { pontos, creditado: false };
  }

  const acumulado = pontos.acumulado + BONUS_POR_VISITA;
  const movimento: MovimentoPontos = {
    id: idMovimento,
    tipo: "ganho",
    valor: BONUS_POR_VISITA,
    visitaId,
    criadoEm,
  };

  return {
    creditado: true,
    pontos: {
      saldo: pontos.saldo + BONUS_POR_VISITA,
      acumulado,
      nivel: calcularNivel(acumulado),
      historico: [movimento, ...pontos.historico].slice(0, MAX_HISTORICO),
      visitasPontuadas: [...pontos.visitasPontuadas, visitaId],
    },
  };
}

// Desconta somente o saldo. O acumulado e o nível não mudam com o resgate.
export function resgatar(
  pontos: Pontos,
  recompensa: Recompensa,
  criadoEm: string,
  idMovimento: string,
): ResultadoResgate {
  if (
    !Number.isInteger(recompensa.custoPontos) ||
    recompensa.custoPontos <= 0
  ) {
    return { ok: false, motivo: "recompensa_invalida" };
  }

  if (pontos.saldo < recompensa.custoPontos) {
    return { ok: false, motivo: "saldo_insuficiente" };
  }

  const movimento: MovimentoPontos = {
    id: idMovimento,
    tipo: "resgate",
    valor: recompensa.custoPontos,
    recompensaId: recompensa.id,
    criadoEm,
  };

  return {
    ok: true,
    movimento,
    pontos: {
      ...pontos,
      saldo: pontos.saldo - recompensa.custoPontos,
      historico: [movimento, ...pontos.historico].slice(0, MAX_HISTORICO),
    },
  };
}
