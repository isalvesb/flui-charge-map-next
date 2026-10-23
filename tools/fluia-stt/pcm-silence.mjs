export function createPcmSilenceDetector({
  sampleRate = 16000,
  thresholdRms = 400,
  silenceMs = 2000,
} = {}) {
  const target = Math.ceil(sampleRate * silenceMs / 1000);
  let silentSamples = 0;

  return {
    observe(pcm, speechDetected) {
      if (!speechDetected) {
        silentSamples = 0;
        return false;
      }

      const count = pcm.length / 2;
      if (!Number.isInteger(count) || count === 0) {
        return false;
      }

      let energy = 0;
      for (let i = 0; i < pcm.length; i += 2) {
        const sample = pcm.readInt16LE(i);
        energy += sample * sample;
      }

      const quiet = energy / count < thresholdRms ** 2;
      silentSamples = quiet ? silentSamples + count : 0;
      return silentSamples >= target;
    },
  };
}
