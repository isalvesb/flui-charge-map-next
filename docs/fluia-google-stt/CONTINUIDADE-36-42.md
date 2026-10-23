# FluIA — continuidade dos itens 36–42

## Publicação de revisão autorizada posteriormente

Usuário pediu explicitamente uma PR: **https://github.com/isalvesb/flui-charge-map-next/pull/103**, aberta em rascunho para `main`, pela branch remota `review/flui-2.3-ux-fluia-20261023`. Envio inicial `8fa3fcb`; inclui a base UX 2.3 acumulada, pois main ainda estava em `94c862e`. Matriz atual em `docs/ENTREGA-UX-FLUIA-2.3.md`. Checks locais: 271 testes do app, TypeScript/lint sem erros (aviso preexistente), web com 15 rotas; backend mantém 40 testes aprovados. CI remota pendente de confirmação nesta publicação.

Exceção específica ao bloqueio anterior somente para enviar esta branch e criar a PR. Bloqueios permanentes de origem/hook foram preservados; não há autorização para merge, outras branches, issues/Projects ou publicação de app/site. Desenvolvimento de voz sem Mac/Zephyr permanece adiado; a abertura da PR não retoma essa implementação.

## Atualização — item 42 retomado expressamente

Após abrir a PR, o usuário pediu **“42 agora”** e autorizou **10 sínteses/10.000 caracteres**. Backend Zephyr privado e reprodução MP3 implementados; uma síntese real Google aprovada, reprodução no iPhone pendente. API já estava habilitada; não houve alteração de faturamento. Backend atual **5904**, Metro **2360** preservado, sessão e ledger STT mantidos. Primeiro checkpoint TTS: **1 chamada/62 caracteres**; STT **26/756**, teto **33/966**. Conferir consumo/processos antes de agir. TTS usa `.validation/stt/tts-consumo.json`, sem reset ao reiniciar. Voz sem Mac (43) continua adiada; item 46, IA nas respostas, está em análise. Detalhes em `PROGRESSO.md`.

## Estado anterior — voz adiada por decisão do usuário

O usuário decidiu deixar a voz para depois e priorizar outros ajustes. **Não retomar automaticamente investigação/implementação Apple, hospedagem Google ou testes físicos pendentes.** Preservar este experimento e aguardar o próximo objetivo. Não houve migração do reconhecimento nem implantação de serviço externo.

- Código antes deste checkpoint documental: **`4511772`**, branch `local/fluia-google-stt-atual-20261023`, worktree `flui-fluia-google-stt-atual`.
- **Confirmado no iPhone:** retenção da ativação após bloquear/desbloquear; frase completa com pausa curta no meio e conclusão com prazo maior, seguida de uma única resposta falada; remoção de “Parar leitura”; conexão pelo botão/Permitir no Mac, sem copiar ou colar código.
- **Ainda depende do Mac para o Google.** Usuário achou isso trabalhoso e quer, futuramente, operação só no iPhone. Alternativa Apple começou a ser pesquisada por leitura; nenhuma troca de arquitetura, nova captura nativa, API, SDK ou build foi implementada nessa direção. Discutir essa decisão antes de avançar.
- **Pendente físico:** pressão longa para cancelar, rascunho preservado, segundo plano durante captura e estabilidade prolongada. Um percurso aprovado não equivale à matriz inteira. O teste de cancelamento esbarrou no teto anterior.
- Backend sem colagem **`f0c52a2`**, tela **`4511772`**. Pareamento real confirmado pelo usuário: “conectou sem código”. Continua exigindo autorização no Mac por conexão, não é autenticação permanente nem execução autônoma no iPhone.
- Intermediário atual **3975**, com processo Python supervisor da retomada por pipe; Metro **2360**, porta **8117**. HTTPS/WSS privado **192.168.0.130:8787**. PIDs/IPs são instantâneos; conferir antes de agir. Sessão preservada em reinício por pipe, sem exibição da credencial.
- Último ledger conferido antes do adiamento: **23 chamadas/666 s reservados**, mais separado histórico **1/4**. Teto adicional expressamente autorizado **33/966 no mesmo ledger**; não reiniciar saldo. Flags atuais `STT_APPROVED_VALIDATION_EXTENSION=33/966`, `STT_PAIRING_ENABLED=1`. `STT_RESUME_SESSION=1` exige o código pelo stdin anônimo e ledger existente: não copiar a flag para uma inicialização sem pipe. Início normal pode gerar código novo e o botão Conectar ao Mac faz o novo pareamento, sem colagem.
- **40/40 testes locais do intermediário aprovados**, TypeScript/ESLint dirigidos e sintaxe Node aprovados; 13/13 de sessão/leitura na rodada anterior. Sem recompilação iOS nesta etapa e sem nova transcrição feita pelo agente para testar pareamento. Credenciais, consolidação e outras worktrees preservadas. Servidores não foram encerrados no adiamento.

