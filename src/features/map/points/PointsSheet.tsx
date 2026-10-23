import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { Maximize2 } from "lucide-react-native";

import { PressableScale } from "../../../components";
import { useMapArea } from "../../../context/MapContext";
import { identificacaoDados } from "../../../data/identificacaoDados";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useTelaComPreferencias } from "../../../hooks/useTelaComPreferencias";
import { PointCard } from "./PointCard";
import baseStyles, { colors as baseColors } from "./PointsSheet.styles";

const SHEET_VISIBLE_HANDLE = 30;
const SHEET_OCULTO_MARGEM_EXTRA = 40;
const HANDLE_HINT_DISTANCE = 4;

const chevronControleBaixoXml = `<svg width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4.25L14 8.25L22 4.25" stroke="#BECAC5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const chevronControleCimaXml = `<svg width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7.75L14 3.75L22 7.75" stroke="#BECAC5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function PointsSheet() {
  const reduceMotion = useReducedMotion();
  const {
    state: {
      recommendedStations: stations,
      origin: { nome: originName },
      horizontalInset,
    },
    actions: { openStation, adjustSearch },
    viewport: {
      horizontal,
      panelWidth,
      panelMaxHeight,
      translateY,
      onMotionChange,
    },
    meta: { sheetRef },
  } = useMapArea();
  const { styles, colors, fontScale } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const { height: alturaJanela, fontScale: escalaFonteSistema } =
    useWindowDimensions();
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [painelTotalmenteOculto, setPainelTotalmenteOculto] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [alturaCardPonto, setAlturaCardPonto] = useState<number | null>(null);
  const [hasInteractedWithSheet, setHasInteractedWithSheet] = useState(false);
  const sheetHintTranslateY = useRef(new Animated.Value(0)).current;
  const sheetPositionRef = useRef(0);
  const onMotionChangeRef = useRef(onMotionChange);
  onMotionChangeRef.current = onMotionChange;

  const sheetCollapsedTranslateY = Math.max(
    sheetHeight - SHEET_VISIBLE_HANDLE,
    0,
  );
  const hiddenOffset = sheetHeight + SHEET_OCULTO_MARGEM_EXTRA;
  const alturaMaximaListaPontos = Math.max(
    180,
    Math.min(320, alturaJanela * 0.32),
  );
  const alturaListaComDoisCards = alturaCardPonto
    ? alturaCardPonto * 2
    : Math.min(alturaMaximaListaPontos, 250);
  const hasNoResults = stations.length === 0;

  const moverPainelDePontosPara = useCallback(
    (destino: number) => {
      sheetPositionRef.current = destino;
      translateY.stopAnimation();

      if (reduceMotion) {
        translateY.setValue(destino);
        return;
      }

      Animated.spring(translateY, {
        toValue: destino,
        useNativeDriver: true,
        friction: 8,
        tension: 58,
      }).start();
    },
    [reduceMotion, translateY],
  );

  const alternarModalDePontos = useCallback(
    (shouldCollapse: boolean) => {
      setPainelTotalmenteOculto(false);
      setIsSheetCollapsed(shouldCollapse);
      moverPainelDePontosPara(
        shouldCollapse ? sheetCollapsedTranslateY : 0,
      );
    },
    [moverPainelDePontosPara, sheetCollapsedTranslateY],
  );

  const ocultarPainelDePontosCompletamente = useCallback(() => {
    setPainelTotalmenteOculto(true);
    moverPainelDePontosPara(hiddenOffset);
  }, [hiddenOffset, moverPainelDePontosPara]);

  useImperativeHandle(
    sheetRef,
    () => ({
      expand() {
        alternarModalDePontos(false);
      },
    }),
    [alternarModalDePontos],
  );

  useEffect(() => {
    if (sheetHeight <= 0) {
      return;
    }

    if (painelTotalmenteOculto) {
      translateY.setValue(hiddenOffset);
      sheetPositionRef.current = hiddenOffset;
      return;
    }

    if (isSheetCollapsed) {
      translateY.setValue(sheetCollapsedTranslateY);
      sheetPositionRef.current = sheetCollapsedTranslateY;
    }
  }, [
    hiddenOffset,
    isSheetCollapsed,
    painelTotalmenteOculto,
    sheetCollapsedTranslateY,
    sheetHeight,
    translateY,
  ]);

  useEffect(() => {
    if (hasInteractedWithSheet || reduceMotion) {
      sheetHintTranslateY.stopAnimation();
      sheetHintTranslateY.setValue(0);
      return;
    }

    const hintOffset = isSheetCollapsed
      ? -HANDLE_HINT_DISTANCE
      : HANDLE_HINT_DISTANCE;
    const hintAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sheetHintTranslateY, {
          toValue: hintOffset,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(sheetHintTranslateY, {
          toValue: 0,
          duration: 520,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
      ]),
    );

    hintAnimation.start();

    return () => {
      hintAnimation.stop();
      sheetHintTranslateY.setValue(0);
    };
  }, [
    hasInteractedWithSheet,
    isSheetCollapsed,
    reduceMotion,
    sheetHintTranslateY,
  ]);

  useEffect(() => {
    onMotionChangeRef.current({
      sheetHeight,
      fullyHidden: painelTotalmenteOculto,
      collapsed: isSheetCollapsed,
      collapsedOffset: sheetCollapsedTranslateY,
      hiddenOffset,
      obstructedHeight: painelTotalmenteOculto
        ? 0
        : isSheetCollapsed
          ? SHEET_VISIBLE_HANDLE
          : sheetHeight,
    });
  }, [
    hiddenOffset,
    isSheetCollapsed,
    painelTotalmenteOculto,
    sheetCollapsedTranslateY,
    sheetHeight,
  ]);

  return (
    <>
      <Animated.View
        aria-hidden={painelTotalmenteOculto}
        accessibilityElementsHidden={painelTotalmenteOculto}
        importantForAccessibility={
          painelTotalmenteOculto ? "no-hide-descendants" : "auto"
        }
        style={[
          styles.bottomSheet,
          {
            left: horizontal ? 16 : horizontalInset,
            right: horizontal ? undefined : horizontalInset,
            width: panelWidth,
            transform: [{ translateY }],
          },
        ]}
      >
        <ScrollView
          key={`painel-${fontScale}-${escalaFonteSistema}`}
          tabIndex={-1}
          nestedScrollEnabled
          style={[styles.bottomSheetCard, { maxHeight: panelMaxHeight }]}
          contentContainerStyle={styles.bottomSheetContent}
          onLayout={(event) => {
            setSheetHeight(event.nativeEvent.layout.height);
          }}
        >
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Minimizar pontos de recarga para ver o mapa inteiro"
            tabIndex={painelTotalmenteOculto ? -1 : 0}
            accessibilityHint="Esconde completamente o painel, deixando só um atalho para trazê-lo de volta."
            hitSlop={{ top: 10, right: 44, bottom: 10, left: 44 }}
            pressedScale={0.94}
            style={styles.sheetHandleArea}
            onPress={() => {
              setHasInteractedWithSheet(true);
              ocultarPainelDePontosCompletamente();
            }}
          >
            <Animated.View
              style={{ transform: [{ translateY: sheetHintTranslateY }] }}
            >
              <View style={styles.sheetChevronButton}>
                <SvgXml
                  xml={
                    isSheetCollapsed
                      ? chevronControleCimaXml
                      : chevronControleBaixoXml
                  }
                  width={28}
                  height={12}
                />
              </View>
            </Animated.View>
          </PressableScale>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>
              {hasNoResults ? "Nenhum ponto disponível" : "Pontos de recarga"}
            </Text>
          </View>
          <Text style={styles.originDescription}>
            {identificacaoDados.catalogo.aviso}
            {"\n"}
            Origem: {originName} · distâncias em linha reta, sem cálculo de percurso
          </Text>

          {hasNoResults ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                Não encontramos pontos com esses critérios.
              </Text>

              <Text style={styles.emptyText}>
                Tente limpar alguns filtros ou buscar por outro endereço.
              </Text>

              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Ajustar busca"
                tabIndex={painelTotalmenteOculto ? -1 : 0}
                style={styles.emptyButton}
                onPress={adjustSearch}
              >
                <Text style={styles.emptyButtonText}>Ajustar busca</Text>
              </PressableScale>
            </View>
          ) : (
            <ScrollView
              tabIndex={-1}
              style={[styles.pointsScroll, { height: alturaListaComDoisCards }]}
              contentContainerStyle={styles.pointsScrollContent}
              showsVerticalScrollIndicator={stations.length > 2}
              nestedScrollEnabled
            >
              {stations.map((item, pointIndex) => (
                <PointCard
                  key={item.station.id}
                  station={item.station}
                  hidden={painelTotalmenteOculto}
                  onPress={() => openStation(item.station.id)}
                  onLayout={
                    pointIndex === 0
                      ? (event) => {
                          const proximaAltura = Math.ceil(
                            event.nativeEvent.layout.height,
                          );

                          if (proximaAltura !== alturaCardPonto) {
                            setAlturaCardPonto(proximaAltura);
                          }
                        }
                      : undefined
                  }
                />
              ))}
            </ScrollView>
          )}
        </ScrollView>
      </Animated.View>

      {painelTotalmenteOculto ? (
        <View pointerEvents="box-none" style={styles.restaurarPainelWrapper}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Mostrar pontos de recarga"
            accessibilityHint="Traz de volta a lista de pontos recomendados."
            pressedScale={0.94}
            style={styles.restaurarPainelPill}
            onPress={() => alternarModalDePontos(false)}
          >
            <Maximize2 size={16} color={colors.primary} strokeWidth={2.3} />
            <Text style={styles.restaurarPainelPillText}>
              Pontos de recarga
            </Text>
          </PressableScale>
        </View>
      ) : null}
    </>
  );
}
