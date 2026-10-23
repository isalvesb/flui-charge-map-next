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
