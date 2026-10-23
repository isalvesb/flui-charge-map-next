import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { ArrowLeft, Check, ChevronDown, X } from "lucide-react-native";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useAppPreferences } from "../../context/PreferencesContext";
import { PressableScale } from "../../components";
import { OfflineImage as Image } from "../../offline/OfflineImage";
import { chargingStations } from "../../data/fixtures/chargingStations";
import { origensDemonstrativas } from "../../data/demonstracao";
import { validarConfiguracaoDemonstrativa } from "../../utils/demonstracao";
import { createSettingsStyles } from "../settings/SettingsScreen.styles";
import { presentationImages } from "./presentationImages";
import { createPresentationState, type PresentationState } from "./presentationScenario";
import { presentationStore } from "./presentationStorage";

export default function PresentationScreen() {
  if (!__DEV__) return <Redirect href="/settings" />;
  return <InternalPresentationScreen />;
}
function InternalPresentationScreen() {
  const { theme, fontScale, presentationState, savePresentation, isSavingPreferences, isLoadingPreferences } = useAppPreferences();
  const reducedMotion = useReducedMotion();
  const styles = useMemo(() => createSettingsStyles(theme, fontScale), [theme, fontScale]);
  const local = useMemo(() => StyleSheet.create({
    row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    choice: { flex: 1, minWidth: 100, minHeight: 48, borderWidth: 1, borderColor: theme.border, borderRadius: 14, padding: 12, alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: theme.surface },
    selected: { borderColor: theme.primary, backgroundColor: theme.selectedCard },
    image: { width: 72, height: 64, borderRadius: 12 },
    body: { color: theme.text, fontSize: 14 * fontScale, lineHeight: 21 * fontScale },
    label: { color: theme.text, fontSize: 15 * fontScale, fontWeight: "700", marginBottom: 8 },
    card: { marginTop: 16, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface, gap: 12 },
    primary: { backgroundColor: theme.primary, minHeight: 52, borderRadius: 16, padding: 14, alignItems: "center", justifyContent: "center" },
    primaryText: { color: theme.onPrimary, fontSize: 15 * fontScale, fontWeight: "800", textAlign: "center" },
    overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.55)", padding: 16 },
    menu: { width: "100%", maxWidth: 480, maxHeight: "85%", borderRadius: 20, padding: 16, backgroundColor: theme.surface, gap: 12 },
    menuRow: { minHeight: 52, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10 },
  }), [theme, fontScale]);
  const [draft, setDraft] = useState<PresentationState>(createPresentationState);
  const [range, setRange] = useState("400"), [battery, setBattery] = useState("70");
  const [loaded, setLoaded] = useState(false), [message, setMessage] = useState<string | null>(null);
  const [picker, setPicker] = useState<"favorites" | "review" | null>(null), [search, setSearch] = useState("");
  const [reviewStationId, setReviewStationId] = useState("station-01"), [rating, setRating] = useState(5), [comment, setComment] = useState("");
  const disabled = !loaded || isLoadingPreferences || isSavingPreferences;
  useEffect(() => {
    let active = true;
    void presentationStore.getState().then(state => {
      if (!active) return;
      setDraft(state); setRange(String(state.config.vehicleRangeKm)); setBattery(String(state.config.batteryPercent)); setLoaded(true);
    }).catch(() => { if (active) setMessage("Não foi possível ler o cenário. Volte e tente novamente; os dados foram preservados."); });
    return () => { active = false; };
  }, []);
  const changeConfig = (patch: Partial<PresentationState["config"]>) => setDraft(current => ({ ...current, config: { ...current.config, ...patch } }));
  const selectPreset = (travel: boolean) => {
    changeConfig({ driverName: travel ? "Marina Costa" : "Caio Duarte", profileImage: travel ? "profile2" : "profile1", vehicleImage: travel ? "car2" : "car1", vehicleName: travel ? "Compacto elétrico · cenário" : "BYD Dolphin Plus", vehicleRangeKm: travel ? 200 : 400, batteryPercent: travel ? 35 : 70, batterySource: "demo", batteryUpdatedAt: null, demoOriginId: "fiap" });
    setRange(travel ? "200" : "400"); setBattery(travel ? "35" : "70"); setMessage("Perfil preparado. Use Aplicar para ativá-lo; favoritos e avaliações foram mantidos.");
  };
  const apply = async () => {
    if (disabled) return;
    if (!draft.config.driverName.trim() || draft.config.driverName.trim().length > 60) { setMessage("Informe um nome de até 60 caracteres."); return; }
    if (!/^\d+(?:[.,]\d+)?$/.test(range.trim()) || !/^\d+(?:[.,]\d+)?$/.test(battery.trim())) { setMessage("Informe números válidos para autonomia e bateria."); return; }
    const config = { ...draft.config, vehicleRangeKm: Number(range.replace(",", ".")), batteryPercent: Number(battery.replace(",", ".")), batterySource: "demo" as const, batteryUpdatedAt: null };
    const error = validarConfiguracaoDemonstrativa(config);
    if (error || config.batteryPercent < 0 || config.batteryPercent > 100) { setMessage(error ?? "A bateria precisa ficar entre 0 e 100%."); return; }
    try {
      const current = await presentationStore.getState();
      await savePresentation({ ...current, config, enabled: true, favoriteStationIds: draft.favoriteStationIds, sentReviews: draft.sentReviews });
      setMessage("Cenário ativo. Confira o mapa e o perfil; seus registros normais continuam separados.");
    } catch { setMessage("Não foi possível salvar o cenário. A configuração anterior foi mantida."); }
  };
  const leave = async () => {
    if (disabled) return;
    try { const current = await presentationStore.getState(); await savePresentation({ ...current, enabled: false }); setMessage("Apresentação desativada. Seus registros normais foram restaurados."); }
    catch { setMessage("Não foi possível desativar o cenário. Tente novamente."); }
  };
  const addReview = () => {
    const station = chargingStations.find(item => item.id === reviewStationId);
    if (!station || !comment.trim()) { setMessage("Escreva um comentário para a avaliação de cenário."); return; }
    const review = { id: `presentation-review-${station.id}`, stationId: station.id, stationName: station.name, rating, quality: rating, cleaning: rating, availability: rating, amenities: rating, comment: comment.trim(), wouldReturn: rating >= 3, recommend: rating >= 3, createdAt: new Date().toISOString(), isSynced: false };
    setDraft(current => ({ ...current, sentReviews: [review, ...current.sentReviews.filter(item => item.stationId !== station.id)] })); setComment(""); setMessage("Avaliação preparada. Aplique o cenário para salvar.");
  };
  const filteredStations = chargingStations.filter(station => `${station.name} ${station.city} ${station.state}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
  const choice = (label: string, selected: boolean, onPress: () => void, image?: number) => <PressableScale key={label} accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{ checked: selected, disabled }} disabled={disabled} onPress={onPress} style={[local.choice, selected && local.selected]}>{image !== undefined ? <Image accessible={false} source={image} style={local.image} resizeMode="contain" /> : null}<Text style={local.body}>{label}</Text>{selected ? <Check accessible={false} size={18} color={theme.primary} /> : null}</PressableScale>;

  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><PressableScale accessibilityRole="button" accessibilityLabel="Voltar às configurações" style={styles.backButton} onPress={() => router.back()}><ArrowLeft color={theme.primary} size={22} /></PressableScale><Text style={styles.headerTitle}>Apresentação</Text><View style={{ width: 44 }} /></View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <Text style={styles.sectionTitle}>Cenários internos</Text>
      <Text style={styles.sectionText}>Dados fictícios para o NEXT. As alterações só entram em uso ao aplicar o cenário. Nenhum dado é enviado.</Text>
      <View style={local.card}><Text accessibilityLiveRegion="polite" style={local.label}>{presentationState.enabled ? "Modo de apresentação ativo" : "Modo de apresentação desativado"}</Text>{message ? <Text accessibilityLiveRegion="polite" style={local.body}>{message}</Text> : null}</View>
      <View style={local.card}>
        <Text style={styles.sectionTitle}>Perfil e fotos</Text>
        <View style={local.row}><PressableScale accessibilityRole="button" disabled={disabled} style={local.choice} onPress={() => selectPreset(false)}><Text style={local.body}>Perfil urbano</Text></PressableScale><PressableScale accessibilityRole="button" disabled={disabled} style={local.choice} onPress={() => selectPreset(true)}><Text style={local.body}>Perfil de viagem</Text></PressableScale></View>
        <Text style={local.label}>Nome do perfil</Text>
        <TextInput accessibilityLabel="Nome do perfil fictício" value={draft.config.driverName} onChangeText={driverName => changeConfig({ driverName })} maxLength={60} editable={!disabled} style={styles.input} />
        <View accessibilityRole="radiogroup" accessibilityLabel="Foto do perfil" style={local.row}>{choice("Foto de perfil 1", draft.config.profileImage === "profile1", () => changeConfig({ profileImage: "profile1" }), presentationImages.profile1)}{choice("Foto de perfil 2", draft.config.profileImage === "profile2", () => changeConfig({ profileImage: "profile2" }), presentationImages.profile2)}</View>
      </View>
      <View style={local.card}>
        <Text style={styles.sectionTitle}>Veículo e partida</Text>
        <Text style={local.label}>Nome do veículo</Text>
        <TextInput accessibilityLabel="Nome do veículo do cenário" value={draft.config.vehicleName} onChangeText={vehicleName => changeConfig({ vehicleName })} maxLength={60} editable={!disabled} style={styles.input} />
        <View accessibilityRole="radiogroup" accessibilityLabel="Imagem do veículo" style={local.row}>{choice("Imagem de veículo 1", draft.config.vehicleImage === "car1", () => changeConfig({ vehicleImage: "car1" }), presentationImages.car1)}{choice("Imagem de veículo 2", draft.config.vehicleImage === "car2", () => changeConfig({ vehicleImage: "car2" }), presentationImages.car2)}</View>
        <Text style={local.label}>Autonomia com carga cheia (km)</Text><TextInput accessibilityLabel="Autonomia do cenário em quilômetros" value={range} onChangeText={setRange} keyboardType="decimal-pad" editable={!disabled} style={styles.input} />
        <Text style={local.label}>Bateria inicial (%)</Text><TextInput accessibilityLabel="Bateria inicial do cenário" value={battery} onChangeText={setBattery} keyboardType="decimal-pad" editable={!disabled} style={styles.input} />
        <Text style={local.label}>Localização inicial</Text><View accessibilityRole="radiogroup" accessibilityLabel="Localização do cenário" style={local.row}>{origensDemonstrativas.map(origin => choice(origin.nome, draft.config.demoOriginId === origin.id, () => changeConfig({ demoOriginId: origin.id })))}</View>
      </View>
      <View style={local.card}>
        <Text style={styles.sectionTitle}>Favoritos</Text>
        <Text style={local.body}>{draft.favoriteStationIds.length ? draft.favoriteStationIds.map(id => chargingStations.find(s => s.id === id)?.name).join(" · ") : "Nenhum favorito neste cenário."}</Text>
        <PressableScale accessibilityRole="button" disabled={disabled} style={local.choice} onPress={() => { setSearch(""); setPicker("favorites"); }}><Text style={local.body}>Escolher favoritos do cenário</Text><ChevronDown size={20} color={theme.primary} /></PressableScale>
      </View>
      <View style={local.card}>
        <Text style={styles.sectionTitle}>Comentários e avaliações</Text>
        <Text style={styles.sectionText}>Aparecem como avaliações do perfil fictício. As notas agregadas do catálogo permanecem iguais.</Text>
        <PressableScale accessibilityRole="button" accessibilityLabel="Escolher estação para avaliação" disabled={disabled} style={local.choice} onPress={() => { setSearch(""); setPicker("review"); }}><Text style={local.body}>{chargingStations.find(s => s.id === reviewStationId)?.name}</Text><ChevronDown size={20} color={theme.primary} /></PressableScale>
        <View accessibilityRole="radiogroup" accessibilityLabel="Nota do cenário" style={local.row}>{[1, 2, 3, 4, 5].map(value => <PressableScale key={value} accessibilityRole="radio" accessibilityLabel={`Nota ${value}`} accessibilityState={{ checked: rating === value }} disabled={disabled} onPress={() => setRating(value)} style={[local.choice, { minWidth: 40 }, rating === value && local.selected]}><Text style={local.body}>{value}</Text></PressableScale>)}</View>
        <TextInput accessibilityLabel="Comentário do cenário" value={comment} onChangeText={setComment} multiline maxLength={500} editable={!disabled} style={[styles.input, { minHeight: 96, textAlignVertical: "top" }]} />
        <PressableScale accessibilityRole="button" disabled={disabled} style={local.choice} onPress={addReview}><Text style={local.body}>Adicionar ao cenário</Text></PressableScale>
        {draft.sentReviews.map(review => <View key={review.stationId} style={local.card}><Text style={local.label}>{review.stationName} · {review.rating}/5</Text><Text style={local.body}>{review.comment}</Text><PressableScale accessibilityRole="button" accessibilityLabel={`Retirar avaliação de ${review.stationName}`} disabled={disabled} style={local.choice} onPress={() => setDraft(current => ({ ...current, sentReviews: current.sentReviews.filter(item => item.stationId !== review.stationId) }))}><Text style={local.body}>Retirar do cenário</Text></PressableScale></View>)}
      </View>
      <View style={[local.card, { marginBottom: 24 }]}>
        <PressableScale accessibilityRole="button" disabled={disabled} style={local.primary} onPress={() => void apply()}><Text style={local.primaryText}>{presentationState.enabled ? "Salvar cenário ativo" : "Aplicar e ativar cenário"}</Text></PressableScale>
        {presentationState.enabled ? <PressableScale accessibilityRole="button" disabled={disabled} style={local.choice} onPress={() => void leave()}><Text style={local.body}>Sair do modo de apresentação</Text></PressableScale> : null}
        <Text style={styles.sectionText}>Fora do modo de apresentação, seus registros normais voltam a ser usados. As fotos são ilustrativas e os valores do veículo são parâmetros do cenário.</Text>
      </View>
    </ScrollView>
    <Modal visible={picker !== null} transparent animationType={reducedMotion ? "none" : "fade"} onRequestClose={() => setPicker(null)}>
      <View style={local.overlay} accessibilityViewIsModal>
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar lista de estações" onPress={() => setPicker(null)} style={StyleSheet.absoluteFillObject} />
        <View style={local.menu}>
          <View style={local.menuRow}><Text style={[local.label, { flex: 1 }]}>{picker === "favorites" ? "Favoritos do cenário" : "Estação da avaliação"}</Text><Pressable accessibilityRole="button" accessibilityLabel="Concluir seleção de estações" onPress={() => setPicker(null)} style={{ minHeight: 44, minWidth: 44, justifyContent: "center", alignItems: "center" }}><X size={22} color={theme.primary} /></Pressable></View>
          <TextInput accessibilityLabel="Buscar estação do cenário" value={search} onChangeText={setSearch} placeholder="Nome ou cidade" placeholderTextColor={theme.textMuted} style={styles.input} />
          <ScrollView keyboardShouldPersistTaps="handled">{filteredStations.map(station => <Pressable key={station.id} accessibilityRole={picker === "favorites" ? "checkbox" : "radio"} accessibilityLabel={`${station.name}, ${station.city}`} accessibilityState={{ checked: picker === "favorites" ? draft.favoriteStationIds.includes(station.id) : reviewStationId === station.id }} style={local.menuRow} onPress={() => {
            if (picker === "favorites") setDraft(current => ({ ...current, favoriteStationIds: current.favoriteStationIds.includes(station.id) ? current.favoriteStationIds.filter(id => id !== station.id) : [...current.favoriteStationIds, station.id] }));
            else { setReviewStationId(station.id); const review = draft.sentReviews.find(item => item.stationId === station.id); setComment(review?.comment ?? ""); setRating(review?.rating ?? 5); setPicker(null); }
          }}><Text style={[local.body, { flex: 1 }]}>{station.name} · {station.city}</Text>{(picker === "favorites" ? draft.favoriteStationIds.includes(station.id) : reviewStationId === station.id) ? <Check size={20} color={theme.primary} /> : null}</Pressable>)}{!filteredStations.length ? <Text style={local.body}>Nenhuma estação encontrada.</Text> : null}</ScrollView>
        </View>
      </View>
    </Modal>
  </SafeAreaView>;
}
