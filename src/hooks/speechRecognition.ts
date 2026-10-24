import { useEffect, useRef } from "react";
import { requireOptionalNativeModule } from "expo-modules-core";
import { Platform } from "react-native";
import type { ExpoSpeechRecognitionNativeEventMap } from "expo-speech-recognition";

type SpeechModule = typeof import("expo-speech-recognition").ExpoSpeechRecognitionModule;
type SpeechEvents = {
  [K in keyof ExpoSpeechRecognitionNativeEventMap]: (
    event: ExpoSpeechRecognitionNativeEventMap[K],
  ) => void;
};

function loadSpeechRecognition(): SpeechModule | null {
  if (
    Platform.OS !== "web" &&
    !requireOptionalNativeModule("ExpoSpeechRecognition")
  ) {
    return null;
  }

  try {
    const speech =
      require("expo-speech-recognition") as typeof import("expo-speech-recognition");
    return speech.ExpoSpeechRecognitionModule;
  } catch {
    return null;
  }
}

export const speechRecognition = loadSpeechRecognition();

export function useSpeechRecognitionEvent<K extends keyof SpeechEvents>(
  eventName: K,
  listener: SpeechEvents[K],
) {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const recognition = speechRecognition;
    if (!recognition) return;

    const subscription = recognition.addListener(
      eventName,
      ((event: ExpoSpeechRecognitionNativeEventMap[K]) => {
        listenerRef.current(event);
      }) as never,
    );

    return () => subscription.remove();
  }, [eventName]);
}
