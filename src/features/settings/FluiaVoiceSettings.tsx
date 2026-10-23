import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppState, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { scaleFontSize } from "../../theme/appTheme";
import { createSettingsStyles } from "./SettingsScreen.styles";
import { voiceConnection } from "../assistant/voice/connectionStore";
import { useVoiceConnection } from "../assistant/voice/useVoiceConnection";
import { validateSttEndpoint } from "../assistant/voice/transcribe";

export function FluiaVoiceSettings() {
  const { theme, fontScale } = useAppPreferences();
  const state = useVoiceConnection();
  const [endpoint, setEndpoint] = useState(state.endpoint);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const request = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const styles = useMemo(() => createSettingsStyles(theme, fontScale), [theme, fontScale]);
  useEffect(() => {
    mounted.current = true;
    const listener = AppState.addEventListener("change", value => {
      if (value === "background") request.current?.abort();
    });
    return () => { mounted.current = false; request.current?.abort(); listener.remove(); };
  }, []);
  if (Platform.OS !== "ios") return null;
  const font = (size: number) => scaleFontSize(size, fontScale);
  const activate = async () => {
    if (busy) return;
    const controller = new AbortController(); request.current = controller;
    const timer = setTimeout(() => controller.abort(), 32_000);
    setBusy(true); setMessage("Autorize a conexão na janela que aparecer no Mac.");
    try {
      const base = validateSttEndpoint(endpoint);
      const paired = await fetch(`${base}/pair`, { method: "POST", body: "{}", signal: controller.signal, headers: { "Content-Type": "application/json" } });
      const session = await paired.json();
      if (!paired.ok || !/^[a-f0-9]{64}$/.test(session.code) || controller.signal.aborted) throw new Error();
      const response = await fetch(`${base}/health`, { signal: controller.signal, headers: { Authorization: `Bearer ${session.code}` } });
      const result = await response.json();
      if (!response.ok || result.streaming !== true || controller.signal.aborted || AppState.currentState !== "active") throw new Error();
      if (mounted.current) { voiceConnection.configure(base, session.code); setMessage("Voz ativa nesta sessão."); }
    } catch { if (mounted.current) setMessage("Não foi possível conectar. Confira a rede local e autorize a conexão no Mac."); }
    finally { clearTimeout(timer); if (mounted.current) setBusy(false); }
  };
  return <View style={styles.section} testID="fluia-configuracao-voz">
    <Text accessibilityRole="header" style={styles.sectionTitle}>Voz da FluIA</Text>
    <View style={[styles.accessibilityCard, local.card]}>
      <Text style={styles.sectionText}>Ao ativar, abrir a FluIA inicia uma escuta e envia o áudio ao Google Cloud. Após uma pausa de 2 segundos ou um toque na Orb, a pergunta é enviada e respondida automaticamente.</Text>
      <Text style={styles.sectionText}>Quando a voz Zephyr estiver habilitada no Mac, o texto das respostas também será enviado ao Google Cloud para gerar a leitura em português. Sem essa habilitação ou sem conexão ativa, a leitura usa a voz do iPhone.</Text>
      <TextInput accessibilityLabel="Endereço HTTPS privado do Mac" value={endpoint} onChangeText={setEndpoint} placeholder="https://endereço-do-mac:8787" autoCapitalize="none" autoCorrect={false} autoComplete="off" keyboardType="url" editable={!busy && !state.ready} placeholderTextColor={theme.textMuted} style={[local.field, { color: theme.text, borderColor: theme.border, fontSize: font(13) }]} />
      <Text style={styles.sectionText}>O código fica somente na memória até fechar o aplicativo ou desativar a voz. A escuta para ao bloquear a tela ou trocar de app e não recomeça sozinha.</Text>
      {!state.ready ? <PressableScale accessibilityRole="button" accessibilityState={{ disabled: busy, busy }} disabled={busy} onPress={() => { void activate(); }} style={[local.button, { backgroundColor: theme.primary }]}><Text style={{ color: theme.onPrimary, fontSize: font(14), fontWeight: "800" }}>{busy ? "Conectando…" : "Conectar ao Mac"}</Text></PressableScale> : null}
      {state.ready ? <PressableScale accessibilityRole="button" onPress={() => { voiceConnection.clear(); setMessage("Voz desativada."); }} style={local.button}><Text style={{ color: theme.text, fontSize: font(13), fontWeight: "700" }}>Desativar conexão de voz</Text></PressableScale> : null}
      {state.ready || message ? <Text accessibilityLiveRegion="polite" style={[styles.sectionText, { color: theme.text }]}>{state.ready ? "Voz ativa nesta sessão." : message}</Text> : null}
    </View>
  </View>;
}
const local = StyleSheet.create({ card: { gap: 12 }, field: { minHeight: 48, borderWidth: 1, borderRadius: 12, padding: 12 }, button: { minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 14, padding: 12 } });
