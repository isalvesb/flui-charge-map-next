const { Buffer } = require('node:buffer');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const zlib = require('node:zlib');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const out = path.resolve(process.env.FLUI_EVIDENCE_DIR || '.validation/consolidacao');
const base = 'http://127.0.0.1:8130';
function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { headers, timeout: 120000 }, (res) => {
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
  const status = await get(`${base}/status`);
  assert.equal(status.body.toString(), 'packager-status:running');
  const manifest = await get(`${base}/`, { accept: 'application/expo+json', 'expo-platform': 'ios' });
  assert.equal(manifest.status, 200);
  const data = JSON.parse(manifest.body);
  assert.equal(data.extra.expoClient.sdkVersion, '54.0.0');
  assert.ok(data.extra.expoClient._internal.projectRoot.endsWith('/flui-consolidado-next'));
  fs.writeFileSync(path.join(out, 'manifesto-ios.json'), manifest.body);
  const bundleUrl = data.launchAsset.url.replace('lazy=true', 'lazy=false');
  const plain = await get(bundleUrl, { 'accept-encoding': 'identity' });
  assert.equal(plain.status, 200);
  const gzip = await get(bundleUrl, { 'accept-encoding': 'gzip' });
  assert.equal(gzip.status, 200);
  assert.equal(gzip.headers['content-encoding'], 'gzip');
  assert.deepEqual(zlib.gunzipSync(gzip.body), plain.body);
  const result = { status: true, sdk: data.extra.expoClient.sdkVersion,
    projectRoot: data.extra.expoClient._internal.projectRoot,
    bundle: { status: plain.status, bytes: plain.body.length, gzipBytes: gzip.body.length,
      contentEncoding: gzip.headers['content-encoding'], decodedIdentical: true,
      sha256: createHash('sha256').update(plain.body).digest('hex') } };
  fs.writeFileSync(path.join(out, 'metro-http.json'), JSON.stringify(result, null, 2));

  console.log('Metro: status, SDK54, raiz, bundle e gzip íntegro aprovados.');
})().catch((error) => { console.error(error); process.exitCode = 1; });
