# Flui NEXT 2026 — Auditoria técnica da tarefa 1.2

Atualizado em 16/10/2026. Escopo: versão Alfa, tarefa 1.2. A aprovação do backlog permanece pendente de revisão humana.

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

Consulta de 15/10 de `npm audit --omit=dev`: **49 pacotes sinalizados**, sendo 1 baixo, 15 moderados, 32 altos e 1 crítico. Não são 49 vulnerabilidades distintas nem prova de exploração no aplicativo. A consulta reproduziu as contagens do benchmarking; não foi repetida na validação complementar, pois as dependências não mudaram.

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
| Navegador na primeira execução | Bloqueado pelo transporte da automação; validação posterior descrita abaixo |

Os testes exercitam as cinco intenções, reserva antes do arredondamento, principal/alternativa, status adversos, conectores incompatíveis/ocupados, comodidades ausentes, dados inválidos, horários noturnos, domingo, limites de fechamento, precedência do calendário, fuso inválido e origem da bateria após serialização. A concordância de horários foi exercitada para as **12 estações reais do catálogo em três instantes**, usando as mesmas funções importadas pelas telas.

Na rodada anterior de navegador foram efetivamente verificados: recusa da FluIA com bateria em 0% nas intenções de bateria baixa e carga rápida; recusa com estação fechada ou indisponível como única candidata; edição manual para 35% com origem/data preservadas após reload; concordância inicial entre filtro e ficha; avisos demonstrativos. Esses cenários não foram repetidos nesta rodada. Testes de serialização, por si só, não comprovam persistência pela interface.

## Validação complementar — 16/10/2026

Revisão da PR e execução na branch `alfa/auditoria-tecnica-1.2`, a partir de `8eb2faf`. Não houve mudança de dependências, catálogo, arquitetura ou outras tarefas do backlog.

| Pendência | Resultado e evidência prática |
| --- | --- |
| Marcadores web | Defeito reproduzido: `icon` era ignorado e os botões mediam 0 × 0. Agora renderizam a imagem e têm área de 44 × 44. Cliques nos próprios marcadores abriram Higienópolis Prime Charge (`station-01`, aberto), Plug & Café Consolação (`station-03`, fechado) e Garagem Liberdade Solar (`station-10`, indisponível), com o estado correspondente na ficha. Não foi usada navegação direta para substituir esses cliques. [Mapa corrigido](validacao-1.2/marcadores-web.png). |
| Horários entre mapa, filtro e ficha | A ficha e o filtro já compartilhavam as regras, mas o texto/cor do mapa e a cor do indicador da ficha ainda dependiam do status estático. Agora os cartões, descrições e cores consideram o mesmo horário; fechado deixa de aparecer em verde. A reavaliação a cada 30 s foi observada na interface. |
| Transição automática aberta → fechada | No navegador, relógio de teste em sexta-feira, 16/10, São Paulo: Plug & Café aberto às 19h58, filtro “Aberto agora” ativo e FluIA com sugestão. Aproximado o relógio para 19h59min50s, o tempo passou normalmente: após 20h e o próximo ciclo do aplicativo, marcador/cartão sumiram do filtro e a FluIA exibiu “Nenhuma opção viável confirmada”, sem reload ou navegação. Em outra aba, a mesma ficha mudou de “Aberto agora” para “Fechado agora” e deixou de confirmar recarga, também automaticamente. [Filtro e FluIA](validacao-1.2/horario-filtro-fluia.png) · [Ficha](validacao-1.2/horario-ficha.png). |
| Textos e indicadores | “Melhor escolha agora” passou a “Sugestão demonstrativa”. Foram removidos os superlativos dos cartões, atribuídos pela posição da lista: o primeiro não era sequer o mais próximo. Agora são “Opções demonstrativas”. Acessibilidade da bateria inclui origem e estimativa; espera e horário sugerido identificam a simulação. Indisponibilidade não sugere uma consulta real frustrada. Os avisos, o novo selo da FluIA e os estados das fichas foram observados no navegador. |
| Mapa nativo iOS | Aplicativo executado no Expo Go 54.0.7, simulador iPhone 18 Pro Max / iOS 27. A tela nativa exibiu mapa geográfico, marcadores, painel e bateria de origem não registrada com “Sem telemetria”. [Captura nativa](validacao-1.2/mapa-ios.png). Isso comprova execução/renderização nesse ambiente, sem comprovar interações ou build de distribuição. |
| Filtros, fichas e FluIA nativos | Estado anterior, superado pela rodada interativa ao final deste relatório: **pendentes naquela execução.** O simulador funcionou sem janela controlável disponível. Uma tentativa posterior de navegação nativa e uma de captura excederam o tempo de resposta; após essas duas falhas a abordagem foi interrompida. Não houve clique nativo verificado. Ambos os simuladores iniciados foram desligados. Android e dispositivo físico não foram executados. |

