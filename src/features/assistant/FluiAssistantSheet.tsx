import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Armchair,
  BatteryLow,
  BatteryMedium,
  ChevronRight,
  Coffee,
  MapPin,
  Plug,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react-native";

import * as Speech from "expo-speech";
import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { AppTheme } from "../../theme/appTheme";
import { scaleFontSize } from "../../theme/appTheme";
import type { ChargingStation } from "../../types";
import {
  formatAssistantDistance,
  recommendStations,
  type FluiAssistantIntent,
} from "./fluiAssistant";
import { funcionalidadesExperimentais } from "../../config/funcionalidadesExperimentais";
import { identificacaoDados } from "../../data/identificacaoDados";
import { EnergyOrb } from "./EnergyOrb";
import { answerMessage, RECOMMENDATION_DISCLAIMER } from "./chatEngine";
import { summarizeSuggestion } from "./assistantPresentation";

import {
  FLUIA_STATE_LABELS,
  tempoDeExibicaoFluia,
  type FluiaState,
} from "./fluiaState";

type Props = {
  visible: boolean;
  stations: ChargingStation[];
  batteryPercent: number;
  vehicleRangeKm: number;
  now: Date;
  onClose: () => void;
  onDismiss?: () => void;
  onSelectStation: (stationId: string) => void;
  onStartRoute: (stationId: string) => void;
};

const ASSISTANT_THINKING_DURATION = 1800;

type ChatMessage = {
  id: number;
  from: "user" | "flui";
  text: string;
  state?: "respondendo" | "aviso" | "alerta";
  stationId?: string;
  summary?: string;
};

const options: {
  id: FluiAssistantIntent;
  label: string;
  Icon: typeof BatteryLow;
}[] = [
  { id: "lowBattery", label: "Tenho pouca bateria", Icon: BatteryLow },
  { id: "fastCharge", label: "Quero carregar rápido", Icon: Zap },
  { id: "avoidQueues", label: "Quero evitar filas", Icon: Users },
  {
    id: "coffeeAndRestroom",
    label: "Preciso de banheiro e café",
    Icon: Coffee,
  },
  {
    id: "comfortableWait",
    label: "Quero esperar com conforto",
    Icon: Armchair,
  },
];