## Atualização posterior — estabilidade, sessão e pausa

Esta seção prevalece sobre as anteriores: usuário confirmou um percurso de voz funcionando no iPhone, seguido de quedas recorrentes; **estabilidade ainda não homologada**. “Parar leitura” deixou de aparecer por confirmação humana. Mensagem depois identificada: “Ative a voz da FluIA nas Configurações”. Print de Configurações mostrava sessão ativa com campo vazio, não uma falha Google comprovada.

- `f72a9a3`: reproduzido em teste e corrigido áudio tardio enviado após encerramento iniciado pelo próprio Google. Não atribuir todas as quedas a esse defeito.
- `58322bf`: removidos controles de rodapé Cancelar escuta/Ouvir resposta/Última mensagem; pressão longa e ação acessível na Orb cancelam sem enviar. Toque curto conclui; voltar cancela. Conferência física dessas mudanças pendente.
- `1dbfdee`: usuário autorizou manter código **somente em memória até fechar o app ou desativar**. Apagar ao ir para segundo plano deixou de ser requisito. Captura/leitura continuam canceladas em inatividade/fundo, sem reinício automático. Configurações exibe Voz ativa, sem pedir código enquanto ativa. Recarregamento completo/reinício do intermediário ainda exige reativação.
- `140a121`: o ledger alcançou **20 chamadas/576 s reservados**, mais 1/4 histórico. Usuário autorizou **3 chamadas/90 s adicionais**, com tetos fixos **23/666 no mesmo ledger**. Ativar com `STT_APPROVED_VALIDATION_EXTENSION=23/666` e `STT_USAGE_FILE` original; o saldo não renova ao reiniciar. Padrão do código continua 20/600 e extensão sem ledger é recusada. Não ampliar além disso sem nova decisão.
- Pausa ampliada de 1 para **2 s** no PCM, Google e instruções. 31/31 testes simulados do intermediário, 13/13 de sessão/leitura, TypeScript e ESLint dirigidos aprovados nesta rodada; novos controles, retenção e prazo físico ainda pendentes. Não repetida a matriz completa.
- Pareamento sem digitar código foi apenas discutido como próximo ajuste; **não está implementado**. Não remover autenticação nem colocar token em variável pública/URL/log para contornar.

Conferir PIDs atuais antes de agir: houve reinício do próprio intermediário para aplicar correções; Metro 8117/PID 2360 foi preservado. Nenhuma nova build/dependência/SDK, API TTS ou serviço público.

## Atualização da retomada — 23/10/2026, após `5872b52`

Esta atualização prevalece sobre o checkpoint histórico abaixo. Branch autorizada conferida em `5872b52188124a123d3ddc043700e5cc00d4ef84`, inicialmente limpa. `50d56cb` acrescenta detecção de aproximadamente 1 s de silêncio PCM, proteção contra finish duplicado/quadros tardios e preservação da parcial/segmentos; 29/29 testes do intermediário informados no handoff, sem repetir essa suíte na conferência inicial. Correção implementada, **ainda sem homologação física nesta retomada**. `5872b52` remove “Parar leitura”; o ícone de som, a nova escuta pela Orb (com conexão ativa) e a saída da tela continuam interrompendo a leitura, conforme inspeção de código.

O usuário informou que a build PCM já foi instalada e abriu na Home. Consulta ao iPhone confirmou a instalação de Flui Voz 2.3 / `com.guicunhasou.fluiavozlocal`, versão 2.3.0, build 20261022, sem reinstalação. A informação antiga “build ainda não instalada” abaixo pertence ao checkpoint anterior.

