import test from "node:test";
import assert from "node:assert/strict";
import {
  BONUS_POR_VISITA,
  creditarVisita,
  criarPontosIniciais,
  resgatar,
} from "../src/features/rewards/points";
import type { Recompensa } from "../src/features/rewards/types";

const agora = "2026-10-23T14:00:00.000Z";

const recompensa: Recompensa = {
  id: "rec-10",
  estacaoId: "station-01",
  titulo: "10% de desconto",
  custoPontos: 100,
  validadeDias: 7,
};

function comSaldo(valor: number) {
  let pontos = criarPontosIniciais();
  const visitas = Math.ceil(valor / BONUS_POR_VISITA);
  for (let i = 0; i < visitas; i += 1) {
    pontos = creditarVisita(pontos, `v-${i}`, agora, `m-${i}`).pontos;
  }
  return { ...pontos, saldo: valor };
}

test("resgate com saldo suficiente desconta somente o saldo", () => {
  const pontos = { ...comSaldo(150), acumulado: 150 };
  const resultado = resgatar(pontos, recompensa, agora, "r1");
  assert.equal(resultado.ok, true);
  if (!resultado.ok) return;
  assert.equal(resultado.pontos.saldo, 50);
  assert.equal(resultado.pontos.acumulado, 150);
  assert.equal(resultado.movimento.tipo, "resgate");
  assert.equal(resultado.movimento.valor, 100);
});

test("resgate sem saldo suficiente é recusado e não altera os pontos", () => {
  const pontos = comSaldo(50);
  const resultado = resgatar(pontos, recompensa, agora, "r1");
  assert.deepEqual(resultado, { ok: false, motivo: "saldo_insuficiente" });
});

test("resgate com saldo exato zera o saldo", () => {
  const resultado = resgatar(comSaldo(100), recompensa, agora, "r1");
  assert.equal(resultado.ok, true);
  if (resultado.ok) assert.equal(resultado.pontos.saldo, 0);
});

test("resgate não rebaixa o nível", () => {
  const pontos = { ...comSaldo(100), acumulado: 1500, nivel: "ouro" as const };
  const resultado = resgatar(pontos, recompensa, agora, "r1");
  assert.equal(resultado.ok, true);
  if (resultado.ok) assert.equal(resultado.pontos.nivel, "ouro");
});

test("recompensa com custo inválido é recusada", () => {
  for (const custoPontos of [0, -10, 1.5, Number.NaN]) {
    const resultado = resgatar(
      comSaldo(100),
      { ...recompensa, custoPontos },
      agora,
      "r1",
    );
    assert.deepEqual(resultado, { ok: false, motivo: "recompensa_invalida" });
  }
});
