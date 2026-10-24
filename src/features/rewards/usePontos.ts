import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { criarPontosIniciais } from "./points";
import { lerPontos } from "./storage";
import type { Pontos } from "./types";

// Lê os pontos sempre que a tela ganha foco, para refletir avaliações feitas antes.
export function usePontos(): Pontos | null {
  const [pontos, setPontos] = useState<Pontos | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      lerPontos()
        .then((dados) => {
          if (ativo) setPontos(dados);
        })
        .catch(() => {
          if (ativo) setPontos(criarPontosIniciais());
        });
      return () => {
        ativo = false;
      };
    }, []),
  );

  return pontos;
}