Na retomada, **Metro 8117 e intermediário 8787 estavam parados**, sem listeners e sem arquivo de código de sessão. IP atual conferido: 192.168.0.130. Iniciados somente os serviços desta worktree, após verificar portas e propriedade: Metro PID 2360, streaming privado PID 2352. Conferidos cwd de ambos, Metro `packager-status:running` e health HTTPS autenticado `ready=true`, `streaming=true`. Não houve áudio/chamada STT nesses checks. Logs locais novos `metro-validacao-20261023.log` e `stt/validacao-iphone-20261023.log`.

**Contadores reais encontrados: 8 chamadas/216 s reservados no ledger retido**, além de 1/4 no ledger histórico separado: **9 chamadas/220 s reservados** no total registrado. O handoff que indicava 3/66 estava desatualizado. O ledger foi retomado sem zerar/substituir; limites 20/600, 30 s por escuta e uma simultânea preservados. Reserva não é cobrança efetiva.

Novo código temporário gerado pelo início normal do intermediário, sem exibição/log. Copiado temporariamente ao clipboard sob autorização anterior. Solicitado ao usuário ativar a conexão nas Configurações, permanecendo nessa tela antes do teste. Ativação, remoção visual do botão e novo fluxo físico ainda aguardam evidência. Não concluir por silêncio do usuário. Credenciais/arquivos privados e outros ambientes preservados.

---

Checkpoint de 23/10/2026. Trabalho em andamento, preservado para troca de conversa por limite de franquia. Este documento descreve evidências e pendências; não declara a nova experiência validada no iPhone.

## Base correta e isolamento

- Raiz do projeto: `/Users/guicunha/.codex/.chatgpt-projects/g-p-69f512a9480481918bb9b34c4162ae65`.
- Worktree a continuar: `flui-fluia-google-stt-atual`, dentro dessa raiz.
- Branch: `local/fluia-google-stt-atual-20261023`.
- Base Flui 2.3: `flui-ux-mapa-01`, branch `local/ux-mapa-01-reacticx-20261022`, commit `715ba523cbd295dc289c180a82820f7de258ac43`. Estava limpa nesta conferência.
- A base antiga `flui-consolidado-next`, `abd5dfacaf51350b32fa77066ee849dbfcc9fbdc`, permanece protegida e limpa. Não usar automaticamente como ponto de partida.
- Protótipo antigo `flui-fluia-google-stt`, branch `local/fluia-google-stt-20261023`, checkpoint `4ad5538`, preservado. Contém as credenciais locais já autorizadas; não importar todos os seus commits nem editar essa worktree.
- Antes da preservação WIP, HEAD `7281ef4e60f569950bd9222955635c294bca197d`. O checkpoint WIP posterior reúne um único experimento complexo: intermediário streaming, controle da sessão, conexão nas Configurações e Orb. Consulte o histórico local para seu hash.

## Estado exato dos pedidos

| Item | Estado | Evidência / pendência |
| --- | --- | --- |
| 36 — remover ciclo de status ao tocar na Orb | Implementado, commit `785cc03` | Flag e ciclo manual removidos. Sem confirmação humana específica após essa remoção. |
| 37 — Orb substitui Gravar/Parar | Código em andamento | Start/finish/cancel integrados. Falta instalar a nova captura e testar no iPhone. |
| 38 — abrir FluIA inicia escuta | Código em andamento | Uma escuta ao abrir, com conexão previamente ativada, permissão e primeiro plano. Sem retomada automática após resposta/segundo plano. Falta teste físico. |
| 39 — encerrar após 1 s de silêncio | Não resolvido | Configuração e testes simulados existem, mas o teste real no Mac precisou de `finish` explícito. Não declarar funcional. |
| 40 — texto ao vivo e resposta automática | Parcialmente comprovado | Google retornou parciais reais enquanto áudio era transmitido no Mac; fluxo completo novo no iPhone ainda pendente. Rascunho digitado deve ser preservado. |
| 41 — conexão nas Configurações | Código em andamento | Novo card de conexão e consentimento; controles/textos técnicos retirados da tela FluIA. Falta revisão física. |
| 42 — voz Zephyr | Preferência registrada / análise | Saída continua `expo-speech` do iPhone. Não há integração Google TTS. API/consumo de síntese exigem decisão específica. |

## Último fluxo fisicamente comprovado

