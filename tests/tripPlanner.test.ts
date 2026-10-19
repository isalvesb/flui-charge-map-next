import assert from "node:assert/strict";
import test from "node:test";

import { obterOrigemDemonstrativa } from "../src/data/demonstracao";
import {
  obterDestinoDemonstrativo,
  type DestinoViagem,
} from "../src/data/destinosViagem";
import { planejarViagem, podeIniciarViagem } from "../src/utils/tripPlanner";

const origem = obterOrigemDemonstrativa("fiap");
const campinas = obterDestinoDemonstrativo("campinas");

test("bateria zerada não inventa recarga na primeira parada", () => {
  const plano = planejarViagem(origem, campinas, 100, 0);
  assert.equal(plano.nivelDeAlcance, "foraDeAlcance");
  assert.deepEqual(plano.paradas, []);
  assert.equal(plano.bateriaChegadaDestinoPercent, 0);
  assert.equal(podeIniciarViagem(plano), false);
});

test("bateria suficiente para 5 km não autoriza parada a mais de 40 km", () => {
  const plano = planejarViagem(origem, campinas, 100, 5);
  assert.equal(plano.nivelDeAlcance, "foraDeAlcance");
  assert.equal(plano.paradas.length, 0);
  assert.equal(podeIniciarViagem(plano), false);
});

test("não considera recarga em parada fisicamente inalcançável", () => {
  const plano = planejarViagem(origem, campinas, 40, 100);
  assert.equal(plano.nivelDeAlcance, "foraDeAlcance");
  assert.equal(plano.paradas.length, 0);
});

test("reserva de 5% é aplicada antes de arredondar bateria", () => {
  // Em Campinas, a primeira parada demonstrativa fica a ≈46 km da FIAP.
  // Com autonomia de 48 km, sobra menos de 5% na chegada.
  const plano = planejarViagem(origem, campinas, 48, 100);
  assert.equal(plano.nivelDeAlcance, "foraDeAlcance");
  assert.deepEqual(plano.paradas, []);
});

test("parada alcançável pode elevar a bateria demonstrativa a 80%", () => {
  const plano = planejarViagem(origem, campinas, 50, 100);
  assert.equal(plano.paradas.length, 1);
  assert.ok(plano.paradas[0].bateriaChegadaPercent >= 5);
  assert.equal(plano.paradas[0].bateriaSaidaPercent, 80);
  assert.notEqual(plano.nivelDeAlcance, "foraDeAlcance");
  assert.equal(podeIniciarViagem(plano), true);
});

test("autonomia confortável não exige paradas desnecessárias", () => {
  const plano = planejarViagem(origem, campinas, 120, 100);
  assert.deepEqual(plano.paradas, []);
  assert.equal(plano.nivelDeAlcance, "tranquilo");
  assert.equal(podeIniciarViagem(plano), true);
});

test("se uma parada posterior for inalcançável, não simula nova recarga", () => {
  const destino: DestinoViagem = {
    id: "teste-viagem",
    nome: "Destino de teste",
    cidade: "Teste",
    estado: "SP",
    latitude: 0,
    longitude: 1,
    paradas: [
      { id: "primeira", nome: "Primeira", powerKw: 100, fracaoRota: 0.1 },
      { id: "segunda", nome: "Segunda", powerKw: 100, fracaoRota: 0.9 },
    ],
  };
  const plano = planejarViagem({ latitude: 0, longitude: 0 }, destino, 50, 100);
  assert.equal(plano.nivelDeAlcance, "foraDeAlcance");
  assert.deepEqual(plano.paradas.map((parada) => parada.id), ["primeira"]);
  assert.equal(podeIniciarViagem(plano), false);
});

test("a decisão de navegação diferencia aperto de impossibilidade", () => {
  assert.equal(podeIniciarViagem({ nivelDeAlcance: "tranquilo" }), true);
  assert.equal(podeIniciarViagem({ nivelDeAlcance: "apertado" }), true);
  assert.equal(podeIniciarViagem({ nivelDeAlcance: "foraDeAlcance" }), false);
});
