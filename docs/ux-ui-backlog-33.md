# Flui NEXT 2026 — acompanhamento UX/UI (33 itens)

Atualizado em 22/10/2026 (America/Recife). Evento: 24/10/2026.

## Ambiente e protocolo vigente

- Trabalho exclusivamente em `flui-ux-mapa-01`, branch `local/ux-mapa-01-reacticx-20261022`.
- Base inicial desta continuidade: `b720c5a9060e3e14ebce342cb8679b9b6ba8e791`.
- Consolidação protegida: `flui-consolidado-next`, branch `local/consolidacao-next-20261022`, `abd5dfacaf51350b32fa77066ee849dbfcc9fbdc`, limpa na inspeção inicial.
- Execução contínua autorizada: até dois ajustes pequenos relacionados por commit; um médio/complexo por commit, mensagens em português e verificações proporcionais. Comunicar checkpoint e continuar; silêncio não equivale a validação humana.
- Proibidos push, PR, merge remoto, deploy/publicação, issues/Projects, incorporação automática de #99/#100, mudanças na consolidação e sobrescrita de ambientes. `sources/` somente leitura.
- Sem subagentes, novas dependências/SDK, serviço pago, mudança relevante de arquitetura ou instalação nativa automática. Reavaliar após duas tentativas sem progresso.
- Remote de push bloqueado (`disabled://ux-mapa-publicacao-bloqueada`) e hook pre-push ativo.
- Alterações preexistentes preservadas: `HomeMapScreen.tsx` e `.styles.ts`, carro 60×32/translateY -4, bateria sobreposta sem pill/borda e remoção do aviso de centralização. Não restaurar versões antigas.
- Preview dos sete estados da FluIA continua ativo. “Ouvindo” é demonstração visual, sem captura de fala.

## Conexão e evidências iniciais

- Metro 8116 / PID 47108 / cwd `flui-ux-mapa-01`, status HTTP `running`; cliente nativo `com.guicunhasou.fluiuxmapa01 (iPhone)` conectado.
- iPhone 16 físico emparelhado e disponível; aplicativo instalado Flui 2.1 v2.1.0 / bundle `com.guicunhasou.fluiuxmapa01`, confirmado por consulta somente de leitura. Usuário informou aparelho desbloqueado.
- 8106 / PID 37713 pertence à consolidação; 8118 / PID 58381 serve exportação web anterior. Nenhum processo reiniciado ou encerrado.
- Conexão do cliente não comprova mapa desenhado ou Fast Refresh visual. Registrar confirmação humana quando ocorrer; não usar histórico anterior como prova de todas as mudanças novas.
- Logs novos em `../output/ux-backlog-20261022/`. Suíte anterior 160/160 e validações web anteriores têm escopo histórico, não cobrem automaticamente esta implementação.

## Ordem de execução

1. Checkpoint das alterações existentes e registro inicial.
2. 01: identificação das paradas e correspondência no mapa/linha do tempo.
3. 13+14; depois 15+16: simplificação do perfil e transferência de saída.
4. 04; 05; 33: bateria e origem simulada, sem GPS novo.
5. 24; 22+23; 25+27; 26+28: ficha e estimativas. Item 29 é invariável.
6. 17; 18; 10; 11: leitura, teclado e resposta por voz.
7. 02+03: linguagem restante com transparência centralizada.
8. 30: investigar armazenamento offline e corrigir apenas lacunas demonstradas.
9. Propostas/pesquisas 12, 20, 31, 32; 19+21 dependem da preservação dos controles internos.

Prioridades iniciais mantidas; nenhum P0 comprovado. Reordenar por dependência ou feedback imediato. 06–09 já feitos conforme correção explícita do usuário nesta conversa.

## Backlog original

Estados técnicos e humanos são separados. “Implementado” não significa “conferido no iPhone”, “aprovado” ou “validado”. Caminhos na tabela são relativos a `src/`, salvo `docs`.

