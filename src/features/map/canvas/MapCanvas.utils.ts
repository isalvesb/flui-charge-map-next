import type { ChargingStation } from "../../../types";
import { obterTomDoMarcador } from "../map/Map.utils";
import type { EstiloMapa } from "./MapCanvas.types";

const iconeMarcadorVerde = require("@/assets/map/marker-green.png");
const iconeMarcadorAmarelo = require("@/assets/map/marker-yellow.png");
const iconeMarcadorVermelho = require("@/assets/map/marker-red.png");
const iconeMarcadorCinza = require("@/assets/map/marker-gray.png");

export function obterIconeDoMarcador(station: ChargingStation, now: Date) {
  const tom = obterTomDoMarcador(station, now);

  if (tom === "manutencao") {
    return iconeMarcadorVermelho;
  }

  if (tom === "indisponivel") {
    return iconeMarcadorCinza;
  }

  if (tom === "ocupado") {
    return iconeMarcadorAmarelo;
  }

  return iconeMarcadorVerde;
}

export const estiloEscuroDoMapa: EstiloMapa = [
  { elementType: "geometry", stylers: [{ color: "#172033" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#D7E4DF" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0E1320" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#2F405C" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1D2A3D" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#183628" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#26344D" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#384D6B" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#243149" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0A2237" }],
  },
];
