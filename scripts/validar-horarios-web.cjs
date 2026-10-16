// Instrumentação de teste local: não é importada pelo aplicativo.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(process.argv[2] || '/tmp/flui-validacao-web');
const port = Number(process.argv[3] || 8768);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Porta inválida');
const clockScript = `(() => {
  const RealDate = Date;
  let delta = 0;
  let controlled = false;
  class ClockDate extends RealDate {
    constructor(...args) { super(...(args.length ? args : [RealDate.now() + delta])); }
    static now() { return RealDate.now() + delta; }
  }
  Date = ClockDate;
  const panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;background:#fff2b2;padding:4px;font:12px sans-serif;color:#111';
  const label = document.createElement('span');
  const before = document.createElement('button');
  const near = document.createElement('button');
  before.textContent = 'Teste: simular 19h58';
  near.textContent = 'Teste: aproximar fechamento';
  before.onclick = () => { controlled = true; delta = RealDate.parse('2026-10-16T22:58:00Z') - RealDate.now(); update(); };
  near.onclick = () => { controlled = true; delta = RealDate.parse('2026-10-16T22:59:50Z') - RealDate.now(); update(); };
  function update() { label.textContent = (controlled ? 'Relógio de teste: ' : 'Relógio real: ') + new Date().toLocaleTimeString('pt-BR', {timeZone:'America/Sao_Paulo'}) + ' '; }
  panel.append(label, before, near);
  document.body.append(panel);
  update(); setInterval(update, 1000);
})();`;
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/__relogio.js') {
      res.setHeader('Content-Type', 'application/javascript');
      res.end(clockScript); return;
    }
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + '/')) { res.writeHead(403); res.end(); return; }
    if (!path.extname(file)) file += '.html';
    let data = await fs.readFile(file);
    if (file.endsWith('.html') && url.searchParams.has('clock')) {
      data = data.toString().replace('</body>', '<script src="/__relogio.js"></script></body>');
    }
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.js':'application/javascript','.png':'image/png','.webp':'image/webp','.css':'text/css'})[path.extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch { res.writeHead(404); res.end(); }
});
server.listen(port, '127.0.0.1', () => console.log(`Validação local em http://127.0.0.1:${port}/map?clock=1`));
