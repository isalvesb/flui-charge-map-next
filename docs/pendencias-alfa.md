# Pendências da Alfa — situação verificada em 16/10/2026

Escopo: #12, #74, #75 e #76, relacionadas a #11, #14 e #17. Base atual conferida: `main` em `45c65fa2260f2ebb9ad9121ae42344ff4403495a`. Trabalho isolado em `alfa/conclusao-pendencias-1.1-1.3`; a cópia local preexistente na branch Beta e o repositório original `guicunhasou/flui` foram preservados. As antigas PRs #1 e #2 já estavam integradas antes desta execução.

## Situação por Issue

| Issue | Entrega verificada | Pendência para conclusão |
| --- | --- | --- |
| #12 — Alfa 1.1.1 | Estrutura e fluxo existentes examinados; [convenções](colaboracao.md) acessíveis pelo README. Nenhuma reorganização necessária. | Revisão/aprovação da isalvesb e integração da PR proposta. |
| #74 — Alfa 1.1.3 | Branches, commits, PRs, validação e acompanhamento consolidados sem novos processos ou ferramentas. | Revisão/aprovação da responsável pela Alfa 1.1. |
| #75 — Alfa 1.2.3 | Provas iOS de mapa/filtros/horários/FluIA e ficha corrigida já publicadas em [auditoria](auditoria-1.2.md). Persistência complementada pela Alfa 1.3 abaixo. | Android indisponível; nova comparação ficha/FluIA na main posterior não alcançada pela sonda; aprovação humana. |
| #76 — Alfa 1.3.4 | Provas iOS de veículo/autonomia/origem, nova bateria manual, distâncias, mapa/ficha/FluIA e câmera recuperadas e publicadas. | Android indisponível; comparação atual de ficha/FluIA pendente após alteração posterior da main; revisão humana. |

Nenhuma destas Issues foi fechada automaticamente. #11, #14 e #17 permanecem abertas enquanto existirem pendências. Documentação pronta para revisão não equivale à aprovação da responsável; simulador iOS não comprova Android.

## Ambiente e impedimento Android

GitHub CLI autenticado, clone privado independente, dependências do lockfile instaladas com `npm ci --offline --ignore-scripts --no-audit --no-fund` (941 pacotes). Nenhuma ferramenta adicional instalada, nenhuma dependência/lockfile/workflow alterados.

Xcode 27.1 (27A9275), iPhone 18 Pro Max, iOS Simulator 27.0, Expo Go 54.0.7. [Inventário local](validacao-alfa-20261016/ambiente.log). Java Zulu 17 disponível, mas nenhum SDK Android, `adb`, emulador, AVD ou Android Studio foi encontrado nos locais usuais. Não houve execução Android, instalação de ferramentas pesadas ou contratação de serviços. A conclusão de #75/#76 exige uma rodada Android em ambiente já preparado ou autorização separada para prepará-lo.

## Evidências anteriores reutilizadas

- **Alfa 1.2:** código corrigido `5cf0fd0`, mapa/filtros/FluIA e preservação da câmera durante fechamento no [registro dirigido](auditoria-1.2.md). Ficha/UX corrigida em [ux-ficha](validacao-1.2/ux-ficha/), 1 XCTest aprovado, 0 falhas: aberta → fechada após 22h, indicador cinza, recarga não confirmada, espera indisponível; autonomia distingue chegada de possibilidade de recarga. Asserções, fontes e restauração do relógio estão nos logs publicados.
- **Alfa 1.3, `d14b85b`:** [configuração e persistência](validacao-1.3/ios-config-d14b85b/RELATORIO.md): veículo Flui iOS NEXT, autonomia 300 km, origem Vila Mariana persistiram após encerrar/reabrir; bateria manual preservada. FIAP ≈2,1 km e Vila Mariana ≈4,9 km até Higienópolis.
- **Complemento iOS de `d14b85b`:** [resumo e provas](validacao-1.3/ios-final-d14b85b/RESUMO.md): nova bateria 45% → 40%, origem manual/data mantidas após reiniciar, alcance ≈120 km; mapa/ficha/FluIA concordaram em ≈4,9 km e chegada 38%; centralização e enquadramento após 35 s com deslocamento observado zero.
- Falhas das sondas anteriores continuam nos logs: duas tentativas com localizador de bateria incorreto e uma preparação de arraste sob o painel. O complemento posterior aprovou os cenários; os logs agregados históricos não foram reclassificados como aprovados.

Os relatórios copiados são históricos: datas, status de PR e limitações descrevem aquela execução. Não foram usados como se fossem testes novos da versão modificada. Bundles `.xcresult` integrais permanecem no `output/` local indicado pelos arquivos de proveniência; capturas, fontes e logs pertinentes foram publicados no Git.

Comparação com `45c65fa`: regras de preferências/armazenamento, distâncias, horários, disponibilidade, filtros e controle de tempo da Alfa não mudaram desde `d14b85b`. A main posterior mudou a ficha e a integração de rotas. Isso motivou a regressão dirigida atual, sem repetir integralmente a auditoria.

## Defeitos reproduzidos e correções pontuais

