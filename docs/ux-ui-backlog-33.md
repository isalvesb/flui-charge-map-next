# Flui NEXT 2026 — acompanhamento UX/UI (35 itens)

Atualizado em 23/10/2026 (America/Recife). Evento: 24/10/2026.

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
5. 24; 22+23; 25+27; 26+28: ficha e estimativas. Item 29 preserva conteúdo; padronização do contêiner autorizada no feedback de 23/10.
6. 17; 18; 10; 11: leitura, teclado e resposta por voz.
7. 02+03: linguagem restante com transparência centralizada.
8. 30: investigar armazenamento offline e corrigir apenas lacunas demonstradas.
9. Propostas/pesquisas 12, 20, 31, 32; 19+21 dependem da preservação dos controles internos.

Prioridades iniciais mantidas; nenhum P0 comprovado. Reordenar por dependência ou feedback imediato. 06–09 já feitos conforme correção explícita do usuário nesta conversa.

**Prevalece o feedback mais recente:** usuário retomou 31, 32, 34 e 12 em 23/10, nessa ordem. Investigar sem contratar serviços ou criar infraestrutura desnecessária; implementar incrementos locais autorizados. Item 20 continua fora da execução, reservado ao pitch. Restrições de instalação nativa e arquitetura relevante preservadas.

## Backlog original

Estados técnicos e humanos são separados. “Implementado” não significa “conferido no iPhone”, “aprovado” ou “validado”. Caminhos na tabela são relativos a `src/`, salvo `docs`.

| ID | Prioridade | Ajuste | Estado | Arquivos/área | Dependências, pendências e limites |
|---|---|---|---|---|---|
| 01 | P1 | Paradas e trajetos | Sem nova execução; ampliação transferida ao 31 | utils/catalogTripPlanner; trip/TripPlannerScreen | Implementação S12 preservada, sem aprovação física presumida. Usuário transferiu a tarefa de novos pontos ao 31, agora em espera. |
| 02 | P3 | Subtexto do popup de estações | Feito; usuário respondeu ok | map/HomeMapScreen | Preservar identificação geral da simulação. |
| 03 | P2 | Linguagem e transparência | Revisado novamente; usuário ainda não aprovou a redução | data/identificacaoDados; telas | Transversal a 04, 23, 25, 27; evitar remoção indiscriminada. |
| 04 | P2 | Origem do valor de bateria | Feito; usuário respondeu ok | utils/batteryData | Distinguir manual, simulado e desconhecido. |
| 05 | P2 | Ajuste de bateria por arraste | Feito; usuário respondeu ok | map; componente de bateria | Sem dependência nativa nova; alternativa acessível e precisão. |
| 06 | P2 | Abertura da Orb | Feito — informado pelo usuário | assistant; map | Não reimplementar. Revisão adicional somente se houver feedback. |
| 07 | P2 | Página roxa da FluIA | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Preservar contexto e comportamento existente. |
| 08 | P2 | Orb centralizada no alto | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Não reimplementar. |
| 09 | P3 | Título FluIA | Feito — informado pelo usuário | assistant/FluiAssistantSheet | Não reimplementar. |
| 10 | P2 | Teclado e histórico | Feito; usuário respondeu ok | assistant/FluiAssistantSheet | Conferir rolagem e alvos acessíveis no iPhone. |
| 11 | P2 | Resposta por voz | Corrigido Explicando durante fala; áudio físico pendente | assistant/FluiAssistantSheet; fluiaState | Preservar TTS; distinguir falha, interrupção e conclusão. |
| 12 | P2 | Pesquisa de reconhecimento de fala | Investigação concluída; captura ainda não implementada | docs/reconhecimento-de-fala-fluia.md | Comparadas entrada pelo teclado, reconhecimento nativo e Google Cloud. Próximo piloto depende de autorização de módulo/build nativos; nenhum serviço contratado. |
| 13 | P3 | Textos secundários do perfil | Feito; usuário respondeu ok | profile/ProfileScreen | Preservar origem fictícia em identificação acessível/geral. |
| 14 | P3 | Remoção de atalhos úteis | Feito; usuário respondeu ok | profile/ProfileScreen | Mapa/filtros mantêm acessos próprios. |
| 15 | P3 | Configurações em largura total | Feito; botão amarelo após feedback, revisão pendente | profile/ProfileScreen | Depende de 16 para transferência da saída. |
| 16 | P2 | Saída no fim de configurações | Feito; alinhamento e versão 2.3 revisados, revisão pendente | profile; settings | Saída atual é apenas visual; não inventar autenticação. |
| 17 | P2 | Nova escala tipográfica | Correção implementada; nova revisão física pendente | theme/appTheme | Margem de 10 pt no indicador removida; base dos T alinhada. Geometria web passou em três fontes e duas larguras. |
| 18 | P2 | Cartões de acessibilidade | Preferências em cartões e novas opções implementadas; revisão física pendente | settings; preferences; interaction; useReducedMotion | Acessibilidade abre a tela: fonte (três cartões), aparência (Claro/Escuro), contraste, movimento e vibração. Alinhamento iOS corrigido após feedback; confirmação física pendente. Checkpoints S27–S30. |
| 19 | P2 | Laboratório fora de configurações comuns | Ícone do toast corrigido; revisão física pendente | settings; exclusão de orb-lab/protótipo | Ícone vetorial em área fixa centralizada substitui letra i dependente de linha/fonte. Restante preservado. |
| 20 | P3 | Proposta Auto Experience | Fora da execução; acesso retirado de Configurações | docs; auto; settings | Implementação e propostas preservadas para o pitch; botão e seção vazia removidos conforme pedido posterior. Não executar seleção por veículo. |
| 21 | P2 | Demonstração NEXT fora dos ajustes comuns | Menu simplificado com salvamento imediato; revisão humana pendente | settings | Origem em Configurações de desenvolvimento, sem Salvar, campos de veículo/autonomia ou atalhos extras. |
| 22 | P3 | Nome e endereço da estação | Identificação levada ao final da ficha; revisão física pendente | stations/PointDetailsScreen | Sem parágrafo nem identificação no topo; Dados simulados somente no final. Detalhes acessíveis e Sobre os dados preservados. |
| 23 | P2 | Pills de status e avaliação | Feito; usuário respondeu ok | stations/PointDetailsScreen | Transparência alinhada a 03; manter conteúdo da seção Avaliações. |
| 24 | P1 | Banner e estimativas sincronizadas | Feito; usuário respondeu ok | stations; utils/autonomia | Dispensa limitada à condição; reserva exata de 5%; depende da bateria compartilhada. |
| 25 | P2 | Carregadores e confirmação | Feito; usuário respondeu ok | stations; stationPresentation | Entender Recarga não confirmada e manter função de segurança. |
| 26 | P3 | Padrão dos cartões da ficha | Alerta reposicionado e carregadores com fundo por status; revisão física pendente | stations/PointDetailsScreen | Nome/endereço → aviso de evitar se houver → status/classificação → carregadores → estimativas → demais cartões. Fundo de carregadores sempre presente, seguindo status. |
| 27 | P2 | Identificação de catálogo sem repetição | Feito; usuário respondeu ok | stations; identificacaoDados | Depende da identificação geral em 03/23/25. |
| 28 | P3 | Cartões Estimativas e Conectores | Estimativas unificadas após carregadores; revisão física pendente | stations/PointDetailsScreen | Removido cartão repetido; autonomia, chegada, espera e recarga no mesmo local. Conectores preservados. |
| 29 | — | Preservar conteúdo de Comodidades próximas e Avaliações | Revisão visual/textual autorizada aplicada | stations/PointDetailsScreen | Comodidades com largura adaptável; retirados aviso secundário e demonstrativas do total de avaliações. Notas, comentários, ações locais e identificação geral no rodapé preservados. |
| 30 | P1 | Persistência offline de fotos e favoritos | Parcial; candidata offline preparada, sem instalar | offline; storage; telas de imagem/perfil/ficha; inicialização nativa | Instalação atual ainda depende do Metro e falhou ao abrir offline. Candidata Release com código/fotos embutidos foi compilada e verificada; instalação e teste físico pendentes. Sem perda de registros. |
| 31 | P3 | Pesquisa catálogo/Supabase e ampliação transferida do 01 | Investigação concluída; mapa vazio corrigido, revisão visual pendente | docs; data/fixtures; map/mapSearchScope | 72 fichas completas, 12 imagens reutilizadas e 180 comentários novos de cenário. Mapa sem busca inclui todo catálogo; raio explícito e filtros respeitados. Revisão física pendente. Ver S43/S44. |
| 32 | P2 | Proposta de área interna | Implementado; conferência física pendente | presentation; settings; preferences; storage; perfil/mapa/ficha | Área __DEV__ agora tem somente resumos de Caio/urbano e Marina/viagem; um toque aplica a base completa. Carros transparentes. Dados normais preservados. Ver S38. |
| 33 | P2 | Referência inicial de localização | Feito: FIAP padrão restaurada; escolhas salvas preservadas | data/demonstracao; LocationContext | FIAP usada quando não há escolha; origem já salva e GPS preservados. NEXT continua opção explícita. |
| 34 | P2 provisória | Textos de respostas da FluIA | Implementado; revisão humana pendente | assistant/chatEngine; programmedAnswers; tests/assistantKnowledge | 25 respostas preparadas, seis brincadeiras/easter eggs e consultas contextuais. Frases lúdicas delimitadas não interceptam prioridades reais. Regras, reserva e ranking preservados. |
| 35 | P2 provisória | Voz da FluIA | Seletor removido por pedido; Google TTS pesquisado | settings; assistant/speechPlayback; docs/reconhecimento-de-fala-fluia.md | Voz padrão pt-BR ativa, sem usar escolha anterior. Cloud TTS e STT são propostas distintas ainda sem integração, contratação ou mudança nativa. S40 superado neste ponto. |



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

## Histórico de 22/10 — situação anterior ao novo feedback

**Retrato histórico superado pela revisão de 23/10 e pela tabela inicial atualizada.** Pesquisa/proposta não equivale a funcionalidade implementada. As contagens desta etapa não representam a conclusão atual do backlog.

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
| 24 | Feito; revisado por feedback | Aviso dispensável menor/mais escuro e estimativas resumidas sincronizadas com bateria. | b3dade0; 8ef9d3f; 30ad83f |
| 25 | Feito; revisado por feedback | Exemplo removido; confirmação investigada/preservada e destacada em faixa. | 894aea3; 52676a5; 30ad83f |
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

### Fechamento técnico desta execução

- Suíte completa: 173/173, TypeScript aprovado, ESLint zero erros e um aviso herdado. Último complemento `30ad83f` passou em TypeScript/ESLint e apresentação/filtragem dirigidos após a suíte completa.
- `validacao-feedbacks-web.json`: aprovado, zero erros de página. Três configurações (320 px/fonte maior/claro, 393 px/padrão/claro, 393 px/maior/escuro/alto contraste), distribuição total das fontes, Switch, rodapé final, toast, aviso dispensável que reaparece, títulos com fundo e resumo de viagem sem paradas.
- Fluxos dirigidos: arraste/digitação/cancelar/salvar bateria; popup simplificado; consulta/retorno da FluIA; rotas internas redirecionadas em produção; três paradas com numeração/nome correspondentes.
- Offline Chromium: todas as 15 fotos públicas do manifesto carregaram efetivamente sem rede; perfil reabriu/recarregou; requisição sem cache falhou como esperado. Não equivale a offline no iPhone.
- `validacao-ficha-final.json`: complemento aprovado para status de manutenção com cor de texto e faixa âmbar no próprio grupo de carregadores. Captura `ficha-contraste-final.png` inspecionada.
- Capturas web de ficha, aviso de saída e conversa inspecionadas. Não comprovam render Skia, teclado/voz nativos, desempenho ou VoiceOver humano.
- Consolidação reconferida limpa em `abd5dfacaf51350b32fa77066ee849dbfcc9fbdc`. Metros 8106/8116 e servidor 8118 mantidos com PIDs iniciais; bloqueio de push e hooks preservados. Nenhuma operação remota, nova dependência, compilação ou instalação.
- Todos os dez comentários foram tratados nos checkpoints FB01–FB07; não foi recebida aprovação humana global após as correções. Próximas decisões: reconhecimento de fala/novo binário (12), piloto automotivo/imagens (20), cenários completos e armazenamento separado (32), prova física de offline (30).
- Registro de estados solicitado pelo usuário preenchido acima, com commits de cada item. Nenhum item parcial foi classificado como validado.

## Revisão humana de 23/10/2026 — instrução vigente

- Usuário aprovou explicitamente 02, 04–10, 13, 14, 18, 23–25, 27 e 28. Isso registra o feedback desses itens; não certifica Android/Release/VoiceOver/desempenho.
- 01: usuário informou que ainda não foi compreendido. Naquele momento suspensas novas alterações; a implementação anterior apenas identificou paradas calculadas e não mudou desenho/seleção do percurso. Pergunta de esclarecimento enviada.
- 03 incompleto; 12 e 31 permanecem A FAZER na perspectiva do objetivo final, apesar de pesquisas feitas. 20 e 32 também incompletos. Não classificar pesquisa/proposta como implementação concluída.
- 21: menu precisa de nova definição; esclarecimento solicitado. 22: usuário aprovou espaçamento, mas pediu retirar texto de demonstração; frase exata em esclarecimento.
- 30: usuário testará depois; não executar mudanças/testes no iPhone automaticamente.
- Mudanças objetivas autorizadas: 11 status durante fala; 15 cor; 16 alinhamento/rodapé/versão; 17 alinhamento; 19 exclusão total do laboratório; 20 largura sem scroll horizontal; 26 dois cartões quando couberem/títulos maiores e bold; 29 padrão igual aos demais; 33 retorno à FIAP.

### R01 — 11: Explicando durante fala

- Arquivos: `FluiAssistantSheet.tsx`, `fluiaVisualStatus.ts`, `tests/fluiaVisualStatus.test.ts`.
- Estado de reprodução tem prioridade sobre temporizador de resposta, preview visual e conexão enquanto a voz está efetivamente falando. Ao concluir/parar, volta ao estado aplicável.
- Verificações: TypeScript, ESLint e testes de voz/estados (`../output/ux-feedback-20261023/r01-*`). Confirmação de áudio físico após correção pendente.

