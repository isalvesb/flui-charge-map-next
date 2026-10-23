// Parâmetros locais do exemplo NEXT. Não são especificações verificadas do veículo.
export const origensDemonstrativas = [
  { id: "fiap", nome: "FIAP", latitude: -23.564304, longitude: -46.652537 },
  { id: "next", nome: "NEXT", latitude: -23.540405908671097, longitude: -46.73414831818115 },
  { id: "paulista", nome: "Paulista", latitude: -23.5616, longitude: -46.6554 },
  { id: "vila-mariana", nome: "Vila Mariana", latitude: -23.5738, longitude: -46.6237 },
] as const;

export type OrigemDemonstrativaId = (typeof origensDemonstrativas)[number]["id"];

export const demonstracaoPadrao = {
  vehicleName: "BYD Dolphin Plus",
  vehicleRangeKm: 400,
  demoOriginId: "fiap" as OrigemDemonstrativaId,
  batteryPercent: 70,
};

export const limiteNomeVeiculo = 60;
export const limiteAutonomiaKm = 2000;

export function obterOrigemDemonstrativa(id: OrigemDemonstrativaId) {
  return origensDemonstrativas.find((origem) => origem.id === id) ?? origensDemonstrativas[0];
}
