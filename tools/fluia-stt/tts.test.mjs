import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createTtsBudget, createTtsHandler, googleZephyrProvider, ZEPHYR_VOICE } from './tts.mjs';

const token = 'a'.repeat(64), audio = Buffer.from('ID3-test-audio').toString('base64');
async function fixture(t, { synthesize = async () => audio, initial, timeoutMs } = {}) {
  const records = [], calls = [];
  const budget = createTtsBudget({ initial, recordUsage: async usage => { records.push(usage); } });
  const handler = createTtsHandler({ token, budget, timeoutMs, synthesize: async (text, signal) => { calls.push(text); return synthesize(text, signal); } });
  const server = createServer(handler); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { handler.close(); server.closeAllConnections(); server.close(); });
  const url = `http://127.0.0.1:${server.address().port}/synthesize`;
  const send = (body = { text: 'Olá, motorista.', requestId: 'request-0001' }, headers = {}, signal) => fetch(url, { method: 'POST', signal, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  return { records, calls, budget, send };
}

test('TTS exige autenticação nativa e texto válido antes de reservar consumo', async t => {
  const f = await fixture(t);
  assert.equal((await f.send(undefined, { Authorization: 'Bearer inválido' })).status, 401);
  assert.equal((await f.send(undefined, { Origin: 'https://example.com' })).status, 403);
  for (const text of ['', ' '.repeat(10), 'a'.repeat(2001), '🚗'.repeat(1001)]) assert.equal((await f.send({ text, requestId: 'request-0001' })).status, 400);
  assert.deepEqual(f.budget.snapshot(), { requests: 0, characters: 0 });
  assert.equal(f.calls.length, 0);
});

test('TTS entrega somente áudio Zephyr e deduplica antes de chamar o Google', async t => {
  const f = await fixture(t);
  const response = await f.send();
  assert.deepEqual(await response.json(), { audioContent: audio, encoding: 'MP3', voice: ZEPHYR_VOICE });
  assert.equal((await f.send()).status, 409);
  assert.deepEqual(f.records, [{ requests: 1, characters: 15 }]);
  assert.equal(f.calls.length, 1);
});

test('ledger TTS persiste teto cumulativo separado, sem renovar saldo em reinício', async t => {
  const f = await fixture(t, { initial: { requests: 9, characters: 9990 } });
  assert.equal((await f.send()).status, 429);
  assert.equal(f.calls.length, 0);
  const accepted = await f.send({ text: 'Oi.', requestId: 'request-0002' });
  assert.equal(accepted.status, 200);
  const resumed = createTtsBudget({ initial: f.budget.snapshot(), recordUsage: async () => {} });
  await assert.rejects(resumed.reserve(1), { code: 'TTS_LIMIT' });
  for (const initial of [{ requests: -1, characters: 0 }, { requests: 0, characters: 10001 }, { requests: 1.1, characters: 1 }]) assert.throws(() => createTtsBudget({ initial, recordUsage: async () => {} }));
});

test('falha Google mantém reserva, oculta detalhes e não repete síntese', async t => {
  const f = await fixture(t, { synthesize: async () => { throw new Error('detalhe privado'); } });
  const response = await f.send();
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { code: 'TTS_UNAVAILABLE' });
  assert.equal(f.budget.snapshot().requests, 1);
  assert.equal(f.calls.length, 1);
});

test('falha ao registrar consumo impede chamada ao provedor', async () => {
  const budget = createTtsBudget({ recordUsage: async () => { throw new Error(); } });
  await assert.rejects(budget.reserve(30), { code: 'USAGE_UNAVAILABLE' });
  assert.equal(budget.snapshot().requests, 1);
});

test('timeout mantém exclusão até provedor encerrar e ignora áudio tardio', async t => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const f = await fixture(t, { synthesize: () => pending, timeoutMs: 50 });
  const response = await f.send();
  assert.equal(response.status, 504);
  assert.equal((await f.send({ text: 'Outra', requestId: 'request-0002' })).status, 429);
  release(audio);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.calls.length, 1);
  assert.equal(f.budget.snapshot().requests, 1);
});

test('cancelar cliente aborta Google sem reembolso nem segunda chamada', async t => {
  let entered, aborted;
  const started = new Promise(resolve => { entered = resolve; });
  const canceled = new Promise(resolve => { aborted = resolve; });
  const f = await fixture(t, { synthesize: (_text, signal) => new Promise((_resolve, reject) => {
    entered(); signal.addEventListener('abort', () => { aborted(); reject(new Error()); }, { once: true });
  }) });
  const controller = new AbortController();
  const response = f.send(undefined, {}, controller.signal);
  const rejected = assert.rejects(response, { name: 'AbortError' });
  await started;
  controller.abort();
  await rejected; await canceled;
  assert.equal(f.budget.snapshot().requests, 1);
  assert.equal(f.calls.length, 1);
});

test('adaptador Google fixa pt-BR/Zephyr/MP3 e nunca aceita voz do cliente', async () => {
  let request;
  const provider = googleZephyrProvider({ getAccessToken: async () => 'test-token' }, 'test-project', async (url, options) => {
    request = { url, options }; return new Response(JSON.stringify({ audioContent: audio }));
  });
  assert.equal(await provider('Olá', new AbortController().signal), audio);
  assert.equal(request.url, 'https://texttospeech.googleapis.com/v1/text:synthesize');
  assert.deepEqual(JSON.parse(request.options.body), { input: { text: 'Olá' }, voice: { languageCode: 'pt-BR', name: ZEPHYR_VOICE }, audioConfig: { audioEncoding: 'MP3' } });
});
