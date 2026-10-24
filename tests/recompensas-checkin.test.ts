import test from "node:test";
import assert from "node:assert/strict";
import { CHIPS_AVALIACAO, criarVisitaId } from "../src/features/rewards/checkIn";

test("há cinco chips de avaliação rápida", () => {
  assert.equal(CHIPS_AVALIACAO.length, 5);
});

test("o identificador da visita combina posto e momento", () => {
  const id = criarVisitaId("station-01", 1000);
  assert.equal(id, "visita-station-01-1000");
});

test("visitas em momentos diferentes geram identificadores diferentes", () => {
  assert.notEqual(criarVisitaId("station-01", 1000), criarVisitaId("station-01", 2000));
});
