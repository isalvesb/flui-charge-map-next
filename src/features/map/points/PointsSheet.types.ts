export type PointsSheetMotion = {
  sheetHeight: number;
  fullyHidden: boolean;
  collapsed: boolean;
  collapsedOffset: number;
  hiddenOffset: number;
  obstructedHeight: number;
};

export type PointsSheetHandle = {
  expand: () => void;
};
