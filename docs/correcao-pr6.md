# Correção técnica da PR #6

Validação em 17/10/2026, sobre `feature/fluia-chat-ui`, inicialmente em `5ec8f1e`.

## Diagnóstico e correções

- Reproduzidos cinco erros de TypeScript: dois símbolos sem importação no motor do chat e três chamadas de testes sem o campo obrigatório `AssistantContext.now`. A integração da branch preservou os usos dos controles da Beta 2.1, mas perdeu suas importações; a interface já fornecia o relógio corretamente.
- Restauradas as importações de `funcionalidadesExperimentais` e `identificacaoDados`. Mantido `now` obrigatório, com horário fixo nos testes; sem afrouxar o contrato ou alterar critérios de recomendação.
- Os três avisos de lint correspondiam ao aviso demonstrativo e ao contexto de veículo/origem que deixaram de ser exibidos. Esses textos foram recuperados mantendo o chat, seus atalhos e a navegação existentes.
- Restaurada a ressalva de distância em linha reta. O aviso de ausência de recomendação para bateria baixa deixou de atribuir toda indisponibilidade exclusivamente à autonomia: manutenção e fechamento também impedem recomendações.

Arquivos de implementação: `src/features/assistant/chatEngine.ts`, `src/features/assistant/FluiAssistantSheet.tsx`. Testes: `tests/chatEngine.test.ts`, `tests/funcionalidadesExperimentais.test.ts`.

## Evidências

- `npm run check`: TypeScript e lint sem erros/avisos de código; **60 testes aprovados**. Acrescentados cenários de bateria insuficiente, fechamento pelo relógio fornecido e manutenção. O controle experimental desligado também foi verificado para mensagens de bateria baixa, além das demais respostas.
- `EXPO_OFFLINE=1 CI=1 npx expo export --platform web --output-dir /tmp/flui-pr6-web`: **11 rotas exportadas**.
- Interface web, exportação servida localmente: pergunta sobre autonomia respondida; mensagem de bateria baixa gerou recomendação; botão do chat abriu a ficha de Higienópolis Prime Charge (`station-01`); retorno e reabertura limparam a conversa; atalho “Quero carregar rápido” continuou recomendando com veículo, origem e ressalvas visíveis.
- Captura visual: [chat-web.png](validacao-pr6/chat-web.png). Transcrições: [pergunta](validacao-pr6/pergunta-programada.txt), [recomendação](validacao-pr6/recomendacao-chat.txt), [ficha](validacao-pr6/ficha-pelo-chat.txt), [retorno](validacao-pr6/retorno-chat.txt), [atalho](validacao-pr6/atalho-recarga.txt). Logs de comandos na mesma pasta.

## Separação da main e limites

- As falhas independentes da main foram tratadas pela **PR #77, já integrada** em `93c453c`. Seu [Quality #17](https://github.com/isalvesb/flui-charge-map-next/actions/runs/38991287321) passou. As correções de configuração e rota dessa PR não foram duplicadas aqui.
- O Quality da PR #6 no commit inicial falhava na validação de tipos, antes da exportação: [execução anterior](https://github.com/isalvesb/flui-charge-map-next/actions/runs/38973765342). O resultado do novo commit será registrado na descrição da PR.
- Não foram repetidos testes nativos iOS/Android. Os cenários de horário e controle desligado foram verificados por testes automatizados; a interação prática descrita acima foi web. Não representa validação visual nativa nem uma revisão completa de todas as telas.
- Sem novas dependências, regras de negócio ou funcionalidades. Sem alteração direta da main ou merge; integração depende da revisão da equipe.