1. **Main não passava TypeScript nem os testes de apresentação:** `stationPresentation` deixou de exportar `getStationRouteUrl`, ainda importada pelo teste. [TypeScript antes](validacao-alfa-20261016/typecheck-antes.log) e [teste antes](validacao-alfa-20261016/testes-antes.log). Restaurada a função compartilhada e reutilizada pelo hook existente, preservando o destino, a origem opcional do Google Maps e o comportamento Waze. Acrescentadas asserções para origem presente/ausente. Sem mudança de cálculos ou de regras de elegibilidade.
2. **Expo não iniciava:** opções do `expo-location` apareciam como plugin independente em `app.config.js`. [Erro antes](validacao-alfa-20261016/expo-antes.log). Corrigida somente a estrutura para `[nome, opções]`, preservando a permissão já definida. O Metro passou a iniciar e entregou o bundle iOS; exportação web também passou.

## Verificações desta branch

- `npm run check`: TypeScript e lint aprovados, **57/57 testes**, zero falhas. [Log](validacao-alfa-20261016/check.log). Nova execução justificada pelos dois defeitos atuais, não por repetição das provas anteriores.
- Expo e exportação web: [log](validacao-alfa-20261016/exportacao-web.log); nenhuma nova validação funcional web integral atribuída a esta execução.
- Código de produção executado identificado em [hashes](validacao-alfa-20261016/codigo-validado.sha256), sobre a base `45c65fa`.

## Conferência iOS dirigida desta branch — resultado parcial

As duas execuções foram encerradas com **1 teste e 1 falha cada**, saída 65. Não há aprovação da suíte atual. [Primeira execução](validacao-alfa-20261016/xctest-primeira.log) · [segunda execução](validacao-alfa-20261016/xctest-dirigido.log) · [sonda primeira](validacao-alfa-20261016/SondaPrimeira.swift) · [sonda dirigida](validacao-alfa-20261016/SondaDirigida.swift).

| Cenário efetivamente alcançado | Resultado observado |
| --- | --- |
| Origem Paulista e bateria | Paulista salva e identificada novamente após `terminate/launch`. Bateria manteve 40%, origem manual, data 16/10 14:06 e alcance ≈120 km. Asserções cumpridas antes da falha posterior. |
| Centralização | Com a preparação que minimiza o painel, frame da origem `(184; 534; 72; 72)` e mapa `(0; 224; 440; 698)`: centros `(220; 570)` e `(220; 573)`, diferença vertical 3 pontos, tolerância 30. Comprovação por árvore nativa/asserções; o painel pode cobrir a origem na captura subsequente. [Captura](validacao-alfa-20261016/10-paulista-centralizada.png). Não é nova prova da estabilidade durante 35 s, já documentada em `d14b85b`. |
| Distância atualizada | Higienópolis desde Paulista exibiu ≈1,7 km em linha reta, contra ≈4,9 km desde Vila Mariana nos registros anteriores. [Captura inicial após troca](validacao-alfa-20261016/primeira-centralizacao.png). |
| Raio de 500 m | Seleção confirmada, texto “Em linha reta desde Paulista” e botão “Ver 1 ponto no mapa”. Mapa reteve somente o marcador Flui Express MASP. Nenhuma opção utilizável no painel, coerente com o estado ocupado desse ponto. [Filtro](validacao-alfa-20261016/11-paulista-raio-500m.png) · [mapa](validacao-alfa-20261016/12-paulista-mapa-filtrado.png). |
| Persistência do filtro completo | A sonda esperou indevidamente que “500 m, selecionado” reaparecesse ao reabrir Busca e filtros. A árvore mostrou “500 m” sem seleção; `SearchFiltersScreen` inicializa esse formulário com estado local (`useState(initialFilters)`), não preferências persistentes. Isso não comprova regressão de veículo/bateria/origem nem fundamenta implementar persistência nova. |
| Comparação atual mapa/ficha/FluIA | **Não executada:** estava depois dessa asserção; não foi aberta a ficha atual pela sonda. A prova completa disponível continua sendo a histórica de `d14b85b`. |

A primeira falha comparava a origem com o centro do mapa inteiro quando o aplicativo usa deslocamento para o painel visível (diferença de 164,33 pontos). A preparação foi ajustada para minimizar o painel, reaproveitando o procedimento anterior. A segunda falha veio da expectativa de persistência do formulário transitório. Nenhum desses resultados demonstra um defeito funcional reproduzido no aplicativo. Não foi iniciada uma terceira tentativa nem corrigido código por causa dessas expectativas da sonda.

Capturas inspecionadas visualmente, [manifest com timestamps](validacao-alfa-20261016/capturas-manifest.json). Bundles completos preservados em `output/conclusao-pendencias-alfa-20261016/Resultado-primeira.xcresult` e `Resultado-dirigido.xcresult`, fora do checkout. O relógio real não foi alterado. Metro encerrado e simulador desligado após a coleta. Estado demonstrativo deixado: Flui iOS NEXT, 300 km, Paulista, bateria manual 40% com data original. Nenhuma preferência persistente foi sobrescrita diretamente por scripts.

## Limitações e decisão humana

Expo Go/simulador, tema escuro, dados demonstrativos. Não comprovados Android, dispositivo físico, distribuição/credenciais, VoiceOver, todas as escalas de fonte/temas ou abertura real dos aplicativos externos de rota. Regras de manutenção, indisponibilidade, horário desconhecido e reserva têm testes automatizados, mas não capturas nativas novas de todas as combinações.

A PR proposta pode seguir para revisão das correções pontuais e da documentação. Não se recomenda encerrar a validação móvel: faltam Android e a regressão atual de ficha/FluIA, interrompida conforme os limites. A Alfa 1.1 depende da aprovação da isalvesb; Alfa 1.2/1.3 continuam com pendência Android e aprovação humana. Não declarar as três tarefas principais integralmente aprovadas nem realizar merge automaticamente.
