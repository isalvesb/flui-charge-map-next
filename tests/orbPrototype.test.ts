import assert from "node:assert/strict";
import test from "node:test";
import { FLUIA_STATE_LABELS, type FluiaState } from "../src/features/assistant/fluiaState";
import { getOrbPrototypeMotion } from "../src/features/assistant/orbPrototypePresentation";

test("protótipo preserva seis estados e mantém avisos/alertas sem animação", () => {
  const states = Object.keys(FLUIA_STATE_LABELS) as FluiaState[];
  assert.equal(states.length, 6);
  for (const state of states) {
    const motion = getOrbPrototypeMotion(state, false, true);
    assert.equal(motion.showEffects, true);
    if (state === "aviso" || state === "alerta") assert.equal(motion.duration, 0);
    else assert.ok(motion.duration >= 2200);
  }
});

test("redução de movimento e tela inativa removem efeitos adicionais e ciclos", () => {
  for (const state of Object.keys(FLUIA_STATE_LABELS) as FluiaState[]) {
    for (const [reduced, active] of [[true, true], [true, false], [false, false]]) {
      const motion = getOrbPrototypeMotion(state, reduced, active);
      assert.equal(motion.showEffects, false);
      assert.equal(motion.duration, 0);
      assert.equal(motion.rotate, false);
    }
  }
});
