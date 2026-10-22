import React, { useEffect, useState } from "react";
import { AppState, Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
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
import { ORB_PROTOTYPE_DETAILS } from "./orbPrototypePresentation";

export default function OrbLabScreen() {
  const { theme, scale, fontScale } = useAppPreferences();
  const { width, fontScale: systemFontScale } = useWindowDimensions();
  const stacked = width / Math.max(1, fontScale * systemFontScale) < 300;
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
        <Text style={[text, { color: theme.textMuted }]}>Comparação experimental. A Orb principal continua igual. Sem conversa ou áudio neste laboratório.</Text>
        <View style={{ flexDirection: stacked ? "column" : "row", gap: 12 }}>
          {["Atual", "Protótipo"].map((label) => (
            <View key={label} style={{ flex: stacked ? 0 : 1, minWidth: 0, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 8, alignItems: "center", gap: 8, borderWidth: 1, borderColor: label === "Protótipo" ? theme.primary : theme.border, backgroundColor: theme.surface }}>
              <Text style={[text, { textAlign: "center", fontWeight: "800" }]}>{label}</Text>
              {label === "Atual" ? <EnergyOrb state={state} reducedMotion={reducedMotion} active={active} size={112} /> : <EnergyOrbPrototype state={state} reducedMotion={reducedMotion} active={active} size={112} />}
              <Text style={[text, { textAlign: "center", fontSize: scale(12), lineHeight: scale(18), color: theme.textMuted }]}>{label === "Atual" ? "Visual do chat" : "Halo e arcos de energia"}</Text>
            </View>
          ))}
        </View>
        <View style={{ gap: 4 }}>
          <Text accessibilityLiveRegion="polite" style={[text, { fontWeight: "800" }]}>Estado da comparação: {FLUIA_STATE_LABELS[state]}</Text>
          <Text style={[text, { fontSize: scale(13), lineHeight: scale(19), color: theme.textMuted }]}>{ORB_PROTOTYPE_DETAILS[state].label}</Text>
        </View>
        <PressableScale accessibilityRole="switch" accessibilityLabel="Simular visualização estática neste laboratório" accessibilityState={{ checked: reducedMotion, disabled: systemReducedMotion }} disabled={systemReducedMotion} style={button} onPress={() => setStaticPreview((value) => !value)}>
          <Text style={text}>Prévia estática: {reducedMotion ? "Ativada" : "Desativada"}</Text>
          <Text style={[text, { color: theme.textMuted }]}>{systemReducedMotion ? "A redução de movimento do sistema está ativa e tem prioridade." : "Teste local; não altera a preferência do sistema."}</Text>
        </PressableScale>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(Object.keys(FLUIA_STATE_LABELS) as FluiaState[]).map((value) => (
            <Pressable key={value} accessibilityRole="button" accessibilityLabel={`Comparar estado ${FLUIA_STATE_LABELS[value]}`} accessibilityState={{ selected: value === state }} style={[button, { flexGrow: 1, flexBasis: stacked ? "100%" : "46%", paddingHorizontal: 10, backgroundColor: value === state ? theme.selectedCard : theme.surface }]} onPress={() => setState(value)}>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                {value === state ? <Check size={18} color={theme.primary} /> : null}
                <Text style={[text, { flexShrink: 1 }]}>{FLUIA_STATE_LABELS[value]}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Text style={[text, { color: theme.textMuted }]}>Sem piscadas. Aviso e alerta são estáticos. Com redução de movimento, o acabamento permanece sem animações. Os ciclos param fora desta tela ou em segundo plano. Adoção sujeita à avaliação humana.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
