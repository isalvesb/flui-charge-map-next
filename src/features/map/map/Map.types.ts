import type { RefObject } from "react";
import type { Animated } from "react-native";

import type { MapViewHandle, Region } from "../../../components/MapSurface";
import type { ChargingStation, StationFilters } from "../../../types";
import type {
  PointsSheetHandle,
  PointsSheetMotion,
} from "../points/PointsSheet.types";

export type EstacaoNoMapa = {
  station: ChargingStation;
  index: number;
};

export type OrigemDoMapa = {
  nome: string;
  latitude: number;
  longitude: number;
};

export type FiltrosDoMapa = StationFilters;

export type MapState = {
  visibleStations: EstacaoNoMapa[];
  recommendedStations: EstacaoNoMapa[];
  fallbackStations: ChargingStation[];
  origin: OrigemDoMapa;
  now: Date;
  dark: boolean;
  batteryPercent: number;
  vehicleRangeKm: number;
  hasSearch: boolean;
  hasFilters: boolean;
  filters: FiltrosDoMapa;
  searchTerm: string;
  horizontalInset: number;
  isOpeningDetails: boolean;
  feedbackMessage: string | null;
};

export type MapActions = {
  openStation: (stationId: string, startRoute?: boolean) => void;
  adjustSearch: () => void;
  planTrip: () => void;
  onRecentered: () => void;
};

export type MapViewport = {
  horizontal: boolean;
  compactControls: boolean;
  panelWidth: number | undefined;
  panelMaxHeight: number;
  sheetHeight: number;
  translateY: Animated.Value;
  collapsedOffset: number;
  hiddenOffset: number;
  fullyHidden: boolean;
  collapsed: boolean;
  locating: boolean;
  region: Region;
  recenter: () => void;
  onMapReady: () => void;
  onRegionChangeComplete: (region: Region) => void;
  onMotionChange: (motion: PointsSheetMotion) => void;
};

export type MapMeta = {
  mapRef: RefObject<MapViewHandle | null>;
  regionRef: RefObject<Region | null>;
  sheetRef: RefObject<PointsSheetHandle | null>;
};

export type MapValue = {
  state: MapState;
  actions: MapActions;
  viewport: MapViewport | null;
  meta: MapMeta | null;
};
