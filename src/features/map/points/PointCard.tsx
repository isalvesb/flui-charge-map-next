import { Text, View } from "react-native";
import { ChevronRight, Star, Zap } from "lucide-react-native";

import { PressableScale } from "../../../components";
import { useMapContext } from "../../../context/MapContext";
import { useTelaComPreferencias } from "../../../hooks/useTelaComPreferencias";
import type { PointCardProps } from "./PointCard.types";
import baseStyles, { colors as baseColors } from "./PointCard.styles";
import {
  apresentarPonto,
  obterApresentacaoDoAlcance,
} from "./PointCard.utils";

export function PointCard({
  station,
  hidden,
  onPress,
  onLayout,
}: PointCardProps) {
  const { styles, colors } = useTelaComPreferencias(baseStyles, baseColors);
  const {
    state: { now, batteryPercent, vehicleRangeKm },
  } = useMapContext();
  const point = apresentarPonto(
    station,
    now,
    vehicleRangeKm,
    batteryPercent,
    colors,
  );
  const CriterioIcon = point.criterioIcon;
  const {
    icone: IconeAlcance,
    cor: corAlcance,
    fundo: corFundoAlcance,
    rotulo: textoAlcance,
  } = obterApresentacaoDoAlcance(point.alcance.nivel, colors);
  const legendaAlcance =
    point.alcance.nivel === "foraDeAlcance"
      ? `Fora do alcance atual, faltariam ${point.alcance.kmFaltantes} km`
      : `Chegada estimada com ${point.alcance.bateriaAoChegarPercent}% de bateria`;

  return (
    <PressableScale
      tabIndex={hidden ? -1 : 0}
      accessibilityRole="button"
      accessibilityLabel={`${point.nomeEstacao}. ${point.criterioLabel}. ${point.address}. ${point.status}. Nota ${point.rating}. ${point.power}. ${point.distancia} em linha reta. ${legendaAlcance}.`}
      accessibilityHint="Abre a ficha detalhada do ponto de recarga."
      style={styles.pointCard}
      onPress={onPress}
      onLayout={onLayout}
    >
      <View style={styles.pointCardTopRow}>
        <View style={styles.pointCardTags}>
          <View style={styles.pointBadge}>
            <CriterioIcon size={12} color={colors.primary} strokeWidth={2.4} />
            <Text style={styles.pointBadgeText}>{point.criterioLabel}</Text>
          </View>

          <View
            style={[
              styles.pointAutonomiaChip,
              { backgroundColor: corFundoAlcance },
            ]}
          >
            <IconeAlcance size={12} color={corAlcance} strokeWidth={2.4} />

            <Text
              style={[styles.pointAutonomiaChipText, { color: corAlcance }]}
            >
              {textoAlcance}
            </Text>
          </View>
        </View>

        <ChevronRight size={18} color={colors.textLight} strokeWidth={2.2} />
      </View>

      <Text style={styles.pointStationName}>{point.nomeEstacao}</Text>
      <Text style={styles.pointAddress}>{point.address}</Text>

      <Text style={styles.pointAddress}>{point.distancia} em linha reta</Text>
      <View style={styles.pointInlineMetaRow}>
        <View style={styles.metaRow}>
          <View
            style={[styles.statusDot, { backgroundColor: point.statusColor }]}
          />
          <Text style={styles.metaText}>{point.status}</Text>
        </View>

        <View style={styles.metaRow}>
          <Star
            size={12}
            color={colors.yellowDark}
            fill={colors.yellowDark}
            strokeWidth={2}
          />
          <Text style={styles.metaText}>{point.rating}</Text>
        </View>

        <View style={styles.metaRow}>
          <Zap
            size={12}
            color={colors.textLight}
            fill={colors.textLight}
            strokeWidth={2}
          />
          <Text style={styles.metaText}>{point.power}</Text>
        </View>
      </View>
    </PressableScale>
  );
}
