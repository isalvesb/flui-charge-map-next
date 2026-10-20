import assert from "node:assert/strict";
import test from "node:test";
import { recommendStations } from "../src/features/assistant/fluiAssistant";
import { summarizeSuggestion } from "../src/features/assistant/assistantPresentation";
import { createStation } from "./fixtures";

test("resumo preserva os valores do motor e os limites de segurança", () => {
  const station = createStation({ name: "Ponto de teste", distanceKm: 7 });
  const result = recommendStations({ stations: [station], intent: "fastCharge", vehicleRangeKm: 400, batteryPercent: 70, now: new Date("2026-10-20T12:00:00-03:00") });
  assert.ok(result);
  const before = JSON.stringify(result);
  const text = summarizeSuggestion(result);
  assert.ok(text.includes(result.primary.name));
  assert.ok(text.includes(`chegada ≈${result.arrivalBatteryPercent}%`));
  assert.ok(text.includes(`${result.powerKw} kW`));
  for (const warning of ["em linha reta", "Dados demonstrativos", "reserva de 5%", "Confirme funcionamento e compatibilidade"]) assert.ok(text.includes(warning));
  assert.equal(JSON.stringify(result), before);
  assert.ok(text.length < 300);
});
