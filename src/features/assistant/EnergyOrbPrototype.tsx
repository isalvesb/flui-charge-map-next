import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { EnergyOrb } from "./EnergyOrb";
import type { FluiaState } from "./fluiaState";
import { ENERGY_ORB_COLORS } from "./energyOrbPresentation";
import { getOrbPrototypeMotion } from "./orbPrototypePresentation";

// Exclusivo do laboratório. A Orb usada no chat permanece inalterada.
export function EnergyOrbPrototype({ state, reducedMotion, active, size = 96 }: {
  state: FluiaState; reducedMotion: boolean; active: boolean; size?: number;
}) {
  const phase = useRef(new Animated.Value(0)).current;
  const { duration, showEffects } = getOrbPrototypeMotion(state, reducedMotion, active);
  const color = ENERGY_ORB_COLORS[state].rim;
  useEffect(() => {
    phase.stopAnimation(); phase.setValue(0);
    if (!duration || !showEffects) return;
    const loop = Animated.loop(Animated.timing(phase, { toValue: 1, duration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }));
    loop.start();
    return () => { loop.stop(); phase.setValue(0); };
  }, [duration, phase, showEffects]);
  return (
    <View style={{ width: size, height: size }} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <EnergyOrb state={state} reducedMotion={reducedMotion} active={active} size={size} />
      {showEffects ? (
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, {
          opacity: phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.18, 0.38, 0.18] }),
          transform: [{ scale: phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.035, 1] }) }],
        }]}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Circle cx={50} cy={50} r={48} fill="none" stroke={color} strokeWidth={3} opacity={0.3} />
            <Path d="M12 44L18 35L16 29L25 22 M74 78L83 70L80 65L89 55" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M32 11Q48 5 64 11 M32 89Q49 95 66 88" stroke={color} strokeWidth={1} fill="none" />
          </Svg>
        </Animated.View>
      ) : null}
    </View>
  );
}
