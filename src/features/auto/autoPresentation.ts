// Proporções editoriais para comparar layouts; não são medidas de veículos.
export const AUTO_FORMATS = [
  { id: "horizontal", label: "Horizontal", ratio: 16 / 9, proportion: "16:9" },
  { id: "vertical", label: "Vertical", ratio: 3 / 4, proportion: "3:4" },
  { id: "panoramic", label: "Panorâmica", ratio: 24 / 9, proportion: "24:9" },
] as const;

export function getAutoFrameSize(availableWidth: number, ratio: number) {
  const width = Math.max(0, Math.min(1100, availableWidth));
  return { width, height: width / ratio };
}

// A prévia pode ser explorada lateralmente, sem encolher textos para caber no telefone.
export function getAutoPreviewLayout(
  availableWidth: number,
  format: (typeof AUTO_FORMATS)[number],
  appFontScale = 1,
  systemFontScale = 1,
) {
  const readingScale = Math.max(1, appFontScale * systemFontScale);
  const minimumWidth = format.id === "panoramic" ? 880 : format.id === "horizontal" ? 640 : 280;
  const frame = getAutoFrameSize(Math.max(availableWidth, minimumWidth * readingScale), format.ratio);
  return {
    ...frame,
    stacked: format.id === "vertical" || frame.width / readingScale < 600,
    scrollsHorizontally: frame.width > availableWidth,
  };
}
