import { ConnectionNotice } from "../../components/ConnectionNotice";
import { useConnectivity } from "../../context/ConnectivityContext";
import { prepareExternalRoute } from "../../utils/externalRoute";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  type Href,
} from "expo-router";
import {
  AlarmClock,
  ArrowLeft,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryWarning,
  CircleParking,
  Coffee,
  Gauge,
  Heart,
  Navigation2,
  Plug,
  ShieldCheck,
  ShoppingCart,
  Star,
  Toilet,
  Utensils,
  Warehouse,
  Wifi,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStationImageSource } from "../../assets/stations";
import {
  LoadingOverlay,
  ScreenTransition,
  StationVisualCover,
} from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { chargingStations } from "../../data";
import { identificacaoDados } from "../../data/identificacaoDados";
import { useCurrentTime } from "../../hooks/useCurrentTime";
import { useFluiStorage } from "../../hooks/useFluiStorage";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";
import { avaliarAlcance } from "../../utils/autonomia";
import { formatarDistanciaDemonstrativa } from "../../utils/demonstracao";
import {
  triggerImpact,
  type PressableVisualState,
} from "../../utils/interaction";
import { isStationOpenAt } from "../../utils/stationHours";
import {
  RoutingModalPermission,
  RoutingModalRoutes,
} from "./components/RoutingModal";
import { styles as baseStyles } from "./PointDetailsScreen.styles";
import {
  getStationArrivalPresentation,
  getStationChargerCountLabel,
  getStationRecommendation,
  getStationStatusInfo,
  getWaitingLevel,
} from "./stationPresentation";
import type { LocationObject } from "expo-location";

const imagemPerfilUsuario = require("@/assets/user/profile1.webp");

type Station = (typeof chargingStations)[number];

type ReviewCardData = NonNullable<Station["reviews"]>[number];

const nomeMotorista = "Caio Duarte";

function normalizeParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function formatAddress(station: Station) {
  return [station.address, station.neighborhood, station.city, station.state]
    .filter(Boolean)
    .join(", ");
}

function getAmenityLabel(amenity: string) {
  const labels: Record<string, string> = {
    restaurant: "Restaurante",
    coffee: "Café",
    restroom: "Banheiro",
    parking: "Estacionamento",
    security: "Segurança",
    wifi: "Wi-Fi",
    coveredArea: "Área coberta",
    market: "Mercado",
  };

  return labels[amenity] ?? amenity;
}

function getAmenityIcon(amenity: string) {
  const icons: Record<string, React.ElementType> = {
    restaurant: Utensils,
    coffee: Coffee,
    restroom: Toilet,
    parking: CircleParking,
    security: ShieldCheck,
    wifi: Wifi,
    coveredArea: Warehouse,
    market: ShoppingCart,
  };

  return icons[amenity] ?? ShoppingCart;
}

function getConnectorIcon(connectorType: string): React.ElementType {
  if (connectorType === "ccs2" || connectorType === "chademo") {
    return BatteryCharging;
  }

  return Plug;
}

function getRatingStars(rating: number) {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? "★" : "☆",
  ).join(" ");
}

