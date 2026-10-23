# Gama 3.3 — trechos e limites do planejador

Já existiam: múltiplas paradas em ordem geográfica demonstrativa, estimativas por
trecho, recarga simulada, reserva mínima de 5% antes do arredondamento e bloqueio
de viagem inviável. Não foi substituído o algoritmo nem criada uma segunda regra.

Implementado:
- Resultado expõe distância, tempo e bateria de saída do último trecho, usando
  valores já calculados no domínio. Apresentação numérica do trecho final somente
  em plano que preserve a reserva; viagem bloqueada mantém aviso e botão indisponível.
- “Deslocamento estimado” diferencia tempo de viagem de espera e duração de recarga.
  Aviso esclarece que conectores/funcionamento das paradas não estão confirmados.
- “Ver trechos da viagem” é um atalho por toque, com redução de movimento respeitada,
  para o resumo completo. Não exige um gesto de rolagem preciso.

Verificações: 134 testes, TypeScript e lint sem erros (um aviso herdado).
Dois casos novos cobrem último trecho direto, três recargas e recomputação após
mudança de parâmetros. Matriz local de 315 combinações de origem/destino,
autonomia/bateria preservou todos os campos anteriores à alteração.
`3.3-planos-antes.json` e `3.3-regressao-matriz.json` em `.validation/gama-avancada/`.

iOS: Device Hub/iPhone 17e/iOS 27.0/Expo Go. Atalho funcionou e captura
`3.3-trecho-final-e-resumo.png` mostra resumo sem reticências, ≈142 km,
2h02min de deslocamento, saída 70% e chegada 34%, com os avisos legíveis.
As três recargas foram verificadas automaticamente, não percorridas fisicamente.

## Evolução que exige decisão

- Bateria e autonomia já recomputam o plano via dependências do contexto. Origem
  escolhida dentro do planejador é independente da preferência global enquanto
  a tela está montada; não foi imposto um novo comportamento de substituição.
- Paradas têm fração da linha reta e potência; não têm vínculo verificável a
  estações, conectores, horário, fila ou disponibilidade em tempo real. Não é
  seguro inventar compatibilidade ou aplicar filtros de conectores a esses dados.
- Próximo incremento local possível: enriquecer o modelo demonstrativo com
  conectores e proveniência, após aprovação dos dados/critérios. Escolher “mais
  rápida”, “menos paradas” ou “somente favoritas” muda produto; não aplicado silenciosamente.
- Roteamento real, relevo, trânsito, consumo detalhado e confirmação de recarga
  precisam de fontes/APIs e política de indisponibilidade aprovadas separadamente.

Sem novas dependências, APIs, GPS, alteração de reserva ou validação física/Android/Release.
