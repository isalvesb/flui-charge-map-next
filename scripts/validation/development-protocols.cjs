/* global __dirname */
const { Buffer } = require('node:buffer');
const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const http = require('node:http');
const zlib = require('node:zlib');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

for (const [label, location] of [
  ['ws6 middleware', 'node_modules/@react-native/dev-middleware/node_modules/ws'],
  ['ws6 React Native', 'node_modules/react-native/node_modules/ws'],
  ['ws7 Metro', 'node_modules/ws'],
  ['ws8 CLI preservado', 'node_modules/expo/node_modules/ws'],
]) {
  test(`${label}: echo, ping/pong e fechamento normal`, { timeout: 5000 }, async (t) => {
    const WS = require(path.join(root, location));
    const server = new WS.Server({ host: '127.0.0.1', port: 0 });
    t.after(() => { for (const client of server.clients) client.terminate(); server.close(); });
    server.on('connection', (socket) => socket.on('message', (message) => socket.send(message)));
    await once(server, 'listening');
    const client = new WS(`ws://127.0.0.1:${server.address().port}`);
    t.after(() => client.terminate());
    await once(client, 'open');
    const received = once(client, 'message');
    client.send('Flui P1 · mensagem normal');
    assert.equal((await received)[0].toString(), 'Flui P1 · mensagem normal');
    const pong = once(client, 'pong');
    client.ping('p1-ping');
    assert.equal((await pong)[0].toString(), 'p1-ping');
    const closed = once(client, 'close');
    client.close(1000, 'p1-ok');
    const [code, reason] = await closed;
    assert.equal(code, 1000);
    assert.equal(reason.toString(), 'p1-ok');
  });
}

test('compression: resposta gzip íntegra e resposta identity', { timeout: 5000 }, async (t) => {
  const compression = require(path.join(root, 'node_modules/compression'));
  const middleware = compression();
  const payload = 'Flui P1: resposta normal. '.repeat(400);
  const server = http.createServer((req, res) => middleware(req, res, () => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(payload);
  }));
  server.listen(0, '127.0.0.1');
  t.after(() => server.close());
  await once(server, 'listening');
  const read = (encoding) => new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port: server.address().port,
      headers: { 'Accept-Encoding': encoding } }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
  const gzip = await read('gzip');
  assert.equal(gzip.status, 200);
  assert.equal(gzip.headers['content-encoding'], 'gzip');
  assert.equal(zlib.gunzipSync(gzip.body).toString(), payload);
  const identity = await read('identity');
  assert.equal(identity.headers['content-encoding'], undefined);
  assert.equal(identity.body.toString(), payload);
});