function getUserInitials(userName: string) {
  const nameParts = userName.trim().split(/\s+/);
  const firstInitial = nameParts[0]?.[0] ?? "";
  const lastInitial =
    nameParts.length > 1 ? (nameParts[nameParts.length - 1]?.[0] ?? "") : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

function calcularTempoEstimadoCarga(powerKw: number) {
  if (powerKw >= 120) {
    return "20 a 35 min";
  }

  if (powerKw >= 50) {
    return "40 a 60 min";
  }

  return "1h30 ou mais";
}

function montarPerfilDoPonto(station: Station) {
  if (station.powerKw >= 120) {
    return "Carga rápida";
  }

  if (station.amenities.length >= 4) {
    return "Parada confortável";
  }

  return "Recarga essencial";
}

function obterIconeDeAlcance(
  nivel: ReturnType<typeof avaliarAlcance>["nivel"],
) {
  if (nivel === "foraDeAlcance") {
    return BatteryWarning;
  }

  if (nivel === "apertado") {
    return BatteryLow;
  }

  return BatteryFull;
}

export default function PointDetailsScreen() {
  const now = useCurrentTime();
  const { styles, colors, isDarkMode } = useTelaComPreferencias(baseStyles);
  const { userPreferences, demoStations, demoOrigin } = useAppPreferences();
  const { stationId, startRoute } = useLocalSearchParams<{
    stationId?: string | string[];
    startRoute?: string | string[];
  }>();

  const selectedStationId = normalizeParam(stationId) ?? "station-01";

  const station = useMemo(() => {
    return demoStations.find((item) => item.id === selectedStationId);
  }, [selectedStationId, demoStations]);

  const {
    favoriteStationIds,
    sentReviews,
    isLoadingStorage,
    reloadStorage,
    toggleFavoriteStation,
  } = useFluiStorage();

  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const { checkConnection } = useConnectivity();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRouteDialogOpen, setIsRouteDialogOpen] = useState(false);
  const requestedRouteRef = useRef<string | null>(null);
  const [routeLocation, setRouteLocation] = useState<LocationObject | null>(null);
  const [modalStep, setModalStep] = useState<"confirmation" | "redirect">("confirmation");

  useFocusEffect(
    useCallback(() => {
      void reloadStorage();
    }, [reloadStorage]),
  );

  const handleNext = (location: LocationObject | null) => {
    setRouteLocation(location);
    setModalStep("redirect");
  };

  const isFavorite = station ? favoriteStationIds.includes(station.id) : false;

  async function handleToggleFavorite() {
    if (!station || isLoadingAction || isLoadingStorage) {
      return;
    }

    try {
      triggerImpact();
      await toggleFavoriteStation(station.id);
    } catch {
      Alert.alert(
        "Não foi possível atualizar favoritos",
        "Tente novamente em alguns instantes.",
      );
    }
  }

  function handleOpenReview() {
    if (!station || isLoadingAction) {
      return;
    }

    const route = {
      pathname: "/review",
      params: {
        stationId: station.id,
      },
    } as Href;

    setIsLoadingAction(true);

    setTimeout(() => {
      setIsLoadingAction(false);
      router.push(route);
    }, 360);
  }

  const handleStartRoute = useCallback(async () => {
    if (!station || isLoadingAction) return;
    setIsLoadingAction(true);
    setConnectionError(null);
    try {
      const blocked = await prepareExternalRoute(checkConnection, () => {
        setRouteLocation(null);
        setModalStep("confirmation");
        setIsRouteDialogOpen(true);
      });
      setConnectionError(blocked);
    } finally {
      setIsLoadingAction(false);
    }
  }, [station, isLoadingAction, checkConnection]);

  // O atalho da FluIA usa a mesma proteção do botão da ficha, antes de pedir GPS.
  useEffect(() => {
    if (normalizeParam(startRoute) !== "1" || !station ||
        requestedRouteRef.current === station.id) return;
    requestedRouteRef.current = station.id;
    void handleStartRoute();
  }, [startRoute, station, handleStartRoute]);

  function voltarAoMapa() {
    router.replace("/map" as Href);
  }

  if (!station) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <View style={styles.fallbackCard}>
          <Text style={styles.fallbackIcon}>!</Text>

          <Text style={styles.fallbackTitle}>Ponto não encontrado</Text>

          <Text style={styles.fallbackDescription}>
            Não encontramos uma estação com o ID {selectedStationId}. Volte para
            o mapa e escolha outro ponto de recarga.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar para o mapa"
            style={({ pressed, hovered }: PressableVisualState) => [
              styles.primaryFallbackButton,
              hovered && !pressed ? styles.hoverFeedback : null,
              pressed ? styles.primaryButtonPressed : null,
            ]}
            onPress={voltarAoMapa}
          >
            <Text style={styles.primaryFallbackButtonText}>
              Voltar para o mapa
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar ao mapa"
            style={({ pressed, hovered }: PressableVisualState) => [
              styles.secondaryFallbackButton,
              hovered && !pressed ? styles.hoverFeedback : null,
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={voltarAoMapa}
          >
            <Text style={styles.secondaryFallbackButtonText}>
              Voltar ao mapa
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStationStatusInfo(station, now);

  const availableChargers = station.connectors.reduce(
    (total, connector) => total + connector.availableChargers,
    0,
  );

  const totalChargers = station.connectors.reduce(
    (total, connector) => total + connector.totalChargers,
    0,
  );

  const connectorLabels = station.connectors
    .map((connector) => connector.label)
    .join(", ");

  const avaliacaoAlcance = avaliarAlcance(
    station.distanceKm,
    userPreferences.vehicleRangeKm,
    userPreferences.batteryPercent,
  );
  const tempoEstimadoCarga = calcularTempoEstimadoCarga(station.powerKw);
  const recomendacaoDoPonto = getStationRecommendation(
    station,
    availableChargers,
    now,
  );
  const orientacaoDeEspera = isStationOpenAt(station, now)
    ? getWaitingLevel(station.status, availableChargers)
    : "Indisponível";
  const perfilDoPonto = montarPerfilDoPonto(station);
  const userStationReview = sentReviews.find(
    (review) => review.stationId === station.id,
  );
  const userReviewComment = userStationReview?.comment.trim() ?? "";
  const userReviewCard: ReviewCardData | null =
    userStationReview && userReviewComment.length > 0
      ? {
          id: `local-${userStationReview.id}`,
          stationId: userStationReview.stationId,
          userName: nomeMotorista,
          rating: userStationReview.rating,
          quality: userStationReview.quality,
          cleaning: userStationReview.cleaning,
          availability: userStationReview.availability,
          amenities: userStationReview.amenities,
          comment: userReviewComment,
          wouldReturn: userStationReview.wouldReturn,
          recommend: userStationReview.recommend,
          createdAt: userStationReview.createdAt,
        }
      : null;
  const stationReviews = userReviewCard
    ? [userReviewCard, ...(station.reviews ?? [])]
    : (station.reviews ?? []);
  const statusColor =
    station.status === "maintenance"
      ? colors.dangerBorder
      : !isStationOpenAt(station, now)
        ? colors.textLight
        : station.status === "available"
          ? colors.success
          : station.status === "busy"
            ? colors.yellowDark
            : colors.textLight;

  const IconeAlcance = obterIconeDeAlcance(avaliacaoAlcance.nivel);
  const apresentacaoAlcance = getStationArrivalPresentation(
    station,
    avaliacaoAlcance,
    now,
  );
  const corAlcance =
    apresentacaoAlcance.tone === "danger"
      ? colors.dangerBorder
      : apresentacaoAlcance.tone === "warning"
        ? colors.yellowDark
        : apresentacaoAlcance.tone === "success"
          ? colors.success
          : colors.textLight;
  const corFundoAlcance =
    apresentacaoAlcance.tone === "danger"
      ? colors.dangerSoft
      : apresentacaoAlcance.tone === "warning"
        ? colors.warningLight
        : apresentacaoAlcance.tone === "success"
          ? colors.successSoft
          : colors.surface;

  return (
    <ScreenTransition style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, connectionError && styles.scrollContentWithError]}
      >
        <View style={styles.hero}>
          <StationVisualCover
            variant="hero"
            nome={station.name}
            bairro={station.neighborhood}
            potenciaKw={station.powerKw}
            status={station.status}
            comodidades={station.amenities}
            imageSource={getStationImageSource(station.imageKey)}
            imageUrl={station.imageUrl}
          />
          <SafeAreaView edges={["top"]} style={styles.heroActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar ao mapa"
              style={({ pressed, hovered }: PressableVisualState) => [
                styles.iconButton,
                hovered && !pressed ? styles.hoverFeedback : null,
                pressed ? styles.iconButtonPressed : null,
              ]}
              onPress={voltarAoMapa}
            >
              <ArrowLeft size={24} color={colors.text} strokeWidth={2.4} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
              accessibilityState={{
                selected: isFavorite,
                disabled: isLoadingAction || isLoadingStorage,
              }}
              style={({ pressed, hovered }: PressableVisualState) => [
                styles.iconButton,
                isFavorite ? styles.iconButtonSelected : null,
                hovered && !pressed ? styles.hoverFeedback : null,
                pressed ? styles.iconButtonPressed : null,
              ]}
              disabled={isLoadingAction || isLoadingStorage}
              onPress={handleToggleFavorite}
            >
              <Heart
                size={23}
                color={colors.primary}
                fill={isFavorite ? colors.primary : "transparent"}
                strokeWidth={2.2}
              />
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.stationName}>{station.name}</Text>

          <Text style={styles.address}>{formatAddress(station)}</Text>

          <View style={styles.summaryRow}>
            <View style={styles.ratingGroup}>
              <Star
                size={19}
                color={colors.yellowDark}
                fill={colors.yellowDark}
                strokeWidth={2}
                style={styles.starIcon}
              />

              <Text style={styles.ratingValue}>
                {station.rating.toFixed(1)}
              </Text>

              <Text style={styles.reviewCount}>
                ({station.reviewCount} avaliações demonstrativas)
              </Text>
            </View>

            <View style={styles.statusGroup}>
              <View
                accessible={false}
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />

              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>

          <View style={styles.availableRow}>
            <View style={styles.availableIconBox}>
              <Zap
                size={17}
                color={colors.primaryBright}
                fill={colors.primaryBright}
                strokeWidth={2.2}
              />
            </View>

            <Text style={styles.availableText}>
              {getStationChargerCountLabel(
                station,
                availableChargers,
                totalChargers,
                now,
              )}
            </Text>
          </View>

          <Text style={styles.resumoTitle}>{recomendacaoDoPonto}</Text>
          <ConnectionNotice />
          <View
            accessible
            style={[
              styles.alcanceBanner,
              { backgroundColor: corFundoAlcance, borderColor: corAlcance },
            ]}
          >
            <IconeAlcance size={20} color={corAlcance} strokeWidth={2.3} />

            <Text style={[styles.alcanceBannerText, { color: corAlcance }]}>
              {apresentacaoAlcance.text}
            </Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <View style={styles.infoCard}>
                <View style={styles.infoIconBox}>
                  <Gauge
                    size={20}
                    color={colors.primaryBright}
                    strokeWidth={2.2}
                  />
                </View>

                <View style={styles.infoTextBox}>
                  <Text style={styles.infoLabel}>Potência</Text>
                  <Text style={styles.infoValue}>{station.powerKw} kW</Text>
                  <Text style={styles.infoDescription}>
                    Velocidade de carga
                  </Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoIconBox}>
                  <Plug
                    size={20}
                    color={colors.primaryBright}
                    strokeWidth={2.2}
                  />
                </View>

                <View style={styles.infoTextBox}>
                  <Text style={styles.infoLabel}>Conectores</Text>
                  <Text style={styles.infoValue}>{connectorLabels}</Text>
                  <Text style={styles.infoDescription}>Tipos compatíveis</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoCard}>
                <View style={styles.infoIconBox}>
                  <AlarmClock
                    size={20}
                    color={colors.primaryBright}
                    strokeWidth={2.2}
                  />
                </View>

                <View style={styles.infoTextBox}>
                  <Text style={styles.infoLabel}>Funcionamento</Text>
                  <Text style={styles.infoValue}>{station.openingHours}</Text>
                  <Text style={styles.infoDescription}>
                    {statusInfo.description}
                  </Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoIconBox}>
                  <Navigation2
                    size={20}
                    color={colors.primaryBright}
                    strokeWidth={2.2}
                  />
                </View>

                <View style={styles.infoTextBox}>
                  <Text style={styles.infoLabel}>Distância aproximada</Text>
                  <Text style={styles.infoValue}>
                    {formatarDistanciaDemonstrativa(station.distanceKm)}
                  </Text>
                  <Text style={styles.infoDescription}>
                    Em linha reta desde {demoOrigin.nome}. Não é distância de
                    percurso.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.resumoDescription}>
            {identificacaoDados.catalogo.aviso}{" "}{identificacaoDados.estimativas.aviso}
          </Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimativas de recarga</Text>
            <Text style={styles.infoDescription}>Espera simulada: {orientacaoDeEspera} · Carga: {tempoEstimadoCarga}</Text>
            <Text style={styles.infoDescription}>{perfilDoPonto}. Confirme funcionamento e compatibilidade antes de ir.</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conectores do ponto</Text>

            {station.connectors.map((connector) => {
              const ConnectorIcon = getConnectorIcon(connector.type);

              return (
                <View key={connector.id} style={styles.connectorRow}>
                  <View style={styles.connectorIconBox}>
                    <ConnectorIcon
                      size={18}
                      color={colors.primaryBright}
                      strokeWidth={2.2}
                    />
                  </View>

                  <View style={styles.connectorInfo}>
                    <Text style={styles.connectorName}>{connector.label}</Text>

                    <Text style={styles.connectorDescription}>
                      {connector.powerKw} kW ·{" "}
                      {getStationChargerCountLabel(
                        station,
                        connector.availableChargers,
                        connector.totalChargers,
                        now,
                      )}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comodidades próximas</Text>

            <View style={styles.amenitiesGrid}>
              {station.amenities.map((amenity) => {
                const IconeComodidade = getAmenityIcon(amenity);

                return (
                  <View key={amenity} style={styles.amenityItem}>
                    <View style={styles.amenityIconBox}>
                      <IconeComodidade
                        size={18}
                        color={colors.primary}
                        strokeWidth={2.1}
                      />
                    </View>

                    <Text style={styles.amenityLabel}>
                      {getAmenityLabel(amenity)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            <Text style={styles.resumoDescription}>
              {identificacaoDados.avaliacoesExemplo.aviso}
            </Text>

            <View style={styles.ratingPanel}>
              <View style={styles.ratingPanelLeft}>
                <Text style={styles.bigRating}>
                  {station.rating.toFixed(1)}
                </Text>

                <Text style={styles.ratingStars}>
                  {getRatingStars(station.rating)}
                </Text>

                <Text style={styles.totalReviews}>
                  {station.reviewCount} avaliações demonstrativas
                </Text>
              </View>

              <View style={styles.ratingPanelRight}>
                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>5 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarLarge} />
                  </View>
                  <Text style={styles.ratingPercent}>85%</Text>
                </View>

                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>4 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarSmall} />
                  </View>
                  <Text style={styles.ratingPercent}>10%</Text>
                </View>

                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>3 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarTiny} />
                  </View>
                  <Text style={styles.ratingPercent}>3%</Text>
                </View>

                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>2 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarMinimal} />
                  </View>
                  <Text style={styles.ratingPercent}>1%</Text>
                </View>

                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>1 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarMinimal} />
                  </View>
                  <Text style={styles.ratingPercent}>1%</Text>
                </View>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                userStationReview
                  ? "Editar minha avaliação deste ponto"
                  : "Avaliar este ponto"
              }
              accessibilityHint="Abre a tela de avaliação do ponto de recarga."
              accessibilityState={{ disabled: isLoadingAction }}
              disabled={isLoadingAction}
              style={({ pressed, hovered }: PressableVisualState) => [
                styles.reviewCtaButton,
                hovered && !pressed ? styles.hoverFeedback : null,
                pressed ? styles.buttonPressed : null,
              ]}
              onPress={handleOpenReview}
            >
              <Star size={18} color={colors.white} strokeWidth={2.4} />
              <Text style={styles.reviewCtaText}>
                {userStationReview
                  ? "Editar minha avaliação"
                  : "Avaliar este ponto"}
              </Text>
            </Pressable>

            {stationReviews.length > 0 ? (
              <View style={styles.userReviewsList}>
                {stationReviews.map((review) => (
                  <View key={review.id} style={styles.userReviewCard}>
                    {review === userReviewCard ? (
                      <Image
                        source={imagemPerfilUsuario}
                        style={styles.avatarImage}
                        accessible={false}
                        accessibilityIgnoresInvertColors
                      />
                    ) : (
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {getUserInitials(review.userName)}
                        </Text>
                      </View>
                    )}

                    <View style={styles.userReviewContent}>
                      <Text style={styles.userName}>{review.userName}</Text>
                      <Text style={styles.userComment}>
                        {review === userReviewCard
                          ? identificacaoDados.avaliacoesLocais.rotulo
                          : identificacaoDados.avaliacoesExemplo.rotulo}
                      </Text>

                      <Text style={styles.userStars}>
                        {getRatingStars(review.rating)}
                      </Text>

                      <Text style={styles.userComment}>{review.comment}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyReviewCard}>
                <Text style={styles.emptyReviewTitle}>
                  Ainda não há comentários recentes
                </Text>

                <Text style={styles.emptyReviewText}>
                  Seja uma das primeiras pessoas a avaliar este ponto.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.bottomActions}>
        {connectionError ? (
          <Text accessibilityRole="alert" accessibilityLiveRegion="assertive" style={styles.connectionError}>
            {connectionError}
          </Text>
        ) : null}
        <View style={styles.bottomActionRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver mapa"
            accessibilityState={{ disabled: isLoadingAction }}
            style={({ pressed, hovered }: PressableVisualState) => [
              styles.secondaryActionButton,
              hovered && !pressed ? styles.hoverFeedback : null,
              pressed ? styles.buttonPressed : null,
            ]}
            disabled={isLoadingAction}
            onPress={voltarAoMapa}
          >
            <Text style={styles.secondaryActionText}>Ver mapa</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Iniciar rota para ${station.name}`}
            accessibilityHint="Mostra o aviso de funcionamento antes de escolher Google Maps ou Waze."
            accessibilityState={{ disabled: isLoadingAction }}
            style={({ pressed, hovered }: PressableVisualState) => [
              styles.primaryActionButton,
              hovered && !pressed ? styles.hoverFeedback : null,
              pressed ? styles.primaryButtonPressed : null,
            ]}
            disabled={isLoadingAction}
            onPress={() => {
              triggerImpact();
              void handleStartRoute();
            }}
          >
            <Text style={styles.primaryActionText}>Iniciar rota</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal
        visible={isRouteDialogOpen}
        transparent
        animationType="fade"
        onRequestClose={() => !isLoadingAction && setIsRouteDialogOpen(false)}
      >
        {modalStep === "confirmation" ? (
          <RoutingModalPermission next={handleNext} onCancel={() => setIsRouteDialogOpen(false)} />
        ) : (
          <RoutingModalRoutes
            station={station}
            origin={routeLocation?.coords}
            openDialog={setIsRouteDialogOpen}
          />
        )}
      </Modal>

      <LoadingOverlay visible={isLoadingAction} message="Preparando ação..." />
    </ScreenTransition>
  );
}
