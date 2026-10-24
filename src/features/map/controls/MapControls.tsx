import { useState } from "react";
import { Text, View } from "react-native";
import { Crosshair, Milestone } from "lucide-react-native";

import { PressableScale } from "../../../components";
import { useMapArea } from "../../../context/MapContext";
import { useTelaComPreferencias } from "../../../hooks/useTelaComPreferencias";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import type { ControleMapaAtivo } from "./MapControls.types";
import baseStyles, { colors as baseColors } from "./MapControls.styles";
import { alterarZoomMapa } from "./MapControls.utils";

export function MapControls() {
  const { styles, colors } = useTelaComPreferencias(baseStyles, baseColors);
  const reduceMotion = useReducedMotion();
  const {
    state: { origin },
    actions: { planTrip },
    viewport: { compactControls, locating, region, recenter },
    meta: { mapRef, regionRef },
  } = useMapArea();
  const [controleMapaAtivo, setControleMapaAtivo] =
    useState<ControleMapaAtivo>(null);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.fixedMapControls,
        compactControls ? styles.mapControlsCompact : null,
      ]}
    >
      <View
        style={[styles.zoomPill, compactControls ? styles.zoomPillCompact : null]}
      >
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Aumentar zoom do mapa"
          accessibilityHint="Aproxima a visualização do mapa."
          pressedScale={0.92}
          style={[
            styles.zoomPillButton,
            controleMapaAtivo === "aproximar"
              ? styles.zoomPillButtonActive
              : null,
          ]}
          onPressIn={() => setControleMapaAtivo("aproximar")}
          onPressOut={() => setControleMapaAtivo(null)}
          onPress={() =>
            alterarZoomMapa(
              "aproximar",
              mapRef,
              regionRef,
              region,
              reduceMotion,
            )
          }
        >
          <Text allowFontScaling={false} style={styles.mapControlText}>
            +
          </Text>
        </PressableScale>

        <View
          style={[
            styles.zoomPillDivider,
            compactControls ? styles.zoomDividerCompact : null,
          ]}
        />

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Diminuir zoom do mapa"
          accessibilityHint="Afasta a visualização do mapa."
          pressedScale={0.92}
          style={[
            styles.zoomPillButton,
            controleMapaAtivo === "afastar"
              ? styles.zoomPillButtonActive
              : null,
          ]}
          onPressIn={() => setControleMapaAtivo("afastar")}
          onPressOut={() => setControleMapaAtivo(null)}
          onPress={() =>
            alterarZoomMapa("afastar", mapRef, regionRef, region, reduceMotion)
          }
        >
          <Text allowFontScaling={false} style={styles.mapControlText}>
            −
          </Text>
        </PressableScale>
      </View>

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Centralizar origem demonstrativa: ${origin.nome}`}
        accessibilityHint="Centraliza na origem selecionada nas configurações. Sem GPS."
        accessibilityState={{ busy: locating }}
        pressedScale={0.94}
        style={[
          styles.mapControlButton,
          controleMapaAtivo === "centralizar"
            ? styles.mapControlButtonActive
            : null,
          locating ? styles.mapControlButtonLoading : null,
        ]}
        onPressIn={() => setControleMapaAtivo("centralizar")}
        onPressOut={() => setControleMapaAtivo(null)}
        onPress={recenter}
        disabled={locating}
      >
        <Crosshair size={25} color={colors.primary} strokeWidth={2.2} />
      </PressableScale>

      <PressableScale
        accessibilityRole="button"
        accessibilityLabel="Planejar viagem"
        accessibilityHint="Abre o planejador de rota com paradas de recarga estimadas."
        pressedScale={0.94}
        style={styles.mapControlButton}
        onPress={planTrip}
      >
        <Milestone size={22} color={colors.primary} strokeWidth={2.2} />
      </PressableScale>
    </View>
  );
}