| ID | Prioridade | Ajuste | Estado | Arquivos/área | Dependências, pendências e limites |
|---|---|---|---|---|---|
| 01 | P1 | Paradas e trajetos | Revisado após feedback; conferência física pendente | trip/TripPlannerScreen; utils/tripPlanner | Conferir ordem, mapa e trechos; percursos continuam simulados. |
| 02 | P3 | Subtexto do popup de estações | Implementado; revisão física pendente | map/HomeMapScreen | Preservar identificação geral da simulação. |
| 03 | P2 | Linguagem e transparência | Implementado no escopo; revisão de linguagem pendente | data/identificacaoDados; telas | Transversal a 04, 23, 25, 27; evitar remoção indiscriminada. |
| 04 | P2 | Origem do valor de bateria | Implementado; revisão física pendente | utils/batteryData | Distinguir manual, simulado e desconhecido. |
| 05 | P2 | Ajuste de bateria por arraste | Implementado; revisão física pendente | map; componente de bateria | Sem dependência nativa nova; alternativa acessível e precisão. |
| 06 | P2 | Abertura da Orb | Feito — informado pelo usuário | assistant; map | Não reimplementar. Revisão adicional somente se houver feedback. |
| 07 | P2 | Página roxa da FluIA | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Preservar contexto e comportamento existente. |
| 08 | P2 | Orb centralizada no alto | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Não reimplementar. |
| 09 | P3 | Título FluIA | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Não reimplementar. |
| 10 | P2 | Teclado e histórico | Implementado; revisão física pendente | assistant/FluiAssistantSheet | Conferir rolagem e alvos acessíveis no iPhone. |
| 11 | P2 | Resposta por voz | Implementado; áudio físico pendente | assistant/FluiAssistantSheet; fluiaState | Preservar TTS; distinguir falha, interrupção e conclusão. |
| 12 | P2 | Pesquisa de reconhecimento de fala | Pesquisa concluída; implementação depende de decisão | docs | Não contratar serviço, instalar dependência nativa nem introduzir credenciais. |
| 13 | P3 | Textos secundários do perfil | Implementado; revisão física pendente | profile/ProfileScreen | Preservar origem fictícia em identificação acessível/geral. |
| 14 | P3 | Remoção de atalhos úteis | Implementado; revisão física pendente | profile/ProfileScreen | Mapa/filtros mantêm acessos próprios. |
| 15 | P3 | Configurações em largura total | Implementado; revisão física pendente | profile/ProfileScreen | Depende de 16 para transferência da saída. |
| 16 | P2 | Saída no fim de configurações | Implementado; revisão física pendente | profile; settings | Saída atual é apenas visual; não inventar autenticação. |
| 17 | P2 | Nova escala tipográfica | Implementado; matriz visual pendente | theme/appTheme | Menor=antigo padrão; padrão=antigo grande; maior=novo superior. |
| 18 | P2 | Cartões de acessibilidade | Implementado; revisão física pendente | settings/SettingsScreen | Seção já existe; reorganizar fontes horizontalmente. Depende de 17. |
| 19 | P2 | Laboratório fora de configurações comuns | Implementado; código experimental preservado | settings; orb-lab | Preservar implementação e acesso interno. |
| 20 | P3 | Proposta Auto Experience | Proposta entregue; decisão sobre piloto pendente | docs; auto | Exige proposta prévia; sem promessa de CarPlay real ou uso de imagens sem direitos. |
| 21 | P2 | Demonstração NEXT fora dos ajustes comuns | Implementado; controles internos preservados | settings | Preservar controles em acesso interno; depende do desenho mínimo de 32. |
| 22 | P3 | Nome e endereço da estação | Implementado; revisão física pendente | stations/PointDetailsScreen | Manter 29. |
| 23 | P2 | Pills de status e avaliação | Implementado; revisão física pendente | stations/PointDetailsScreen | Transparência alinhada a 03; manter conteúdo da seção Avaliações. |
| 24 | P1 | Banner e estimativas sincronizadas | Implementado; revisão física pendente | stations; utils/autonomia | Dispensa limitada à condição; reserva exata de 5%; depende da bateria compartilhada. |
| 25 | P2 | Carregadores e confirmação | Implementado; confirmação preservada | stations; stationPresentation | Entender Recarga não confirmada e manter função de segurança. |
| 26 | P3 | Padrão dos cartões da ficha | Implementado; revisão física pendente | stations/PointDetailsScreen | Ícone/título com área distinta; distância continua aproximada. |
| 27 | P2 | Identificação de catálogo sem repetição | Implementado; revisão física pendente | stations; identificacaoDados | Depende da identificação geral em 03/23/25. |
| 28 | P3 | Cartões Estimativas e Conectores | Implementado; revisão física pendente | stations/PointDetailsScreen | Depende de 26; não modificar 29. |
| 29 | — | Preservar conteúdo de Comodidades próximas e Avaliações | Títulos com fundo autorizados em feedback; conteúdo preservado | stations/PointDetailsScreen | Nenhuma alteração sem defeito comprovado ou autorização adicional. |
| 30 | P1 | Persistência offline de fotos e favoritos | Cache web corrigido; teste físico/build offline pendente | assets; storage; service-worker | Não introduzir armazenamento remoto; distinguir assets empacotados e cache web. |
| 31 | P3 | Pesquisa catálogo/Supabase | Pesquisa concluída; ampliação/migração depende de decisão | docs | Sem migrar arquitetura, custos ou apresentar dados como verificados. |
| 32 | P2 | Proposta de área interna | Proposta entregue; expansão depende de decisão | docs; settings | Controles fictícios separados; não implementar integralmente antes da decisão sobre proposta. |
| 33 | P2 | Referência inicial de localização | Implementado; revisão física pendente | data/demonstracao; LocationContext | -23.540405908671097,-46.73414831818115; padrão simulado, não substituir GPS autorizado. |

## Checkpoints

Cada entrada deve informar IDs, commit, arquivos, verificações e limites humanos. O hash de um checkpoint é preenchido após seu commit e incluído no próximo registro; nunca inventar hash autorreferente.

- **Inicial:** inspeção somente leitura; branch/HEAD/dirty e proteção conferidos. Sem correções automáticas, testes ou ações remotas nessa inspeção. Resultado humano: 06–09 confirmados como feitos pelo usuário; demais itens novos aguardam revisão física em paralelo.

## Retomada

1. Ler este arquivo, `git status`, branch/HEAD e últimos commits; preservar diferenças.
2. Conferir origem dos servidores antes de agir. Não trocar o Metro do iPhone silenciosamente.
3. Continuar pelo próximo item pendente, priorizando feedback novo. Não repetir 06–09 nem testes sem justificativa.
4. Consultar commit e logs de cada checkpoint; não equiparar web/CPU/automatizado a validação física.

