// 130 pt de largura de leitura por cartão. Fontes do sistema ainda podem exigir coluna única.
export function shouldStackStationCards(contentWidth: number, appFontScale = 1, systemFontScale = 1) {
  return contentWidth / Math.max(1, appFontScale * systemFontScale) < 260;
}
