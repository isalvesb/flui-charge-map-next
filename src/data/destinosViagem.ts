// Destinos e paradas de recarga inteiramente demonstrativos para o
// Planejador de viagens. As origens seguem cadastradas em ./demonstracao.ts
// (todas dentro da capital de SP); aqui ficam destinos fora dela, para que a
// viagem demonstrativa tenha distância e paradas de recarga no caminho.
// Coordenadas de cidade são aproximadas; não representam roteamento real.
export type ParadaDemonstrativa = {
  id: string;
  nome: string;
  powerKw: number;
  // Posição aproximada da parada no trajeto reto origem → destino (0 a 1).
  fracaoRota: number;
};

export type DestinoViagem = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  paradas: ParadaDemonstrativa[];
};

export const destinosDemonstrativos: DestinoViagem[] = [
  {
    id: "campos-do-jordao",
    nome: "Campos do Jordão, SP",
    cidade: "Campos do Jordão",
    estado: "SP",
    latitude: -22.7394,
    longitude: -45.5914,
    paradas: [
      { id: "atibaia", nome: "Shell Recharge – Atibaia", powerKw: 150, fracaoRota: 0.35 },
      { id: "braganca", nome: "Eletroposto – Bragança Paulista", powerKw: 100, fracaoRota: 0.65 },
      { id: "sjcampos", nome: "Ponto Flui – São José dos Campos", powerKw: 120, fracaoRota: 0.85 },
    ],
  },
  {
    id: "campinas",
    nome: "Campinas, SP",
    cidade: "Campinas",
    estado: "SP",
    latitude: -22.9099,
    longitude: -47.0626,
    paradas: [
      { id: "jundiai", nome: "Eletroposto – Jundiaí", powerKw: 120, fracaoRota: 0.55 },
    ],
  },
  {
    id: "santos",
    nome: "Santos, SP",
    cidade: "Santos",
    estado: "SP",
    latitude: -23.9608,
    longitude: -46.3339,
    paradas: [
      { id: "sao-bernardo", nome: "Ponto Flui – São Bernardo do Campo", powerKw: 100, fracaoRota: 0.5 },
    ],
  },
];

export type DestinoViagemId = (typeof destinosDemonstrativos)[number]["id"];

export function obterDestinoDemonstrativo(id: DestinoViagemId | string) {
  return (
    destinosDemonstrativos.find((destino) => destino.id === id) ??
    destinosDemonstrativos[0]
  );
}
