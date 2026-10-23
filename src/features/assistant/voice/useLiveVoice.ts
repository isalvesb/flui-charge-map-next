import { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, AppState, Platform } from "react-native";
import { voiceConnection } from "./connectionStore";
import { useVoiceConnection } from "./useVoiceConnection";
import { LiveVoiceSession, type LiveSnapshot } from "./liveVoiceSession";
import { preparePcmCapture } from "./nativePcm";
import { openLiveStream } from "./liveTransport";
import { checkCanceled } from "./cancellation";

type Props = { visible: boolean; disabled: boolean; reducedMotion: boolean; beforeRecording: () => Promise<void>; received: (text: string) => void };
export function useLiveVoice(props: Props) {
  const connection = useVoiceConnection();
  const callbacks = useRef(props); callbacks.current = props;
  const mounted = useRef(false), permission = useRef(false), opened = useRef(false);
  const [snapshot, setSnapshot] = useState<LiveSnapshot>({ phase: "idle", text: "", message: "" });
  const session = useMemo(() => new LiveVoiceSession({
    prepare: async signal => {
      voiceConnection.read();
      await callbacks.current.beforeRecording(); checkCanceled(signal);
      return preparePcmCapture(signal, shown => { permission.current = shown; });
    },
    connect: (signal, partial, final, failed) => {
      const connection = voiceConnection.read();
      return openLiveStream(connection.endpoint, connection.code, signal, partial, final, failed);
    },
    received: text => { if (mounted.current && callbacks.current.visible && AppState.currentState === "active") callbacks.current.received(text); },
    changed: state => {
      if (!mounted.current) return;
      setSnapshot(state);
      if (state.phase === "recording") AccessibilityInfo.announceForAccessibility("Ouvindo. Toque na Orb para concluir ou aguarde uma pausa.");
      if (state.phase === "error") AccessibilityInfo.announceForAccessibility(state.message);
    },
  }), []);
  useEffect(() => {
    mounted.current = true;
    const listener = AppState.addEventListener("change", state => {
      if (state === "background" || (state === "inactive" && !permission.current)) void session.cancel();
    });
    return () => { mounted.current = false; listener.remove(); void session.cancel(); };
  }, [session]);
  useEffect(() => {
    if (!props.visible) {
      opened.current = false;
      void session.cancel().then(() => { if (mounted.current && !callbacks.current.visible) setSnapshot({ phase: "idle", text: "", message: "" }); });
      return;
    }
    if (opened.current || Platform.OS !== "ios") return;
    opened.current = true;
    if (!connection.ready) return;
    const timer = setTimeout(() => { if (callbacks.current.visible && !callbacks.current.disabled && AppState.currentState === "active") void session.start(); }, props.reducedMotion ? 0 : 500);
    return () => clearTimeout(timer);
  }, [props.visible, props.reducedMotion, connection.ready, session]);
  useEffect(() => { if (!connection.ready) void session.cancel(); }, [connection.ready, session]);
  const press = () => {
    if (props.disabled || Platform.OS !== "ios") return;
    if (snapshot.phase === "recording") void session.finish();
    else if (["requesting", "processing", "canceling"].includes(snapshot.phase)) void session.cancel();
    else void session.start();
  };
  return { ...snapshot, supported: Platform.OS === "ios", press, cancel: () => { void session.cancel(); } };
}
