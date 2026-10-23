import {
  getJsonItem,
  removeStorageItem,
  setJsonItem,
} from "../../storage/jsonStorage";
import { normalizarPontos } from "./points";
import type { Pontos } from "./types";

export const recompensasStorageKeys = {
  pontos: "@flui:recompensas:pontos",
} as const;

// Fila em memória: operações de pontos são executadas uma por vez, para que dois créditos ou um crédito e um resgate não leiam o mesmo saldo antigo.
let fila: Promise<unknown> = Promise.resolve();

export async function lerPontos(): Promise<Pontos> {
  const bruto = await getJsonItem<unknown>(recompensasStorageKeys.pontos, null);
  return normalizarPontos(bruto);
}

export async function salvarPontos(pontos: Pontos): Promise<Pontos> {
  const normalizado = normalizarPontos(pontos);
  await setJsonItem(recompensasStorageKeys.pontos, normalizado);
  return normalizado;
}

export function atualizarPontos(
  alterar: (atual: Pontos) => Pontos,
): Promise<Pontos> {
  const proxima = fila.then(async () =>
    salvarPontos(alterar(await lerPontos())),
  );
  fila = proxima.catch(() => undefined);
  return proxima;
}

export async function limparPontos(): Promise<void> {
  await removeStorageItem(recompensasStorageKeys.pontos);
}
