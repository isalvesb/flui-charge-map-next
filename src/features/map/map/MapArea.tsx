import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, useWindowDimensions, View } from "react-native";

import type { MapViewHandle, Region } from "../../../components/MapSurface";
import { useAskLocation } from "../../../context/AskLocationContext";
import { MapProvider, useMapContext } from "../../../context/MapContext";
import { useTelaComPreferencias } from "../../../hooks/useTelaComPreferencias";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import type { PointsSheetHandle, PointsSheetMotion } from "../points/PointsSheet.types";
import type { MapAreaProps } from "./MapArea.types";
import type { MapMeta, MapViewport } from "./Map.types";
import baseStyles from "./MapArea.styles";
import {
  criarRegiaoComFocoVisivel,
  criarRegiaoDoMapa,
  criarRegiaoDosLugares,
  getMapHorizontalFocusOffset,
  getMapPanelLayout,
  getMapVerticalFocusOffset,
} from "./Map.utils";

export function MapArea({ children }: MapAreaProps) {
  const { state, actions } = useMapContext();
  const {
    visibleStations,
    fallbackStations,
    origin,
    hasSearch,
    hasFilters,
    filters,
    searchTerm,
  } = state;
  const { styles, fontScale } = useTelaComPreferencias(baseStyles);
  const askedLocation = useAskLocation();
  const reduceMotionEnabled = useReducedMotion();
  const { width: larguraJanela, height: alturaJanela, fontScale: escalaFonteSistema } =
    useWindowDimensions();
  const mapRef = useRef<MapViewHandle | null>(null);
  const currentMapRegionRef = useRef<Region | null>(null);
  const sheetRef = useRef<PointsSheetHandle | null>(null);
  const sheetTranslateY = useRef(new Animated.Value(0)).current;
  const [mapAreaHeight, setMapAreaHeight] = useState(0);
  const [mapAreaWidth, setMapAreaWidth] = useState(0);
  const [mapaPronto, setMapaPronto] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [ocupacao, setOcupacao] = useState<PointsSheetMotion>({
    sheetHeight: 0,
    fullyHidden: false,
    collapsed: false,
    collapsedOffset: 0,
    hiddenOffset: 0,
    obstructedHeight: 0,
  });

  const atualizarOcupacao = useCallback((proxima: PointsSheetMotion) => {
    setOcupacao((atual) => {
      if (
        atual.sheetHeight === proxima.sheetHeight &&
        atual.fullyHidden === proxima.fullyHidden &&
        atual.collapsed === proxima.collapsed &&
        atual.collapsedOffset === proxima.collapsedOffset &&
        atual.hiddenOffset === proxima.hiddenOffset &&
        atual.obstructedHeight === proxima.obstructedHeight
      ) {
        return atual;
      }

      return proxima;
    });
  }, []);

  const layout = getMapPanelLayout(
    larguraJanela,
    alturaJanela,
    mapAreaHeight,
    fontScale * escalaFonteSistema,
    ocupacao.sheetHeight,
  );

  const fracaoDeDeslocamentoVertical = getMapVerticalFocusOffset(
    layout.horizontal,
    mapAreaHeight,
    ocupacao.obstructedHeight,
    ocupacao.fullyHidden,
  );

  const fracaoDeDeslocamentoHorizontal = getMapHorizontalFocusOffset(
    layout.horizontal,
    mapAreaWidth,
    layout.panelWidth ?? 0,
    ocupacao.fullyHidden || ocupacao.collapsed,
  );
  const fracaoDeDeslocamentoHorizontalRef = useRef(fracaoDeDeslocamentoHorizontal);
  fracaoDeDeslocamentoHorizontalRef.current = fracaoDeDeslocamentoHorizontal;

  const fracaoDeDeslocamentoVerticalRef = useRef(fracaoDeDeslocamentoVertical);
  fracaoDeDeslocamentoVerticalRef.current = fracaoDeDeslocamentoVertical;

  const mapRegion = useMemo(() => {
    const firstVisibleStation =
      visibleStations[0]?.station ?? fallbackStations[0];

    if ((hasFilters || hasSearch) && firstVisibleStation) {
      return criarRegiaoDoMapa(firstVisibleStation, true);
    }

    if (origin) {
      return criarRegiaoComFocoVisivel(
        origin.latitude,
        origin.longitude,
        true,
        fracaoDeDeslocamentoVerticalRef.current,
        fracaoDeDeslocamentoHorizontalRef.current,
      );
    }

    return criarRegiaoDoMapa(firstVisibleStation, false);
    // fracaoDeDeslocamentoVertical é lido via ref de propósito: ela só
    // reflete o layout (sheet/mapArea) se estabilizando, e recalcular a
    // região a cada ajuste fazia o mapa reanimar várias vezes seguidas
    // logo na abertura, deixando o carregamento visivelmente mais lento.
  }, [fallbackStations, hasFilters, hasSearch, origin, visibleStations]);

  const isPrimeiraRegiaoRef = useRef(true);
  const criteriosDeFocoRef = useRef({
    filtros: filters,
    busca: searchTerm,
    localizacao: origin,
  });

  useEffect(() => {
    const anteriores = criteriosDeFocoRef.current;
    const mudouCriterio =
      anteriores.filtros !== filters ||
      anteriores.busca !== searchTerm ||
      anteriores.localizacao !== origin;

    criteriosDeFocoRef.current = {
      filtros: filters,
      busca: searchTerm,
      localizacao: origin,
    };

    if (isPrimeiraRegiaoRef.current) {
      currentMapRegionRef.current = mapRegion;
      isPrimeiraRegiaoRef.current = false;
      return;
    }

    // O relógio atualiza resultados e estados, mas não é uma ação de navegação.
    // Preserve também a região usada pelos controles de zoom e centralização.
    if (!mudouCriterio) return;

    currentMapRegionRef.current = mapRegion;
    mapRef.current?.animateToRegion(mapRegion, reduceMotionEnabled ? 0 : 450);
  }, [filters, mapRegion, origin, reduceMotionEnabled, searchTerm]);

  useEffect(() => {
    if (!mapaPronto || askedLocation.places.length === 0) return;

    const region = criarRegiaoDosLugares(
      askedLocation.places,
      fracaoDeDeslocamentoVerticalRef.current,
      fracaoDeDeslocamentoHorizontalRef.current,
    );
    currentMapRegionRef.current = region;
    mapRef.current?.animateToRegion(region, reduceMotionEnabled ? 0 : 450);
  }, [askedLocation.places, mapaPronto, reduceMotionEnabled]);

  const ajusteInicialDeCentralizacaoRef = useRef(false);

  useEffect(() => {
    if (ajusteInicialDeCentralizacaoRef.current) {
      return;
    }

    if (!mapaPronto || mapAreaHeight <= 0 || ocupacao.sheetHeight <= 0) {
      return;
    }

    if (hasFilters || hasSearch || !origin || askedLocation.places.length > 0) {
      return;
    }

    ajusteInicialDeCentralizacaoRef.current = true;

    const regiaoCentralizada = criarRegiaoComFocoVisivel(
      origin.latitude,
      origin.longitude,
      true,
      fracaoDeDeslocamentoVertical,
      fracaoDeDeslocamentoHorizontal,
    );

    currentMapRegionRef.current = regiaoCentralizada;
    mapRef.current?.animateToRegion(
      regiaoCentralizada,
      reduceMotionEnabled ? 0 : 400,
    );
  }, [
    fracaoDeDeslocamentoHorizontal,
    fracaoDeDeslocamentoVertical,
    hasFilters,
    hasSearch,
    mapAreaHeight,
    mapaPronto,
    ocupacao.sheetHeight,
    askedLocation.places,
    origin,
    reduceMotionEnabled,
  ]);

  const focarNoMapa = useCallback(
    (latitude: number, longitude: number) => {
      const regiao = criarRegiaoComFocoVisivel(
        latitude,
        longitude,
        true,
        fracaoDeDeslocamentoVertical,
        fracaoDeDeslocamentoHorizontal,
        0.006,
      );

      currentMapRegionRef.current = regiao;
      mapRef.current?.animateToRegion(regiao, reduceMotionEnabled ? 0 : 450);
    },
    [
      fracaoDeDeslocamentoHorizontal,
      fracaoDeDeslocamentoVertical,
      reduceMotionEnabled,
    ],
  );

  const centralizarLocalizacaoUsuario = () => {
    if (isLocatingUser) {
      return;
    }

    setIsLocatingUser(true);

    mapRef.current?.animateToRegion(
      criarRegiaoComFocoVisivel(
        origin.latitude,
        origin.longitude,
        true,
        fracaoDeDeslocamentoVertical,
        getMapHorizontalFocusOffset(
          layout.horizontal,
          mapAreaWidth,
          layout.panelWidth ?? 0,
        ),
      ),
      reduceMotionEnabled ? 0 : 500,
    );

    actions.onRecentered();

    if (ocupacao.collapsed || ocupacao.fullyHidden) {
      sheetRef.current?.expand();
    }

    setTimeout(() => {
      setIsLocatingUser(false);
    }, 450);
  };

  const [larguraPillRestaurar, setLarguraPillRestaurar] = useState(0);
  const registrarLarguraPillRestaurar = useCallback((width: number) => {
    setLarguraPillRestaurar((atual) => (atual === width ? atual : width));
  }, []);

  const marcarMapaPronto = useCallback(() => {
    setMapaPronto(true);
  }, []);

  const registrarRegiao = useCallback((region: Region) => {
    currentMapRegionRef.current = region;
  }, []);

  const viewport: MapViewport = {
    horizontal: layout.horizontal,
    compactControls: layout.compactControls,
    panelWidth: layout.panelWidth,
    panelMaxHeight: layout.panelMaxHeight,
    sheetHeight: ocupacao.sheetHeight,
    translateY: sheetTranslateY,
    collapsedOffset: ocupacao.collapsedOffset,
    hiddenOffset: ocupacao.hiddenOffset,
    fullyHidden: ocupacao.fullyHidden,
    collapsed: ocupacao.collapsed,
    locating: isLocatingUser,
    region: mapRegion,
    recenter: centralizarLocalizacaoUsuario,
    focusOn: focarNoMapa,
    onMapReady: marcarMapaPronto,
    onRegionChangeComplete: registrarRegiao,
    onMotionChange: atualizarOcupacao,
    restorePillWidth: larguraPillRestaurar,
    onRestorePillWidth: registrarLarguraPillRestaurar,
  };

  const meta: MapMeta = {
    mapRef,
    regionRef: currentMapRegionRef,
    sheetRef,
  };

  return (
    <MapProvider value={{ state, actions, viewport, meta }}>
      <View
        style={styles.mapArea}
        onLayout={(event) => {
          setMapAreaHeight(event.nativeEvent.layout.height);
          setMapAreaWidth(event.nativeEvent.layout.width);
        }}
      >
        {children}
      </View>
    </MapProvider>
  );
}
