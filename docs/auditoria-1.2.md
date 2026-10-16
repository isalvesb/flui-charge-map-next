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

- Revalidação dirigida do enquadramento e do fechamento no código corrigido: resultados e limites na última seção deste relatório. A tarefa 1.2 continua pendente de aprovação humana.
- Verificar build nativo de distribuição; a execução em Expo Go não comprova configuração de mapas/credenciais da versão publicada. A validação Android ficará com outra integrante, conforme orientação da equipe.
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

## Alternativa XCTest — validação parcial de 16/10/2026

Código do aplicativo: `5cf0fd0877157b8ec74c5446df60bfbf9a61b6aa`, sem alterações nesta rodada. Xcode 27.1, SDK iOS Simulator 27.1, runtime iOS 27.0 e Expo Go 54.0.7 no iPhone 18 Pro Max já existente. Uma sonda XCTest/XCUIAutomation isolada, compilada com os recursos locais do Xcode, conseguiu abrir o Flui, consultar a interface e gerar [captura nativa útil](validacao-1.2/xctest/acesso-nativo.png): **1 teste de acesso aprovado**, em 40,849 s. Não foram instaladas ferramentas de terceiros nem criados serviços/backend ou workflows.

| Prioridade | Evidência e limite |
| --- | --- |
| Preservar zoom e enquadramento | **Observado na interface nativa corrigida.** O XCTest tocou em diminuir zoom e verificou redução da distância entre marcadores, arrastou o mapa e verificou deslocamento superior a 30 pontos. Sem novas interações, após esperas de 35 s e mais 35 s, os centros de FIAP e MASP permaneceram exatamente iguais em ambas as leituras. Foram quatro comparações de posição, com tolerância de 2 pontos e deslocamento observado de 0. Nenhum relógio artificial foi aplicado nessa etapa; os ciclos de horário continuaram reais. |
| Reposicionamento intencional | **Centralização confirmada:** após os 70 s, o botão voltou a deslocar a câmera mais de 30 pontos. Busca e alteração de filtro como comandos de reposicionamento **não concluídos** nesta rodada. |
| Passagem de horário em mapa/filtro/ficha/FluIA | **Pendente no código corrigido.** A automação não encontrou os marcadores após preencher a busca por Higienópolis e depois Plug & Café; as etapas de aproximação das 20h não foram atingidas. O controlador aplicou somente 19h50 nos cenários de preparação, sem chegar ao fechamento. Não há evidência suficiente para atribuir a falha ao preenchimento automatizado, à consulta dos elementos ou ao aplicativo. Não foi implementada correção especulativa. |

Coordenadas de tela preservadas em ambas as leituras: FIAP `(414,33334; 682,66666)` e MASP `(356,33334; 597,33334)`. [Log integral dos cenários](validacao-1.2/xctest/cenarios.log) · [fonte exata da sonda](validacao-1.2/xctest/FluiValidacao.swift) · [relógio e restauração](validacao-1.2/xctest/relogio.log) · [sonda inicial aprovada](validacao-1.2/xctest/sonda.log).

**A suíte experimental completa NÃO passou:** terminou com **3 casos e 3 falhas**, após 253,584 s de testes. O primeiro caso cumpriu as asserções de zoom, arraste, preservação por dois ciclos e centralização, mas falhou posteriormente ao aguardar o marcador após a busca; os outros dois falharam no mesmo pré-requisito de localização da estação. Isso não deve ser apresentado como 3 testes aprovados. O XCTest é uma alternativa demonstrada para acesso e câmera, mas os demais fluxos não ficaram estabilizados.

Limitações da execução: a primeira tentativa de suíte não reabriu o projeto no Expo Go; uma execução do controlador foi interrompida por erro de variável, corrigido somente no script temporário. A tentativa seguinte mostrou a tela inicial do Expo Go apesar do link; a última usou o botão “flui-charge-map” em “Recently opened”, identificado na própria árvore nativa. Não foram realizadas novas execuções após o resultado parcial acima. A coleta de diagnóstico do Xcode não finalizou o `.xcresult` dentro do limite da execução; o executor foi encerrado. As capturas dos dois ciclos e das falhas não puderam ser exportadas; a captura disponibilizada é da sonda inicial de acesso e não substitui os registros numéricos dos ciclos.

