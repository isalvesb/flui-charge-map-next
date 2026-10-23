import assert from 'node:assert/strict';
import test from 'node:test';
import { serverSettings } from './settings.mjs';

const env = { GOOGLE_CLOUD_PROJECT: 'project-test', GOOGLE_APPLICATION_CREDENTIALS: '/private/adc.json', STT_TLS_CERT: '/private/server.crt', STT_TLS_KEY: '/private/server.key' };
test('intermediário exige credenciais Mac, TLS e endereço privado explícito', () => {
  assert.equal(serverSettings(env).host, '127.0.0.1');
  for (const host of ['192.168.0.130', '10.0.1.2', '172.16.0.1', '172.31.255.2']) assert.equal(serverSettings({ ...env, STT_HOST: host }).host, host);
  for (const host of ['0.0.0.0', '8.8.8.8', '172.32.0.1', '::', 'public.example']) assert.throws(() => serverSettings({ ...env, STT_HOST: host }));
  for (const port of ['NaN', '443', '90000', '1234.5']) assert.throws(() => serverSettings({ ...env, STT_PORT: port }));
  for (const key of Object.keys(env)) assert.throws(() => serverSettings({ ...env, [key]: '' }));
});
