import { createServer } from 'node:https';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleAuth } from 'google-auth-library';
import { createSttHandler, SttError } from './handler.mjs';
import { serverSettings } from './settings.mjs';

process.umask(0o077);
const { project, host, port } = serverSettings(process.env);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../.validation/stt');
await mkdir(root, { recursive: true, mode: 0o700 });
const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
// Check ADC before accepting audio. No access token or credential is written to logs.
try { await auth.getAccessToken(); }
catch { throw new Error('ADC indisponível. Autentique sua conta local antes de iniciar o intermediário.'); }
const token = randomBytes(32).toString('hex');
const usageFile = resolve(root, `consumo-${Date.now()}.json`);
const recordUsage = (usage) => writeFile(usageFile, JSON.stringify({ ...usage }, null, 2), { mode: 0o600 });
await recordUsage({ requests: 0, reservedSeconds: 0 });
const recognize = async (audio, signal) => {
  const accessToken = await auth.getAccessToken();
  signal.throwIfAborted();
  const response = await fetch(`https://speech.googleapis.com/v2/projects/${project}/locations/global/recognizers/_:recognize`, {
    method: 'POST', signal,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'x-goog-user-project': project },
    body: JSON.stringify({
      config: { autoDecodingConfig: {}, languageCodes: ['pt-BR'], model: 'short', features: { enableAutomaticPunctuation: true } },
      content: audio.toString('base64'),
    }),
  });
  if (!response.ok) {
    // Do not log upstream bodies: they can contain sensitive request information.
    await response.body?.cancel();
    throw new SttError(response.status === 401 || response.status === 403 ? 'CLOUD_AUTH' : 'UPSTREAM_UNAVAILABLE', 502);
  }
  const result = await response.json();
  return { text: result.results?.map((part) => part.alternatives?.[0]?.transcript ?? '').join(' ') ?? '' };
};
const server = createServer({
  cert: await readFile(process.env.STT_TLS_CERT), key: await readFile(process.env.STT_TLS_KEY), minVersion: 'TLSv1.2',
}, createSttHandler({ token, recognize, recordUsage }));
server.requestTimeout = 30_000;
server.headersTimeout = 10_000;
server.on('clientError', (_error, socket) => socket.destroy());
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(port, host, resolve);
});
try {
  // Do not overwrite a capability from another running session.
  await writeFile(resolve(root, 'session-code'), token, { mode: 0o600, flag: 'wx' });
} catch {
  server.close();
  throw new Error('Já existe um código de sessão local. Confira se outro intermediário está ativo.');
}
console.info(`FluIA STT local em HTTPS na porta ${port}. Código de sessão em .validation/stt/session-code. Limite: 20 chamadas / 600 s nesta execução.`);
async function shutdown() {
  await rm(resolve(root, 'session-code'), { force: true });
  server.close();
  server.closeAllConnections();
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