### CP00 — preservar trabalho preexistente

- Arquivos: `src/features/map/HomeMapScreen.tsx`, `HomeMapScreen.styles.ts` e este registro.
- Escopo: registra as duas alterações pequenas preexistentes (cabeçalho carro/bateria e remoção do aviso de centralização), sem recriá-las ou revertê-las.
- Verificações: TypeScript, ESLint dos dois arquivos e `git diff --check` aprovados. Logs `00-*`.
- iPhone: app correto instalado e cliente conectado ao Metro; sem nova confirmação visual humana. Commit: `8593cd6`.

### CP01 — 01: identificação das paradas

- Alterados: `src/features/trip/TripPlannerScreen.tsx`, `.styles.ts`, `tests/tripPlanner.test.ts`.
- Paradas numeradas pela mesma lista ordenada do plano no mapa e na linha do tempo. Toque no marcador identifica nome/ordem/chegada/saída. Origem/destino têm títulos próprios. Seletor distingue paradas candidatas das necessárias à bateria atual.
- Verificações: TypeScript, ESLint dirigido, testes do planejador (incluindo catálogo invertido/coordenadas) e diff. Logs `01-*`.
- Conferir: mapa → viagem → Campos do Jordão; com autonomia 80 km e bateria 70%, cenário histórico tem três paradas. Não alterar dados do usuário automaticamente para o teste.
- Limites: posições continuam interpoladas em linha reta, não são localização verificada dos carregadores; navegação externa continua só até o próximo ponto. Sem nova validação humana física.

### CP02 — 13 e 14: perfil simplificado

- Arquivo: `src/features/profile/ProfileScreen.tsx`.
- Removidos textos secundários entre nome/veículo e abaixo do carro; origem fictícia permanece no rótulo acessível do cabeçalho e na identificação geral do aplicativo. Removida seção Atalhos úteis; mapa/filtros mantêm navegação própria.
- Verificações: TypeScript, ESLint dirigido e diff (`02-*`). Mudança reversível de conteúdo, sem testes artificiais de texto.
- Conferir: mapa → foto do perfil. Nome seguido diretamente pelo veículo; favoritos/histórico/avaliações preservados.
- Revisão física/humana: pendente; nenhuma aprovação presumida.

- Correção durante CP02: a primeira checagem encontrou importação ainda necessária à identificação geral do perfil; restaurada antes de prosseguir. Checkpoint local corrigido com novas verificações.

### CP03 — 15 e 16: acesso às configurações e saída

- Arquivos: `src/features/profile/ProfileScreen.tsx`, `src/features/settings/SettingsScreen.tsx`.
- Configurações ocupa toda a largura útil no perfil. Saída transferida para o fim dos ajustes; continua apenas informativa, sem autenticação real, sem apagar dados.
- Verificações: TypeScript, ESLint dirigido e diff, logs `03-*`.
- Conferir: perfil → Configurações → final da página → Sair da conta; mensagem explica perfil local.
- Revisão física/humana pendente. Checkpoints anteriores: CP01 `b856e1d`, CP02 `695ef45`.

### CP04 — 04: linguagem da bateria

- Arquivos: `src/utils/batteryData.ts`, `src/features/map/HomeMapScreen.tsx`, `tests/batteryData.test.ts`.
- Valor padrão identificado como “Valor de simulação”; valor sem origem pede conferência no painel; edição manual mantém data/origem. Seletor deixa claro que a carga é informada pelo motorista. Sem alegação de leitura do veículo.
- Verificações: TypeScript, ESLint dirigido, quatro testes da classificação/serialização de bateria e diff (`04-*`).
- Conferir: tocar carro/bateria no cabeçalho; comparar identificação antes/depois de salvar uma carga. Revisão física pendente.

### CP05 — 05: régua de bateria

- Arquivos: `src/components/BatteryLevelControl.tsx`, `src/utils/batteryAdjustment.ts`, `src/features/map/HomeMapScreen.tsx`, `tests/batteryAdjustment.test.ts`.
- Arraste em alvo com 48 pt e resolução de 1%; entrada numérica direta; ações acessíveis de 1%; botões anteriores de 5% preservados. Mudanças permanecem locais ao seletor até Definir carga; cancelar não salva.
- Verificações: TypeScript, ESLint dirigido, testes de limites/precisão/layout inválido e bateria (`05-*`). Sem novas bibliotecas nativas.
- Conferir: tocar bateria → arrastar régua → digitar valor exato → Definir carga; reabrir e cancelar outra alteração. Inspecionar também rolagem/teclado e VoiceOver.
- Limites: gesto e teclado numérico dependem da revisão física; não alegar VoiceOver humano validado.

### CP06 — 33: origem inicial NEXT

- Arquivos: `src/data/demonstracao.ts`, `tests/demonstracao.test.ts`.
- Nova origem “Referência NEXT” com as coordenadas exatas solicitadas, padrão de instalação/configuração sem origem válida. Origens já salvas são preservadas; selecionar Referência NEXT nos controles existentes altera o cenário manualmente.
- GPS autorizado e `LocationContext` não foram modificados. Centralizar continua usando a origem de simulação escolhida.
- Verificações: TypeScript, ESLint, testes de demonstração, planejador e falhas de rota (`06-*`), incluindo preservação de origem salva.
- Revisão humana/física pendente. Não limpar dados do iPhone para observar novo padrão.
- Checkpoints: CP03 `228300f`, CP04 `abf1c44`, CP05 `8a7549f`.

