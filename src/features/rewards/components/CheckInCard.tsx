import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check, Sparkles } from "lucide-react-native";
import { useAppPreferences } from "../../../context/PreferencesContext";
import { CHIPS_AVALIACAO } from "../checkIn";
import type { AppTheme } from "../../../theme/appTheme";

type CheckInProps = {
  agora: Date;
  chips: string[];
  onToggleChip: (chip: string) => void;
};

export function CheckInCard({ agora, chips, onToggleChip }: CheckInProps) {
  const { theme, scale } = useAppPreferences();
  const styles = useMemo(() => createStyles(theme, scale), [theme, scale]);
  const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <View style={styles.card}>
      <Text style={styles.badge}>Check-in simulado</Text>
      <Text style={styles.question}>Como foi sua recarga?</Text>
      <Text style={styles.meta}>Hoje às {hora}</Text>
      <Text style={styles.label}>O que se destacou?</Text>
      <View style={styles.chipRow}>
        {CHIPS_AVALIACAO.map((chip) => {
          const ativo = chips.includes(chip);
          return (
            <Pressable
              key={chip}
              accessibilityRole="checkbox"
              accessibilityLabel={chip}
              accessibilityState={{ checked: ativo }}
              onPress={() => onToggleChip(chip)}
              style={[styles.chip, ativo && styles.chipAtivo]}
            >
              {ativo ? <Check size={14} color={theme.primary} /> : null}
              <Text style={[styles.chipText, ativo && styles.chipTextAtivo]}>{chip}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function BonusCard() {
  const { theme, scale } = useAppPreferences();
  const styles = useMemo(() => createStyles(theme, scale), [theme, scale]);

  return (
    <View style={styles.bonus} accessible accessibilityLabel="Mais 50 pontos Flui ao concluir sua avaliação">
      <View style={styles.bonusIcon}>
        <Sparkles size={18} color={theme.onPrimary} />
      </View>
      <View style={styles.flex}>
        <View style={styles.bonusTitleRow}>
          <Text style={styles.bonusTitle}>+50 pontos Flui</Text>
          <Text style={styles.bonusTag}>BÔNUS</Text>
        </View>
        <Text style={styles.bonusText}>Ganhe pontos ao concluir sua avaliação!</Text>
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme, scale: (size: number) => number) {
  return StyleSheet.create({
    flex: { flex: 1 },
    card: {
      backgroundColor: theme.primarySoft,
      borderRadius: 20,
      padding: 16,
      gap: 8,
      marginBottom: 12,
    },
    badge: {
      alignSelf: "flex-start",
      color: theme.text,
      fontSize: scale(11),
      fontWeight: "700",
      backgroundColor: theme.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      overflow: "hidden",
    },
    question: { color: theme.primary, fontSize: scale(16), fontWeight: "700" },
    meta: { color: theme.textMuted, fontSize: scale(12) },
    label: { color: theme.textMuted, fontSize: scale(11), fontWeight: "700", marginTop: 4 },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      minHeight: 48,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipAtivo: { backgroundColor: theme.primarySoftStrong, borderColor: theme.primary },
    chipText: { color: theme.textMuted, fontSize: scale(13), fontWeight: "600" },
    chipTextAtivo: { color: theme.primary },
    bonus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: theme.primarySoft,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
    },
    bonusIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    bonusTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    bonusTitle: { color: theme.primary, fontSize: scale(15), fontWeight: "700" },
    bonusTag: {
      color: theme.primary,
      fontSize: scale(10),
      fontWeight: "700",
      backgroundColor: theme.surface,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    bonusText: { color: theme.textMuted, fontSize: scale(12) },
  });
}
