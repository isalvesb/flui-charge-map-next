import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { isPrivateIPv4 } from './settings.mjs';

const execute = promisify(execFile);

export async function approvePairingOnMac({ address, signal }) {
  if (!isPrivateIPv4(address)) return false;
  const script = `display dialog "Você pediu uma conexão no Flui Voz 2.3?\\n\\nDispositivo na rede privada: ${address}\\n\\nPermitir acesso à sessão de voz deste Mac?" with title "FluIA — Conectar iPhone" buttons {"Cancelar", "Permitir"} default button "Permitir" cancel button "Cancelar" giving up after 25`;
  try {
    const { stdout } = await execute('/usr/bin/osascript', ['-e', script], { signal, timeout: 28_000, maxBuffer: 1024 });
    return !signal.aborted && stdout.includes('button returned:Permitir');
  } catch { return false; }
}

// Only an explicit local Mac approval releases the existing session capability.
// No audio, Google RPC, URL token, persistent client credential or public origin.
export function createPairingHandler({ token, approve = approvePairingOnMac, timeoutMs = 30_000, cooldownMs = 2000 }) {
  let current, lastAttempt = -Infinity;
  const send = (res, status, value) => {
    if (res.destroyed || res.writableEnded) return;
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(value));
  };
  return {
    handle(req, res) {
      if (req.url !== '/pair') return false;
      const address = (req.socket.remoteAddress ?? '').replace(/^::ffff:/, '');
      if (req.method !== 'POST' || req.headers.origin || !isPrivateIPv4(address) || !/^application\/json(?:;|$)/i.test(req.headers['content-type'] ?? '') || Number(req.headers['content-length'] ?? 0) > 128) {
        send(res, 403, { code: 'PAIR_DENIED' }); req.resume(); return true;
      }
      if (current) { send(res, 409, { code: 'PAIR_BUSY' }); req.resume(); return true; }
      if (Date.now() - lastAttempt < cooldownMs) { send(res, 429, { code: 'PAIR_BUSY' }); req.resume(); return true; }
      lastAttempt = Date.now();
      const controller = new AbortController(); current = controller;
      let body = '', closed = false;
      const finish = (status, value) => {
        if (closed) return;
        closed = true; clearTimeout(timer); controller.abort();
        if (current === controller) current = undefined;
        send(res, status, value);
      };
      const timer = setTimeout(() => finish(408, { code: 'PAIR_TIMEOUT' }), timeoutMs);
      res.once('close', () => finish(403, { code: 'PAIR_CANCELED' }));
      req.on('error', () => finish(403, { code: 'PAIR_CANCELED' }));
      req.on('data', chunk => { if (closed) return; body += chunk.toString(); if (Buffer.byteLength(body) > 128) finish(403, { code: 'PAIR_DENIED' }); });
      req.once('end', async () => {
        if (closed) return;
        try {
          if (body !== '{}') { finish(403, { code: 'PAIR_DENIED' }); return; }
          const allowed = await approve({ address, signal: controller.signal });
          const accepted = allowed && !controller.signal.aborted;
          if (!closed) finish(accepted ? 200 : 403, accepted ? { ready: true, code: token } : { code: 'PAIR_DENIED' });
        } catch { finish(403, { code: 'PAIR_DENIED' }); }
      });
      return true;
    },
    close() { current?.abort(); },
  };
}