### CP07 — 24: aviso dispensável e estimativas

- Arquivos: `src/features/stations/PointDetailsScreen.tsx`, `.styles.ts`, `stationPresentation.ts`, `tests/stationPresentation.test.ts`.
- Aviso de manutenção abaixo de nome/endereço com botão X de 44 pt; dispensa só nesta visita/condição. Retorna ao reentrar ou se estação/status/abertura/disponibilidade/bateria mudar. Status e confirmação de rota permanecem mesmo dispensando.
- Autonomia e chegada imediatamente abaixo; usam as preferências compartilhadas e mostram a carga usada. Removida frase “Não garante...” apenas dessa estimativa; mantidos linha reta, confirmação prévia e proteção da navegação.
- Verificações: TypeScript, ESLint, apresentação da estação, integração de origem/bateria e limites do planejador (`07-*`). Nenhuma mudança na reserva exata de 5% do motor.
- Conferir: alterar bateria no mapa → ficha; abrir estação em manutenção → fechar aviso → sair/reentrar. Revisão física/humana pendente.
- CP06: `c8b611c`. Consulta de módulos do iPhone sem cliente em duas tentativas: abordagem interrompida; conexão inicial não é prova de Fast Refresh atual. Nenhuma reinstalação/recompilação efetuada.

- Ajustes de verificação CP07: corrigidos tokens de cor ausentes no tema base; testes antigos de texto passaram a esperar “Autonomia disponível”, preservando asserções de cálculo/status/imutabilidade.

### CP08 — 22 e 23: identificação e pills da estação

- Arquivos: `src/features/stations/PointDetailsScreen.tsx`, `.styles.ts`.
- Nome/endereço aproximados com respiro abaixo. Status em primeira pill, nota/contagem em outra ao lado, com quebra flexível em fontes grandes. Uma identificação conjunta explica simulação de status/notas, evitando repetir o termo em cada valor.
- Verificações: TypeScript, ESLint dirigido, diff (`08-*`). Seções Comodidades próximas e Avaliações preservadas.
- Conferir: abrir ficha, comparar grupo nome/endereço e pills em claro/escuro e fonte ampliada. Revisão física pendente.

### CP09 — 25 e 27: carregadores e identificação única do catálogo

- Arquivos: `src/features/stations/stationPresentation.ts`, `PointDetailsScreen.tsx`, `src/data/identificacaoDados.ts`, `tests/stationPresentation.test.ts`.
- Investigação: “Recarga não confirmada” cobre estação fechada, manutenção, estado/horário desconhecido ou ausência de conectores utilizáveis (`canChargeAt`). Mantida nos cenários não elegíveis; não há garantia nem reserva automática.
- Removido “no exemplo” das quantidades. Identificação única junto ao resumo informa simulação, ausência de verificação/tempo real e possível desatualização; eliminado o bloco duplicado antes das estimativas.
- Verificações: TypeScript, ESLint, testes de apresentação e filtragem, incluindo mudança de horário e conectores inválidos (`09-*`).
- Conferir: ficha de ponto disponível e indisponível; comparar quantidade/status/aviso. Seções de comodidades/avaliações intactas. Revisão física pendente. CP07 `b3dade0`, CP08 `6f19aba`.

### CP10 — 26: cartões de informações

- Arquivos: `src/features/stations/PointDetailsScreen.tsx`, `.styles.ts`.
- Cartões com cabeçalho destacado (ícone + título) e corpo separado. Potência, conectores, funcionamento e distância seguem o padrão. “Distância” mantém símbolo ≈ e explicação em linha reta.
- Empilha cartões quando a largura de leitura, considerando fonte do app/sistema, é insuficiente. Medição após layout preserva render inicial consistente.
- Verificações: TypeScript, ESLint e diff (`10-*`). Conferir ficha em duas fontes e temas; revisão visual/física pendente.

### CP11 — 28: cartões completos de estimativas e conectores

- Arquivos: `src/features/stations/PointDetailsScreen.tsx`, `.styles.ts`.
- Estimativas (título simplificado) e Conectores com cabeçalho ícone/texto e corpo no padrão de 26. Mantidos tempos simplificados, confirmação e contagens por conector.
- Verificações: TypeScript, ESLint, diff (`11-*`) e comparação literal do trecho de Comodidades próximas/Avaliações com a base inicial: preservado.
- Conferir: abrir ficha e rolar até os novos cartões; revisão física pendente. CP09 `894aea3`, CP10 `ac2c863`.

### CP12 — 17: escala tipográfica

- Arquivo: `src/theme/appTheme.ts`.
- Menor = antigo padrão (1,00), Padrão = antigo grande (1,10), Maior = 1,25. Identificadores salvos mantidos; sem apagar preferências. Escala do sistema continua habilitada nos Text e TextInput.
- Verificações: TypeScript, ESLint e suíte completa (`12-*`), incluindo layout/leitura/contraste. Não prova ausência de overflow visual; matriz web dirigida e conferência no iPhone ainda necessárias.
- Conferir: Configurações → Acessibilidade → três tamanhos, depois mapa/ficha/viagem/FluIA. Nenhuma certificação de acessibilidade humana.

