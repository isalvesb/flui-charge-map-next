import React, { useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import { LoadingOverlay, PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { limiteNomeVeiculo, origensDemonstrativas, type OrigemDemonstrativaId } from "../../data/demonstracao";
import { validarConfiguracaoDemonstrativa } from "../../utils/demonstracao";
import { getBatterySourceLabels } from "../../utils/batteryData";
import { createSettingsStyles } from "./SettingsScreen.styles";

// Mesmo por URL direta, controles não são renderizados em produção.
export default function InternalPresentationScreen() {
  return __DEV__ ? <PresentationControls /> : <Redirect href="/settings" />;
}

function PresentationControls() {
  const { theme, fontScale, userPreferences, updateDemoConfiguration, isLoadingPreferences, isSavingPreferences } = useAppPreferences();
  const [feedback, showSettingsFeedback] = useState<string | null>(null);
  const [veiculo, setVeiculo] = useState(userPreferences.vehicleName);
  const [autonomia, setAutonomia] = useState(String(userPreferences.vehicleRangeKm));
  const [origemId, setOrigemId] = useState<OrigemDemonstrativaId>(userPreferences.demoOriginId);
  const [erroDemonstracao, setErroDemonstracao] = useState<string | null>(null);
  const bateria = getBatterySourceLabels(userPreferences);

  useEffect(() => {
    setVeiculo(userPreferences.vehicleName);
    setAutonomia(String(userPreferences.vehicleRangeKm));
    setOrigemId(userPreferences.demoOriginId);
  }, [userPreferences.vehicleName, userPreferences.vehicleRangeKm, userPreferences.demoOriginId]);

  const salvarDemonstracao = async () => {
    if (isLoadingPreferences || isSavingPreferences) return;
    const config = {
      vehicleName: veiculo.trim(),
      vehicleRangeKm: Number(autonomia.trim().replace(",", ".")),
      demoOriginId: origemId,
    };
    const erro = validarConfiguracaoDemonstrativa(config);
    setErroDemonstracao(erro);
    if (erro) return;
    try {
      await updateDemoConfiguration(config);
      showSettingsFeedback("Demonstração salva neste dispositivo");
    } catch {
      setErroDemonstracao("Não foi possível salvar a demonstração. Tente novamente.");
    }
  };


  const styles = useMemo(() => createSettingsStyles(theme, fontScale), [theme, fontScale]);
  const renderOptionCheck = (selected: boolean) => selected
    ? <View style={styles.checkCircle}><Check size={14} color={theme.onPrimary} /></View>
    : <View style={styles.emptyCheckCircle} />;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <PressableScale accessibilityRole="button" accessibilityLabel="Voltar às configurações" style={styles.backButton} onPress={() => router.back()}><ArrowLeft color={theme.primary} size={22} /></PressableScale>
        <Text accessibilityRole="header" style={[styles.headerTitle, { flex: 1, textAlign: "center" }]}>Apresentação interna</Text>
        <View style={styles.hiddenResetButton} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <Text style={styles.sectionText}>Controles locais do cenário fictício. Não representam integração com o veículo nem alteram um perfil conectado.</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Demonstração NEXT</Text>
            <Text style={styles.sectionText}>
            Veículo e autonomia usados nas simulações. Sem GPS ou integração com o veículo. Catálogo incluído no app. Reconectar não atualiza estações nem envia dados locais.
            {Platform.OS === "web" ? " Na web, abra com conexão antes do uso offline; o armazenamento depende do navegador." : ""}
            </Text>
            <Text style={styles.fieldLabel}>Veículo demonstrativo</Text>
            <TextInput
              accessibilityLabel="Veículo demonstrativo"
              value={veiculo}
              onChangeText={setVeiculo}
              maxLength={limiteNomeVeiculo}
              editable={!isLoadingPreferences && !isSavingPreferences}
              style={styles.input}
            />
            <Text style={styles.fieldLabel}>Autonomia com bateria cheia (km)</Text>
            <TextInput
              accessibilityLabel="Autonomia com bateria cheia em quilômetros"
              accessibilityHint="Valor usado para estimar o alcance; não é uma especificação verificada do veículo."
              value={autonomia}
              onChangeText={setAutonomia}
              keyboardType="decimal-pad"
              editable={!isLoadingPreferences && !isSavingPreferences}
              style={styles.input}
            />
            <Text style={styles.fieldLabel}>Origem demonstrativa</Text>
            <Text style={styles.sectionText}>
              Distâncias em linha reta a partir da origem escolhida. Não representam percursos reais.
            </Text>
            <View style={styles.optionsList}>
              {origensDemonstrativas.map((origem) => (
                <PressableScale
                  key={origem.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar origem ${origem.nome}`}
                  accessibilityState={{ selected: origemId === origem.id }}
                  disabled={isLoadingPreferences || isSavingPreferences}
                  style={[styles.optionButton, origemId === origem.id ? styles.optionButtonSelected : null]}
                  onPress={() => setOrigemId(origem.id)}
                >
                  <Text style={[styles.optionTitle, styles.optionInfo]}>{origem.nome}</Text>
                  {renderOptionCheck(origemId === origem.id)}
                </PressableScale>
              ))}
            </View>
            {erroDemonstracao ? (
              <Text accessibilityRole="alert" style={styles.warningText}>{erroDemonstracao}</Text>
            ) : null}
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Salvar demonstração"
              disabled={isLoadingPreferences || isSavingPreferences}
              style={[styles.optionButton, styles.optionsList]}
              onPress={salvarDemonstracao}
            >
              <Check size={21} color={theme.primary} />
              <Text style={styles.optionTitle}>Salvar demonstração</Text>
            </PressableScale>
            <Text style={styles.sectionText}>
              Bateria: {userPreferences.batteryPercent}% · {bateria.source}. {bateria.detail}.
              {"\n"}Para alterar, use o indicador de bateria no mapa.
            </Text>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Abrir mapa para editar bateria"
              style={[styles.optionButton, styles.optionsList]}
              onPress={() => router.push("/map")}
            >
              <Text style={styles.optionTitle}>Editar bateria no mapa</Text>
            </PressableScale>
          </View>


        {feedback ? <Text accessibilityLiveRegion="polite" style={styles.sectionText}>{feedback}</Text> : null}
      </ScrollView>
      <LoadingOverlay visible={isLoadingPreferences || isSavingPreferences} message={isSavingPreferences ? "Salvando cenário..." : "Carregando cenário..."} />
    </SafeAreaView>
  );
}
