import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import {
  flatSamples,
  intensityFromLevel,
  REST_INTENSITY,
  samplesFromLevel,
  type FluiVoiceStatus,
} from "./fluiVoice";
import { speechRecognition, useSpeechRecognitionEvent } from "./speechRecognition";
import { useFluiSpeechSession } from "./useFluiSpeechSession";

export type FluiVoice = {
  listening: boolean;
  transcript: string;
  samples: SharedValue<number[]>;
  intensity: number;
  unavailable: FluiVoiceStatus | null;
  start: () => void;
  stop: () => void;
};

function supportsContinuousRecognition() {
  return !(Platform.OS === "android" && Number(Platform.Version) < 33);
}

function recognitionOptions(continuous: boolean) {
  return {
    lang: "pt-BR",
    interimResults: true,
    continuous,
    volumeChangeEventOptions: {
      enabled: true,
      intervalMillis: 50,
    },
  };
}

export function useFluiVoice(reducedMotion: boolean): FluiVoice {
  const session = useFluiSpeechSession();
  const samples = useSharedValue(flatSamples());
  const [intensity, setIntensity] = useState(REST_INTENSITY);
  const level = useRef(0);
  const phase = useRef(0);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const settle = useCallback(() => {
    level.current = 0;
    samples.value = flatSamples();
    setIntensity(REST_INTENSITY);
  }, [samples]);

  useEffect(() => {
    session.restart.current = () => {
      speechRecognition?.start(recognitionOptions(false));
    };
  }, [session.restart]);

  useSpeechRecognitionEvent("volumechange", (event) => {
    level.current = event.value;
    if (reducedMotionRef.current) return;
    setIntensity(intensityFromLevel(event.value));
  });

  useEffect(() => {
    if (!session.listening || reducedMotion) {
      samples.value = flatSamples();
      if (reducedMotion) setIntensity(REST_INTENSITY);
      return;
    }

    let frame = 0;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      phase.current += 0.28;
      samples.value = samplesFromLevel(level.current, phase.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion, samples, session.listening]);

  useEffect(() => {
    return () => {
      session.wantsListen.current = false;
      speechRecognition?.abort();
    };
  }, [session.wantsListen]);

  const start = useCallback(() => {
    const recognition = speechRecognition;
    if (!recognition) {
      session.setUnavailable("unavailable");
      return;
    }

    void (async () => {
      if (!recognition.isRecognitionAvailable()) {
        session.setUnavailable("unavailable");
        return;
      }

      const permission = await recognition.requestPermissionsAsync();
      if (!permission.granted) {
        session.setUnavailable("not-allowed");
        return;
      }

      level.current = 0;
      session.markStarted();
      recognition.start(recognitionOptions(supportsContinuousRecognition()));
    })();
  }, [session]);

  const stop = useCallback(() => {
    const wasListening = session.wantsListen.current;
    session.markStopped();
    settle();
    if (wasListening) speechRecognition?.stop();
  }, [session, settle]);

  return {
    listening: session.listening,
    transcript: session.transcript,
    samples,
    intensity: reducedMotion ? REST_INTENSITY : intensity,
    unavailable: session.unavailable,
    start,
    stop,
  };
}
