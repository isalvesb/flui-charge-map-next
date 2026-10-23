# Flui NEXT — pesquisas e propostas UX/UI

Referência: 22/10/2026, America/Recife. Propostas para decisão; não autorizam contratação, migração ou compilação nativa. Continuidade e commits em `ux-ui-backlog-33.md`.

## 12 — tocar para falar

### Estado constatado

A instalação usa `expo-speech ~14.0.8` para ler respostas. Não há integração de reconhecimento de fala no código/dependências declaradas. O ciclo visual “Ouvindo” permanece apenas demonstração. A referência online do SDK54 redirecionou para a versão latest; as assinaturas usadas na implementação 11 foram conferidas nos tipos do pacote instalado.

### Opções

| Opção | Vantagem possível | Dependências e limites |
|---|---|---|
| Reconhecimento nativo Apple, por módulo React Native compatível com SDK54 | Investigar captura curta no próprio dispositivo | Exige módulo/compilação e permissões novos. Reconhecimento local depende de suporte do aparelho/idioma; não prometer offline antes de medir. |
| Google Cloud Speech-to-Text V2 via servidor | Transcrição em serviço separado, mantendo motor determinístico local | Exige captura nativa e servidor autenticado, rede e orçamento; credenciais privilegiadas ficam fora do app. Não provisionado. |
| Texto digitado + leitura atual | Disponível nesta build | Continua sendo o caminho funcional até decisão explícita sobre captura. |

A [API Speech da Apple](https://developer.apple.com/documentation/speech/) atende reconhecimento de áudio. Para impedir envio pela rede, a propriedade [requiresOnDeviceRecognition](https://developer.apple.com/documentation/speech/sfspeechrecognitionrequest/requiresondevicerecognition) depende de `supportsOnDeviceRecognition`. Suporte em português e condições reais precisam de prova no aparelho.

O [método de reconhecimento síncrono V2](https://docs.cloud.google.com/speech-to-text/docs/reference/rest/v2/projects.locations.recognizers/recognize) retorna transcrição após processar o áudio. Fluxo proposto: tocar → informar permissão/contexto → gravar trecho curto → parar/cancelar → transcrever → mostrar texto editável → usuário envia ao `answerMessage`. A transcrição não substitui regras, recomendações ou reserva mínima do motor.

### Custo, privacidade e medição

Na consulta à [tabela oficial de preços](https://cloud.google.com/speech-to-text/pricing), reconhecimento V2 Standard aparece a US$0,016/min na primeira faixa de volume. Exemplo aritmético: 100 trechos de 15 s = 25 min = US$0,40 apenas de transcrição, sem servidor, tráfego, armazenamento ou tributos. Não é proposta comercial e deve ser reconferido antes de contratar.

O [programa de data logging](https://docs.cloud.google.com/speech-to-text/docs/v1/data-logging) permite uso de dados enviados para melhoria do serviço mediante adesão. Não habilitar por conveniência de preço. Antes de qualquer captura: explicar destino do áudio, obter permissões necessárias, definir retenção/exclusão e limitar duração. Não guardar áudio por padrão nem incluir conta de serviço no aplicativo.

Latência e precisão ainda não medidas. Piloto futuro: frases curtas em pt-BR, ambiente silencioso/ruidoso, permissão negada, offline, cancelamento, interrupção, transcrição vazia e erro do servidor. Medir tempo do toque à transcrição editável e consumo real por sessão.

### Decisão proposta

Concluir primeiro avaliação do reconhecimento nativo em uma build experimental separada, somente após autorização de dependência/compilação. Google Cloud fica como alternativa com orçamento e arquitetura aprovados. Nenhum serviço pago, microfone, módulo ou credencial foi adicionado.

## 20 — seleção de veículo no Auto Experience

### Referências verificadas e incertezas

| Referência oficial | O que a fonte sustenta | O que ainda não está comprovado |
|---|---|---|
| [BYD Dolphin Plus Brasil](https://www.byd.com/br/car/dolphin-plus) | Central rotativa de 12,8 polegadas | Resolução útil/proporção exata, ano/versão do veículo alvo e margens reservadas pelo sistema |
| [Renault Megane E-Tech Brasil](https://www.renault.com.br/electric-vehicles/megane-e-tech/monte-o-seu.html) | Central OpenR de 9 polegadas na configuração consultada | Viewport útil, variações por mercado/ano e orientação do modelo alvo |

Polegadas não determinam proporção. Não mapear automaticamente esses veículos aos formatos 16:9/9:16/panorâmico atuais. Registrar fonte, mercado, ano/versão, orientação, dimensão útil medida e data da conferência por modelo.

As páginas oferecem referências visuais públicas; licença para incorporar fotos/logos no aplicativo não foi estabelecida. Proposta inicial usa ilustrações esquemáticas próprias ou material fornecido com autorização. Links de referência não equivalem a autorização de reutilização de imagens. Nenhuma imagem foi copiada.

### Proposta para revisão antes de implementar

1. Selecionar marca e modelo, com ano/versão explícitos e busca curta.
2. Mostrar ficha do modelo escolhido: referência da central, orientação suportada e estado da evidência (verificado ou aproximação).
3. Abrir a prévia Flui no viewport confirmado. Modelo sem dimensão útil confirmada exibe “Prévia aproximada” e mantém a seleção manual de formato como alternativa.
4. Comparar mapa, estação e instruções da FluIA sem trocar o veículo/autonomia usados nos cálculos pessoais. A preferência visual do carro fica separada do veículo do cenário.

Exemplo de sequência: **Marca → Modelo/versão → Central de referência → Prévia Flui**. Primeiro piloto sugerido: Dolphin Plus, apenas após confirmar ano e geometria; Megane como segundo contraste de interface. Não há reprodução integral de painéis ou simulação de dirigibilidade.

A [documentação Apple de CarPlay](https://developer.apple.com/carplay/) usa categorias, templates e entitlement próprio. Esta proposta é uma prévia visual local, sem integração ou certificação CarPlay.

### Decisão necessária

Escolher modelo/ano do piloto e aprovar a proposta visual antes de substituir os seletores atuais. Implementação integral, fotos licenciadas e integração automotiva permanecem fora desta execução. O Auto Experience atual foi preservado.
