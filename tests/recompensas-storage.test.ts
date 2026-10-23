import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_HISTORICO,
  criarPontosIniciais,
  normalizarPontos,
} from "../src/features/rewards/points";

test("dados ausentes ou inválidos viram pontos iniciais", () => {
  assert.deepEqual(normalizarPontos(null), criarPontosIniciais());
  assert.deepEqual(normalizarPontos("lixo"), criarPontosIniciais());
  assert.deepEqual(normalizarPontos(42), criarPontosIniciais());
});

test("valores não finitos ou negativos são zerados", () => {
  const pontos = normalizarPontos({ saldo: Number.NaN, acumulado: -5 });
  assert.equal(pontos.saldo, 0);
  assert.equal(pontos.acumulado, 0);
});

test("saldo nunca passa do acumulado", () => {
  const pontos = normalizarPontos({ saldo: 900, acumulado: 100 });
  assert.equal(pontos.saldo, 100);
});

test("nível salvo é ignorado e recalculado pelo acumulado", () => {
  const pontos = normalizarPontos({ saldo: 0, acumulado: 0, nivel: "ouro" });
  assert.equal(pontos.nivel, "bronze");
});

test("entradas de histórico inválidas são descartadas e o histórico é limitado", () => {
  const validos = Array.from({ length: MAX_HISTORICO + 5 }, (_, i) => ({
    id: `m-${i}`,
    tipo: "ganho",
    valor: 50,
    criadoEm: "2026-10-23T14:00:00.000Z",
  }));
  const pontos = normalizarPontos({
    acumulado: 500,
    saldo: 500,
    historico: [{ id: 1, tipo: "ganho" }, null, ...validos],
  });
  assert.equal(pontos.historico.length, MAX_HISTORICO);
  assert.equal(pontos.historico[0].id, "m-0");
});

test("visitas pontuadas são únicas e descartam valores que não são texto", () => {
  const pontos = normalizarPontos({
    visitasPontuadas: ["a", "a", "", 7, "b"],
  });
  assert.deepEqual(pontos.visitasPontuadas, ["a", "b"]);
});
