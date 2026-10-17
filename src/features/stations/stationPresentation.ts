import type { ChargingStation } from "../../types";
import type { AvaliacaoDeAlcance } from "../../utils/autonomia";
import { getStationOpeningState, isStationOpenAt } from "../../utils/stationHours";
import { canChargeAt, getUsableConnectors } from "../../utils/stationAvailability";

export type StationStatusInfo = {
  label: string;
  description: string;
};

export type RouteProvider = "google" | "waze";

export function formatStationAddress(station: ChargingStation) {
  return [station.address, station.neighborhood, station.city, station.state]
    .filter(Boolean)
    .join(", ");
}

export function getStationStatusInfo(
  station: ChargingStation,
  date = new Date(),
): StationStatusInfo {
  if (station.status === "maintenance") {
    return {
      label: "Em manutenção",
      description: "Ponto temporariamente indisponível",
    };
  }

  if (station.status === "unavailable") {
    return {
      label: "Status indisponível",
      description: "Disponibilidade não confirmada nos dados demonstrativos",
    };
  }

  if (getStationOpeningState(station, date) === "unknown") {
    return {
      label: "Horário não confirmado",
      description: "Consulte o funcionamento antes de ir",
    };
  }
  if (!isStationOpenAt(station, date)) {
    return {
      label: "Fechado agora",
      description: station.openingHours,
    };
  }

  if (station.status === "available") {
    return {
      label: "Aberto agora",
      description: canChargeAt(station, date)
        ? "Disponibilidade demonstrativa de carregadores"
        : "Sem carregadores utilizáveis nos dados locais",
    };
  }

  if (station.status === "busy") {
    return {
      label: "Ocupado agora",
      description: "Ocupação indicada nos dados demonstrativos",
    };
  }

  return {
    label: "Status indisponível",
    description: "Disponibilidade não confirmada nos dados demonstrativos",
  };
}

export function formatRatingStars(rating: number) {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? "★" : "☆",
  ).join(" ");
}

export function getStationChargerCountLabel(
  station: ChargingStation,
  availableChargers: number,
  totalChargers: number,
  date = new Date(),
) {
  return canChargeAt(station, date)
    ? `${availableChargers} de ${totalChargers} carregadores livres no exemplo`
    : `${totalChargers} carregadores cadastrados no exemplo. Recarga não confirmada.`;
}

export function getStationArrivalPresentation(
  station: ChargingStation,
  assessment: AvaliacaoDeAlcance,
  date = new Date(),
) {
  const arrival = assessment.nivel === "foraDeAlcance"
    ? `Autonomia insuficiente para a distância aproximada — faltam ${assessment.kmFaltantes} km.`
    : `${assessment.nivel === "apertado" ? "Autonomia limitada — " : ""}Chegada estimada com ${assessment.bateriaAoChegarPercent}% de bateria.`;
  const tone = assessment.nivel === "foraDeAlcance"
    ? "danger"
    : assessment.nivel === "apertado"
      ? "warning"
      : canChargeAt(station, date) ? "success" : "neutral";

  return {
    text: `Autonomia para chegar ao local\n${arrival}\nNão garante recarga no local.`,
    tone,
  } as const;
}

export function getStationRouteNotice(station: ChargingStation, date = new Date()) {
  const status = getStationStatusInfo(station, date);
  const availability = canChargeAt(station, date)
    ? "A abertura e os carregadores livres são demonstrativos."
    : `${status.description}. A recarga não está confirmada neste ponto.`;
  return `Nos dados demonstrativos: ${status.label}. ${availability} Abrir a rota não garante atendimento; confirme o funcionamento e a compatibilidade antes de ir.`;
}

export function getUserInitials(userName: string) {
  const nameParts = userName.trim().split(/\s+/);
  const firstInitial = nameParts[0]?.[0] ?? "";
  const lastInitial =
    nameParts.length > 1 ? nameParts[nameParts.length - 1]?.[0] ?? "" : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function getEstimatedChargingTime(powerKw: number) {
  if (powerKw >= 120) return "20 a 35 min";
  if (powerKw >= 50) return "40 a 60 min";
  return "1h30 ou mais";
}

export function getStationRecommendation(
  station: ChargingStation,
  availableChargers: number,
  date = new Date(),
) {
  if (station.status === "maintenance") {
    return "Evite este ponto por enquanto";
  }

  if (!canChargeAt(station, date)) {
    return "Recarga não confirmada neste ponto";
  }

  const usablePowerKw = Math.min(
    station.powerKw,
    Math.max(...getUsableConnectors(station).map(connector => connector.powerKw)),
  );
  if (availableChargers > 0 && usablePowerKw >= 120) {
    return "Opção com conector rápido no exemplo";
  }

  if (availableChargers > 0) {
    return "Opção de recarga nos dados demonstrativos";
  }

  return "Verifique a fila antes de ir";
}

export function getWaitingLevel(
  status: ChargingStation["status"],
  availableChargers: number,
) {
  if (status === "maintenance" || status === "unavailable") return "Indisponível";
  if (availableChargers > 1) return "Baixa";
  if (availableChargers === 1) return "Moderada";
  return "Alta";
}

export function getStationProfile(station: ChargingStation) {
  if (station.powerKw >= 120) return "Carga rápida";
  if (station.amenities.length >= 4) return "Parada confortável";
  return "Recarga essencial";
}