export function FluiAssistantSheet({
  visible,
  stations,
  batteryPercent,
  vehicleRangeKm,
  now,
  onClose,
  onDismiss,
  onSelectStation,
  onStartRoute,
}: Props) {
  const { theme, fontScale, appearanceMode, highContrast, demoOrigin, userPreferences } = useAppPreferences();
  const reduceMotionEnabled = useReducedMotion();
  const styles = useMemo(
    () => createStyles(theme, fontScale, appearanceMode === "dark", highContrast),
    [appearanceMode, fontScale, highContrast, theme],
  );
  const [selectedIntent, setSelectedIntent] =
    useState<FluiAssistantIntent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingProgress = useRef(new Animated.Value(0)).current;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);
  const [isChatThinking, setIsChatThinking] = useState(false);
  const chatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextMessageId = useRef(0);
  const chatScrollRef = useRef<ScrollView>(null);

  const stateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [fluiaState, setFluiaState] = useState<FluiaState>("repouso");
  const displayedState: FluiaState = isAnalyzing ? "pensando" : fluiaState;

  const recommendation = useMemo(() => {
    if (!funcionalidadesExperimentais.fluia || !selectedIntent || isAnalyzing) return null;
    return recommendStations({
      stations,
      intent: selectedIntent,
      vehicleRangeKm,
      batteryPercent,
      now,
    });
  }, [
    batteryPercent,
    isAnalyzing,
    selectedIntent,
    stations,
    vehicleRangeKm,
    now,
  ]);

  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
      if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
      if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    thinkingProgress.stopAnimation();

    if (!isAnalyzing || reduceMotionEnabled) {
      thinkingProgress.setValue(0);
      return;
    }

    const thinkingLoop = Animated.loop(
      Animated.timing(thinkingProgress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    thinkingLoop.start();

    return () => {
      thinkingLoop.stop();
      thinkingProgress.setValue(0);
    };
  }, [isAnalyzing, reduceMotionEnabled, thinkingProgress]);

  const markTyping = () => {
    if (stateTimeoutRef.current) {
      clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }
    setFluiaState((current) =>
      current === "pensando" ? current : "digitando",
    );
  };

  const resetConversation = () => {
    setMessages([]);
    setDraft("");
    setIsChatThinking(false);
    setSelectedIntent(null);
    setIsAnalyzing(false);
    setShowExplanation(false);
    setExpandedMessageId(null);
  };

  const closeAssistant = () => {
    Speech.stop();
    if (stateTimeoutRef.current) {
      clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }
    setFluiaState("repouso");
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    if (chatTimeoutRef.current) {
      clearTimeout(chatTimeoutRef.current);
      chatTimeoutRef.current = null;
    }
    Keyboard.dismiss();
    // No iOS, preserve o conteúdo durante a animação nativa de saída.
    if (Platform.OS !== "ios") resetConversation();
    onClose();
  };

  const chooseIntent = (intent: FluiAssistantIntent) => {
    setShowExplanation(false);
    setSelectedIntent(intent);
    setIsAnalyzing(true);
    analysisTimeoutRef.current = setTimeout(
      () => {
        setIsAnalyzing(false);
        analysisTimeoutRef.current = null;
      },
      reduceMotionEnabled ? 0 : ASSISTANT_THINKING_DURATION,
    );
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || isChatThinking) return;
    if (stateTimeoutRef.current) {
      clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }
    setFluiaState("pensando");

    setDraft("");
    setMessages((current) => [
      ...current,
      { id: nextMessageId.current++, from: "user", text },
    ]);
    setIsChatThinking(true);

    chatTimeoutRef.current = setTimeout(
      () => {
        const response = answerMessage(text, {
          stations,
          vehicleRangeKm,
          batteryPercent,
          now,
        });
        setMessages((current) => [
          ...current,
          {
            id: nextMessageId.current++,
            from: "flui",
            text: response.text,
            state: response.state,
            stationId: response.recommendation?.primary.id,
            summary: response.recommendation ? summarizeSuggestion(response.recommendation) : undefined,
          },
        ]);
        if (voiceEnabled) {
          Speech.stop();
          Speech.speak(response.text, { language: "pt-BR" });
        }
        const nextState: FluiaState = response.state;
        setFluiaState(nextState);
        const duration = tempoDeExibicaoFluia(nextState);
        if (duration !== null) {
          stateTimeoutRef.current = setTimeout(() => {
            setFluiaState((current) =>
              current === nextState ? "repouso" : current,
            );
            stateTimeoutRef.current = null;
          }, duration);
        }
        setIsChatThinking(false);
        chatTimeoutRef.current = null;
      },
      reduceMotionEnabled ? 0 : ASSISTANT_THINKING_DURATION,
    );
  };

  const scrollToLatestMessage = () => {
    if (messages.length > 0) {
      chatScrollRef.current?.scrollToEnd({ animated: !reduceMotionEnabled });
    }
  };

  const chooseStation = (stationId: string) => {
    closeAssistant();
    onSelectStation(stationId);
  };

  const startRoute = (stationId: string) => {
    closeAssistant();
    onStartRoute(stationId);
  };

  const toggleVoice = () => {
    if (voiceEnabled) Speech.stop();
    setVoiceEnabled((current) => !current);
  };

  if (!funcionalidadesExperimentais.fluia) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType={reduceMotionEnabled ? "none" : "slide"}
      statusBarTranslucent
      onRequestClose={closeAssistant}
      onDismiss={() => {
        resetConversation();
        onDismiss?.();
      }}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        accessibilityViewIsModal
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar assistente FluIA"
          style={StyleSheet.absoluteFill}
          onPress={closeAssistant}
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <EnergyOrb state={displayedState} reducedMotion={reduceMotionEnabled} active={visible} />
            <View style={styles.headerText}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>FluIA</Text>
                <Text
                  style={styles.stateText}
                  numberOfLines={1}
                  accessibilityLiveRegion="polite"
                  accessibilityLabel={`Estado da FluIA: ${FLUIA_STATE_LABELS[displayedState]}`}
                >
                  {FLUIA_STATE_LABELS[displayedState]}
                </Text>
              </View>
            </View>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={
                voiceEnabled ? "Desativar voz da FluIA" : "Ativar voz da FluIA"
              }
              style={styles.closeButton}
              onPress={toggleVoice}
            >
              {voiceEnabled ? (
                <Volume2 size={22} color={theme.primary} strokeWidth={2.2} />
              ) : (
                <VolumeX size={22} color={theme.textMuted} strokeWidth={2.2} />
              )}
            </PressableScale>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Fechar assistente"
              style={styles.closeButton}
              onPress={closeAssistant}
            >
              <X size={22} color={theme.textMuted} strokeWidth={2.2} />
            </PressableScale>
          </View>

          <ScrollView
            ref={chatScrollRef}
            testID="fluia-conteudo"
            style={styles.chatMessages}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToLatestMessage}
            onLayout={scrollToLatestMessage}
          >
            <Text style={styles.subtitle}>
              {selectedIntent
                ? "Recomendação simulada com os dados do protótipo."
                : identificacaoDados.fluia.aviso}
            </Text>
            {isAnalyzing ? (
              <View
                style={styles.analyzingCard}
                accessibilityRole="progressbar"
                accessibilityLiveRegion="polite"
              >
                <Animated.View
                  style={[
                    styles.analyzingIcon,
                    !reduceMotionEnabled && {
                      opacity: thinkingProgress.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.72, 1, 0.72],
                      }),
                      transform: [
                        {
                          scale: thinkingProgress.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 1.12, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Sparkles size={28} color={theme.primary} strokeWidth={2.2} />
                </Animated.View>
                <Text style={styles.analyzingTitle}>Analisando suas opções</Text>
                <View style={styles.thinkingDots} accessibilityElementsHidden>
                  {[
                    [0, 0.12, 0.25, 0.38, 1],
                    [0, 0.3, 0.43, 0.56, 1],
                    [0, 0.48, 0.61, 0.74, 1],
                  ].map((inputRange, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.thinkingDot,
                        !reduceMotionEnabled && {
                          opacity: thinkingProgress.interpolate({
                            inputRange,
                            outputRange: [0.35, 0.35, 1, 0.35, 0.35],
                          }),
                          transform: [
                            {
                              translateY: thinkingProgress.interpolate({
                                inputRange,
                                outputRange: [1, 1, -3, 1, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.analyzingText}>
                  Comparando alcance, disponibilidade, potência e conforto.
                </Text>
              </View>
            ) : recommendation ? (
              <View style={[styles.resultScroll, styles.resultContent]}>
                <View
                  style={styles.recommendationCard}
                  accessibilityLiveRegion="polite"
                >
                  <View style={styles.bestChoiceBadge}>
                    <Text style={styles.bestChoiceText}>
                      Sugestão demonstrativa
                    </Text>
                  </View>
                  <Text style={styles.stationName}>
                    {recommendation.primary.name}
                  </Text>
                  <Text style={styles.stationAddress}>
                    {recommendation.primary.address}
                  </Text>

                  <View style={styles.metricsGrid}>
                    <Metric
                      styles={styles}
                      icon={BatteryMedium}
                      label={`Chegada ≈${recommendation.arrivalBatteryPercent}%`}
                      color={theme.primary}
                    />
                    <Metric
                      styles={styles}
                      icon={Zap}
                      label={`${recommendation.powerKw} kW`}
                      color={theme.primary}
                    />
                    <Metric
                      styles={styles}
                      icon={Plug}
                      label={`${recommendation.availableChargers} livres`}
                      color={theme.primary}
                    />
                    <Metric
                      styles={styles}
                      icon={MapPin}
                      label={formatAssistantDistance(
                        recommendation.primary.distanceKm,
                      )}
                      color={theme.primary}
                    />
                  </View>

                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={`Iniciar rota para ${recommendation.primary.name}`}
                  accessibilityHint="Abre a escolha de localização e a confirmação de funcionamento antes da navegação."
                  style={styles.primaryButton}
                  onPress={() => startRoute(recommendation.primary.id)}
                >
                  <Text style={styles.primaryButtonText}>Iniciar rota</Text>
                </PressableScale>
                  <Text style={styles.explanationText}>
                    Em linha reta · reserva de 5%. Confirme funcionamento e compatibilidade.
                  </Text>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityState={{ expanded: showExplanation }}
                    style={styles.secondaryButton}
                    onPress={() => setShowExplanation((current) => !current)}
                  >
                    <Text style={styles.secondaryButtonText}>{showExplanation ? "Resumir explicação" : "Por que essa escolha?"}</Text>
                  </PressableScale>
                  {showExplanation ? <Text style={styles.explanationText}>
                    {recommendation.explanation}
                    {"\n"}
                    {userPreferences.vehicleName} · origem demonstrativa: {demoOrigin.nome}.
                    {"\n"}
                    {RECOMMENDATION_DISCLAIMER}
                  </Text> : null}
                </View>

                {recommendation.backup ? (
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir Plano B, ${recommendation.backup.name}`}
                    accessibilityHint="Abre a ficha detalhada da estação alternativa."
                    style={styles.backupCard}
                    onPress={() => chooseStation(recommendation.backup!.id)}
                  >
                    <View style={styles.backupIcon}>
                      <MapPin size={22} color={theme.primary} strokeWidth={2.3} />
                    </View>
                    <View style={styles.backupText}>
                      <Text style={styles.backupTitle}>Plano B</Text>
                      <Text style={styles.backupDescription} numberOfLines={1}>
                        {recommendation.backup.name} ·{" "}
                        {formatAssistantDistance(
                          recommendation.backup.distanceKm,
                        )}
                      </Text>
                    </View>
                    <ChevronRight
                      size={22}
                      color={theme.textMuted}
                      strokeWidth={2.2}
                    />
                  </PressableScale>
                ) : null}

                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel="Escolher outra necessidade"
                  style={styles.secondaryButton}
                  onPress={() => setSelectedIntent(null)}
                >
                  <Text style={styles.secondaryButtonText}>
                    Escolher outra necessidade
                  </Text>
                </PressableScale>
              </View>
            ) : selectedIntent ? (
              <View style={styles.analyzingCard}>
                <Text style={styles.analyzingTitle}>
                  Nenhuma opção viável confirmada
                </Text>
                <Text style={styles.analyzingText}>
                  Os dados disponíveis não confirmam uma opção com alcance,
                  horário, carregador livre e comodidades solicitadas. Revise os
                  filtros e os dados informados. Não há indicação segura neste
                  cenário.
                </Text>
              </View>
            ) : messages.length === 0 ? (
              <View style={[styles.optionsScroll, styles.optionsContent]}>
                {options.map(({ id, label, Icon }) => (
                  <PressableScale
                    key={id}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityHint="Gera uma recomendação simulada com os dados do mapa."
                    style={styles.optionCard}
                    onPress={() => chooseIntent(id)}
                  >
                    <View style={styles.optionIcon}>
                      <Icon size={22} color={theme.primary} strokeWidth={2.3} />
                    </View>
                    <Text style={styles.optionText}>{label}</Text>
                    <ChevronRight
                      size={22}
                      color={theme.textMuted}
                      strokeWidth={2.2}
                    />
                  </PressableScale>
                ))}
              </View>
            ) : null}
            <View style={styles.chatBox}>
              <Text style={styles.subtitle}>
                {userPreferences.vehicleName} · origem demonstrativa: {demoOrigin.nome}.
              </Text>
              <View style={styles.messagesContent}>
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={
                      message.from === "user"
                        ? styles.userBubble
                        : styles.fluiBubble
                    }
                  >
                    <Text style={styles.bubbleText}>{message.summary && expandedMessageId !== message.id ? message.summary : message.text}</Text>
                    {message.summary ? (
                      <PressableScale accessibilityRole="button" accessibilityState={{ expanded: expandedMessageId === message.id }} style={styles.chatButton} onPress={() => setExpandedMessageId((current) => current === message.id ? null : message.id)}>
                        <Text style={styles.chatButtonText}>{expandedMessageId === message.id ? "Resumir resposta" : "Ver explicação completa"}</Text>
                      </PressableScale>
                    ) : null}
                    {message.stationId ? (
                      <PressableScale
                        accessibilityRole="button"
                        accessibilityLabel="Iniciar rota para o ponto recomendado"
                        style={styles.chatButton}
                        onPress={() => startRoute(message.stationId!)}
                      >
                        <Text style={styles.chatButtonText}>
                          Iniciar rota
                        </Text>
                      </PressableScale>
                    ) : null}
                  </View>
                ))}
                {isChatThinking ? (
                  <Text style={styles.thinkingText}>FluIA está pensando...</Text>
                ) : null}
              </View>
            </View>
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              value={draft}
              onChangeText={(text) => { setDraft(text); markTyping(); }}
              onFocus={markTyping}
              onBlur={() => setFluiaState((current) => current === "digitando" ? "repouso" : current)}
              onSubmitEditing={sendMessage}
              placeholder="Pergunte algo à FluIA"
              placeholderTextColor={theme.textMuted}
              accessibilityLabel="Mensagem para a FluIA"
              returnKeyType="send"
              style={styles.input}
            />
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Enviar mensagem"
              style={styles.sendButton}
              onPress={sendMessage}
            >
              <Text style={styles.sendButtonText}>Enviar</Text>
            </PressableScale>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Metric({
  styles,
  icon: Icon,
  label,
  color,
}: {
  styles: ReturnType<typeof createStyles>;
  icon: typeof BatteryMedium;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Icon size={19} color={color} strokeWidth={2.3} />
      <Text style={styles.metricText}>{label}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme, fontScale: number, isDarkMode: boolean, highContrast: boolean) {
  const font = (size: number) => scaleFontSize(size, fontScale);
  const purple = highContrast
    ? { sheet: theme.background, surface: theme.surface, soft: theme.primarySoft, border: theme.border }
    : isDarkMode
    ? {
        sheet: "#1B1028",
        surface: "#28183A",
        soft: "#362149",
        border: "#54386D",
      }
    : {
        sheet: "#F8F2FF",
        surface: "#FFFDFE",
        soft: "#EFE3FF",
        border: "#DCC5F5",
      };

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(7, 12, 18, 0.42)",
    },
    sheet: {
      height: "88%",
      maxHeight: "90%",
      width: "100%",
      maxWidth: 560,
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 34,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: purple.sheet,
      borderTopWidth: 1,
      borderColor: purple.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.16,
      shadowRadius: 22,
      elevation: 16,
    },
    handle: {
      width: 42,
      height: 4,
      marginBottom: 16,
      alignSelf: "center",
      borderRadius: 2,
      backgroundColor: purple.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    headerText: { flex: 1, paddingTop: 1 },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    stateText: {
      color: theme.textMuted,
      fontSize: font(11),
      fontWeight: "700",
      flexShrink: 1,
    },
    title: {
      color: theme.text,
      fontSize: font(21),
      lineHeight: font(26),
      fontWeight: "900",
      letterSpacing: -0.35,
    },
    subtitle: {
      marginTop: 3,
      color: theme.textMuted,
      fontSize: font(13),
      lineHeight: font(18),
      fontWeight: "600",
    },
    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    optionsScroll: { marginTop: 18 },
    optionsContent: { gap: 10, paddingBottom: 4 },
    optionCard: {
      minHeight: 58,
      paddingHorizontal: 12,
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.soft,
    },
    optionText: {
      flex: 1,
      color: theme.text,
      fontSize: font(15),
      lineHeight: font(20),
      fontWeight: "600",
    },
    analyzingCard: {
      minHeight: 210,
      marginTop: 22,
      paddingHorizontal: 24,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    analyzingIcon: {
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.soft,
    },
    analyzingTitle: {
      marginTop: 12,
      color: theme.text,
      fontSize: font(17),
      lineHeight: font(22),
      fontWeight: "600",
      textAlign: "center",
    },
    thinkingDots: {
      height: 10,
      marginTop: 9,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    thinkingDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    analyzingText: {
      marginTop: 8,
      color: theme.textMuted,
      fontSize: font(13),
      lineHeight: font(18),
      fontWeight: "600",
      textAlign: "center",
    },
    resultScroll: { marginTop: 18 },
    resultContent: { paddingBottom: 6 },
    recommendationCard: {
      padding: 16,
      borderRadius: 22,
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    bestChoiceBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 14,
      backgroundColor: theme.successSoft,
    },
    bestChoiceText: {
      color: theme.success,
      fontSize: font(12),
      lineHeight: font(16),
      fontWeight: "900",
    },
    stationName: {
      marginTop: 12,
      color: theme.text,
      fontSize: font(23),
      lineHeight: font(28),
      fontWeight: "600",
      letterSpacing: -0.45,
    },
    stationAddress: {
      marginTop: 3,
      color: theme.textMuted,
      fontSize: font(13),
      lineHeight: font(18),
      fontWeight: "600",
    },
    metricsGrid: {
      marginTop: 15,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    metricCard: {
      width: "48%",
      minHeight: 48,
      paddingHorizontal: 10,
      borderRadius: 15,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: purple.soft,
    },
    metricText: {
      flexShrink: 1,
      color: theme.text,
      fontSize: font(13),
      lineHeight: font(17),
      fontWeight: "800",
    },
    explanationTitle: {
      marginTop: 16,
      color: theme.text,
      fontSize: font(15),
      lineHeight: font(20),
      fontWeight: "900",
    },
    explanationText: {
      marginTop: 4,
      color: theme.textMuted,
      fontSize: font(13),
      lineHeight: font(19),
      fontWeight: "600",
    },
    backupCard: {
      minHeight: 66,
      marginTop: 12,
      paddingHorizontal: 12,
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      backgroundColor: purple.soft,
      borderWidth: 1,
      borderColor: purple.border,
    },
    backupIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.surface,
    },
    backupText: { flex: 1 },
    backupTitle: {
      color: theme.text,
      fontSize: font(14),
      lineHeight: font(18),
      fontWeight: "900",
    },
    backupDescription: {
      marginTop: 2,
      color: theme.textMuted,
      fontSize: font(12),
      lineHeight: font(17),
      fontWeight: "600",
    },
    primaryButton: {
      minHeight: 54,
      marginTop: 14,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    primaryButtonText: {
      color: theme.onPrimary,
      fontSize: font(15),
      lineHeight: font(20),
      fontWeight: "900",
    },
    secondaryButton: {
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonText: {
      color: theme.primary,
      fontSize: font(13),
      lineHeight: font(18),
      fontWeight: "800",
    },
    chatBox: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderColor: purple.border,
    },
    chatMessages: { flex: 1, minHeight: 0 },
    bodyContent: { paddingBottom: 12 },
    messagesContent: { paddingTop: 12 },
    userBubble: {
      alignSelf: "flex-end",
      maxWidth: "80%",
      marginBottom: 8,
      padding: 10,
      borderRadius: 16,
      backgroundColor: purple.soft,
    },
    fluiBubble: {
      alignSelf: "flex-start",
      maxWidth: "85%",
      marginBottom: 8,
      padding: 10,
      borderRadius: 16,
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    bubbleText: {
      color: theme.text,
      fontSize: font(14),
      lineHeight: font(19),
      fontWeight: "600",
    },
    chatButton: {
      marginTop: 8,
      minHeight: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    chatButtonText: {
      color: theme.onPrimary,
      fontSize: font(13),
      fontWeight: "900",
    },
    thinkingText: {
      marginBottom: 8,
      color: theme.textMuted,
      fontSize: font(13),
      fontWeight: "600",
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    input: {
      flex: 1,
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: purple.border,
      backgroundColor: purple.surface,
      color: theme.text,
      fontSize: font(14),
    },
    sendButton: {
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    sendButtonText: {
      color: theme.onPrimary,
      fontSize: font(13),
      fontWeight: "900",
    },
  });
}
