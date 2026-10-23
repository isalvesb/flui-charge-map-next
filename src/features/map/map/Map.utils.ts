import type { Region } from "../../../components/MapSurface";
import type { ChargingStation } from "../../../types";
import { isStationOpenAt } from "../../../utils/stationHours";

type TomDoMarcador = "manutencao" | "indisponivel" | "ocupado" | "disponivel";

export function criarRegiaoDoMapa(
  station: ChargingStation | undefined,
  aproxima: boolean,
): Region {
  const delta = aproxima ? 0.018 : 0.035;

  return {
    latitude: station?.latitude ?? -23.5639,
    longitude: station?.longitude ?? -46.6524,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

export function criarRegiaoComFocoVisivel(
  latitude: number,
  longitude: number,
  aproxima = true,
  fracaoDeDeslocamento = 0.08,
  fracaoHorizontal = 0,
): Region {
  const delta = aproxima ? 0.014 : 0.026;

  return {
    latitude: latitude - delta * fracaoDeDeslocamento,
    longitude: longitude - delta * fracaoHorizontal,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

export function obterTomDoMarcador(
  station: ChargingStation,
  now: Date,
): TomDoMarcador {
  if (station.status === "maintenance") {
    return "manutencao";
  }

  if (station.status === "unavailable" || !isStationOpenAt(station, now)) {
    return "indisponivel";
  }

  if (station.status === "busy") {
    return "ocupado";
  }

  return "disponivel";
}

// Topo 18 + zoom 104 + intervalo 10 + centralizar 52 + intervalo 10 + FluIA 52 + painel 4.
const VERTICAL_CONTROL_SPACE = 250;

// Mantém espaço para os controles do mapa sem depender de um dispositivo específico.
export function getMapPanelLayout(
  width: number,
  height: number,
  mapHeight: number,
  textScale = 1,
  panelHeight = 0,
) {
  const horizontal = width >= 700 && width > height;
  const compactControls =
    horizontal ||
    mapHeight < 420 ||
    textScale > 1.3 ||
    mapHeight - panelHeight < VERTICAL_CONTROL_SPACE;

  return {
    horizontal,
    compactControls,
    panelWidth: horizontal ? Math.min(400, width * 0.42) : undefined,
    // Na tela compacta, a FluIA fica abaixo da fileira de controles.
    panelMaxHeight: Math.max(
      80,
      mapHeight - (horizontal ? 12 : compactControls ? 150 : 80),
    ),
  };
}

// Um painel lateral não encobre a parte inferior do mapa.
export function getMapVerticalFocusOffset(
  horizontal: boolean,
  mapHeight: number,
  obstructedHeight: number,
  panelHidden = false,
) {
  if (horizontal) return 0;
  if (mapHeight <= 0) return 0.08;
  if (panelHidden) return 0;
  return Math.min(Math.max(obstructedHeight / 2 / mapHeight, 0), 0.4);
}

export function getMapHorizontalFocusOffset(
  horizontal: boolean,
  mapWidth: number,
  panelWidth: number,
  panelHidden = false,
) {
  if (!horizontal || panelHidden || mapWidth <= 0) return 0;
  return Math.min(Math.max((panelWidth + 16) / 2 / mapWidth, 0), 0.4);
}
