import type { ChargingStation } from "../../types";
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

export function getUserInitials(userName: string) {
  const nameParts = userName.trim().split(/\s+/);
  const firstInitial = nameParts[0]?.[0] ?? "";
  const lastInitial =
    nameParts.length > 1 ? nameParts[nameParts.length - 1]?.[0] ?? "" : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function getStationRouteUrl(
  station: ChargingStation,
  provider: RouteProvider,
) {
  const destination = `${station.latitude},${station.longitude}`;

  if (provider === "waze") {
    return `https://www.waze.com/ul?ll=${destination}&navigate=yes`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
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
