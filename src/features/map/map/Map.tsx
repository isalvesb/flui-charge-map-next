import { MapCanvas } from "@/features/map/canvas/MapCanvas";
import { MapControls } from "@/features/map/controls/MapControls";
import { PointsSheet } from "@/features/map/points/PointsSheet";
import { MapArea } from "@/features/map/map/MapArea";
import { MapSessionProvider } from "@/features/map/map/MapSession";

export const Map = {
  Provider: MapSessionProvider,
  Area: MapArea,
  Canvas: MapCanvas,
  Controls: MapControls,
  Points: PointsSheet,
};