Checkpoint `d82e3a7`: tocar em Gravar, parar, receber transcrição em português no campo, revisar, tocar em Enviar, receber resposta do motor determinístico e ouvir a leitura do iPhone com status Explicando. O usuário confirmou: “toquei em enviar e apareceu explicando com som”.

Esse é o fluxo anterior, por arquivo/síncrono. A build instalada ainda corresponde à captura anterior. Não confundir essa confirmação com a nova captura PCM/streaming.

A correção `e037429` resolveu a preparação do microfone em expo-audio 1.1.1: `allowsRecording: true` precisa de `playsInSilentMode: true`. O plugin `029a3bc` resolveu abertura nativa com UIScene no SDK Xcode 27.1. Preservar ambos.

## Arquitetura e autorizações vigentes

- iPhone → HTTPS/WSS privado → intermediário temporário no Mac → Google Cloud Speech-to-Text V2.
- Usuário autorizou expressamente transmissão em tempo real, adaptação da captura e recompilação somente de Flui Voz 2.3. Também pediu enviar automaticamente a fala concluída ao motor; isso substitui o envio manual obrigatório para a fala. O texto digitado continua com envio manual.
- `pt-BR`, modelo `short`, região `global`, recognizer implícito `_`; avaliar compatibilidade antes de mudar modelo.
- PCM WAV no fluxo antigo; no novo, PCM Int16 mono 16 kHz em memória, chunks de aproximadamente 100 ms, sem arquivos de áudio.
- Máximo 30 s por escuta, uma chamada simultânea, sem repetição automática; limite mantido de 20 chamadas e 600 s reservados na execução retida. Cada stream reserva conservadoramente 30 s antes de abrir o provedor, mesmo se falhar/cancelar.
- Só consumo agregado nos logs. Nunca registrar áudio, transcrições, tokens ou credenciais.
- Projeto Google: `project-45215c6a-31ce-4ba3-977`. API Speech-to-Text habilitada com autorização humana. ADC utilizável, integração real já realizada. Não solicitar login novamente sem verificar.
- ADC exclusivamente no Mac: `../flui-fluia-google-stt/.validation/gcloud/application_default_credentials.json`, permissão 0600. Configurar explicitamente `GOOGLE_APPLICATION_CREDENTIALS` no intermediário. Não ler/exibir/copiar conteúdo para conversa, app, ZIP ou Git.
- Google CLI isolada: `../flui-fluia-google-stt/.validation/google-cloud-sdk/bin/gcloud`; configuração isolada no mesmo `.validation/gcloud`.
- Sem bucket, endpoint público, infraestrutura permanente, alteração de faturamento ou ativação de TTS.

## Evidências recentes e limite do silêncio

- TypeScript e ESLint dirigidos passaram: `.validation/live-typecheck.log` e `live-lint.log`, vazios e com saída de sucesso na execução registrada.
- 6/6 testes de sessão/conexão passaram: `.validation/live-session-tests.log`, `tests/liveVoice.test.ts`.
- 8/8 testes dirigidos de backend/preparação nativa passaram: `.validation/live-backend-tests.log`.
- Compilação iOS assinada da captura PCM passou: `.validation/native-stream-build.log`, `BUILD SUCCEEDED`. **Ainda não instalada.**
- Não foi repetida a suíte completa do app, exportação web ou matriz visual após esses ajustes. Resultados anteriores 262/262 pertencem ao fluxo anterior.
- Primeiro teste Google streaming no Mac expirou sem conclusão. Segundo teste, com frase sintética e fallback de finalização, retornou 22 parciais, inclusive antes de terminar o trecho falado. Foram enviados 5,4674375 s de áudio; duração total de aproximadamente 8,889 s.
- `.validation/live-cloud-smoke.json`: `ok=true`, `partialBeforeSpeechEnd=true`, mas **`automaticEndWithoutFinish=false`**. O harness precisou enviar `finish` manualmente 3 s após terminar de transmitir. `ok` comprova transcrição no teste, não o requisito de silêncio.
- Os testes unitários simulam eventos de atividade de voz; não provam que o Google os emitiu nessa combinação de modelo/idioma. Reavaliar eventos/métricas/semântica antes de outra chamada paga. Não repetir cegamente tentativas.
- Contadores conferidos: execução retida `consumo-1792777163211.json` = 3 chamadas / 66 s reservados; teste sintético inicial separado `consumo-1792775105052.json` = 1 / 4. Total registrado **4 chamadas / 70 s reservados**. Reserva não é duração faturada; custo real não consultado.
- Áudios temporários dos testes sintéticos removidos. Nenhuma captura PCM nova foi conferida no aparelho.

