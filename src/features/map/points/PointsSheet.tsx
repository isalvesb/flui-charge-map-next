import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
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
import { useAskLocation } from "../../../context/AskLocationContext";
import { useMapArea } from "../../../context/MapContext";
import { fetchNearbyPlaces, type NearbyPlace } from "../../assistant/askPlaces";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useTelaComPreferencias } from "../../../hooks/useTelaComPreferencias";
import { formatarDistanciaDemonstrativa } from "../../../utils/demonstracao";
import baseStyles, { colors as baseColors } from "./PointsSheet.styles";

const SHEET_VISIBLE_HANDLE = 30;
const SHEET_OCULTO_MARGEM_EXTRA = 40;
const HANDLE_HINT_DISTANCE = 4;

function sheetTitle(category: string | null, empty: boolean) {
  if (empty) return "Nenhum ponto disponível";
  if (category === "coffee") return "Cafeterias";
  if (category === "gas_station") return "Postos de gasolina";
  return "Pontos de recarga";
}

function placeStatus(status: string) {
  if (status === "available") return "Disponível";
  if (status === "busy") return "Ocupado";
  if (status === "maintenance") return "Em manutenção";
  if (status === "unavailable") return "Indisponível";
  return "";
}

const chevronControleBaixoXml = `<svg width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4.25L14 8.25L22 4.25" stroke="#BECAC5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const chevronControleCimaXml = `<svg width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7.75L14 3.75L22 7.75" stroke="#BECAC5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function PointsSheet() {
  const reduceMotion = useReducedMotion();
  const {
    state: { horizontalInset },
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
  const askedLocation = useAskLocation();
  const [defaults, setDefaults] = useState<NearbyPlace[]>([]);
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [painelTotalmenteOculto, setPainelTotalmenteOculto] = useState(true);
  const [placed, setPlaced] = useState(false);
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
  const places =
    askedLocation.askedCards.length > 0 ? askedLocation.askedCards : defaults;
  const hasNoResults = places.length === 0;
  const seenDrawerToken = useRef(0);

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
    if (!askedLocation.fix || askedLocation.askedCards.length > 0) return;
    let alive = true;
    void fetchNearbyPlaces({
      category: "ev_charging",
      latitude: askedLocation.fix.latitude,
      longitude: askedLocation.fix.longitude,
    }).then((next) => {
      if (alive) setDefaults(next);
    });
    return () => {
      alive = false;
    };
  }, [askedLocation.askedCards.length, askedLocation.fix]);

  useEffect(() => {
    if (askedLocation.drawerToken === seenDrawerToken.current) return;
    seenDrawerToken.current = askedLocation.drawerToken;
    if (askedLocation.drawerToken === 0) return;
    alternarModalDePontos(false);
  }, [alternarModalDePontos, askedLocation.drawerToken]);

  useLayoutEffect(() => {
    if (sheetHeight <= 0) {
      return;
    }

    if (painelTotalmenteOculto) {
      translateY.setValue(hiddenOffset);
      sheetPositionRef.current = hiddenOffset;
      setPlaced(true);
      return;
    }

    if (isSheetCollapsed) {
      translateY.setValue(sheetCollapsedTranslateY);
      sheetPositionRef.current = sheetCollapsedTranslateY;
    }
    setPlaced(true);
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
        pointerEvents={placed && !painelTotalmenteOculto ? "auto" : "none"}
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
            opacity: placed ? 1 : 0,
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
              {sheetTitle(places[0]?.category ?? null, hasNoResults)}
            </Text>
          </View>
          <Text style={styles.originDescription}>
            Perto de você · distâncias em linha reta
          </Text>

          {hasNoResults ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                Não encontramos pontos perto de você.
              </Text>
            </View>
          ) : (
            <ScrollView
              tabIndex={-1}
              style={[styles.pointsScroll, { height: alturaListaComDoisCards }]}
              contentContainerStyle={styles.pointsScrollContent}
              showsVerticalScrollIndicator={places.length > 2}
              nestedScrollEnabled
            >
              {places.map((place, pointIndex) => (
                <View
                  key={`${place.category}-${place.latitude}-${place.longitude}`}
                  style={styles.placeCard}
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
                >
                  <Text style={styles.placeName}>{place.name}</Text>
                  {place.address ? (
                    <Text style={styles.placeMeta}>{place.address}</Text>
                  ) : null}
                  <Text style={styles.placeMeta}>
                    {place.distanceKm > 0
                      ? `${formatarDistanciaDemonstrativa(place.distanceKm)} em linha reta`
                      : `${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`}
                  </Text>
                  <Text style={styles.placeMeta}>
                    {[
                      placeStatus(place.status),
                      place.rating > 0
                        ? place.rating.toFixed(1).replace(".", ",")
                        : "",
                      place.powerKw != null ? `${place.powerKw} kW` : "",
                      place.openingHours,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                </View>
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
