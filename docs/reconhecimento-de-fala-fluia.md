# 12 — Reconhecimento de fala na FluIA

Investigação em 23/10/2026. Nenhum serviço contratado, API ativada, áudio capturado ou dependência instalada. A FluIA continua sem reconhecimento de fala.

## Estado real do aplicativo

O projeto tem expo-speech ~14.0.8 para leitura de texto e o Pod ExpoSpeech. A API local em node_modules/expo-speech/src/Speech/Speech.ts oferece síntese, não captura/transcrição. Não há módulo de reconhecimento de fala declarado no pacote. O histórico e o motor de conversa são determinísticos. O preview Ouvindo da Orb continua um teste visual; não solicitar microfone ou simular uma transcrição por causa dele.

[Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/) documenta texto para fala. O endereço histórico SDK54 consultado redirecionou para a documentação atual; por isso a conclusão sobre a instalação usada aqui também foi conferida diretamente no pacote local.

## Alternativas

| Opção | O que exige | Rede e privacidade | Avaliação para o NEXT |
|---|---|---|---|
| Ditado do teclado iOS | Usar o microfone do próprio teclado, se habilitado pelo usuário | Depende das configurações/recursos do sistema; não é captura pelo Flui | Alternativa imediata para preencher o campo, a conferir no aparelho. Não controlamos o estado Ouvindo por esse mecanismo. |
| Reconhecimento nativo via módulo compatível com SDK54 | Módulo/configuração/permissões e nova Development Build | Reconhecimento local depende de suporte do dispositivo, idioma e modelo; não presumir offline | Melhor candidato para uma prova de conceito curta após autorização de mudança nativa. |
| Google Cloud Speech-to-Text V2 | Captura de áudio, backend autenticado, billing/API e rede | Envia áudio ao provedor; exige decisão de privacidade e controle de custos | Viável tecnicamente, mas infraestrutura desnecessária antes de testar a alternativa nativa. |

O projeto [expo-speech-recognition](https://github.com/jamsch/expo-speech-recognition) documenta uma variante para SDK54, permissões, reconhecimento do sistema e verificação de capacidade local. É biblioteca de terceiro, não expo-speech. A versão exata e suas APIs precisam ser conferidas antes de instalar; o README principal pode evoluir. Uma prova de conceito exigiria nova compilação, não apenas Fast Refresh. Suporte a pt-BR/offline no iPhone 16 não foi medido ou garantido. Quando modo local estrito não estiver disponível, não recorrer à rede silenciosamente.

## Google Cloud: viabilidade, custos e limites

A [lista V2 de idiomas](https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages?hl=pt) inclui pt-BR em combinações de modelo/região. Selecionar e confirmar essa combinação antes de qualquer teste. O [guia V2 de streaming](https://docs.cloud.google.com/speech-to-text/docs/streaming-recognize) descreve fluxo bidirecional gRPC e requer billing habilitado. Para frases curtas, capturar uma fala e transcrever após o fim é uma opção mais simples para avaliar; nenhuma delas foi implementada.

A proposta de integração seria: app captura só ao tocar → backend próprio com limite/tamanho/duração e identidade do cliente → Speech-to-Text → texto para revisão no campo → motor local existente. Credenciais de serviço ficariam no servidor, nunca no app; não reutilizar a chave do Google Maps. [Autenticação](https://docs.cloud.google.com/speech-to-text/docs/v1/authentication) e [referência RPC V2](https://docs.cloud.google.com/speech-to-text/docs/reference/rpc/google.cloud.speech.v2) documentam os mecanismos de acesso. Backend, proteção contra abuso, autorização e autenticação ainda não existem para esse fluxo.

Na [tabela de preços](https://cloud.google.com/speech-to-text/pricing), V2 Standard de consumo padrão começa em US$0,016 por minuto na primeira faixa. Exemplo aritmético, sem contratação: 100 falas de oito segundos são cerca de 13,33 minutos, ou US$0,21 só de transcrição nesse preço, antes de impostos, câmbio, backend/rede e regras aplicáveis. Não tratar crédito promocional como operação gratuita. Não são valores garantidos para outro modelo, plano, região ou época; reconferir antes de ativar. Nenhuma chamada faturável foi feita.

O [FAQ de uso de dados V1](https://docs.cloud.google.com/speech-to-text/docs/v1/data-usage-faq) e a [política de logging V1](https://docs.cloud.google.com/speech-to-text/docs/v1/data-logging) distinguem processamento, metadados e adesão opcional ao uso de conteúdo. São referências V1: os endereços V2 tentados não estavam acessíveis nesta consulta. Não extrapolar essas garantias automaticamente para V2/Chirp; revisar os termos do produto/modelo/região escolhidos antes de enviar áudio. A proposta do Flui é não guardar áudio/transcrição fora do histórico local voluntário, não registrar conteúdo em logs e não aderir a programas de treinamento.

## Fluxo proposto para a prova de conceito

1. Botão explícito Tocar para falar; ao tocar, interromper a leitura de resposta e explicar a permissão de microfone/reconhecimento necessária.
2. Capturar uma frase curta, com botão Parar, Cancelar e duração máxima proposta de 15 segundos. Não ouvir em segundo plano, ao bloquear a tela ou depois de sair da FluIA.
3. Mostrar Ouvindo somente enquanto a captura estiver ativa; depois Transcrevendo. Exibir o texto no campo para revisar, editar ou descartar.
4. Enviar apenas por ação explícita. A fala não executa reservas/pagamentos, não altera bateria e não inicia navegação automaticamente. A transcrição entra pelo mesmo answerMessage e preserva a reserva exata de 5%.
5. Enquanto lê a resposta, manter Explicando e oferecer Parar leitura. Solicitação nova invalida callbacks antigos.
6. Tratar permissão negada, serviço/idioma indisponível, silêncio, interrupção, falha de rede e tempo excedido. O teclado segue utilizável.

Não se promete latência: medir no iPhone desde tocar até início da captura, do fim da fala até transcrição final e da confirmação até resposta. Proposta de aceitação da experiência, não resultado medido: transcrição aparecer em até três segundos após o fim da fala na maior parte dos testes de frases curtas. Testar pt-BR com ruído, números/porcentagens e nomes de estações; se não atender, manter digitação disponível.

## Decisão e próximo passo

Investigação concluída. Recomendo primeiro testar reconhecimento nativo com tocar para falar e revisão do texto. Isso depende de autorização específica para a biblioteca nativa/configuração e nova Development Build, preservando a instalação e os dados atuais. Google Cloud fica como alternativa futura se os testes justificarem qualidade/latência/idiomas e houver aprovação de custos, privacidade e backend. Não criei botão inoperante, serviço fictício, fluxo que pede credenciais ou estado Ouvindo que sugira uma captura já pronta.
