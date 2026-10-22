import assert from "node:assert/strict";
import test from "node:test";
import { AUTO_FORMATS, getAutoFrameSize } from "../src/features/auto/autoPresentation";

test("molduras preservam proporção e largura disponível em telefone, tablet e panorama", () => {
  assert.equal(AUTO_FORMATS.length, 3);
  for (const available of [0, 280, 350, 768, 1920]) {
    for (const format of AUTO_FORMATS) {
      const frame = getAutoFrameSize(available, format.ratio);
      assert.ok(frame.width <= available && frame.width <= 1100);
      assert.ok(Math.abs(frame.height * format.ratio - frame.width) < 0.001);
    }
  }
});