O relógio da sessão foi **explicitamente restaurado com sucesso antes de encerrar Metro**, conforme o log. A segunda tentativa de restauração automática, após interromper o servidor, falhou por falta de conexão e não desfaz a restauração já comprovada. Metro foi interrompido e o simulador voltou ao estado `Shutdown`. O runner local de teste não pôde ser desinstalado durante o desligamento (`Shutting Down`); pode permanecer apenas nesse simulador, sem integrar o Flui. Não foi religado o dispositivo para insistir nessa limpeza.

A continuação, se autorizada, deve concentrar-se na sonda: registrar/verificar o valor efetivo do campo de busca e o estado retornado antes de aguardar marcadores. Não há indicação de que seja obrigatório um dispositivo físico, outro Mac ou ferramenta adicional. A CI aprovada de `5cf0fd0` continua sendo a evidência automatizada do código do aplicativo; não foi repetida porque não houve alteração de código ou dependências. Este registro usa `[skip ci]`. PR permanece em rascunho, sem merge, e a tarefa 1.2 continua pendente de aprovação humana e da validação de horários no código corrigido.


## Continuação dirigida do XCTest — 16/10/2026

Código do aplicativo preservado em `5cf0fd0877157b8ec74c5446df60bfbf9a61b6aa`. Não houve alteração do aplicativo, dependências ou configurações. O teste anterior de 70 segundos e centralização não foi repetido. As mudanças desta rodada se limitam à automação isolada e às evidências.

**Diagnóstico da busca:** reproduzida a entrada automatizada em bloco de “Higienópolis Prime Charge\n”, o valor efetivo do campo foi **“Hópolis Prime Charge”**, acompanhado de “Nenhum ponto disponível”. A automação anterior aguardava uma estação incompatível com a consulta realmente preenchida. O auxiliar XCTest agora digita um caractere por vez e aguarda a confirmação do prefixo na propriedade `value`; só prossegue após conferir o texto completo. A reprodução não demonstra uma falha de digitação manual do aplicativo nem identifica a causa interna da perda de caracteres. [Entrada incorreta](validacao-1.2/xctest-direcionado/busca-entrada-incorreta.png) · [diagnóstico e árvore nativa](validacao-1.2/xctest-direcionado/diagnostico-busca.log) · [fonte do diagnóstico](validacao-1.2/xctest-direcionado/DiagnosticoBusca.swift).

| Cenário no iOS corrigido | Resultado observado |
| --- | --- |
| Busca e foco intencional | Valor completo confirmado; Higienópolis voltou ao enquadramento e seu marcador apareceu. [Captura](validacao-1.2/xctest-direcionado/busca-corrigida.png). |
| Filtro e foco intencional | Depois de um arraste do mapa pelo XCTest, tocar em CCS2 selecionou o filtro e reposicionou o marcador de `(322,33334; 684,66666)` para `(220; 575)`. O caso dirigido terminou **aprovado**, em 112,961 s. [Captura](validacao-1.2/xctest-direcionado/filtro-reposiciona.png). |
| Fechamento sem depender da busca | Pela interface, selecionados “Carregadores livres”, “Aberto agora” e “1 km”, com busca vazia. Às 21h50 de sexta-feira em São Paulo, somente Flui Vila Mariana Lins atendia aos critérios. Após aproximar 21h59min50s e deixar o tempo avançar, o ciclo normal retirou seu marcador e cartão do filtro e exibiu “Nenhum ponto disponível”. [Antes](validacao-1.2/xctest-direcionado/mapa-antes-fechamento.png) · [depois](validacao-1.2/xctest-direcionado/mapa-apos-fechamento.png). |
| FluIA durante fechamento | Recomendava Vila Mariana antes das 22h; mudou para “Nenhuma opção viável confirmada” sem recarregar nem navegar durante a transição. [Antes](validacao-1.2/xctest-direcionado/flui-ia-antes-fechamento.png) · [depois](validacao-1.2/xctest-direcionado/flui-ia-apos-fechamento.png). |
| Enquadramento durante fechamento | Após zoom escolhido pelo XCTest na interface, o centro do marcador de referência FIAP permaneceu exatamente em `(61,333332; 506,666656)` antes/depois do fechamento (tolerância de 2 pontos; deslocamento observado zero). Capturas mostram o mesmo mapa enquanto o ponto elegível desaparece. |

