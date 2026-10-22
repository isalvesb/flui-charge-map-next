import assert from "node:assert/strict";
import test from "node:test";

import { obterOrigemDemonstrativa } from "../src/data/demonstracao";
import {
  obterDestinoDemonstrativo,
  type DestinoViagem,
} from "../src/data/destinosViagem";
import { planejarViagem, podeIniciarViagem } from "../src/utils/tripPlanner";
import { calcularDistanciaGeograficaKm } from "../src/utils/demonstracao";

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

test("parada alcançável não libera destino sem reserva mínima", () => {
  const plano = planejarViagem(origem, campinas, 50, 100);

  // A parada pode ser alcançada e oferecer recarga.
  assert.equal(plano.paradas.length, 1);
  assert.ok(plano.paradas[0].bateriaChegadaPercent >= 5);
  assert.equal(plano.paradas[0].bateriaSaidaPercent, 80);

  // Mas a chegada ao destino não preserva os 5%.
  assert.equal(plano.bateriaChegadaDestinoPercent, 4);
  assert.equal(plano.nivelDeAlcance, "foraDeAlcance");
  assert.equal(podeIniciarViagem(plano), false);
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

// Distância/alcance de 1/2 consome exatamente 50 pontos percentuais.
const origemLimite = { latitude: 0, longitude: 0 };
const destinoLimite: DestinoViagem = {
  id: "limite-reserva", nome: "Destino limite", cidade: "Teste", estado: "SP",
  latitude: 0, longitude: 1, paradas: [],
};
const alcanceLimite = calcularDistanciaGeograficaKm(origemLimite, destinoLimite) * 2;

test("chegada de 4,6% não arredonda para liberar a viagem", () => {
  const plano = planejarViagem(origemLimite, destinoLimite, alcanceLimite, 54.6);
  assert.equal(plano.bateriaChegadaDestinoPercent, 4);
  assert.equal(plano.nivelDeAlcance, "foraDeAlcance");
  assert.equal(podeIniciarViagem(plano), false);
});

test("chegada exatamente em 5% permite iniciar a viagem", () => {
  const plano = planejarViagem(origemLimite, destinoLimite, alcanceLimite, 55);
  assert.equal(plano.bateriaChegadaDestinoPercent, 5);
  assert.equal(plano.nivelDeAlcance, "apertado");
  assert.equal(podeIniciarViagem(plano), true);
});

test("chegada imediatamente abaixo de 5% continua bloqueada", () => {
  const plano = planejarViagem(origemLimite, destinoLimite, alcanceLimite, 54.999999);
  assert.equal(plano.bateriaChegadaDestinoPercent, 4);
  assert.equal(podeIniciarViagem(plano), false);
});

test("recarga alcançável permite alternativa que preserva a reserva no destino", () => {
  const plano = planejarViagem(origem, campinas, 52, 100);
  assert.equal(plano.paradas.length, 1);
  assert.ok(plano.paradas[0].bateriaChegadaPercent >= 5);
  assert.equal(plano.paradas[0].bateriaSaidaPercent, 80);
  assert.equal(plano.bateriaChegadaDestinoPercent, 7);
  assert.equal(podeIniciarViagem(plano), true);
});

test("último trecho expõe a saída da última recarga em viagem com três paradas", () => {
  const destino = obterDestinoDemonstrativo("campos-do-jordao");
  const plano = planejarViagem(origem, destino, 80, 70);
  assert.equal(plano.paradas.length, 3);
  const ultima = plano.paradas.at(-1)!;
  assert.equal(plano.trechoFinal.bateriaSaidaPercent, ultima.bateriaSaidaPercent);
  assert.equal(plano.trechoFinal.distanciaKm, Math.round(calcularDistanciaGeograficaKm(ultima, destino)));
  assert.equal(plano.bateriaChegadaDestinoPercent, 53);
  assert.equal(podeIniciarViagem(plano), true);
  for (const parada of plano.paradas) assert.ok(parada.bateriaChegadaPercent >= 5);
});

test("sem paradas, o último trecho parte da bateria informada e acompanha a configuração", () => {
  const plano = planejarViagem(origem, campinas, 400, 70);
  assert.equal(plano.paradas.length, 0);
  assert.equal(plano.trechoFinal.bateriaSaidaPercent, 70);
  assert.equal(plano.trechoFinal.distanciaKm, plano.distanciaTotalKm);
  assert.equal(plano.trechoFinal.tempoMin, plano.tempoEstimadoMin);
  const reduzido = planejarViagem(origem, campinas, 50, 70);
  assert.equal(podeIniciarViagem(reduzido), false);
  assert.notEqual(plano.bateriaChegadaDestinoPercent, reduzido.bateriaChegadaDestinoPercent);
});
