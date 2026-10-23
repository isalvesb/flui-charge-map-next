// Adaptado de Reacticx Energy Orb, Copyright (c) 2026 rit3zh, MIT.
// Fonte: 4e11fcfe04e0bd7054574acc1557320911d70e4c. Licença integral em ./LICENSE.
import React, { memo, useEffect, useMemo } from "react";
import { View } from "react-native";
import { FluiAiIcon } from "../FluiAiIcon";
import { Canvas, Fill, Shader, Skia, type Uniforms } from "@shopify/react-native-skia";
import Animated, { useAnimatedStyle, useDerivedValue, useFrameCallback, useSharedValue } from "react-native-reanimated";
import type { ReacticxOrbProps } from "../MapEnergyOrb.types";
import { clampOrbFrameDelta, getMapOrbPulse, getReacticxOrbPresentation, REACTICX_SHADER_INTERVAL_MS } from "../reacticxOrbPresentation";
import { SHADER_SOURCE } from "./conf";
import { parseColor } from "./helper";

const source = Skia.RuntimeEffect.Make(SHADER_SOURCE);
if (!source) throw new Error("Não foi possível compilar o shader Reacticx neste ambiente.");

export const EnergyOrbSkia = memo(function EnergyOrbSkia({ state, reducedMotion, active, size, mapVariant = false }: ReacticxOrbProps) {
  const effect = useMemo(() => getReacticxOrbPresentation(state, reducedMotion, active, mapVariant), [state, reducedMotion, active, mapVariant]);
  const colors = useMemo(() => effect.colors.map(parseColor), [effect.colors]);
  const time = useSharedValue(1.2);
  const pendingMs = useSharedValue(0);
  const frame = useFrameCallback((info) => {
    pendingMs.value += clampOrbFrameDelta(info.timeSincePreviousFrame);
    if (pendingMs.value >= REACTICX_SHADER_INTERVAL_MS) {
      time.value += pendingMs.value / 1000;
      pendingMs.value = 0;
    }
  }, false);

  useEffect(() => {
    pendingMs.value = 0;
    frame.setActive(effect.animate);
    return () => frame.setActive(false);
  }, [effect.animate, frame, pendingMs]);

  const mapPulse = useDerivedValue(() => mapVariant ? getMapOrbPulse(time.value) : 0);
  const iconLightStyle = useAnimatedStyle(() => ({ opacity: 1 - mapPulse.value }));
  const uniforms = useDerivedValue<Uniforms>(() => ({
    iTime: time.value,
    iResolution: [size, size],
    uSpeed: effect.speed,
    uIntensity: effect.intensity,
    uColor0: colors[0],
    uColor1: colors[1],
    uColor2: colors[2],
    uGlowRadius: effect.glowRadius,
    uMapMode: mapVariant ? 1 : 0,
    uMapPulse: mapPulse.value,
  }));
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}>
    <Canvas pointerEvents="none" style={{ width: size, height: size, borderRadius: size / 2 }}>
      <Fill><Shader source={source} uniforms={uniforms} /></Fill>
    </Canvas>
    {mapVariant ? <View pointerEvents="none" style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "center", justifyContent: "center" }}>
      <FluiAiIcon size={size * 0.3} color={effect.colors[0]} />
      <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "center", justifyContent: "center" }, iconLightStyle]}>
        <FluiAiIcon size={size * 0.3} color={effect.colors[1]} />
      </Animated.View>
    </View> : null}
  </View>;
});
