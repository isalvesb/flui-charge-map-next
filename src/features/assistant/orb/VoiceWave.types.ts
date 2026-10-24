import type { SharedValue } from "react-native-reanimated";

export type VoiceWaveProps = {
  readonly samples: SharedValue<number[]>;
  readonly width: number;
  readonly height: number;
};
