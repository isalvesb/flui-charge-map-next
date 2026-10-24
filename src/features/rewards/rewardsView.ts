import type { NivelFlui } from "./types";

// Funções puras de apresentação: sem React, testáveis com node --test.

export const ROTULO_NIVEL: Record<NivelFlui, string> = {
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
};

export function formatarPontos(valor: number): string {
  return `${valor.toLocaleString("pt-BR")} pts`;
}

export function faltamParaResgatar(saldo: number, custoPontos: number): number {
  return Math.max(0, custoPontos - saldo);
}

export function podeResgatar(saldo: number, custoPontos: number): boolean {
  return faltamParaResgatar(saldo, custoPontos) === 0;
}
