import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href } from "expo-router";
import {
  ArrowLeft,
  BatteryFull,
  ChevronDown,
  ChevronRight,
  Clock3,
  MapPin,
  Milestone,
  Navigation2,
  TriangleAlert,
  Zap,
} from "lucide-react-native";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type MapViewHandle,
  type Region,
} from "../../components/MapSurface";
import { PressableScale, ScreenTransition } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";
import { origensDemonstrativas } from "../../data/demonstracao";
import {
  destinosDemonstrativos,
  obterDestinoDemonstrativo,
  type DestinoViagem,
} from "../../data/destinosViagem";
import { identificacaoDados } from "../../data/identificacaoDados";
import { calcularAutonomiaAtualKm } from "../../utils/autonomia";
import { planejarViagem, type ParadaDeViagem } from "../../utils/tripPlanner";
import { getStationRouteUrl } from "../stations/stationPresentation";
import { styles as baseStyles } from "./TripPlannerScreen.styles";

type Coordenada = { latitude: number; longitude: number };

type SeletorAberto = "origem" | "destino" | null;

function formatarDuracao(minutos: number) {
  const horas = Math.floor(minutos / 60);
  const resto = Math.round(minutos % 60);

  if (horas <= 0) {
    return `${resto}min`;
  }

  return `${horas}h${resto > 0 ? `${resto.toString().padStart(2, "0")}min` : ""}`;
}

function calcularRegiaoDoMapa(pontos: Coordenada[]): Region {
  const latitudes = pontos.map((ponto) => ponto.latitude);
  const longitudes = pontos.map((ponto) => ponto.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(0.09, (maxLat - minLat) * 1.7),
    longitudeDelta: Math.max(0.09, (maxLng - minLng) * 1.7),
  };
}

