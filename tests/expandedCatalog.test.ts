import assert from "node:assert/strict";
import test from "node:test";
import { chargingStations } from "../src/data/fixtures/chargingStations";
import { expandedChargingStations } from "../src/data/fixtures/expandedChargingStations";
import { obterOrigemDemonstrativa } from "../src/data/demonstracao";
import { aplicarOrigemDemonstrativa } from "../src/utils/demonstracao";
import { filtrarEstacoes } from "../src/utils/filtrarEstacoes";
import { defaultFilters } from "../src/data/filterOptions";
import { canChargeAt } from "../src/utils/stationAvailability";

const now = new Date("2026-10-23T15:00:00Z");

test("expansão preserva estações antigas e não injeta favoritos, fotos ou avaliações", () => {
  assert.equal(chargingStations.length, 66);
  assert.deepEqual(chargingStations.slice(0, 12).map(s => s.id), Array.from({ length: 12 }, (_, i) => `station-${String(i + 1).padStart(2, "0")}`));
  assert.equal(new Set(chargingStations.map(s => s.id)).size, chargingStations.length);
  for (const station of expandedChargingStations) {
    assert.equal(station.reviewCount, 0);
    assert.equal(station.rating, 0);
    assert.deepEqual(station.reviews, []);
    assert.equal(station.isFavorite, false);
    assert.equal(station.imageKey, undefined);
    assert.equal(station.imageUrl, undefined);
    assert.match(station.address, /fictício/);
  }
});

test("novos pontos têm coordenadas e conectores coerentes sem confirmar recarga em manutenção", () => {
  const connectorIds: string[] = [];
  for (const station of expandedChargingStations) {
    assert.ok(Number.isFinite(station.latitude) && station.latitude < -20 && station.latitude > -25);
    assert.ok(Number.isFinite(station.longitude) && station.longitude < -41 && station.longitude > -49);
    for (const connector of station.connectors) {
      connectorIds.push(connector.id);
      assert.ok(connector.availableChargers >= 0 && connector.availableChargers <= connector.totalChargers);
      assert.ok(connector.powerKw > 0 && connector.powerKw <= station.powerKw);
    }
    assert.equal(canChargeAt(station, now), station.status === "available");
  }
  assert.equal(new Set(connectorIds).size, connectorIds.length);
});

test("base cobre NEXT, interior, litoral e RJ com distâncias calculadas desde a origem", () => {
  const nearNext = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("next"));
  const nearby = filtrarEstacoes({ estacoes: nearNext, filtros: defaultFilters, agora: now });
  assert.ok(nearby.filter(s => s.id.startsWith("next-")).length >= 6);
  assert.ok(nearby.some(s => s.id === "next-butanta"));
  for (const id of ["next-campinas", "next-resende", "next-rio-centro", "next-ubatuba", "next-paraty", "next-cabo-frio", "next-buzios"]) {
    assert.ok(chargingStations.some(s => s.id === id), id);
  }
  assert.ok(chargingStations.filter(s => s.state === "RJ").length >= 15);
  const fiap = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("fiap"));
  assert.ok(fiap.find(s => s.id === "next-butanta")!.distanceKm > nearNext.find(s => s.id === "next-butanta")!.distanceKm);
});