A transição de horário foi um teste prático da interface **com relógio simulado**, não observação de mudança real no estabelecimento. O servidor auxiliar `scripts/validar-horarios-web.cjs` serve somente em `127.0.0.1` e acrescenta o painel de relógio apenas com `?clock=1`. Não altera relógio do sistema, catálogo ou código empacotado do aplicativo. Para reproduzir tecnicamente: exportar com `EXPO_OFFLINE=1 CI=1 npx expo export --platform web --output-dir /tmp/flui-validacao-web`, servir com `node scripts/validar-horarios-web.cjs /tmp/flui-validacao-web 8768` e abrir `/map?clock=1` e `/point-details?stationId=station-03&clock=1`. Os botões simulam 19h58 e aproximam o fechamento; aguardar o ciclo real de 30 s da tela. A captura de filtro/FluIA precede apenas ajustes finais de redação. A ficha foi novamente observada após a correção visual: verde enquanto aberta e cinza após fechar, sem recarregar.

Verificações das partes alteradas: TypeScript e lint aprovados; teste focado de apresentação **4/4 aprovado**; sintaxe e lint do servidor auxiliar aprovados; exportação web final com **11 rotas**; `git diff --check` sem problemas. A suíte de 33 testes e o Expo Doctor já comprovados não foram repetidos localmente. A execução automática da PR verifica novamente os requisitos ao receber commits. Exportação, testes e captura de mapa não substituem validação interativa nativa.

## Complemento — automação nativa e início de rota

