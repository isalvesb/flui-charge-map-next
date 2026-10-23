import { funcionalidadesExperimentais } from "../../config/funcionalidadesExperimentais";
import type { ChargingStation } from "../../types";
import { canChargeAt } from "../../utils/stationAvailability";
import { getStationOpeningState } from "../../utils/stationHours";
import { programmedAnswers } from "./programmedAnswers";
import {
  type FluiAssistantIntent,
  type FluiAssistantRecommendation,
  MIN_ARRIVAL_BATTERY_PERCENT,
  recommendStations,
} from "./fluiAssistant";

export type AssistantContext = {
  stations: ChargingStation[];
  vehicleRangeKm: number;
  batteryPercent: number;
  now: Date;
};

// Mantido para a ficha de recomendação da interface, inclusive a PR #79.
export const RECOMMENDATION_DISCLAIMER =
  "Distância aproximada em linha reta, sem cálculo de percurso. Estimativa linear com reserva de 5%. Compatibilidade do veículo não confirmada; não há integração em tempo real.";

export type ChatResponse = {
  text: string;
  state: "respondendo" | "aviso" | "alerta";
  recommendation?: FluiAssistantRecommendation;
};

const intentRules: {
  intent: FluiAssistantIntent;
  label: string;
  pattern: RegExp;
  unavailable: string;
}[] = [
  {
    intent: "lowBattery",
    label: "preservar bateria",
    pattern: /\b(?:(?:pouca|baixa|pouquissima) (?:bateria|autonomia)|bateria (?:(?:esta|ta) )?(?:muito )?(?:baixa|fraca|acabando|zerada)|sem bateria|(?:preservar|economizar) bateria|(?:consigo|posso|vou|da para) chegar|chegar (?:ao|no|a um) posto)\b|^bateria$|^chegar$/,
    unavailable: "Não encontrei uma parada ao alcance com a reserva exigida",
  },
  {
    intent: "fastCharge",
    label: "recarga rápida",
    pattern: /\b(?:rapid[ao]s?|veloz|depressa|alta potencia|mais potente)\b/,
    unavailable: "Não encontrei uma opção viável para priorizar a potência de recarga",
  },
  {
    intent: "avoidQueues",
    label: "esperar menos",
    pattern: /\b(?:filas?|(?:esperar|aguardar|demorar|demora) menos|(?:menor|menos) espera|menos tempo esperando)\b/,
    unavailable: "Não encontrei uma opção viável para comparar a disponibilidade de carregadores",
  },
  {
    intent: "coffeeAndRestroom",
    label: "café e banheiro",
    pattern: /\b(?:cafe|banheiro|sanitario)\b/,
    unavailable: "Não encontrei uma opção viável com café e banheiro cadastrados",
  },
  {
    intent: "comfortableWait",
    label: "esperar com conforto",
    pattern: /\b(?:conforto|confortavel|confortavelmente|comodidades|descansar|descanso)\b/,
    unavailable: "Não encontrei uma opção viável com comodidades para esperar",
  },
];

