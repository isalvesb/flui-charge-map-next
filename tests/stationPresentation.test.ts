import assert from "node:assert/strict";
import test from "node:test";

import {
  formatRatingStars,
  formatStationAddress,
  getEstimatedChargingTime,
  getStationProfile,
  getStationRecommendation,
  getStationRouteUrl,
  getStationRouteNotice,
  getStationStatusInfo,
  getUserInitials,
  getWaitingLevel,
} from "../src/features/stations/stationPresentation";
import { createStation } from "./fixtures";

test("formata os dados apresentados pela ficha da estação", () => {
  const station = createStation();

  assert.equal(
    formatStationAddress(station),
    "Avenida Teste, 100, Centro, São Paulo, SP",
  );
  assert.equal(formatRatingStars(4.2), "★ ★ ★ ★ ☆");
  assert.equal(getUserInitials("Caio Duarte"), "CD");
  assert.equal(getEstimatedChargingTime(150), "20 a 35 min");
  assert.equal(getStationProfile(station), "Carga rápida");
});

test("gera URLs seguras para os provedores suportados", () => {
  const station = createStation();

  assert.match(getStationRouteUrl(station, "google"), /destination=-23\.55,-46\.63/);
  assert.match(getStationRouteUrl(station, "waze"), /ll=-23\.55,-46\.63/);
});

test("avisa sobre recarga não confirmada antes de oferecer a rota", () => {
  const now = new Date("2026-10-16T22:00:00Z");
  const cases = [
    { station: createStation({ status: "unavailable" }), expected: /Status indisponível/ },
    { station: createStation({ status: "maintenance" }), expected: /Em manutenção/ },
    { station: createStation({ status: "busy" }), expected: /Ocupado agora/ },
    { station: createStation({ openingSchedule: undefined, openingHours: "A confirmar" }), expected: /Horário não confirmado/ },
    { station: createStation({ connectors: [] }), expected: /Sem carregadores utilizáveis/ },
  ];
  for (const { station, expected } of cases) {
    const notice = getStationRouteNotice(station, now);
    assert.match(notice, expected);
    assert.match(notice, /recarga não está confirmada/);
    assert.match(notice, /Abrir a rota não garante atendimento/);
  }
});

test("aviso da rota acompanha o limite de fechamento e não promete dados reais", () => {
  const station = createStation({ openingSchedule: {
    timeZone: "America/Sao_Paulo",
    periods: [{ days: ["fri"], opensAt: "08:00", closesAt: "20:00" }],
  } });
  const before = getStationRouteNotice(station, new Date("2026-10-16T22:59:59Z"));
  assert.match(before, /Aberto agora/);
  assert.match(before, /carregadores livres são demonstrativos/);
  const closed = getStationRouteNotice(station, new Date("2026-10-16T23:00:00Z"));
  assert.match(closed, /Fechado agora/);
  assert.match(closed, /recarga não está confirmada/);
});

test("resume status, recomendação e espera sem depender da tela", () => {
  const station = createStation();
  const now = new Date("2026-09-18T15:00:00.000Z");

  assert.equal(getStationStatusInfo(station, now).label, "Aberto agora");
  assert.equal(
    getStationRecommendation(station, 1),
    "Opção com conector rápido no exemplo",
  );
  assert.equal(getWaitingLevel(station.status, 1), "Moderada");
});

test("não promete parada rápida quando só o conector lento está utilizável", () => {
  const station = createStation({powerKw: 150, connectors: [
    {id: "dc", type: "ccs2", label: "CCS2", powerKw: 150, totalChargers: 2, availableChargers: 0},
    {id: "ac", type: "type2", label: "Tipo 2", powerKw: 22, totalChargers: 1, availableChargers: 1},
  ]});
  assert.equal(getStationRecommendation(station, 1), "Opção de recarga nos dados demonstrativos");
});
