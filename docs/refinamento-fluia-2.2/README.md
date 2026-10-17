# Beta 2.2 — refinamento conversacional

Refs #21. Base: `b89a71b1ab1a0adc80c0b9f0ec0a47dda02b8e92` (`main` consultada em 17/10/2026). Branch independente: `beta/refinamento-fluia-2.2`. Sem merge ou encerramento de Issues.

## Diagnóstico e decisões

- O chat só encaminhava duas das cinco intenções do motor. Filas, café/banheiro e conforto caíam no fallback; esse fallback oferecia “esperar menos”, mas não reconhecia a resposta. A busca genérica por palavras também deixava perguntas programadas interceptarem pedidos como “Onde demora menos?”.
- O ranking já diferencia as necessidades; não foi necessário substituí-lo. A mesma estação pode legitimamente vencer mais de uma comparação. Sinônimos da mesma intenção continuam determinísticos, sem alternância artificial de textos.
- `chatEngine.ts` agora reconhece as cinco intenções, normaliza acentos/espaços e identifica variantes. Pedidos genéricos perguntam a prioridade; prioridades múltiplas pedem esclarecimento. Exclusões simples não suportadas não são convertidas em pedidos positivos.
- As falhas têm uma introdução por intenção e um diagnóstico limitado aos dados recebidos: conjunto vazio, entradas inválidas, manutenção/status, horários, conectores, estimativas inválidas, combinação de comodidades ou reserva. Não se presume que filtros causaram um conjunto vazio: a interface não fornece essa informação.
- Para explicar a falta de comodidades, consulta-se o mesmo motor com `lowBattery`, sem relaxar qualquer critério de segurança. Essa comparação só informa que existe uma opção geral; não a devolve como substituta do pedido de café/conforto. A opção existente `coffeeAndRestroom` continua exigindo **café e banheiro**, inclusive quando a pergunta menciona apenas café; essa limitação é explicitada na resposta negativa.
- A reserva de **5%** ganhou somente um nome compartilhado (`MIN_ARRIVAL_BATTERY_PERCENT`). Expressão matemática, corte exato, arredondamento de apresentação, ranking, disponibilidade e compatibilidade permanecem iguais. Não se extrai um novo nível de bateria de frases: usam-se os valores configurados recebidos da interface.
- O aviso experimental já aparece no cabeçalho da interface atual e da PR #79. Ele deixou de ser anexado a toda resposta programada. As recomendações identificam o exemplo, conservam ressalvas de estimativa/reserva/compatibilidade e as explicações específicas sobre filas sem tempo real. `RECOMMENDATION_DISCLAIMER`, usado pelo cartão da interface, foi mantido integralmente.
- `AssistantContext` e `ChatResponse` são idênticos à main. Sem memória de conversa, novo contrato, serviço externo, dependência ou alteração visual. `programmedAnswers.ts` preserva os textos e amplia somente variantes de palavras (como “quilowatts” e “demorar”).

## Exemplos executados antes/depois

Motores da main e da branch executados diretamente com a mesma fixture: estação a 1 km, autonomia de 300 km, 70% de bateria, café/banheiro/Wi-Fi e horário fixo. Exceções indicadas abaixo. Respostas completas e entradas em [exemplos.json](exemplos.json); não são capturas de interface.

| Pergunta/cenário | Antes | Depois (trecho) |
| --- | --- | --- |
| “Esperar menos” | Fallback oferecendo esperar menos novamente | “Combina disponibilidade cadastrada e distância; não há previsão de fila em tempo real.” + recomendação `avoidQueues` |
| “Onde posso tomar um café enquanto carrego?” | Fallback | “Reúne banheiro e café cadastrados…” + recomendação `coffeeAndRestroom` |
| “Quero uma recomendação” | Fallback genérico | “Para recomendar, preciso saber sua prioridade.” + cinco opções reconhecidas |
| “Bateria baixa”, com 5% | Ausência genérica de opção | “Com 5% de bateria, não há margem para deslocamento preservando a reserva mínima de 5% na chegada.” |
| “Bateria baixa”, estação em manutenção | Ausência genérica de opção | “Todas as estações recebidas estão em manutenção no cadastro.” |
| “O que é autonomia?” | Definição + aviso experimental completo | Mesma definição e ressalva de estimativa, sem repetir o aviso do cabeçalho |

## Validação e preservação

- `npm run check`: **TypeScript e lint aprovados; 77 testes passaram**, incluindo 17 testes novos. [Log](check.log).
- Casos cobertos: cinco intenções e sinônimos, ambiguidades/negações simples, todas as prioridades oferecidas, respostas programadas, conjunto vazio, manutenção/ocupação/indisponibilidade, horários fechados/desconhecidos, dados inválidos, comodidades ausentes, 0%/4%/5% de bateria, limite exato de chegada e controle experimental desligado. Os testes anteriores de cálculos, conectores e horários permanecem aprovados.
- Teste de fronteira: com autonomia de 100 km e bateria de 7%, distância de 2 km aceita chegada de 5%; 2,01 km é recusada, mesmo que a apresentação arredonde. Com 5% e distância zero, a regra original continua permitindo a opção. O resultado de cada intenção do chat também é comparado ao motor de recomendações existente.
- Dependências do lockfile reinstaladas do cache (`npm ci --offline`), sem alterações em manifests ou lockfile. Os avisos npm de ambiente/depreciação de dependências existentes não são erros de TypeScript/lint.
- PR #79 conferida em `99bd08d` e PR #85 em `b3a8dda`: nenhuma alteração nas branches; nenhum arquivo alterado por este refinamento coincide com os arquivos alterados por elas em relação à base. Não foi feito merge experimental. A CI desta PR verifica a integração com a main; resultado/link ficam na descrição da PR.

## Limitações

Não houve validação visual web ou nativa nesta rodada. Testes e execução direta comprovam o motor, não a experiência no iOS; a revisão humana integrada à PR #79 continua pertinente. O interpretador reconhece expressões locais delimitadas, não toda linguagem natural, negações complexas ou referências a mensagens anteriores. Novas variantes devem ser acrescentadas a partir de evidências. Não foram antecipadas voz, memória de conversa ou novas preferências.

O contexto atual não contém conectores do veículo nem motivos dos filtros. A compatibilidade continua não confirmada no chat; as verificações existentes do motor quando esses dados são fornecidos foram preservadas. Introduzir novos campos no contrato exige discussão separada. A Issue #21 permanece aberta, inclusive para os demais escopos já documentados nela.
