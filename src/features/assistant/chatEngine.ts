import { programmedAnswers } from "./programmedAnswers";
import type { ChargingStation } from "../../types";
import {
  FluiAssistantRecommendation,
  recommendStations,
} from "./fluiAssistant";

export type AssistantContext = {
  stations: ChargingStation[];
  vehicleRangeKm: number;
  batteryPercent: number;
  now: Date;
};

export const RECOMMENDATION_DISCLAIMER =
  "Estimativa linear com reserva de 5%. Compatibilidade do veículo não confirmada; não há integração em tempo real.";

export type ChatResponse = {
  text: string;
  state: "respondendo" | "aviso" | "alerta";
  recommendation?: FluiAssistantRecommendation;
};

function normalize(text: string) {
  return text
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function answerMessage(
  text: string,
  context: AssistantContext,
): ChatResponse {
  const message = normalize(text);

  const programmed = programmedAnswers.find((item) =>
    item.keywords.some((keyword) => message.includes(keyword)),
  );
  if (programmed) {
    return { text: programmed.answer, state: "respondendo" };
  }

  if (message.includes("rapid")) {
    const recommendation = recommendStations({
      stations: context.stations,
      intent: "fastCharge",
      vehicleRangeKm: context.vehicleRangeKm,
      batteryPercent: context.batteryPercent,
      now: context.now,
    });

    if (!recommendation) {
      return {
        text: "Não encontrei estações disponíveis agora.",
        state: "alerta",
      };
    }

    return {
      text: `${recommendation.explanation}\n${RECOMMENDATION_DISCLAIMER}`,
      state: "respondendo",
      recommendation,
    };
  }

  if (message.includes("bateria") || message.includes("chegar")) {
    const recommendation = recommendStations({
      stations: context.stations,
      intent: "lowBattery",
      vehicleRangeKm: context.vehicleRangeKm,
      batteryPercent: context.batteryPercent,
      now: context.now,
    });

    if (!recommendation) {
      return {
        text: "Não encontrei um posto alcançável com a bateria atual.",
        state: "alerta",
      };
    }

    return {
      text: `${recommendation.explanation}\n${RECOMMENDATION_DISCLAIMER}`,
      state: "respondendo",
      recommendation,
    };
  }

  return {
    text: "Posso ajudar com recarga rápida, bateria baixa ou onde esperar menos. Qual delas você quer?",
    state: "respondendo",
  };
}
