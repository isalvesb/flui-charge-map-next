const { chromium } = require(process.env.FLUI_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const out = path.resolve(process.env.FLUI_EVIDENCE_DIR || '.validation/consolidacao');
const fixture = path.resolve('app/consolidacao-fast-refresh.tsx');
// Rota temporária de diagnóstico: nunca exportar ou incluir no produto.
const original = fs.readFileSync(fixture, 'utf8');
assert.match(original, /function ConsolidacaoFastRefresh/);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const started = Date.now();
  try {
    fs.writeFileSync(fixture, original.replace('Consolidacao refresh B', 'Consolidacao refresh A'));
    await page.goto('http://127.0.0.1:8130/consolidacao-fast-refresh', { timeout: 120000 });
    await page.getByText('Consolidacao refresh A', { exact: true }).waitFor({ timeout: 90000 });
    const increment = page.getByRole('button', { name: 'Incrementar diagnostico', exact: true });
    await increment.click();
    await increment.click();
    await page.getByText('Contador 2', { exact: true }).waitFor();
    await page.screenshot({ path: path.join(out, 'capturas/refresh-web-antes.png') });

    fs.writeFileSync(fixture, original.replace('Consolidacao refresh A', 'Consolidacao refresh B'));
    await page.getByText('Consolidacao refresh B', { exact: true }).waitFor({ timeout: 45000 });
    await page.getByText('Contador 2', { exact: true }).waitFor();
    assert.equal(await page.getByText('Contador 0', { exact: true }).count(), 0);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: path.join(out, 'capturas/refresh-web-depois.png') });
    fs.writeFileSync(path.join(out, 'fast-refresh-visual.json'), JSON.stringify({
      pass: true, client: 'Chromium no Metro web de desenvolvimento',
      moduleChanged: 'A → B', statePreserved: 'Contador 2', errors,
      nativeFastRefreshProven: false, seconds: (Date.now() - started) / 1000,
    }, null, 2));
    console.log('PASS Fast Refresh visual: módulo atualizado e contador 2 preservado.');
  } catch (error) {
    await page.screenshot({ path: path.join(out, 'capturas/refresh-web-falha.png') }).catch(() => {});
    fs.writeFileSync(path.join(out, 'fast-refresh-visual.json'), JSON.stringify({ pass: false, errors, error: error.stack }, null, 2));
    console.error(error);
    process.exitCode = 1;
  } finally {
    await browser.close();
    fs.writeFileSync(fixture, original);
  }
})();
