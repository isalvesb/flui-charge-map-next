import { createContext, use, type ReactNode } from "react";

import type {
  MapActions,
  MapMeta,
  MapState,
  MapValue,
  MapViewport,
} from "../features/map/map/Map.types";

const MapContext = createContext<MapValue | null>(null);

export function MapProvider({
  value,
  children,
}: {
  value: {
    state: MapState;
    actions: MapActions;
    viewport?: MapViewport | null;
    meta?: MapMeta | null;
  };
  children: ReactNode;
}) {
  return (
    <MapContext.Provider
      value={{
        state: value.state,
        actions: value.actions,
        viewport: value.viewport ?? null,
        meta: value.meta ?? null,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const value = use(MapContext);

  if (!value) {
    throw new Error("Map.Provider is required");
  }

  return value;
}

export function useMapArea() {
  const value = useMapContext();

  if (!value.viewport || !value.meta) {
    throw new Error("Map.Area is required");
  }

  return {
    state: value.state,
    actions: value.actions,
    viewport: value.viewport,
    meta: value.meta,
  };
}