- Suíte completa CP12: primeira execução 164/165, com uma expectativa antiga do texto de bateria (04) em `assistantPresentation.test.ts`; atualizada sem retirar as asserções contra telemetria inventada. Reexecução documentada em `12-test-final.log`. Aviso ESLint herdado em ConnectivityContext:48, zero erros.

### CP13 — 18: preferência única de tamanho da fonte

- Arquivos: `src/features/settings/SettingsScreen.tsx`, `.styles.ts`.
- Três cartões horizontais Menor/Padrão/Maior em um grupo de seleção, sem altura máxima. Alto contraste continua como opção independente da seção Acessibilidade.
- Cartões têm estado de seleção/leitura e bloqueiam toques enquanto preferências carregam/salvam; descrições preservadas como dicas acessíveis.
- Verificações: TypeScript, ESLint dirigido e testes de persistência/contraste/leitura (`13-*`). Revisão visual e VoiceOver físico pendentes.
- Conferir: perfil → Configurações → Acessibilidade. CP11 `a33abd9`; CP12 `cea62de`, suíte completa 165/165.

### CP14 — 10: teclado e leitura da conversa

- Arquivo: `src/features/assistant/FluiAssistantSheet.tsx`.
- Botão explícito Recolher teclado enquanto teclado aberto; arraste interativo no iOS; texto e conversa preservados. Enviar mantém teclado disponível.
- Histórico deixa de saltar ao fim ao redimensionar se usuário estiver lendo acima. Botão Última mensagem retorna ao final; novo envio retoma acompanhamento automático. Respostas recebidas respeitam leitura anterior.
- Verificações: TypeScript, ESLint dirigido e testes existentes de estados/motor (`14-*`). Sem reconhecimento de voz novo, sem alteração do preview temporário de estados.
- Conferir: enviar pergunta, rolar histórico, abrir/recolher teclado, expandir resposta e usar Última mensagem. Revisão de gestos/teclado no iPhone pendente.

### CP15 — 11: controles e falhas da leitura por voz

- Arquivos: `src/features/assistant/FluiAssistantSheet.tsx`, `speechPlayback.ts`, `tests/speechPlayback.test.ts`.
- Voz em português com início/fim/erro; Parar leitura e Ouvir resposta. Falhas mantêm texto legível e opção de tentar novamente. Rótulo do controle explica volume/modo silencioso.
- Corrigida corrida: desligar voz durante espera da resposta ou fechar antes da preparação de áudio concluir não inicia fala tardia; callbacks antigos não afetam leitura nova. Leitura para ao sair/segundo plano. Sem captura de microfone.
- Verificações: TypeScript, ESLint, testes de início/fim/erro/cancelamento/callback obsoleto (`15-*`). API conferida nos tipos instalados do expo-speech SDK54; docs online redirecionaram para latest, não usados para presumir atualização de SDK.
- Conferir: perguntar → parar/ouvir novamente → desativar voz durante espera → sair/retornar. Áudio, volume, interrupções reais e VoiceOver no iPhone pendentes.
- CP13 `f3fdc0a`; commit de CP14 registrado no próximo checkpoint.

### CP16 — 02 e 03: popup e linguagem dos dados

- Arquivos: `src/features/map/HomeMapScreen.tsx`, `.styles.ts`, `src/features/settings/SettingsScreen.tsx`, `src/features/stations/stationPresentation.ts`.
- Popup sem subtexto longo; identificação curta Simulação no cabeçalho. Distância em linha reta permanece nos cartões, contexto completo no rótulo acessível. Configurações → Sobre os dados concentra catálogo/perfil/carga/estimativas/FluIA.
- Descrições de status usam “catálogo local”; linguagem da ficha/bateria/perfil já reduzida em 04/13/23/25/27. Avisos de rota, limites da estimativa e avaliações do catálogo não foram removidos indiscriminadamente.
- Verificações: TypeScript, ESLint, testes de apresentação/filtragem/contexto (`16-*`). Comodidades e Avaliações preservadas.
- Conferir: sugestões no mapa sem parágrafo abaixo do título; Sobre os dados nos ajustes. Revisão humana/física pendente. CP14 `4169756`; CP15 `9e9cd82`.

### CP17 — 19: laboratório fora dos ajustes comuns

- Arquivo: `src/features/settings/SettingsScreen.tsx`.
- Removido acesso ao laboratório da seção comum. Implementação e rota `/orb-lab` preservadas; serão reunidas com os controles internos já existentes no checkpoint 21.
- Verificações: TypeScript, ESLint dirigido e diff (`17-*`). Não modifica a Orb em uso ou o preview temporário.
- Conferir: Configurações deixa de mostrar Laboratório da Energy Orb. CP16 `bcc4ddb`.

### CP18 — 21: transferência dos controles existentes

- Arquivos: `src/features/settings/SettingsScreen.tsx`, `InternalPresentationScreen.tsx`, `app/internal-presentation.tsx`.
- Seção Demonstração NEXT retirada da página comum e preservada em Apresentação interna, junto ao laboratório. Entrada e rota protegidas por `__DEV__`; acesso direto em produção redireciona para Configurações.
- Mesmos campos/validação/persistência existentes (veículo, autonomia, origem e acesso à bateria). Sem nova edição de identidade/favoritos/comentários; expansão do item 32 exige decisão sobre proposta.
- Verificações: TypeScript, ESLint dirigido e testes de configuração/persistência (`18-*`). Sem nova dependência, instalação ou migração de dados.
- Conferir no Flui 2.1: Configurações → Ferramentas internas. Revisão física pendente.

