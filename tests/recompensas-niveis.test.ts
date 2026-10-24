import test from "node:test";
import assert from "node:assert/strict";
import { NIVEIS, calcularNivel, progressoNivel } from "../src/features/rewards/levels";

test("níveis respeitam os limites de pontos acumulados", () => {
  assert.equal(calcularNivel(0), "bronze");
  assert.equal(calcularNivel(NIVEIS[1].minimo - 1), "bronze");
  assert.equal(calcularNivel(NIVEIS[1].minimo), "prata");
  assert.equal(calcularNivel(NIVEIS[2].minimo - 1), "prata");
  assert.equal(calcularNivel(NIVEIS[2].minimo), "ouro");
  assert.equal(calcularNivel(100000), "ouro");
});

test("progresso até o próximo nível", () => {
  const inicio = progressoNivel(0);
  assert.equal(inicio.nivel, "bronze");
  assert.equal(inicio.proximo, "prata");
  assert.equal(inicio.faltam, NIVEIS[1].minimo);
  assert.equal(inicio.fracao, 0);

  const meio = progressoNivel(NIVEIS[1].minimo / 2);
  assert.equal(meio.fracao, 0.5);
});

test("nível mais alto não tem próximo nível", () => {
  const topo = progressoNivel(NIVEIS[2].minimo + 1000);
  assert.equal(topo.nivel, "ouro");
  assert.equal(topo.proximo, null);
  assert.equal(topo.faltam, 0);
  assert.equal(topo.fracao, 1);
});
