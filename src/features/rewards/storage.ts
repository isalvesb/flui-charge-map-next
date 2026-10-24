import {
  getJsonItem,
  removeStorageItem,
  setJsonItem,
} from "../../storage/jsonStorage";
import { normalizarPontos, resgatar } from "./points";
import { criarVoucher } from "./voucher";
import type { Pontos, Recompensa, Voucher } from "./types";

export const recompensasStorageKeys = {
  pontos: "@flui:recompensas:pontos",
  vouchers: "@flui:recompensas:vouchers",
} as const;

// Fila em memória: operações de pontos são executadas uma por vez, para que
// dois créditos ou um crédito e um resgate não leiam o mesmo saldo antigo.
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

export async function lerVouchers(): Promise<Voucher[]> {
  const bruto = await getJsonItem<unknown>(recompensasStorageKeys.vouchers, []);
  return Array.isArray(bruto)
    ? (bruto as Voucher[]).filter((v) => v && typeof v.id === "string")
    : [];
}

// Desconta os pontos e salva o voucher. Devolve null se o saldo não bastar.
export async function resgatarRecompensa(
  recompensa: Recompensa,
  agoraMs: number,
): Promise<Voucher | null> {
  let resgatou = false;
  const idMovimento = `mov-resgate-${agoraMs}`;

  await atualizarPontos((atual) => {
    const resultado = resgatar(
      atual,
      recompensa,
      new Date(agoraMs).toISOString(),
      idMovimento,
    );
    if (!resultado.ok) return atual;
    resgatou = true;
    return resultado.pontos;
  });

  if (!resgatou) return null;

  const voucher = criarVoucher(recompensa, agoraMs);
  const atuais = await lerVouchers();
  await setJsonItem(recompensasStorageKeys.vouchers, [voucher, ...atuais]);
  return voucher;
}
