import { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";
import { Mic, X, Zap } from "lucide-react-native";

import { PressableScale } from "../../components";
import { useFluiVoice } from "../../hooks/useFluiVoice";
import type { FluiVoiceStatus } from "../../hooks/fluiVoice";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { colors, radius, spacing, typography } from "../../theme";
import { scaleFontSize } from "../../theme/appTheme";
import { useAppPreferences } from "../../context/PreferencesContext";
import { useAskLocation } from "../../context/AskLocationContext";
import { askPlaces } from "./askPlaces";
import type { ChargingStation } from "../../types";
import type { AssistantRevealOrigin } from "./coverRadius";
import { CircularReveal, useCircularReveal } from "./CircularReveal";
import { UnstableOrb } from "./orb/UnstableOrb";
import { VoiceWave } from "./orb/VoiceWave";

export type FluiAssistantSheetProps = {
  visible: boolean;
  stations: ChargingStation[];
  batteryPercent: number;
  vehicleRangeKm: number;
  now: Date;
  onClose: () => void;
  onDismiss?: () => void;
  onSelectStation: (stationId: string) => void;
  onStartRoute: (stationId: string) => void;
  origin: AssistantRevealOrigin | null;
};

export function FluiAssistantOverlay({
  visible,
  origin,
  onClose,
  onDismiss,
}: FluiAssistantSheetProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { fontScale } = useAppPreferences();
  const systemReducedMotion = useReducedMotion();
  const reducedMotion =
    systemReducedMotion ||
    (Platform.OS === "web" &&
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches);
  const styles = useMemo(() => createStyles(fontScale), [fontScale]);
  const disc = Math.min(250, Math.round(width * 0.56));
  const halo = Math.round(disc * 1.42);
  const waveWidth = Math.min(width - spacing.xl * 2, Math.round(disc * 2.4));
  const waveHeight = Math.round(disc * 0.72);
  const voice = useFluiVoice(reducedMotion);
  const location = useAskLocation();
  const [asking, setAsking] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const askingRef = useRef(false);
  const transcriptRef = useRef(voice.transcript);
  const listeningRef = useRef(voice.listening);
  const sendPending = useRef(false);
  const handledUtterance = useRef(0);
  const lastSent = useRef("");
  transcriptRef.current = voice.transcript;
  if (voice.listening) sendPending.current = true;

  const ask = async (text: string) => {
    if (!location.fix || askingRef.current) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    askingRef.current = true;
    setAsking(true);
    setReply(null);
    const result = await askPlaces({
      text: trimmed,
      latitude: location.fix.latitude,
      longitude: location.fix.longitude,
    });
    askingRef.current = false;
    setAsking(false);
    setReply(
      result.ok ? JSON.stringify(result.places, null, 2) : result.message,
    );
  };
  const reveal = useCircularReveal({
    visible,
    origin,
    width,
    height,
    reducedMotion,
    onClosed: onClose,
  });
  const shown = visible && origin !== null;
  const canAsk = location.ready && !asking;
  const askRef = useRef(ask);
  askRef.current = ask;

  useEffect(() => {
    if (!shown) voice.stop();
  }, [shown, voice.stop]);

  useEffect(() => {
    const wasListening = listeningRef.current;
    listeningRef.current = voice.listening;
    if (!wasListening && voice.listening) lastSent.current = "";
    if (voice.listening) sendPending.current = true;
    if (wasListening && !voice.listening) sendPending.current = true;

    const utterance = voice.settledUtterance;
    const text = voice.transcript.trim();
    if (!sendPending.current || !text || text === lastSent.current) return;

    // The browser keeps listening after the words are already on screen,
    // and it often reports the end before that text is stored.
    const timer = setTimeout(() => {
      const latest = transcriptRef.current.trim();
      if (!latest) return;
      if (latest === lastSent.current) return;
      if (utterance && utterance.id !== handledUtterance.current) {
        handledUtterance.current = utterance.id;
      }
      lastSent.current = latest;
      sendPending.current = false;
      void askRef.current(latest);
    }, voice.listening ? 700 : 300);

    return () => clearTimeout(timer);
  }, [voice.listening, voice.settledUtterance, voice.transcript]);

  return (
    <Modal
      transparent
      visible={shown}
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {
        voice.stop();
        reveal.requestClose();
      }}
      onDismiss={onDismiss}
    >
      <View style={StyleSheet.absoluteFill} accessibilityViewIsModal>
        <StatusBar barStyle="light-content" />
        <CircularReveal
          cx={reveal.cx}
          cy={reveal.cy}
          radius={reveal.radius}
          width={width}
          height={height}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.landing,
            {
              paddingTop: insets.top + spacing.xl,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
            },
          ]}
          pointerEvents={reveal.interactive ? "box-none" : "none"}
          accessibilityElementsHidden={!reveal.interactive}
          importantForAccessibility={
            reveal.interactive ? "auto" : "no-hide-descendants"
          }
          testID="fluia-conteudo"
        >
          <Animated.View
            style={[
              styles.closeWrap,
              { top: insets.top + spacing.xs },
              reveal.closeStyle,
            ]}
          >
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Fechar assistente"
              pressedScale={0.96}
              style={styles.closeButton}
              onPress={() => {
                voice.stop();
                reveal.requestClose();
              }}
            >
              <X size={22} color={colors.white} strokeWidth={2.2} />
            </PressableScale>
          </Animated.View>

          <View style={styles.hero} pointerEvents="box-none">
            <Animated.View style={reveal.titleStyle}>
              <View style={styles.titleRow}>
                <Text style={styles.title} accessibilityRole="header">
                  FluIA Assistant
                </Text>
                <Zap size={22} color={colors.white} strokeWidth={2.2} />
              </View>
            </Animated.View>
            <Animated.View style={reveal.promptStyle}>
              <ScrollView
                style={styles.promptScroll}
                contentContainerStyle={styles.promptContent}
              >
                <Text
                  style={styles.prompt}
                  accessibilityLiveRegion="polite"
                >
                  {promptCopy(
                    voice.unavailable,
                    voice.transcript,
                    voice.listening,
                    asking,
                    reply,
                  )}
                </Text>
              </ScrollView>
            </Animated.View>
            <Animated.View style={reveal.orbStyle}>
              <AssistantOrb
                disc={disc}
                halo={halo}
                waveWidth={waveWidth}
                waveHeight={waveHeight}
                samples={voice.samples}
                intensity={voice.intensity}
                listening={voice.listening}
                reducedMotion={reducedMotion}
              />
            </Animated.View>
            <Animated.View style={[styles.chips, reveal.chipsStyle]}>
              <PressableScale
                accessibilityRole="button"
                accessibilityState={{ disabled: !canAsk }}
                pressedScale={0.96}
                style={[styles.chip, canAsk ? null : styles.chipDisabled]}
                disabled={!canAsk}
                onPress={() => {
                  void ask("Lugares que carregam carros elétricos");
                }}
              >
                <Text style={styles.chipText}>Lugares que carregam carros elétricos</Text>
              </PressableScale>
              <PressableScale
                accessibilityRole="button"
                accessibilityState={{ disabled: !canAsk }}
                pressedScale={0.96}
                style={[styles.chip, canAsk ? null : styles.chipDisabled]}
                disabled={!canAsk}
                onPress={() => {
                  void ask("Cafeterias perto");
                }}
              >
                <Text style={styles.chipText}>Cafeterias perto</Text>
              </PressableScale>
              <PressableScale
                accessibilityRole="button"
                accessibilityState={{ disabled: !canAsk }}
                pressedScale={0.96}
                style={[styles.chip, canAsk ? null : styles.chipDisabled]}
                disabled={!canAsk}
                onPress={() => {
                  void ask("Postos de gasolina perto");
                }}
              >
                <Text style={styles.chipText}>Postos de gasolina perto</Text>
              </PressableScale>
            </Animated.View>
          </View>

          <Animated.View style={reveal.micStyle}>
            <View style={styles.micSlot}>
              <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
                <Circle cx={60} cy={60} r={60}>
                  <RadialGradient
                    c={vec(60, 60)}
                    r={60}
                    colors={[`${colors.white}8C`, `${colors.primary}00`]}
                  />
                </Circle>
              </Canvas>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={
                  voice.listening
                    ? "Parar de falar com a FluIA"
                    : "Falar com a FluIA"
                }
                accessibilityState={{
                  selected: voice.listening,
                  disabled: !canAsk && !voice.listening,
                }}
                pressedScale={0.96}
                disabled={!canAsk && !voice.listening}
                style={[
                  styles.micButton,
                  voice.listening ? styles.micButtonListening : null,
                  !canAsk && !voice.listening ? styles.micButtonDisabled : null,
                ]}
                onPress={() => {
                  if (!canAsk && !voice.listening) return;
                  if (voice.listening) voice.stop();
                  else voice.start();
                }}
              >
                <Mic size={26} color={colors.white} strokeWidth={2.2} />
              </PressableScale>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

