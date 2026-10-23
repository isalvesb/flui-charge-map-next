# FluIA — Google STT V2 na base atual Flui 2.3

## 23/10/2026 — isolamento e base conferida

- Base desta conversa: `flui-ux-mapa-01`, branch `local/ux-mapa-01-reacticx-20261022`, commit `715ba523cbd295dc289c180a82820f7de258ac43`, limpa ao iniciar. Inclui interface/Orb atuais, catálogo de 80 pontos e melhorias incrementais. Não usar abd5dfa como base.
- Worktree nova: `flui-fluia-google-stt-atual`, branch `local/fluia-google-stt-atual-20261023`, criada diretamente do checkpoint atual. Histórico atual preservado; nenhuma alteração copiada da consolidação por mesclagem/cherry-pick.
- Protótipo antigo `flui-fluia-google-stt`, limpo em `4ad5538`, somente leitura e fonte de reaproveitamento seletivo. PROGRESSO anterior lido. Suas verificações não são evidência desta adaptação.
- Metro 8116/PID67777 continua no diretório UX-MAPA-01. Não parar, trocar origem ou conectar a build atual ao código experimental silenciosamente. Servidor STT antigo encerrado.
- Arquitetura já aprovada: iPhone → HTTPS privado → intermediário temporário Mac → Google STT V2. pt-BR, short/global/recognizer _, PCM mono 16 kHz/16 bits WAV, até 30 s, uma chamada simultânea, sem repetição, limites por execução 20 chamadas/600 s reservados. Nenhum serviço permanente/bucket/endpoint público.
- ADC existente será referenciado por caminho absoluto exclusivamente no processo Mac; não copiar nem imprimir. Código temporário de sessão somente em memória do app e arquivo local protegido no Mac. Nenhuma credencial pública ou versionada.
- Captura precedida por informação do envio ao Google; resultado acrescentado ao rascunho atual, com envio manual pelo motor existente. Cancelar/sair/segundo plano devem impedir resposta tardia e remover arquivos de áudio.
- Dependências locais clonadas por cópia APFS independente para economizar disco, sem symlinks de escrita para outra worktree. Não alteradas árvores node_modules de outras sessões. Disco inicial ≈4 GB livres: reavaliar espaço antes de compilação nativa.
- Proibidos push/PR/merge/publicação, mudanças na consolidação, limpeza de ambientes e substituição de app instalado. Não alterar faturamento. Captura/transcrição física ainda pendentes; consumo STT anterior informado: zero.

## Próximos checkpoints

1. Conferir ADC/API/IAM e o dispositivo por leitura; sem chamada de reconhecimento nesta conferência.
2. Adaptar e testar intermediário com limites e registro agregado, sem conteúdo em logs.
3. Adaptar sessão/captura/interface à página atual; preservar áudio de saída, estados, Orb, teclado e digitação.
4. Verificar configuração nativa isolada, rede/TLS e assinatura, sem substituir app existente.
5. Poucos testes reais pagos controlados, separados de testes simulados; registrar consumo/limites e evidência física quando ocorrer.

## 23/10/2026 — intermediário adaptado à worktree atual

- Retomada após auditoria de disco: base atual continua limpa em `715ba52`; esta worktree partiu dela e mantém o checkpoint de isolamento `ad21e6c`.
- Metro 8116 sem listener nesta retomada. Nenhum processo de outra sessão foi encerrado ou redirecionado. iPhone 16 identificado, mas indisponível na consulta atual.
- ADC utilizável. API Speech-to-Text inicialmente DISABLED; ativação bloqueada pela revisão automática até autorização explícita. Usuário respondeu **“Autorizo habilitar a API”**. Apenas `speech.googleapis.com` foi habilitada; estado ENABLED confirmado. Nenhuma alteração de conta de faturamento, bucket ou infraestrutura.
- Consultas de IAM e billing não foram conclusivas: suas APIs de consulta estão desativadas. Isso não comprova ausência de permissão de reconhecimento nem faturamento desligado. Não habilitar outras APIs só para essas consultas.
- Intermediário reaproveitado seletivamente, sem cherry-pick. Valida WAV real PCM mono/16 kHz/16 bits; até 30 s, uma chamada por vez, até 20 requisições/600 s reservados, sem repetição automática. HTTPS obrigatório e bind somente em IPv4 privado/loopback. Token não sobrescreve outra sessão. Logs persistem somente contadores agregados, sem áudio/transcrição/credenciais e sem apresentar estimativa como teto de faturamento.
- Corrigidos timeout de leitura, resposta tardia e reserva de consumo antes do provedor. Falha de registro impede chamada; limites não podem ser elevados pela configuração do handler.
- **10/10 testes do intermediário passaram com provedor simulado**, incluindo autorização, conteúdo, limites, duplicação, desconexão, timeout e falha de registro. Log local: `.validation/stt-backend-tests.log`. Ainda zero chamadas Google de reconhecimento.
- Compilação/instalação nativa, captura e teste físico pendentes. O código deste checkpoint é identificado pelo commit `voz: adapta intermediário privado com limites de transcrição`; hash registrado no checkpoint seguinte.