- Rota `/orb-lab` também protegida contra acesso público direto em produção. Tipagem local de rotas estava anterior à nova rota: utilizado `Href` conforme padrão existente; arquivo de rota real será conferido pela exportação, sem editar tipos gerados nem reiniciar Metro.

### CP19 — 12: pesquisa de entrada por voz

- Arquivo: `docs/ux-ui-pesquisas-e-propostas.md`, seção 12. Fontes primárias Expo/Apple/Google, tipos instalados e dependências conferidos. Nenhuma mudança executável.
- Comparados reconhecimento nativo e Google Cloud, permissões, integração por texto editável ao motor, custos exemplificativos, privacidade, falhas e latência ainda não medida.
- Verificação: revisão das referências e do escopo; não se aplica teste de código. Próxima implementação exige decisão sobre módulo nativo/servidor/custo; não bloqueia demais itens.
- CP17 `94cab38`; CP18 `a69d5d9`. Sem nova confirmação visual humana.

## Feedback humano recebido durante execução

Em 22/10, usuário relatou: (1) não viu diferença no planejador; (2) versão deve ser último elemento e saída vermelha; (3) aviso de saída se confunde com conteúdo; (4) fundo da bateria deve fazer fade separado da subida; (5) título do aviso grande/textos pouco escuros; (6) estimativa com informação excessiva; (7) recarga não confirmada precisa fundo; (8) autoriza fundo nos títulos de Comodidades e Avaliações; (9) três fontes devem ocupar toda largura; (10) alto contraste deve ter título menor e toggle. Feedback é evidência de observação parcial da interface; não é aprovação global.

### FB01 — ajustes 15/16: saída, aviso e rodapé (comentários 2–3)

- Arquivos: `src/features/settings/SettingsScreen.tsx`, `.styles.ts`.
- Versão passa a ser o último texto da página; saída volta ao vermelho. Toast com fundo roxo contrastante, texto claro, quebra de linha e tempo de leitura ampliado.
- Verificações: TypeScript, ESLint dirigido e diff (`fb01-*`). Conferir final dos ajustes e tocar Sair da conta.
- Revisão humana: correção solicitada; retorno após esta alteração ainda pendente.

### FB02 — 18: largura das fontes e toggle de contraste (comentários 9–10)

- Arquivos: `src/features/settings/SettingsScreen.tsx`, `.styles.ts`.
- Causa comprovada em código: PressableScale aplica style ao conteúdo interno; o flex anterior não dividia a largura do pai. Adicionados três contêineres externos com flex igual; cartões ocupam 100% de cada coluna.
- Alto contraste agora tem título do mesmo tamanho de Tamanho da fonte e Switch nativo, mantendo persistência e bloqueio durante salvamento.
- Verificações: TypeScript, ESLint e testes de contraste/persistência (`fb02-*`). Conferência de geometria web será feita após exportar os feedbacks; revisão física após correção pendente. FB01 `6912348`.

### FB03 — 24: aviso menor e estimativa resumida (comentários 5–6)

- Arquivos: `src/features/stations/PointDetailsScreen.tsx`, `.styles.ts`.
- Título do aviso reduzido de 20 para 15 pt base, corpo com cor de texto mais escura no claro; mantém contraste adaptativo no escuro/alto contraste. X continua com alvo 44 pt.
- Card de autonomia exibe apenas autonomia estimada e chegada (ou falta de alcance), preservando alerta de autonomia limitada. Carga usada e explicação completa ficam no rótulo acessível; linha reta/compatibilidade continuam explicitadas nos cartões/fluxo de rota.
- Verificações: TypeScript, ESLint e testes de apresentação/origem/bateria (`fb03-*`). Sem alteração dos cálculos. Revisão física após correção pendente.

### FB04 — 25 e 29: hierarquia e títulos (comentários 7–8)

- Arquivos: `src/features/stations/PointDetailsScreen.tsx`, `.styles.ts`.
- Recarga não confirmada agora em faixa âmbar com texto contrastante. Condições de confirmação mantidas.
- Usuário autorizou expressamente alterar os títulos de Comodidades próximas e Avaliações: ganharam fundo/ícone conforme cartões. Conteúdo das seções não alterado. A preservação literal anterior de toda seção foi substituída por preservação literal dos corpos.
- Verificações: TypeScript, ESLint, testes de apresentação e comparação literal dos corpos com `b720c5a` (`fb04-*`, `29-preservacao-corpos.log`). Revisão física após correção pendente. FB03 registrado no próximo checkpoint.

### FB05 — 05: animações separadas de fundo/painel (comentário 4)

- Arquivos: `src/features/map/BatteryEditorModal.tsx`, `HomeMapScreen.tsx`.
- Modal nativo sem animação de toda a camada. Fundo fixo com opacity/fade; somente painel recebe translateY. Fechamento anima antes de desmontar, respeitando redução de movimento.
- Mantidos seleção, cancelar, salvar, teclado e alternativa acessível. Nenhuma dependência nativa adicionada.
- Verificações: TypeScript, ESLint, testes de bateria e diff (`fb05-*`). Conferência web de abertura/fechamento pendente da exportação; percepção no iPhone requer revisão humana.
- FB02 `fe751f5`, FB03 `8ef9d3f`; FB04 registrado no próximo checkpoint.