export default function TripPlannerScreen() {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(baseStyles);
  const { userPreferences, demoOrigin } = useAppPreferences();
  const vehicleRangeKm = userPreferences.vehicleRangeKm;
  const batteryPercent = userPreferences.batteryPercent;

  const [originId, setOriginId] = useState(demoOrigin.id);
  const [destinationId, setDestinationId] = useState(
    destinosDemonstrativos[0].id,
  );
  const [seletorAberto, setSeletorAberto] = useState<SeletorAberto>(null);
  const [erroDeRota, setErroDeRota] = useState<string | null>(null);
  const [isIniciandoViagem, setIsIniciandoViagem] = useState(false);
  const [mostrarDicaDeRolagem, setMostrarDicaDeRolagem] = useState(true);

  const origemSelecionada = useMemo(() => {
    return (
      origensDemonstrativas.find((origem) => origem.id === originId) ??
      demoOrigin
    );
  }, [demoOrigin, originId]);

  const destinoSelecionado = useMemo<DestinoViagem>(() => {
    return obterDestinoDemonstrativo(destinationId);
  }, [destinationId]);

  const plano = useMemo(() => {
    return planejarViagem(
      origemSelecionada,
      destinoSelecionado,
      vehicleRangeKm,
      batteryPercent,
    );
  }, [origemSelecionada, destinoSelecionado, vehicleRangeKm, batteryPercent]);

  const autonomiaAtualKm = Math.round(
    calcularAutonomiaAtualKm(vehicleRangeKm, batteryPercent),
  );

  const regiaoDoMapa = useMemo(() => {
    return calcularRegiaoDoMapa([
      origemSelecionada,
      ...plano.paradas,
      destinoSelecionado,
    ]);
  }, [origemSelecionada, plano.paradas, destinoSelecionado]);

  const mapRef = useRef<MapViewHandle | null>(null);
  const isPrimeiraRegiaoRef = useRef(true);

  useEffect(() => {
    if (isPrimeiraRegiaoRef.current) {
      isPrimeiraRegiaoRef.current = false;
      return;
    }

    mapRef.current?.animateToRegion(regiaoDoMapa, 400);
  }, [regiaoDoMapa]);

  const corDaBateria =
    batteryPercent >= 50
      ? colors.success
      : batteryPercent >= 25
        ? colors.warning
        : colors.danger;

  const tomDoAlcance = useMemo(() => {
    if (plano.nivelDeAlcance === "tranquilo") {
      return { bg: colors.successLight, fg: colors.success };
    }

    if (plano.nivelDeAlcance === "apertado") {
      return { bg: colors.warningLight, fg: colors.warning };
    }

    return { bg: colors.dangerSoft, fg: colors.danger };
  }, [colors, plano.nivelDeAlcance]);

  const voltar = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/map" as Href);
  };

  const proximoDestinoNome = plano.paradas[0]?.nome ?? destinoSelecionado.nome;

  const abrirNavegacao = async () => {
    if (isIniciandoViagem) {
      return;
    }

    const alvo: ParadaDeViagem | Coordenada =
      plano.paradas[0] ?? destinoSelecionado;
    const provider = userPreferences.preferredRouteApp;
    const url = getStationRouteUrl(alvo, provider, origemSelecionada);

    setIsIniciandoViagem(true);
    setErroDeRota(null);

    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        setErroDeRota(
          "Seu dispositivo não conseguiu abrir o aplicativo de mapas.",
        );
        return;
      }

      await Linking.openURL(url);
    } catch {
      setErroDeRota(
        "Não foi possível abrir a rota agora. Tente novamente em alguns instantes.",
      );
    } finally {
      setIsIniciandoViagem(false);
    }
  };

  const renderizarSeletor = () => {
    const opcoesOrigem = origensDemonstrativas.map((origem) => ({
      id: origem.id,
      titulo: origem.nome,
      subtitulo: "Origem demonstrativa",
      selecionado: origem.id === originId,
      onPress: () => {
        setOriginId(origem.id);
        setSeletorAberto(null);
      },
    }));

    const opcoesDestino = destinosDemonstrativos.map((destino) => ({
      id: destino.id,
      titulo: destino.nome,
      subtitulo: `${destino.paradas.length} parada${destino.paradas.length === 1 ? "" : "s"} de recarga no trajeto`,
      selecionado: destino.id === destinationId,
      onPress: () => {
        setDestinationId(destino.id);
        setSeletorAberto(null);
      },
    }));

    const opcoes = seletorAberto === "origem" ? opcoesOrigem : opcoesDestino;

    return (
      <Modal
        visible={seletorAberto !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSeletorAberto(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSeletorAberto(null)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle} accessibilityRole="header">
              {seletorAberto === "origem"
                ? "Escolher origem"
                : "Escolher destino"}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {opcoes.map((opcao) => (
                <Pressable
                  key={opcao.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: opcao.selecionado }}
                  style={({ pressed }) => [
                    styles.modalOption,
                    opcao.selecionado ? styles.modalOptionSelected : null,
                    pressed ? styles.modalOptionPressed : null,
                  ]}
                  onPress={opcao.onPress}
                >
                  <Text style={styles.modalOptionTitle}>{opcao.titulo}</Text>
                  <Text style={styles.modalOptionSubtitle}>
                    {opcao.subtitulo}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              accessibilityRole="button"
              style={styles.modalCloseButton}
              onPress={() => setSeletorAberto(null)}
            >
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScreenTransition style={styles.content}>
        <View style={styles.header}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.backButton}
            onPress={voltar}
          >
            <ArrowLeft size={20} color={colors.primaryDark} strokeWidth={2.2} />
          </PressableScale>

          <Text style={styles.headerTitle}>Planejador de viagens</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            if (
              mostrarDicaDeRolagem &&
              event.nativeEvent.contentOffset.y > 24
            ) {
              setMostrarDicaDeRolagem(false);
            }
          }}
        >
          <View style={styles.card}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Origem: ${origemSelecionada.nome}`}
              accessibilityHint="Toque para escolher outra origem demonstrativa."
              style={({ pressed }) => [
                styles.routeField,
                pressed ? styles.routeFieldPressed : null,
              ]}
              onPress={() => setSeletorAberto("origem")}
            >
              <View style={styles.routeDotWrap}>
                <View style={styles.routeDotOrigin} />
              </View>
              <View style={styles.routeFieldText}>
                <Text style={styles.routeFieldLabel}>De</Text>
                <Text style={styles.routeFieldValue}>
                  {origemSelecionada.nome}
                </Text>
              </View>
            </Pressable>

            <View style={styles.routeDivider} />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Destino: ${destinoSelecionado.nome}`}
              accessibilityHint="Toque para escolher outro destino demonstrativo."
              style={({ pressed }) => [
                styles.routeField,
                pressed ? styles.routeFieldPressed : null,
              ]}
              onPress={() => setSeletorAberto("destino")}
            >
              <View style={styles.routeDotWrap}>
                <MapPin size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.routeFieldText}>
                <Text style={styles.routeFieldLabel}>Para</Text>
                <Text style={styles.routeFieldValue}>
                  {destinoSelecionado.nome}
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={[styles.card, styles.autonomyRow]}>
            <View style={styles.autonomyTile}>
              <View style={styles.autonomyIconBox}>
                <BatteryFull size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.autonomyTextGroup}>
                <Text style={styles.autonomyLabel} numberOfLines={1}>
                  Autonomia estimada
                </Text>
                <Text style={styles.autonomyValue}>{autonomiaAtualKm} km</Text>
              </View>
            </View>

            <View style={styles.autonomyTile}>
              <View style={styles.autonomyIconBox}>
                <Zap size={18} color={corDaBateria} strokeWidth={2.2} />
              </View>
              <View style={styles.autonomyTextGroup}>
                <Text style={styles.autonomyLabel} numberOfLines={1}>
                  Bateria atual
                </Text>
                <Text style={styles.autonomyValue}>{batteryPercent}%</Text>
                <View style={styles.batteryBarTrack}>
                  <View
                    style={[
                      styles.batteryBarFill,
                      {
                        width: `${batteryPercent}%`,
                        backgroundColor: corDaBateria,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.mapCard}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={regiaoDoMapa}
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsCompass={false}
            >
              <Marker
                coordinate={origemSelecionada}
                accessibilityLabel={`Origem: ${origemSelecionada.nome}`}
              >
                <View style={styles.markerOrigin} />
              </Marker>

              {plano.paradas.map((parada) => (
                <Marker
                  key={parada.id}
                  coordinate={parada}
                  accessibilityLabel={`Parada de recarga: ${parada.nome}`}
                >
                  <View style={styles.markerStop}>
                    <Zap size={14} color={colors.white} strokeWidth={2.4} />
                  </View>
                </Marker>
              ))}

              <Marker
                coordinate={destinoSelecionado}
                accessibilityLabel={`Destino: ${destinoSelecionado.nome}`}
              >
                <View style={styles.markerDestination}>
                  <MapPin size={16} color={colors.white} strokeWidth={2.4} />
                </View>
              </Marker>
            </MapView>
          </View>

          {mostrarDicaDeRolagem ? (
            <View style={styles.scrollHint}>
              <Text style={styles.scrollHintText}>
                Role para ver a rota completa
              </Text>
              <ChevronDown size={14} color={colors.textMuted} strokeWidth={2.4} />
            </View>
          ) : null}

          <View style={styles.card}>
            <View style={styles.routeCardHeader}>
              <View style={styles.routeCardTitleGroup}>
                <View style={styles.routeCardIconBox}>
                  <Milestone size={18} color={colors.primary} strokeWidth={2.2} />
                </View>
                <View style={styles.routeCardTitleText}>
                  <Text style={styles.routeCardTitle} numberOfLines={1}>
                    Rota de viagem
                  </Text>
                  <Text style={styles.routeCardSubtitle} numberOfLines={1}>
                    Com paradas de recarga e autonomia
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Editar destino da viagem"
                style={styles.editButton}
                onPress={() => setSeletorAberto("destino")}
              >
                <Text style={styles.editButtonText}>Editar destino</Text>
                <ChevronRight size={14} color={colors.primary} strokeWidth={2.4} />
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Milestone size={16} color={colors.textMuted} strokeWidth={2} />
                <Text style={styles.statValue}>
                  {plano.distanciaTotalKm} km
                </Text>
                <Text style={styles.statLabel}>Distância total</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Clock3 size={16} color={colors.textMuted} strokeWidth={2} />
                <Text style={styles.statValue}>
                  {formatarDuracao(plano.tempoEstimadoMin)}
                </Text>
                <Text style={styles.statLabel}>Tempo estimado</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Zap size={16} color={colors.textMuted} strokeWidth={2} />
                <Text style={styles.statValue}>{plano.paradas.length}</Text>
                <Text style={styles.statLabel}>
                  {plano.paradas.length === 1 ? "parada" : "paradas"}
                </Text>
              </View>
            </View>

            {plano.nivelDeAlcance !== "tranquilo" ? (
              <View
                style={[
                  styles.warningBanner,
                  { backgroundColor: tomDoAlcance.bg },
                ]}
              >
                <View style={styles.warningIconBox}>
                  <TriangleAlert
                    size={18}
                    color={tomDoAlcance.fg}
                    strokeWidth={2.2}
                  />
                </View>
                <Text style={[styles.warningText, { color: tomDoAlcance.fg }]}>
                  {plano.nivelDeAlcance === "apertado"
                    ? `Autonomia limitada: chegada estimada com ${plano.bateriaChegadaDestinoPercent}% de bateria.`
                    : "Autonomia insuficiente para esta viagem com as paradas demonstrativas disponíveis."}
                </Text>
              </View>
            ) : null}

            <View>
              <View style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View
                    style={[styles.timelineIconCircle, styles.timelineIconOrigin]}
                  >
                    <Navigation2 size={13} color={colors.white} strokeWidth={2.4} />
                  </View>
                  <View style={styles.timelineConnector} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineName}>{origemSelecionada.nome}</Text>
                  <View style={styles.timelineBatteryRow}>
                    <Text
                      style={[styles.timelineBatteryText, { color: corDaBateria }]}
                    >
                      {batteryPercent}%
                    </Text>
                  </View>
                </View>
              </View>

              {plano.paradas.map((parada, index) => (
                <View key={parada.id} style={styles.timelineRow}>
                  <View style={styles.timelineRail}>
                    <View
                      style={[styles.timelineIconCircle, styles.timelineIconStop]}
                    >
                      <Zap size={13} color={colors.white} strokeWidth={2.4} />
                    </View>
                    <View style={styles.timelineConnector} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineName}>{parada.nome}</Text>
                    <Text style={styles.timelineMeta}>
                      {formatarDuracao(parada.tempoTrechoMin)} ·{" "}
                      {parada.distanciaTrechoKm} km · {parada.powerKw} kW
                    </Text>
                    <View style={styles.timelineBatteryRow}>
                      <Text style={styles.timelineBatteryText}>
                        {parada.bateriaChegadaPercent}% → {parada.bateriaSaidaPercent}%
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              <View style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View
                    style={[
                      styles.timelineIconCircle,
                      styles.timelineIconDestination,
                    ]}
                  >
                    <MapPin size={13} color={colors.white} strokeWidth={2.4} />
                  </View>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineName}>{destinoSelecionado.nome}</Text>
                  <View style={styles.timelineBatteryRow}>
                    <Text
                      style={[
                        styles.timelineBatteryText,
                        { color: tomDoAlcance.fg },
                      ]}
                    >
                      {plano.bateriaChegadaDestinoPercent}% na chegada
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.disclaimerText}>
            {identificacaoDados.viagem.aviso}
          </Text>

          {erroDeRota ? (
            <Text
              style={[styles.disclaimerText, { color: colors.danger }]}
              accessibilityRole="alert"
            >
              {erroDeRota}
            </Text>
          ) : null}
        </ScrollView>
      </ScreenTransition>

      <View style={styles.footer}>
        <Text style={styles.footerCaption} numberOfLines={1}>
          Navegação até {proximoDestinoNome}
        </Text>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Iniciar viagem"
          accessibilityHint={`Abre o aplicativo de navegação até ${proximoDestinoNome}.`}
          style={styles.startButton}
          onPress={abrirNavegacao}
        >
          <Navigation2 size={18} color={colors.white} strokeWidth={2.2} />
          <Text style={styles.startButtonText}>Iniciar viagem</Text>
        </PressableScale>
      </View>

      {renderizarSeletor()}
    </SafeAreaView>
  );
}
