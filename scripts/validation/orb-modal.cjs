const { chromium } = require(process.env.FLUI_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const out = path.resolve(process.env.FLUI_EVIDENCE_DIR || '.validation/ux-mapa-01');
const base = process.env.FLUI_BASE_URL || 'http://127.0.0.1:8118';
(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const [width, font, mode, motion] of [
    [320, 'large', 'dark', 'reduce'], [393, 'default', 'light', 'no-preference'],
    [393, 'large', 'dark', 'no-preference'], [768, 'large', 'light', 'reduce'],
  ]) {
    const context = await browser.newContext({ viewport: { width, height: 852 }, reducedMotion: motion });
    await context.addInitScript(({ font, mode, width }) => localStorage.setItem('@flui:userPreferences', JSON.stringify({
      hasSeenOnboarding: true, fontSize: font, appearanceMode: mode, highContrast: width === 320,
    })), { font, mode, width });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      await page.goto(base + '/map');
      const map = page.getByTestId('mapa-area');
      await map.waitFor();
      await page.waitForTimeout(450); // Aguarda a transição existente de entrada da tela.
      const before = await map.boundingBox();
      await page.getByRole('button', { name: 'Abrir assistente Flui IA', exact: true }).click();
      await page.getByRole('textbox', { name: 'Mensagem para a FluIA', exact: true }).waitFor();
      await page.waitForTimeout(motion === 'reduce' ? 80 : 550);
      const box = await page.getByTestId('fluia-tela-cheia').boundingBox();
      assert(box.y < 1 && box.height >= 851);
      const close = page.getByRole('button', { name: 'Fechar assistente', exact: true });
      for (const locator of [close, page.getByRole('textbox', { name: 'Mensagem para a FluIA', exact: true }), page.getByRole('button', { name: 'Enviar mensagem', exact: true })]) {
        const target = await locator.boundingBox();
        assert(target.x >= 0 && target.x + target.width <= width + 1 && target.y >= 0 && target.y + target.height <= 853);
      }
      await page.screenshot({ path: path.join(out, `capturas/fluia-${width}-${font}-${mode}-${motion}.png`) });
      await close.click();
      await page.getByRole('button', { name: 'Abrir assistente Flui IA', exact: true }).waitFor();
      const after = await map.boundingBox();
      for (const key of ["x", "y", "width", "height"]) assert(Math.abs(after[key] - before[key]) < 1);
      assert.deepEqual(errors, []);
      results.push({ width, font, mode, motion, pass: true, box, mapPreserved: true });
    } catch (error) {
      results.push({ width, font, mode, motion, pass: false, error: error.stack, errors });
      process.exitCode = 1;
    }
    await context.close();
    if (process.exitCode) break;
  }
  fs.writeFileSync(path.join(out, 'modal-web.json'), JSON.stringify(results, null, 2));
  console.log(results);
  await browser.close();
})();
