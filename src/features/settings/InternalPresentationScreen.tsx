import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { ArrowLeft, Check, ChevronDown, X } from "lucide-react-native";
import { LoadingOverlay, PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { origensDemonstrativas, type OrigemDemonstrativaId } from "../../data/demonstracao";
import { createSettingsStyles } from "./SettingsScreen.styles";

export default function InternalPresentationScreen() {
  return __DEV__ ? <PresentationControls /> : <Redirect href="/settings" />;
}

function PresentationControls() {
  const { theme, fontScale, userPreferences, updateDemoConfiguration, isLoadingPreferences, isSavingPreferences } = useAppPreferences();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [origemId, setOrigemId] = useState<OrigemDemonstrativaId>(userPreferences.demoOriginId);
  const [originMenuOpen, setOriginMenuOpen] = useState(false);
  const styles = useMemo(() => createSettingsStyles(theme, fontScale), [theme, fontScale]);
  const disabled = isLoadingPreferences || isSavingPreferences;
  const origin = origensDemonstrativas.find(item => item.id === origemId);
  useEffect(() => { setOrigemId(userPreferences.demoOriginId); }, [userPreferences.demoOriginId]);

  const save = async () => {
    if (disabled) return;
    setFeedback(null);
    try {
      // Veículo/autonomia pertencem à configuração do perfil; não são editáveis aqui.
      await updateDemoConfiguration({ vehicleName: userPreferences.vehicleName, vehicleRangeKm: userPreferences.vehicleRangeKm, demoOriginId: origemId });
      setFeedback("Origem salva neste dispositivo.");
    } catch { setFeedback("Não foi possível salvar. Tente novamente."); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <PressableScale accessibilityRole="button" accessibilityLabel="Voltar às configurações" style={styles.backButton} onPress={() => router.back()}><ArrowLeft color={theme.primary} size={22} /></PressableScale>
        <Text accessibilityRole="header" style={[styles.headerTitle, { flex: 1, textAlign: "center" }]}>Apresentação interna</Text>
        <View style={styles.hiddenResetButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionText}>Defina a origem do cenário de apresentação.</Text>
        <Text style={styles.fieldLabel}>Origem</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`Origem: ${origin?.nome ?? "Selecionar"}`} accessibilityState={{ expanded: originMenuOpen, disabled }} disabled={disabled}
          style={[styles.optionButton, { minHeight: 56, justifyContent: "space-between" }]} onPress={() => setOriginMenuOpen(true)}>
          <Text style={styles.optionTitle}>{origin?.nome}</Text>
          <ChevronDown size={22} color={theme.primary} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Salvar demonstração" disabled={disabled}
          style={{ minHeight: 54, marginTop: 24, padding: 14, borderRadius: 16, backgroundColor: theme.primary, opacity: disabled ? 0.55 : 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 }} onPress={() => void save()}>
          <Check size={22} color={theme.onPrimary} />
          <Text style={[styles.optionTitle, { color: theme.onPrimary }]}>Salvar</Text>
        </Pressable>
        {feedback ? <Text accessibilityLiveRegion="polite" style={[styles.sectionText, { backgroundColor: theme.primarySoft, padding: 14, borderRadius: 14, marginTop: 16 }]}>{feedback}</Text> : null}
      </ScrollView>
      <Modal visible={originMenuOpen} transparent animationType="fade" onRequestClose={() => setOriginMenuOpen(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }} accessibilityViewIsModal>
          <Pressable accessibilityRole="button" accessibilityLabel="Fechar opções de origem" style={{ position: "absolute", inset: 0 }} onPress={() => setOriginMenuOpen(false)} />
          <View style={{ width: "90%", maxWidth: 480, padding: 20, gap: 8, borderRadius: 20, backgroundColor: theme.surface }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text accessibilityRole="header" style={styles.optionTitle}>Selecionar origem</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar menu de origem" style={{ minHeight: 44, minWidth: 44, justifyContent: "center", alignItems: "center" }} onPress={() => setOriginMenuOpen(false)}><X size={22} color={theme.primary} /></Pressable>
            </View>
            {origensDemonstrativas.map(item => (
              <Pressable key={item.id} accessibilityRole="radio" accessibilityLabel={item.nome} accessibilityState={{ checked: origemId === item.id }}
                style={{ minHeight: 48, padding: 12, borderRadius: 12, backgroundColor: origemId === item.id ? theme.selectedCard : theme.surface, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                onPress={() => { setOrigemId(item.id); setOriginMenuOpen(false); }}>
                <Text style={styles.optionTitle}>{item.nome}</Text>{origemId === item.id ? <Check size={20} color={theme.primary} /> : null}
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
      <LoadingOverlay visible={disabled} message={isSavingPreferences ? "Salvando..." : "Carregando..."} />
    </SafeAreaView>
  );
}