## 23/10/2026 — captura integrada e primeira transcrição real

- Intermediário do checkpoint anterior: **`b82ac4c`**. Base funcional continua a Flui 2.3 de `715ba52`, sem alterar UX-MAPA-01 ou a consolidação.
- Entrada iOS adicionada à página roxa atual, antes do campo existente: Gravar, Parar, Cancelar e configuração de conexão privada. Aviso de envio ao Google aparece antes da captura. Código temporário seguro, apenas em memória, apagado ao fechar a página/ir ao fundo. Endereço aceita somente HTTPS privado/local, sem segredo em URL.
- Transcrição é acrescentada ao rascunho atual por atualização funcional, preservando digitação durante a operação. Não envia automaticamente. Enviar e reprodução ficam impedidos durante captura/transcrição; digitação continua disponível. O motor determinístico, histórico, sugestões, Plano B, Orb e leitura por expo-speech foram mantidos.
- Ouvindo durante gravação, Pensando durante preparação/transcrição/cancelamento, Erro nas falhas. A prévia visual continua disponível fora de uma operação real. A leitura continua exibindo Explicando, com espera pela liberação do áudio antes de capturar.
- Refeito o controle de sessão para serializar parada/leitura/limpeza. Cancelamento não aguarda resposta de rede tardia, mas aguarda a operação nativa. Uma resposta antiga não mexe em rascunho, timer ou microfone de uma sessão nova. Falha de limpeza bloqueia novas gravações até reiniciar o app experimental.
- Corrigida incompatibilidade do protótipo: **AbortSignal.throwIfAborted não existe no polyfill usado pelo RN 0.81**. Adicionada checagem compatível, com teste usando o abort-controller real do RN. Término nativo de 30 s é tratado uma única vez; paradas inesperadas não autorizam upload.
- Adicionados somente módulos compatíveis com o SDK 54: expo-audio 1.1.1, expo-file-system 19.0.24 e expo-dev-client 6.0.21. Sem atualizar SDK. Configuração própria **Flui Voz 2.3**, `com.guicunhasou.fluiavozlocal`, scheme `fluiavozlocal`. Não reutiliza o identificador instalado Flui 2.3.
- Prebuild iOS separado concluído, sem instalação; NSMicrophoneUsageDescription e NSLocalNetworkUsageDescription presentes, sem modo de áudio em segundo plano, inspetor de rede nativo false. Chave Maps existente lida em memória da configuração UX-MAPA-01, sem imprimir nem criar cópia de ambiente. Pastas nativas geradas permanecem ignoradas pelo Git.
- TypeScript passou. ESLint dirigido sem avisos/erros; rodada geral registrou somente aviso preexistente de ref em ConnectivityContext. **262/262 testes do app passaram**; após acrescentar cobertura do término nativo, **26/26 testes dirigidos finais passaram**, além dos 10/10 do intermediário. Exportação web concluída com 14 rotas; ainda não é validação de captura iOS.
- **Primeiro reconhecimento Google REAL aprovado**: uma frase sintética pt-BR gerada pelo macOS (não microfone/iPhone), enviada por HTTPS ao intermediário loopback, transcrição coerente com a frase controlada. HTTP 200, áudio 3,4674375 s, 4 s reservados, percurso local+Google ≈2,754 s. **Total real até aqui: 1 chamada / 4 segundos reservados.** Não foi apresentada estimativa como custo efetivamente faturado.
- Evidência agregada em `.validation/stt/cloud-smoke.json` e `consumo-*.json`. Áudio temporário apagado. Intermediário de teste encerrado após conferir propriedade/diretório; código de sessão removido. Nenhum processo de outra sessão foi encerrado. Certificados próprios gerados para 192.168.0.130 e loopback, ainda não instalados em Mac/iPhone.
- Há identidade Apple local válida, mas os três perfis existentes pertencem aos outros identificadores Flui; nenhum corresponde ao experimento. Não substituir apps nem reutilizar perfis incompatíveis. Assinatura separada e iPhone disponível serão necessários para teste físico.
- Próximo: concluir preparação nativa, verificar compilação isolada sem assinatura quando possível, testar fluxo digitado na web e solicitar somente intervenções indispensáveis no aparelho/assinatura/certificado. A captura, precisão da voz humana, latência física e funcionamento do mapa na nova build continuam **pendentes**.

## 23/10/2026 — preparação nativa e preservação da leitura

