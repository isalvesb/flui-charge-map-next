import {
  BatteryFull,
  BatteryLow,
  BatteryMedium,
} from "lucide-react-native";

export const PASSO_AJUSTE_BATERIA = 5;

type CoresDaBateria = {
  green?: string;
  success?: string;
  primary: string;
  yellowDark: string;
  warningText?: string;
  dangerText?: string;
  dangerBorder?: string;
};

export function obterCorDeBateriaAtual(
  percentual: number,
  colorSet: CoresDaBateria,
) {
  if (percentual >= 50) {
    return colorSet.green ?? colorSet.success ?? colorSet.primary;
  }

  if (percentual >= 25) {
    return colorSet.warningText ?? colorSet.yellowDark;
  }

  return colorSet.dangerText ?? colorSet.dangerBorder ?? colorSet.yellowDark;
}

export function obterIconeDeBateriaAtual(percentual: number) {
  if (percentual >= 60) {
    return BatteryFull;
  }

  if (percentual >= 25) {
    return BatteryMedium;
  }

  return BatteryLow;
}
