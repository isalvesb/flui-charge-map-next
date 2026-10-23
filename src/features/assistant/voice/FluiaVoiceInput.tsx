import { checkCanceled } from "./cancellation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, AppState, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Mic, Square } from "lucide-react-native";
import { scaleFontSize } from "../../../theme/appTheme";
import type { FluiaScreenTheme } from "../fluiaScreenTheme";
import { beginIosRecording } from "./iosRecorder";
import { transcribeAudio, validateSttEndpoint } from "./transcribe";
import { VoiceSession, voiceBusy, type VoicePhase, type VoiceSnapshot } from "./voiceSession";

type Props = {
  visible: boolean;
  disabled: boolean;
  theme: FluiaScreenTheme;
  fontScale: number;
  onTranscript: (text: string) => void;
  onPhase: (phase: VoicePhase) => void;
  onBeforeRecording: () => Promise<void>;
};

export function FluiaVoiceInput(props: Props) {
  const { visible, disabled, theme, fontScale } = props;
  const insets = useSafeAreaInsets();
  const [snapshot, setSnapshot] = useState<VoiceSnapshot>({ phase: "idle", message: "" });
  const [endpoint, setEndpoint] = useState(process.env.EXPO_PUBLIC_FLUIA_STT_URL ?? "");
  const [code, setCode] = useState("");
  const [showConnection, setShowConnection] = useState(false);
  const callbacks = useRef(props);
  callbacks.current = props;
  const mounted = useRef(false);
  const permissionPrompt = useRef(false);
  const connection = useRef<{ endpoint: string; code: string } | null>(null);
  const session = useMemo(() => new VoiceSession({
    begin: async (signal, interrupted, completed) => {
      await callbacks.current.onBeforeRecording();
      checkCanceled(signal);
      return beginIosRecording(signal, interrupted, undefined, completed, shown => { permissionPrompt.current = shown; });
    },
    transcribe: (content, signal) => {
      if (!connection.current) throw new Error("Sessão encerrada");
      return transcribeAudio(connection.current.endpoint, connection.current.code, content, signal);
    },
    received: (text) => { if (mounted.current && callbacks.current.visible) callbacks.current.onTranscript(text); },
    changed: (next) => {
      if (!voiceBusy(next.phase)) connection.current = null;
      if (!mounted.current) return;
      setSnapshot(next);
      callbacks.current.onPhase(next.phase);
      if (["recording", "processing", "success", "error"].includes(next.phase)) AccessibilityInfo.announceForAccessibility(next.message);
    },
  }), []);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; connection.current = null; void session.cancel(); };
  }, [session]);
  useEffect(() => {
    if (!visible) {
      void session.cancel().then(() => {
        if (mounted.current && !callbacks.current.visible) {
          setSnapshot({ phase: "idle", message: "" });
          callbacks.current.onPhase("idle");
        }
      });
      setCode("");
      setShowConnection(false);
    }
  }, [session, visible]);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      // The iOS permission dialog itself makes the app inactive.
      if (state === "background" || (state === "inactive" && !permissionPrompt.current)) {
        void session.cancel("Gravação interrompida ao sair do aplicativo.");
        if (state === "background") setCode("");
      }
    });
    return () => subscription.remove();
  }, [session]);
  if (Platform.OS !== "ios") return null;
  const busy = voiceBusy(snapshot.phase);
  const font = (size: number) => scaleFontSize(size, fontScale);
  const buttonStyle = [styles.button, { borderColor: theme.border, backgroundColor: theme.surface }];
  const labelStyle = { color: theme.text, fontSize: font(12), fontWeight: "700" as const };
  const closeConnection = () => { Keyboard.dismiss(); setShowConnection(false); };
  const start = () => {
    try {
      const validated = validateSttEndpoint(endpoint);
      if (!/^[a-f0-9]{64}$/.test(code.trim())) throw new Error();
      connection.current = { endpoint: validated, code: code.trim() };
    } catch {
      setShowConnection(true);
      setSnapshot({ phase: "idle", message: "Configure a conexão privada com o Mac para gravar." });
      return;
    }
    setShowConnection(false);
    void session.start();
  };
  return (
    <View testID="fluia-entrada-voz" style={styles.container}>
      <Text style={{ color: theme.textMuted, fontSize: font(11) }}>Seu áudio será enviado ao Google Cloud. Revise a transcrição antes de enviar.</Text>
      <Modal visible={visible && showConnection} transparent animationType="none" presentationStyle="overFullScreen" onRequestClose={closeConnection}>
        <KeyboardAvoidingView behavior="padding" style={[styles.connectionOverlay, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          <View accessibilityViewIsModal style={[styles.connectionCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" contentContainerStyle={styles.connection}>
              <Text accessibilityRole="header" style={[labelStyle, { fontSize: font(18) }]}>Conexão privada</Text>
              <TextInput accessibilityLabel="Endereço HTTPS privado do Mac" placeholder="https://endereço-do-mac:8787" value={endpoint} onChangeText={setEndpoint} autoCapitalize="none" autoCorrect={false} autoComplete="off" keyboardType="url" style={[styles.field, labelStyle, { borderColor: theme.border }]} placeholderTextColor={theme.textMuted} />
              <TextInput accessibilityLabel="Código temporário da sessão no Mac" placeholder="Código da sessão" value={code} onChangeText={setCode} autoCapitalize="none" autoCorrect={false} autoComplete="off" secureTextEntry textContentType="none" maxLength={64} style={[styles.field, labelStyle, { borderColor: theme.border }]} placeholderTextColor={theme.textMuted} />
              <Text style={{ color: theme.textMuted, fontSize: font(11) }}>Conexão com o Mac na mesma rede. O código fica só em memória e é apagado ao sair da página ou colocar o app em segundo plano.</Text>
              <Pressable accessibilityRole="button" onPress={closeConnection} style={[buttonStyle, { backgroundColor: theme.primary }]}><Text style={[labelStyle, { color: theme.onPrimary }]}>Concluir</Text></Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" accessibilityLabel={snapshot.phase === "recording" ? "Parar gravação e transcrever" : "Gravar mensagem por voz"} accessibilityState={{ disabled: disabled || (busy && snapshot.phase !== "recording"), busy }} disabled={disabled || (busy && snapshot.phase !== "recording")} onPress={snapshot.phase === "recording" ? () => { void session.finish(); } : start} style={[buttonStyle, disabled && { opacity: 0.5 }]}>
          {snapshot.phase === "recording" ? <Square size={18} color={theme.text} /> : <Mic size={18} color={theme.text} />}
          <Text style={labelStyle}>{snapshot.phase === "recording" ? "Parar" : "Gravar"}</Text>
        </Pressable>
        {busy ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Cancelar gravação ou transcrição" onPress={() => { void session.cancel(); }} style={buttonStyle}><Text style={labelStyle}>Cancelar</Text></Pressable>
        ) : (
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: showConnection }} onPress={() => setShowConnection((current) => !current)} style={buttonStyle}><Text style={labelStyle}>Conexão</Text></Pressable>
        )}
      </View>
      {snapshot.message ? <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: font(12) }}>{snapshot.message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6, paddingBottom: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  connectionOverlay: { flex: 1, justifyContent: "center", paddingHorizontal: 20, backgroundColor: "rgba(0,0,0,0.65)" },
  connectionCard: { maxHeight: "100%", width: "100%", maxWidth: 520, alignSelf: "center", borderWidth: 1, borderRadius: 20, overflow: "hidden" },
  connection: { gap: 12, padding: 16 },
  button: { minHeight: 44, minWidth: 44, borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  field: { minHeight: 44, borderRadius: 12, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
});