- Integração anterior registrada em **`c146a2b`**.
- Exportação web: 14 rotas. Fluxo digitado exercitado em navegador: abrir FluIA, enviar pergunta, receber recomendação, expandir explicação, manter rascunho em edição e voltar ao mapa. Sem erros de página. `.validation/typed-flow.json`; captura `.validation/typed-flow.png`. O servidor de teste foi encerrado; não houve chamada Google nesse teste.
- Compilação nativa **sem assinatura aprovada**, com ExpoAudio nativo incluído, nome/versão próprios e inspetor desativado. A primeira tentativa falhou pelos deployment targets antigos de bundles de recursos dos Pods; a segunda passou com `IPHONEOS_DEPLOYMENT_TARGET=15.1`. Logs `native-build-voice*.log` e resumo `native-readiness.json`, locais/ignorados.
- Assinatura: a primeira tentativa forçou indevidamente assinatura global em bibliotecas estáticas; falhou sem instalar nada. A opção foi removida. Xcode criou perfil separado para `com.guicunhasou.fluiavozlocal`; segunda compilação usando opções normais em andamento. Nenhum perfil existente foi removido ou sobrescrito.
- iPhone voltou a estar disponível. Aplicativos Flui existentes conferidos por leitura: `fluiuxmapa01`, `fluinext2026`, `fluiteste25`. Identificador de voz ausente antes da instalação. O app UX apresenta metadados nativos 2.1.0, embora o código atual seja Flui 2.3; não confundir o wrapper instalado com a versão da experiência JavaScript.
- Corrigida prioridade do status ao ouvir uma resposta depois de erro de captura: leitura mantém Explicando. Opções pré-prontas expõem estado desabilitado durante captura/transcrição. TypeScript e ESLint dirigidos passaram, **14/14 testes de estados/leitura aprovados**.
- Encontrado comportamento nativo a corrigir antes de instalar: expo-audio 1.1.1 pausa gravadores na interrupção e pode retomá-los sem reaplicar o limite. Preparar correção estreita/reproduzível somente no experimento, fixada nessa versão; preservar SDK e outras worktrees.

## 23/10/2026 — interrupções nativas bloqueadas, build assinada

- Checkpoint anterior: **`53fb812`**. A assinatura normal da build própria passou, com perfil exclusivo; não foi necessário reutilizar/remover perfis existentes.
- Confirmado no código expo-audio 1.1.1: interrupção e segundo plano pausavam o gravador, e a retomada podia chamar startRecording sem duração. Implementada correção restrita e reproduzível em `tools/fluia-stt/prepare-native.cjs`, aplicada automaticamente pelo plugin iOS durante prebuild.
- A correção exige exatamente versão 1.1.1 e a fonte revisada; falha se houver divergência. Somente esta worktree é alterada, sem symlinks. Interrupção/segundo plano desarmam allowsRecording, param o gravador e emitem falha ao JS; uma chamada record após interrupção é recusada. Novo toque explícito prepara uma nova sessão. Nenhuma versão do SDK/dependência foi atualizada. Fonte do protótipo antigo conferida e mantida sem a correção local.
- A exceção de inatividade do iOS agora vale apenas enquanto o diálogo real de permissão está aberto, em vez de toda a preparação. Ir ao fundo continua cancelando, inclusive durante permissão.
- **12/12 testes de intermediário/correção e 19/19 de adaptador/sessão passaram**; TypeScript e ESLint dirigidos passaram. Testes de patch verificam aplicação/idempotência e rejeição de fonte diferente; não substituem teste físico de interrupções.
- **Build iOS corrigida e assinada aprovada** (`.validation/native-sign-guarded.log`). Módulos compilados, perfil e bundle próprios. Nenhuma instalação havia sido feita até este checkpoint; teste físico de microfone e interrupções permanece pendente.
- Consumo Google real permanece **1 chamada / 4 segundos reservados**, frase sintética no Mac; nenhuma captura humana ainda. Certificado de teste continua sem instalação no iPhone.

## 23/10/2026 — instalação isolada e correção de abertura

