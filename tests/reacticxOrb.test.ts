import assert from "node:assert/strict";
import test from "node:test";
import { FLUIA_STATE_LABELS, type FluiaState } from "../src/features/assistant/fluiaState";
import { ENERGY_ORB_COLORS } from "../src/features/assistant/energyOrbPresentation";
import { clampOrbFrameDelta, getReacticxOrbPresentation, REACTICX_SHADER_INTERVAL_MS } from "../src/features/assistant/reacticxOrbPresentation";
import { parseColor } from "../src/features/assistant/reacticx/helper";

const states = Object.keys(FLUIA_STATE_LABELS) as FluiaState[];

test("Reacticx representa seis estados com paleta do Flui e brilho limitado", () => {
  for (const state of states) {
    const effect = getReacticxOrbPresentation(state, false, true);
    assert.equal(effect.colors[0], ENERGY_ORB_COLORS[state].core);
    assert.equal(effect.colors[2], ENERGY_ORB_COLORS[state].rim);
    assert.ok(effect.intensity > 0 && effect.intensity <= 1.5);
    assert.ok(effect.glowRadius >= 0.4 && effect.glowRadius <= 0.46);
    assert.equal(effect.animate, state !== "aviso" && state !== "alerta");
    for (const color of effect.colors) for (const channel of parseColor(color)) assert.ok(channel >= 0 && channel <= 1);
  }
});

test("redução de movimento, tela inativa, aviso e alerta não iniciam o relógio do shader", () => {
  for (const state of states) {
    assert.equal(getReacticxOrbPresentation(state, true, true).animate, false);
    assert.equal(getReacticxOrbPresentation(state, false, false).animate, false);
    assert.equal(getReacticxOrbPresentation(state, true, false).animate, false);
  }
});

test("relógio usa tempo decorrido limitado e ignora intervalos inválidos", () => {
  for (const delta of [null, NaN, Infinity, -10]) assert.equal(clampOrbFrameDelta(delta), 0);
  assert.equal(clampOrbFrameDelta(16.7), 16.7);
  assert.equal(clampOrbFrameDelta(5000), 64);
  assert.equal(REACTICX_SHADER_INTERVAL_MS, 1000 / 30);
});

