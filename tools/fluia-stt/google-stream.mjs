export const streamingConfig = project => ({
  recognizer: `projects/${project}/locations/global/recognizers/_`,
  streamingConfig: {
    config: {
      explicitDecodingConfig: { encoding: 'LINEAR16', sampleRateHertz: 16000, audioChannelCount: 1 },
      languageCodes: ['pt-BR'], model: 'short', features: { enableAutomaticPunctuation: true },
    },
    streamingFeatures: {
      interimResults: true, enableVoiceActivityEvents: true,
      voiceActivityTimeout: { speechStartTimeout: { seconds: 8 }, speechEndTimeout: { seconds: 2 } },
    },
  },
});

export function googleStreamProvider(client, project, metrics = {}) {
  return async ({ partial, completed, failed, signal }) => {
    await client.initialize();
    signal.throwIfAborted();
    const call = client._streamingRecognize({ timeout: 38_000, retry: null, otherArgs: { headers: { 'x-goog-user-project': project } } });
    const final = [];
    let latestRecognized = '';
    let done = false, ending = false;
    let endTimer, startTimer, heardSpeech = false;
    const finish = () => {
      clearTimeout(endTimer);
      clearTimeout(startTimer);
      if (done || ending) return;
      ending = true;
      call.end();
    };
    let settle;
    const settled = new Promise(resolve => { settle = resolve; });
    call.on('data', data => {
      if (done) return;
      metrics.responses = (metrics.responses ?? 0) + 1;
      const event = data.speechEventType;
      if (event === 2 || event === 'SPEECH_ACTIVITY_BEGIN') {
        heardSpeech = true; clearTimeout(endTimer); clearTimeout(startTimer);
        metrics.speechBegins = (metrics.speechBegins ?? 0) + 1;
      } else if (event === 3 || event === 'SPEECH_ACTIVITY_END') {
        metrics.speechEnds = (metrics.speechEnds ?? 0) + 1;
        clearTimeout(endTimer); endTimer = setTimeout(finish, 2000);
      } else if (event === 1 || event === 'END_OF_SINGLE_UTTERANCE') finish();
      const interim = [];
      for (const result of data.results ?? []) {
        const text = result.alternatives?.[0]?.transcript?.trim();
        if (text) (result.isFinal ? final : interim).push(text);
      }
      const text = [...final, ...interim].join(' ');
      if (text) { latestRecognized = text; heardSpeech = true; clearTimeout(startTimer); partial(text); }
    });
    call.on('end', () => { clearTimeout(endTimer); clearTimeout(startTimer); settle(); if (!done) { done = true; completed(latestRecognized || final.join(' ')); } });
    call.on('error', error => {
      settle();
      clearTimeout(endTimer); clearTimeout(startTimer);
      if (!done) { done = true; failed([7, 16].includes(error.code) ? 'CLOUD_AUTH' : 'UPSTREAM_UNAVAILABLE'); }
    });
    call.write(streamingConfig(project));
    return {
      write: audio => {
        // Google can finish before the iPhone receives the final result and stops PCM.
        // Discard those in-flight frames instead of writing after the RPC half-close.
        if (done || ending) return true;
        if (!startTimer && !heardSpeech) startTimer = setTimeout(finish, 8000);
        metrics.audioFrames = (metrics.audioFrames ?? 0) + 1;
        return call.write({ audio });
      },
      finish,
      cancel: async () => {
        if (done) return;
        done = true; clearTimeout(endTimer); clearTimeout(startTimer); call.cancel();
        let timer;
        try { await Promise.race([settled, new Promise((_resolve, reject) => { timer = setTimeout(() => reject(new Error('CANCEL_TIMEOUT')), 3000); })]); }
        finally { clearTimeout(timer); }
      },
    };
  };
}
