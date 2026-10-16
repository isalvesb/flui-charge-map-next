import { funcionalidadesExperimentais } from "../../config/funcionalidadesExperimentais";
import { identificacaoDados } from "../../data/identificacaoDados";
import { programmedAnswers } from "@/src/features/assistant/programmedAnswers";
import type { ChargingStation } from "@/src/types";
import {
  FluiAssistantRecommendation,
  recommendStations,
} from "./fluiAssistant";

export type AssistantContext = {
  stations: ChargingStation[];
  vehicleRangeKm: number;
  batteryPercent: number;
};

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
  if (!funcionalidadesExperimentais.fluia) {
    return { text: "FluIA desabilitada nesta versão.", state: "aviso" };
  }
  const message = normalize(text);

  const programmed = programmedAnswers.find((item) =>
    item.keywords.some((keyword) => message.includes(keyword)),
  );
  if (programmed) {
    return { text: `${programmed.answer} ${identificacaoDados.fluia.aviso}`, state: "respondendo" };
  }

  if (message.includes("rapid")) {
    const recommendation = recommendStations({
      stations: context.stations,
      intent: "fastCharge",
      vehicleRangeKm: context.vehicleRangeKm,
      batteryPercent: context.batteryPercent,
    });

    if (!recommendation) {
      return {
        text: "Não encontrei uma opção viável nos dados demonstrativos. Isso não confirma a disponibilidade real das estações.",
        state: "alerta",
      };
    }

    return {
      text: `${recommendation.explanation} ${identificacaoDados.fluia.aviso}`,
      state: "respondendo",
      recommendation,
    };
  }

  return {
    text: "Posso ajudar com recarga rápida, bateria baixa ou onde esperar menos. Qual delas você quer?",
    state: "respondendo",
  };
}