### R02 — 15/16: cores, alinhamento e revisão 2.2

- Arquivos: perfil `.tsx/.styles.ts`, configurações `.tsx/.styles.ts`, `package.json`, `package-lock.json` (só metadados de versão), `app.config.js` (só versão).
- Configurações do perfil em amarelo com texto/ícone contrastantes. Sair da conta centraliza grupo ícone/texto com 14 pt de espaço. Rodapé contém somente Flui 2.2.0.
- Versão do código/configuração agora 2.2.0; nenhuma dependência/SDK alterada. Binário físico instalado continua com nome/metadados anteriores até compilação autorizada, que não foi executada. Não confundir versão da interface servida pelo Metro com instalação nova.
- Verificações: TypeScript, ESLint, diff e comparação das dependências antes/depois (`r02-*`). Revisão humana após ajuste pendente.

### R03 — 17: alinhamento dos cartões de fonte

- Arquivos: `SettingsScreen.tsx`, `.styles.ts`.
- Ícones T de tamanhos diferentes agora ficam em áreas iguais de 32 pt; seleção ocupa slot igual de 24 pt e textos usam a mesma altura de linha. Bordas/radius continuam uniformes, sem deslocar o conteúdo selecionado.
- Verificações: TypeScript, ESLint e diff (`r03-*`). Geometria web e inspeção visual serão conferidas no fechamento desta rodada; aprovação humana após correção pendente.

### R04 — 01: correspondência entre destino e resumo (esclarecimento recebido)

- Problema esclarecido: seletor anunciava paradas, mas resumo não correspondia nem identificava onde parar. Causa: contagem do seletor vinha das paradas candidatas do catálogo, enquanto resumo usava as exigidas pelo cálculo.
- Arquivos: `TripPlannerScreen.tsx`, `utils/tripPlanner.ts`, `tests/tripPlanner.test.ts`.
- Seletor calcula cada destino com origem/bateria/autonomia atuais. Resumo da viagem usa a mesma descrição e lista explicitamente os locais das paradas, dentro do próprio cartão. Cenário inviável não é anunciado como viagem completa com zero paradas.
- Verificações: TypeScript, ESLint e testes do planejador, incluindo catálogo com 3 candidatas que exige 0 ou 3 conforme carga/autonomia (`r04-*`). Revisão humana após correção pendente.

### R05 — 19: excluir totalmente laboratório da Orb

- Nova instrução humana substitui preservação anterior do laboratório.
- Removidos rota `/orb-lab`, `OrbLabScreen`, protótipo exclusivo `EnergyOrbPrototype`, apresentação exclusiva e testes desse protótipo. Acesso interno removido. Busca de dependências confirmou uso restrito ao laboratório.
- Orb ativa, Reacticx/Skia, gestos e preview de estados da FluIA preservados. Registros históricos permanecem como histórico, sem recursos executáveis do laboratório.
- Verificações: TypeScript, ESLint do menu e busca sem referências executáveis (`r05-*`). Sem recompilar ou alterar dependências nativas.

### R06 — 33: FIAP como origem padrão

- Arquivos: `src/data/demonstracao.ts`, `tests/demonstracao.test.ts`.
- FIAP volta à primeira opção e ao padrão para preferências sem origem. Coordenada alternativa permanece como escolha explícita, renomeada de Referência NEXT para NEXT conforme item 21.
- Escolhas já salvas são preservadas; se um aparelho tiver NEXT escolhido, usar Origem → FIAP → Salvar aplica a troca sem limpar outros dados. GPS não modificado.
- Verificações: TypeScript, ESLint e testes de origem/planejador (`r06-*`).

### R07 — 21: menu interno conforme novo detalhamento

- Arquivo: `src/features/settings/InternalPresentationScreen.tsx`.
- Retirados campos editáveis de veículo/autonomia, resumo/botão de bateria e laboratório. Origem em menu suspenso com NEXT/FIAP e demais opções; Salvar usa ação primária roxa de largura total.
- Ao salvar origem, preserva veículo/autonomia já configurados para o perfil. Não inventa novos perfis nem afirma que seleção completa do item 32 já exista; associação de novos perfis continua a fazer.
- Verificações: TypeScript, ESLint e testes de configuração (`r07-*`). Menu de desenvolvimento terá teste web separado, sem instalar aplicativo.

### R08 — 22: retirar parágrafo do catálogo

- Arquivo: `src/features/stations/PointDetailsScreen.tsx`.
- Confirmação humana identificou o texto “Catálogo de simulação…”. Parágrafo removido da apresentação visual; identificação curta Dados simulados permanece, com detalhes no rótulo acessível e em Sobre os dados.
- Verificações: TypeScript, ESLint dirigido e diff (`r08-*`). Item 03 permanece aberto a nova revisão, sem alegar eliminação completa de toda repetição.

### R09 — 26: duas colunas e títulos maiores

- Arquivos: `PointDetailsScreen.tsx`, `.styles.ts`, `stationLayout.ts`, `tests/stationLayout.test.ts`.
- Limiar de leitura ajustado para permitir dois cartões no iPhone com fonte padrão/maior do app; ampliação nativa e telas estreitas continuam podendo empilhar. Títulos de 12/600 para 16/800, sem margem que desalinhava ícones; cabeçalho com altura mínima consistente.
- Verificações: TypeScript, ESLint e testes de largura/escala (`r09-*`). Geometria e render web serão conferidos no fechamento; revisão humana pendente.

### R10 — 29: mesmo cartão completo das demais seções

- Arquivos: `PointDetailsScreen.tsx`, `.styles.ts`.
- Comodidades e Avaliações agora usam contorno/radius do cartão, cabeçalho integrado e corpo com padding, iguais a Estimativas/Conectores. Antes só os títulos tinham uma faixa avulsa.
- Textos, dados, listas, notas e interações dessas seções permanecem sem alteração; nova autorização humana permite padronizar o contêiner.
- Verificações: TypeScript, ESLint, diff dirigido e testes de apresentação (`r10-*`). Revisão visual posterior pendente.

### R11 — 20: proporções sem scroll horizontal

- Arquivos: `autoPresentation.ts`, `AutoExperienceScreen.tsx`, `tests/autoPresentation.test.ts`.
- Removidas larguras mínimas que forçavam exploração lateral. Moldura em cada proporção fica limitada à largura útil, preservando razão largura/altura; rolagem horizontal removida. Conteúdo pode rolar verticalmente, sem reduzir fonte.
- Verificações: TypeScript, ESLint e matriz de proporções/larguras/fontes (`r11-*`). Parte de seleção por marca/modelo e imagens continua a fazer; não declarada concluída.

### R12 — 20: largura medida após carregamento

- Arquivo: `AutoExperienceScreen.tsx`.
- Conferência web detectou largura de 12 px (apenas bordas) na moldura. Diagnóstico: HTML estático tinha width=0 e primeira renderização cliente calculava outra largura; mudanças de formato atualizavam altura, mas atributo de largura permanecia antigo.
- Área passa a ser medida com onLayout, com estado inicial consistente no servidor/cliente. Depois da medição, a mudança real de largura atualiza a moldura. Sem forçar largura mínima ou scroll lateral.
- Roteiro inicial também procurava subtítulo no nome acessível do destino; corrigido para conferir nome e texto separadamente. Falhas preservadas nos JSONs de primeira execução; não atribuídas todas ao app.
- Verificações: TypeScript, ESLint, testes de proporção e medição web dirigida antes do checkpoint.

- R12: medição real em viewport 320 px confirmou molduras de 280×157,5, 280×373,33 e 280×105; largura útil e três proporções preservadas.

### R13 — 03: linguagem restante nos fluxos

- Nova passada em mapa, busca, viagem, FluIA, onboarding, rota e Auto Experience: usa “origem do cenário”, “catálogo local”, “dados simulados” e identificação real da origem da bateria; evita repetir “demonstrativo” e o termo técnico “sem telemetria” no Auto.
- Avisos de disponibilidade não confirmada, linha reta, compatibilidade, reserva de 5% e distinção de GPS permanecem. Conteúdo das avaliações da ficha (29) não foi alterado.
- Metadados internos/tipos/nomes de função não foram renomeados. Testes de texto acompanham a terminologia mantendo asserções de segurança.
- Verificações: TypeScript, ESLint e suíte completa (`r13-*`). Nova revisão humana ainda necessária; não marcar 03 aprovado apenas por essa revisão de código.

- R13: suíte inicial encontrou expectativas textuais antigas em resumo/chat/flag; atualizadas para exigir identificação explícita da simulação na nova terminologia, sem remover verificações de disponibilidade/alcance. Log inicial preservado em `r13-check.log`; resultado final em `r13-check-final.log`.

### R14 — 26: legibilidade do cabeçalho em duas colunas

- Inspeção das capturas mostrou Funcionamento comprimindo o ícone no cartão estreito. Título simplificado para Horário e ícones preservam sua largura nos cabeçalhos. Não muda horário/status nem dados.
- Verificações: TypeScript, ESLint dirigido e diff aprovados; validacao-horario.json confirmou ícone de 20 px, separação de 8 px e título dentro do cabeçalho. Captura ficha-horario-final.png inspecionada após exportação.

## Fechamento da revisão de 23/10

- Esclarecimentos recebidos: 01 precisa corresponder paradas anunciadas ao resumo e mostrar os locais; 21 menu suspenso de origem/NEXT, Salvar destacado, sem veículo/autonomia/atalhos; 22 retirar especificamente Catálogo de simulação. Aplicados nos checkpoints R04/R07/R08.
- Código/configuração em 2.2.0; instalação física continua Flui 2.1 até nova compilação autorizada. Dependências idênticas, nenhum SDK atualizado.
- Commits: R01 `ed6e221`; R02 `8fda536`; R03 `d818560`; R04 `8efd3d0`; R05 `9e69aec`; R06 `4798e0d`; R07 `c22b890`; R08 `468b586`; R09 `ae01c15`; R10 `9aee492`; R11 `2e9acca`; R12 `4ada4ca`; R13 `9376081`; R14 `35a8037`.
- Suíte final R13: 174/174; TypeScript aprovado; ESLint sem erros, um aviso herdado em ConnectivityContext:48. R14, apenas texto/ícones, passou em TypeScript/ESLint dirigidos sem repetir a suíte inteira.
- `../output/ux-feedback-20261023/validacao-web.json`: aprovado em 320/393 px, zero erros de página. Confere alinhamento das fontes, rodapé, botão amarelo, seletor/resumo com zero e três paradas, ficha em duas colunas no padrão e três proporções automotivas sem scroll horizontal.
- `validacao-menu-interno.json`: aprovado em desenvolvimento, sem erros; alternou FIAP/NEXT e salvou origem preservando veículo/autonomia/bateria do perfil de teste. Não alterou preferências do iPhone.
- Inspeção de capturas web de fonte, ficha, avaliações, proporções e menu realizada. Falhas iniciais preservadas: expectativa incorreta do roteiro e largura de moldura após hidratação (corrigida R12). Nenhuma dessas evidências certifica mapa/voz/Skia/teclado/desempenho nativos.
- Manifesto offline da nova exportação contém 15 fotos locais. Teste efetivo offline anterior permanece evidência web, sem equivalência ao iPhone. Usuário fará a conferência física do item 30 posteriormente.
- Consolidação reconferida limpa em `abd5dfacaf51350b32fa77066ee849dbfcc9fbdc`; servidores 8106/8116/8118 com PIDs preservados; bloqueios de push intactos. Sem publicação, ações GitHub ou instalação/recompilação nativa.
- Itens 12, parte principal de 20, 31 e 32 continuam a fazer. Próxima decisão útil: escopo do piloto de fala e escolha dos perfis/modelos/dados dos cenários; não criar serviços ou arquitetura automaticamente. 03 aguarda retorno sobre a nova linguagem. Silêncio não equivale a aprovação.

## Segunda revisão humana de 23/10 — backlog agora com 34 itens

- 01: ampliar destinos, incluindo RJ; origem da viagem pode ser a configurada, sem seletor independente. Não forçar contagem de paradas: depende da carga/autonomia e da distância.
- 12, seleção completa de veículos em 20, ampliação em 31 e cenários completos em 32 continuam a fazer. Item 30 será testado pelo usuário depois.
- 17: usuário ainda percebe desalinhamento; 19/21 mover origem para Configurações com salvamento imediato, sem botão Salvar (esclarecimento recebido).
- 22: levar identificação Dados simulados ao final da ficha. 26: reduzir ligeiramente título para fonte grande. Novo 34: melhorar textos das respostas da FluIA, sem alterar regras ou alegar IA generativa.

### S01 — 17: corrigir deslocamento real do indicador

- Arquivos: SettingsScreen.tsx/.styles.ts. Círculos herdavam marginLeft de 10 pt dos cartões de aparência, ficando deslocados à direita dentro do slot centralizado. Removida a margem só para fontes; slot do indicador com largura fixa. Ícones T agora compartilham a linha inferior, apesar dos tamanhos diferentes.
- Verificações: TypeScript, ESLint dirigido e diff. Geometria web será conferida após exportação; iPhone ainda depende de revisão humana.

### S02 — 19/21: origem diretamente nas Configurações

- Função transferida para PresentationOriginPreference, embutida em Configurações apenas em desenvolvimento; removida a página intermediária Ferramentas internas. Rota antiga apenas redireciona para não quebrar links salvos.
- Seleção no menu salva imediatamente, sem botão Salvar. Mantém bloqueio durante gravação; falha restaura seleção anterior e informa erro. Veículo/autonomia/bateria/favoritos não são modificados.
- Verificações: TypeScript, ESLint dirigido e testes de configuração; interação e persistência web de desenvolvimento serão conferidas após checkpoint.
- S01 `3b02d0e`; indicador centralizado depende de nova revisão física, sem inferir aprovação pelo silêncio.

### S03 — 22/26: identificação no final e títulos mais compactos

- Arquivos: PointDetailsScreen.tsx/.styles.ts. Dados simulados retirado do topo e movido após todas as seções da ficha. Detalhe acessível e Sobre os dados preservados.
- Títulos de 16 para 14 pt, mantendo bold 800 e alinhamento dos ícones; altura de linha 20. Redução pequena para evitar quebra na fonte Maior sem remover escala nativa.
- Verificações: TypeScript, ESLint dirigido e diff. Conferir cartões com fonte maior na matriz web e no iPhone.

