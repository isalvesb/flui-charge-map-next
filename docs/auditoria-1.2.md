# Flui NEXT 2026 — Auditoria técnica da tarefa 1.2

Data: 15/10/2026. Escopo: versão Alfa, tarefa 1.2. A aprovação do backlog permanece pendente de revisão humana.

## Estado inicial e recuperação

- Repositório de trabalho privado: `isalvesb/flui-charge-map-next`; acesso autenticado de leitura e escrita confirmado.
- Estado inicial: `604ddd2cec5d0deb5841c96fcfe2d6fcb3880ee8`, preservado na branch remota `alfa/estado-inicial` e na tag local `alfa-inicial-1.2`.
- Original: `guicunhasou/flui`, commit `9708084c7bd74c03f016b7cb3f680a2c063ddac9`, sem modificações.
- Comparação completa das árvores Git: **135 arquivos idênticos**, inclusive conteúdo binário, dependências, lockfile, configurações e modos. Árvore comum: `56bc42df07d1f69c63af1348704b917579e993b6`; nenhuma listagem truncada.
- O commit inicial é um merge que inclui o commit original como segundo pai; a origem e o histórico original estão preservados. A cópia local passou em `git fsck --no-reflogs`.
- Recuperação sem sobrescrever trabalho: criar uma nova branch a partir de `604ddd2cec5d0deb5841c96fcfe2d6fcb3880ee8`, ou conferir `alfa/estado-inicial` em outro checkout.

## Diagnóstico e correções

| Problema confirmado | Correção |
| --- | --- |
| Alcance validado somente para bateria baixa; arredondamento admitia chegada inferior à reserva | Todas as intenções e a alternativa exigem reserva exata de pelo menos 5%, antes do arredondamento. A reserva já existia na intenção de bateria baixa. Entradas energéticas inválidas são rejeitadas. |
| Postos indisponíveis, ocupados ou sem carregador utilizável podiam vencer pela pontuação | Restrições obrigatórias antes da ordenação: status disponível, horário aberto, contagem consistente e conector livre com potência positiva. |
| Banheiro/café eram afirmados sem existir; conforto era prometido sem comodidades | Banheiro e café exigem ambos; conforto exige comodidade relacionada. Sem candidato, a tela informa que não há opção viável confirmada. |
| Potência total do posto confundida com a dos conectores utilizáveis | FluIA calcula a potência dos conectores elegíveis; a ficha não sugere parada rápida quando só o conector lento está livre. |
| Assistente ignorava busca e filtros ativos | Recebe o mesmo subconjunto filtrado do mapa. |
| Filtro, ficha e testes usavam regras diferentes de horário | Regras compartilhadas em `stationHours.ts`, consumidas pelo filtro, ficha e FluIA. Calendário estruturado tem precedência; o texto reconhecido do catálogo atual usa o fuso de São Paulo. Formatos desconhecidos não confirmam abertura. |
| Horários noturnos usavam o dia errado após meia-noite e aceitavam horas inválidas | Período pertence ao dia da abertura, inclusive na virada da semana; validação de horas e fechamento exclusivo. Filtro 24h segue a mesma fonte. |
| Bateria simulada aparecia como atualizada pelo veículo há um minuto | Origem demonstrativa/manual/desconhecida e data real da edição são persistidas; dados antigos sem origem são identificados como tal. Removidas as alegações de telemetria. |
| `npm run check` falhava por IPC da CLI `tsx` neste ambiente | O script usa `node --import tsx --test tests/*.test.ts`, com o mesmo executor de testes e sem nova dependência. Removida uma variável não utilizada. |

Compatibilidade: o motor verifica tipos de conector quando explicitamente fornecidos. O perfil atual não contém os conectores do veículo; a interface informa que a compatibilidade não está confirmada. Preferências de conector não foram tratadas como especificação técnica do carro.

O mapa e a ficha reavaliam horários a cada 30 segundos e ao retomar o aplicativo. Distâncias, autonomia, disponibilidade e tempos continuam demonstrativos ou estimados, com essa limitação comunicada. O catálogo de demonstração não foi alterado.

## Arquitetura e dependências