- Investigação atual: Java 17.0.18 disponível e `xcodebuild -version` respondeu Xcode 27.1. Maestro, idb, Appium, adb e emulador Android não foram encontrados nos caminhos usuais; o inventário de interface não expôs um Simulator controlável. Nenhuma das tentativas anteriores de navegação/captura por `simctl` foi repetida, nem foi iniciado outro simulador.
- Alternativa mais simples identificada: [Maestro CLI local](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli), usando o Expo Go já disponível e [abertura por link de desenvolvimento](https://docs.maestro.dev/get-started/supported-platform/react-native). Isso evita backend, build em nuvem e mudanças nas dependências do Flui. A adequação técnica é documental; não é prova de funcionamento neste ambiente.
- A distribuição oficial `cli-2.11.0` contém um ZIP de 314.886.578 bytes. A primeira transferência expirou após cerca de 45 s, com 121.633.302 bytes; a única retomada expirou após cerca de 120 s, deixando 215.773.620 bytes no total. Após as duas tentativas, a obtenção foi interrompida. O CLI não chegou a executar e **nenhuma interação nativa adicional foi validada**. Sem instalação global, mudança de configuração, serviço contratado ou workflow nativo.
- Opções consideradas naquela execução, agora superadas pelo Device Hub: ferramenta portátil ou outro Mac controlável pelo agente. Não foi ativado runner em nuvem: em [repositórios privados o GitHub Actions pode cobrar além da franquia](https://docs.github.com/en/actions/concepts/billing-and-usage), cuja disponibilidade não foi comprovada.
- Defeito confirmado em “Iniciar rota”: o seletor anterior não informava fechamento, indisponibilidade ou ausência de carregadores. Além disso, `Alert.alert` é vazio na versão instalada de React Native Web, portanto o seletor não funcionava no navegador.
- Correção pontual: confirmação compartilhada por web/nativo com estado de funcionamento, aviso de recarga não confirmada quando necessário e ressalva demonstrativa; mantém Google Maps, Waze e Cancelar. A navegação continua permitida após leitura do aviso. Erros de abertura são apresentados no próprio diálogo, inclusive na web. A construção das URLs agora usa o helper já coberto pelos testes, em vez da cópia local.
- Validação nova restrita às partes afetadas: TypeScript e lint; **6/6 testes de apresentação**, incluindo fechamento exato, indisponibilidade, manutenção, ocupação, horário desconhecido e ausência de conectores; exportação web de **11 rotas**. Interação prática do novo diálogo no navegador registrada nas capturas abaixo. Isso não comprova sua execução nativa nem abertura dos aplicativos externos. O último CI anterior aprovado permanece o de `abe0123`; o complemento usa `[skip ci]` para não disparar consumo de Actions sob a restrição de não gerar custos.

Evidências do aviso: [estação fechada](validacao-1.2/rota-estacao-fechada.png) · [estação indisponível](validacao-1.2/rota-estacao-indisponivel.png). Os resultados web anteriores foram preservados sem repetição dos demais cenários.

## Pendências e Git

- Revalidar no simulador a correção do reposicionamento periódico descrita na última seção. As interações antes pendentes foram executadas pelo Device Hub; os limites restantes estão discriminados na rodada nativa.
- Verificar build nativo de distribuição e Android; a execução em Expo Go não comprova configuração de mapas/credenciais da versão publicada.
- Tratar alertas de dependências em atualização específica, com nova validação de Expo e builds; não há evidência para declarar o aplicativo livre de vulnerabilidades.
- A tela principal continua extensa e há duplicações de apresentação não relacionadas às correções. Extrações maiores, validação integral do armazenamento e planejamento por trajetos ficam como recomendações futuras.
- Não foram implementados backend, IA generativa, serviços externos, configuração dos dados de demonstração da tarefa 1.3 ou funcionalidades Beta/Gama.
- Implementação e testes: `4e45e4660624da6d25b544ea5b215529f40e1f15` — `corrige recomendações, horários e origem dos dados na versão Alfa`.
- Registro inicial da auditoria: `8eb2faf` — `documenta auditoria técnica e limitações da tarefa 1.2`.
- Correções da validação final: `75b99e1` — `corrige marcadores e mensagens demonstrativas na validação final`. O commit de documentação que contém esta atualização acrescenta as capturas verificáveis.
- Indicador da ficha: `b458609` — `alinha indicador da ficha ao horário de funcionamento`.
- Trabalho isolado na branch `alfa/auditoria-tecnica-1.2`, para revisão por PR em rascunho. `main` não foi alterada; tarefa não marcada como aprovada.

Principais arquivos: `src/components/MapSurface/index.web.tsx`, `src/features/assistant/{fluiAssistant.ts,FluiAssistantSheet.tsx}`, `src/utils/{stationHours.ts,stationAvailability.ts,filtrarEstacoes.ts,batteryData.ts}`, `src/features/stations/{PointDetailsScreen.tsx,stationPresentation.ts}`, `src/features/map/HomeMapScreen.tsx`, `src/hooks/useCurrentTime.ts`, contexto/tipos/armazenamento de preferências, `package.json`, testes de domínio e `scripts/validar-horarios-web.cjs`.

## Validação nativa interativa — 16/10/2026

Código executado: `98371f5b4a46fa59e9f1d43f4bfd30e770f047fb`, branch da PR #1. Expo Go 54.0.7, iPhone 18 Pro Max / iOS 27, controlado pelo Device Hub do Xcode. Não houve novo download do Maestro, execução de CI ou alteração do código do aplicativo nesta rodada.

**Defeito confirmado e registrado antes de propor correção:** o mapa perde o zoom escolhido pelo usuário no ciclo de atualização de horários. Sem busca/filtros, após tocar em diminuir zoom ficaram visíveis cinco marcadores de estações; sem outra interação, no ciclo seguinte voltaram a três, no enquadramento inicial. O registro de acessibilidade contém ambos os estados. A revisão de `HomeMapScreen.tsx` confirma a cadeia: `now` recria `visibleStations` a cada 30 s, que recria `mapRegion` e dispara `animateToRegion`. O aplicativo não foi alterado para corrigir esse comportamento nesta rodada.

Proposta pontual, ainda não implementada: evitar nova animação quando apenas `now` muda, preservando a câmera se os critérios e a estação de referência continuam iguais. Deve manter a atualização dos estados e dos resultados do filtro. A tarefa não pode ser declarada aprovada com essa pendência.

| Cenário nativo | Resultado prático |
| --- | --- |
| Mapa e marcadores | Mapa geográfico e controles carregaram. Toques nos marcadores de Higienópolis Prime Charge (aberto 24h), Plug & Café (aberto antes da transição) e Garagem Liberdade Solar (indisponível) abriram as fichas corretas; Garagem Verde Brigadeiro abriu a ficha em manutenção. O painel foi minimizado para expor os marcadores. Há defeito de preservação de zoom descrito acima. |
| Busca e filtros | Busca por nome isolou estações; filtro rápido “Aberto agora” exibiu estado selecionado e excluiu Plug & Café fechado. A tela completa de filtros abriu e aplicou a busca; não se declara que todos os controles dessa tela foram exercitados. |
| FluIA | Com 45% recomendou estação utilizável com estimativa e ressalvas. Edição manual para 0% resultou em “Nenhuma opção viável confirmada”; bateria foi reposta para 45% pela interface. |
| Atualização de horários | Relógio da sessão em sexta-feira, 19h58 de São Paulo: Plug & Café elegível. Após aproximar 19h59min50s e aguardar o ciclo real de 30s, filtro removeu marcador/cartão, FluIA deixou de recomendar e, em execução separada na ficha, o estado mudou para “Fechado agora” e “Recarga não confirmada”. Sem reload ou navegação durante cada transição. |
| Avisos de rota | Diálogo nativo conferido para estação fechada, indisponível e em manutenção: estado correto, recarga não confirmada, ressalva demonstrativa, Google Maps/Waze/Cancelar. Cancelamento retornou à ficha. Não foram abertos aplicativos externos. |
| Textos e indicadores | “Sugestão demonstrativa”, “Opções demonstrativas”, bateria “Informado manualmente” com data, contagens “no exemplo” e ressalvas de ausência de disponibilidade em tempo real observados na árvore de acessibilidade nativa. Não se atribui precisão de telemetria a esses valores. |

**Evidências:** [ações e estados nativos](validacao-1.2/ios-interacoes.txt) e [instrumentação/restauração do relógio](validacao-1.2/ios-relogio.txt). São transcrições da interface real, não saídas dos testes unitários. A exportação de captura pelo Device Hub não forneceu imagem útil; não há nova captura visual integral nesta rodada. A imagem antiga do mapa continua identificada como evidência anterior de renderização.

O auxiliar `scripts/validar-relogio-ios.cjs` usa o protocolo de depuração Hermes já exposto pelo Metro local em `127.0.0.1:8084` e o pacote `ws` já instalado. Não participa do bundle nem modifica catálogo, sistema operacional, temporizadores ou estado React diretamente: muda somente `Date` no contexto do Flui; a interface reage pelo intervalo normal. Uso técnico: `node scripts/validar-relogio-ios.cjs 2026-10-16T22:58:00Z`, depois `2026-10-16T22:59:50Z`; `restore` restaura a data real. Restauração executada e registrada. Sintaxe e lint do auxiliar aprovados; verificações automatizadas e exportação já comprovadas não foram repetidas, pois o código do aplicativo permanece em `98371f5`.

**Limites restantes:** não foi validado build de distribuição, Android, dispositivo físico, abertura efetiva de Google Maps/Waze, todos os filtros e detalhes visuais de cores/recortes. Persistência após reload permanece comprovada na web, sem repetição nativa nesta rodada. Expo Go comprova execução interativa nesse ambiente, não a configuração de credenciais do aplicativo publicado. Nenhum custo, backend ou infraestrutura de automação foi criado. PR #1 continua em rascunho e sem merge; aprovação da tarefa permanece com a equipe.

Ambiente encerrado após os testes: relógio real restaurado, servidor Metro local interrompido, simulador desligado pelo Device Hub e captura de teclado devolvida ao estado desligado. A configuração de teclado virtual do simulador foi utilizada no teste e não foi conferida novamente após desligar.

## Correção do enquadramento — rodada final de 16/10/2026

Correção restrita a `src/features/map/HomeMapScreen.tsx`: o efeito que anima a câmera compara os critérios de foco (busca, filtros e localização) com a última execução. Quando somente o relógio/resultados mudam, não anima a câmera nem sobrescreve `currentMapRegionRef`. A região efetivamente escolhida continua sendo atualizada por `onRegionChangeComplete`; os botões de zoom/centralização mantêm seus comandos diretos. Mudanças de busca/filtros/localização continuam podendo reposicionar. Nenhuma regra ou temporizador de horário, filtragem, marcador, ficha ou FluIA foi removido ou alterado. Não houve atualização de dependências nem refatoração de arquitetura.

- `npm run check`: TypeScript e lint aprovados; **35/35 testes aprovados**, incluindo regras de horários, filtros, FluIA e apresentação. Não existe nesta suíte uma asserção prática da câmera nativa; esses resultados não comprovam preservação do enquadramento na interface.
- `git diff --check`: aprovado.
- CI: solicitado disparo normal no commit desta correção, sem `[skip ci]`, conforme a instrução mais recente. O resultado vinculado ao SHA final é informado nos Checks e na descrição da PR; a CI histórica de `abe0123` não deve ser usada como evidência desta alteração.
- **Revalidação iOS bloqueada nesta sessão:** simulador iniciado pelo Device Hub; a captura de inspeção mostrou a tela inicial do iOS, mas a árvore de acessibilidade expôs somente controles do Mac. Os acessos por Home e App Switcher não disponibilizaram os controles dos aplicativos iOS. A abordagem foi interrompida após essa verificação, sem repetir os downloads/falhas anteriores de Maestro ou simctl. [Registro do impedimento e encerramento](validacao-1.2/ios-correcao-zoom.txt).
- **Pendentes no código corrigido:** observar preservação do zoom e deslocamento por dois ciclos, verificar fechamento automático junto à preservação da câmera, e conferir reposicionamento intencional por busca/filtro/centralização. A rodada nativa anterior comprova os fluxos no código anterior, não a correção atual. Alternativa viável: nova sessão do Device Hub quando o acesso aos controles iOS estiver restabelecido, operada pelo agente e sem instalação adicional; não foi solicitado teste manual ao usuário.
- O simulador foi desligado, janela/captura de teclado restauradas e Metro interrompido ao concluir a tentativa. Nenhum relógio de teste foi aplicado nesta rodada. `main` e estado inicial preservados; PR permanece em rascunho, sem merge; tarefa 1.2 pendente de aprovação.
