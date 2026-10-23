import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Canvas, Circle, Mask, Rect } from "@shopify/react-native-skia";
import {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { colors } from "../../theme";
import { coverRadius, type AssistantRevealOrigin } from "./coverRadius";
import { stepReveal, type RevealSession } from "./revealSession";

// ~800px to the far corner at 520ms is about 1.6px/ms. Ease-out spends
// the end of that timing on the last expansion, which is most of the
// area because area grows with r².
const REVEAL_DURATION = 520;
// Five entrances across 480ms, stepped by 0.16, land about 80ms apart.
const CONTENT_DURATION = 480;

type Options = {
  visible: boolean;
  origin: AssistantRevealOrigin | null;
  width: number;
  height: number;
  reducedMotion: boolean;
  onClosed: () => void;
};

function entrance(progress: number, index: number) {
  "worklet";
  const start = index * 0.16;
  const end = Math.min(start + 0.42, 1);
  return {
    opacity: interpolate(progress, [start, end], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          progress,
          [start, end],
          [12, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  };
}

export function useCircularReveal({
  visible,
  origin,
  width,
  height,
  reducedMotion,
  onClosed,
}: Options) {
  const cx = useSharedValue(0);
  const cy = useSharedValue(0);
  const radius = useSharedValue(0);
  const revealed = useSharedValue(0);
  const closing = useSharedValue(0);
  const openToken = useSharedValue(0);
  const startRadius = useRef(1);
  const session = useRef<RevealSession>({ opening: false, closing: false });
  const onClosedRef = useRef(onClosed);
  const closeNotified = useRef(false);
  const [interactive, setInteractive] = useState(false);

  onClosedRef.current = onClosed;

  const finishClose = useCallback(() => {
    if (closeNotified.current) return;
    closeNotified.current = true;
    onClosedRef.current();
  }, []);

  useLayoutEffect(() => {
    const shown = visible && origin != null && width > 0 && height > 0;
    const step = stepReveal(session.current, shown);
    session.current = step.session;
    if (step.action !== "open" || !origin) {
      if (!shown) closing.value = 0;
      return;
    }

    const token = openToken.value + 1;
    openToken.value = token;
    closeNotified.current = false;
    closing.value = 0;
    cx.value = origin.x;
    cy.value = origin.y;
    const start = Math.max(1, origin.height / 2);
    startRadius.current = start;
    const end = coverRadius(origin.x, origin.y, width, height);

    if (reducedMotion) {
      radius.value = end;
      revealed.value = 1;
      setInteractive(true);
      return;
    }

    setInteractive(false);
    revealed.value = 0;
    radius.value = start;
    radius.value = withTiming(
      end,
      { duration: REVEAL_DURATION, easing: Easing.out(Easing.cubic) },
      (finished) => {
        if (!finished || openToken.value !== token || closing.value === 1) return;
        runOnJS(setInteractive)(true);
        revealed.value = withTiming(1, { duration: CONTENT_DURATION });
      },
    );
  }, [
    closing,
    cx,
    cy,
    height,
    openToken,
    origin,
    radius,
    reducedMotion,
    revealed,
    visible,
    width,
  ]);

  const requestClose = useCallback(() => {
    if (session.current.closing) return;
    const token = openToken.value;
    session.current = { opening: false, closing: true };
    closing.value = 1;
    setInteractive(false);
    if (reducedMotion) {
      finishClose();
      return;
    }
    const shrinkDone = (finished?: boolean) => {
      if (finished && openToken.value === token) runOnJS(finishClose)();
    };
    const start = startRadius.current;
    if (revealed.value <= 0.05) {
      radius.value = withTiming(
        start,
        { duration: REVEAL_DURATION, easing: Easing.in(Easing.cubic) },
        shrinkDone,
      );
      return;
    }
    revealed.value = withTiming(0, { duration: 140 }, (finished) => {
      if (!finished || openToken.value !== token) return;
      radius.value = withTiming(
        start,
        { duration: REVEAL_DURATION, easing: Easing.in(Easing.cubic) },
        shrinkDone,
      );
    });
  }, [closing, finishClose, openToken, radius, reducedMotion, revealed]);

  const closeStyle = useAnimatedStyle(() => entrance(revealed.value, 0));
  const titleStyle = useAnimatedStyle(() => entrance(revealed.value, 0));
  const promptStyle = useAnimatedStyle(() => entrance(revealed.value, 1));
  const orbStyle = useAnimatedStyle(() => entrance(revealed.value, 2));
  const chipsStyle = useAnimatedStyle(() => entrance(revealed.value, 3));
  const micStyle = useAnimatedStyle(() => entrance(revealed.value, 4));

  return {
    cx,
    cy,
    radius,
    interactive,
    requestClose,
    closeStyle,
    titleStyle,
    promptStyle,
    orbStyle,
    chipsStyle,
    micStyle,
  };
}

type RevealProps = {
  cx: SharedValue<number>;
  cy: SharedValue<number>;
  radius: SharedValue<number>;
  width: number;
  height: number;
};

export function CircularReveal({ cx, cy, radius, width, height }: RevealProps) {
  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Mask mask={<Circle cx={cx} cy={cy} r={radius} color="white" />}>
        <Rect x={0} y={0} width={width} height={height} color={colors.primary} />
      </Mask>
    </Canvas>
  );
}