- Checkpoint nativo anterior: **`54b657f`**. Instalação inicialmente recusada pelo limite de três apps com assinatura gratuita. O usuário autorizou especificamente apagar **somente Flui NEXT Revisão**, `com.guicunhasou.fluinext2026`; os outros dois apps foram preservados.
- Antes da remoção, copiado o contêiner NEXT Revisão para `.validation/iphone-backups/next-revisao-20261023/container`: 48 arquivos, 19.169.175 bytes, pasta privada. É cópia do contêiner, sem garantia de restauração nem backup completo/Keychain. Código, worktrees, simuladores e consolidação no Mac não foram alterados.
- Flui Voz 2.3 foi instalado com identificador próprio. O usuário informou que abria e fechava. Crash nativo confirmou `UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`, antes de carregar JavaScript: a build usa SDK Xcode 27.1 e requer ciclo UIScene.
- A base UX atual já possuía uma adaptação UIScene em fonte nativa ignorada pelo Git. Reaproveitada somente a organização da janela/ciclo de vida, mediante plugin reproduzível, sem copiar IP fixo, código de diagnóstico ou credenciais. No experimento, o Dev Launcher é preparado antes dos subscribers Expo. Sem migração de SDK/dependências.
- Dois testes do plugin passaram (ordem de inicialização, encaminhamento de ciclo de vida, idempotência e recusa de fonte desconhecida); ESLint passou. Prebuild, compilação incremental assinada, verificação de assinatura e reinstalação do mesmo identificador passaram. Logs locais `scene-tests.log`, `scene-lint.log`, `native-scene-build.log` e `voice-scene-install.json`.
- Após a correção o processo permaneceu ativo; captura enviada pelo usuário mostra o launcher **Flui Voz 2.3**, sem encerramento. A primeira abertura foi percebida como tela preta, mas o launcher apareceu depois. Descoberta automática não encontrou servidor; Metro respondeu `packager-status:running` pela LAN. Orientada conexão manual a `http://192.168.0.130:8117`. Carregamento do mapa/JavaScript ainda pendente nesta conferência.
- Metro próprio 8117 e intermediário HTTPS privado 8787 servem esta worktree; conferir IP/PIDs antes de qualquer reinício. Nenhuma troca no Metro de outra sessão. Certificado público `root.crt` selecionado no Finder; usuário pediu ajuda para instalá-lo. Confiança TLS no iPhone e primeira captura humana continuam pendentes.
- Consumo Google real acumulado continua **1 chamada / 4 segundos reservados**. O intermediário atual ainda não recebeu captura do iPhone; cada execução mantém o limite de 20 chamadas/600 segundos.

## 23/10/2026 — FluIA aberta no iPhone e conexão sem comprimir a conversa

- Correção UIScene registrada em **`029a3bc`**. Após conectar manualmente ao Metro 8117, captura enviada pelo usuário mostra a página roxa atual, Orb e controles novos de gravação. Metro registrou bundle iOS concluído. Isso confirma abertura da interface; mapa nativo, captura e transcrição no aparelho ainda não foram conferidos.
- A captura revelou que expandir a conexão dentro do rodapé deixava poucas opções visíveis. Os campos HTTPS/código agora abrem em diálogo próprio com rolagem, área segura, ajuste ao teclado e botão Concluir. O aviso de envio ao Google continua visível antes de gravar; código segue apenas em memória e é apagado ao fechar a FluIA/ir ao fundo. Nenhuma alteração nativa nem recompilação para este ajuste.
- TypeScript e ESLint dirigidos passaram. Mudança disponibilizada pelo Metro/Fast Refresh; revisão visual desse diálogo no iPhone pendente. Não repetida a matriz já aprovada nem declarada nova integração física.
- Orientado envio pelo AirDrop somente do certificado público `root.crt`, instalação manual e ativação de confiança de **FluIA Experimento Local**. A revisão automática recusou a cópia do código de sessão para a área de transferência, por permitir acesso a outros apps sem autorização explícita para esse meio. Nada foi copiado; autorização específica será solicitada, sem contornar o bloqueio.
- Primeira captura humana, precisão e latência continuam pendentes. Consumo Google acumulado continua **1 chamada / 4 segundos reservados**, correspondente apenas ao teste sintético anterior.
- Em seguida o usuário respondeu **“Autorizo a cópia temporária”**. Código conferido por presença/formato/permissão, intermediário privado confirmado ativo e cópia para a área de transferência realizada sem exibir seu conteúdo. O bloqueio específico foi resolvido por autorização explícita. Usuário recebeu o certificado e pediu ajuda para instalá-lo/ativar confiança nos Ajustes; essa etapa e a primeira gravação continuam pendentes. Limpar a área de transferência após a colagem, sem sobrescrever conteúdo novo do usuário.
- A captura posterior de Gestão de VPN e Dispositivo não mostra o certificado/perfil da FluIA, apenas assinatura de desenvolvedor. Após duas orientações sem instalação verificável, alterado o meio de entrega: `.validation/stt/FluIA-Experimento-Local.mobileconfig`, selecionado no Finder para envio manual. Usa o mesmo certificado raiz público existente, em um único payload `com.apple.security.root`, removível, sem chave privada, credencial, MDM ou ajuste de rede. Certificado vigente/cadeia conferidos com OpenSSL; perfil aprovado por plutil e conteúdo comparado em memória com o DER do raiz original. Nenhuma confiança/instalação foi aplicada automaticamente ao Mac/iPhone; envio, instalação e confiança manual ainda pendentes. Referência: https://developer.apple.com/documentation/devicemanagement/certificateroot.
- Depois de abrir novamente o Finder e confirmar a seleção pelo próprio Finder, o usuário informou **“pronto, tudo ok. falta fluia”**, confirmando a preparação manual do certificado. Conferidos Metro 8117 e intermediário privado 8787 ativos; HTTPS com o raiz existente respondeu 401 sem código, como esperado, sem transcrição. Código recopiado para colagem na FluIA, sob autorização já dada. Consumo agregado conferido: **1 chamada / 4 segundos reservados**; execução atual ainda 0/0. Próximo passo exclusivamente físico: colar código em Conexão, gravar, revisar texto e enviar manualmente. Confiança TLS efetiva dentro do app, microfone e transcrição humana ainda não comprovados.

