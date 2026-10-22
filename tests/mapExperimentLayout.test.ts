import test from "node:test";
import assert from "node:assert/strict";
import { getMapExperimentLayout, getOrbRevealGeometry, MAP_ORB_SIZE } from "../src/features/map/mapExperimentLayout";

test("Orb mantém o toque acima da área Home e o painel acima da Orb", () => {
  for (const inset of [0, 21, 34]) for (const height of [360, 540, 700]) {
    const layout = getMapExperimentLayout(height, inset);
    assert.ok(layout.orbBottom >= inset + 10);
    assert.ok(layout.panelBottom >= layout.orbBottom + MAP_ORB_SIZE + 12);
    assert.ok(layout.panelMaxHeight >= 80);
    if (height >= 540) assert.ok(height - layout.panelBottom - layout.panelMaxHeight >= 196);
  }
});

test("expansão parte da posição medida e cobre todos os cantos do viewport", () => {
  for (const [width, height] of [[320, 640], [375, 812], [393, 852], [768, 1024], [1024, 768]]) {
    for (const origin of [{ x: width / 2, y: height - 70, size: 64 }, { x: 24, y: 24, size: 44 }]) {
      const circle = getOrbRevealGeometry(width, height, origin);
      assert.equal(circle.x, origin.x); assert.equal(circle.y, origin.y);
      for (const [x, y] of [[0, 0], [width, 0], [0, height], [width, height]]) {
        assert.ok(Math.hypot(x - circle.x, y - circle.y) < circle.size / 2 * circle.scale);
      }
    }
  }
});

test("origem fora da tela é limitada ao viewport e mantém alvo de toque mínimo", () => {
  assert.equal(getOrbRevealGeometry(393, 852, { x: -30, y: 1000, size: 20 }).size, 44);
  assert.equal(getOrbRevealGeometry(393, 852, { x: -30, y: 1000, size: 20 }).x, 0);
  assert.equal(getOrbRevealGeometry(393, 852, { x: -30, y: 1000, size: 20 }).y, 852);
});
