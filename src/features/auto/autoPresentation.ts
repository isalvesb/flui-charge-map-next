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
