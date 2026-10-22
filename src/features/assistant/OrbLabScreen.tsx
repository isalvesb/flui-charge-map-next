import React, { useEffect, useState } from "react";
import { AppState, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { EnergyOrb } from "./EnergyOrb";
import { EnergyOrbPrototype } from "./EnergyOrbPrototype";
import { FLUIA_STATE_LABELS, type FluiaState } from "./fluiaState";

export default function OrbLabScreen() {
  const { theme, scale } = useAppPreferences();
  const [state, setState] = useState<FluiaState>("repouso");
  const [staticPreview, setStaticPreview] = useState(false);
  const [foreground, setForeground] = useState(AppState.currentState === "active");
  const focused = useIsFocused();
  const systemReducedMotion = useReducedMotion();
  const reducedMotion = systemReducedMotion || staticPreview;
  const active = focused && foreground;
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (value) => setForeground(value === "active"));
    return () => subscription.remove();
  }, []);
  const text = { color: theme.text, fontSize: scale(15), lineHeight: scale(23) };
  const button = { minHeight: 48, padding: 14, borderWidth: 1, borderColor: theme.border, borderRadius: 16, backgroundColor: theme.surface };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <PressableScale accessibilityRole="button" accessibilityLabel="Voltar às configurações" style={button} onPress={() => router.back()}><ArrowLeft size={22} color={theme.primary} /></PressableScale>
          <Text accessibilityRole="header" style={[text, { flex: 1, fontSize: scale(22), fontWeight: "800" }]}>Laboratório da Orb</Text>
        </View>
        <Text style={text}>Protótipo para comparação. A Orb do chat continua igual; este laboratório não inicia conversas ou fala.</Text>
        <Text accessibilityLiveRegion="polite" style={[text, { fontWeight: "800" }]}>Estado da comparação: {FLUIA_STATE_LABELS[state]}</Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          {["Atual", "Protótipo"].map((label) => (
            <View key={label} style={{ flex: 1, borderRadius: 20, paddingVertical: 20, alignItems: "center", gap: 12, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface }}>
              <Text style={[text, { fontWeight: "800" }]}>{label}</Text>
              {label === "Atual" ? <EnergyOrb state={state} reducedMotion={reducedMotion} active={active} size={96} /> : <EnergyOrbPrototype state={state} reducedMotion={reducedMotion} active={active} size={96} />}
            </View>
          ))}
        </View>
        <PressableScale accessibilityRole="switch" accessibilityLabel="Simular visualização estática neste laboratório" accessibilityState={{ checked: staticPreview, disabled: systemReducedMotion }} disabled={systemReducedMotion} style={button} onPress={() => setStaticPreview((value) => !value)}>
          <Text style={text}>Prévia estática: {reducedMotion ? "Ativada" : "Desativada"}</Text>
          <Text style={[text, { color: theme.textMuted }]}>{systemReducedMotion ? "A redução de movimento do sistema está ativa e tem prioridade." : "Teste local; não altera a preferência do sistema."}</Text>
        </PressableScale>
        <View style={{ gap: 10 }}>
          {(Object.keys(FLUIA_STATE_LABELS) as FluiaState[]).map((value) => (
            <PressableScale key={value} accessibilityRole="button" accessibilityLabel={`Comparar estado ${FLUIA_STATE_LABELS[value]}`} accessibilityState={{ selected: value === state }} style={[button, { backgroundColor: value === state ? theme.selectedCard : theme.surface }]} onPress={() => setState(value)}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                {value === state ? <Check size={18} color={theme.primary} /> : null}
                <Text style={text}>{FLUIA_STATE_LABELS[value]}</Text>
              </View>
            </PressableScale>
          ))}
        </View>
        <Text style={[text, { color: theme.textMuted }]}>Halos e arcos discretos, sem piscadas. Aviso/alerta são estáticos. Animações param fora desta tela ou com o app em segundo plano. A adoção depende de avaliação humana.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
