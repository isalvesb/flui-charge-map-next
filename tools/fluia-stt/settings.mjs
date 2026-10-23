import { isIP } from 'node:net';

export function isPrivateIPv4(host) {
  return isIP(host ?? '') === 4 && /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
}

export function serverSettings(env) {
  if (!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(env.GOOGLE_CLOUD_PROJECT ?? '')) throw new Error('Configure o projeto Google no Mac.');
  if (!env.GOOGLE_APPLICATION_CREDENTIALS || !env.STT_TLS_CERT || !env.STT_TLS_KEY) throw new Error('Configure ADC e certificado HTTPS locais.');
  const host = env.STT_HOST ?? '127.0.0.1';
  const port = Number(env.STT_PORT ?? 8787);
  if (!isPrivateIPv4(host)) throw new Error('Use somente o IPv4 privado do Mac ou loopback.');
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Porta local inválida.');
  return { project: env.GOOGLE_CLOUD_PROJECT, host, port };
}