function promptCopy(
  unavailable: FluiVoiceStatus | null,
  transcript: string,
  listening: boolean,
  asking: boolean,
  reply: string | null,
) {
  if (unavailable === "not-allowed") {
    return "O microfone precisa de permissão para a FluIA ouvir você.";
  }
  if (unavailable === "audio-capture") {
    return "Não consegui abrir o microfone.";
  }
  if (unavailable === "service-not-allowed" || unavailable === "unavailable") {
    return "O reconhecimento de voz não está disponível aqui.";
  }
  if (asking) return "Buscando…";
  if (reply) return reply;
  if (transcript) return transcript;
  if (listening) return "Ouvindo…";
  return "Precisa de ajuda?";
}

function AssistantOrb({
  disc,
  halo,
  waveWidth,
  waveHeight,
  samples,
  intensity,
  listening,
  reducedMotion,
}: {
  disc: number;
  halo: number;
  waveWidth: number;
  waveHeight: number;
  samples: ReturnType<typeof useFluiVoice>["samples"];
  intensity: number;
  listening: boolean;
  reducedMotion: boolean;
}) {
  const center = halo / 2;
  return (
    <View
      style={{
        width: waveWidth,
        height: halo,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: halo,
          height: halo,
        }}
      >
        <Canvas style={StyleSheet.absoluteFill}>
          <Circle cx={center} cy={center} r={center}>
            <RadialGradient
              c={vec(center, center)}
              r={center}
              colors={[colors.white, `${colors.white}73`, `${colors.primary}00`]}
            />
          </Circle>
        </Canvas>
      </View>
      <VoiceWave samples={samples} width={waveWidth} height={waveHeight} />
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: disc,
          height: disc,
        }}
      >
        <UnstableOrb
          intensity={intensity}
          motionDuration={listening && !reducedMotion ? 80 : 400}
          colorShift={0}
          background="#000000"
          colors={[colors.primary, "#E5CCFF", colors.black]}
          accessibilityLabel="FluIA"
          style={{ width: disc, height: disc }}
        />
      </View>
    </View>
  );
}