## 23/10/2026 — correção da configuração inicial do microfone

- Captura física enviada pelo usuário mostra **“Não foi possível iniciar o microfone”**. Intermediário permanece com 0 requisições/0 segundos nesta execução: não chegou áudio ao Google nessa tentativa.
- Encontrada configuração inválida no adaptador: `allowsRecording: true` omitindo `playsInSilentMode`, cujo padrão nativo é false. A fonte instalada do expo-audio 1.1.1 (`AudioUtils.validateAudioMode`) rejeita explicitamente essa combinação antes de criar o gravador. Ajuste restrito ao início da captura explícita: `playsInSilentMode: true`; limpeza/retorno continuam desligando a gravação e restaurando o modo anterior usado pelo adaptador. Sem escuta contínua, alteração nativa, reinstalação ou migração.
- Fixture do adaptador passou a representar essa restrição real do SDK. Reproduziu a rejeição antes do ajuste; **19/19 testes de adaptador/sessão passaram depois**, incluindo cancelamento, permissão, limite e limpeza. TypeScript, ESLint dirigido e diff passaram. Logs `microphone-mode-before.log`, `microphone-mode-tests.log`, `microphone-mode-typecheck.log`, `microphone-mode-lint.log` em `.validation`.
- Correção disponibilizada pelo Metro/Fast Refresh. Nova captura física e primeiro reconhecimento humano ainda pendentes; os testes locais não comprovam essa integração. Consumo real acumulado permanece 1 chamada/4 segundos reservados do teste sintético no Mac.

## 23/10/2026 — primeira transcrição humana confirmada no iPhone

- Correção de configuração do microfone em **`e037429`**. Usuário respondeu **“funcionou!”** e esclareceu **“Transcreveu, mas não leu a resposta”**. A captura e transcrição no iPhone estão confirmadas por feedback humano; leitura após envio ainda falhou/não está validada. Não registrar todo o fluxo como concluído.
- Contadores conferidos no intermediário: execução atual **1 requisição / 6 segundos reservados**, somados ao teste sintético anterior, **2 requisições / 10 segundos reservados** no total. Não há gravação/transcrição/credencial nos registros de continuidade; nenhuma nova chamada foi feita para investigar a leitura.
- Solicitado distinguir resposta escrita/status Explicando e modo silencioso. Hipótese a conferir: após gravar, o adaptador restaura modo de áudio ambient; expo-speech SDK 54 documenta ausência de som em iPhone silencioso. Não atribuir causa ao aparelho sem confirmação e não trocar serviço/voz/SDK por hipótese.
- Encerrada a transferência temporária do código: conteúdo da área de transferência comparado apenas em memória e apagado somente se ainda fosse o código. Qualquer conteúdo novo é preservado; o código em memória do app e no arquivo protegido do intermediário segue ativo para o experimento.

## 23/10/2026 — fluxo principal de voz confirmado no iPhone 16

- Usuário esclareceu a pendência de saída: **“toquei em enviar e apareceu explicando com som”**; iPhone **não** estava em modo silencioso. A mensagem transcrita aguardava envio manual, conforme o fluxo aprovado. Nenhuma correção de áudio de saída foi necessária/aplicada por hipótese.
- **Confirmado fisicamente por feedback humano:** tocar para gravar, capturar fala, obter transcrição Google em português no campo existente, tocar em Enviar e ouvir resposta do motor atual, com status **Explicando**. Entrada Google STT V2 e saída expo-speech do iPhone; não houve integração/contratação de Google TTS nem troca de motor conversacional.
- Este é o checkpoint funcional básico do experimento isolado Flui Voz 2.3. Não certifica todas as permissões negadas, interrupções, bloqueio, segundo plano, cancelamento em rede, silêncio, desempenho, Android ou Release. Esses limites continuam registrados em TESTE-IPHONE.md; nenhuma matriz física completa foi alegada.
- Leitura conferida com o texto já transcrito, sem nova chamada Google. Consumo agregado permanece **2 requisições / 10 segundos reservados**: uma sintética no Mac (4 s) e uma humana no iPhone (6 s). Custo efetivamente faturado não foi consultado/estimado como realizado.
- Servidores próprios permanecem disponíveis para o experimento, sob os limites existentes. Ambiente UX-MAPA-01 e consolidação não foram alterados. Código protegido continua apenas em memória do app/arquivo privado do intermediário; área de transferência do Mac foi limpa depois da colagem.

## 23/10/2026 — pedidos 36–42 e novo fluxo autorizado

