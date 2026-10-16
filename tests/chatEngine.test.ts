import assert from "node:assert/strict";
import test from "node:test";

import { answerMessage } from "@/src/features/assistant/chatEngine";
import { createStation } from "./fixtures";

const context = {
  stations: [createStation({ id: "near", distanceKm: 1, powerKw: 150 })],
  vehicleRangeKm: 300,
  batteryPercent: 80,
  now: new Date(),
};

test("responde pergunta programada sem acento e em maiúsculas", () => {
  const response = answerMessage("O que é AUTONOMIA?", context);
  assert.equal(response.state, "respondendo");
  assert.match(response.text, /Autonomia é a distância/);
});

test("pergunta sem resposta cai na mensagem padrão", () => {
  const response = answerMessage("qual é a capital da França?", context);
  assert.equal(response.state, "respondendo");
  assert.match(response.text, /Posso ajudar?/);
  assert.equal(response.recommendation, undefined);
});

test("pedido de recarga rápida sem estações gera alerta", () => {
  const response = answerMessage("quero carregar rápido", {
    ...context,
    stations: [],
  });
  assert.equal(response.state, "alerta");
  assert.equal(response.recommendation, undefined);
});
