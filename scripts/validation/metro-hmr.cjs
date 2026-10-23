/* global __dirname */
const { Buffer } = require('node:buffer');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const WS = require('../../node_modules/ws');
const out = path.resolve(process.env.FLUI_EVIDENCE_DIR || '.validation/consolidacao');
const base = 'http://127.0.0.1:8130';
function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers, timeout: 45000 }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('HTTP timeout')));
  });
}
(async () => {
  // HMR exercises only an ignored diagnostic entry, never an app component.
  const probe = path.resolve(__dirname, '../../consolidacao-validation-local/hmr-probe.js');
  fs.writeFileSync(probe, "module.exports = 'consolidado-inicial';\n");
  const probeUrl = `${base}/consolidacao-validation-local/hmr-probe.bundle?platform=ios&dev=true&hot=true&lazy=false&minify=false`;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const initial = await get(probeUrl);
  assert.equal(initial.status, 200, initial.body.toString().slice(0, 400));
  const socket = new WS('ws://127.0.0.1:8130/hot');
  const messages = [];
  let initialDone = false;
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { socket.close(); reject(new Error('HMR timeout')); }, 20000);
    socket.on('error', (error) => { clearTimeout(timer); reject(error); });
    socket.on('message', (raw) => {
      const message = JSON.parse(raw.toString());
      messages.push(message);
      if (message.type === 'error') { clearTimeout(timer); socket.close(); reject(new Error(JSON.stringify(message))); }
      if (message.type === 'update-done' && !initialDone) {
        initialDone = true;
        fs.writeFileSync(probe, "module.exports = 'consolidado-depois';\n");
      }
      if (message.type === 'update' && !message.body.isInitialUpdate && JSON.stringify(message.body).includes('consolidado-depois')) {
        clearTimeout(timer); resolve();
      }
    });
    socket.on('open', () => socket.send(JSON.stringify({ type: 'register-entrypoints', entryPoints: [probeUrl] })));
  });
  const close = once(socket, 'close');
  socket.close(1000, 'p1-hmr-ok');
  await close;
  fs.writeFileSync(path.join(out, 'metro-hmr-mensagens.json'), JSON.stringify(messages, null, 2));
  fs.writeFileSync(path.join(out, 'metro-hmr.json'), JSON.stringify({ connected: true, registered: true,
    updateDelivered: true, fixtureOnly: true, applicationFilesModified: false,
    visualFastRefreshTested: false, messageTypes: messages.map((x) => x.type) }, null, 2));
  console.log('HMR: registro e atualização do módulo diagnóstico entregues via WebSocket.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