Preservados Expo Router, telas por funcionalidade, armazenamento local, temas e componentes específicos por plataforma. Expo 54.0.37, React Native 0.81.5 e React 19.1.0 foram mantidos; `expo-doctor` aprovou 18/18 verificações. A [matriz oficial do Expo](https://docs.expo.dev/versions/v54.0.0/) é compatível com essa família de versões.

Alertas atuais de `npm audit --omit=dev`: **49 pacotes sinalizados**, sendo 1 baixo, 15 moderados, 32 altos e 1 crítico. Não são 49 vulnerabilidades distintas nem prova de exploração no aplicativo. A consulta atual reproduziu as contagens do benchmarking.

- Crítico: `react-native → react-devtools-core → shell-quote@1.8.3`. O [GHSA-w7jw-789q-3m8p](https://github.com/advisories/GHSA-w7jw-789q-3m8p) depende de objetos `.op` maliciosos e execução do resultado em shell. Não foi identificada essa cadeia a partir das entradas do Flui; o risco das ferramentas de desenvolvimento permanece.
- `node-forge@1.4.0`: alcançado pela CLI/certificados Expo; o [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv) envolve verificação de assinaturas RSA. Não foi demonstrada exploração pela jornada do aplicativo.
- `@xmldom/xmldom` está nas ferramentas plist/configuração; `postcss`, no Metro. Os alertas merecem atualização controlada das ferramentas, sem equipará-los automaticamente a falhas acessíveis na interface.
- Não foram alteradas versões ou o lockfile. Não foi executado `npm audit fix --force`. A sugestão automática do audit inclui mudanças principais/downgrade de Expo e não foi aplicada.

Não reproduzidos: arquivos essenciais ausentes, divergência da cópia, erros de TypeScript, incompatibilidade detectada pelo Expo Doctor ou falha na exportação web. Os demais problemas de domínio do benchmarking foram confirmados; não foi detectada integração veicular real.

## Validação e limites da evidência

Ambiente local: macOS, Node 24.13.1 e npm 11.8.0. Instalação reproduzida pelo lock com `npm ci --offline --ignore-scripts`, usando o cache disponível.

| Verificação | Resultado |
| --- | --- |
| Suíte original, antes das alterações | 13/13 aprovados pelo carregador direto do tsx; comando agregado inicial bloqueado por IPC |
| Novos testes adversos, antes da correção | 7 testes falharam, reproduzindo os defeitos |
| `npm run check` final | TypeScript e lint sem erros ou advertências; **33/33 testes aprovados** |
| `npx expo-doctor` | **18/18 aprovados** |
| `EXPO_OFFLINE=1 CI=1 npx expo export --platform web` | Sucesso; **11 rotas estáticas**, incluindo mapa, assistente embutido e ficha |
| `git diff --check` | Aprovado |
| `npm audit --omit=dev --json` | Consulta concluída; código 1 por alertas, sem remediação automática |
| Navegador | Não validado: falha de transporte da automação impediu a inspeção funcional |

Os testes exercitam as cinco intenções, reserva antes do arredondamento, principal/alternativa, status adversos, conectores incompatíveis/ocupados, comodidades ausentes, dados inválidos, horários noturnos, domingo, limites de fechamento, precedência do calendário, fuso inválido e origem da bateria após serialização. A concordância de horários foi exercitada para as **12 estações reais do catálogo em três instantes**, usando as mesmas funções importadas pelas telas.

Os testes de bateria comprovam normalização e conservação dos metadados após serialização; **não comprovam edição pela interface seguida de reload real**. Não foram validados dispositivos físicos, emuladores, builds nativos, mapas externos, interação no navegador ou layout após os novos textos. Exportação e testes de domínio não substituem essas verificações.

## Pendências e Git

- Conferir no navegador/dispositivo: filtro aberto agora versus ficha, ausência de opção com bateria insuficiente, edição manual seguida de reload, mensagens e encaixe dos textos.
- Tratar alertas de dependências em atualização específica, com nova validação de Expo e builds; não há evidência para declarar o aplicativo livre de vulnerabilidades.
- A tela principal continua extensa e há duplicações de apresentação não relacionadas às correções. Extrações maiores, validação integral do armazenamento e planejamento por trajetos ficam como recomendações futuras.
- Não foram implementados backend, IA generativa, serviços externos, configuração dos dados de demonstração da tarefa 1.3 ou funcionalidades Beta/Gama.
- Implementação e testes: `4e45e4660624da6d25b544ea5b215529f40e1f15` — `corrige recomendações, horários e origem dos dados na versão Alfa`.
- Trabalho isolado na branch `alfa/auditoria-tecnica-1.2`, para revisão por PR em rascunho. `main` não foi alterada; tarefa não marcada como aprovada.

Principais arquivos: `src/features/assistant/{fluiAssistant.ts,FluiAssistantSheet.tsx}`, `src/utils/{stationHours.ts,stationAvailability.ts,filtrarEstacoes.ts,batteryData.ts}`, `src/features/stations/{PointDetailsScreen.tsx,stationPresentation.ts}`, `src/features/map/HomeMapScreen.tsx`, `src/hooks/useCurrentTime.ts`, contexto/tipos/armazenamento de preferências, `package.json` e testes de domínio.
