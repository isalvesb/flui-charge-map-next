import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createPreviewServer } from "../scripts/preview-web.mjs";

async function preview(t) {
  const directory = await mkdtemp(join(tmpdir(), "flui-preview-test-"));
  await Promise.all([
    writeFile(join(directory, "index.html"), "<html>entrada</html>"),
    writeFile(join(directory, "point-details.html"), "<html>ficha</html>"),
    writeFile(join(directory, "loading.html"), "<html>carregamento</html>"),
    writeFile(join(directory, "404.html"), "<html>não encontrado</html>"),
    writeFile(join(directory, "offline-worker.js"), "// worker"),
  ]);
  const server = createPreviewServer(directory);
  t.after(async () => {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return `http://127.0.0.1:${server.address().port}`;
}

test("prévia serve entrada, loading e ficha com parâmetros diretamente, sem fallback incorreto", async t => {
  const base = await preview(t);
  for (const [path, content] of [["/", "entrada"], ["/loading", "carregamento"], ["/point-details?stationId=vm", "ficha"]]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.match(await response.text(), new RegExp(content));
  }
  const missing = await fetch(`${base}/estacao-inexistente`);
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /não encontrado/);
});

test("prévia entrega worker como JavaScript revalidável e respeita HEAD", async t => {
  const base = await preview(t);
  const response = await fetch(`${base}/offline-worker.js?version=bundle-atual`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /javascript/);
  assert.equal(response.headers.get("cache-control"), "no-cache");
  assert.equal(await response.text(), "// worker");
  const head = await fetch(`${base}/loading`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
});

test("prévia recusa escrita, URL inválida e leitura fora da pasta exportada", async t => {
  const base = await preview(t);
  assert.equal((await fetch(`${base}/`, { method: "POST" })).status, 405);
  assert.equal((await fetch(`${base}/%ZZ`)).status, 404);
  assert.equal((await fetch(`${base}/..%2F..%2Fpackage.json`)).status, 404);
  assert.equal((await fetch(`${base}/package.json`)).status, 404);
});
