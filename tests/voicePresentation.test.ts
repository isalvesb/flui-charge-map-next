import assert from "node:assert/strict";
import test from "node:test";
import { getVoiceVisualStatus } from "../src/features/assistant/voice/voicePresentation";

test("Orb distingue captura, transcrição e erro, liberando leitura após o resultado", () => {
  assert.equal(getVoiceVisualStatus("recording"), "ouvindo");
  for (const phase of ["requesting", "processing", "canceling"] as const) assert.equal(getVoiceVisualStatus(phase), "pensando");
  assert.equal(getVoiceVisualStatus("error"), "erro");
  for (const phase of ["idle", "success"] as const) assert.equal(getVoiceVisualStatus(phase), null);
});

test("leitura continua Explicando mesmo depois de um erro de captura", () => {
  assert.equal(getVoiceVisualStatus("error", true), "explicando");
  assert.equal(getVoiceVisualStatus("success", true), "explicando");
  assert.equal(getVoiceVisualStatus("idle", true), "explicando");
  assert.equal(getVoiceVisualStatus("error", false), "erro");
});
