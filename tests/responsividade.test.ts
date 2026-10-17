import assert from "node:assert/strict";
import test from "node:test";
import { getMapPanelLayout } from "../src/features/map/mapLayout";
import { appThemes } from "../src/theme/appTheme";

test("painel deixa espaço para controles em tela compacta e respeita a área do mapa", () => {
  const layout = getMapPanelLayout(320, 568, 374);
  assert.equal(layout.horizontal, false);
  assert.equal(layout.compactControls, true);
  assert.equal(layout.panelMaxHeight, 294);
  assert.equal(layout.panelWidth, undefined);
  assert.equal(getMapPanelLayout(440, 956, 700, 2).compactControls, true);
  assert.equal(getMapPanelLayout(440, 956, 700, 1, 600).compactControls, true);
});

test("painel horizontal e panorâmico preserva espaço lateral e limita a largura de leitura", () => {
  for (const width of [700, 844, 1920]) {
    const layout = getMapPanelLayout(width, 390, 200);
    assert.equal(layout.horizontal, true);
    assert.ok(layout.panelWidth! <= 400);
    assert.ok(layout.panelWidth! < width / 2);
    assert.ok(layout.panelMaxHeight <= 200);
  }
  assert.equal(getMapPanelLayout(699, 390, 200).horizontal, false);
  assert.equal(getMapPanelLayout(768, 1024, 800).horizontal, false);
});

function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g)!.map((value) => parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("textos essenciais e indicadores têm contraste mínimo de 4,5:1 nos dois temas", () => {
  for (const [name, theme] of Object.entries(appThemes)) {
    for (const foreground of [theme.text, theme.textMuted, theme.textLight, theme.success, theme.warningText, theme.dangerText]) {
      for (const background of [theme.background, theme.surface]) {
        assert.ok(contrast(foreground, background) >= 4.5, `${name}: ${foreground}/${background}`);
      }
    }
    for (const [foreground, background] of [[theme.success, theme.successSoft], [theme.warningText, theme.yellow], [theme.dangerText, theme.dangerSoft]]) {
      assert.ok(contrast(foreground, background) >= 4.5, `${name} indicador: ${foreground}/${background}`);
    }
    assert.ok(contrast(theme.onPrimary, theme.primary) >= 4.5);
  }
});