### S04 — 01: origem configurada e viagens mais longas

- Arquivos: data/destinosViagem.ts, TripPlannerScreen.tsx, tests/tripPlanner.test.ts. Origem agora é a preferência do cenário, sem seletor independente na viagem; mudanças em Configurações atualizam o planejamento.
- Cinco destinos no RJ: Paraty, Angra dos Reis, Rio de Janeiro, Cabo Frio e Búzios. Cidades/coordenadas aproximadas; paradas novas são cenários fictícios interpolados, sem afirmar existência de postos ou roteiro rodoviário. Motor de cálculo/reserva não alterado nem contagem artificial forçada.
- Com FIAP/400 km/70%, Campinas exige 0, Rio exige 1 e Cabo Frio/Búzios exigem 2 paradas no modelo; carga/autonomia diferentes mudam esses resultados. Todas as paradas aparecem em resumo/mapa/lista na ordem calculada.
- Verificações: TypeScript, ESLint e testes de planejamento, incluindo novos destinos, bateria zerada bloqueada e ausência de paradas quando alcance basta.
- S02 `6484277`; S03 `814833b`. Validação humana posterior pendente.

### S05 — 34: primeira revisão das respostas da FluIA

- Arquivos: chatEngine.ts, fluiAssistant.ts, programmedAnswers.ts, tests/chatEngine.test.ts. Recomendações começam pela sugestão, explicam a prioridade e mostram a chegada calculada com a bateria atual; perguntas explicativas usam linguagem mais direta.
- Retiradas construções como comodidade(s)/cadastrada(s). Disponibilidade do cadastro não é anunciada como fila real. Reserva mínima exata, identificação da simulação e confirmação de funcionamento/compatibilidade preservadas.
- Sem mudar pontuação, filtros, regras de intenção ou motor determinístico; primeira passada editorial, ainda sem aprovação humana. Item 12 continua sem captura de fala.
- Verificações: TypeScript, ESLint e testes de chat/motor, incluindo correspondência da chegada e avisos nas cinco prioridades. S04 `9114bf2`.

### S06 — 31: ampliar primeiro a base simulada (nova prioridade humana)

- Usuário pediu adiar item 01 até haver paradas suficientes na base e escolheu explicitamente ampliar simulação para NEXT. Item 01 fica pendente; expansão anterior dos destinos em S04 é preservada, sem nova tentativa de resolver seu planejamento.
- Fonte atual: 12 estações simuladas, concentradas em bairros de São Paulo. Planejador continua separado, usando destinosViagem.paradas; simples adição no mapa não o conecta automaticamente à nova base. Integração será reavaliada depois da base, sem alegar solução do 01.
- Arquivos: fixtures/expandedChargingStations.ts, chargingStations.ts, tests/expandedCatalog.test.ts. Adicionados 54 pontos, total 66 (47 SP, 19 RJ), incluindo entorno do NEXT, interior, Vale do Paraíba, litoral, Rio e Região dos Lagos.
- Pontos novos são fictícios, com coordenadas de cenário e endereços identificados. Não representam postos/rodovias verificados. Sem novos favoritos, fotos atribuídas a estabelecimentos, comentários ou avaliações. Ilustração vetorial existente atende pontos sem imagem, sem rede.
- IDs, imagens, avaliações, dados e favoritos das 12 estações existentes preservados; sem migração, Supabase, serviços pagos ou dependências novas. Estados e conectores variados, calendário estruturado e distâncias desde origem atual.
- Verificações: TypeScript, ESLint, integridade/IDs, cobertura, filtros e bloqueio de manutenção; conferência web posterior. Desempenho/mapa nativo com base ampliada ainda sem confirmação física.
- S05 `269999c`; revisão editorial inicial das respostas, sem aprovação humana inferida.

### S07 — 19: confirmação de origem em toast escuro

- Arquivos: PresentationOriginPreference.tsx, SettingsScreen.tsx/.styles.ts. Sucesso/falha da origem usam o toast flutuante existente das Configurações (3,2 s), com fundo roxo escuro fixo e texto branco, inclusive no tema escuro. Removida mensagem permanente entre os campos.
- Indicador de gravação único no nível da tela; componente não duplica overlay. Salvamento automático continua, sem botão Salvar.
- Verificações: TypeScript/ESLint dirigidos e diff; teste de sucesso/falha e cor do toast web no fechamento.
- Nova classificação humana: emojis indicam esforço, não aprovação. Offline 30 falhou no iPhone segundo usuário; sintomas/percurso solicitados sem bloquear demais tarefas. Não tratar evidência web como solução nativa.

- S06: primeira checagem apontou nome incorreto do parâmetro de tempo no teste (agora). Depois, diagnóstico dirigido identificou duas expectativas do harness: 6 pontos novos (12 totais) dentro de 10 km de NEXT, e teste antigo de horários que também limitava distância a 10 km. Corrigidos os cenários para medir cobertura real e isolar horário com raio amplo; regras do aplicativo não foram relaxadas. Logs iniciais preservados.

### S08 — 26: cabeçalho colorido mais baixo

- Arquivo: PointDetailsScreen.styles.ts. Altura mínima de 72 para 52 pt; padding vertical de 12 para 8 pt. Conteúdo pode ampliar a altura quando exigido por acessibilidade; ícones/títulos mantêm alinhamento e fonte reduzida da S03.
- Verificações: TypeScript, ESLint dirigido e diff; inspeção visual com fonte Maior após exportação.
- S06 `0c537b1` (66 estações); S07 `1402257` (toast escuro).

### S09 — 31: tornar a cobertura ampliada consultável

- Arquivos: filterOptions.ts, SearchFiltersScreen.tsx, expandedCatalog.test.ts. Opções de raio compartilhadas, incluindo 50/200/1000 km, permitem ver pontos fora da capital; antes a tela oferecia apenas 500 m/1/5 km. Raio padrão 10 km e filtros escolhidos preservados.
- Distâncias continuam em linha reta desde a origem; raio amplo não indica alcance da bateria. Disponibilidade/horários/conectores continuam sendo filtrados normalmente. Não muda cálculo do item 01.
- Verificações: TypeScript/ESLint e integração do catálogo com filtro amplo e disponibilidade; UI web será conferida.

### Diagnóstico inicial — 30 offline no iPhone

- Relato humano novo: não funcionou. Sintomas (fotos/dados vs abertura do app) solicitados, sem aguardar para fazer os demais ajustes.
- Fonte local ios/fluichargemap/AppDelegate.swift: DEBUG carrega bundle da LAN/Metro 8116; caminho não DEBUG usa main.jsbundle. Logo, abertura a frio sem Metro é limitação possível do binário de desenvolvimento, não corrigida por service worker web.
- Fotos atuais usam require local; em desenvolvimento o asset ainda pode ser entregue pelo servidor. Não há evidência de perda do AsyncStorage. Não apagar dados nem forçar cache nativo sem diagnóstico; nenhuma instalação/compilação/configuração nativa alterada.
- Item 30 permanece falhou no iPhone / diagnóstico em andamento; solução e teste nativos ainda pendentes.

### S10 — 34: revisar também a resposta resumida visível

- Arquivos: assistantPresentation.ts, tests/assistantPresentation.test.ts. O chat exibe resumo por padrão; revisar só chatEngine deixava as frases novas sob Ver explicação completa. Resumo agora começa Sugiro, explica a prioridade escolhida e mostra chegada/distância de forma direta.
- Cinco prioridades geram motivos diferentes; potência não é promessa de velocidade e disponibilidade cadastrada não é fila real. Simulação, reserva de 5% e confirmação de funcionamento/compatibilidade permanecem.
- Verificações: TypeScript, ESLint e testes de resumo/chat/motor. Captura da resposta resumida e expandida será conferida no desenvolvimento; ainda sem validação humana.

### S11 — 31/29: não atribuir notas a estações sem avaliações

- Evidência visual em ficha-nova-393.png: a ficha mostrava nota 0,0 e o gráfico fixo de distribuição de estrelas, apesar de nenhum dado de avaliação nos pontos novos. Correção necessária para não atribuir estatística inexistente à base ampliada.
- Arquivo: PointDetailsScreen.tsx. Sem avaliações no catálogo, pill e seção informam ausência e não exibem distribuição fictícia; avaliar localmente continua disponível. As 12 estações antigas mantêm o conteúdo e a distribuição existentes, conforme preservação do item 29.
- Verificações: TypeScript/ESLint dirigido, diff e conferência visual de ponto novo vs antigo. Não gera avaliações ou altera dados do usuário.

## Fechamento da segunda revisão — 23/10/2026

- Em caso de pergunta sem resposta, continuar tarefas independentes e registrar a dúvida; usuário poderá responder ao acordar. Não tomar silêncio por aprovação, escolha de arquitetura, contratação ou autorização de instalação.
- Emojis do usuário representam esforço estimado. Verdes 19/26 tratados imediatamente; os vermelhos não se tornam concluídos por pesquisa ou mudanças parciais.
- Commits: S01 `3b02d0e`; S02 `6484277`; S03 `814833b`; S04 `9114bf2`; S05 `269999c`; S06 `0c537b1`; S07 `1402257`; S08 `698783f`; S09 `2f1c64b`; S10 `f1693c9`; S11 `ff1e5a7`.
- Última suíte completa, após S10: 181/181, TypeScript aprovado e ESLint sem erros (um aviso herdado). S11 é ajuste visual condicional: TypeScript/ESLint e comparação web dirigida de avaliação nova/antiga passaram; suíte inteira não repetida após esse ajuste.
- Pasta de evidências: `../output/ux-revisao-20261023`. `validacao-configuracoes.json` passou em 320/393 com três fontes, centros dos indicadores, base dos ícones, dimensão/radius iguais, persistência e falha recuperável de origem. Teste anterior à mudança do toast.
- `validacao-toast.json`: passou no tema escuro/fonte Maior, fundo #241038 e texto branco, desaparecimento automático, persistência, recuperação de erro e redirecionamento antigo.
- `validacao-ficha-catalogo.json`: conferência da ficha com títulos em uma linha e cabeçalhos de 52 pt na fonte Maior, identificação no final, 66 resultados em raio amplo, busca Búzios e ficha nova. `validacao-fluia.json`: resumo visível e texto expandido revisados, zero erros, captura inspecionada. `validacao-avaliacoes.json`: estação nova sem nota/distribuição e antiga preservada.
- Falhas de harness preservadas: erro no nome do parâmetro de horário/expectativa de quantidade/isolamento de raio em testes da base; tentativa web quando Metro estava inativo; campo genérico de texto e busca de explicação ainda resumida. Roteiros dirigidos corrigidos, sem atribuir essas falhas automaticamente ao app.
- Capturas web de fontes, toast, ficha, ponto novo e resumo da FluIA inspecionadas. Não são confirmação física de voz, mapa/Skia, offline ou desempenho do iPhone. Offline nativo continua falhou/pendente de diagnóstico.
- Na conferência durante a rodada, antigos processos 8106/8116/8118 já não estavam ativos. Somente Metro experimental 8116 foi restabelecido no diretório e branch corretos, LAN 192.168.0.130, novo PID observado 67777. Não reiniciados 8106/8118. Servidor 8120 é temporário, local, apenas desta QA.
- Consolidação reconferida limpa em abd5dfacaf51350b32fa77066ee849dbfcc9fbdc; bloqueio de push/hooks intactos. Sem ações remotas, publicação, novas dependências, migração, build/instalação ou alteração do código nativo.
- Para conferir a cobertura no iPhone: Busca → Limpar busca → Raio 1000 km → Ver pontos no mapa. Filtros adicionais podem reduzir os resultados; distâncias são em linha reta, não alcance da bateria.
- Próximo ponto consistente: base ampliada pronta; item 01 continua pendente de revisão da ligação entre catálogo e planejamento. 12/20/32 ainda precisam de implementação e decisões específicas; 30 aguarda sintomas para diagnóstico. Revisão 34 está disponível para feedback, sem aprovação presumida.

### S12 — 01: retomar após base pronta, usando o catálogo do mapa

- Etapa posterior à ampliação/conferência da base, respeitando a ordem pedida. Arquivos: utils/catalogTripPlanner.ts, utils/tripPlanner.ts (constantes compartilhadas/descrição inviável), TripPlannerScreen.tsx e testes.
- Planejador e seletor usam as mesmas estações do mapa, seus IDs, nomes e coordenadas; não interpolam novas paradas fictícias entre extremos. Origem permanece a preferência configurada. Catálogo completo é considerado para viagem, sem aplicar raio/filtros da busca de proximidade.
- Busca local prioriza menos recargas; empate por menor distância. Cada trecho precisa preservar 5% exatos antes de arredondar e só aceita recarga possível segundo horário/status/conectores do cadastro. Alvo de saída 80% preservado. Linha reta, tempo sem trânsito/espera/recarga e compatibilidade não confirmada continuam explícitos.
- Viagem direta com 5–20% na chegada é exibida como apertada, sem impor uma parada desnecessária apenas para chegar a 20%. Contagem não é forçada para parecer haver várias paradas.
- Nos cenários FIAP/70%, Cabo Frio exige 1 parada com autonomia 400 km e 3 com 200 km; 150 km exige 5. Resultado depende dos dados/horários atuais, não representa um roteiro rodoviário validado.
- Atualização de horário não recentraliza o mapa quando as coordenadas do plano continuam iguais. Plano sem sequência suficiente fica inviável; não inventa recarga ou afirma que não existe nenhuma estação alcançável.
- Verificações: TypeScript, ESLint e testes de rota direta, três paradas, menor número de recargas, manutenção/fechamento, reserva exata, entradas inválidas e correspondência com a base SP/RJ. Conferência web dirigida e revisão humana ainda pendentes.

- S12: primeira suíte dirigida detectou fixture de teste que ainda mantinha calendário estruturado 24h enquanto trocava só o texto de horário. Cenário fechado corrigido para testar fallback e calendário fechado separadamente; precedência do calendário e motor não alterados. Log inicial preservado.

