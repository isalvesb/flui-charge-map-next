import assert from "node:assert/strict";
import test from "node:test";
import { getTripReadingLayout } from "../src/features/trip/tripLayout";

test("planejador dá largura aos rótulos em telas compactas e fonte ampliada", () => {
  for (const width of [320, 375, 390]) assert.equal(getTripReadingLayout(width).stacked, true);
  assert.equal(getTripReadingLayout(440).stacked, false);
  assert.equal(getTripReadingLayout(440, 1.1).stacked, true);
  assert.equal(getTripReadingLayout(768, 1.1, 2).stacked, true);
  assert.equal(getTripReadingLayout(1194, 1.1, 1.4).stacked, false);
});

test("métricas só empilham quando a largura de leitura exige, incluindo ampliação do sistema", () => {
  assert.equal(getTripReadingLayout(390, 1.1).stackedStats, false);
  assert.equal(getTripReadingLayout(320, 1.1).stackedStats, true);
  assert.equal(getTripReadingLayout(390, 1.1, 1.5).stackedStats, true);
  assert.equal(getTripReadingLayout(768, 1.1, 2).stackedStats, false);
});
