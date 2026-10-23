export type ProgrammedAnswer = {
  keywords: string[];
  answer: string;
};

// Palavras-chave ja sem acento e em minúsculas,
// porque o chatEngine normaliza a mensagem antes de comparar.
export const programmedAnswers: ProgrammedAnswer[] = [
  {
    keywords: ["kw", "quilowatt", "quilowatts"],
    answer:
      "kW (quilowatt) indica a potência de recarga. Um número maior pode permitir uma carga mais rápida, mas o carro também limita a potência que consegue receber.",
  },
  {
    keywords: ["autonomia"],
    answer:
      "Autonomia é a distância estimada que você pode percorrer com a carga atual. No Flui, ela usa a bateria e a autonomia com carga cheia informadas no app. A chegada considera a distância em linha reta; esses valores não são lidos do carro.",
  },
  {
    keywords: ["quanto tempo", "demora", "demorar", "demorado", "demorada"],
    answer:
      "O tempo de recarga depende do carro, da potência disponível e de quanto você quer carregar. A velocidade costuma diminuir perto da carga cheia. Sem esses dados, não consigo informar um tempo confiável.",
  },
];
