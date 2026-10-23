import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const { prepareOfflineAssets } = createRequire(import.meta.url)("../scripts/prepare-offline-assets.cjs");

test("manifesto da exportação inclui apenas fotos públicas locais de usuário e estações", () => {
  const dir = mkdtempSync(join(tmpdir(), "flui-offline-assets-"));
  try {
    writeFileSync(join(dir, "index.html"), "<html></html>");
    for (const category of ["user", "stations"]) {
      const folder = join(dir, "assets/src/assets", category);
      mkdirSync(folder, { recursive: true });
      writeFileSync(join(folder, category + ".hash.webp"), "imagem");
      writeFileSync(join(folder, "ignorado.txt"), "não é imagem");
    }
    const result = prepareOfflineAssets(dir);
    assert.deepEqual(result.assets, ["/assets/src/assets/user/user.hash.webp", "/assets/src/assets/stations/stations.hash.webp"]);
    assert.deepEqual(JSON.parse(readFileSync(join(dir, "offline-assets.json"), "utf8")), result);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test("não promete preparação offline de uma exportação inexistente", () => {
  assert.throws(() => prepareOfflineAssets(join(tmpdir(), "flui-export-inexistente")), /exportação web concluída/);
});
