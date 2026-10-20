import { formatAssistantDistance, type FluiAssistantRecommendation } from "./fluiAssistant";

// Resumo visual; o motor, a explicação completa e os cálculos permanecem iguais.
export function summarizeSuggestion(recommendation: FluiAssistantRecommendation) {
  return `${recommendation.primary.name}\n${formatAssistantDistance(recommendation.primary.distanceKm)} em linha reta · chegada ≈${recommendation.arrivalBatteryPercent}% · ${recommendation.powerKw} kW.\nDados demonstrativos, com reserva de 5%. Confirme funcionamento e compatibilidade.`;
}