### Verificação final após retomada do 01

- S12 `856b0b3`: TypeScript/ESLint, 24 testes dirigidos e suíte completa 188/188 aprovados. Um aviso ESLint herdado, sem erros.
- `validacao-viagem-catalogo.json`: aprovado, zero erros de página; três contextos isolados FIAP → Cabo Frio: 400 km/70%=1 parada, 400 km/40%=2 paradas e 200 km/70%=3 paradas. Seletor e resumo correspondem e exibem nomes do catálogo. Contextos de navegador não alteraram dados do iPhone.
- Captura viagem-400-40.png inspecionada. Testes verificam coordenadas/IDs da mesma base e reserva exata; evidência web não comprova renderização nativa do mapa nem roteiro real. Revisão humana do novo comportamento pendente.
- Exportação final e manifesto de 15 fotos locais atualizados após S12. Pontos novos usam ilustração vetorial, sem novos downloads de imagens.
- Atualização posterior ao fechamento anterior: item 01 foi retomado somente depois da base pronta e conferida, conforme ordem solicitada. Não permanece apenas na contagem antiga dos destinos. Próximas pendências: diagnóstico nativo offline, captura de fala, seleção por veículo e cenários completos; dependências de decisão específicas continuam registradas.
- Metro experimental 8116 permanece disponível no diretório/branch da tarefa. Servidor temporário de QA 8120 encerrado no fechamento; não encerra Metro nem reinicia ambientes protegidos.

### S13 — 30: cópias persistentes de fotos no iPhone

