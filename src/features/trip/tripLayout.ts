// Considera tanto a preferência de fonte do Flui quanto a ampliação do sistema.
export function getTripReadingLayout(width: number, appFontScale = 1, systemFontScale = 1) {
  const readingWidth = width / Math.max(1, appFontScale * systemFontScale);
  return { stacked: readingWidth < 430 };
}