[Asserções, estados e resultados](validacao-1.2/xctest-direcionado/busca-filtros-horarios.log) · [fonte exata executada](validacao-1.2/xctest-direcionado/BuscaFiltrosHorarios.swift) · [controle do relógio](validacao-1.2/xctest-direcionado/relogio-mapa.log). O relógio controlado afeta somente `Date` no contexto Hermes do Flui; o fechamento é demonstrativo, não uma observação do estabelecimento. Os temporizadores normais de 30 s foram mantidos.

**Resultados agregados, sem ocultar falhas:** o diagnóstico terminou com uma falha que registra a discrepância do campo. A execução dirigida teve **1 caso aprovado e 1 falho**: as asserções de fechamento em mapa, filtros e FluIA e preservação da câmera foram cumpridas; o segundo caso falhou depois, ao procurar o marcador para iniciar a etapa da ficha. A árvore já mostrava o cartão da Vila Mariana aberto após restaurar 21h50, mas o localizador exato do marcador não o encontrou. Uma tentativa isolada de acesso pelo cartão também parou antes de abrir a ficha: o elemento existia, porém não ficou acionável após a rolagem. Esses resultados não comprovam defeito do aplicativo. A etapa restante foi separada para usar o botão de acesso da FluIA, sem busca ou rolagem de cartões.

**Ficha ainda pendente no código corrigido:** a última tentativa pelo botão da FluIA não alcançou o fluxo por uma falha de preparação da automação. O executor foi reinicializado durante a preparação, e o Metro não estava ativo quando o teste começou; não foi verificado novamente antes do disparo. O Expo Go abriu, mas o Flui não carregou; `127.0.0.1:8084` não respondia e o processo Metro já havia terminado. O XCTest não encontrou “Abrir busca e filtros” após abrir o projeto recente. Não chegou a aplicar relógio nem a abrir a ficha. Após as duas tentativas isoladas sem avanço nessa etapa (cartão não acionável e reabertura sem Metro), a investigação foi interrompida. Não se atribui esse impedimento ao aplicativo. [Fonte da tentativa pelo cartão](validacao-1.2/xctest-direcionado/FichaPeloCartao.swift) · [log](validacao-1.2/xctest-direcionado/ficha-cartao.log) · [fonte da tentativa pela FluIA](validacao-1.2/xctest-direcionado/FichaPelaFluia.swift) · [log](validacao-1.2/xctest-direcionado/ficha-fluia.log).

A restauração após a execução do mapa não encontrou mais o contexto Flui: o XCTest já havia encerrado o aplicativo. A simulação de `Date` existia somente naquele contexto em memória. A última tentativa não aplicou relógio e terminou com 1 teste falho em 66,320 s, ainda na abertura do projeto. A própria interface do Expo Go registrou “Could not connect to the server” para `exp://127.0.0.1:8084`. O Metro já estava encerrado ao finalizar. O simulador foi confirmado em `Shutdown`, encerrando qualquer contexto em memória; o runner XCTest pode permanecer instalado somente nele, pois sua remoção exige o simulador ligado. Não foi religado para insistir na limpeza. A coleta volumosa de diagnósticos foi desativada nesta rodada (`-collect-test-diagnostics never`); os resultados dirigidos finalizaram e forneceram as capturas publicadas, sem instalar ferramentas adicionais.

