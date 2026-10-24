import type { Recompensa, Voucher } from "./types";

// Sem 0, O, 1 e I para não confundir na leitura do código.
const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Gera um código FLUI-XXXX-XXXX a partir de uma semente (hash FNV-1a + mistura).
export function gerarCodigoVoucher(semente: string): string {
  let hash = 2166136261;
  for (let i = 0; i < semente.length; i += 1) {
    hash ^= semente.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  let estado = hash >>> 0;
  let miolo = "";
  for (let i = 0; i < 8; i += 1) {
    estado = Math.imul(estado ^ (estado >>> 15), 2246822507) >>> 0;
    miolo += ALFABETO[estado % ALFABETO.length];
  }

  return `FLUI-${miolo.slice(0, 4)}-${miolo.slice(4)}`;
}

export function criarVoucher(recompensa: Recompensa, agoraMs: number): Voucher {
  const codigo = gerarCodigoVoucher(`${recompensa.id}-${agoraMs}`);
  return {
    id: `voucher-${codigo}`,
    recompensaId: recompensa.id,
    codigo,
    expiraEm: new Date(agoraMs + recompensa.validadeDias * MS_POR_DIA).toISOString(),
    usado: false,
  };
}

export function estaExpirado(voucher: Voucher, agoraMs: number): boolean {
  return Date.parse(voucher.expiraEm) <= agoraMs;
}
