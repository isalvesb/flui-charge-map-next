export const VOICE_SAMPLE_COUNT = 48;
export const REST_INTENSITY = 0.2;

export type FluiVoiceStatus =
  | "unavailable"
  | "not-allowed"
  | "audio-capture"
  | "service-not-allowed";

export function flatSamples(): number[] {
  return Array.from({ length: VOICE_SAMPLE_COUNT }, () => 0);
}

export function joinSpeech(committed: string, piece: string) {
  if (!committed) return piece;
  if (!piece) return committed;
  return `${committed} ${piece}`;
}

export function applyTranscript(
  committed: string,
  transcript: string,
  isFinal: boolean,
) {
  const piece = transcript.trim();
  if (!isFinal) {
    return { committed, text: joinSpeech(committed, piece) };
  }

  const next = joinSpeech(committed, piece);
  return { committed: next, text: next };
}

export function intensityFromLevel(level: number) {
  const amount = Math.min(1, Math.max(0, level) / 10);
  return REST_INTENSITY + amount;
}

export function intensityFromSamples(samples: readonly number[]) {
  if (samples.length === 0) return REST_INTENSITY;
  let energy = 0;
  for (const sample of samples) energy += Math.abs(sample);
  const amount = Math.min(1, energy / samples.length);
  return REST_INTENSITY + amount;
}

export function samplesFromLevel(level: number, phase: number) {
  const amount = Math.min(1, Math.max(0, level) / 10);
  const amplitude = 0.08 + amount * 0.92;
  const mid = (VOICE_SAMPLE_COUNT - 1) / 2;

  return Array.from({ length: VOICE_SAMPLE_COUNT }, (_, index) => {
    const t = (index - mid) / mid;
    const envelope = Math.cos((Math.abs(t) * Math.PI) / 2);
    const wave = Math.sin(Math.abs(t) * Math.PI * 3 + phase);
    return wave * envelope * amplitude;
  });
}

export function samplesFromTimeDomain(bytes: Uint8Array) {
  const samples = new Array<number>(VOICE_SAMPLE_COUNT);
  const step = bytes.length / VOICE_SAMPLE_COUNT;

  for (let index = 0; index < VOICE_SAMPLE_COUNT; index += 1) {
    const source = Math.min(bytes.length - 1, Math.floor(index * step));
    samples[index] = ((bytes[source] ?? 128) - 128) / 128;
  }

  return samples;
}
