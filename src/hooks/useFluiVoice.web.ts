import { useCallback, useEffect, useRef, useState } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";
import { speechRecognition } from "./speechRecognition";

import {
  flatSamples,
  intensityFromSamples,
  REST_INTENSITY,
  samplesFromTimeDomain,
  type FluiVoiceStatus,
} from "./fluiVoice";
import { useFluiSpeechSession } from "./useFluiSpeechSession";

export type FluiVoice = {
  listening: boolean;
  transcript: string;
  settledUtterance: { id: number; text: string } | null;
  samples: SharedValue<number[]>;
  intensity: number;
  unavailable: FluiVoiceStatus | null;
  start: () => void;
  stop: () => void;
};

const FFT_SIZE = 256;

export function useFluiVoice(reducedMotion: boolean): FluiVoice {
  const session = useFluiSpeechSession();
  const samples = useSharedValue(flatSamples());
  const [intensity, setIntensity] = useState(REST_INTENSITY);
  const reducedMotionRef = useRef(reducedMotion);
  const generation = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef(0);
  reducedMotionRef.current = reducedMotion;

  const settle = useCallback(() => {
    samples.value = flatSamples();
    setIntensity(REST_INTENSITY);
  }, [samples]);

  const releaseCapture = useCallback(() => {
    generation.current += 1;
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void contextRef.current?.close();
    contextRef.current = null;
    settle();
  }, [settle]);

  const beginAnalyser = useCallback(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      session.setUnavailable("audio-capture");
      session.markStopped();
      return false;
    }

    const generationId = ++generation.current;
    void navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (generationId !== generation.current || !session.wantsListen.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = FFT_SIZE;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);
        streamRef.current = stream;
        contextRef.current = context;
        const bytes = new Uint8Array(analyser.fftSize);

        const tick = () => {
          if (generationId !== generation.current || !session.wantsListen.current) {
            return;
          }

          if (reducedMotionRef.current) {
            samples.value = flatSamples();
          } else {
            analyser.getByteTimeDomainData(bytes);
            const next = samplesFromTimeDomain(bytes);
            samples.value = next;
            const nextIntensity = intensityFromSamples(next);
            setIntensity((current) =>
              Math.abs(current - nextIntensity) > 0.04 ? nextIntensity : current,
            );
          }

          frameRef.current = requestAnimationFrame(tick);
        };

        frameRef.current = requestAnimationFrame(tick);
      })
      .catch(() => {
        if (generationId !== generation.current) return;
        session.setUnavailable("not-allowed");
        session.markStopped();
        speechRecognition?.abort();
        settle();
      });
    return true;
  }, [samples, session, settle]);

  useEffect(() => {
    return () => {
      session.wantsListen.current = false;
      speechRecognition?.abort();
      releaseCapture();
    };
  }, [releaseCapture, session.wantsListen]);

  const start = useCallback(() => {
    const recognition = speechRecognition;
    if (!recognition || !recognition.isRecognitionAvailable()) {
      session.setUnavailable("unavailable");
      return;
    }

    session.markStarted();
    if (!beginAnalyser()) return;
    recognition.start({
      lang: "pt-BR",
      interimResults: true,
      continuous: true,
    });
  }, [beginAnalyser, session]);

  const stop = useCallback(() => {
    const wasListening = session.wantsListen.current;
    session.markStopped();
    releaseCapture();
    if (wasListening) speechRecognition?.stop();
  }, [releaseCapture, session]);

  return {
    listening: session.listening,
    transcript: session.transcript,
    settledUtterance: session.settledUtterance,
    samples,
    intensity: reducedMotion ? REST_INTENSITY : intensity,
    unavailable: session.unavailable,
    start,
    stop,
  };
}
