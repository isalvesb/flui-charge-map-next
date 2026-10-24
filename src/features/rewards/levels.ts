import type { NivelFlui } from "./types";

// Limites de pontos acumulados por nível. Valores provisórios: ajuste somente aqui.
export const NIVEIS: readonly { nivel: NivelFlui; minimo: number }[] = [
  { nivel: "bronze", minimo: 0 },
  { nivel: "prata", minimo: 500 },
  { nivel: "ouro", minimo: 1500 },
];

function indiceDoNivel(acumulado: number) {
  let indice = 0;
  NIVEIS.forEach((faixa, i) => {
    if (acumulado >= faixa.minimo) indice = i;
  });
  return indice;
}

export function calcularNivel(acumulado: number): NivelFlui {
  return NIVEIS[indiceDoNivel(acumulado)].nivel;
}

export type ProgressoNivel = {
  nivel: NivelFlui;
  proximo: NivelFlui | null;
  faltam: number;
  fracao: number;
};

export function progressoNivel(acumulado: number): ProgressoNivel {
  const indice = indiceDoNivel(acumulado);
  const atual = NIVEIS[indice];
  const seguinte = NIVEIS[indice + 1];

  if (!seguinte) {
    return { nivel: atual.nivel, proximo: null, faltam: 0, fracao: 1 };
  }

  const intervalo = seguinte.minimo - atual.minimo;
  const fracao = Math.min(1, Math.max(0, (acumulado - atual.minimo) / intervalo));

  return {
    nivel: atual.nivel,
    proximo: seguinte.nivel,
    faltam: Math.max(0, seguinte.minimo - acumulado),
    fracao,
  };
}
