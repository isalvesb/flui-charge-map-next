import { router, type Href } from "expo-router";
import { ArrowLeft, Info, Star } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PressableScale } from "@/src/components";
import { useAppPreferences } from "@/src/context/PreferencesContext";
import { RECOMPENSAS_DEMONSTRATIVAS } from "./catalog";
import { LevelCard } from "./components/LevelCard";
import { RewardCard } from "./components/RewardCard";
import { BONUS_POR_VISITA } from "./points";
import { createStyles } from "./RewardsScreen.styles";
import { usePontos } from "./usePontos";

export default function RewardsScreen() {
  const { theme, scale } = useAppPreferences();
  const styles = useMemo(() => createStyles(theme, scale), [theme, scale]);
  const pontos = usePontos();

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/map" as Href);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={voltar}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color={theme.text} />
        </PressableScale>
        <View style={styles.headerText}>
          <Text style={styles.title}>Flui Pontos</Text>
          <Text style={styles.subtitle}>Clube de benefícios EV</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {pontos ? (
          <LevelCard pontos={pontos} theme={theme} styles={styles} />
        ) : (
          <Text style={styles.loading}>Carregando seus pontos...</Text>
        )}

        <Text style={styles.sectionTitle}>Recompensas disponíveis</Text>
        <Text style={styles.sectionHint}>
          Resgate vouchers financiados pelas estações parceiras
        </Text>
        {RECOMPENSAS_DEMONSTRATIVAS.map((recompensa) => (
          <RewardCard
            key={recompensa.id}
            recompensa={recompensa}
            saldo={pontos?.saldo ?? 0}
            theme={theme}
            styles={styles}
          />
        ))}

        <Text style={styles.sectionTitle}>Como ganhar pontos</Text>
        <View style={styles.howCard}>
          <Star size={22} color={theme.primary} />
          <View style={styles.flex}>
            <Text style={styles.rowTitle}>Avaliar após recarregar</Text>
            <Text style={styles.rowText}>
              Confirme o funcionamento do plugee
            </Text>
          </View>
          <Text style={styles.rowBadge}>+{BONUS_POR_VISITA}pts</Text>
        </View>

        <View style={styles.disclaimer}>
          <Info size={16} color={theme.textMuted} />
          <Text style={styles.disclaimerText}>
            Recompensas simuladas no protótipo • Financiadas por parceiros
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
