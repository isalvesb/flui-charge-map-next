import assert from "node:assert/strict";
import test from "node:test";

import { answerMessage } from "@/src/features/assistant/chatEngine";
import { createStation } from "./fixtures";

const context = {
  stations: [createStation({ id: "near", distanceKm: 1, powerKw: 150 })],
  vehicleRangeKm: 300,
  batteryPercent: 80,
  now: new Date("2026-10-16T15:00:00Z"),
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


test("bateria baixa usa o motor local e recusa bateria insuficiente", () => {
  const viable = answerMessage("Tenho pouca bateria, consigo chegar?", context);
  assert.equal(viable.recommendation?.intent, "lowBattery");
  assert.equal(viable.recommendation?.primary.id, "near");
  assert.match(viable.text, /em linha reta/);
  assert.match(viable.text, /não há integração em tempo real/);
  const insufficient = answerMessage("Tenho pouca bateria", { ...context, batteryPercent: 0 });
  assert.equal(insufficient.state, "alerta");
  assert.equal(insufficient.recommendation, undefined);
});

test("chat respeita o horário recebido da tela nas duas intenções", () => {
  const station = createStation({
    openingHours: "Todos os dias, 08h às 20h",
    openingSchedule: {
      timeZone: "America/Sao_Paulo",
      periods: [{ days: ["fri"], opensAt: "08:00", closesAt: "20:00" }],
    },
  });
  for (const text of ["carregar rápido", "tenho pouca bateria"]) {
    const before = answerMessage(text, {
      ...context, stations: [station], now: new Date("2026-10-16T22:59:59Z"),
    });
    const after = answerMessage(text, {
      ...context, stations: [station], now: new Date("2026-10-16T23:00:00Z"),
    });
    assert.equal(before.recommendation?.primary.id, station.id);
    assert.equal(after.recommendation, undefined);
    assert.equal(after.state, "alerta");
    assert.match(after.text, /dados demonstrativos/);
  }
});

test("bateria baixa não atribui indisponibilidade exclusivamente ao alcance", () => {
  const response = answerMessage("Tenho pouca bateria", {
    ...context, stations: [createStation({ status: "maintenance", distanceKm: 0 })],
  });
  assert.equal(response.recommendation, undefined);
  assert.match(response.text, /horários e os carregadores/);
  assert.match(response.text, /não confirma a disponibilidade real/);
});