## Arquivos e pontos de revisão

Novos controles JS:

- `src/features/assistant/voice/liveVoiceSession.ts`: sessão, cancelamento, resultado final único, limpeza antes de responder e bloqueio após falha de limpeza.
- `liveTransport.ts`: WSS privado, token em header, sem query token, sequência, timeout e backpressure.
- `nativePcm.ts`: adaptador de eventos nativos, permissões, descarte de resultados antigos e espera da última amostra antes de finalizar.
- `useLiveVoice.ts`: abertura automática uma vez, ações da Orb, cancelamento ao sair/inativar, sem escuta contínua.
- `connectionStore.ts` e `useVoiceConnection.ts`: código em memória; sobrevive à navegação e apaga ao ir ao fundo.
- `src/features/settings/FluiaVoiceSettings.tsx`: conexão, validação do intermediário streaming, aviso de Google e ativação explícita antes da escuta automática.
- `FluiAssistantSheet.tsx`: parciais na tela, fala automática para o motor, rascunho digitado preservado, Orb e cancelamento acessível. `SettingsScreen.tsx` apresenta a configuração experimental.

Intermediário:

- `tools/fluia-stt/stream-server.mjs`: HTTPS privado, ADC, ledger retomável, health autenticado e token novo a cada início.
- `stream-gateway.mjs`: orçamento, exclusão mútua, validação de PCM/protocolo e cancelamento.
- `google-stream.mjs`: Google V2, parciais, atividade de voz e tentativa de finalizar após pausa. **Principal arquivo para investigar o item 39.**
- `stream.test.mjs`: protocolo/limites e eventos simulados.
- Novas dependências somente do intermediário Mac: `@google-cloud/speech` 8.2.1 e `ws` 8.22.0. Nenhuma migração do SDK/app.

Captura nativa:

- `tools/fluia-stt/native/FluiaPcmCapture.swift`, `prepare-stream-native.cjs` e `stream-native.test.mjs`.
- Patch aplicado somente a expo-audio 1.1.1 real desta worktree, via `plugins/withFluiaSttPrivacy.js`. Rejeita versão divergente/symlink; não atualizar dependência para contornar.
- AVAudioEngine, limites de 30 s/bytes/fila, cancelamento em interrupção/inatividade/troca de rota, restauração de sessão de áudio. Precisa teste físico; revisão de corridas entre início/cancelamento e restauração continua importante.
- A build antiga não contém `fluiaStartPcm`/`fluiaStopPcm`; o adaptador deve informar necessidade da nova build, sem fingir captura.
- `FluiaVoiceInput.tsx` e os módulos síncronos antigos permanecem como referência/retorno. O componente antigo deixou de ser renderizado na tela nova; não apagar antes da validação por mera organização.

## Servidores conferidos ao salvar

- Metro próprio **8117**, PID **97294**, diretório desta worktree. URL `http://192.168.0.130:8117`.
- Intermediário streaming privado **192.168.0.130:8787**, PID **1283**, diretório desta worktree. Endpoint `https://192.168.0.130:8787`, WSS `/stream`; health autenticado `/health`.
- Logs locais: `.validation/metro-voice.log` e `.validation/stream-server.log`. Não ativar logs de rede/SDK que exponham áudio/headers.
- Conferir IP, PID, diretório e propriedade antes de agir. Não encerrar por número de porta apenas. Nenhum processo foi encerrado durante o checkpoint de continuidade.
- `npm start` dentro de tools ainda aponta para `server.mjs` antigo. Para streaming o entrypoint é **`stream-server.mjs`**; preservar `STT_USAGE_FILE` para não zerar o orçamento.
- Configuração esperada: `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_CLOUD_PROJECT`, `STT_HOST`, `STT_PORT`, `STT_TLS_CERT`, `STT_TLS_KEY`, `STT_USAGE_FILE`. Conferir nomes/validação em `settings.mjs`, sem imprimir ambiente do processo.

TLS/código:

