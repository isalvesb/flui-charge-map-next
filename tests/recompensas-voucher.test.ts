import test from "node:test";
import assert from "node:assert/strict";
import {
  criarVoucher,
  estaExpirado,
  gerarCodigoVoucher,
} from "../src/features/rewards/voucher";
import type { Recompensa } from "../src/features/rewards/types";

const recompensa: Recompensa = {
  id: "rec-10",
  estacaoId: "station-01",
  titulo: "10% de desconto",
  custoPontos: 200,
  validadeDias: 30,
};

test("código segue o formato FLUI-XXXX-XXXX sem caracteres ambíguos", () => {
  const codigo = gerarCodigoVoucher("rec-10-1000");
  assert.match(codigo, /^FLUI-[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}$/);
});

test("mesma semente gera o mesmo código e sementes diferentes geram códigos diferentes", () => {
  assert.equal(gerarCodigoVoucher("a-1"), gerarCodigoVoucher("a-1"));
  assert.notEqual(gerarCodigoVoucher("a-1"), gerarCodigoVoucher("a-2"));
});

test("voucher expira após os dias de validade da recompensa", () => {
  const agora = Date.parse("2026-10-23T12:00:00.000Z");
  const voucher = criarVoucher(recompensa, agora);
  assert.equal(Date.parse(voucher.expiraEm), agora + 30 * 24 * 60 * 60 * 1000);
  assert.equal(voucher.usado, false);
  assert.equal(voucher.recompensaId, "rec-10");
});

test("expiração: válido antes do prazo e expirado a partir do prazo", () => {
  const agora = Date.parse("2026-10-23T12:00:00.000Z");
  const voucher = criarVoucher(recompensa, agora);
  const prazo = Date.parse(voucher.expiraEm);
  assert.equal(estaExpirado(voucher, prazo - 1), false);
  assert.equal(estaExpirado(voucher, prazo), true);
});
