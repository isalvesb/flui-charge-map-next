import { execFileSync } from "node:child_process";
import { copyFile, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const directory = resolve("dist");
const routes = ["index", "map", "search", "point-details", "settings", "profile", "review", "trip-planner", "onboarding", "loading", "+not-found", "_sitemap"];
const entries = new Set();

// Falhar antes da publicação se faltarem rotas, bundle ou assets locais.
for (const route of routes) {
  const html = await readFile(resolve(directory, `${route}.html`), "utf8");
  if (!html.includes('lang="pt-BR"') || !html.includes("Demonstração NEXT 2026")) {
    throw new Error(`Documento web incompleto: ${route}`);
  }
  for (const match of html.matchAll(/<(?:script|link|img)\b[^>]*(?:src|href)=["']([^"']+)["']/gi)) {
    const asset = new URL(match[1], "https://flui.invalid");
    if (asset.origin !== "https://flui.invalid") continue;
    const path = resolve(directory, `.${decodeURIComponent(asset.pathname)}`);
    if (!path.startsWith(`${directory}/`)) throw new Error("Asset fora da exportação");
    if (!(await stat(path)).isFile()) throw new Error(`Asset ausente: ${asset.pathname}`);
    if (asset.pathname.includes("/_expo/static/js/web/entry-")) entries.add(asset.pathname);
  }
}
if (entries.size !== 1) throw new Error("As rotas precisam carregar o mesmo bundle de produção");
await readFile(resolve(directory, "offline-worker.js"));
await readFile(resolve(directory, "_headers"));
await readFile(resolve(directory, "robots.txt"));
await copyFile(resolve(directory, "+not-found.html"), resolve(directory, "404.html"));

const files = await readdir(directory, { recursive: true, withFileTypes: true });
let count = 0;
for (const file of files) {
  if (!file.isFile()) continue;
  const path = resolve(file.parentPath, file.name);
  if (path === resolve(directory, "build-info.json")) continue;
  count++;
  if (file.name.endsWith(".map") || /^\.env(?:\.|$)/.test(file.name)) {
    throw new Error(`Arquivo inadequado à publicação: ${file.name}`);
  }
  if ((await stat(path)).size > 25 * 1024 * 1024) throw new Error(`Asset excede 25 MiB: ${file.name}`);
}
// Upload manual pelo painel do Pages: no máximo 1.000 arquivos.
if (count + 1 > 1000) throw new Error("Exportação excede o limite de upload manual");
const commit = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const dirty = Boolean(execFileSync("git", ["status", "--porcelain", "--untracked-files=normal"], { encoding: "utf8" }).trim());
const info = { commit, dirty, bundle: [...entries][0], builtAt: new Date().toISOString() };
await writeFile(resolve(directory, "build-info.json"), `${JSON.stringify(info, null, 2)}\n`);
console.log(`Web preparada: ${routes.length} rotas, ${count + 1} arquivos. Commit ${commit}${dirty ? " (alterações locais)" : ""}.`);
console.log("Saída: dist/. Nenhum upload ou deploy foi executado.");
