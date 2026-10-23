import { StyleSheet, View } from "react-native";
import { Canvas, Group, Path, Skia } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

import { colors } from "../../../theme";
import { styles } from "./VoiceWave.styles";
import type { VoiceWaveProps } from "./VoiceWave.types";

function waveLoudness(data: readonly number[]) {
  "worklet";
  const count = data.length;
  if (count === 0) return 0;

  let energy = 0;
  for (let index = 0; index < count; index += 1) {
    energy += Math.abs(data[index] ?? 0);
  }

  return Math.min(1, energy / count / 0.18);
}

function waveRibbon(
  data: readonly number[],
  width: number,
  height: number,
  maxHalf: number,
  loud: number,
) {
  "worklet";
  const path = Skia.Path.Make();
  const count = data.length;
  const midY = height / 2;
  if (count === 0) return path;

  const weight = 0.12 + loud * 0.88;
  const amplitude = height * 0.46;
  const upper = new Array<{ x: number; y: number }>(count);
  const lower = new Array<{ x: number; y: number }>(count);

  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const taper = Math.sqrt(Math.max(0, Math.sin(Math.PI * t)));
    const x = 1 + t * (width - 2);
    const y = midY - (data[index] ?? 0) * amplitude * taper;
    const half = maxHalf * weight * taper;
    upper[index] = { x, y: y - half };
    lower[index] = { x, y: y + half };
  }

  const start = upper[0];
  if (!start) return path;

  path.moveTo(start.x, start.y);
  for (let index = 1; index < count; index += 1) {
    const point = upper[index];
    if (point) path.lineTo(point.x, point.y);
  }
  for (let index = count - 1; index >= 0; index -= 1) {
    const point = lower[index];
    if (point) path.lineTo(point.x, point.y);
  }
  path.close();
  return path;
}

export function VoiceWave({ samples, width, height }: VoiceWaveProps) {
  const glow = useDerivedValue(() => {
    const data = samples.value;
    return waveRibbon(data, width, height, 2.8, waveLoudness(data));
  }, [height, samples, width]);

  const core = useDerivedValue(() => {
    const data = samples.value;
    return waveRibbon(data, width, height, 1.15, waveLoudness(data));
  }, [height, samples, width]);

  const opacity = useDerivedValue(() => {
    return 0.035 + waveLoudness(samples.value) * 0.965;
  }, [samples]);

  return (
    <View
      style={[styles.wave, { width, height }]}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
    >
      <Canvas style={StyleSheet.absoluteFill}>
        <Group opacity={opacity}>
          <Path path={glow} style="fill" color="#E5CCFF" />
          <Path path={core} style="fill" color={colors.white} />
        </Group>
      </Canvas>
    </View>
  );
}