- **36 implementado:** removidos estado manual, ação de alternar status e flag temporária. A Orb passa a refletir apenas estados reais. Compilação TypeScript e ESLint dirigidos registrados no checkpoint; conferência física de remoção ainda pendente.
- **37 fazendo:** Orb substituirá Gravar/Parar, mantendo cancelamento e alternativa por teclado acessíveis.
- **38 fazendo:** iniciar uma escuta ao abrir a FluIA pelo mapa, somente com conexão ativada, permissão e app em primeiro plano. Não reiniciar automaticamente após resposta, cancelamento ou retorno do segundo plano.
- **39/40 fazendo:** usuário autorizou expressamente transmissão em tempo real no mesmo caminho privado iPhone → Mac → Google, incluindo adaptação nativa e recompilação só do app experimental. Autoriza também a mudança para resposta automática ao concluir a fala; substitui a exigência anterior de revisar/enviar manualmente a transcrição. Texto digitado continua separado e só é enviado pelo botão normal. Nenhuma escuta contínua nem infraestrutura pública.
- **41 fazendo:** conexão e informação sobre envio de áudio ficarão nas Configurações, sem controles técnicos no rodapé da FluIA. Código seguirá em memória e será apagado ao ir ao fundo; deverá sobreviver à navegação Configurações → mapa → FluIA para viabilizar esse fluxo.
- **42 análise:** saída atual usa voz do iPhone. Google Chirp 3 HD oferece pt-BR, mas Google TTS ainda não foi ativado/contratado nem recebeu texto. Comparar alternativas sem presumir autorização de consumo/serviço adicional.
- Streaming manterá uma chamada por vez, até 30 s por escuta, sem repetição e orçamento máximo de 20 chamadas/600 s reservados. Reserva conservadora de até 30 s por stream antes de abrir Google, inclusive se cancelado; consumo será agregado e distinguido do histórico síncrono.

### Captura PCM para o item 40

- Captura nativa própria e restrita ao app experimental: AVAudioEngine converte para PCM Int16 mono/16 kHz, em eventos de 100 ms. Áudio fica em memória, sem arquivo. Fila, bytes e duração limitados; máximo de 30 s independente do JavaScript. Interrupção, saída do primeiro plano ou troca de dispositivo encerram o motor, sem retomada automática. Restaura categoria anterior do áudio; falha de restauração é sinalizada.
- Patch reproduzível do expo-audio somente na versão 1.1.1/árvore real desta worktree, sem atualizar pacote/SDK. Fonte Swift própria em tools/fluia-stt/native; preparação ligada ao plugin local existente. Nova fonte incluída pelos Pods existentes, sem atualizar versões nativas.
- Teste de aplicação/idempotência/recusa de versão divergente passou; prebuild, instalação dos mesmos Pods e **compilação assinada iOS passaram** (`native-stream-build.log`). Arquivo compilado comparado com o template versionado. Captura dessa nova modalidade no aparelho ainda pendente; a validação física anterior pertence ao fluxo por arquivo.
- Item **42**: usuário escolheu **Zephyr**. Registrar preferência para `pt-BR-Chirp3-HD-Zephyr`, a conferir na documentação oficial. API de síntese e consumo de TTS permanecem sem ativação/autorização específica; seleção não foi tratada como licença de gastos ilimitados.

## 23/10/2026 — checkpoint WIP para continuar em outra conversa

- Usuário pediu prompt de continuidade por limite de franquia. Interrompida a expansão do escopo para preservar o estado recuperável. Documento principal: **CONTINUIDADE-36-42.md**.
- Preservada a implementação conjunta do streaming, controle da Orb, escuta ao abrir e conexão nas Configurações. É um experimento complexo em andamento, não uma entrega física aprovada. O componente antigo por arquivo permanece no repositório como referência.
- TypeScript, ESLint dirigido, **6/6 testes de sessão/conexão**, **8/8 testes de backend/preparação nativa** e compilação iOS assinada passaram. Nova build PCM ainda não instalada; rodada geral e matriz visual após streaming não executadas.
- Teste real Google no Mac: 22 parciais, inclusive antes de terminar o trecho falado, transcrição final correta para a frase sintética. **Encerramento automático por silêncio NÃO funcionou:** foi necessário `finish` explícito. Primeira tentativa expirou; reavaliar eventos/métricas e hipótese antes de mais chamadas pagas. Evidência `.validation/live-cloud-smoke.json`, com `automaticEndWithoutFinish=false`.
- Ledger retido: **3 chamadas/66 s reservados**, mais **1/4** do primeiro teste separado: **4 chamadas/70 s reservados** no histórico registrado. Não corresponde a custo/duração faturados. Sem nova chamada durante a preparação do handoff.
- Servidores próprios conferidos e preservados: Metro 8117/PID 97294 e streaming privado 8787/PID 1283, ambos nesta worktree. Base UX `715ba52` e consolidação `abd5dfa` continuam limpas e não foram modificadas.
- Próximo agente deve distinguir: 36 implementado; 37/38/40/41 em código, pendentes no iPhone; 39 não resolvido; 42 preferência Zephyr, sem API/consumo TTS autorizado. Não retomar automaticamente a base antiga nem apresentar testes simulados como integração real.

