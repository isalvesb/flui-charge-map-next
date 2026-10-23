import { isAuthorized } from './stream-gateway.mjs';
import { SttError } from './handler.mjs';

export const ZEPHYR_VOICE = 'pt-BR-Chirp3-HD-Zephyr';
export const TTS_LIMITS = Object.freeze({ requests: 10, characters: 10_000 });
const MAX_AUDIO_BYTES = 1_500_000;

// Separate from STT. Reservations survive failure/cancellation and restarts.
export function createTtsBudget({ initial = { requests: 0, characters: 0 }, recordUsage }) {
  for (const key of ['requests', 'characters']) {
    if (!Number.isInteger(initial[key]) || initial[key] < 0 || initial[key] > TTS_LIMITS[key]) throw new Error('Consumo TTS inválido.');
  }
  const usage = { requests: initial.requests, characters: initial.characters };
  return {
    snapshot: () => ({ ...usage }),
    async reserve(characters) {
      if (!Number.isInteger(characters) || characters < 1 || characters > 2000) throw new SttError('INVALID_TEXT');
      if (usage.requests >= TTS_LIMITS.requests || usage.characters + characters > TTS_LIMITS.characters) throw new SttError('TTS_LIMIT', 429);
      usage.requests++; usage.characters += characters;
      try { await recordUsage({ ...usage }); }
      catch { throw new SttError('USAGE_UNAVAILABLE', 503); }
    },
  };
}

export function googleZephyrProvider(auth, project, request = fetch) {
  return async (text, signal) => {
    const accessToken = await auth.getAccessToken();
    signal.throwIfAborted();
    const response = await request('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST', signal,
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'x-goog-user-project': project },
      body: JSON.stringify({ input: { text }, voice: { languageCode: 'pt-BR', name: ZEPHYR_VOICE }, audioConfig: { audioEncoding: 'MP3' } }),
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new SttError(response.status === 401 || response.status === 403 ? 'CLOUD_AUTH' : 'TTS_UNAVAILABLE', 502);
    }
    const reader = response.body.getReader();
    let bytes = 0;
    const chunks = [];
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.length;
        if (bytes > MAX_AUDIO_BYTES * 1.4) throw new SttError('INVALID_RESPONSE', 502);
        chunks.push(value);
      }
    } finally { await reader.cancel(); }
    let body;
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
    catch { throw new SttError('INVALID_RESPONSE', 502); }
    if (typeof body.audioContent !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.audioContent) || body.audioContent.length % 4 || Buffer.byteLength(body.audioContent, 'base64') > MAX_AUDIO_BYTES) throw new SttError('INVALID_RESPONSE', 502);
    return body.audioContent;
  };
}

export function createTtsHandler({ token, budget, synthesize, timeoutMs = 20_000 }) {
  let busy = false;
  const seen = new Set();
  const controllers = new Set();
  const handler = async (req, res) => {
    const reply = (status, body) => {
      if (!res.destroyed && !res.writableEnded) {
        res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        res.end(JSON.stringify(body));
      }
    };
    if (!isAuthorized(req.headers, token)) { reply(401, { code: 'UNAUTHORIZED' }); return; }
    if (req.headers.origin) { reply(403, { code: 'NATIVE_ONLY' }); return; }
    if (req.method !== 'POST' || req.url !== '/synthesize') { reply(404, { code: 'NOT_FOUND' }); return; }
    if (req.headers['content-type'] !== 'application/json') { reply(415, { code: 'INVALID_TEXT' }); return; }
    if (busy) { reply(429, { code: 'BUSY' }); return; }
    busy = true;
    const controller = new AbortController(); controllers.add(controller);
    const aborted = () => controller.abort();
    req.once('aborted', aborted);
    const closed = () => { if (!res.writableEnded) controller.abort(); };
    res.once('close', closed);
    let timer;
    const deadline = new Promise((_resolve, reject) => {
      timer = setTimeout(() => { controller.abort(); if (!req.complete) req.destroy(); reject(new SttError('TIMEOUT', 504)); }, timeoutMs);
    });
    const work = async () => {
      const chunks = []; let bytes = 0;
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 16_000) throw new SttError('INVALID_TEXT', 413);
        chunks.push(chunk);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new SttError('INVALID_TEXT'); }
      if (!body || typeof body.text !== 'string' || !body.text.trim() || body.text.length > 2000 || Buffer.byteLength(body.text) > 4000 || typeof body.requestId !== 'string' || !/^[a-zA-Z0-9-]{8,80}$/.test(body.requestId) || Object.keys(body).some(key => !['text', 'requestId'].includes(key))) throw new SttError('INVALID_TEXT');
      if (seen.has(body.requestId)) throw new SttError('DUPLICATE', 409);
      controller.signal.throwIfAborted();
      await budget.reserve([...body.text].length);
      seen.add(body.requestId);
      controller.signal.throwIfAborted();
      const audioContent = await synthesize(body.text, controller.signal);
      controller.signal.throwIfAborted();
      return { audioContent, encoding: 'MP3', voice: ZEPHYR_VOICE };
    };
    // Keep the single-call lock until the upstream really settles, even if a
    // timeout has already answered the phone. No automatic retry or refund.
    const operation = work().finally(() => { busy = false; controllers.delete(controller); });
    try { reply(200, await Promise.race([operation, deadline])); }
    catch (error) { reply(error instanceof SttError ? error.status : controller.signal.aborted ? 504 : 502, { code: error instanceof SttError ? error.code : controller.signal.aborted ? 'TIMEOUT' : 'TTS_UNAVAILABLE' }); }
    finally { clearTimeout(timer); req.off('aborted', aborted); res.off('close', closed); }
  };
  handler.close = () => { for (const controller of controllers) controller.abort(); };
  return handler;
}
