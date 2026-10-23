import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { createSttHandler, inspectWav } from './handler.mjs';

const code = 'a'.repeat(64);
function wav(seconds = 1, level = 1000) {
  const samples = Math.floor(seconds * 16_000);
  const out = Buffer.alloc(44 + samples * 2);
  out.write('RIFF'); out.writeUInt32LE(out.length - 8, 4); out.write('WAVEfmt ', 8);
  out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22);
  out.writeUInt32LE(16_000, 24); out.writeUInt32LE(32_000, 28);
  out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34); out.write('data', 36);
  out.writeUInt32LE(samples * 2, 40);
  for (let i = 44; i < out.length; i += 2) out.writeInt16LE(level, i);
  return out;
}
async function fixture(t, options = {}) {
  const calls = [], ledger = [];
  const server = createServer(createSttHandler({ token: code,
    recognize: async (audio) => { calls.push(audio.length); return { text: 'Quero carregar rápido.' }; },
    recordUsage: async (usage) => { ledger.push(usage); }, ...options,
  }));
  server.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => { server.close(); server.closeAllConnections(); });
  let id = 0;
  const url = `http://127.0.0.1:${server.address().port}`;
  const request = (body = { content: wav().toString('base64'), requestId: `request-${++id}` }, headers = {}, path = '/transcribe') => fetch(`${url}${path}`, {
    method: 'POST', headers: { Authorization: `Bearer ${code}`, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
  });
  return { request, calls, ledger, url };
}

test('valida contêiner, formato, duração e silêncio a partir dos bytes reais', () => {
  assert.equal(inspectWav(wav(1.25)), 1.25);
  for (const audio of [Buffer.from('not wav'), wav(0.1), wav(31), wav(1, 0)]) assert.throws(() => inspectWav(audio));
  const stereo = wav(); stereo.writeUInt16LE(2, 22); assert.throws(() => inspectWav(stereo));
  const wrongSize = wav(); wrongSize.writeUInt32LE(100, 4); assert.throws(() => inspectWav(wrongSize));
  const wrongRate = wav(); wrongRate.writeUInt32LE(44_100, 24); assert.throws(() => inspectWav(wrongRate));
});

test('HTTP local de teste recebe WAV, devolve transcrição e registra apenas consumo', async (t) => {
  const f = await fixture(t);
  const res = await f.request();
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  const body = await res.json();
  assert.equal(body.text, 'Quero carregar rápido.');
  assert.equal(body.audioSeconds, 1);
  assert.equal(f.calls.length, 1);
  assert.deepEqual(f.ledger, [{ requests: 1, reservedSeconds: 1 }]);
});

test('rejeita acesso sem código, origem de navegador e conteúdo inválido antes do Google', async (t) => {
  const f = await fixture(t);
  assert.equal((await f.request(undefined, { Authorization: '' })).status, 401);
  assert.equal((await f.request(undefined, { Origin: 'https://untrusted.invalid' })).status, 403);
  assert.equal((await f.request({ content: 'AAAA', requestId: 'request-1' })).status, 400);
  assert.equal((await f.request({ content: wav(1, 0).toString('base64'), requestId: 'request-2' })).status, 422);
  assert.equal((await f.request(undefined, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await f.request({ content: 'A'.repeat(1_400_001), requestId: 'request-3' })).status, 413);
  assert.equal(f.calls.length, 0);
});

test('limites reais de chamadas/duração e deduplicação impedem consumo repetido', async (t) => {
  const f = await fixture(t, { maxRequests: 2, maxSeconds: 2 });
  const body = { content: wav().toString('base64'), requestId: 'request-once' };
  assert.equal((await f.request(body)).status, 200);
  assert.equal((await f.request(body)).status, 409);
  assert.equal((await f.request({ content: wav(2).toString('base64'), requestId: 'request-large' })).status, 429);
  assert.equal((await f.request()).status, 200);
  assert.equal((await f.request()).status, 429);
  assert.equal(f.calls.length, 2);
  const health = await fetch(`${f.url}/health`, { headers: { Authorization: `Bearer ${code}` } });
  assert.deepEqual(await health.json(), { ready: true, requests: 2, reservedSeconds: 2 });
});

test('resposta vazia e falha do Google não vazam dados e reservam consumo', async (t) => {
  for (const result of ['empty', 'error']) {
    const f = await fixture(t, { recognize: async () => { if (result === 'error') throw new Error('secret google token'); return { text: '' }; } });
    const res = await f.request();
    assert.equal(res.status, result === 'empty' ? 422 : 502);
    assert.doesNotMatch(await res.text(), /secret|token/);
    assert.deepEqual(f.ledger, [{ requests: 1, reservedSeconds: 1 }]);
  }
});

test('apenas uma chamada simultânea; desconexão cancela provedor e mantém reserva', async (t) => {
  let startedResolve;
  const started = new Promise((resolve) => { startedResolve = resolve; });
  let abortedResolve;
  const aborted = new Promise((resolve) => { abortedResolve = resolve; });
  const f = await fixture(t, { recognize: async (_audio, signal) => {
    startedResolve();
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => { abortedResolve(); reject(new Error('abort')); }, { once: true }));
  } });
  const abort = new AbortController();
  const pending = fetch(`${f.url}/transcribe`, { method: 'POST', signal: abort.signal,
    headers: { Authorization: `Bearer ${code}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: wav().toString('base64'), requestId: 'request-pending' }),
  }).catch(() => null);
  await started;
  assert.equal((await f.request()).status, 429);
  abort.abort();
  await pending;
  await aborted;
  assert.deepEqual(f.ledger, [{ requests: 1, reservedSeconds: 1 }]);
});

test('timeout não publica transcrição tardia nem refaz a chamada', async (t) => {
  let calls = 0;
  const f = await fixture(t, { timeoutMs: 10, recognize: async () => {
    calls++;
    await new Promise(resolve => setTimeout(resolve, 30));
    return { text: 'Resposta que chegou tarde' };
  } });
  const res = await f.request();
  assert.equal(res.status, 504);
  assert.deepEqual(await res.json(), { code: 'TIMEOUT' });
  assert.equal(calls, 1);
  assert.deepEqual(f.ledger, [{ requests: 1, reservedSeconds: 1 }]);
});

test('falha de registro de consumo impede envio ao Google e mantém reserva', async (t) => {
  const f = await fixture(t, { recordUsage: async () => { throw new Error('disk'); } });
  assert.equal((await f.request()).status, 502);
  assert.equal(f.calls.length, 0);
  const health = await fetch(`${f.url}/health`, { headers: { Authorization: `Bearer ${code}` } });
  assert.deepEqual(await health.json(), { ready: true, requests: 1, reservedSeconds: 1 });
});

test('configuração não pode ultrapassar os limites aprovados', () => {
  const options = { token: code, recognize: async () => ({ text: '' }) };
  for (const invalid of [{ maxRequests: 21 }, { maxSeconds: 601 }, { timeoutMs: 26000 }, { maxRequests: 0 }]) assert.throws(() => createSttHandler({ ...options, ...invalid }));
});
