import test from "node:test";
import assert from "node:assert/strict";
import { ehEstacaoParceira } from "../src/features/rewards/parceiros";

test("postos com recompensa cadastrada são parceiros", () => {
  assert.equal(ehEstacaoParceira("station-01"), true);
  assert.equal(ehEstacaoParceira("station-06"), true);
});

test("postos sem recompensa cadastrada não são parceiros", () => {
  assert.equal(ehEstacaoParceira("station-99"), false);
  assert.equal(ehEstacaoParceira(""), false);
});
