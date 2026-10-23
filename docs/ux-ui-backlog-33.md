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
| 01 | P1 | Paradas e trajetos | Implementado; revisão física pendente | trip/TripPlannerScreen; utils/tripPlanner | Conferir ordem, mapa e trechos; percursos continuam simulados. |
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
| 12 | P2 | Pesquisa de reconhecimento de fala | Pesquisa pendente | docs | Não contratar serviço, instalar dependência nativa nem introduzir credenciais. |
| 13 | P3 | Textos secundários do perfil | Implementado; revisão física pendente | profile/ProfileScreen | Preservar origem fictícia em identificação acessível/geral. |
| 14 | P3 | Remoção de atalhos úteis | Implementado; revisão física pendente | profile/ProfileScreen | Mapa/filtros mantêm acessos próprios. |
| 15 | P3 | Configurações em largura total | Implementado; revisão física pendente | profile/ProfileScreen | Depende de 16 para transferência da saída. |
| 16 | P2 | Saída no fim de configurações | Implementado; revisão física pendente | profile; settings | Saída atual é apenas visual; não inventar autenticação. |
| 17 | P2 | Nova escala tipográfica | Implementado; matriz visual pendente | theme/appTheme | Menor=antigo padrão; padrão=antigo grande; maior=novo superior. |
| 18 | P2 | Cartões de acessibilidade | Implementado; revisão física pendente | settings/SettingsScreen | Seção já existe; reorganizar fontes horizontalmente. Depende de 17. |
| 19 | P2 | Laboratório fora de configurações comuns | Implementado; código experimental preservado | settings; orb-lab | Preservar implementação e acesso interno. |
| 20 | P3 | Proposta Auto Experience | Proposta pendente | docs; auto | Exige proposta prévia; sem promessa de CarPlay real ou uso de imagens sem direitos. |
| 21 | P2 | Demonstração NEXT fora dos ajustes comuns | Implementado; controles internos preservados | settings | Preservar controles em acesso interno; depende do desenho mínimo de 32. |
| 22 | P3 | Nome e endereço da estação | Implementado; revisão física pendente | stations/PointDetailsScreen | Manter 29. |
| 23 | P2 | Pills de status e avaliação | Implementado; revisão física pendente | stations/PointDetailsScreen | Transparência alinhada a 03; manter conteúdo da seção Avaliações. |
| 24 | P1 | Banner e estimativas sincronizadas | Implementado; revisão física pendente | stations; utils/autonomia | Dispensa limitada à condição; reserva exata de 5%; depende da bateria compartilhada. |
| 25 | P2 | Carregadores e confirmação | Implementado; confirmação preservada | stations; stationPresentation | Entender Recarga não confirmada e manter função de segurança. |
| 26 | P3 | Padrão dos cartões da ficha | Implementado; revisão física pendente | stations/PointDetailsScreen | Ícone/título com área distinta; distância continua aproximada. |
| 27 | P2 | Identificação de catálogo sem repetição | Implementado; revisão física pendente | stations; identificacaoDados | Depende da identificação geral em 03/23/25. |
| 28 | P3 | Cartões Estimativas e Conectores | Implementado; revisão física pendente | stations/PointDetailsScreen | Depende de 26; não modificar 29. |
| 29 | — | Preservar Comodidades próximas e Avaliações | Preservação obrigatória | stations/PointDetailsScreen | Nenhuma alteração sem defeito comprovado ou autorização adicional. |
| 30 | P1 | Persistência offline de fotos e favoritos | Investigar cache existente | assets; storage; service-worker | Não introduzir armazenamento remoto; distinguir assets empacotados e cache web. |
| 31 | P3 | Pesquisa catálogo/Supabase | Pesquisa pendente | docs | Sem migrar arquitetura, custos ou apresentar dados como verificados. |
| 32 | P2 | Proposta de área interna | Proposta pendente | docs; settings | Controles fictícios separados; não implementar integralmente antes da decisão sobre proposta. |
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
