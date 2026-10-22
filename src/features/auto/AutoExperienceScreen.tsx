import React, { useState } from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Check, Monitor } from "lucide-react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { getStationStatusInfo } from "../stations/stationPresentation";
import { AUTO_FORMATS, getAutoFrameSize } from "./autoPresentation";

export default function AutoExperienceScreen() {
  const { theme, scale, userPreferences, demoOrigin, demoStations } = useAppPreferences();
  const { width } = useWindowDimensions();
  const [formatId, setFormatId] = useState<string>("horizontal");
  const format = AUTO_FORMATS.find((item) => item.id === formatId)!;
  const frame = getAutoFrameSize(width - 40, format.ratio);
  const station = demoStations[0];
  const text = { color: theme.text, fontSize: scale(16), lineHeight: scale(24) };
  const button = { minHeight: 48, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: 1100, flexDirection: "row", gap: 12, alignItems: "center" }}>
          <PressableScale accessibilityRole="button" accessibilityLabel="Voltar às configurações" style={button} onPress={() => router.back()}>
            <ArrowLeft color={theme.primary} size={22} />
          </PressableScale>
          <Text accessibilityRole="header" style={[text, { flex: 1, fontSize: scale(22), fontWeight: "800" }]}>Flui Auto Experience</Text>
        </View>
        <View style={{ width: "100%", maxWidth: 1100, gap: 8 }}>
          <Text style={[text, { color: theme.primary, fontWeight: "800" }]}>SIMULAÇÃO VISUAL</Text>
          <Text style={text}>Estudo com dados demonstrativos. Sem conexão com veículos, CarPlay ou Android Auto.</Text>
          <Text style={[text, { color: theme.textMuted }]}>Proporções ilustrativas. Use com o veículo parado.</Text>
        </View>
        <View style={{ width: "100%", maxWidth: 1100, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {AUTO_FORMATS.map((item) => (
            <PressableScale key={item.id} accessibilityRole="button" accessibilityLabel={`Formato ${item.label}, ${item.proportion}`} accessibilityState={{ selected: item.id === formatId }}
              style={[button, { flexGrow: 1, backgroundColor: item.id === formatId ? theme.selectedCard : theme.surface }]}
              onPress={() => setFormatId(item.id)}>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                {item.id === formatId ? <Check size={18} color={theme.primary} /> : <Monitor size={18} color={theme.primary} />}
                <Text style={text}>{item.label} · {item.proportion}</Text>
              </View>
            </PressableScale>
          ))}
        </View>
        <View style={{ width: frame.width, height: frame.height, backgroundColor: "#080A12", borderWidth: 8, borderColor: theme.border, borderRadius: 24, overflow: "hidden" }}>
          <ScrollView nestedScrollEnabled contentContainerStyle={{ minHeight: Math.max(0, frame.height - 16), backgroundColor: theme.surface }}>
            <View style={{ padding: 12, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 8, borderBottomWidth: 1, borderColor: theme.border }}>
              <Text style={[text, { fontWeight: "900" }]}>Flui</Text>
              <Text style={[text, { color: theme.primary }]}>{userPreferences.batteryPercent}% · simulação</Text>
            </View>
            <View accessible accessibilityLabel="Mapa meramente ilustrativo, sem percurso real" style={{ minHeight: 100, backgroundColor: theme.primarySoft }}>
              <Svg height={100} width="100%" viewBox="0 0 600 200" accessible={false}>
                <Path d="M0 30H600 M0 110H600 M90 0V200 M350 0V200 M500 0V200" stroke={theme.border} strokeWidth={3} />
                <Path d="M80 165L240 165L240 60L480 60" stroke={theme.primary} strokeWidth={8} fill="none" />
                <Circle cx={80} cy={165} r={14} fill={theme.success} stroke={theme.text} strokeWidth={3} />
                <Circle cx={480} cy={60} r={14} fill={theme.primary} stroke={theme.text} strokeWidth={3} />
              </Svg>
            </View>
            <View style={{ padding: 12, gap: 6 }}>
              <Text style={[text, { fontWeight: "800" }]}>{station.name}</Text>
              <Text style={text}>{getStationStatusInfo(station).label} · dados demonstrativos</Text>
              <Text style={[text, { color: theme.textMuted }]}>Origem: {demoOrigin.nome} · distância em linha reta</Text>
            </View>
          </ScrollView>
        </View>
        <Text style={[text, { width: "100%", maxWidth: 1100, color: theme.textMuted }]}>Prévia {format.label.toLowerCase()}. Em telas pequenas, role dentro da moldura para ler tudo; os textos não são reduzidos para caber.</Text>
        <View style={{ width: "100%", maxWidth: 1100, padding: 16, borderWidth: 1, borderColor: theme.border, borderRadius: 18, gap: 8 }}>
          <Text style={[text, { fontWeight: "800" }]}>{userPreferences.vehicleName}</Text>
          <Text style={text}>Bateria {userPreferences.batteryPercent}% para estimativa · autonomia configurada {userPreferences.vehicleRangeKm} km. Sem telemetria. A moldura não inicia rotas nem envia comandos.</Text>
          <PressableScale accessibilityRole="button" accessibilityLabel="Abrir o mapa real do aplicativo" style={button} onPress={() => router.push("/map")}>
            <Text style={[text, { color: theme.primary, fontWeight: "700" }]}>Abrir mapa do aplicativo</Text>
          </PressableScale>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
