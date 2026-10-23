import test from "node:test";
import assert from "node:assert/strict";
import {
  ROTULO_NIVEL,
  faltamParaResgatar,
  formatarPontos,
  podeResgatar,
} from "../src/features/rewards/rewardsView";

test("resgate só é liberado com saldo igual ou maior que o custo", () => {
  assert.equal(podeResgatar(200, 200), true);
  assert.equal(podeResgatar(199, 200), false);
  assert.equal(podeResgatar(0, 120), false);
});

test("faltam pontos nunca é negativo", () => {
  assert.equal(faltamParaResgatar(150, 200), 50);
  assert.equal(faltamParaResgatar(500, 200), 0);
});

test("pontos são formatados em português com separador de milhar", () => {
  assert.equal(formatarPontos(1500), "1.500 pts");
  assert.equal(formatarPontos(0), "0 pts");
});

test("rótulos de nível estão em português", () => {
  assert.equal(ROTULO_NIVEL.bronze, "Bronze");
  assert.equal(ROTULO_NIVEL.prata, "Prata");
  assert.equal(ROTULO_NIVEL.ouro, "Ouro");
});