## 23/10/2026 — retomada física após `5872b52`

- Branch correta e limpa em `5872b52`, com `50d56cb` presente. Conferidas correções PCM/silêncio, parciais e duplicação; os 29/29 testes anteriores são informação do handoff, sem nova rodada nesta conferência. Código não foi reimplementado.
- Remoção de “Parar leitura” confirmada na fonte. Interrupção pelo ícone de som, nova fala na Orb com conexão ativa e saída da tela continuam presentes; conferência visual/física ainda pendente.
- iPhone 16 disponível e app experimental 2.3.0/20261022 instalado. Nenhuma recompilação, instalação ou exclusão foi realizada na retomada.
- Ambos os servidores estavam parados. Após conferir portas livres, iniciados só os serviços desta worktree: Metro 8117/PID 2360 e streaming privado 8787/PID 2352. Cwd/IP conferidos; Metro e health HTTPS autenticado aprovados, sem reconhecimento/áudio.
- Ledger encontrado **8 chamadas/216 s reservados**, e separado histórico **1/4**: total **9/220**. Preservado no reinício; diverge dos 3/66 informados no prompt. Não é custo faturado. Sem chamada nova nesta conferência.
- Novo código copiado temporariamente sob autorização já concedida, sem exibição. Usuário solicitado a ativar em Configurações e informar o resultado antes do teste de abertura/escuta. Não considerar o novo fluxo homologado ainda.

### Ativação confirmada e primeiro teste desta retomada

- Usuário confirmou **“Voz ativa nesta sessão.”** nas Configurações. Metro lista conexões do bundle correto `com.guicunhasou.fluiavozlocal` no iPhone.
- Orientado teste Home → FluIA → falar frase curta → silêncio sem tocar na Orb. Health registrou áudio e respostas Google: 24 frames, 4 respostas e 1 início de fala na consulta, sem conteúdo registrado. Ledger observado após esse início: **9 chamadas/246 s reservados**, mais 1/4 histórico: **10/250** no total registrado.
- **Ainda sem resultado humano do encerramento por silêncio, leitura única e remoção visual de “Parar leitura”.** Cancelamento, segundo plano e rascunho permanecem pendentes no aparelho. Não inferir homologação dos contadores ou da ativação.
- Código retirado do clipboard após a confirmação de colagem, somente porque o conteúdo ainda era exatamente o código; conteúdo novo seria preservado. Relatório local sem conteúdo de fala/segredos: `.validation/validacao-iphone-retomada.json`.

## 23/10/2026 — quedas relatadas e áudio após encerramento Google

- Usuário confirmou que o fluxo automático **funcionou uma vez** no iPhone, mas relatou quedas recorrentes e necessidade de inserir código novamente, inclusive após bloqueio/troca de app. Também confirmou que “Parar leitura” desapareceu. Isso comprova um percurso completo, não estabilidade nem matriz física homologada.
- Servidores conferidos ativos e no cwd correto. Health autenticado aprovado. Ledger chegou a **17 chamadas/486 s reservados**, mais 1/4 histórico; nenhuma transcrição feita pelo agente na investigação. Solicitado evitar novas gravações até concluir o ajuste; não zerar o orçamento.
- Identificado outro defeito concreto: quando o próprio Google iniciava o encerramento antes do fim da captura, `write` do provedor ainda encaminhava PCM tardio para o fluxo já encerrado. Regressão local reproduziu `ERR_STREAM_WRITE_AFTER_END`, sem Google. O provedor agora descarta esses quadros enquanto aguarda o resultado final, sem sinalizar backpressure/abrir nova chamada. A fonte não prova que todas as quedas relatadas tinham essa causa.
- **30/30 testes do intermediário passaram**, incluindo a nova regressão; `.validation/stt-late-frames-tests.log`. Falha anterior registrada em `.validation/late-google-frame-before.log`. Correção ainda precisa chegar ao processo privado e ser conferida fisicamente; não houve migração de SDK, alteração de credencial ou ampliação de limite.

### Rodapé da FluIA simplificado

- Correção do intermediário: **`f72a9a3`**. Retirados os controles visuais “Cancelar escuta”, “Ouvir resposta” e “Última mensagem” apontados pelo usuário. Conversa continua rolável e o acompanhamento da mensagem nova respeita a posição de leitura; teclado conserva seu recolhimento.
- Cancelamento sem envio preservado na Orb por pressão longa, ação acessível de cancelamento e escape; o botão voltar também encerra a sessão. Toque curto continua concluindo a fala. Essas interações novas ainda precisam conferência física/VoiceOver humano.
- TypeScript e ESLint dirigidos passaram. **13/13 testes existentes de sessão/leitura passaram**, sem chamada Google; não foram apresentados como teste visual da tela. Logs `voice-controls-tests.log`, `voice-controls-typecheck.log`/`session-retention-typecheck.log` e lints correspondentes.

