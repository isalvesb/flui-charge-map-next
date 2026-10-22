import { formatAssistantDistance, type FluiAssistantRecommendation } from "./fluiAssistant";
import type { UserPreferences } from "../../types";
import { getBatterySourceLabels } from "../../utils/batteryData";

export function describeAssistantContext(
  preferences: Pick<UserPreferences, "vehicleName" | "vehicleRangeKm" | "batteryPercent" | "batterySource" | "batteryUpdatedAt">,
  originName: string,
  stationCount: number,
) {
  const source = getBatterySourceLabels(preferences);
  const detail = source.detail === "Sem telemetria" ? "" : ` · ${source.detail}`;
  return [
    `Veículo: ${preferences.vehicleName}. Autonomia configurada com bateria cheia: ${preferences.vehicleRangeKm} km.`,
    `Bateria para estimativa: ${preferences.batteryPercent}%. ${source.source}${detail}. Sem telemetria do veículo.`,
    `Origem demonstrativa: ${originName}. Esta consulta não usa sua localização real.`,
    `Estações recebidas nesta consulta: ${stationCount}. Catálogo demonstrativo; não confirma disponibilidade real.`,
    "Valores atuais para novas consultas. Respostas anteriores podem usar outros valores; envie nova pergunta após ajustes.",
  ].join("\n");
}

// Resumo visual; o motor, a explicação completa e os cálculos permanecem iguais.
export function summarizeSuggestion(recommendation: FluiAssistantRecommendation) {
  return `${recommendation.primary.name}\n${formatAssistantDistance(recommendation.primary.distanceKm)} em linha reta · chegada ≈${recommendation.arrivalBatteryPercent}% · ${recommendation.powerKw} kW.\nDados demonstrativos, com reserva de 5%. Confirme funcionamento e compatibilidade.`;
}
