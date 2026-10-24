import { Animated } from "react-native";

export const FEEDBACK_DURATION = 1500;
export const ASSISTANT_SHEET_GAP = 4;
export const ASSISTANT_HIDDEN_BOTTOM = 20;
export const ASSISTANT_BUTTON_GAP = 10;

export function larguraBotaoAssistente(textScale: number) {
  return Math.min(220, Math.max(132, 132 * textScale));
}

// O deslocamento horizontal acompanha o painel, então FluIA volta ao centro
// no mesmo spring que a sobe quando a gaveta abre.
export function deslocamentoLateralComPainel(
  translateY: Animated.Value,
  hiddenOffset: number,
  distance: number,
) {
  return translateY.interpolate({
    inputRange: [0, Math.max(hiddenOffset, 1)],
    outputRange: [0, distance],
    extrapolate: "clamp",
  });
}

export const TABLET_BREAKPOINT = 700;
export const MAX_CONTENT_WIDTH = 560;
