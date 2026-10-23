import { useConnectivity } from "../../context/ConnectivityContext";
import { ConnectionNotice } from "../../components/ConnectionNotice";
import { openExternalRoute } from "../../utils/externalRoute";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  useWindowDimensions,
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
import {
  planejarViagem,
  describeTripStops,
  podeIniciarViagem,
  type ParadaDeViagem,
} from "../../utils/tripPlanner";
import { styles as baseStyles } from "./TripPlannerScreen.styles";
import { getTripReadingLayout, shouldStackTripStats } from "./tripLayout";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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
  const { styles, colors, isDarkMode, fontScale } = useTelaComPreferencias(baseStyles);
  const { width, fontScale: systemFontScale } = useWindowDimensions();
  const { stacked } = getTripReadingLayout(width, fontScale, systemFontScale);
  // Começa empilhado tanto na exportação quanto na primeira renderização cliente.
  // A largura medida muda os estilos em conjunto, depois da hidratação.
  const [statsWidth, setStatsWidth] = useState(0);
  const stackedStats = shouldStackTripStats(statsWidth, fontScale, systemFontScale);
  const reducedMotion = useReducedMotion();
  const [footerHeight, setFooterHeight] = useState(140);
  const { userPreferences, demoOrigin } = useAppPreferences();
  const { checkConnection } = useConnectivity();
  const vehicleRangeKm = userPreferences.vehicleRangeKm;
  const batteryPercent = userPreferences.batteryPercent;

  const [originId, setOriginId] = useState(demoOrigin.id);
  const [destinationId, setDestinationId] = useState(
    destinosDemonstrativos[0].id,
  );
  const [seletorAberto, setSeletorAberto] = useState<SeletorAberto>(null);
  const [erroDeRota, setErroDeRota] = useState<string | null>(null);
  const [isIniciandoViagem, setIsIniciandoViagem] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const routeCardTop = useRef(0);

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

  const podeIniciar = podeIniciarViagem(plano);

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
    if (isIniciandoViagem || !podeIniciar) {
      return;
    }

    const alvo: ParadaDeViagem | Coordenada =
      plano.paradas[0] ?? destinoSelecionado;
    const provider = userPreferences.preferredRouteApp;

    setIsIniciandoViagem(true);
    setErroDeRota(null);

    try {
      setErroDeRota(await openExternalRoute(alvo, provider, origemSelecionada, Linking, checkConnection));
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

    const opcoesDestino = destinosDemonstrativos.map((destino) => {
      const preview = planejarViagem(origemSelecionada, destino, vehicleRangeKm, batteryPercent);
      return {
        id: destino.id,
        titulo: destino.nome,
        subtitulo: describeTripStops(preview),
        selecionado: destino.id === destinationId,
        onPress: () => { setDestinationId(destino.id); setSeletorAberto(null); },
      };
    });

    const opcoes = seletorAberto === "origem" ? opcoesOrigem : opcoesDestino;

    return (
      <Modal
        visible={seletorAberto !== null}
        transparent
        animationType={reducedMotion ? "none" : "slide"}
        onRequestClose={() => setSeletorAberto(null)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            accessibilityRole="button"
            accessibilityLabel="Fechar seletor"
            onPress={() => setSeletorAberto(null)}
          />
          <View style={styles.modalSheet} accessibilityViewIsModal>
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
                  accessibilityLabel={opcao.titulo}
                  accessibilityHint={opcao.subtitulo}
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
          </View>
        </View>
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

        <ConnectionNotice />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: footerHeight + 24 }]}
          showsVerticalScrollIndicator={false}
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

          <View style={[styles.card, styles.autonomyRow, stacked && styles.stackedRow]}>
            <View style={styles.autonomyTile}>
              <View style={styles.autonomyIconBox}>
                <BatteryFull size={18} color={colors.primary} strokeWidth={2.2} />
              </View>
              <View style={styles.autonomyTextGroup}>
                <Text style={styles.autonomyLabel}>
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
                <Text style={styles.autonomyLabel}>
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
                title={`Origem: ${origemSelecionada.nome}`}
                accessibilityLabel={`Origem: ${origemSelecionada.nome}`}
              >
                <View style={styles.markerOrigin} />
              </Marker>

              {plano.paradas.map((parada, index) => (
                <Marker
                  key={parada.id}
                  coordinate={parada}
                  title={`Parada ${index + 1}: ${parada.nome}`}
                  description={`Chegada ${parada.bateriaChegadaPercent}% · saída ${parada.bateriaSaidaPercent}% · posição simulada`}
                  accessibilityLabel={`Parada ${index + 1} de ${plano.paradas.length}: ${parada.nome}`}
                >
                  <View style={styles.markerStop}>
                    <Text style={styles.stopNumber}>{index + 1}</Text>
                  </View>
                </Marker>
              ))}

              <Marker
                coordinate={destinoSelecionado}
                title={`Destino: ${destinoSelecionado.nome}`}
                accessibilityLabel={`Destino: ${destinoSelecionado.nome}`}
              >
                <View style={styles.markerDestination}>
                  <MapPin size={16} color={colors.white} strokeWidth={2.4} />
                </View>
              </Marker>
            </MapView>
          </View>

            <PressableScale accessibilityRole="button" accessibilityLabel="Ver trechos da viagem" style={[styles.scrollHint, { minHeight: 48 }]}
              onPress={() => scrollRef.current?.scrollTo({ y: routeCardTop.current, animated: !reducedMotion })}>
              <Text style={styles.scrollHintText}>
                Ver trechos da viagem
              </Text>
              <ChevronDown size={14} color={colors.textMuted} strokeWidth={2.4} />
            </PressableScale>

          <View style={styles.card} onLayout={(event) => { routeCardTop.current = event.nativeEvent.layout.y; }}>
            <View style={[styles.routeCardHeader, stacked && styles.stackedRow]}>
              <View style={styles.routeCardTitleGroup}>
                <View style={styles.routeCardIconBox}>
                  <Milestone size={18} color={colors.primary} strokeWidth={2.2} />
                </View>
                <View style={styles.routeCardTitleText}>
                  <Text style={styles.routeCardTitle}>
                    Resumo da viagem
                  </Text>
                  <Text style={styles.routeCardSubtitle}>
                    Estimativas em linha reta
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

            <View testID="viagem-resumo-paradas" style={styles.stopsSummary} accessibilityLiveRegion="polite">
              <Text style={styles.stopsSummaryTitle}>{describeTripStops(plano)}</Text>
              {plano.paradas.map((parada, index) => (
                <Text key={parada.id} style={styles.stopsSummaryText}>{index + 1}. {parada.nome}</Text>
              ))}
            </View>

            <View
              style={[styles.statsRow, stackedStats && styles.statsStack]}
              onLayout={(event) => setStatsWidth(event.nativeEvent.layout.width)}
            >
              <View style={[styles.statItem, stackedStats && styles.statItemStack]}>
                <Milestone size={16} color={colors.textMuted} strokeWidth={2} />
                <Text style={styles.statValue}>
                  {plano.distanciaTotalKm} km
                </Text>
                <Text style={styles.statLabel}>Distância total</Text>
              </View>

              <View style={[styles.statDivider, stackedStats && styles.statDividerStack]} />

              <View style={[styles.statItem, stackedStats && styles.statItemStack]}>
                <Clock3 size={16} color={colors.textMuted} strokeWidth={2} />
                <Text style={styles.statValue}>
                  {formatarDuracao(plano.tempoEstimadoMin)}
                </Text>
                <Text style={styles.statLabel}>Deslocamento estimado</Text>
              </View>

              <View style={[styles.statDivider, stackedStats && styles.statDividerStack]} />

              <View style={[styles.statItem, stackedStats && styles.statItemStack]}>
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
                    : "A viagem não preserva a reserva mínima de 5% na chegada com as paradas demonstrativas disponíveis."}
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
                      Saída {batteryPercent}%
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
                      <Text style={styles.stopNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.timelineConnector} />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineName}>Parada {index + 1} · {parada.nome}</Text>
                    <Text style={styles.timelineMeta}>
                      {formatarDuracao(parada.tempoTrechoMin)} ·{" "}
                      {parada.distanciaTrechoKm} km · {parada.powerKw} kW
                    </Text>
                    <View style={styles.timelineBatteryRow}>
                      <Text style={styles.timelineBatteryText}>
                        Chegada {parada.bateriaChegadaPercent}% → saída {parada.bateriaSaidaPercent}%
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
                  {podeIniciar && plano.paradas.length > 0 ? (
                    <Text style={styles.timelineMeta}>
                      Último trecho · ≈{plano.trechoFinal.distanciaKm} km · {formatarDuracao(plano.trechoFinal.tempoMin)}
                    </Text>
                  ) : podeIniciar ? <Text style={styles.timelineMeta}>Trecho direto · sem paradas de recarga</Text> : null}
                  <View style={styles.timelineBatteryRow}>
                    <Text
                      style={[
                        styles.timelineBatteryText,
                        { color: tomDoAlcance.fg },
                      ]}
                    >
                      {podeIniciar
                        ? `Chegada estimada · ${plano.bateriaChegadaDestinoPercent}%`
                        : "Viagem bloqueada · reserva mínima de 5%"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.disclaimerText}>
            {identificacaoDados.viagem.aviso}
            {"\n"}O tempo de deslocamento não inclui espera nem duração das recargas. Conectores e funcionamento das paradas não são confirmados por esta simulação.
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

      <View style={styles.footer} onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}>
        <Text style={styles.footerCaption}>
          {podeIniciar
            ? `Navegação até ${proximoDestinoNome}`
            : "Reserva mínima de 5% não preservada na chegada"}
        </Text>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={podeIniciar ? "Iniciar viagem" : "Viagem indisponível"}
          accessibilityHint={
            podeIniciar
              ? `Abre o aplicativo de navegação até ${proximoDestinoNome}.`
              : "A viagem não preserva a reserva mínima de 5% com as paradas demonstrativas disponíveis."
          }
          accessibilityState={{ disabled: !podeIniciar }}
          disabled={!podeIniciar || isIniciandoViagem}
          style={[
            styles.startButton,
            !podeIniciar ? styles.startButtonDisabled : null,
          ]}
          onPress={abrirNavegacao}
        >
          <Navigation2 size={18} color={colors.white} strokeWidth={2.2} />
          <Text style={styles.startButtonText}>
            {podeIniciar ? "Iniciar viagem" : "Viagem indisponível"}
          </Text>
        </PressableScale>
      </View>

      {renderizarSeletor()}
    </SafeAreaView>
  );
}
