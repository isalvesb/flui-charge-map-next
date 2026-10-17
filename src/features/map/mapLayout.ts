// Topo 18 + zoom 104 + intervalo 10 + centralizar 52 + intervalo 10 + FluIA 52 + painel 4.
const VERTICAL_CONTROL_SPACE = 250;

// Mantém espaço para os controles do mapa sem depender de um dispositivo específico.
export function getMapPanelLayout(width: number, height: number, mapHeight: number, textScale = 1, panelHeight = 0) {
  const horizontal = width >= 700 && width > height;
  return {
    horizontal,
    compactControls: horizontal || mapHeight < 420 || textScale > 1.3 || mapHeight - panelHeight < VERTICAL_CONTROL_SPACE,
    panelWidth: horizontal ? Math.min(400, width * 0.42) : undefined,
    panelMaxHeight: Math.max(80, mapHeight - (horizontal ? 12 : 80)),
  };
}
