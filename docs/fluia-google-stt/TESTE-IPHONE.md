# Teste da FluIA por voz — build isolada

## Estado atual

A adaptação parte do Flui 2.3 (`715ba52`). A build própria se chama **Flui Voz 2.3**, identificador `com.guicunhasou.fluiavozlocal`. Use esse app para o experimento; a instalação anterior não contém o módulo de microfone.

Uma chamada real ao Google, com frase sintética gerada no Mac, passou pelo HTTPS privado e retornou a transcrição esperada. Isso ainda não comprova captura no iPhone. Consulte PROGRESSO.md para consumo, commits e verificações atualizadas.

## Preparação necessária

1. iPhone 16 conectado, desbloqueado e confiando neste Mac. Mac e iPhone precisam alcançar a mesma rede local.
2. Assinatura própria para o identificador experimental e instalação separada. Não reutilizar um identificador existente para contornar problemas de assinatura. Nenhum app existente deve ser apagado ou substituído sem decisão específica.
3. HTTPS privado: o certificado raiz de teste está em `.validation/stt/tls/root.crt`. Transfira somente esse arquivo público ao iPhone; as chaves `.key` ficam no Mac. A instalação e a confiança precisam de intervenção consciente do usuário. Nenhum certificado foi instalado automaticamente.
4. Depois de instalar o certificado, o iOS exige ativar a confiança SSL/TLS em Ajustes → Geral → Sobre → Certificados Confiáveis. Confira o emissor **FluIA Experimento Local**. [Orientação da Apple](https://support.apple.com/pt-br/102390).
5. Iniciar o intermediário somente no IPv4 privado atual do Mac. Credenciais Google ficam no Mac, referenciando o arquivo ADC existente por caminho absoluto. Não copiar seu conteúdo. O endereço informado ao app não pode conter token, login ou parâmetros.
6. Usar Metro próprio, em porta livre, com origem nesta worktree e inspetor de rede nativo desativado. Não parar/trocar o Metro de outra sessão.
7. Na FluIA, tocar em **Conexão** e informar o HTTPS privado e o código temporário de sessão. O código fica em `.validation/stt/session-code` no Mac, com permissão 0600; não exibi-lo em capturas, logs ou conversa. Ele permanece apenas na memória do app e é apagado ao sair da página ou ir ao fundo.

A confiança nesse certificado vale para o experimento. As chaves ficam locais e devem ser protegidas. Ao encerrar definitivamente, remover o perfil/certificado de teste e sua confiança no aparelho. Não aceitar certificados de outra origem para contornar erro de conexão.

## Uma frase, revisão e envio

1. Abra a FluIA e deixe o som ativado.
2. Digite um prefixo, se quiser verificar preservação do rascunho.
3. Leia o aviso sobre envio do áudio ao Google. Toque em **Gravar** e autorize o microfone quando solicitado.
4. Fale uma frase curta, por exemplo: **Quero carregar rápido**. A Orb deve indicar **Ouvindo**.
5. Toque em **Parar**. A gravação também termina em até 30 segundos. Durante a transcrição, a Orb indica **Pensando**.
6. Confira o texto acrescentado ao campo, corrija se necessário e toque em **Enviar**. A gravação não envia a pergunta automaticamente ao motor.
7. A resposta vem do motor determinístico atual. Quando a FluIA a lê, o status deve permanecer **Explicando** até o áudio terminar. Os controles de parar/ouvir continuam disponíveis.

A saída ainda usa a leitura existente do sistema (`expo-speech`). O Google foi integrado para reconhecer a fala de entrada; não foi contratado nem integrado um serviço de voz sintética Google.

## Verificações físicas pendentes

- Primeiro pedido de permissão e recuperação após negar.
- Frase em pt-BR, acentos e nomes de estações; precisão e tempo percebidos.
- Cancelar gravando e cancelar durante transcrição; nada deve ser acrescentado depois.
- Colocar no fundo, bloquear, voltar ou receber interrupção durante captura. Não retomar gravação automaticamente.
- Silêncio, áudio incompreensível, Mac indisponível, TLS não confiável, rede sem acesso e limite da sessão.
- Preservação do texto digitado enquanto a transcrição ocorre; nenhuma consulta enviada sem toque em Enviar.
- Leitura depois da captura, controle de som, teclado, fonte ampliada, VoiceOver e áreas seguras.
- Mapa nativo e demais fluxos na nova build.
- Arquivos temporários são removidos nos caminhos controlados de conclusão/cancelamento/erro. Encerramento forçado pelo sistema ainda precisa ser avaliado; não prometer exclusão imediata após matar o processo.

Faça poucas tentativas. Cada envio ao Google reserva consumo antes da chamada, inclusive se houver erro/cancelamento depois. O intermediário admite uma chamada por vez, no máximo 20 chamadas e 600 segundos por execução, sem repetição automática. Os arquivos `consumo-*.json` contêm somente contadores agregados.

## Notas para continuidade técnica

- Branch exclusiva: `local/fluia-google-stt-atual-20261023`.
- Certificados e saídas nativas ficam em `.validation/` ou `ios/`, ignorados pelo Git.
- O prebuild usa somente as versões do SDK 54 já fixadas no package-lock. O plugin aplica a correção nativa de interrupção, limitada ao expo-audio 1.1.1. Após reinstalar dependências, executar novamente o prebuild antes de compilar; a correção não altera outra worktree nem atualiza o pacote.
- Neste Xcode, a compilação de teste passa `IPHONEOS_DEPLOYMENT_TARGET=15.1` a todos os alvos, incluindo bundles de recursos dos Pods. A primeira tentativa sem esse parâmetro falhou por mínimos antigos desses bundles. Isso não exige atualização do SDK.
- A compilação sem assinatura usa `CODE_SIGNING_ALLOWED=NO`; ela não gera uma instalação válida para o iPhone por si só.
- Antes de iniciar/encerrar servidores, conferir porta, diretório e propriedade. O servidor loopback do teste Google e o servidor web temporário foram encerrados após as verificações.
