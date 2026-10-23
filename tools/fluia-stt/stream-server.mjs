import { createServer } from 'node:https';
import { readFile, writeFile, mkdir, rename, rm, stat } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 } from '@google-cloud/speech';
import { serverSettings } from './settings.mjs';
import { attachStreamGateway, createStreamingBudget, isAuthorized, streamingBudgetLimits } from './stream-gateway.mjs';
import { googleStreamProvider } from './google-stream.mjs';

process.umask(0o077);
// Keep SDK diagnostic request logging off: it can contain audio.
delete process.env.GOOGLE_SDK_NODE_LOGGING;
delete process.env.GRPC_TRACE;
const { project, host, port } = serverSettings(process.env);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../.validation/stt');
await mkdir(root, { recursive: true, mode: 0o700 });
const client = new v2.SpeechClient({ projectId: project, keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
await client.auth.getAccessToken();
await client.initialize();
const token = randomBytes(32).toString('hex');
let usageFile = resolve(root, `consumo-${Date.now()}.json`), initial;
if (process.env.STT_USAGE_FILE) {
  const previous = resolve(process.env.STT_USAGE_FILE);
  if (dirname(previous) !== root || !/^consumo-\d+\.json$/.test(basename(previous)) || ((await stat(previous)).mode & 0o777) !== 0o600) throw new Error('Registro de consumo anterior inválido.');
  usageFile = previous;
  initial = JSON.parse(await readFile(previous, 'utf8'));
}
const recordUsage = async usage => {
  await writeFile(usageFile + '.tmp', JSON.stringify(usage, null, 2), { mode: 0o600 });
  await rename(usageFile + '.tmp', usageFile);
};
const limits = streamingBudgetLimits(process.env, initial);
const budget = createStreamingBudget({ initial, recordUsage, limits });
const metrics = {};
await recordUsage(budget.snapshot());
const server = createServer({ cert: await readFile(process.env.STT_TLS_CERT), key: await readFile(process.env.STT_TLS_KEY), minVersion: 'TLSv1.2' }, (req, res) => {
  const allowed = isAuthorized(req.headers, token) && !req.headers.origin;
  res.writeHead(allowed && req.method === 'GET' && req.url === '/health' ? 200 : 401, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(allowed ? { ready: true, streaming: true, ...budget.snapshot(), limits, metrics } : { code: 'UNAUTHORIZED' }));
});
const gateway = attachStreamGateway(server, { token, budget, openRecognition: googleStreamProvider(client, project, metrics) });
server.headersTimeout = 10_000;
server.on('clientError', (_error, socket) => socket.destroy());
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, host, resolve); });
try { await writeFile(resolve(root, 'session-code'), token, { mode: 0o600, flag: 'wx' }); }
catch { gateway.close(); server.close(); await client.close(); throw new Error('Confira a sessão existente antes de iniciar outra.'); }
console.info(`FluIA STT streaming privado na porta ${port}. Máximo: ${limits.requests} chamadas/${limits.reservedSeconds} s reservados, 30 s por escuta, sem repetição.`);
async function shutdown() {
  gateway.close(); server.close(); server.closeAllConnections();
  await client.close(); await rm(resolve(root, 'session-code'), { force: true });
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