function normalize(text: string) {
  return text
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/(\d)([a-z])/g, "$1 $2")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Diagnóstico apenas do conjunto recebido. O chat não recebe filtros nem o
// catálogo completo, e não deve inventar a causa de uma seleção vazia.
function explainNoRecommendation(context: AssistantContext, intent: FluiAssistantIntent) {
  const { stations, batteryPercent, vehicleRangeKm, now } = context;
  if (!stations.length) return "Não recebi estações para comparar nesta consulta.";
  if (!Number.isFinite(batteryPercent) || batteryPercent < 0 || batteryPercent > 100 ||
      !Number.isFinite(vehicleRangeKm) || vehicleRangeKm <= 0) {
    return "A bateria ou a autonomia configurada não permite uma estimativa válida. Confira esses valores.";
  }
  if (!Number.isFinite(now.getTime())) return "O horário da consulta é inválido; não consigo confirmar o funcionamento pelo cadastro.";

  const chargeable = stations.filter((station) => canChargeAt(station, now));
  if (!chargeable.length) {
    if (stations.every((station) => station.status === "maintenance"))
      return "Todas as estações recebidas estão em manutenção no cadastro.";
    if (stations.every((station) => station.status !== "available"))
      return "As estações recebidas estão marcadas como ocupadas, indisponíveis ou em manutenção.";
    if (stations.every((station) => station.status === "available" && getStationOpeningState(station, now) === "closed"))
      return "Os horários cadastrados indicam que todas as estações recebidas estão fechadas nesta consulta.";
    if (stations.every((station) => station.status === "available" && getStationOpeningState(station, now) === "unknown"))
      return "Não há horários válidos para confirmar o funcionamento das estações recebidas.";
    return "Nenhuma estação recebida reúne funcionamento confirmado e conector livre utilizável no cadastro.";
  }

  // Consulta o mesmo motor, sem relaxar reserva, disponibilidade ou cálculos.
  // Uma opção geral existente comprova a falta da combinação de comodidades
  // entre as estações viáveis, não a ausência de toda e qualquer opção.
  if ((intent === "coffeeAndRestroom" || intent === "comfortableWait") &&
      recommendStations({ ...context, intent: "lowBattery" })) {
    return intent === "coffeeAndRestroom"
      ? "Há opção que atende ao alcance e à disponibilidade, mas nenhuma reúne café e banheiro, exigidos por esta opção. Você pode pedir outra prioridade."
      : "Há opção que atende ao alcance e à disponibilidade, mas nenhuma tem as comodidades exigidas para conforto. Você pode pedir outra prioridade.";
  }

  const hasUsableEstimates = chargeable.some((station) =>
    Number.isFinite(station.distanceKm) && station.distanceKm >= 0 &&
    Number.isFinite(station.powerKw) && station.powerKw > 0,
  );
  if (!hasUsableEstimates)
    return "As estações com possibilidade de recarga não têm distância e potência válidas para esta comparação.";

  // Sem opção geral, os candidatos com dados válidos falharam na reserva.
  // Não estima percurso real nem sugere diminuir a margem de segurança.
  if (batteryPercent <= MIN_ARRIVAL_BATTERY_PERCENT)
    return `Com ${batteryPercent}% de bateria, não há margem para deslocamento preservando a reserva mínima de ${MIN_ARRIVAL_BATTERY_PERCENT}% na chegada.`;
  return `Nas estações com dados utilizáveis, o deslocamento estimado não preserva a reserva mínima de ${MIN_ARRIVAL_BATTERY_PERCENT}% na chegada. Confira a bateria e a autonomia informadas; não reduza a reserva para forçar uma sugestão.`;
}

export function answerMessage(text: string, context: AssistantContext): ChatResponse {
  if (!funcionalidadesExperimentais.fluia)
    return { text: "FluIA desabilitada nesta versão.", state: "aviso" };

  const message = normalize(text);
  const matches = intentRules.filter((rule) => rule.pattern.test(message));
  const programmed = programmedAnswers.find((item) =>
    item.keywords.some((keyword) => new RegExp(`\\b${keyword}\\b`).test(message)),
  );
  const isExplanation = /\b(?:o que e|o que significa|como funciona|explique)\b/.test(message) ||
    (/\b(?:quanto tempo|quanto demora)\b/.test(message) && matches.every((rule) => rule.intent === "fastCharge"));
  if (programmed && (isExplanation || !matches.length)) {
    // O aviso geral já está no cabeçalho. Mantém as ressalvas específicas da
    // resposta, sem repetir o parágrafo experimental em cada mensagem.
    return { text: programmed.answer, state: "respondendo" };
  }

  // Não transforma uma prioridade negada em pedido positivo. "Sem fila" e
  // "não quero pegar fila" continuam pertencendo à intenção de evitar filas.
  if (/\b(?:nao (?:quero|preciso|busco)(?: de)?|sem) (?:cafe|banheiro|conforto|comodidades|recarga rapida|carregar rapido)\b/.test(message)) {
    return {
      text: "Não consigo aplicar essa exclusão como critério. Qual prioridade você quer usar: preservar bateria, recarga rápida, esperar menos, café e banheiro ou esperar com conforto?",
      state: "aviso",
    };
  }

  if (matches.length > 1) {
    return {
      text: `Identifiquei mais de uma prioridade: ${matches.map((rule) => rule.label).join(", ")}. Qual delas você quer priorizar nesta consulta?`,
      state: "respondendo",
    };
  }
  const rule = matches[0];
  if (rule) {
    const recommendation = recommendStations({ ...context, intent: rule.intent });
    if (!recommendation) {
      return {
        text: `${rule.unavailable} no catálogo de simulação. ${explainNoRecommendation(context, rule.intent)}`,
        state: "alerta",
      };
    }
    return {
      text: `Na simulação, ${recommendation.primary.name}: ${recommendation.explanation}\nEstimativa em linha reta com reserva de ${MIN_ARRIVAL_BATTERY_PERCENT}%; compatibilidade não confirmada. Confirme o funcionamento antes de sair.`,
      state: "respondendo",
      recommendation,
    };
  }

  const wantsRecommendation = /\b(?:recomendacao|recomende|recomenda|sugestao|sugira|indique|indica|onde (?:posso )?carregar)\b/.test(message);
  return {
    text: `${wantsRecommendation ? "Para recomendar, preciso saber sua prioridade." : "Posso ajudar com as opções de recarga do exemplo."} Você quer preservar bateria, recarga rápida, esperar menos, café e banheiro ou esperar com conforto?`,
    state: "respondendo",
  };
}
