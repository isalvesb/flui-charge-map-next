import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
} from "../../../components/MapSurface";
import { useAskLocation } from "../../../context/AskLocationContext";
import { useMapArea } from "../../../context/MapContext";
import { useTelaComPreferencias } from "../../../hooks/useTelaComPreferencias";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { getStationStatusInfo } from "../../stations/stationPresentation";
import baseStyles, { colors as baseColors } from "./MapCanvas.styles";
import { estiloEscuroDoMapa, obterIconeDoMarcador } from "./MapCanvas.utils";

export function MapCanvas() {
  const { styles } = useTelaComPreferencias(baseStyles, baseColors);
  const askedLocation = useAskLocation();
  const reduceMotion = useReducedMotion();
  const {
    state: { visibleStations, origin, now, dark },
    actions: { openStation },
    viewport: { region, onMapReady, onRegionChangeComplete, focusOn },
    meta: { mapRef },
  } = useMapArea();
  const userLocationPulseProgress = useRef(new Animated.Value(0)).current;
  const pontoEmFocoRef = useRef<string | null>(null);

  const escalaPulsoLocalizacao = userLocationPulseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.78, 1.18],
  });

  const opacidadePulsoLocalizacao = userLocationPulseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.34, 0.1],
  });

  useEffect(() => {
    if (reduceMotion) {
      userLocationPulseProgress.stopAnimation();
      userLocationPulseProgress.setValue(0.35);
      return;
    }

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(userLocationPulseProgress, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(userLocationPulseProgress, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
      userLocationPulseProgress.setValue(0);
    };
  }, [reduceMotion, userLocationPulseProgress]);

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.realMap}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        onMapReady={onMapReady}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        loadingEnabled
        customMapStyle={dark ? estiloEscuroDoMapa : []}
        onRegionChangeComplete={onRegionChangeComplete}
        accessibilityLabel="Mapa com pontos de recarga próximos"
      >
        <Marker
          key="user-location"
          coordinate={{
            latitude: origin.latitude,
            longitude: origin.longitude,
          }}
          title={`Origem demonstrativa: ${origin.nome}`}
          description="Localização simulada para demonstração."
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={!reduceMotion}
        >
          <View collapsable={false} style={styles.userLocationMarker}>
            <Animated.View
              style={[
                styles.userLocationPulse,
                {
                  opacity: opacidadePulsoLocalizacao,
                  transform: [{ scale: escalaPulsoLocalizacao }],
                },
              ]}
            />
            <View style={styles.userLocationDot} />
          </View>
        </Marker>

        {askedLocation.places.map((place, index) => (
          <Marker
            key={`${place.latitude}-${place.longitude}-${index}`}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={`${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges
            onPress={() => {
              pontoEmFocoRef.current = null;
              focusOn(place.latitude, place.longitude);
            }}
            accessible
            accessibilityRole="button"
            accessibilityLabel={`${place.name}: ${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`}
            accessibilityHint="Aproxima o mapa neste ponto."
          >
            <View collapsable={false} style={styles.askedPlace}>
              <Text style={styles.askedPlaceCoordinates}>
                {`${place.latitude.toFixed(5)}, ${place.longitude.toFixed(5)}`}
              </Text>
              <View style={styles.askedPlaceDot} />
            </View>
          </Marker>
        ))}

        {visibleStations.map((item) => {
          const station = item.station;
          const statusLabel = getStationStatusInfo(station, now).label;
          const markerIcon = obterIconeDoMarcador(station, now);

          return (
            <Marker
              key={station.id}
              coordinate={{
                latitude: station.latitude,
                longitude: station.longitude,
              }}
              title={station.name}
              description={`${statusLabel} • ${station.powerKw} kW`}
              onPress={() => {
                if (pontoEmFocoRef.current === station.id) {
                  openStation(station.id);
                  return;
                }

                pontoEmFocoRef.current = station.id;
                focusOn(station.latitude, station.longitude);
              }}
              anchor={{ x: 0.5, y: 0.87 }}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`Centralizar ${station.name} no mapa`}
              accessibilityHint={`${statusLabel}. Aproxima o mapa neste ponto de recarga. Toque de novo para abrir a ficha.`}
              icon={markerIcon}
              tracksViewChanges={false}
            />
          );
        })}
      </MapView>

      <View
        pointerEvents="none"
        style={[
          styles.mapTintOverlay,
          dark ? styles.mapTintOverlayDark : null,
        ]}
      />
    </>
  );
}
