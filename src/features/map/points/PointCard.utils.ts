import type { ComponentType } from "react";
import {
  BatteryFull,
  BatteryLow,
  BatteryWarning,
  Zap,
} from "lucide-react-native";

import type { ChargingStation } from "../../../types";
import { avaliarAlcance } from "../../../utils/autonomia";
import { formatarDistanciaDemonstrativa } from "../../../utils/demonstracao";
import { getStationStatusInfo } from "../../stations/stationPresentation";
import { obterTomDoMarcador } from "../map/Map.utils";

type CoresDoPonto = {
  primary: string;
  primarySoft?: string;
  green?: string;
  success?: string;
  successSoft?: string;
  yellow?: string;
  yellowDark: string;
  warningLight?: string;
  warningText?: string;
  dangerText?: string;
  dangerBorder?: string;
  dangerSoft?: string;
  textLight: string;
};

export function obterCorDoMarcador(
  station: ChargingStation,
  colorSet: CoresDoPonto,
  now: Date,
) {
  const tom = obterTomDoMarcador(station, now);

  if (tom === "manutencao") {
    return colorSet.dangerBorder ?? colorSet.yellowDark;
  }

  if (tom === "indisponivel") {
    return colorSet.textLight;
  }

  if (tom === "ocupado") {
    return colorSet.yellowDark;
  }

  return colorSet.green ?? colorSet.success ?? colorSet.primary;
}

export function obterApresentacaoDoAlcance(
  nivel: ReturnType<typeof avaliarAlcance>["nivel"],
  colorSet: CoresDoPonto,
) {
  if (nivel === "tranquilo") {
    return {
      icone: BatteryFull,
      cor: colorSet.green ?? colorSet.success ?? colorSet.primary,
      fundo: colorSet.successSoft ?? colorSet.primarySoft,
      rotulo: "Confortável",
    };
  }

  if (nivel === "apertado") {
    return {
      icone: BatteryLow,
      cor: colorSet.warningText ?? colorSet.yellowDark,
      fundo: colorSet.warningLight ?? colorSet.yellow,
      rotulo: "Limitada",
    };
  }

  return {
    icone: BatteryWarning,
    cor: colorSet.dangerText ?? colorSet.dangerBorder ?? colorSet.yellowDark,
    fundo: colorSet.dangerSoft ?? colorSet.warningLight ?? colorSet.yellow,
    rotulo: "Insuficiente",
  };
}

type IconeDeCriterio = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export function apresentarPonto(
  station: ChargingStation,
  now: Date,
  vehicleRangeKm: number,
  batteryPercent: number,
  colors: CoresDoPonto,
) {
  return {
    id: station.id,
    criterioLabel: "No catálogo",
    criterioIcon: Zap as IconeDeCriterio,
    nomeEstacao: station.name,
    address: station.address,
    status: getStationStatusInfo(station, now).label,
    statusColor: obterCorDoMarcador(station, colors, now),
    rating: station.rating.toFixed(1).replace(".", ","),
    power: `${station.powerKw} kW`,
    distancia: formatarDistanciaDemonstrativa(station.distanceKm),
    alcance: avaliarAlcance(station.distanceKm, vehicleRangeKm, batteryPercent),
  };
}