### Código autorizado permanece em memória após bloqueio

- Usuário identificou a mensagem **“Ative a voz da FluIA nas Configurações”**. No código ela significa ausência da sessão local, não falha de autenticação Google. O hook apagava a conexão em todo evento background. Usuário escolheu expressamente **“Manter até fechar o app ou desativar a voz.”** Essa decisão substitui a exigência anterior de apagar o código ao ir para segundo plano.
- Removida somente a limpeza automática da conexão em background. Captura/stream e leitura continuam cancelados ao sair do primeiro plano; o retorno não inicia escuta sozinho. Código continua exclusivamente na memória do processo, sem AsyncStorage, arquivo ou variável pública; término do processo e desativação removem a sessão. Recarregamento completo do JavaScript ou reinício do intermediário ainda podem exigir nova ativação.
- Configurações agora mantém **“Voz ativa nesta sessão.”** visível enquanto ativa, oculta código/Ativar e conserva Desativar. Antes, campo vazio após limpar o texto secreto podia parecer desconexão mesmo com estado ativo, como no print do usuário. Informação de privacidade atualizada para a política escolhida.
- TypeScript e ESLint dirigidos passaram após o ajuste; cancelamento, resposta única e limpeza explícita permanecem cobertos pelos 13 testes dirigidos aprovados nesta rodada. Persistência de sessão após bloqueio ainda precisa de conferência no aparelho. Nenhuma retomada automática nem credencial persistida foi introduzida.

### Extensão pontual de consumo autorizada

- Commits dos ajustes anteriores: rodapé **`58322bf`**; retenção apenas em memória/estado ativo claro **`1dbfdee`**.
- Antes do reinício controlado, ledger alcançou **20 chamadas/576 s reservados**. Nenhuma escuta estava ativa; processo próprio encerrado após confirmar cwd, PID e conexões, preservando Metro e ledger. Histórico separado permanece 1/4.
- Usuário autorizou expressamente **até 3 chamadas/90 s adicionais**, com **tetos absolutos 23 chamadas/666 s no mesmo ledger**, sem mudança de faturamento ou repetição. Isso substitui somente o limite desta validação; não constitui autorização de gastos contínuos ou TTS.
- Extensão exige flag explícita `STT_APPROVED_VALIDATION_EXTENSION=23/666` e ledger existente a partir de 20/576. Padrão continua 20/600; valores arbitrários são recusados. Reiniciar com a extensão não renova o saldo. Sem zerar, trocar ou criar ledger para contornar o limite.
- **31/31 testes simulados do intermediário passaram**, incluindo uso exato de 21/606, 22/636, 23/666 e recusa da quarta chamada também após reinício. Log `.validation/approved-extension-tests.log`. Nenhuma chamada Google no teste.

### Pausa ampliada para dois segundos

- Extensão autorizada registrada em **`140a121`**. Usuário achou 1 s curto; adotados aproximadamente **2 s** como ajuste incremental. Sincronizados detector PCM, timeout Google, timer de fim de atividade e textos de consentimento/acessibilidade. Limite absoluto de 30 s e finalização por toque continuam iguais.
- **31/31 testes do intermediário passaram** com os novos prazos; TypeScript, ESLint dirigido e diff passaram. Logs `.validation/silence-two-seconds-*`. Esses testes não consomem reconhecimento real; novo prazo físico ainda pendente.
- Usuário perguntou sobre dispensar código: explicado pareamento único seguro como possibilidade futura. **Pareamento automático não foi implementado** nem o intermediário foi aberto sem autenticação. A retenção atual em memória já evita redigitação ao ir para segundo plano, mas novo processo/JS ou reinício do intermediário podem exigir código novo.

### Aplicação dos ajustes e proteção da pressão longa

- Pausa de dois segundos: **`5d751f3`**. Intermediário reiniciado somente após conferir cwd/porta e ausência de conexão ativa; PID atual **3446**, Metro preservado **2360**. Health confirmou streaming, ledger **20/576** intacto e tetos autorizados **23/666**. Novo código copiado temporariamente, sem exibição, para reativação única após esse reinício. Nenhuma nova transcrição na aplicação.
- Na revisão do gesto, mantida a presença de `onLongPress` mesmo quando o cancelamento muda o estado: o Pressability instalado só suprime o toque curto na soltura se o handler continuar presente. Isso evita iniciar outra escuta ao soltar a Orb depois de cancelar. Cancelamento sem sessão é inócuo. Conferência física do gesto continua pendente.
