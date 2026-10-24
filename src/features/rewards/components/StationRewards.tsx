import React, { useMemo } from "react";
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { router, type Href } from "expo-router";
import { Award, Star } from "lucide-react-native";
import { PressableScale } from "../../../components";
import { useAppPreferences } from "../../../context/PreferencesContext";
import type { AppTheme } from "../../../theme/appTheme";
import { usePontos } from "../usePontos";
import { BONUS_POR_VISITA } from "../points";

// Selo "Parceiro Flui" na ficha de postos parceiros.
export function SeloParceiro() {
  const { theme, scale } = useAppPreferences();
  const styles = useMemo(() => createStyles(theme, scale), [theme, scale]);
  return (
    <View style={styles.selo} accessible accessibilityLabel="Parceiro Flui">
      <Award size={14} color={theme.primary} />
      <Text style={styles.seloText}>Parceiro Flui</Text>
    </View>
  );
}

// Card "Avalie e ganhe" na ficha do posto. Leva para a avaliação do posto.
export function CardAvaliarEGanhar({ stationId }: { stationId: string }) {
  const { theme, scale } = useAppPreferences();
  const styles = useMemo(() => createStyles(theme, scale), [theme, scale]);
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={`Avalie e ganhe ${BONUS_POR_VISITA} pontos`}
      onPress={() => router.push(`/review?stationId=${encodeURIComponent(stationId)}` as Href)}
      style={styles.card}
    >
      <View style={styles.cardIcon}>
        <Star size={20} color={theme.onPrimary} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>Avalie e ganhe {BONUS_POR_VISITA} pontos</Text>
        <Text style={styles.cardText}>Sua avaliação ajuda outros motoristas</Text>
      </View>
    </PressableScale>
  );
}

type StatStyles = {
  statCard: StyleProp<ViewStyle>;
  statNumber: StyleProp<TextStyle>;
  statLabel: StyleProp<TextStyle>;
};

// Estatística "Pontos" no perfil, no mesmo formato dos outros cards de estatística.
export function PontosStatCard({ styles }: { styles: StatStyles }) {
  const pontos = usePontos();
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{pontos ? pontos.saldo.toLocaleString("pt-BR") : "0"}</Text>
      <Text style={styles.statLabel}>pontos</Text>
    </View>
  );
}

function createStyles(theme: AppTheme, scale: (size: number) => number) {
  return StyleSheet.create({
    flex: { flex: 1 },
    selo: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.primarySoftStrong,
    },
    seloText: { color: theme.primary, fontSize: scale(12), fontWeight: "700" },
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 64,
      padding: 14,
      borderRadius: 20,
      backgroundColor: theme.primarySoft,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    cardTitle: { color: theme.primary, fontSize: scale(15), fontWeight: "700" },
    cardText: { color: theme.textMuted, fontSize: scale(12) },
  });
}
