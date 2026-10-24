// Tipos mínimos para a biblioteca "qrcode", que não traz declarações próprias.
// Usamos só a geração da matriz; o desenho é feito com react-native-svg.
declare module "qrcode" {
  export type QRCodeModules = {
    size: number;
    get(row: number, col: number): boolean;
  };

  export type QRCodeResult = {
    modules: QRCodeModules;
  };

  export function create(
    text: string,
    options?: { errorCorrectionLevel?: "L" | "M" | "Q" | "H" },
  ): QRCodeResult;
}
