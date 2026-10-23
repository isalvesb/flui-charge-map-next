import { ConnectionNotice } from "../../components/ConnectionNotice";
import { useCallback, useRef, useState, type RefObject } from "react";
import {
  Animated,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href } from "expo-router";
import {
  Clock3,
  Crosshair,
  Plug,
  Toilet,
  X,
  Zap,
} from "lucide-react-native";

import { calcularAutonomiaAtualKm } from "../../utils/autonomia";
import {
  LoadingOverlay,
  PressableScale,
  ScreenTransition,
} from "../../components";
import baseStyles, { colors as baseColors } from "./HomeMapScreen.styles";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useMapArea, useMapContext } from "../../context/MapContext";
import { useAppPreferences } from "../../context/PreferencesContext";
import { useSearchContext } from "../../context/SearchContext";
import { funcionalidadesExperimentais } from "../../config/funcionalidadesExperimentais";
import { FluiAssistantSheet } from "../assistant/FluiAssistantSheet";
import type { AssistantRevealOrigin } from "../assistant/coverRadius";
import { FluiAiIcon } from "../assistant/FluiAiIcon";
import {
  ASSISTANT_HIDDEN_BOTTOM,
  ASSISTANT_SHEET_GAP,
  MAX_CONTENT_WIDTH,
  TABLET_BREAKPOINT,
} from "./HomeMapScreen.constants";
import {
  PASSO_AJUSTE_BATERIA,
  obterCorDeBateriaAtual,
  obterIconeDeBateriaAtual,
} from "./header/FluiHeader.utils";
import { FluiHeader } from "./header/FluiHeader";
import { MapCanvas } from "./canvas/MapCanvas";
import { MapControls } from "./controls/MapControls";
import { MapArea } from "./map/MapArea";
import { PointsSheet } from "./points/PointsSheet";
import { Search } from "./search/Search";

function assistantButtonSide(
  horizontal: boolean,
  assistantWidth: number,
): Pick<ViewStyle, "left" | "right" | "marginLeft"> {
  if (horizontal) {
    return { right: 16, left: undefined, marginLeft: 0 };
  }

  return { right: undefined, left: "50%", marginLeft: -assistantWidth / 2 };
}

function assistantButtonEdge(
  horizontal: boolean,
  compactControls: boolean,
  sheetHeight: number,
): Pick<ViewStyle, "top" | "bottom"> {
  if (!compactControls) {
    return { top: undefined, bottom: sheetHeight + ASSISTANT_SHEET_GAP };
  }

  if (horizontal) {
    return { top: undefined, bottom: 12 };
  }

  return { top: 74, bottom: undefined };
}

function assistantButtonPosition({
  horizontal,
  compactControls,
  assistantWidth,
  sheetHeight,
  translateY,
}: {
  horizontal: boolean;
  compactControls: boolean;
  assistantWidth: number;
  sheetHeight: number;
  translateY: Animated.AnimatedInterpolation<number>;
}) {
  return {
    ...assistantButtonSide(horizontal, assistantWidth),
    ...assistantButtonEdge(horizontal, compactControls, sheetHeight),
    transform: [{ translateY: compactControls ? 0 : translateY }],
  };
}

