import type { StyleProp, ViewStyle } from "react-native";

export type UnstableOrbProps = {
  readonly colorShift?: number;
  readonly intensity?: number;
  readonly motionDuration?: number;
  readonly background?: string;
  readonly colors?: [string, string, string];
  readonly style?: StyleProp<ViewStyle>;
  readonly accessibilityLabel?: string;
};
