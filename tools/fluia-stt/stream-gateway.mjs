import { timingSafeEqual } from 'node:crypto';
import { WebSocketServer } from 'ws';
import { SttError } from './handler.mjs';
import { createPcmSilenceDetector } from './pcm-silence.mjs';

export function isAuthorized(headers, token) {
  const a = Buffer.from(headers.authorization ?? ''), b = Buffer.from(`Bearer ${token}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Explicit one-time authorization on 23/10/2026: preserve the 20/576 ledger,
// allow only three additional 30-second reservations, never renew on restart.
export function streamingBudgetLimits(env = {}, initial) {
  if (env.STT_APPROVED_VALIDATION_EXTENSION === undefined) return { requests: 20, reservedSeconds: 600 };
  if (env.STT_APPROVED_VALIDATION_EXTENSION !== '23/666' || !initial || initial.requests < 20 || initial.reservedSeconds < 576) throw new Error('Extensão exige o ledger e os limites autorizados.');
  return { requests: 23, reservedSeconds: 666 };
}

export function createStreamingBudget({ initial = { requests: 0, reservedSeconds: 0 }, recordUsage, limits = { requests: 20, reservedSeconds: 600 } }) {
  const approved = (limits.requests === 20 && limits.reservedSeconds === 600) || (limits.requests === 23 && limits.reservedSeconds === 666);
  if (!approved || !Number.isInteger(initial.requests) || !Number.isInteger(initial.reservedSeconds) || initial.requests < 0 || initial.requests > limits.requests || initial.reservedSeconds < 0 || initial.reservedSeconds > limits.reservedSeconds) throw new Error('Orçamento inválido.');
  const usage = { ...initial };
  let busy = false;
  return {
    snapshot: () => ({ ...usage }),
    async reserve() {
      if (busy) throw new SttError('BUSY', 429);
      if (usage.requests >= limits.requests || usage.reservedSeconds + 30 > limits.reservedSeconds) throw new SttError('SESSION_LIMIT', 429);
      busy = true;
      usage.requests++; usage.reservedSeconds += 30;
      try { await recordUsage({ ...usage }); }
      catch { busy = false; throw new SttError('USAGE_UNAVAILABLE', 503); }
      let released = false;
      return () => { if (!released) { released = true; busy = false; } };
    },
  };
}

export function attachStreamGateway(server, { token, budget, openRecognition, timeoutMs = 38_000 }) {
  const sockets = new WebSocketServer({ noServer: true, maxPayload: 8192, perMessageDeflate: false });
  server.on('upgrade', (req, socket, head) => {
    if (req.url !== '/stream' || !isAuthorized(req.headers, token)) { socket.end('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n'); return; }
    // RN may send the private origin. No browser origin or URL token is accepted.
    if (req.headers.origin && req.headers.origin !== `https://${req.headers.host}`) { socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n'); return; }
    sockets.handleUpgrade(req, socket, head, ws => sockets.emit('connection', ws));
  });
  sockets.on('connection', ws => {
    let started = false, closed = false, finishing = false, cloud, opening;
    let heardSpeech = false;
    const silence = createPcmSilenceDetector();
    const controller = new AbortController();
    let release, bytes = 0, sequence = 0;
    const send = message => { if (ws.readyState === 1 && ws.bufferedAmount < 65_536) ws.send(JSON.stringify(message)); };
    const close = (code = 'CANCELED', notify = true) => {
      if (closed) return;
      closed = true; clearTimeout(timer);
      controller.abort();
      if (opening) {
        void opening.then(call => call.cancel()).then(() => release?.()).catch(() => { if (!cloud) release?.(); });
      } else release?.();
      if (notify) send({ type: 'error', code });
      ws.close();
    };
    const timer = setTimeout(() => close('TIMEOUT'), timeoutMs);
    ws.on('error', () => close('NETWORK', false));
    ws.on('close', () => close('CANCELED', false));
    ws.on('message', async (raw, binary) => {
      if (closed) return;
      try {
        if (binary) throw new SttError('INVALID_AUDIO');
        let message;
        try { message = JSON.parse(raw.toString('utf8')); } catch { throw new SttError('INVALID_AUDIO'); }
        if (message.type === 'cancel') { close('CANCELED', false); return; }
        if (message.type === 'start') {
          if (started || typeof message.id !== 'string' || !/^[a-zA-Z0-9-]{8,80}$/.test(message.id)) throw new SttError('DUPLICATE');
          started = true;
          release = await budget.reserve();
          if (closed) { release(); return; }
          opening = Promise.resolve(openRecognition({
            signal: controller.signal,
            partial: text => { if (!closed) { heardSpeech = true; send({ type: 'transcript', text: text.slice(0, 6000) }); } },
            completed: text => {
              if (closed) return;
              if (!text.trim()) { close('NO_SPEECH'); return; }
              send({ type: 'done', text: text.slice(0, 6000) });
              close('DONE', false);
            },
            failed: code => close(code),
          }));
          cloud = await opening;
          if (closed) return;
          send({ type: 'ready' });
          return;
        }
        if (!cloud) throw new SttError('NOT_READY');
        if (message.type === 'finish') {
          if (!finishing) { finishing = true; cloud.finish(); }
          return;
        }
        if (message.type === 'audio' && finishing) return;
        if (message.type !== 'audio' || message.sequence !== sequence || typeof message.content !== 'string' || message.content.length > 6000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(message.content) || message.content.length % 4) throw new SttError('INVALID_AUDIO');
        const pcm = Buffer.from(message.content, 'base64');
        if (pcm.length < 2 || pcm.length > 4096 || pcm.length % 2 || bytes + pcm.length > 960000) throw new SttError('AUDIO_DURATION');
        sequence++; bytes += pcm.length;
        if (!cloud.write(pcm)) throw new SttError('BACKPRESSURE');
        if (bytes === 960000 || silence.observe(pcm, heardSpeech)) { finishing = true; cloud.finish(); }
      } catch (error) { close(error instanceof SttError ? error.code : 'UPSTREAM_UNAVAILABLE'); }
    });
  });
  return { close: () => { for (const ws of sockets.clients) ws.terminate(); sockets.close(); } };
}
