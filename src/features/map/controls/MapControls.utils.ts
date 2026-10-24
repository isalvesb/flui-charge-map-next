import type { RefObject } from "react";

import type { MapViewHandle, Region } from "../../../components/MapSurface";
import type { DirecaoDeZoom } from "./MapControls.types";

export function alterarZoomMapa(
  direction: DirecaoDeZoom,
  mapRef: RefObject<MapViewHandle | null>,
  regionRef: RefObject<Region | null>,
  fallbackRegion: Region,
  reduceMotion: boolean,
) {
  const currentRegion = regionRef.current ?? fallbackRegion;
  const zoomFactor = direction === "aproximar" ? 0.58 : 1.55;
  const latitudeDelta = Math.min(
    Math.max(currentRegion.latitudeDelta * zoomFactor, 0.004),
    0.08,
  );
  const longitudeDelta = Math.min(
    Math.max(currentRegion.longitudeDelta * zoomFactor, 0.004),
    0.08,
  );

  const nextRegion = {
    ...currentRegion,
    latitudeDelta,
    longitudeDelta,
  };

  regionRef.current = nextRegion;
  mapRef.current?.animateToRegion(nextRegion, reduceMotion ? 0 : 240);
}