function MapAssistantButton({
  buttonRef,
  onPress,
}: {
  buttonRef: RefObject<View | null>;
  onPress: () => void;
}) {
  const { styles, colors, fontScale } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const { fontScale: escalaFonteSistema } = useWindowDimensions();
  const {
    viewport: {
      horizontal,
      compactControls,
      sheetHeight,
      translateY,
      collapsedOffset,
      hiddenOffset,
    },
  } = useMapArea();
  const assistantWidth = Math.min(
    220,
    Math.max(132, 132 * fontScale * escalaFonteSistema),
  );
  const deslocamentoVerticalBotaoAssistente = translateY.interpolate({
    inputRange: [
      0,
      Math.max(collapsedOffset, 1),
      Math.max(hiddenOffset, 2),
    ],
    outputRange: [
      0,
      collapsedOffset,
      Math.max(sheetHeight + ASSISTANT_SHEET_GAP - ASSISTANT_HIDDEN_BOTTOM, 0),
    ],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.fluiAssistantFloating,
        assistantButtonPosition({
          horizontal,
          compactControls,
          assistantWidth,
          sheetHeight,
          translateY: deslocamentoVerticalBotaoAssistente,
        }),
      ]}
    >
      <Animated.View
        style={[styles.fluiAssistantAnimatedButton, { width: assistantWidth }]}
      >
        <View ref={buttonRef} collapsable={false} style={{ width: assistantWidth }}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Abrir assistente Flui IA"
            accessibilityHint="Abre opções de recomendação simulada para encontrar um ponto de recarga."
            pressedScale={0.95}
            style={styles.fluiAssistantButton}
            onPress={onPress}
          >
            <FluiAiIcon color={colors.white} size={21} />
            <Text style={styles.fluiAssistantButtonText}>FluIA</Text>
          </PressableScale>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default function HomeMapScreen() {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const { updateBatteryPercent } = useAppPreferences();
  const {
    state: {
      visibleStations,
      now,
      batteryPercent,
      vehicleRangeKm,
      isOpeningDetails,
      feedbackMessage,
    },
    actions: { openStation, adjustSearch },
  } = useMapContext();
  const {
    meta: { inputRef: searchInputRef },
  } = useSearchContext();
  const reduceMotionEnabled = useReducedMotion();
  const [seletorBateriaAberto, setSeletorBateriaAberto] = useState(false);
  const [bateriaEmEdicao, setBateriaEmEdicao] = useState(batteryPercent);
  const { width: larguraJanela, height: alturaJanela } = useWindowDimensions();
  const isTelaLarga = larguraJanela >= TABLET_BREAKPOINT;
  const margemHorizontalConteudo = isTelaLarga
    ? Math.max(16, (larguraJanela - MAX_CONTENT_WIDTH) / 2)
    : 20;
  const assistenteBotaoRef = useRef<View>(null);
  const [assistenteFluiAberto, setAssistenteFluiAberto] = useState(false);
  const [origemAssistente, setOrigemAssistente] =
    useState<AssistantRevealOrigin | null>(null);

  const IconeBateriaEmEdicao = obterIconeDeBateriaAtual(bateriaEmEdicao);
  const corBateriaEmEdicao = obterCorDeBateriaAtual(bateriaEmEdicao, colors);
  const autonomiaEmEdicaoKm = Math.round(
    calcularAutonomiaAtualKm(vehicleRangeKm, bateriaEmEdicao),
  );

  const abrirSeletorDeBateria = useCallback(() => {
    setBateriaEmEdicao(batteryPercent);
    setSeletorBateriaAberto(true);
  }, [batteryPercent]);

  const cancelarEdicaoDeBateria = useCallback(() => {
    setBateriaEmEdicao(batteryPercent);
    setSeletorBateriaAberto(false);
  }, [batteryPercent]);

  const ajustarNivelDeBateria = (variacao: number) => {
    setBateriaEmEdicao((percentualAtual) =>
      Math.max(0, Math.min(100, percentualAtual + variacao)),
    );
  };

  const definirNivelDeBateria = async () => {
    await updateBatteryPercent(bateriaEmEdicao);

    setSeletorBateriaAberto(false);
  };

  const openProfile = () => {
    router.push("/profile" as Href);
  };

  const abrirAssistente = () => {
    searchInputRef.current?.blur();
    Keyboard.dismiss();
    const button = assistenteBotaoRef.current;
    if (!button) {
      setOrigemAssistente({
        x: larguraJanela / 2,
        y: alturaJanela - 80,
        height: 52,
      });
      setAssistenteFluiAberto(true);
      return;
    }
    button.measureInWindow((x, y, width, height) => {
      if (width === 0 || height === 0) {
        setOrigemAssistente({
          x: larguraJanela / 2,
          y: alturaJanela - 80,
          height: 52,
        });
      } else {
        setOrigemAssistente({
          x: x + width / 2,
          y: y + height / 2,
          height,
        });
      }
      setAssistenteFluiAberto(true);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScreenTransition style={styles.screen}>
        <View
          style={[
            styles.topArea,
            { paddingHorizontal: margemHorizontalConteudo },
          ]}
        >
          <FluiHeader>
            <FluiHeader.Actions>
              <FluiHeader.Vehicle onPress={abrirSeletorDeBateria} />
              <FluiHeader.Profile onPress={openProfile} />
            </FluiHeader.Actions>
          </FluiHeader>

          <Search.Bar>
            <Search.Field />
            <Search.FiltersButton onPress={adjustSearch} />
          </Search.Bar>
          <Search.Filters
            filters={[
              { id: "openNow", label: "Aberto agora", icon: Clock3 },
              { id: "ccs2", label: "CCS2", icon: Plug },
              { id: "fast", label: "Rápido", icon: Zap },
              { id: "restroom", label: "Banheiro", icon: Toilet },
            ]}
          />
        </View>

        <ConnectionNotice />
        <MapArea>
          <MapCanvas />
          <MapControls />
          {funcionalidadesExperimentais.fluia ? (
            <MapAssistantButton
              buttonRef={assistenteBotaoRef}
              onPress={abrirAssistente}
            />
          ) : null}
          <PointsSheet />
        </MapArea>

        {funcionalidadesExperimentais.fluia ? (
          <FluiAssistantSheet
            visible={assistenteFluiAberto}
            stations={visibleStations.map((item) => item.station)}
            now={now}
            batteryPercent={batteryPercent}
            vehicleRangeKm={vehicleRangeKm}
            origin={origemAssistente}
            onClose={() => setAssistenteFluiAberto(false)}
            onSelectStation={openStation}
            onStartRoute={(stationId) => openStation(stationId, true)}
          />
        ) : null}

        <LoadingOverlay
          visible={isOpeningDetails}
          message="Abrindo detalhes..."
        />

        {feedbackMessage ? (
          <View pointerEvents="none" style={styles.feedbackToastOverlay}>
            <View style={styles.feedbackToastCard}>
              <Crosshair size={18} color={colors.primary} strokeWidth={2.4} />
              <Text style={styles.feedbackToastText}>{feedbackMessage}</Text>
            </View>
          </View>
        ) : null}

        {seletorBateriaAberto ? (
          <Modal
            transparent
            visible
            animationType={reduceMotionEnabled ? "none" : "slide"}
            onRequestClose={cancelarEdicaoDeBateria}
          >
            <View style={styles.batterySheetOverlay} accessibilityViewIsModal>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar seletor de bateria"
                style={styles.batterySheetBackdrop}
                onPress={cancelarEdicaoDeBateria}
              />

              <ScrollView
                style={[
                  styles.batterySheetCard,
                  { maxHeight: alturaJanela * 0.9 },
                ]}
                contentContainerStyle={styles.batterySheetContent}
              >
                <View style={styles.batterySheetHeaderRow}>
                  <View
                    style={[
                      styles.batterySheetPreviewIcon,
                      { backgroundColor: corBateriaEmEdicao + "1F" },
                    ]}
                  >
                    <IconeBateriaEmEdicao
                      size={26}
                      color={corBateriaEmEdicao}
                      strokeWidth={2.4}
                    />
                  </View>

                  <View style={styles.batterySheetHeaderText}>
                    <Text style={styles.batterySheetTitle}>
                      Bateria para estimativa
                    </Text>
                    <Text style={styles.batterySheetSubtitle}>
                      ≈{autonomiaEmEdicaoKm} km estimados · sem telemetria
                    </Text>
                  </View>

                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel="Fechar sem definir a carga"
                    accessibilityHint="Descarta a carga selecionada e fecha este painel."
                    pressedScale={0.92}
                    style={styles.batterySheetCloseButton}
                    onPress={cancelarEdicaoDeBateria}
                  >
                    <X size={21} color={colors.textMuted} strokeWidth={2.3} />
                  </PressableScale>
                </View>

                <View style={styles.batteryStepperRow}>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel="Diminuir bateria em 5 por cento"
                    accessibilityState={{ disabled: bateriaEmEdicao === 0 }}
                    pressedScale={0.92}
                    style={[
                      styles.batteryStepperButton,
                      bateriaEmEdicao === 0
                        ? styles.batteryStepperButtonDisabled
                        : null,
                    ]}
                    onPress={() =>
                      ajustarNivelDeBateria(-PASSO_AJUSTE_BATERIA)
                    }
                    disabled={bateriaEmEdicao === 0}
                  >
                    <Text style={styles.batteryStepperButtonText}>−</Text>
                  </PressableScale>

                  <View
                    accessibilityRole="text"
                    accessibilityLabel={`Bateria selecionada em ${bateriaEmEdicao} por cento, cerca de ${autonomiaEmEdicaoKm} quilômetros`}
                    style={styles.batteryStepperValue}
                  >
                    <Text
                      style={[
                        styles.batteryStepperPercent,
                        { color: corBateriaEmEdicao },
                      ]}
                    >
                      {bateriaEmEdicao}%
                    </Text>
                    <Text style={styles.batteryStepperRange}>
                      ≈{autonomiaEmEdicaoKm} km
                    </Text>
                  </View>

                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel="Aumentar bateria em 5 por cento"
                    accessibilityState={{ disabled: bateriaEmEdicao === 100 }}
                    pressedScale={0.92}
                    style={[
                      styles.batteryStepperButton,
                      bateriaEmEdicao === 100
                        ? styles.batteryStepperButtonDisabled
                        : null,
                    ]}
                    onPress={() => ajustarNivelDeBateria(PASSO_AJUSTE_BATERIA)}
                    disabled={bateriaEmEdicao === 100}
                  >
                    <Text style={styles.batteryStepperButtonText}>+</Text>
                  </PressableScale>
                </View>

                <Text style={styles.batterySheetSafetyHint}>
                  Ajuste manualmente apenas com o veículo parado.
                </Text>

                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel="Definir carga da bateria"
                  style={styles.batterySheetDoneButton}
                  onPress={() => void definirNivelDeBateria()}
                >
                  <Text style={styles.batterySheetDoneButtonText}>
                    Definir carga
                  </Text>
                </PressableScale>
              </ScrollView>
            </View>
          </Modal>
        ) : null}
      </ScreenTransition>
    </SafeAreaView>
  );
}
