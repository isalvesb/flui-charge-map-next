import { timingSafeEqual } from 'node:crypto';

export class SttError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}

// Validate the actual container, never trust the app's duration or file extension.
export function inspectWav(audio) {
  if (audio.length < 44 || audio.length > 1_024_000 ||
      audio.toString('ascii', 0, 4) !== 'RIFF' || audio.toString('ascii', 8, 12) !== 'WAVE' ||
      audio.readUInt32LE(4) + 8 !== audio.length) throw new SttError('INVALID_AUDIO');
  let format, samples;
  for (let offset = 12; offset + 8 <= audio.length;) {
    const name = audio.toString('ascii', offset, offset + 4);
    const size = audio.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (start + size > audio.length) throw new SttError('INVALID_AUDIO');
    if (name === 'fmt ') {
      if (format || size < 16) throw new SttError('INVALID_AUDIO');
      format = audio.subarray(start, start + size);
    }
    if (name === 'data') {
      if (samples) throw new SttError('INVALID_AUDIO');
      samples = audio.subarray(start, start + size);
    }
    offset = start + size + (size % 2);
  }
  if (!format || !samples || format.readUInt16LE(0) !== 1 ||
      format.readUInt16LE(2) !== 1 || format.readUInt32LE(4) !== 16_000 ||
      format.readUInt32LE(8) !== 32_000 || format.readUInt16LE(12) !== 2 ||
      format.readUInt16LE(14) !== 16 || samples.length % 2) throw new SttError('INVALID_AUDIO');
  const seconds = samples.length / 32_000;
  if (seconds < 0.3 || seconds > 30.25) throw new SttError('AUDIO_DURATION');
  let audible = false;
  for (let i = 0; i < samples.length; i += 2) {
    if (Math.abs(samples.readInt16LE(i)) > 32) { audible = true; break; }
  }
  if (!audible) throw new SttError('NO_SPEECH', 422);
  return seconds;
}

export function createSttHandler({ token, recognize, recordUsage = async () => {}, maxRequests = 20, maxSeconds = 600, timeoutMs = 25_000 }) {
  if (!token || token.length < 32) throw new Error('Código de sessão ausente ou fraco.');
  if (!Number.isInteger(maxRequests) || maxRequests < 1 || maxRequests > 20 ||
      !Number.isInteger(maxSeconds) || maxSeconds < 1 || maxSeconds > 600 ||
      !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 25_000) throw new Error('Limites inválidos.');
  const expected = Buffer.from(`Bearer ${token}`);
  const seen = new Set();
  const usage = { requests: 0, reservedSeconds: 0 };
  let busy = false;
  return async function handler(req, res) {
    const reply = (status, body) => {
      if (!res.destroyed) {
        res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
        res.end(JSON.stringify(body));
      }
    };
    const supplied = Buffer.from(req.headers.authorization ?? '');
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
      reply(401, { code: 'UNAUTHORIZED' }); return;
    }
    if (req.headers.origin) { reply(403, { code: 'NATIVE_ONLY' }); return; }
    if (req.method === 'GET' && req.url === '/health') { reply(200, { ready: true, ...usage }); return; }
    if (req.method !== 'POST' || req.url !== '/transcribe') { reply(404, { code: 'NOT_FOUND' }); return; }
    if (busy) { reply(429, { code: 'BUSY' }); return; }
    if (usage.requests >= maxRequests) { reply(429, { code: 'SESSION_LIMIT' }); return; }
    if (req.headers['content-type'] !== 'application/json') { reply(415, { code: 'INVALID_AUDIO' }); return; }
    busy = true;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      // requestTimeout alone does not release an async body reader reliably.
      if (!req.complete) req.destroy();
    }, timeoutMs);
    const onClose = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', onClose);
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 1_400_000) throw new SttError('INVALID_AUDIO', 413);
        chunks.push(chunk);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch { throw new SttError('INVALID_AUDIO'); }
      if (!body || typeof body.content !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(body.content) ||
          body.content.length % 4 || typeof body.requestId !== 'string' ||
          !/^[a-zA-Z0-9-]{8,80}$/.test(body.requestId)) throw new SttError('INVALID_AUDIO');
      if (seen.has(body.requestId)) throw new SttError('DUPLICATE', 409);
      const audio = Buffer.from(body.content, 'base64');
      const seconds = Math.ceil(inspectWav(audio));
      if (usage.reservedSeconds + seconds > maxSeconds) throw new SttError('SESSION_LIMIT', 429);
      controller.signal.throwIfAborted();
      // Reserve even on timeout/cancellation: Google may already have received the audio.
      usage.requests += 1;
      usage.reservedSeconds += seconds;
      seen.add(body.requestId);
      await recordUsage({ ...usage });
      controller.signal.throwIfAborted();
      const started = performance.now();
      const result = await recognize(audio, controller.signal);
      controller.signal.throwIfAborted();
      const text = result.text?.trim();
      if (!text) throw new SttError('NO_SPEECH', 422);
      reply(200, { text, elapsedMs: Math.round(performance.now() - started), audioSeconds: seconds });
    } catch (error) {
      if (error instanceof SttError) reply(error.status, { code: error.code });
      else reply(controller.signal.aborted ? 504 : 502, { code: controller.signal.aborted ? 'TIMEOUT' : 'UPSTREAM_UNAVAILABLE' });
    } finally {
      clearTimeout(timer);
      res.off('close', onClose);
      busy = false;
    }
  };
}
