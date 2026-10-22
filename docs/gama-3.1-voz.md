# Gama 3.1 — proposta de voz, sem captura implementada

Inspeção em 22/10/2026. `FluiAssistantSheet.tsx` usa `expo-speech` para ler a
resposta em pt-BR, parar fala e ativar/desativar a saída. O controle vive no chat;
não há reconhecimento, transcrição, escuta contínua ou comando de ativação.
Os estados visuais não devem sugerir que o microfone está ouvindo.

## Alternativas

| Opção | Uso no Flui e limite |
| --- | --- |
| `expo-speech` existente | Síntese de texto; não reconhece fala. Preservar. [Expo](https://docs.expo.dev/versions/latest/sdk/speech/) |
| APIs nativas com adaptador Expo | Candidato para um piloto após aprovação; usa Speech no iOS e SpeechRecognizer no Android. O módulo comunitário documenta distribuição `sdk-54` e exige development build. Compatibilidade da versão exata ainda precisa de teste. [Mantenedor](https://github.com/jamsch/expo-speech-recognition/blob/main/README.md) |
| Reconhecimento no aparelho | Preferível para privacidade se pt-BR e o modelo estiverem disponíveis. No iOS, exige verificar `supportsOnDeviceRecognition` e solicitar `requiresOnDeviceRecognition`; não presumir suporte universal. [Apple](https://developer.apple.com/documentation/speech/sfspeechrecognizer/supportsondevicerecognition) |
| Serviço de reconhecimento do sistema | Pode enviar áudio para servidores; não é garantia de funcionamento offline ou de ausência de terceiros. Android oferece verificação e criação do reconhecedor local em APIs compatíveis. [Android](https://developer.android.com/reference/android/speech/SpeechRecognizer) |
| Vosk / whisper.cpp locais | Alternativas sem backend próprio, mas exigem modelos, armazenamento, integração nativa e medição de consumo; não são uma simples adição ao Expo Go. Fora deste primeiro piloto. [Vosk](https://alphacephei.com/vosk/), [whisper.cpp](https://github.com/ggml-org/whisper.cpp) |
| Transcrição em API externa | Requer rede, credenciais protegidas, política de retenção e orçamento. Não aprovada nem implementada. |

A documentação de Speech solicitada como SDK 54 redirecionou à versão atual.
A API instalada e seus tipos foram conferidos localmente; não se inferiu que
todas as APIs atuais estejam disponíveis no SDK 54.

## Proposta mínima para aprovação

Toque para falar → explicar processamento/permissões → reconhecer uma fala curta
→ mostrar transcrição editável → enviar pelo mesmo fluxo de texto da FluIA.
Sem escuta em segundo plano, palavra de ativação, gravação persistente ou envio
silencioso. Erro, permissão negada e ausência de modelo retornam ao teclado.
Não migrar automaticamente do reconhecimento local para nuvem.

- Consultas: “quero carregar rápido”, “tenho pouca bateria”, “explique a recomendação”.
- Ações internas futuras: “mostrar favoritos”, “abrir o planejador”, “filtrar CCS2”.
  Mapear a comandos permitidos; nunca interpretar texto livre como URL ou código.
- Ações externas: apresentar destino, origem e avisos; exigir a confirmação já
  existente. A transcrição sozinha não autoriza abrir rota, compartilhar GPS ou alterar dados.
- “Parar a leitura” deve controlar apenas a síntese, independentemente da transcrição.

Microfone e reconhecimento exigem avaliação separada de permissão e política do
sistema. Explicar antes se o processamento sairia do aparelho. Não solicitar GPS
como condição para falar. Não guardar áudio/transcrições para análise sem novo consentimento.

## Decisão e verificação

Recomendação: aprovar primeiro um piloto local via adaptador nativo, limitado a
pt-BR e a aparelhos que comprovem reconhecimento no dispositivo; confirmar versão,
development build, permissões e testes físicos antes de ativar. Não há contratação
de serviço ou preço presumido nesta proposta; eventual nuvem exige escolha e orçamento.

Resultado desta entrega: investigação de código e fontes primárias, sem alteração
de dependências, captura, transmissão, permissões ou motor. Não foram medidos
precisão, latência, bateria ou reconhecimento físico. Nenhuma suíte repetida por
esta alteração exclusivamente documental. Próximo passo depende da aprovação da solução.