### FB06 — 01: esclarecer resultado sem paradas (comentário 1)

- Arquivos: `src/features/trip/TripPlannerScreen.tsx`, `.styles.ts`.
- Diagnóstico reproduzível: padrão 400 km/70% na Referência NEXT calcula zero paradas nos três destinos. Assim, a numeração do CP01 não aparece; isso não comprova falha de atualização nem permite presumir os dados atuais do iPhone.
- Novo resumo visível antes do mapa distingue viagem sem paradas, nenhuma parada alcançável e plano com paradas numeradas/nominadas na ordem. Não inventa recarga desnecessária. Marcadores e timeline mantêm correspondência.
- Verificações: TypeScript, ESLint e 15 testes do planejador (`fb06-*`), incluindo três paradas e limites exatos de reserva. Conferência humana deste novo resumo pendente.

### CP20 — 30: preparação offline das fotos locais

- Diagnóstico: `30-cache-inicial.json`: 14/14 fotos de usuário/estações fora do CacheStorage após preparação inicial, sem visitar fichas; nenhum erro de página. Páginas e bundles já eram cacheados, mas imagens referidas pelo conteúdo React não eram necessariamente aquecidas.
- Arquivos: `public/offline-worker.js`, `scripts/prepare-offline-assets.cjs`, `package.json` (somente script), `tests/offlineWorker.test.ts`, `tests/offlineAssets.test.ts`.
- Manifesto gerado após exportação lista somente fotos públicas locais de usuário/estações; instalação do worker prepara todas, inclusive favoritas nunca abertas. Falha de preparação não ativa versão incompleta. Serviços externos e dados privados não entram no manifesto.
- Nova exportação: `npm run export:web:offline`; para saída própria: exportar e executar `node scripts/prepare-offline-assets.cjs <pasta>`. Sem dependências novas ou mudança de armazenamento pessoal.
- Verificações: TypeScript, ESLint, testes do worker/manifesto e navegação offline em contexto web isolado (`20-*`, resultado físico não inferido).
- iOS: fotos atuais vêm de requires locais e favoritos/dados de AsyncStorage + catálogo. Isso não comprova empacotamento offline na Development Build. Artefato histórico Debug inspecionado não contém WebP avulsos; não autoriza inferir formato do binário instalado. Cold start sem Metro e permanência das imagens no iPhone ainda precisam de validação física/build autorizado. Nenhuma compilação/instalação realizada.
- FB04 `52676a5`, FB05 `748991b`; FB06 registrado no próximo checkpoint.

### CP21 — 20: proposta por marca/modelo

- Arquivo: `docs/ux-ui-pesquisas-e-propostas.md`, seção 20.
- Referências primárias BYD/Renault; dimensões em polegadas não usadas para inventar proporções. Proposta distingue seleção visual, dados de cálculo e CarPlay; direitos de imagens não presumidos.
- Verificação: leitura das fontes e revisão de dependências; não há alteração executável nem imagem incorporada.
- Decisão necessária: modelo/ano, geometria e proposta visual antes da implementação integral. Demais ajustes não dependem desta decisão. FB06 `a660b6d`; CP20 registrado no próximo checkpoint.

### CP22 — 31: fontes e banco remoto

- Arquivo: `docs/ux-ui-pesquisas-e-propostas.md`, seção 31.
- Comparados ampliação fictícia local, fonte externa e Supabase/PostGIS; evidência de necessidade de migração não encontrada nesta etapa. Fonte/atribuição/cache/sincronização tratados separadamente de veracidade operacional.
- Verificação: referências oficiais de Open Charge Map/Supabase e leitura do armazenamento atual; não se aplica teste executável.
- Sem conta, credencial, migração, custo ou catálogo real introduzido. Próximo passo depende de decisão sobre fonte/escopo. CP20 `c7899e2`, CP21 `a973a57`.

### CP23 — 32: proposta de cenários separados

- Arquivo: `docs/ux-ui-pesquisas-e-propostas.md`, seção 32.
- Campos solicitados, fluxo Aplicar/Encerrar, persistência fictícia independente, precedência de bateria/localização, proteção de dados e etapas de implementação definidos para revisão.
- Diferencia claramente a reordenação já autorizada em 19/21 do novo sistema proposto. Sem novos dados fictícios misturados aos favoritos/comentários do usuário.
- Verificação: revisão de cobertura dos campos e das restrições; não há código novo a testar.
- Decisão necessária antes de implementar novos campos/armazenamento do cenário. CP22 `368bd84`.

## Situação consolidada por item — solicitação de andamento

“Feito” = implementado; não significa aprovação visual ou validação física completa. São 27 itens implementados (4 pré-existentes), 2 análises concluídas, 1 proposta aguardando decisão, 2 parciais e 1 conteúdo preservado com títulos autorizados.

