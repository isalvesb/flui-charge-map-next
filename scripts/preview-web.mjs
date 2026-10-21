import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".ttf": "font/ttf", ".txt": "text/plain; charset=utf-8", ".lottie": "application/zip" };

// Prévia local da exportação, com rotas HTML sem extensão como no Pages.
// Não é servidor de produção e não simula o estado offline do navegador.
export function createPreviewServer(directory = resolve("dist")) {
  const root = resolve(directory);
  return createServer(async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const target = resolve(root, `.${pathname}`);
      if (target !== root && !target.startsWith(`${root}/`)) {
        res.writeHead(404).end();
        return;
      }
      const candidates = pathname.endsWith("/") ? [resolve(target, "index.html")] : [target, `${target}.html`];
      let file;
      for (const candidate of candidates) {
        if (await stat(candidate).then(s => s.isFile()).catch(() => false)) {
          file = candidate;
          break;
        }
      }
      const status = file ? 200 : 404;
      file ??= resolve(root, "404.html");
      const content = await readFile(file);
      res.writeHead(status, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow" });
      res.end(req.method === "HEAD" ? undefined : content);
    } catch {
      res.writeHead(404).end("Exportação ou recurso não encontrado. Execute npm run build:web.");
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 8790);
  const server = createPreviewServer();
  server.listen(port, "127.0.0.1", () => console.log(`Prévia local: http://127.0.0.1:${port} (Ctrl+C encerra).`));
}
