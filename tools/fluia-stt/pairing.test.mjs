import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createPairingHandler } from './pairing.mjs';

async function fixture(t, options = {}) {
  const token = 'c'.repeat(64);
  const handler = createPairingHandler({ token, approve: async () => true, cooldownMs: 0, ...options });
  const server = http.createServer((req, res) => { if (!handler.handle(req, res)) { res.writeHead(404); res.end(); } });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => { handler.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
  const request = (overrides = {}) => new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: server.address().port, path: '/pair', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': 2 }, ...overrides }, res => {
      let body = ''; res.on('data', c => body += c); res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body), cache: res.headers['cache-control'] }));
    }); req.on('error', reject); req.end('{}');
  });
  return { token, request, close: () => handler.close() };
}

test('pareamento libera credencial somente após aprovação local e sem cache', async t => {
  let release, calls = 0;
  const gate = new Promise(resolve => { release = resolve; });
  const f = await fixture(t, { approve: async ({ address }) => { calls++; assert.equal(address, '127.0.0.1'); return gate; } });
  const first = f.request();
  while (!calls) await new Promise(resolve => setImmediate(resolve));
  assert.equal((await f.request()).status, 409);
  release(true);
  const result = await first;
  assert.deepEqual(result, { status: 200, body: { ready: true, code: f.token }, cache: 'no-store' });
});

test('origem de navegador ou método incorreto não solicita aprovação nem revela credencial', async t => {
  let calls = 0;
  const f = await fixture(t, { approve: async () => { calls++; return true; } });
  for (const options of [{ method: 'GET' }, { headers: { Origin: 'https://example.test', 'Content-Type': 'application/json' } }]) {
    const result = await f.request(options); assert.equal(result.status, 403); assert.notEqual(result.body.code, f.token);
  }
  assert.equal(calls, 0);
});

test('negação e falha da aprovação mantêm a credencial privada', async t => {
  for (const approve of [async () => false, async () => { throw new Error('private-system-error'); }]) {
    const f = await fixture(t, { approve }); const result = await f.request();
    assert.equal(result.status, 403); assert.deepEqual(result.body, { code: 'PAIR_DENIED' });
  }
});

test('aprovação tardia após timeout não entrega código nem mantém solicitação ativa', async t => {
  let release, signal;
  const gate = new Promise(resolve => { release = resolve; });
  const f = await fixture(t, { timeoutMs: 30, approve: async value => { signal = value.signal; return gate; } });
  const result = await f.request();
  assert.equal(result.status, 408); assert.deepEqual(result.body, { code: 'PAIR_TIMEOUT' });
  assert.equal(signal.aborted, true); release(true);
});

test('encerramento do intermediário impede liberar aprovação que chegue depois', async t => {
  let release, started = false;
  const gate = new Promise(resolve => { release = resolve; });
  const f = await fixture(t, { approve: async () => { started = true; return gate; } });
  const request = f.request();
  while (!started) await new Promise(resolve => setImmediate(resolve));
  f.close(); release(true);
  const result = await request;
  assert.equal(result.status, 403); assert.deepEqual(result.body, { code: 'PAIR_DENIED' });
});
