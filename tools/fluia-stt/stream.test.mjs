import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { once, EventEmitter } from 'node:events';
import { WebSocket } from 'ws';
import { attachStreamGateway, createStreamingBudget } from './stream-gateway.mjs';
import { googleStreamProvider } from './google-stream.mjs';

const token = 'test-session-capability-'.repeat(3);
const tick = () => new Promise(resolve => setImmediate(resolve));
async function fixture(t, options = {}) {
  const server = createServer();
  const recorded = [], calls = [];
  const budget = createStreamingBudget({ recordUsage: async value => { recorded.push(value); } });
  const gateway = attachStreamGateway(server, { token, budget, openRecognition: async callbacks => {
    const call = { callbacks, writes: 0, finishes: 0, canceled: 0, events: new EventEmitter() };
    calls.push(call);
    return { write: () => { call.writes++; call.events.emit('write'); return true; }, finish: () => { call.finishes++; call.events.emit('finish'); }, cancel: async () => { call.canceled++; } };
  }, ...options });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const sockets = [];
  t.after(async () => { for (const socket of sockets) socket.terminate(); gateway.close(); await new Promise(resolve => server.close(resolve)); });
  const open = async (code = token) => {
    const ws = new WebSocket(`ws://127.0.0.1:${server.address().port}/stream`, { headers: { Authorization: `Bearer ${code}` } });
    sockets.push(ws); const messages = [];
    ws.on('message', data => messages.push(JSON.parse(data.toString())));
    await once(ws, 'open');
    return { ws, messages, send: value => ws.send(JSON.stringify(value)), next: () => once(ws, 'message').then(([data]) => JSON.parse(data.toString())) };
  };
  return { open, recorded, calls, budget };
}

test('stream real de protocolo usa uma reserva, entrega parcial e só conclui com final', async t => {
  const f = await fixture(t); const c = await f.open();
  c.send({ type: 'start', id: 'test-stream-123' }); assert.equal((await c.next()).type, 'ready');
  assert.deepEqual(f.recorded, [{ requests: 1, reservedSeconds: 30 }]);
  const written = once(f.calls[0].events, 'write');
  c.send({ type: 'audio', sequence: 0, content: Buffer.alloc(3200, 1).toString('base64') });
  await written; assert.equal(f.calls[0].writes, 1);
  f.calls[0].callbacks.partial('Quero carregar'); assert.equal((await c.next()).type, 'transcript');
  const finished = once(f.calls[0].events, 'finish');
  c.send({ type: 'finish' }); await finished;
  assert.equal(f.calls[0].finishes, 1);
  f.calls[0].callbacks.completed('Quero carregar rápido');
  assert.equal((await c.next()).type, 'done');
});

test('simultaneidade e áudio fora de ordem são recusados sem segunda chamada', async t => {
  const f = await fixture(t); const a = await f.open(), b = await f.open();
  a.send({ type: 'start', id: 'first-stream-123' }); await a.next();
  b.send({ type: 'start', id: 'second-stream-123' }); assert.equal((await b.next()).code, 'BUSY');
  a.send({ type: 'audio', sequence: 3, content: Buffer.alloc(3200).toString('base64') });
  assert.equal((await a.next()).code, 'INVALID_AUDIO');
  assert.equal(f.calls.length, 1); assert.equal(f.calls[0].writes, 0);
});

test('código errado nunca abre Google nem reserva consumo', async t => {
  const f = await fixture(t);
  await assert.rejects(f.open('wrong'), /401/);
  assert.equal(f.calls.length, 0);
  assert.deepEqual(f.recorded, []);
});

test('cancelar aguarda liberação do provedor antes de aceitar outra chamada', async t => {
  let allowCancel;
  const canceled = new Promise(resolve => { allowCancel = resolve; });
  const f = await fixture(t, { openRecognition: async () => ({ write: () => true, finish: () => {}, cancel: () => canceled }) });
  const a = await f.open();
  a.send({ type: 'start', id: 'cancel-stream-123' }); await a.next();
  a.send({ type: 'cancel' }); await once(a.ws, 'close'); await tick();
  await assert.rejects(f.budget.reserve(), /BUSY/);
  allowCancel(); await tick();
  const release = await f.budget.reserve(); release();
});

test('limites e falha de registro bloqueiam Google antes de abrir stream', async () => {
  for (const initial of [{ requests: 20, reservedSeconds: 0 }, { requests: 0, reservedSeconds: 580 }]) {
    const budget = createStreamingBudget({ initial, recordUsage: async () => {} });
    await assert.rejects(budget.reserve(), /SESSION_LIMIT/);
  }
  const broken = createStreamingBudget({ recordUsage: async () => { throw new Error('disk'); } });
  await assert.rejects(broken.reserve(), /USAGE_UNAVAILABLE/);
  const used = [];
  const budget = createStreamingBudget({ recordUsage: async usage => used.push(usage) });
  const release = await budget.reserve(); release();
  assert.deepEqual(budget.snapshot(), { requests: 1, reservedSeconds: 30 });
});

test('provedor Google configura resultados parciais/pausa 1 s e não repete chamada', async () => {
  const call = new EventEmitter(); const writes = [];
  call.write = value => { writes.push(value); return true; };
  call.end = () => call.emit('end');
  call.cancel = () => call.emit('error', { code: 1 });
  let options, initialized = 0;
  const client = { initialize: async () => { initialized++; }, _streamingRecognize: value => { options = value; return call; } };
  const partials = [], finals = [], failures = [];
  const provider = googleStreamProvider(client, 'test-project');
  const stream = await provider({ signal: new AbortController().signal, partial: value => partials.push(value), completed: value => finals.push(value), failed: value => failures.push(value) });
  assert.equal(options.retry, null);
  assert.equal(writes[0].streamingConfig.streamingFeatures.voiceActivityTimeout.speechEndTimeout.seconds, 1);
  assert.equal(writes[0].streamingConfig.streamingFeatures.interimResults, true);
  call.emit('data', { results: [{ alternatives: [{ transcript: 'Quero' }], isFinal: false }] });
  assert.deepEqual(finals, []);
  call.emit('data', { results: [{ alternatives: [{ transcript: 'Quero café' }], isFinal: true }] });
  stream.finish(); assert.deepEqual(finals, ['Quero café']); assert.equal(initialized, 1); assert.deepEqual(failures, []);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(provider({ signal: controller.signal }));
  assert.equal(initialized, 2); // Init is local; aborted path never opens another RPC.
});

test('evento de fim da voz conclui após 1 s e voz retomada cancela esse prazo', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const call = new EventEmitter(); let finished = 0;
  call.write = () => true; call.end = () => { finished++; }; call.cancel = () => call.emit('error', { code: 1 });
  const provider = googleStreamProvider({ initialize: async () => {}, _streamingRecognize: () => call }, 'test-project');
  const stream = await provider({ signal: new AbortController().signal, partial: () => {}, completed: () => {}, failed: () => {} });
  call.emit('data', { speechEventType: 3 }); t.mock.timers.tick(999); assert.equal(finished, 0);
  call.emit('data', { speechEventType: 2 }); t.mock.timers.tick(1000); assert.equal(finished, 0);
  call.emit('data', { speechEventType: 3 }); t.mock.timers.tick(1000); assert.equal(finished, 1);
  await stream.cancel();
});