**Verificações preservadas:** a CI [Quality #5 de `5cf0fd0`](https://github.com/isalvesb/flui-charge-map-next/actions/runs/38885331877) aprovou TypeScript, lint, 35 testes e exportação web. Não foram repetidos, pois o código e as dependências continuam iguais. `git diff --check` aprovado para os registros desta rodada; commit de evidências com `[skip ci]`, sem atribuir a ele uma nova execução de CI.

**Limites finais:** a preservação da câmera durante o fechamento, o mapa/filtro e a FluIA foram observados no código corrigido; a atualização automática da ficha permanece comprovada apenas no código anterior, pelo Device Hub. A suíte experimental agregada não foi aprovada. Persistência após recarregar no nativo, todos os filtros, dispositivo físico, build de distribuição e abertura de aplicativos de rota continuam fora da comprovação desta rodada. Android será validado por outra integrante. Nenhum defeito novo do aplicativo foi comprovado, portanto nenhuma correção do aplicativo foi feita. PR #1 permanece em rascunho, sem merge; `main` e o estado inicial não foram modificados. A tarefa 1.2 permanece pendente de aprovação humana.


## Ajuste final de UX da ficha — 16/10/2026

**Diagnóstico:** a validação da ficha de `82337ca` passou (1 XCTest, 0 falhas), mas as capturas revelaram uma inconsistência de apresentação: após o fechamento, a contagem continuava anunciando carregadores livres e o banner verde “Autonomia confortável” podia sugerir recarga possível. A contagem vinha diretamente dos conectores; texto e cor da autonomia dependiam apenas da avaliação do trajeto, sem considerar a possibilidade de recarga. As [capturas anteriores aberta](validacao-1.2/ux-ficha/versao-anterior-aberta.png) e [fechada](validacao-1.2/ux-ficha/versao-anterior-fechada.png) são referências do problema, não evidências da correção.

**Alterações pontuais:**

- `stationPresentation.ts`: apresentação da contagem condicionada à regra existente `canChargeAt`; sem recarga confirmada, mostra quantidade cadastrada e ressalva explícita, sem anunciar carregadores livres. Autonomia identifica deslocamento ao local, mantém bateria estimada/quilômetros faltantes e informa “Não garante recarga no local”. O tom confortável só é verde com recarga elegível no exemplo; nos demais estados é neutro. Avisos de autonomia limitada/insuficiente mantêm seus tons de alerta.
- `PointDetailsScreen.tsx`: usa os novos textos e tons na linha de carregadores, banner e lista de conectores. O banner é um grupo acessível cujo rótulo nativo contém a estimativa e a ressalva completas. Status, recomendação e espera mantêm as regras anteriores.
- `PointDetailsScreen.styles.ts`: permite quebra de linha da contagem dentro da largura disponível.
- `stationPresentation.test.ts`: nove novos casos cobrem aberta, fechada, manutenção, indisponibilidade, horário desconhecido, ocupação, ausência de conector utilizável, alertas de autonomia e limite exato de fechamento. Verificam também que a apresentação não altera os dados da estação ou a avaliação de autonomia.

Não foram alterados catálogo, conectores cadastrados, cálculos de autonomia/carga, regras de horário, `canChargeAt`, recomendações, temporizadores, dependências ou configurações. A mudança é exclusivamente de apresentação da ficha.

**Verificações do código modificado:** TypeScript aprovado; lint sem erros/advertências; 35/35 testes pertinentes aprovados (15 de apresentação, mais filtros/horários e FluIA). [TypeScript](validacao-1.2/ux-ficha/typecheck.log) · [lint](validacao-1.2/ux-ficha/lint.log) · [testes](validacao-1.2/ux-ficha/testes-focados.log). `git diff --check` aprovado. Não foram repetidos Expo Doctor, exportação ou suítes não relacionadas. Esses resultados são locais; não são uma nova execução de CI.

**Nova validação visual iOS:** macOS, Xcode 27.1, iPhone 18 Pro Max / iOS 27.0, Expo Go 54.0.7. Reutilizada e recompilada somente a sonda XCTest existente, com novas asserções que exigem os textos corrigidos; Metro iniciado com os arquivos modificados. Os [hashes dos quatro arquivos](validacao-1.2/ux-ficha/codigo-validado.sha256) foram conferidos após a execução, sem divergência. Nenhum teste antigo foi usado como comprovação da versão modificada.

| Estado da Vila Mariana | Observação no aplicativo modificado |
| --- | --- |
| Aberta, sexta-feira 21h50 | “Aberto agora”, indicador verde, “3 de 5 carregadores livres no exemplo”. Banner: “Autonomia para chegar ao local”, “Chegada estimada com 45% de bateria” e “Não garante recarga no local”. [Captura nova](validacao-1.2/ux-ficha/corrigida-aberta.png), 13:14:47.842 UTC. |
| Fechada, após 22h | “Fechado agora”, indicador cinza, “5 carregadores cadastrados no exemplo. Recarga não confirmada.”, guia “Recarga não confirmada neste ponto”, espera “Indisponível”. Banner passa a cinza e mantém a mesma estimativa de chegada em 45% e a ressalva. [Captura nova](validacao-1.2/ux-ficha/corrigida-fechada.png), 13:15:37.890 UTC. |
| Conectores, após fechar | Árvore nativa registra “150 kW · 3 carregadores cadastrados no exemplo. Recarga não confirmada.” e “22 kW · 2 carregadores cadastrados no exemplo. Recarga não confirmada.”, sem anunciar disponibilidade. Esses itens foram conferidos pela árvore nativa, não por captura específica da seção. |

Às 13:14:48.022 UTC, o controlador aproximou Date para sexta-feira, 16/10, 21h59min50s de São Paulo (`2026-10-17T00:59:50Z`). O tempo avançou normalmente, preservando o intervalo de 30 segundos. Nenhum toque, reload ou navegação ocorreu durante a espera da transição. A rolagem para enquadrar contagem e banner ocorreu antes da captura inicial. As duas capturas foram inspecionadas visualmente.

O caso **`testFichaUxAutonomiaERecarga` passou em 92,263 s: 1 teste, 0 falhas; `TEST EXECUTE SUCCEEDED`; código de saída 0**. [Fonte exata da sonda](validacao-1.2/ux-ficha/FichaUx.swift) · [log com árvores e asserções](validacao-1.2/ux-ficha/xctest.log) · [relógio e restauração](validacao-1.2/ux-ficha/relogio.log). O resultado nativo completo está preservado localmente em `../output/validacao-ux-ficha-ios-20261016/Resultado.xcresult` (fora do repositório).

**Restauração e encerramento:** `restored:true`, relógio real `2026-10-16T13:15:38.163Z`, confirmado novamente em `2026-10-16T13:15:46.587Z`. O relógio do sistema nunca foi alterado. Metro encerrado e simulador desligado após salvar as evidências. A abertura inicial por `simctl openurl` informou timeout, mas o Flui carregou, o Metro e os contextos Hermes foram confirmados antes do XCTest e a única execução do novo teste concluiu com sucesso. Nenhuma ferramenta instalada ou infraestrutura nova criada.

**Limitações:** observação visual somente em tema escuro, Expo Go e simulador, com relógio controlado no contexto Hermes. Manutenção, indisponibilidade, horário desconhecido e os demais casos têm testes de apresentação nesta rodada, sem novas capturas nativas específicas. O agrupamento acessível foi confirmado na árvore; não houve sessão de VoiceOver ou conferência de todas as escalas de fonte. Android, dispositivo físico, distribuição/credenciais publicadas, persistência após reload e abertura de aplicativos de rota continuam fora desta rodada. As evidências históricas mantêm seus limites.

Entrega restrita à branch `alfa/auditoria-tecnica-1.2`, com registro local de testes e evidências; commit com `[skip ci]` para não repetir Actions. PR #1 permanece em rascunho, sem merge; main local e remota preservadas. **A tarefa 1.2 permanece pendente de aprovação humana.**
