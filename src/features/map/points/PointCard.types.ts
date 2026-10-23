import type { LayoutChangeEvent } from "react-native";

import type { ChargingStation } from "../../../types";

export type PointCardProps = {
  station: ChargingStation;
  hidden: boolean;
  onPress: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
};
