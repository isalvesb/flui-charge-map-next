import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import { Check, ChevronDown, X } from "lucide-react-native";
import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { createSpeechPlayback, type SpeechPlaybackState } from "../assistant/speechPlayback";
import { loadSpeechVoices, resolveSpeechVoiceIdentifier, type AppSpeechVoice } from "../assistant/speechVoices";
import { createSettingsStyles } from "./SettingsScreen.styles";

export default function SpeechVoicePreference() {
  const { theme, fontScale, userPreferences, updateSpeechVoiceId, isLoadingPreferences, isSavingPreferences } = useAppPreferences();
  const styles = useMemo(() => createSettingsStyles(theme, fontScale), [theme, fontScale]);
  const reducedMotion = useReducedMotion();
  const [voices, setVoices] = useState<AppSpeechVoice[]>([]), [loading, setLoading] = useState(false), [failed, setFailed] = useState(false), [open, setOpen] = useState(false), [feedback, setFeedback] = useState<string | null>(null);
  const [playback, setPlayback] = useState<SpeechPlaybackState>("idle");
  const request = useRef(0), voiceRef = useRef(userPreferences.speechVoiceId);
  voiceRef.current = userPreferences.speechVoiceId;
  const player = useMemo(() => createSpeechPlayback(Speech, setPlayback, () => resolveSpeechVoiceIdentifier(voiceRef.current, Speech.getAvailableVoicesAsync)), []);
  const disabled = isLoadingPreferences || isSavingPreferences;
  const load = useCallback(async () => {
    const current = ++request.current;
    setLoading(true); setFailed(false);
    try { const available = await loadSpeechVoices(Speech.getAvailableVoicesAsync); if (current === request.current) setVoices(available); }
    catch { if (current === request.current) setFailed(true); }
    finally { if (current === request.current) setLoading(false); }
  }, []);
  useEffect(() => { void load(); return () => { request.current += 1; player.cancel(); }; }, [load, player]);
  useFocusEffect(useCallback(() => () => { player.stop(); setOpen(false); }, [player]));
  useEffect(() => { const subscription = AppState.addEventListener("change", state => { if (state !== "active") player.stop(); }); return () => subscription.remove(); }, [player]);
  const selectedVoice = voices.find(voice => voice.identifier === userPreferences.speechVoiceId);
  const missing = !!userPreferences.speechVoiceId && !selectedVoice && !loading && !failed;
  const select = async (id: string | null) => {
    if (disabled) return;
    player.stop();
    try { await updateSpeechVoiceId(id); setFeedback("Voz salva. As próximas respostas usarão esta escolha."); }
    catch { setFeedback("Não foi possível salvar a voz. A escolha anterior foi mantida."); }
  };
  const sample = () => { setFeedback(null); void player.speak("Olá, eu sou a FluIA. Vamos escolher uma boa parada para recarregar?"); };
  const feedbackText = playback === "error" ? "Não foi possível reproduzir. Confira o volume e o modo silencioso do iPhone." : feedback;
  const options = [{ identifier: null, name: "Padrão do dispositivo", language: "pt-BR" }, ...voices];
  return <View style={styles.accessibilityCard} testID="acessibilidade-voz">
    <Text style={styles.accessibilityTitle}>Voz da FluIA</Text>
    <Text style={styles.accessibilityDescription}>{selectedVoice?.name ?? "Padrão do dispositivo"}</Text>
    <PressableScale accessibilityRole="button" accessibilityLabel="Escolher voz da FluIA" disabled={disabled} style={styles.voiceChoiceButton} onPress={() => { setOpen(true); void load(); }}><Text style={styles.optionTitle}>Escolher voz</Text><ChevronDown size={21} color={theme.primary} /></PressableScale>
    <PressableScale accessibilityRole="button" accessibilityLabel={playback === "speaking" ? "Parar exemplo de voz" : "Ouvir exemplo da FluIA"} disabled={disabled} style={styles.voiceChoiceButton} onPress={playback === "speaking" ? () => player.stop() : sample}><Text style={styles.optionTitle}>{playback === "speaking" ? "Parar exemplo" : "Ouvir exemplo"}</Text></PressableScale>
    {missing ? <Text style={styles.accessibilityDescription}>A voz salva não está disponível agora. A leitura usará a voz padrão.</Text> : null}
    {feedbackText ? <Text accessibilityLiveRegion="polite" style={styles.accessibilityDescription}>{feedbackText}</Text> : null}
    <Modal visible={open} transparent animationType={reducedMotion ? "none" : "fade"} onRequestClose={() => { player.stop(); setOpen(false); }}>
      <View style={styles.voiceOverlay} accessibilityViewIsModal>
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar seleção de voz tocando fora" style={{ position: "absolute", inset: 0 }} onPress={() => { player.stop(); setOpen(false); }} />
        <View style={styles.voiceModal}>
          <View style={styles.voiceChoiceButton}><Text style={[styles.accessibilityTitle, { flex: 1 }]}>Voz da FluIA</Text><Pressable accessibilityRole="button" accessibilityLabel="Fechar seleção de voz" onPress={() => { player.stop(); setOpen(false); }} style={{ minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}><X size={22} color={theme.primary} /></Pressable></View>
          <Text style={styles.accessibilityDescription}>Vozes em português disponíveis neste aparelho. A escolha é salva automaticamente.</Text>
          {loading ? <Text style={styles.accessibilityDescription}>Consultando vozes…</Text> : null}
          {failed ? <><Text style={styles.accessibilityDescription}>Não foi possível consultar as vozes. A opção padrão continua disponível.</Text><PressableScale accessibilityRole="button" accessibilityLabel="Consultar vozes novamente" style={styles.voiceChoiceButton} onPress={() => void load()}><Text style={styles.optionTitle}>Tentar novamente</Text></PressableScale></> : null}
          {!loading && !failed && !voices.length ? <Text style={styles.accessibilityDescription}>Nenhuma outra voz em português foi encontrada.</Text> : null}
          <ScrollView style={{ flexShrink: 1 }}>
            <View accessibilityRole="radiogroup" accessibilityLabel="Voz para leitura da FluIA">
              {options.map(voice => <PressableScale key={voice.identifier ?? "default"} accessibilityRole="radio" accessibilityLabel={voice.name} accessibilityState={{ checked: userPreferences.speechVoiceId === voice.identifier, disabled }} disabled={disabled} style={[styles.voiceChoiceButton, userPreferences.speechVoiceId === voice.identifier && styles.optionButtonSelected]} onPress={() => void select(voice.identifier)}><View style={{ flex: 1 }}><Text style={styles.optionTitle}>{voice.name}</Text>{voice.identifier ? <Text style={styles.accessibilityDescription}>{/^pt[-_]br$/i.test(voice.language) ? "Português (Brasil)" : "Português"}</Text> : null}</View>{userPreferences.speechVoiceId === voice.identifier ? <Check size={21} color={theme.primary} /> : null}</PressableScale>)}
            </View>
          </ScrollView>
          <PressableScale accessibilityRole="button" accessibilityLabel={playback === "speaking" ? "Parar voz selecionada" : "Ouvir voz selecionada"} disabled={disabled} style={styles.voiceChoiceButton} onPress={playback === "speaking" ? () => player.stop() : sample}><Text style={styles.optionTitle}>{playback === "speaking" ? "Parar exemplo" : "Ouvir exemplo"}</Text></PressableScale>
          {feedbackText ? <Text accessibilityLiveRegion="polite" style={styles.accessibilityDescription}>{feedbackText}</Text> : null}
        </View>
      </View>
    </Modal>
  </View>;
}
