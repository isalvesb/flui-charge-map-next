import React, { useEffect, useId, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from "react-native-svg";
import { EnergyOrb } from "./EnergyOrb";
import type { FluiaState } from "./fluiaState";
import { ENERGY_ORB_COLORS } from "./energyOrbPresentation";
import { getOrbPrototypeMotion, ORB_PROTOTYPE_DETAILS } from "./orbPrototypePresentation";

// Exclusivo do laboratório. A Orb usada no chat permanece inalterada.
export function EnergyOrbPrototype({ state, reducedMotion, active, size = 96 }: {
  state: FluiaState; reducedMotion: boolean; active: boolean; size?: number;
}) {
  const phase = useRef(new Animated.Value(0)).current;
  const { duration, showEffects, turn } = getOrbPrototypeMotion(state, reducedMotion, active);
  const haloId = useId().replace(/:/g, "");
  const color = ENERGY_ORB_COLORS[state].rim;
  const { dash } = ORB_PROTOTYPE_DETAILS[state];
  useEffect(() => {
    phase.stopAnimation(); phase.setValue(0);
    if (!duration || !showEffects) return;
    const loop = Animated.loop(Animated.timing(phase, { toValue: 1, duration, easing: turn === 360 ? Easing.linear : Easing.inOut(Easing.sin), useNativeDriver: true }));
    loop.start();
    return () => { loop.stop(); phase.setValue(0); };
  }, [duration, phase, showEffects, state, turn]);
  return (
    <View style={{ width: size, height: size }} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFillObject}>
        <Defs><RadialGradient id={haloId} cx="50%" cy="50%" r="50%"><Stop offset="0.65" stopColor={color} stopOpacity={0} /><Stop offset="0.88" stopColor={color} stopOpacity={0.5} /><Stop offset="1" stopColor={color} stopOpacity={0} /></RadialGradient></Defs>
        <Circle cx={50} cy={50} r={50} fill={`url(#${haloId})`} />
      </Svg>
      <EnergyOrb state={state} reducedMotion={reducedMotion} active={active} size={size} />
      <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFillObject}>
        <Path d="M20 42A33 33 0 0 1 44 18 M58 81A33 33 0 0 0 81 57" stroke={color} strokeWidth={2.5} opacity={0.75} fill="none" strokeLinecap="round" />
        <Path d="M14 55L22 48L20 40 M78 61L82 52L88 49" stroke={color} strokeWidth={1.6} opacity={0.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, {
          opacity: showEffects && duration ? phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.45, 0.8, 0.45] }) : 0.65,
          transform: [{ rotate: phase.interpolate({ inputRange: turn === 360 ? [0, 1] : [0, 0.5, 1], outputRange: turn === 360 ? ["0deg", "360deg"] : ["0deg", `${turn}deg`, "0deg"] }) }],
        }]}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Circle cx={50} cy={50} r={48.5} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray={dash} strokeLinecap="round" />
            {state === "alerta" ? <Circle cx={50} cy={50} r={44} stroke={color} strokeWidth={1} fill="none" /> : null}
          </Svg>
        </Animated.View>
    </View>
  );
}
