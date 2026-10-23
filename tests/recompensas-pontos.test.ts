import assert from "node:assert/strict";
import test from "node:test";
import {
  BONUS_POR_VISITA,
  MAX_HISTORICO,
  creditarVisita,
  criarPontosIniciais,
} from "../src/features/rewards/points";

const agora = "2026-10-23T14:00:00.000Z";

test("uma visita concede o bônus uma única vez", () => {
  const primeira = creditarVisita(
    criarPontosIniciais(),
    "visita-1",
    agora,
    "mov-1",
  );
  assert.equal(primeira.creditado, true);
  assert.equal(primeira.pontos.saldo, BONUS_POR_VISITA);
  assert.equal(primeira.pontos.acumulado, BONUS_POR_VISITA);

  const repetida = creditarVisita(primeira.pontos, "visita-1", agora, "mov-2");
  assert.equal(repetida.creditado, false);
  assert.equal(repetida.pontos.saldo, BONUS_POR_VISITA);
  assert.equal(repetida.pontos.historico.length, 1);
});

test("editar a avaliação com o mesmo visitaId não concede pontos de novo", () => {
  let pontos = criarPontosIniciais();
  pontos = creditarVisita(pontos, "visita-x", agora, "mov-1").pontos;
  pontos = creditarVisita(pontos, "visita-x", agora, "mov-2").pontos;
  pontos = creditarVisita(pontos, "visita-x", agora, "mov-3").pontos;
  assert.equal(pontos.acumulado, BONUS_POR_VISITA);
});

test("visitas diferentes acumulam pontos", () => {
  let pontos = criarPontosIniciais();
  pontos = creditarVisita(pontos, "visita-a", agora, "m1").pontos;
  pontos = creditarVisita(pontos, "visita-b", agora, "m2").pontos;
  assert.equal(pontos.saldo, BONUS_POR_VISITA * 2);
  assert.equal(pontos.acumulado, BONUS_POR_VISITA * 2);
});

test("visita sem identificador não concede pontos", () => {
  const resultado = creditarVisita(criarPontosIniciais(), "", agora, "m1");
  assert.equal(resultado.creditado, false);
  assert.equal(resultado.pontos.saldo, 0);
});

test("histórico é limitado e mais recente vem primeiro", () => {
  let pontos = criarPontosIniciais();
  for (let i = 0; i < MAX_HISTORICO + 10; i += 1) {
    pontos = creditarVisita(pontos, `visita-${i}`, agora, `mov-${i}`).pontos;
  }
  assert.equal(pontos.historico.length, MAX_HISTORICO);
  assert.equal(pontos.historico[0].id, `mov-${MAX_HISTORICO + 9}`);
});