| ID | Estado | Resultado / falta | Commits de referência |
|---|---|---|---|
| 01 | Feito; conferência pendente | Paradas numeradas e resumo explícito de zero/uma/várias paradas. Revisado após usuário não perceber mudança. | b856e1d; a660b6d |
| 02 | Feito | Subtexto removido; identificação curta de simulação preservada. | bcc4ddb |
| 03 | Feito no escopo | Repetições reduzidas em mapa, perfil, bateria e ficha; transparência mantida. | bcc4ddb; 894aea3 |
| 04 | Feito | Textos de carga manual/simulação mais naturais. | abf1c44 |
| 05 | Feito; revisão física pendente | Arraste, entrada exata e alternativa acessível; fundo com fade separado do painel. | 8a7549f; 748991b |
| 06 | Feito anteriormente | Abertura da Orb confirmada como feita pelo usuário; não reimplementada. | b720c5a (estado inicial) |
| 07 | Feito anteriormente | Página roxa em tela cheia, confirmada pelo usuário. | e3f4da5 |
| 08 | Feito anteriormente | Orb centralizada na página, confirmada pelo usuário. | e3f4da5 |
| 09 | Feito anteriormente | Título FluIA padronizado, confirmado pelo usuário. | e3f4da5 |
| 10 | Feito; teclado físico pendente | Recolher teclado e retomar última mensagem sem perder leitura do histórico. | 4169756 |
| 11 | Feito; áudio físico pendente | Parar/repetir leitura e tratar falhas/cancelamento. Não captura fala. | 9e9cd82 |
| 12 | Análise concluída | Opções Apple/Google, custo, privacidade e piloto documentados; integração exige decisão. | 6c4b501 |
| 13 | Feito | Subtextos do perfil removidos. | 695ef45 |
| 14 | Feito | Atalhos úteis removidos. | 695ef45 |
| 15 | Feito | Configurações em largura total no perfil. | 228300f |
| 16 | Feito; revisado por feedback | Saída vermelha antes da versão; aviso com fundo distinto. Saída permanece informativa. | 228300f; 6912348 |
| 17 | Feito; revisão visual pendente | Escalas 100%, 110% e 125%, mantendo escala do sistema. | cea62de |
| 18 | Feito; revisado por feedback | Fontes dividem toda largura; alto contraste com título e Switch. | f3fdc0a; fe751f5 |
| 19 | Feito | Laboratório fora dos ajustes comuns e protegido em produção; código preservado. | 94cab38; a69d5d9 |
| 20 | Proposta pronta; implementação a fazer | Marca/modelo, geometria e direitos de imagens pesquisados; falta decidir/aprovar piloto. | a973a57 |
| 21 | Feito | Controles existentes transferidos para apresentação interna em desenvolvimento. | a69d5d9 |
| 22 | Feito | Nome/endereço aproximados com espaçamento ajustado. | 6f19aba |
| 23 | Feito | Status e avaliações em pills com identificação geral da simulação. | 6f19aba |
| 24 | Feito; revisado por feedback | Aviso dispensável menor/mais escuro e estimativas resumidas sincronizadas com bateria. | b3dade0; 8ef9d3f |
| 25 | Feito; revisado por feedback | Exemplo removido; confirmação investigada/preservada e destacada em faixa. | 894aea3; 52676a5 |
| 26 | Feito | Cartões com cabeçalho e corpo; distância mantém aproximação. | ac2c863 |
| 27 | Feito | Aviso duplicado substituído por identificação única do catálogo. | 894aea3 |
| 28 | Feito | Estimativas e Conectores em cartões próprios. | a33abd9 |
| 29 | Preservado com alteração autorizada | Conteúdo intacto; títulos com fundo/ícone por nova autorização humana. | 52676a5 |
| 30 | Parcial | Cache web das fotos corrigido; persistência/arranque sem Metro no iPhone ainda não comprovados. | c7899e2 |
| 31 | Análise concluída | Ampliação local/fonte externa/Supabase comparados; sem migração ou contratação. | 368bd84 |
| 32 | Parcial; proposta pronta | Área interna básica existe; novos cenários com identidade/favoritos/avaliações separados dependem de decisão. | a69d5d9; c89a54a |
| 33 | Feito | Referência NEXT como padrão; origem já salva e GPS autorizado preservados. | c8b611c |

### Verificação técnica final em andamento

- `check-final.log`: TypeScript aprovado, ESLint zero erros/um aviso herdado em ConnectivityContext:48, 173/173 testes aprovados.
- `export-feedback.log`: exportação atual com 15 rotas. Manifesto de 15 fotos públicas locais gerado; quantidade mudou em relação à exportação diagnóstica anterior (14), sem inferência sobre fotos do iPhone.
- `conferir-feedbacks.cjs`: roteiro novo de interface/geometria/cache em Chromium isolado. Resultado final será acrescentado após execução; não considerar aprovado antes disso.
- Proteções e consolidação serão reconferidas no fechamento. CP19 `6c4b501`, CP23 `c89a54a`.

### FB07 — 24/25: complemento após inspeção visual

- Arquivo: `src/features/stations/PointDetailsScreen.tsx`.
- Captura da estação em manutenção mostrou status com token claro de borda e indicação junto à quantidade ainda sem fundo. Status/estimativas passam a usar tokens de texto contrastantes; faixa âmbar aplicada ao próprio grupo de carregadores sempre que `canChargeAt` é falso. Removida repetição da mesma recomendação em outro bloco.
- Verificações: TypeScript, ESLint e casos de status/conectores/horário da apresentação e filtragem (`fb07-*`); nova exportação para conferência dirigida da faixa/status.
- Não altera condições de recarga, regras de cálculo ou conteúdo protegido do item 29. Retorno humano após ajuste pendente.
