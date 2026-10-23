import { mkdir, writeFile, chmod } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { isIP } from 'node:net';

const ip = process.argv[2];
const privateIp = /^(10\.|192\.168\.|127\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip ?? '');
if (!ip || isIP(ip) !== 4 || !privateIp) throw new Error('Informe o IPv4 privado do Mac na rede de teste.');
process.umask(0o077);
const output = resolve(dirname(fileURLToPath(import.meta.url)), '../../.validation/stt/tls');
await mkdir(dirname(output), { recursive: true, mode: 0o700 });
await mkdir(output, { recursive: false, mode: 0o700 });
function openssl(args) {
  const result = spawnSync('openssl', args, { cwd: output, stdio: 'ignore' });
  if (result.status !== 0) throw new Error('Falha ao criar certificados locais com OpenSSL.');
}
await writeFile(resolve(output, 'root.conf'), '[req]\ndistinguished_name=dn\nx509_extensions=ca\nprompt=no\n[dn]\nCN=FluIA Experimento Local\n[ca]\nbasicConstraints=critical,CA:TRUE\nkeyUsage=critical,keyCertSign,cRLSign\n');
await writeFile(resolve(output, 'server.ext'), `basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=serverAuth\nsubjectAltName=IP:${ip},IP:127.0.0.1,DNS:localhost\n`);
openssl(['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', 'root.key', '-out', 'root.crt', '-days', '30', '-sha256', '-config', 'root.conf']);
openssl(['req', '-new', '-newkey', 'rsa:2048', '-nodes', '-keyout', 'server.key', '-out', 'server.csr', '-subj', '/CN=FluIA Local']);
openssl(['x509', '-req', '-in', 'server.csr', '-CA', 'root.crt', '-CAkey', 'root.key', '-CAcreateserial', '-out', 'server.crt', '-days', '30', '-sha256', '-extfile', 'server.ext']);
await chmod(resolve(output, 'server.key'), 0o600);
console.info('Certificados criados em .validation/stt/tls. Nenhum certificado foi instalado e nenhum endpoint foi iniciado. No iPhone, transfira somente root.crt, nunca os arquivos .key.');
