export type ProgrammedAnswer = {
  keywords: string[];
  answer: string;
};

// Palavras-chave ja sem acento e em minúsculas,
// porque o chatEngine normaliza a mensagem antes de comparar.
export const programmedAnswers: ProgrammedAnswer[] = [
  {
    keywords: ["kw", "quilowatt"],
    answer:
      "kW (quilowatt) mede a potência do carregador. Quanto maior o kW, mais rápido a bateria tende a carregar.",
  },
  {
    keywords: ["autonomia"],
    answer:
      "Autonomia é a distância que o veículo consegue percorrer com a carga atual. A estimativa do app multiplica a autonomia configurada pela porcentagem de bateria. A chegada estimada também considera a distância em linha reta até a estação, sem telemetria.",
  },
  {
    keywords: ["quanto tempo", "demora"],
    answer:
      "O tempo de recarga depende da potência do carregador, da bateria do veículo e do nível de carga. Carregadores mais potentes costumam ser mais rápidos.",
  },
];