- Relato humano detalhado: app abriu offline, mas faltaram fotos de perfil/carro/estações, lista de favoritos e dados dos pontos; mapa de fundo não foi o problema. Não atribuir o caso apenas a arranque sem Metro nem considerar imagem como solução completa do item.
- Lacuna comprovada no código: require de imagem em desenvolvimento pode resolver URI do Metro; telas não escolhiam cópia persistente no dispositivo. Implementada preparação das 15 imagens públicas/demonstrativas em Documents/flui-demo-images-v1, com nomes por hash e validação MD5. Nada de URLs privadas ou arquivos do usuário entra nesse armazenamento.
- Arquivos: src/offline/*, app/_layout.tsx, telas de mapa/perfil/ficha/avaliação/Configurações e StationVisualCover. Todas essas imagens escolhem file:// quando a cópia está íntegra. Web continua com caminho e service worker anteriores.
- Preparação em segundo plano (3 arquivos simultâneos), deduplicação, tentativas após reconectar/voltar ao app e consulta local antes da rede. Em offline não dispara download para imagem ausente. Cópia parcial/corrompida não é exibida como preparada. Versionamento por MD5 não substitui silenciosamente imagem nova por antiga.
- Configurações → Uso sem conexão informa preparação/conclusão e oferece nova tentativa quando incompleta. Não promete mapa de fundo, navegação ou abertura a frio do binário de desenvolvimento sem Metro.
- Reutilizados módulos ExpoAsset 12.0.13/ExponentFileSystem 19.0.24 já presentes no SDK54 e Podfile.lock; APIs conferidas no código instalado e protegidas por disponibilidade. Nenhuma alteração em package.json/lock/Podfile, módulo novo, instalação ou compilação nativa.
- Verificações: TypeScript/ESLint sem erros; suíte 194/194. Testes de concorrência, cache recriado sem rede, integridade/versão/arquivo parcial, URI não local e leitura real das 15 fotos em disco sem novos downloads. Esses testes usam IO controlado/arquivos do computador, não certificam execução no iPhone.
- Metro compilou o JavaScript iOS com HTTP200, sem exibir/salvar o bundle nem credenciais. Não é build ou instalação nativa. Reteste físico obrigatório para comprovar a correção; investigação de favoritos/dados continua, sem assumir perda ou apagar registros.

### S14 — 30: não tratar falha de leitura como favoritos apagados

- Defeito reproduzido no tratamento de erros: getJsonItem capturava qualquer falha e devolvia [], também em leitura antes de uma gravação. Isso podia esvaziar visualmente listas e permitir substituição posterior baseada num estado não lido. Ligação com o relato físico continua hipótese, sem depurador nativo conectado nesta conferência.
- Arquivos: storage/readStoredJson.ts, jsonStorage.ts, perfil, ficha e onboarding. Só chave ausente recebe fallback; falhas de leitura/JSON são sinalizadas com mensagens fixas sem expor conteúdo. Atualizações derivadas de leitura falha param antes de gravar.
- useFluiStorage já mantém snapshot anterior quando recarga falha. Perfil diferencia carregamento/erro de ausência real de favoritos, não anuncia contagem zero desconhecida e oferece Tentar novamente. Ficha informa erro local e suspende alteração de favorito enquanto a leitura está indisponível.
- Auditoria dos chamadores: preferências/splash/hooks já capturam leitura falha. Conclusão do onboarding passou a tratar falha sem continuar ou deixar rejeição sem tratamento. Nenhum registro apagado, migrado, substituído por padrão ou marcado como simulado.
- Verificações: testes de chave ausente/favoritos preservados, falha impedindo gravação derivada e JSON inválido sem conteúdo na mensagem; TypeScript/ESLint, testes completos e UI dirigida serão registrados no fechamento.
- S13 `88aae10`: preparação das fotos disponível por atualização do Metro. A confirmação física do status e dos dados offline permanece pendente.

### Fechamento técnico — item 30, resposta sobre fotos e dados

- Suíte 197/197 aprovada, TypeScript e ESLint sem erros (um aviso herdado da suíte geral). Mudança final de contagens do perfil passou em TypeScript/ESLint dirigidos, sem repetir a suíte inteira.
- `../output/ux-offline-iphone-20261023/validacao-dados-locais.json`: aprovado, zero erros de página. Em contextos isolados, falha de leitura não mostrou Nenhum favorito salvo ou contagens zero; nova tentativa recuperou os dois favoritos sem rede. Na ficha, dados do catálogo permaneceram, edição de favorito ficou bloqueada durante falha e foi recuperada sem alterar IDs salvos.
- Verificações de fotos usam IO injetado e cópias reais no computador; não são teste do sandbox do iPhone. Native SDK/Podfile e compilação de JS iOS conferidos; preparação local e UI nativa precisam de confirmação física.
- Bundle iOS servido com HTTP200 e indicadores de presença de perfil, catálogo, armazenamento de favoritos e preparação nativa de fotos. Indicador inicial buscava ID construído em execução; trocado para nome do módulo do catálogo. Nenhum conteúdo de bundle/credencial exibido ou salvo.
- Nenhum alvo de depuração nativa disponível nesta consulta; não foi possível observar diretamente leitura/cópia no aparelho. Não abrir/controlar o telefone nem mudar instalação para contornar esse limite.
- Como retestar: abrir Flui online na rede que alcança Metro, entrar em Configurações → Uso sem conexão e aguardar Fotos do perfil, veículo e catálogo preparadas neste dispositivo. Manter app aberto, desligar a conexão e conferir fotos, favoritos e ficha de um favorito. Se houver falha, registrar qual item e qualquer mensagem; status indisponível nesta instalação não é tratado como sucesso.
- Documentos/AsyncStorage do usuário não foram apagados, redefinidos nem migrados. Fotos preparadas são somente assets demonstrativos já existentes. Sem alteração de SDK/dependências/Pods, build nativo, instalação, publicação ou operações GitHub. Metro experimental mantido.
- Item 30 segue sem aprovação/validação física, incluindo dados além de imagens. Limitação de iniciar o binário de desenvolvimento sem Metro continua separada deste caso, pois o usuário informou que o app abriu.

### S15 — 30: indicador explícito de imagens preparadas e pedido de mapa offline

- Commit de implementação: `97c9f00`. Arquivos: src/offline/OfflinePhotosStatus.native.tsx, offlinePhotosPresentation.ts e tests/offlinePhotosPresentation.test.ts. Configurações → Uso sem conexão agora mostra cartão verde com ícone e Imagens preparadas, contagem 15 de 15 e barra completa. Durante a preparação mostra progresso; pendência/instalação indisponível recebem mensagem própria, sem anunciar conclusão. Nova tentativa preservada.
- A confirmação exige todas as imagens e verificação concluída; durante nova conferência não anuncia conclusão antecipadamente só por manter o contador anterior. A barra tem rótulo e valor acessíveis, textos respeitam a escala e as cores seguem tema/alto contraste. Não anuncia mapa ou dados de favoritos como preparados com base apenas em fotos.
- Verificações aprovadas: TypeScript, ESLint dirigido, diff sem problemas e 9 testes dirigidos (3 de estado do indicador, 6 do armazenamento de fotos, incluindo cópias reais sem rede no computador). Suíte completa não repetida por se tratar de alteração localizada; última completa anterior: 197/197.
- Metro experimental 8116 mantido no ambiente da tarefa. Bundle JavaScript iOS compilado e servido com HTTP200, presença de título/barra confirmada sem exibir conteúdo. Primeira busca por texto com acento escapado não encontrou o rótulo; normalização de escapes confirmou sua presença. Compilação JavaScript não é execução/validação física ou nova build nativa.
- Tentativa de prévia web isolada do componente nativo interrompida após duas falhas do harness de empacotamento React Native/SVG/Flow. Não modificar dependências para contornar o harness. Log indicador-visual.log preservado em ../output/ux-offline-iphone-20261023; não há aprovação visual web ou física desta etapa. Logs de tipos/lint/testes e indicador-bundle-ios.json na mesma pasta.
- Como conferir: online, abrir Configurações → Uso sem conexão, aguardar Imagens preparadas / 15 de 15 imagens, manter app aberto e testar fotos sem rede. Dados/favoritos continuam requerendo reteste físico próprio. Não interpretar silêncio como validação.
- Mapa em raio de 5 km: analisado, não implementado. Integração Google atual não oferece pacote de região offline; restrições de armazenamento também impedem coletar tiles Google. Reduzir raio não resolve esse limite. Evidências oficiais e proposta em ux-ui-pesquisas-e-propostas.md: fonte licenciada/integração apropriada, raio inicial 5 km, zoom e bytes medidos antes de reduzir para 3/2/1 km se necessário. Sem estimativa fictícia de MB.
- Troca relevante de arquitetura/provedor e eventual nova build permanecem dependentes de decisão humana pelo protocolo. Nenhum download de mapa, compra, novo módulo, credencial, atualização de SDK, instalação, alteração da consolidação ou operação remota executado.

### S16 — 30: recorte inicial do mapa ajustado pelo usuário

- Pedido mais recente substitui raio inicial de 5 km: área visível no zoom normal com pelo menos 1 km adicional além de cada borda. Não é raio de 1 km em torno do centro. Critério registrado em ux-ui-pesquisas-e-propostas.md.
- Somente leitura do mapa e interfaces/nativo da versão instalada. cacheEnabled não é preparação Google offline no iPhone; a integração atual não expõe pacote offline dessa área. Conferidas documentação primária da biblioteca e política Google. Nenhuma falsa indicação de mapa preparado, alteração de zoom/gestos, captura persistente ou prefetch introduzido.
- Possível conferir manualmente a permanência do trecho visualizado durante a sessão, sem rede, mas isso não é download persistente. Resultado físico não observado, recurso de mapa offline continua não implementado. Decisão sobre outra integração ainda pendente; recorte menor não elimina essa dependência.
- Verificação proporcional: leitura de código/tipos e diff documental. Sem mudança de aplicativo, sem repetir testes, sem mudar dependências, build, instalação ou servidores.

### S17 — 30: relato físico de cobertura offline ampla

- Usuário informou: “o mapa offline cobre uma área gigantesca”. Evidência humana de cobertura ampla no teste atual do iPhone, posterior à orientação de conferir a região já carregada. Extensão/zoom não medidos; não atribuir tamanho exato ou mecanismo de armazenamento a esse relato.
- Ampliação/download adicional fica em espera: preservar o funcionamento existente, sem trocar provedor ou alterar zoom por esse motivo. Não foi implementado pacote cartográfico pelo Flui.
- Não há confirmação específica de persistência após encerrar/reabrir o app ou reiniciar o aparelho. Esse limite permanece sem testar, sem invalidar a cobertura observada. Fotos, favoritos e dados essenciais do item 30 mantêm seus próprios estados; relato sobre mapa não os valida automaticamente.
- Apenas registro de continuidade e conferência do diff; nenhum código, servidor, dependência, instalação ou dado do usuário alterado. Nenhum teste repetido.

### S18 — 30: falha física ao abrir já sem conexão

- Novo relato: “o app nao abre se eu já estiver sem internet”. Atualiza limite antes não testado; cobertura ampla do mapa na sessão anterior não demonstra abertura offline.
- Configuração local reconferida por leitura: AppDelegate.swift, no ramo DEBUG, retorna somente a URL LAN do Metro 8116, sem fallback local. A fase Bundle React Native code and images do projeto define SKIP_BUNDLING=1 em Debug. O ramo não DEBUG procura main.jsbundle no próprio aplicativo. Isso explica a dependência de inicialização desta configuração, embora não tenha sido capturado erro/log diretamente do binário instalado.
- Dependência é alcançar o Metro no computador pela rede local, não necessariamente ter internet pública. Fotos preparadas/AsyncStorage/mapa em memória não substituem o código inicial do aplicativo. SplashScreen lê preferências locais, sem bloquear por uma consulta à internet.
- Proposta específica: preparar artefato nativo não DEBUG com código e assets embutidos, mantendo SDK/dependências e consolidação. Não é correção por Fast Refresh. Antes de instalar, conferir conteúdo embutido, assinatura/identidade, cenários offline e impacto em dados/atualização. Não prometer persistência do mapa só por embutir código.
- Recompilação/instalação continuam exigindo autorização explícita pela restrição permanente do usuário. Nenhuma executada, nenhum arquivo nativo alterado. Primeiro passo proposto é preparar artefato sem instalar nem substituir o app atual; instalação permanece uma decisão separada após revisão do resultado.
- Leitura de código e diff documental, sem repetir testes. Item 30 permanece parcial/falhou na abertura offline, sem atribuir automaticamente o sintoma a perda de fotos/favoritos.

### S19 — 30: candidata offline autorizada, sem instalação

- Usuário autorizou preparar versão com código e assets embutidos, **sem instalar nem substituir o app atual**. Autorização não inclui publicação, provisionamento remoto, dependências novas ou alteração da consolidação.
- Implementação `2ee0997`: cache de imagens reconhece primeiro o arquivo local embutido e valida seu MD5. Primeira abertura Release offline não exige uma sessão online prévia só para copiar imagens já presentes no próprio app. Arquivo ausente/corrompido pode usar cópia persistente; URI HTTP não é buscada offline. Aviso de dependência do Metro aparece apenas no desenvolvimento.
- Arquivos: src/offline/offlineAssetCache.ts, OfflineAssetsContext.native.tsx, OfflinePhotosStatus.native.tsx; tests/offlineAssetCache.test.ts. Novo teste verifica as 15 imagens reais sem rede/cópia prévia, fallback seguro e rejeição de imagem corrompida sem cópia.
- Verificações anteriores à compilação: TypeScript, ESLint (sem erros; aviso herdado), 203/203 testes e diff aprovados. Não equivalem a abertura física no iPhone.
- Compilação Release para iphoneos/arm64 em andamento com Xcode27.1, workspace existente, dependências/Pods presentes e assinatura local existente. Diretório exclusivo ../output/ux-offline-release-20261023/DerivedData. Sem acesso de instalação ao aparelho. Build Debug/Metro e fontes nativas preservados; não reutilizar DerivedData do ambiente Flui-teste-2.5.
- Candidata terá metadados Flui 2.2 / 2.2.0 / 20261023.1 ajustados **somente no artefato novo**, seguido de nova assinatura/verificação local. Info.plist e AppDelegate existentes não serão editados. Bundle ID preservado; eventual instalação futura seria atualização da mesma identidade, não app independente, e exigirá decisão própria.
- Ao terminar: conferir main.jsbundle, executável sem endpoint experimental do Metro, integridade das 15 fotos, arquitetura, assinatura e validade do perfil. Registrar tamanho/hash e indicar explicitamente ausência de teste físico. Nenhuma garantia nova de mapa offline por embutir o código.
- Logs e manifesto final serão mantidos em ../output/ux-offline-release-20261023. Se a compilação falhar duas vezes sem progresso, reavaliar a abordagem antes de continuar; não limpar outros ambientes/cache para obter espaço.

### S20 — 30: candidata offline preparada e verificada, sem instalação

- Compilação nativa Release iphoneos/arm64 concluída com sucesso na primeira tentativa. Código da implementação: `2ee0997`; registro prévio: `2b1ec08`. Não alterados workspace, AppDelegate, Info.plist, Pods, SDK, lockfiles ou versão instalada.
- Artefato: ../output/ux-offline-release-20261023/candidata/Flui-2.2-offline.app. Nome Flui 2.2, versão 2.2.0, build 20261023.1, mesma identidade com.guicunhasou.fluiuxmapa01. Metadados ajustados somente na cópia do produto, que foi reassinada com identidade local existente; verificação codesign deep/strict aprovada.
- Arquivo compactado: ../output/ux-offline-release-20261023/Flui-2.2-offline.app.zip, 26,1 MB (aplicativo expandido 74,7 MB). CRC do ZIP conferido e SHA256 registrado no manifesto. Nenhum IPA/exportação de distribuição, envio ou publicação.
- main.jsbundle presente, 6.874.122 bytes, Hermes bytecode v96. As 15 fotos foram encontradas no próprio aplicativo e comparadas por MD5 com os originais. Endpoint experimental do Metro ausente no executável; ramo Release do AppDelegate busca bundle local. Essa inspeção não comprova inicialização física nem permite prometer todas as funções offline.
- Assinatura e perfil local conferidos sem expor chave ou conteúdo sensível. Perfil de desenvolvimento existente com um aparelho provisionado, expira em 29/10/2026 às 22:13:17 UTC. Não houve renovação, provisionamento remoto ou instalação. Não confundir build Release local assinada para desenvolvimento com distribuição/App Store.
- 203/203 testes, TypeScript e ESLint sem erros (aviso herdado) antes da compilação. Preservados limites: abertura do zero, dados/favoritos, fotos, voz e mapa nativo ainda precisam de conferência física desta candidata. Região cartográfica persistente não foi implementada nem garantida.
- LEIA-ME.md e manifesto-candidata.json na pasta de saída explicam os resultados e o roteiro. Release não oferece Fast Refresh; controles exclusivos de __DEV__ ficam ocultos, conforme código existente. Flag temporária dos estados da Orb não foi desativada.
- Instalação atual e dados do iPhone intocados. Metro experimental PID67777/8116 permaneceu ativo. Consolidação reconferida limpa em abd5dfacaf51350b32fa77066ee849dbfcc9fbdc. Bloqueio de push e hooks locais preservados. Não reaproveitado ambiente Flui-teste-2.5 nem encerrado servidor protegido.
- Próximo passo depende de autorização própria para instalar/atualizar e conferir no aparelho. A autorização desta rodada foi somente preparar a candidata, sem substituir o Flui atual. Item 30 continua parcial; o aplicativo atualmente instalado não foi corrigido por essa preparação.

### S21 — 19/30: ícone alinhado e indicação offline neutra

- Feedback mais recente aplicado em `9c5c7b2`: toast usa ícone Info vetorial dentro de área fixa de 24 pt, sem depender do alinhamento da letra i em linha de texto. Fundo escuro e salvamento automático preservados.
- Retirada a frase sobre mapa de fundo/navegação externa do ConnectionNotice e da seção Uso sem conexão. Aviso sobre iniciar a versão de desenvolvimento com servidor permanece só em __DEV__, separado da confirmação das imagens.
- Cartão de fotos usa superfície/borda neutras, título e contador nas cores de texto; barra roxa. Somente ícone de conclusão fica verde. Estados incompleto/indisponível continuam distintos por texto e ícone; integridade e contagem não alteradas.
- Arquivos: SettingsScreen.tsx/.styles.ts, ConnectionNotice.tsx, OfflinePhotosStatus.native.tsx. TypeScript/ESLint dirigidos e diff aprovados antes do commit; conferência visual dirigida será registrada no fechamento.
- Fonte e Metro atualizados, sem instalação/recompilação nativa. O pacote offline preparado anteriormente é snapshot anterior a estes ajustes; não contém S21 nem a revisão posterior da ficha. Não sobrescrever esse artefato nem alegar que o iPhone recebeu outra instalação.
- Confirmado no catálogo atual: 54 pontos novos sobre os 12 originais, total 66 (47 SP/19 RJ). Vinculados ao 31, agora em espera. 12/32/34 em espera e 20 fora da execução conforme pedido explícito, sem remover trabalho existente.

### S22 — 30: retirar também a quantidade de imagens

- Novo feedback aplicado em `343c93d`: sem contador, total, barra numérica ou anúncio acessível de quantidade. Restam estado Preparando/Conferindo/Preparadas/Pendentes/Indisponível, explicação curta e nova tentativa quando necessária. Card neutro, somente ícone de conclusão verde.
- A contagem interna continua necessária para confirmar integridade de todas as imagens; não é exposta. Testes agora verificam estados em vez de uma barra removida. Arquivos: OfflinePhotosStatus.native.tsx, offlinePhotosPresentation.ts, tests/offlinePhotosPresentation.test.ts.
- TypeScript/ESLint, 203/203 testes e diff passaram após incorporar a nova orientação. Nenhuma instalação/recompilação nativa, nenhuma alteração de cache, dados ou mapa por esta simplificação.

### S23 — 26/28/29: ordem definitiva e leitura menos apertada

- Commit `fb91df5`. Ordem explícita do usuário prevalece: nome+endereço, pills de status+classificação, quantidade/confirmabilidade de carregadores, estimativas e demais cartões. Aviso dispensável de manutenção fica imediatamente antes das estimativas, preservando alerta relevante e ligação com o estado atual.
- Autonomia/chegada, espera simulada e recarga estimada concentradas num único cartão. Retirado cartão inferior repetido, sem mudar cálculo de alcance, reserva, bateria ou tempo de carga existente. Confirmação de funcionamento/compatibilidade permanece.
- Mais espaço entre cartões/linhas e corpo com padding16/gap10. Cabeçalho colorido permanece mínimo52, conforme decisão anterior. Dois cartões por linha somente quando largura de leitura suficiente; fonte Maior e tela estreita usam coluna única. Critério atualizado e testado.
- Comodidades usam largura flexível calculada também com escala da fonte para não partir Estacionamento no meio. Corpo de Horário ganha largura suficiente para temporariamente. Removidos subtexto de exemplos sob Avaliações e demonstrativas do total; notas, distribuição antiga, comentários, edição local e identificação geral no rodapé mantidos.
- Arquivos: PointDetailsScreen.tsx/.styles.ts, stationLayout.ts e tests/stationLayout.test.ts. Verificações: 203/203 testes, TypeScript/ESLint sem erros (aviso herdado), diff e lint final dirigido após ajuste de indentação.
- ../output/ux-ajustes-finais-20261023/validacao-ajustes.json: 14 conferências aprovadas, zero erros de página. Fichas normal/manutenção, 320/393, três fontes; ordem, estimativas únicas, palavras sem quebra, espaçamento e ausência dos textos solicitados. Toast em fonte Maior/tema escuro com centro do ícone conferido; home offline sem frase de mapa. Não é validação física do iPhone nem da renderização nativa do indicador de fotos.
- Capturas de conteúdo/commodidades/avaliações conferidas. Primeira tentativa de QA falhou por servidor estático sem resolução de rotas limpas, corrigido em servidor temporário próprio; não defeito do app. Primeira captura do toast pegou transição de fechamento do menu; captura final espera menu oculto. Evidências anteriores preservadas e sem repetir a matriz inteira por causa da captura.
- Bundle JavaScript iOS compilado pelo Metro com HTTP200; indicador presente, frase anterior e contador removidos. Não é compilação/instalação nativa. Cliente físico ainda não confirmado visualmente nesta rodada.
- 12/31/32/34 continuam em espera e 20 ignorado para esta execução. Nenhuma ampliação nova de dados, mudança no planejador, reconhecimento de fala, Supabase, cenários ou base da FluIA executada. Pacote offline anterior permanece intacto e não inclui S21–S23; informar antes de eventual instalação.

### S24 — 26/29: correção adicional das avaliações em conferência

- Inspeção da captura mostrou percentuais partidos e estrelas encostando no gráfico na fonte Maior. Tentativa `8065fc7` passou por tipos/lint, mas conferência dirigida detectou sobreposição na disposição vertical: flex0 encolheu a altura intrínseca do grupo. Não considerar esse checkpoint aprovado; falha visual registrada, embora o commit tenha sido criado antes de conferir o resultado da etapa assíncrona. Correção em andamento com altura intrínseca, seguida da mesma conferência dirigida; não repetir a matriz anterior inteira.

- Resolvido em `0345493`: altura automática e sem encolhimento no bloco vertical. Percentuais/rótulos ganham largura proporcional à fonte; nota/estrelas ficam acima do gráfico quando não cabe lado a lado. Não altera notas, percentuais, comentários ou ações do usuário.
- TypeScript/ESLint e diff aprovados; validacao-avaliacoes-altura.json passou nos quatro casos (320/393, Padrão/Maior), sem erros de página. Porcentagens em uma linha, estrelas contidas e distância de 16 pt entre grupos quando empilhados. Captura final inspecionada. Essa conferência ocorreu antes do commit corretivo.
- Falha anterior preservada em validacao-avaliacoes-final.json; não contar aquela tentativa como aprovação. Última suíte completa: 203/203, anterior à disposição visual adicional de avaliações; não repetida após mudança apenas de estilos, coberta por tipos/lint e geometria dirigida. Sem validação física desta disposição.
- Todos os ajustes atuais estão no código do Metro. A candidata nativa anterior continua snapshot `2ee0997`, sem S21–S24, e não foi instalada nem recompilada. Conferência visual humana no iPhone segue pendente, sem tomar silêncio por validação.

### S25 — 26/30: alerta junto ao endereço, fundo dos carregadores e aviso técnico removido

- `5137d09`: aviso de evitar ponto imediatamente após nome/endereço, antes de status/classificação. Dispensa por visita e condição relevante preservadas. Retirado somente o texto genérico Opção de recarga no catálogo da ficha; motor/regras de recomendação não alterados.
- Linha de carregadores sempre tem fundo/borda e conteúdo na cor do status: disponível verde, ocupado amarelo, manutenção vermelho e fechado/sem confirmação neutro. Não anunciar carregadores livres quando canChargeAt não confirma recarga; rótulos existentes e cálculos preservados. Ícone deixa de ter fundo verde próprio em estados de outra cor.
- `2bca95c`: removida a frase sobre iniciar a versão de desenvolvimento com servidor na seção Uso sem conexão. Indicador de fotos preservado. Remover a frase não altera a dependência de abertura da instalação de desenvolvimento.
- Arquivos: PointDetailsScreen.tsx/.styles.ts e OfflinePhotosStatus.native.tsx. TypeScript/ESLint sem erros/avisos nos arquivos dirigidos, diff e 19 testes de apresentação da estação/estados offline aprovados. Suíte completa não repetida para esta mudança visual/textual.
- ../output/ux-ficha-status-20261023/validacao-status.json: 12 casos aprovados, zero erros de página. Disponível, ocupado, manutenção, indisponível, disponível de potência menor e fechado; temas claro/escuro, fonte Maior, relógio fixado apenas nos contextos de teste. Fundo não transparente, borda/texto iguais ao status, aviso abaixo do endereço e dispensa funcional. Capturas disponíveis/ocupado inspecionadas.
- JavaScript iOS servido pelo Metro com HTTP200; aviso técnico ausente e indicador mantido. Não é compilação/instalação nativa nem conferência física. ZIP offline anterior preservado como snapshot antigo, sem incorporar estes ajustes.

### S26 — 20: retirar acesso Auto Experience de Configurações

- Novo pedido explícito aplicado em `569d9c8`: removidos botão Flui Auto Experience e seção Demonstrações locais, cujo único conteúdo era esse botão. Rota app/auto-experience.tsx, implementação e propostas preservadas para o pitch. Não é retomada do desenvolvimento do item 20.
- Arquivo: SettingsScreen.tsx. TypeScript/ESLint e diff aprovados; validacao-configuracoes.json passou nos temas claro/escuro com fonte Maior, sem erros de página. Sem botão/seção vazia, mantendo origem, Sobre os dados e Sair da conta. Primeiro roteiro de captura encontrou elemento removido durante atualização da página; falha de harness preservada e conferência ajustada para aguardar preferências e evitar rolagem durante a transição. Não houve correção adicional no aplicativo por causa disso.
- Evidências da rodada em ../output/ux-ficha-status-20261023. Commits funcionais: 26 `5137d09`, 30 `2bca95c`, acesso Auto `569d9c8`. Alterações disponíveis no mesmo Metro, sem reinstalação, recompilação nativa, publicação ou alterações em ambientes protegidos. Servidor temporário de QA encerrado ao final, após conferir origem; Metro 8116 preservado.
- 12/31/32/34 continuam em espera. Revisão física das mudanças novas pendente; não marcada como aprovação humana. ZIP Release anterior continua snapshot antigo e não deve ser confundido com a interface atual do Metro.

### S27 — 18: cartões externos e alinhamento do alto contraste

- Pedido explícito: cada preferência em seu próprio cartão; três cartões de fonte dentro de um cartão maior. Implementado em `befe7dc`, SettingsScreen.tsx/.styles.ts. Alto contraste usa título sem margens junto ao toggle, ambos centralizados na mesma linha; explicação fica abaixo. Fonte mantém ícones, rótulos e indicadores alinhados, preenchendo largura interna disponível.
- TypeScript/ESLint e diff aprovados. validacao-cards-iniciais.json: 12 casos web (320/393, Menor/Padrão/Maior, claro/escuro), igualdade de dimensões/alinhamento dos três cartões e centros do título/toggle com diferença menor que 1 px. Captura 320/fonte Maior/alto contraste inspecionada. Não é validação de VoiceOver ou alinhamento físico no iPhone.

### S28 — 18: preferência Reduzir movimento

- `52a117f`: campo reduceMotion salvo na preferência local existente, padrão false para registros antigos/valores inválidos. useReducedMotion combina a escolha local com a configuração do sistema, sem permitir desativar a redução do sistema pelo app. Durante carga das preferências o hook evita movimento até conhecer o ajuste salvo.
- Consumidores existentes do hook recebem a preferência: transições/feedback de botões, splash/carregamento, animação/abertura da Orb e movimentos programáticos do mapa. Não remove gestos, muda os sete estados temporários nem substitui a consulta determinística. Descrição do cartão informa quando o sistema está impondo a redução, com toggle marcado e desabilitado.
- Arquivos: types/storage, storage/fluiStorage, PreferencesContext, useReducedMotion, SettingsScreen e tests/motionPreference.test.ts. Tipos/lint e 206/206 testes aprovados nesse checkpoint. Casos de legado, persistência preservando bateria/filtros/favoritos e falha sem substituição dos dados.
- validacao-movimento.json aprovada, sem erros de página: salvar/reabrir; botão sem aumento ao passar ponteiro quando redução ativa; falha de escrita e recuperação; mudança de preferência do sistema tem prioridade sem alterar escolha local e volta à escolha local ao restaurar o sistema. Executado em contexto web isolado; animações/gestos da Orb nativa ainda não confirmados fisicamente.
- Sem SDK/dependência nova, módulo nativo, compilação, instalação ou alteração da consolidação. Código disponível no mesmo Metro. Pacote Release anterior continua snapshot antigo, sem estes recursos.


### S29 — 18: preferência Vibração nos toques

- `b09db6b`: opção persistente hapticsEnabled no armazenamento existente, padrão true para registros antigos. PreferencesContext aplica a escolha aos helpers de seleção/impacto usados pelos botões. Sem novo módulo, SDK ou dependência; expo-haptics já instalado. Durante leitura das preferências os helpers evitam emitir retorno tátil antes de conhecer a escolha.
- Arquivos: types/storage, storage/fluiStorage, PreferencesContext, utils/interaction, SettingsScreen e tests/hapticsPreference.test.ts. Tipos/lint sem erros (um aviso herdado) e 212/212 testes aprovados, registrados em ../output/ux-acessibilidade-20261023/final-check.log.
- Testes com pontes nativas simuladas verificam bloqueio/retomada dos dois helpers, web silenciosa, rejeição da API sem falha na ação, legado/booleanos, persistência preservando outros dados e falha de escrita. validacao-vibracao.json: três cenários web aprovados, sem erros de página (reabrir, falha e recuperação). Não comprova vibração física ou controle do retorno próprio do Switch do sistema.
- validacao-cards.json teve 12 casos web aprovados após as quatro preferências; o usuário informou depois que o alinhamento nativo continuava incorreto. Esse feedback prevalece e é tratado no S30. Nenhuma aprovação física presumida.

### S30 — 18: fonte e aparência primeiro; correção específica do Switch iOS

- `4871d3d`: Configurações começa com Acessibilidade. Cartões em ordem: Tamanho da fonte (três opções horizontais), Aparência (Claro/Escuro em duas opções horizontais), Alto contraste, Reduzir movimento e Vibração nos toques. Tema reaproveita persistência existente, agora com semântica de grupo/opções radio e estados selecionado/desabilitado. Não acrescentada preferência nova nesta etapa.
- Causa encontrada na versão local de react-native: Libraries/Components/Switch/Switch.js compõe alignSelf: flex-start no componente iOS. Isso prevalecia sobre alignItems: center da linha e não é reproduzido pelo Switch web. Estilo explícito alignSelf: center corrige essa regra nos três toggles; títulos desses controles usam altura natural da fonte. Sem deslocamento arbitrário ou escala do Switch. Confirmação visual física continua pendente.
- Usuário perguntou sobre verde neon e esclareceu que não solicitava alteração: cores atuais preservadas. Alto contraste é diferenciação de luminosidade, sem obrigação de uma tonalidade específica; não usar cor como único indicador de estado. A conversa não autoriza trocar a paleta por neon.
- Arquivos: SettingsScreen.tsx/.styles.ts. TypeScript, ESLint dirigido e diff aprovados. Última suíte completa 212/212 é a do S29; não repetida após esta reorganização visual. validacao-ordem-aparencia.json passou em 12 casos (320/393, três fontes, claro/escuro): ordem, larguras úteis preenchidas, conteúdo alinhado, sem rolagem horizontal, troca de tema e persistência ao reabrir preservando contraste, fonte, bateria e origem. Zero erros de página; captura final inspecionada. Não equivale a VoiceOver humano nem alinhamento nativo conferido.
- Duas primeiras execuções do roteiro foram reavaliadas: leitura de aria-checked em input web que usa checked, depois espera incompleta da hidratação. Resultados preservados em validacao-ordem-aparencia-tentativa-1/2.json. Corrigida somente a conferência (disabled nativo do input e espera do estado carregado); nenhuma mudança adicional no produto por essas falhas. Terceira execução aprovada com a espera corrigida.
- Metro 8116 reconferido no mesmo diretório/PID67777. Bundle JavaScript iOS HTTP200 com novos cartões e correção de alinhamento; disponível por Fast Refresh/recarregamento no cliente conectado. Não é compilação/instalação nativa ou prova de visualização no aparelho. iPhone bloqueado/em outro app não impede editar/testar; atualização visual depende de voltar ao aplicativo e acessar o Metro.
- Pacote Release offline anterior permanece snapshot 2ee0997, sem S21–S30, não instalado ou recompilado. Consolidação e ambientes protegidos não alterados; itens 12/31/32/34 continuam em espera, 20 reservado ao pitch. Sem publicação ou mudança remota.


### S31 — 19/21: origem somente na lista suspensa; identificação Flui 2.3

- `80880c7`: retirados título Origem da apresentação, explicação do cenário/salvamento e rótulo externo Origem. Permanece apenas o seletor com valor escolhido e chevron. Identificação acessível Origem: [valor], opções, fechamento e salvamento automático/toast preservados. Arquivo: PresentationOriginPreference.tsx. Tipos, ESLint dirigido e diff aprovados.
- `7291da0`: pacote e versão raiz do lockfile passam a 2.3.0; configuração de futuras compilações usa nome/CFBundleDisplayName Flui 2.3 e versão 2.3.0. Nenhuma versão de dependência mudou (comparação estrutural do lockfile confirmou apenas os dois campos raiz). Não alterados bundle ID, código nativo, buildNumber ou instalação física. Arquivos: package.json, package-lock.json, app.config.js; sintaxe e diff aprovados.
- Conferência dirigida validacao-origem-versao.json, em contexto web isolado: textos externos ausentes, origem NEXT salva automaticamente e preservada ao reabrir, bateria preservada e rodapé Flui 2.3.0. Sem erros de página. Não repetida a suíte completa para exclusão de três textos e metadados de versão.
- Mesmo Metro, sem reinício/reconfiguração ou compilação nativa. Fonte do rodapé é package.json; nome sob o ícone e versão da instalação atual do iPhone permanecem os da compilação instalada até atualização nativa autorizada. Não confundir nome no código com reinstalação concluída. Pacote offline anterior continua snapshot antigo Flui 2.2, intocado.


### S32 — 19/21: título Localização inicial

- `cd8acb6`: novo pedido aplicado em PresentationOriginPreference.tsx. Título Localização inicial acima do seletor, com mesma tipografia das demais seções e espaçamento padrão optionsList. Sem texto de apoio adicional. Salvamento automático, rótulo acessível e opções preservados.
- ESLint dirigido e diff aprovados. Mudança restrita a título e espaçamento; não repetidos testes de persistência, suíte completa ou matriz visual. Disponível pelo mesmo Metro, sem compilação/instalação nativa. Conferência física desta alteração pendente.


### S33 — 31: retomada e avaliação do catálogo/Supabase

- Retomada autorizada pelo usuário: 31 → 32 → 34 → 12; item 20 não retomado. Pesquisa em fontes primárias e diagnóstico local em docs/catalogo-next-e-supabase.md.
- Catálogo atual 66 pontos, 47 SP/19 RJ, 12 com imagens e 45 utilizáveis no relógio fixo. Matriz de 32 cenários executada, IDs/coordenadas/conectores/notas conferidos; sete testes do planejador aprovados. Evidências em ../output/ux-retomada-20261023. CLI tsx encontrou restrição de socket do sandbox; usado carregador node --import tsx, sem escalada ou mudança no produto.
- Com 200 km/70%, Rio tem duas recargas e Cabo Frio/Búzios três. Sem alteração no motor ou catálogo e sem declarar item 01 aprovado fisicamente. Trechos continuam em linha reta.
- Avaliação concluída: base local suficiente para o NEXT; Supabase só agrega com edição/sincronização entre usuários e fonte adequada. RLS, origem dos dados e offline exigem trabalho próprio. Não criados projeto, serviço, credencial ou dependência. Commit deste relatório registrado no próximo checkpoint.


### S34 — 32: área interna de cenários isolados

- Relatório 31: `41e9986`. Modelo/persistência 32: `0685248`; interface/integração: `f97421c`. Campo de apresentação em chave própria @flui:internalPresentation:v1, versão de schema e fila de gravação. Ativação/aplicação do cenário em uma única gravação. Nenhuma migração ou limpeza dos registros normais.
- Configurações → Cenários de apresentação, somente __DEV__; rota Release redireciona e preferências Release ignoram um cenário ativo salvo. Perfil urbano/viagem preparam o formulário, sem aplicar automaticamente. Campos de nome/foto, veículo/imagem/autonomia, bateria/origem, favoritos e avaliações por estação. Fotos entre duas alternativas existentes, sem URI externa/upload ou permissão nova. Avaliações do perfil não recalculam notas agregadas fictícias do catálogo. Histórico de uso também separado.
- PreferencesContext combina valores de cenário apenas durante modo ativo; mudança de bateria/origem nesse modo grava somente o cenário. useFluiStorage direciona favoritos/avaliações/histórico ao armazenamento isolado. Sair do modo preserva o cenário e volta aos registros normais. Falha de leitura impede gravação e falha de escrita mantém o estado anterior. Filtros, aparência e acessibilidade continuam preferências normais do dispositivo.
- Arquivos: features/presentation, app/presentation.tsx, PreferencesContext, useFluiStorage, SettingsScreen, HomeMapScreen, ProfileScreen, PointDetailsScreen e metadados/fontes offline. Duas fotos alternativas foram incluídas no cache existente (17 imagens); fotos e adaptações nativas existentes preservadas.
- Tipos/lint sem erros (aviso herdado) e 217/217 testes passaram, incluindo cinco novos de normalização, fila, falhas e isolamento. Conferência web em validacao-cenarios.json aprovada, zero erros: aplicação integral, perfil/favorito/comentário, origem no cenário, falha de saída e recuperação, restauração e igualdade de todas as chaves normais; sem transbordamento em 320/393, fonte Maior. Captura inspecionada. Não é teste físico/nativo ou certificação de Release/VoiceOver.
- Sem dependência, SDK, serviço, upload, instalação ou recompilação nativa. Assets adicionais ainda exigem preparação online na instalação Debug; não alteram a candidata Release antiga, que permanece snapshot 2ee0997 sem essas mudanças. Metadados, permissões e dados do app instalado não substituídos.
- Proteção adicional identificada na revisão dos métodos internos: rejeitar avaliação/histórico inválidos antes de gravar, preservando o registro de cenário anterior. Teste de regressão dirigido e hash corretivo registrados no checkpoint seguinte. Nenhuma evidência de perda em entradas válidas do formulário.


### S35 — 34: ampliação das respostas preparadas

- Correção adicional do cenário: `641efb8`, com seis testes dirigidos aprovados; entradas inválidas são rejeitadas antes da escrita e não removem uma avaliação/histórico do cenário anterior. Os dados normais continuam intocados.
- FluIA `ce1964f`: 24 respostas preparadas (antes três), com temas de preço/gratuidade, reserva, pagamento, conectores, energia/potência, reserva mínima, favoritos/avaliações, offline, voz, funcionamento da assistente, localização, Plano B, planejador, filtros, dados simulados, carga-alvo e ajuste de bateria. Cumprimento/agradecimento delimitados e fallback informam ausência de resposta preparada.
- Perguntas sobre bateria usam somente os valores recebidos do contexto (sem inferir ou salvar números de uma mensagem). Contagem de estações informa apenas o conjunto recebido, sem confundi-lo com catálogo completo. Pedidos de reservar/pagar/comparar preço não viram recomendações de recarga rápida. FAQ funciona mesmo sem estações ou bateria viável; recomendações seguem as regras e o corte exato de 5% anteriores.
- Arquivos: chatEngine.ts, programmedAnswers.ts e tests/assistantKnowledge.test.ts. Tipos/lint sem erros (aviso herdado) e 224/224 testes em fluia-check-final.log. Seis novos testes agrupam variações de perguntas, ações indisponíveis, contexto inválido, imutabilidade, contagem, ausência de estações e limites de palavras/negações. Primeira execução nova identificou falta da variante postos são reais; expressão corrigida e conjunto final passou antes do commit.
- validacao-fluia.json: quatro perguntas na interface web, incluindo custo de recarga rápida, ausência de captura de voz, bateria atual e Plano B; zero erros, texto/campo contidos em 320/393 com fonte Maior. Voz desligada no contexto de QA. Captura inspecionada; histórico pode oferecer Última mensagem quando o usuário está afastado do fim. Não é avaliação humana da qualidade dos textos nem teste de fala no iPhone.
- Mantidos motor determinístico, opções prontas, recomendações/Plano B, sete estados temporários e comportamento da leitura. Nenhuma chave, serviço generativo, busca de dados reais ou custo introduzido. Definições técnicas mantêm limites do carro/potência; referência primária de conferência: https://www.epa.gov/greenvehicles/charging-my-electric-vehicle-text-only.

### S36 — 12: investigação de reconhecimento de fala encerrada

- Relatório docs/reconhecimento-de-fala-fluia.md compara ditado do teclado, reconhecimento do sistema via módulo e Google Cloud V2; propõe tocar para falar, revisão do texto antes do envio, cancelamento, permissões, interrupção em segundo plano e tratamento de falhas. Explica integração com o motor atual, privacidade, custo ilustrativo e medição de latência.
- Recomendação técnica: prova de conceito nativa curta antes de contratar Cloud. Depende de decisão específica para novo módulo/configuração e Development Build; a autorização atual de pesquisa não inclui instalar/recompilar ou contratar. Captura continua não implementada; Ouvindo do preview permanece visual, sem fingir microfone funcional.
- Fontes oficiais/mantenedor consultados e vinculados no relatório. Alguns endereços históricos/V2 não estavam disponíveis; diferenças de versão estão explicitadas, sem estender automaticamente políticas V1 a V2 ou prometer pt-BR/offline no aparelho. Preço é referência pública de pesquisa, não cobrança/contratação ou orçamento garantido.
- Nenhuma permissão solicitada, áudio capturado, credencial criada/lida, serviço habilitado ou SDK/dependência adicionado. Nenhum teste de latência/transcrição alegado. Relatório e registro têm commit próprio, informado no fechamento.

### Fechamento da retomada 31/32/34/12

- Estado atual: 31 investigação concluída/base anterior reconferida; 32 implementado e tecnicamente conferido, revisão física pendente; 34 implementado/testado, qualidade da conversa aguarda feedback; 12 investigação concluída, implementação nativa depende de decisão.
- Evidências em ../output/ux-retomada-20261023. JavaScript iOS HTTP200 no mesmo Metro 8116/PID67777, contendo cenário interno, novas respostas e fotos alternativas; não equivale a compilação/instalação nativa ou prova de recebimento visual pelo iPhone.
- Consolidação reconferida limpa. Bloqueio de push e hooks preservados; sem ação GitHub, publicação, contratação ou mudança de servidor. Candidata offline antiga e instalação física preservadas. A candidata antiga não contém estes incrementos. Item 20 continua reservado ao pitch.


### S37 — 31: diagnóstico do mapa vazio e recuperação da busca

- Usuário informou mapa sem pontos mesmo com busca aparentemente vazia. Inspeção de leitura via inspector do Metro conectado ao bundle iOS confirmou 66 estações no PreferencesProvider, nenhum marcador de estação montado e estado de busca textual ainda preenchido (seis caracteres), combinado com raio padrão de 10 km. Não atribuída falha de chave/API, GPS ou perda de dados.
- `5c96f64`: busca por nome/cidade sem filtros explícitos consulta o catálogo inteiro; raio de exploração local permanece 10 km quando não há texto. Filtros/distância explícitos continuam aplicados. Botão X limpa o texto e um aviso visível permite limpar busca/filtros quando há zero pontos, mesmo com popup de recomendações recolhido. Não alterados registros salvos, disponibilidade, origem ou mapa nativo.
- Tipos/lint dirigidos, diff e três testes de escopo aprovados. validacao-mapa-perfis.json confere busca por Búzios, retorno aos pontos ao limpar e distância explícita, sem erros. Após Fast Refresh, leitura da árvore iOS confirmou busca vazia e 16 marcadores de estação montados (dez recomendáveis). Isso comprova componentes enviados ao mapa, não uma captura ou confirmação humana de pixels renderizados. Artefato iphone-mapa-depois.json em ../output/ux-feedback-20261023.
- Consulta de armazenamento assíncrona pelo inspector não retornou valores utilizáveis; diagnóstico adaptado à leitura síncrona da árvore React. Sem escrita em preferências, comando de navegação ou instalação por esse diagnóstico. Não solicitado consentimento para ler valores de ambiente/credenciais, que não foram acessados/exibidos.

### S38 — 32: substituir editor por perfis completos, um toque

- Novo pedido aplicado em `46d8c5f`: formulário substituído por dois cartões-resumo. Caio/urbano: FIAP, BYD Dolphin Plus, autonomia de cenário 400 km, 70%, três favoritos, duas avaliações e histórico. Marina/viagem: FIAP, Volvo EX30, 200 km, 35%, três favoritos no eixo SP/RJ, três avaliações e histórico. Fotos, comentários/notas e todos os parâmetros são fictícios/ilustrativos; autonomia não é ficha técnica verificada.
- Um toque aplica tudo; tocar novamente reinicia aquele perfil. Campo profileId opcional normalizado mantém compatibilidade com cenário personalizado anterior, sem migrar/gravar automaticamente ao carregar. Alterações feitas durante a apresentação não modificam as bases constantes dos perfis. Sair preserva o retorno aos dados normais. Aplicar perfil substitui intencionalmente somente os dados simulados ativos, como solicitado; não apaga favoritos/avaliações normais.
- Carro 1 reutiliza PNG transparente existente. Carro 2 ganhou recorte RGBA novo car2-transparent-v1.png, original intacto. Edição pela skill imagegen/ferramenta embutida; prompt e procedência em docs/assets/car2-transparent-v1.md. Alfa inspecionado, cantos e fundo transparentes; integração clara inspecionada. Novo asset incluído na preparação offline, total agora 18 imagens; pacote Release antigo continua intacto e anterior.
- Arquivos: presentationScenario, presentationProfiles, PresentationScreen, presentationImages, asset, metadados/fontes offline e testes. Tipos/lint e 18 testes dirigidos aprovados. Primeiras execuções do novo teste de base completa identificaram updatedAt ausente nas sementes; inclusão conferida e testes passaram antes do commit. Tentativa intermediária de substituição textual não encontrou a sequência esperada; abordagem reavaliada lendo a linha exata antes da correção, sem descartar trabalho.
- validacao-mapa-perfis.json passou: sem formulário, um toque aplica Marina, favorito/perfil/mapa corretos, PNG correto no cabeçalho, troca para Caio substitui toda base simulada e saída preserva todas as chaves normais. 320/393 com fonte Maior sem rolagem horizontal; captura inspecionada. Não é validação física dos perfis completos.

### S39 — 34: humor e easter eggs sob convite explícito

- `5802465`: seis respostas determinísticas para piada, piada de programador, 42, modo turbo, café para FluIA e descoberta de easter eggs. Frases inteiras delimitadas; não interceptam pouca bateria/necessidade real só por conter a palavra piada ou turbo. Não executam comandos ou mudam bateria, potência, dados ou motor.
- Arquivos: playfulAnswers.ts, chatEngine.ts e tests/assistantPlayful.test.ts. Lint/diff e 32 testes dirigidos aprovados. Primeira fixture de teste de café não tinha café entre comodidades; corrigida apenas a fixture, sem relaxar regras do motor.
- Sugestões para conferir: Conta uma piada, Café pra FluIA e 42. Revisão humana do tom ainda pendente. Item 35 novo: seletor da voz do sistema em implementação, sem áudio/serviço pago novo.


### S40 — 35: selecionar e ouvir vozes da FluIA

- `05c1ba6`: Configurações → Acessibilidade → Voz da FluIA. Lista opções em português fornecidas por expo-speech já instalado, Brasil primeiro; Padrão do dispositivo sempre disponível. Escolha salva automaticamente em speechVoiceId, sem alterar dados de perfil, bateria ou favoritos. Campo legado/valor inválido usa null (padrão).
- Botão Ouvir exemplo permite conferir a voz; Parar, fechar modal, sair da tela ou app em segundo plano interrompem a leitura. Listagem tem limite de três segundos; ausência/erro mantém opção padrão e tentativa manual. Voz removida/indisponível usa padrão ao falar, sem enviar a identificação inválida à síntese.
- O mesmo resolvedor atende exemplos e respostas reais da FluIA. Callbacks atrasados não retomam leitura cancelada. Estado Explicando continua enquanto a síntese indica fala. Incluída resposta preparada para Como mudar sua voz, com caminho correto da interface. Reconhecimento de fala continua fora deste ajuste; nenhum microfone ou serviço pago introduzido.
- Arquivos: SpeechVoicePreference, SettingsScreen/.styles, speechVoices, speechPlayback, FluiAssistantSheet, programmedAnswers, PreferencesContext, storage/fluiStorage, types/storage e testes. Nenhum pacote, lockfile, SDK, Pod ou permissão alterado. API conferida no código da versão local de expo-speech: getAvailableVoicesAsync e parâmetro voice de speak.
- Tipos/lint sem erros (aviso herdado) e 239/239 testes aprovados em ../output/ux-feedback-20261023/check-final.log. Sete testes novos para lista/ordem/duplicação, fallback/erros/tempo, normalização/persistência preservando registros, falha de escrita e cancelamento na consulta da voz.
- validacao-voz-humor.json passou, zero erros: português apenas, seleção/exemplo, persistência ao reabrir, falha e recuperação, leitura da piada com identificador escolhido/Explicando e retorno ao padrão após remover a voz da lista. API de síntese/vozes simulada no navegador, sem emitir áudio físico. 320/393 e fonte Maior sem transbordamento, captura inspecionada. Não declarar nomes disponíveis ou qualidade sonora do iPhone com base nessas vozes fictícias de teste.
- Código final servido no mesmo Metro por JavaScript iOS HTTP200 (bundle-ios-final.json); sem instalação ou recompilação nativa. Novos perfis e vozes ainda precisam de feedback humano. A leitura por inspector comprovou marcadores montados, sem afirmar conferência visual física. Nenhuma autorização antiga para candidata offline foi reutilizada; aquele artefato permanece anterior e intocado.


### S41 — 31/32: 72 estações, imagens existentes e endereços de cenário

- Catálogo passa de 66 para 72 pontos: Moema, Vila Olímpia (ID next-vila-olimpia), Santo Amaro, Copacabana, Tijuca e Petrópolis; distribuição 50 SP/22 RJ. Os 16 marcadores antes observados eram somente o recorte inicial de 10 km. Nenhum ponto anterior removido ou renumerado.
- Sessenta entradas adicionais reutilizam as 12 imagens originais por imageKey, sem duplicar assets, downloads ou aumentar a quantidade de imagens preparadas offline. Doze entradas originais preservadas. Notas/comentários agregados dos novos pontos permanecem vazios.
- Endereços plausíveis de cenário substituem “Local fictício para Flui NEXT”; não são estabelecimentos/endereço verificados. Identificação discreta de dados simulados no rodapé e Sobre os dados mantida. Nenhum dado real importado nem infraestrutura Supabase introduzida.
- Arquivos: expandedChargingStations.ts, expandedCatalog.test.ts e docs/catalogo-next-e-supabase.md. TypeScript, ESLint dirigido, diff e 14 testes de catálogo/planejador/escopo aprovados em catalogo-72-testes.log. Revisão visual física pendente; matriz histórica de 32 cenários não repetida.
- Commit deste checkpoint registrado no próximo checkpoint. Nenhuma instalação/build nativo ou alteração no Metro. Item 01 continua sem aprovação humana presumida.


### S42 — 35/12: remover seletor e avaliar Google para voz e transcrição

- Catálogo/endereço/imagens S41: commit `831464f`. Usuário rejeitou vozes do sistema e pediu retirada do seletor; removidos componente, estilos, acesso e método de atualização da preferência no contexto. FluIA usa voz padrão pt-BR; escolha antiga salva não participa da reprodução. Campo normalizado preservado no armazenamento para não fazer migração destrutiva. Utilitários puros/testados de compatibilidade mantidos, sem menu ativo.
- FAQ sobre mudar voz agora explica som/Parar e ausência de seleção/Cloud. Explicando continua pelo ciclo real do áudio. Arquivos: SettingsScreen/.styles, SpeechVoicePreference (removido), FluiAssistantSheet, programmedAnswers, PreferencesContext e speechPlayback.test.ts.
- TypeScript, lint sem erros (um aviso herdado de ConnectivityContext), diff e 239/239 testes aprovados em check-72-sem-seletor.log. Teste de reprodução padrão confirma ausência de identificador explícito. Revisão humana da nova saída continua pendente; síntese de teste não comprova naturalidade do iPhone.
- Pesquisa atualizada em docs/reconhecimento-de-fala-fluia.md: Google Chirp 3 HD pt-BR para saída, STT V2 para entrada, possibilidade de usar ambos com o motor local; amostras antes de escolher voz, revisão de transcrição antes de enviar, backend sem credenciais no app, billing e mudança nativa dependem de decisão. Não contratados/ativados serviços nem capturado áudio.
- Commit deste checkpoint registrado no fechamento seguinte. Nenhuma instalação, compilação nativa, troca de Metro ou mudança na consolidação.

- Conferência web final validacao-72-sem-seletor.json aprovada, sem erros: 18 marcadores no recorte inicial, Copacabana encontrada por busca, fichas novas com imagens originais carregadas/endereço atualizado e rodapé, seletor ausente, leitura com voz padrão mesmo com escolha antiga salva e Explicando durante fala. Contexto de teste isolado preservou bateria e campo legado. Primeira abertura do navegador foi impedida pelo sandbox; executado com permissão apropriada, sem modificar o produto por essa limitação.
- Mesmo Metro 8116/PID67777/diretório experimental reconferidos; inspeção de leitura do cliente iPhone em iphone-catalogo-72.json. Consolidação permanece limpa em abd5dfacaf51350b32fa77066ee849dbfcc9fbdc e push bloqueado. Nenhuma confirmação humana/visual física inferida desses testes.


### Fechamento S41/S42

- Commits: `831464f` (72 pontos, imagens reutilizadas e endereços) e `ce1402c` (retirada da seleção de voz, FAQ e pesquisa Google). Nenhuma publicação.
- Cliente iPhone conectado contém catálogo com 72 entradas, confirmado somente por leitura da árvore React; quantidade de marcadores montados não foi usada como prova visual. Bundle JavaScript iOS final HTTP200: novos locais, endereço atualizado, seletor ausente e FAQ atualizada (bundle-ios-72-sem-seletor.json). Não é instalação/build nativo ou audição da voz física.
- Para conferir: buscar Copacabana/Petrópolis, abrir ficha e verificar foto/endereço; Configurações não deve mostrar Voz da FluIA. A leitura permanece padrão pt-BR. Naturalidade Google e reconhecimento do usuário ainda são propostas, não funcionalidades implementadas. Custos, backend e mudança nativa continuam dependentes de decisão humana específica.
- Suíte final 239/239 aprovada, um aviso de lint herdado sem erros, QA web aprovada. Metro, consolidação protegida, candidata offline antiga, dados normais e bloqueios de publicação preservados. Revisão humana destes incrementos pendente.


### S43 — 31: mapa sem limite de distância implícito

- Usuário explicou que só vê os 18 locais e precisa buscar os demais. Retirado o raio implícito de 10 km no mapa livre, inclusive com busca vazia. Os 72 marcadores passam ao mapa; afastar o zoom/arrastar permite explorar outras cidades sem digitar. Zoom/origem inicial continuam na FIAP, sem enquadrar automaticamente SP/RJ inteiro.
- Distância escolhida explicitamente na busca/filtros continua respeitada, assim como filtros rápidos e filtros de status/potência. Nenhuma preferência salva ou registro do usuário foi apagado. Defaults de outras telas preservados.
- Arquivos: mapSearchScope.ts, HomeMapScreen.tsx, tests/mapSearchScope.test.ts. TypeScript/ESLint dirigido/diff e testes dirigidos de escopo/filtros aprovados (mapa-sem-raio-*.log). Casos cobrem todos os 72 sem texto, cidade distante, retorno à busca vazia, raio explícito e status.
- Próximo bloco: completar experiência dos 60 novos pontos conforme pedido: notas, comentários de cenário e períodos de menor movimento. Não confundir esta mudança com aprovação física.


### S44 — 31: completar os 60 pontos com a experiência dos 12 iniciais

- Mapa sem raio implícito S43: `4c8b775`. Catálogo continua 72 entradas com IDs/imagens e primeiras 12 fichas preservadas.
- Novas 60 fichas agora têm nota, total agregado e três comentários de cenário cada (180), autores fictícios/datas/notas por critério e retorno/recomendação. Comentários coerentes com estado de manutenção, indisponibilidade e fila; dados explicitamente criados para o cenário, sem atribuir depoimentos reais a esses lugares. Informação de origem mantida no rodapé/Sobre os dados.
- Horários diversificados com agenda correspondente, períodos de menor movimento quando operando e comodidades preenchidas. Conectores/potências/disponibilidade e cálculo de distância mantidos. Nenhuma mudança em favoritos, avaliações próprias, perfis ou armazenamento; não favoritar automaticamente as 60 estações.
- Arquivos: expandedChargingStations.ts, expandedStationExperience.ts, expandedCatalog.test.ts e docs/catalogo-next-e-supabase.md. TypeScript/lint sem erros (aviso herdado) e 240/240 testes aprovados em check-fichas-72.log, incluindo campos comparados com a ficha original, 180 IDs únicos/estação correspondente/critério/data/autor e preservação das regras do planejador.
- validacao-72-fichas-completas.json aprovada, zero erros: 72 marcadores sem texto, recuperação após raio explícito, Copacabana/Petrópolis com foto/nota/três comentários, sem vazio antigo e sem rolagem horizontal em 320/393 fonte Maior. Regressão da voz padrão/Explicando também passou. Inspector físico de leitura em iphone-mapa-72-sem-raio.json; não substitui visualização humana dos pontos no Google Maps.
- Disponível no mesmo Metro via Fast Refresh; nenhum módulo, serviço, build/instalação, publicação ou alteração na consolidação. Commit deste bloco registrado no fechamento seguinte.


### Fechamento S43/S44

- Commits locais `4c8b775` (catálogo no mapa sem busca obrigatória) e `7355c44` (60 fichas completas, notas/comentários/horários). Registro atualizado; sem publicação.
- Leitura do cliente iPhone conectado confirmou 72 entradas, 60 adicionais e 180 comentários adicionais (iphone-fichas-72.json). MapView recebeu 72 marcadores (iphone-mapa-72-sem-raio.json), sem limite implícito de 10 km. Isso comprova entrega dos componentes/dados, não conferência humana dos pixels nem desempenho medido.
- Para conferir fisicamente: busca vazia e filtros sem raio explícito → afastar o zoom e arrastar de SP ao RJ; abrir qualquer ponto novo e conferir nota, três comentários e horários. A abertura continua próxima da FIAP. Todos os 72 não cabem no enquadramento urbano inicial, mas permanecem disponíveis sem pesquisa.
- 240/240 testes e conferência web aprovados, um aviso de lint herdado sem erros. Sem alteração em dependências, serviços, armazenamento pessoal, instalações nativas ou consolidação. Revisão humana destes incrementos pendente.


### S45 — 31: nomes solicitados nos comentários do cenário

- `694273d`: acrescentados aos autores dos 60 pontos novos os 20 nomes fornecidos pelo usuário, com grafia/acentuação preservadas: Alexandre Barcelos; André Tritiack; Anderson Rodrigues; Antonio Sérgio; Artur Coelho; Bruna Matos; Daniel Corrêa; Gabriel Wulfrick; Heloiza Gabriolli; Leonardo Romão; Luís Carlos; Luiz Gustavo; Marcos Crivelaro; Mauricio Viana; Paula Regina; Rafael Piassa; Raíssa Fregolent; Thiago Keller; Thiago Yamamoto; Victor Atui Filho. Autores anteriores mantidos no conjunto.
- Arquivo: expandedStationExperience.ts. Comentários continuam conteúdo do cenário, sem atribuir depoimentos verificados. Textos, IDs, notas, datas, contagens e 12 fichas originais preservados; nenhuma gravação nas avaliações/favoritos pessoais.
- ESLint dirigido, diff e cinco testes de catálogo aprovados. Conferência dos dados gerados confirmou todos os 20 nomes presentes nos 180 comentários, sem duplicação de autor na mesma ficha. Exemplo para conferir: Flui Campinas contém Alexandre Barcelos. Suíte completa anterior 240/240 não repetida para esta alteração de nomes.
- Atualização de dados JavaScript no mesmo ambiente servido pelo Metro; disponível por Fast Refresh/recarregamento, sem instalar/recompilar. Visualização física dos novos nomes não declarada. Nenhuma publicação ou alteração na consolidação.


### S46 — 33: novas localizações iniciais; NEXT no topo

- Oito referências adicionadas às quatro anteriores: Campinas, Santos, São José dos Campos, Paraty, Rio de Janeiro — Centro, Rio de Janeiro — Barra, Cabo Frio e Búzios. Coordenadas de cenário já usadas no catálogo, sem GPS/geocodificação externa. NEXT é a primeira opção da lista; FIAP continua fallback/padrão e escolhas já salvas são preservadas.
- Lista suspensa com altura máxima e rolagem para 12 opções; nomes longos ocupam largura flexível sem expulsar chevron/check. Salvamento automático e feedback existentes mantidos. Não alterados bateria/autonomia ou bases dos perfis.
- Arquivos: data/demonstracao.ts, PresentationOriginPreference.tsx e demonstracao.test.ts. Tipos/lint/diff e 18 testes dirigidos de origem/perfis/cenários aprovados. Teste de estimativas passou a colocar a estação de teste perto de cada origem, evitando supor que todas as novas origens ficam em SP; não relaxada a reserva de bateria.
- validacao-origens-novas.json passou: NEXT primeiro, 12 opções, FIAP salva preservada, seleção automática/persistência de Búzios/Rio/NEXT, bateria/autonomia mantidas e extremos da lista alcançáveis em 320/393 fonte Maior. Primeira conferência do harness incluiu radios de fonte; delimitada ao menu, sem alterar o produto por essa falha.
- Mesmo ambiente/Metro, sem instalação ou publicação. Revisão física pendente. Commit deste bloco registrado no próximo checkpoint.


### S47 — 01: abrir ficha das paradas pelo planejador

- Localizações iniciais S46: `457d534`. Paradas calculadas agora abrem a ficha pelo marcador numerado do mapa, nome no resumo ou linha da parada. Todos encaminham o ID real da estação do catálogo, sem usar posição/índice como identificador.
- Botão superior da ficha retorna ao planejador quando aberto por ele, preservando a tela/destino/paradas na pilha. Se não houver histórico, retorna à rota do planejador. Origem/destino não viraram estações clicáveis; botão Ver mapa da ficha permanece acesso explícito ao mapa. Nenhuma rota externa iniciada ao abrir detalhes.
- Arquivos: TripPlannerScreen.tsx/.styles e PointDetailsScreen.tsx. Rótulos/pistas acessíveis, áreas tocáveis mínimas de 44/48 e chevron nas listas. Tipos/ESLint dirigido/diff e 24 testes do planejador aprovados.
- validacao-paradas-ficha.json passou: resumo/marcador/linha abrem estação correta e voltam com destino Cabo Frio e mesmas paradas; bateria/autonomia preservadas, zero erros de página e sem rolagem horizontal em 320/393 fonte Maior. Conferência web, sem declarar gestos físicos/VoiceOver humano.
- Disponível via JavaScript no mesmo Metro; sem build nativo/publicação ou mudança no motor de cálculo. Commit deste bloco registrado no próximo checkpoint.


### S48 — 31: reforço do entorno NEXT e Flui Arca

- Planejador/fichas S47: `b33c0f4`. Oito estações adicionais no entorno NEXT: Arca, Vila Lageado, Campus Oeste, Jaguaré, Corifeu, Rio Pequeno, Politécnica e Vila Universitária. Distâncias desde a referência NEXT entre 0,18 e 1,96 km. Coordenadas de cenário, sem alegar estabelecimentos reais ou GPS.
- Catálogo agora tem 80 pontos (58 SP/22 RJ), com 68 adicionais aos 12 originais. Cada novo ponto reutiliza as imagens existentes e recebe ficha completa, três comentários e horários/conectores/comodidades; total de comentários adicionais passa a 204. IDs anteriores preservados. Flui Acesso NEXT foi chamado Flui Arca antes do commit, por correção do usuário; ID next-acesso-next preservado.
- Arquivos: expandedChargingStations.ts, expandedCatalog.test.ts e mapSearchScope.test.ts. Suíte completa atual passou 242/242 (check-origens-paradas-next.log), tipos/lint sem erros (aviso herdado). Teste específico confere as oito distâncias de até 2 km e fichas completas; teste do mapa agora confere os 80 sem busca. Após alteração textual Arca, leitura dirigida dos dados confirmou nome, ID, distância e três comentários, sem repetir a suíte por um nome.
- Fontes originais e imagens/cache/instalação preservados; nenhum serviço ou dado remoto importado. Revisão física pendente. Próximo bloco de nomes: 12 originais no padrão Flui + localização e Butantã → Villa-Lobos. Commit deste bloco registrado no próximo checkpoint.


### S49 — 31: nomes Flui + localização e correções solicitadas

- Entorno NEXT S48: `8086753`. Padronizados os 12 originais: Flui Higienópolis, Flui MASP, Flui Consolação, Flui Jardins, Flui Pamplona, Flui Lins de Vasconcelos, Flui Parque Aclimação, Flui Paraíso, Flui Cambuci, Flui Liberdade, Flui Ana Rosa e Flui Brigadeiro.
- Correções textuais explícitas: Flui Butantã → Flui Villa-Lobos (next-butanta); Flui Jaguaré → Flui Leopoldina (next-jaguare). Flui Arca já incluído no S48 (next-acesso-next). IDs, coordenadas, fotos, textos/notas dos comentários e registros pessoais preservados. São nomes solicitados, ainda sem comprovação geográfica; usuário pediu em seguida auditoria de correspondência nome/posição.
- Arquivos: chargingStations.ts e expandedChargingStations.ts. ESLint dirigido/diff e 16 testes de catálogo/mapa/planejador aprovados após renomear. Suíte completa 242/242 do S48 não repetida por alteração textual. Perfil já resolve favoritos/histórico/avaliações pelo ID contra catálogo atual, sem regravar textos antigos salvos.
- Navegador confirmou 80 marcadores, todos começando por Flui. Fluxo completo de três fichas no mesmo roteiro não concluído: primeira tentativa teve marcador web sobreposto; segunda encontrou dois campos de busca de telas retidas no histórico. Abordagem interrompida após duas tentativas e reavaliada; não tratar como defeito nativo comprovado nem declarar fluxo aprovado. Testes de abertura das paradas do S47 continuam válidos no escopo original.
- Auditoria geográfica agora prioritária; preservar este checkpoint de nomes solicitados antes de comparar com limites oficiais. Não deslocar coordenadas silenciosamente. Sem alteração nativa, publicação ou consolidação. Commit deste bloco registrado na auditoria.
