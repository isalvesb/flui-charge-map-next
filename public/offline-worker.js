/* global self, caches */
// Apenas arquivos públicos do app; preferências e avaliações continuam no AsyncStorage.
const VERSION = new URL(self.location.href).searchParams.get("version") || "v1";
const CACHE = `flui-offline-${VERSION}`;
const PAGES = ["/", "/map", "/search", "/point-details", "/settings", "/profile", "/review", "/trip-planner", "/onboarding"];
const ASSETS = new Set(["script", "style", "image", "font"]);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const assets = new Set();
    await Promise.all(PAGES.map(async (path) => {
      const response = await fetch(path, { cache: "reload" });
      if (!response.ok) throw new Error("Não foi possível preparar a consulta offline.");
      const html = await response.clone().text();
      await cache.put(path, response);
      for (const match of html.matchAll(/<(?:script|link|img)\b[^>]*(?:src|href)=["']([^"']+)["']/gi)) {
        const url = new URL(match[1], self.location.origin);
        if (url.origin === self.location.origin) assets.add(url.href);
      }
    }));
    await cache.addAll([...assets]);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("flui-offline-") && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  const navigation = request.mode === "navigate";
  if (!navigation && !ASSETS.has(request.destination)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (!navigation) {
      const stored = await cache.match(request);
      if (stored) return stored;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch(request, { signal: controller.signal });
      if (navigation && !response.ok) throw new Error("Página indisponível na rede.");
      if (response.ok && response.type !== "opaque") {
        // Falha/quota de cache não pode transformar uma resposta online em erro.
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch {
      const stored = await cache.match(request) || (navigation && await cache.match(url.pathname));
      if (stored) return stored;
      return new Response("Abra o Flui uma vez com conexão para preparar a consulta offline.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    } finally {
      clearTimeout(timer);
    }
  })());
});