function createStyles(fontScale: number) {
  return StyleSheet.create({
    landing: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      alignItems: "center",
    },
    closeWrap: {
      position: "absolute",
      right: spacing.lg,
      zIndex: 2,
    },
    closeButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    hero: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.lg,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
    },
    title: {
      ...typography.title,
      color: colors.white,
      fontSize: scaleFontSize(typography.sizes.xl, fontScale),
      lineHeight: scaleFontSize(typography.lineHeights.xl, fontScale),
      textAlign: "center",
    },
    promptScroll: {
      maxHeight: 180,
      width: "100%",
    },
    promptContent: {
      alignItems: "center",
    },
    prompt: {
      ...typography.body,
      color: colors.white,
      fontSize: scaleFontSize(typography.sizes.lg, fontScale),
      lineHeight: scaleFontSize(typography.lineHeights.lg, fontScale),
      fontWeight: typography.weights.medium,
      textAlign: "center",
    },
    chipDisabled: {
      opacity: 0.4,
    },
    chips: {
      alignItems: "center",
      gap: spacing.sm,
    },
    chip: {
      maxWidth: "100%",
      minHeight: 44,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: `${colors.white}B8`,
      alignItems: "center",
      justifyContent: "center",
    },
    chipText: {
      ...typography.body,
      color: colors.white,
      fontSize: scaleFontSize(typography.sizes.md, fontScale),
      lineHeight: scaleFontSize(typography.lineHeights.md, fontScale),
      fontWeight: typography.weights.medium,
      textAlign: "center",
    },
    micSlot: {
      width: 120,
      height: 120,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    micButton: {
      width: 68,
      height: 68,
      borderRadius: 34,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: `${colors.white}29`,
    },
    micButtonListening: {
      backgroundColor: `${colors.white}55`,
    },
    micButtonDisabled: {
      opacity: 0.4,
    },
  });
}

export default FluiAssistantOverlay;
