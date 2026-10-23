const { chromium } = require(process.env.FLUI_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const out = path.resolve(process.env.FLUI_EVIDENCE_DIR || '.validation/ux-mapa-01');
const base = process.env.FLUI_BASE_URL || 'http://127.0.0.1:8118';
(async () => {
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const [width, font, mode, highContrast] of [[320, 'large', 'light', true], [375, 'default', 'light', false], [393, 'large', 'dark', false], [481, 'large', 'dark', true], [768, 'default', 'light', false]]) {
      const context = await browser.newContext({ viewport: { width, height: 852 }, reducedMotion: 'reduce' });
      await context.addInitScript(preferences => localStorage.setItem('@flui:userPreferences', JSON.stringify(preferences)), { hasSeenOnboarding: true, fontSize: font, appearanceMode: mode, highContrast });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        await page.goto(base + '/map');
        const toggle = page.getByRole('button', { name: 'Mostrar filtros rápidos', exact: true });
        await toggle.waitFor();
        assert.equal(await toggle.locator('svg').count(), 1);
        await toggle.click();
        assert.equal(await page.getByRole('button', { name: 'Recolher filtros rápidos', exact: true }).locator('svg').count(), 1);
        await page.getByRole('button', { name: 'Recolher filtros rápidos', exact: true }).click();
        const open = () => page.getByRole('button', { name: 'Mostrar pontos de recarga', exact: true }).click();
        await open();
        const popup = page.getByTestId('recomendacoes-popup');
        await popup.waitFor();
        const box = await popup.boundingBox();
        assert(box.x >= 19 && box.x + box.width <= width - 19 && box.y >= 23 && box.y + box.height <= 829);
        const close = page.getByRole('button', { name: 'Fechar recomendações', exact: true });
        const closeBox = await close.boundingBox();
        assert(closeBox.width >= 44 && closeBox.height >= 44 && closeBox.y >= box.y);
        await page.getByText('Pontos de recarga', { exact: true }).click();
        assert(await popup.isVisible(), 'Toque dentro não fecha');
        await page.screenshot({ path: path.join(out, `capturas/popup-${width}-${font}-${mode}.png`) });
        await close.click();
        await popup.waitFor({ state: 'hidden' });
        await open();
        await page.getByTestId('recomendacoes-fundo').click({ position: { x: 2, y: 2 } });
        await popup.waitFor({ state: 'hidden' });
        await open();
        await page.getByRole('button', { name: /^Higienópolis Prime Charge\./ }).click();
        await page.getByRole('button', { name: 'Iniciar rota para Higienópolis Prime Charge', exact: true }).waitFor();
        await page.goBack();
        await page.getByRole('button', { name: 'Mostrar pontos de recarga', exact: true }).waitFor();
        assert.equal(await page.getByTestId('recomendacoes-popup').count(), 0);
        assert.deepEqual(errors, []);
        results.push({ width, font, mode, highContrast, pass: true, box, closeBox, closeViaButton: true, closeViaBackdrop: true, internalTouchPreserved: true, detailsAndReturn: true });
      } catch (error) {
        results.push({ width, font, mode, highContrast, pass: false, error: error.stack, errors });
        await page.screenshot({ path: path.join(out, 'capturas/popup-falha.png') });
        process.exitCode = 1;
      }
      await context.close();
      if (process.exitCode) break;
    }
  } finally {
    fs.writeFileSync(path.join(out, 'popup-web.json'), JSON.stringify(results, null, 2));
    console.log(results);
    await browser.close();
  }
})();
