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
| 02 | P3 | Subtexto do popup de estações | Pendente | map/HomeMapScreen | Preservar identificação geral da simulação. |
| 03 | P2 | Linguagem e transparência | Pendente | data/identificacaoDados; telas | Transversal a 04, 23, 25, 27; evitar remoção indiscriminada. |
| 04 | P2 | Origem do valor de bateria | Implementado; revisão física pendente | utils/batteryData | Distinguir manual, simulado e desconhecido. |
| 05 | P2 | Ajuste de bateria por arraste | Implementado; revisão física pendente | map; componente de bateria | Sem dependência nativa nova; alternativa acessível e precisão. |
| 06 | P2 | Abertura da Orb | Feito — informado pelo usuário | assistant; map | Não reimplementar. Revisão adicional somente se houver feedback. |
| 07 | P2 | Página roxa da FluIA | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Preservar contexto e comportamento existente. |
| 08 | P2 | Orb centralizada no alto | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Não reimplementar. |
| 09 | P3 | Título FluIA | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Não reimplementar. |
| 10 | P2 | Teclado e histórico | Pendente | assistant/FluiAssistantSheet | Conferir rolagem e alvos acessíveis no iPhone. |
| 11 | P2 | Resposta por voz | Pendente | assistant/FluiAssistantSheet; fluiaState | Preservar TTS; distinguir falha, interrupção e conclusão. |
| 12 | P2 | Pesquisa de reconhecimento de fala | Pesquisa pendente | docs | Não contratar serviço, instalar dependência nativa nem introduzir credenciais. |
| 13 | P3 | Textos secundários do perfil | Implementado; revisão física pendente | profile/ProfileScreen | Preservar origem fictícia em identificação acessível/geral. |
| 14 | P3 | Remoção de atalhos úteis | Implementado; revisão física pendente | profile/ProfileScreen | Mapa/filtros mantêm acessos próprios. |
| 15 | P3 | Configurações em largura total | Implementado; revisão física pendente | profile/ProfileScreen | Depende de 16 para transferência da saída. |
| 16 | P2 | Saída no fim de configurações | Implementado; revisão física pendente | profile; settings | Saída atual é apenas visual; não inventar autenticação. |
| 17 | P2 | Nova escala tipográfica | Pendente | theme/appTheme | Menor=antigo padrão; padrão=antigo grande; maior=novo superior. |
| 18 | P2 | Cartões de acessibilidade | Parcial existente | settings/SettingsScreen | Seção já existe; reorganizar fontes horizontalmente. Depende de 17. |
| 19 | P2 | Laboratório fora de configurações comuns | Pendente | settings; orb-lab | Preservar implementação e acesso interno. |
| 20 | P3 | Proposta Auto Experience | Proposta pendente | docs; auto | Exige proposta prévia; sem promessa de CarPlay real ou uso de imagens sem direitos. |
| 21 | P2 | Demonstração NEXT fora dos ajustes comuns | Pendente | settings | Preservar controles em acesso interno; depende do desenho mínimo de 32. |
| 22 | P3 | Nome e endereço da estação | Pendente | stations/PointDetailsScreen | Manter 29. |
| 23 | P2 | Pills de status e avaliação | Pendente | stations/PointDetailsScreen | Transparência alinhada a 03; manter conteúdo da seção Avaliações. |
| 24 | P1 | Banner e estimativas sincronizadas | Pendente | stations; utils/autonomia | Dispensa limitada à condição; reserva exata de 5%; depende da bateria compartilhada. |
| 25 | P2 | Carregadores e confirmação | Investigar antes de alterar | stations; stationPresentation | Entender Recarga não confirmada e manter função de segurança. |
| 26 | P3 | Padrão dos cartões da ficha | Pendente | stations/PointDetailsScreen | Ícone/título com área distinta; distância continua aproximada. |
| 27 | P2 | Identificação de catálogo sem repetição | Pendente | stations; identificacaoDados | Depende da identificação geral em 03/23/25. |
| 28 | P3 | Cartões Estimativas e Conectores | Pendente | stations/PointDetailsScreen | Depende de 26; não modificar 29. |
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
