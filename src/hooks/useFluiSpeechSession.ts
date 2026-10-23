import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";
import { useSpeechRecognitionEvent } from "./speechRecognition";

import { applyTranscript, type FluiVoiceStatus } from "./fluiVoice";

export function useFluiSpeechSession() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [unavailable, setUnavailable] = useState<FluiVoiceStatus | null>(null);
  const wantsListen = useRef(false);
  const committed = useRef("");
  const restart = useRef<(() => void) | null>(null);

  const markStopped = useCallback(() => {
    wantsListen.current = false;
    setListening(false);
  }, []);

  const markStarted = useCallback(() => {
    committed.current = "";
    setTranscript("");
    setUnavailable(null);
    wantsListen.current = true;
    setListening(true);
  }, []);

  useSpeechRecognitionEvent("result", (event) => {
    const next = applyTranscript(
      committed.current,
      event.results[0]?.transcript ?? "",
      event.isFinal,
    );
    committed.current = next.committed;
    setTranscript(next.text);
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (
      event.error === "not-allowed" ||
      event.error === "audio-capture" ||
      event.error === "service-not-allowed"
    ) {
      wantsListen.current = false;
      setListening(false);
      setUnavailable(event.error);
    }
  });

  useSpeechRecognitionEvent("end", () => {
    const shouldRestart =
      wantsListen.current &&
      Platform.OS === "android" &&
      Number(Platform.Version) < 33;

    if (shouldRestart) {
      restart.current?.();
      return;
    }

    wantsListen.current = false;
    setListening(false);
  });

  return {
    listening,
    transcript,
    unavailable,
    setUnavailable,
    wantsListen,
    restart,
    markStarted,
    markStopped,
  };
}