- `.validation/stt/tls/root.crt` público e chaves privadas no mesmo diretório protegido; certificado para IP 192.168.0.130/loopback, não reutilizável automaticamente em IP novo.
- Perfil público `.validation/stt/FluIA-Experimento-Local.mobileconfig`. Usuário concluiu instalação/confiança de **FluIA Experimento Local** no iPhone e o fluxo síncrono HTTPS funcionou.
- Token privado `.validation/stt/session-code`, 0600, jamais exibir. Foi renovado ao reiniciar o streaming; é necessário ativar a nova conexão nas Configurações.
- Usuário autorizou cópia temporária para clipboard. Copiar sem mostrar e limpar somente se o clipboard ainda for exatamente o código; preservar qualquer conteúdo novo. Nunca anexar token/arquivo ao ChatGPT.

## iPhone e build

- App experimental **Flui Voz 2.3**, versão 2.3.0, bundle `com.guicunhasou.fluiavozlocal`, scheme `fluiavozlocal`.
- iPhone 16: UDID `00008140-0006459E3493001C`, CoreDevice `C0B5A712-E93B-5373-8AEF-449185C95A96`; confirmar disponibilidade antes de instalar.
- Nova build assinada pronta: `.validation/DerivedData/Build/Products/Debug-iphoneos/FluiVoz23.app`. Não recompilar por padrão se essa build ainda corresponder ao código nativo.
- Instalar somente essa build sobre o mesmo app experimental, quando preparado para o teste. Não substituir Flui 2.1/Flui 2.3 da worktree UX nem fluiteste25. Não remover outros apps.
- Só Flui NEXT Revisão foi removido com autorização específica para liberar a vaga gratuita. Backup parcial de contêiner em `.validation/iphone-backups/next-revisao-20261023/container`; não remover. Restauração/Keychain não garantidos.
- Build nativa já compilada; Fast Refresh sozinho não acrescenta os novos métodos PCM ao aplicativo instalado.

## Próxima sequência sugerida

1. Ler este checkpoint e conferir branch/status/processos, sem reiniciar o trabalho nem retornar à base antiga.
2. Investigar o encerramento por silêncio com código, métricas agregadas do health e testes sem Google. Não fazer nova chamada paga só para repetir a tentativa anterior; definir hipótese e critério de sucesso primeiro.
3. Completar revisão dos adaptadores/races relevantes e testes proporcionais. Ainda faltam testes dedicados do transporte e da nova ponte nativa, além da rodada geral após o streaming.
4. Instalar a build experimental já pronta quando compatível, ativar conexão nas Configurações e testar no iPhone: abrir→ouvir, parciais, tocar Orb→pensar→explicar, rascunho preservado, cancelar/sair/segundo plano e ausência de retomada automática.
5. Concluir item 39 e validar no aparelho, distinguindo finalização manual por Orb e automática por silêncio. Não apresentar o teste sintético como validação física.
6. Só então retomar Zephyr: saída Google TTS é trabalho novo, com autorização específica de API/consumo ainda pendente. Preferência: `pt-BR-Chirp3-HD-Zephyr`; verificar disponibilidade e condições atuais em documentação oficial antes de integrar.

## Restrições permanentes

Nenhum push, PR, merge remoto, issues, Projects, deploy/publicação. Nenhuma incorporação automática das PRs 99/100. Não alterar consolidação, outras worktrees, instalações protegidas, simuladores, SDK, credenciais ou adaptações nativas de outras cópias. `sources/` somente leitura. Não descartar alterações. Não criar subagentes sem pedido. Commits locais pequenos, em português, apenas na branch autorizada; manter testes/pendências explícitos. Após duas tentativas sem progresso verificável, reavaliar a abordagem.

## Se a próxima conversa for ChatGPT comum

Não presumir acesso ao Mac só porque os caminhos aparecem no prompt. Sem ferramentas locais, o ChatGPT deve trabalhar com os arquivos anexados e fornecer alterações/comandos pequenos para o usuário executar, aguardando a saída necessária antes do passo dependente. Não pode declarar instalação, teste, commit ou servidor em execução sem evidência. Não pedir a pasta `.validation`, `.env`, credenciais, certificados privados, token nem um ZIP indiscriminado do projeto.

O pacote de fontes para anexar deve conter somente uma seleção explícita de arquivos versionados de código/documentação/testes, sem node_modules, ios gerado, dados locais ou segredos. É contexto para análise, não exportação executável completa nem backup do ambiente.
