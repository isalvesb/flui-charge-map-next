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

## 31 — ampliação de catálogo e avaliação do Supabase

### Arquitetura constatada

Catálogo de 12 estações incluído no aplicativo, com imagens locais, dados de exemplo e cálculos em linha reta. Favoritos, preferências, avaliações do usuário e histórico ficam no AsyncStorage; não existe confirmação remota de disponibilidade. O problema de fotos web do item 30 estava na preparação do cache, não em falta de banco remoto.

| Caminho | Benefício | Custo de mudança e decisão |
|---|---|---|
| Ampliar conjunto fictício local | Mais variedade de conectores, bairros e casos de apresentação, preservando funcionamento local | Exige curadoria/identificação e testes de consistência; não melhora veracidade dos dados |
| Importar fonte externa licenciada para consulta local | Pode ampliar cobertura geográfica | Exige conferir licença por fonte, atribuição, atualização, deduplicação e marcação de dados não verificados |
| Usar Supabase para catálogo administrado | Postgres/PostGIS, edição central e políticas de acesso | Muda arquitetura/operação: autenticação, RLS, disponibilidade remota, custos e estratégia offline próprios |

[Open Charge Map](https://www.openchargemap.org/develop/api) oferece API mediante cadastro/chave. O [guia do projeto](https://github.com/openchargemap/ocm-docs/blob/master/System/DeveloperGuide.md) distingue dados abertos e condições de origem; o filtro `opendata=true` é candidato a avaliar. Não foram solicitadas chaves nem importados dados. Licença por fonte e atribuição ainda precisam ser verificadas antes de qualquer distribuição. Catálogo externo também não comprova que um carregador está funcionando agora.

O [PostGIS no Supabase](https://supabase.com/docs/guides/database/extensions/postgis) oferece consultas geográficas úteis para um catálogo maior. Isso não resolve sozinho persistência local ou conferência de disponibilidade. A integração [PowerSync apresentada pelo Supabase](https://supabase.com/partners/catalog/powersync) ilustra uma camada adicional de sincronização Postgres/SQLite para uso offline, que precisaria ser avaliada separadamente.

Na [orientação de segurança](https://supabase.com/docs/guides/database/secure-data), acesso a dados precisa de políticas adequadas; credenciais privilegiadas não devem estar no cliente. Não há motivação demonstrada nesta etapa para assumir nova infraestrutura, conta ou custo recorrente apenas para ampliar 12 exemplos.

### Recomendação e próximo passo autorizado somente após decisão

Para o NEXT, manter fonte local e finalizar a experiência/cache antes de ampliar o volume. Se mais cenários forem necessários, propor primeiro um lote fictício pequeno, identificado e auditável (carga rápida, indisponibilidade, conectores variados, cobertura de bairros). Se o objetivo passar a ser informação operacional real, definir fonte, licença, atualização e operação antes de escolher banco.

Não foi criado projeto Supabase, migrado armazenamento ou substituído dado fictício por alegação real. Aprovar origem/licença e escopo antes de iniciar importação ou banco remoto.

## 32 — proposta de configurações avançadas de apresentação

### O que foi feito e o que esta proposta acrescentaria

Os itens 19/21 apenas transferiram controles existentes de veículo/autonomia/origem/bateria e laboratório para uma tela interna protegida por `__DEV__`. Esses controles mantêm a persistência histórica de preferências do app. Isso ainda não constitui um sistema de cenários isolados.

A proposta abaixo acrescentaria uma camada de cenário fictício separada. Ela exige decisão sobre persistência e experiência antes de implementar novos campos. Nenhum nome, foto, favorito ou avaliação foi sobrescrito nesta etapa.

### Organização visual proposta

**Apresentação interna**

- **Cenário:** nome do cenário e estado ativo/inativo. Ativar deve explicar quais dados serão apresentados; voltar ao uso comum restaura a leitura dos dados do usuário.
- **Perfil fictício:** nome e fotografia de uma lista local com origem/autorização conhecidas.
- **Veículo:** marca/modelo de apresentação, imagem local e autonomia usada no cenário, sem presumir especificação oficial.
- **Favoritos do cenário:** seleção explícita de IDs existentes no catálogo, com fotos locais preparadas para offline.
- **Comentários e avaliações simulados:** dados com autoria e origem fictícias; não entram na coleção de avaliações pessoais nem são publicados.
- **Condições iniciais:** carga inicial, origem escolhida/coordenada de referência e indicação clara de que não substituem GPS autorizado.

Ação principal **Aplicar cenário** mostra resumo do que será exibido. Ação **Encerrar apresentação** desativa o cenário sem apagar favoritos, histórico, foto ou comentários do usuário. Evitar um botão genérico que limpe todo o armazenamento.

### Separação e precedência propostas

| Informação | Dados pessoais/atuais | Cenário fictício proposto |
|---|---|---|
| Nome/foto/veículo | Leitura atual preservada | Registro próprio de identidade/veículo do cenário |
| Favoritos | `@flui:favoriteStationIds` preservado | Lista de IDs específica do cenário |
| Comentários/avaliações | Coleção local existente preservada | Coleção separada, sempre classificada como simulação |
| Bateria | Valor manual e sua data/origem preservados | Carga inicial com origem simulação; edição durante cenário não altera o valor pessoal salvo |
| Localização | GPS autorizado mantém sua finalidade | Origem de simulação explícita; sem sobrescrever `LocationContext` |
| Armazenamento | Chaves atuais inalteradas | Chave versionada nova, por exemplo `@flui:presentationScenario:v1`, apenas após decisão |

Enquanto ativo, o cenário fornece uma visão temporária dos dados; desativar volta à visão original. A nova estrutura precisa manter validação de IDs, limite de nomes, 0–100% e autonomia positiva; imagens vêm de assets locais permitidos. Não usar `clearAll()` para trocar ou encerrar cenário. Bloqueio `__DEV__` é limite de distribuição, não autenticação de um serviço remoto.

### Entrega incremental sugerida após decisão

1. Aprovar campos, separação e aparência da tela.
2. Implementar um cenário local com nome/foto/veículo, sem tocar em favoritos/comentários existentes; validar ativar/encerrar/reabrir/offline.
3. Acrescentar favoritos fictícios e, em outro incremento, avaliações simuladas com identificação própria.
4. Verificar reset exclusivo do cenário, migração versionada, ausência de exposição pública e preservação dos dados originais.

Conferência obrigatória da proposta: identidade desejada, imagens disponíveis/autorizadas e regra de precedência de bateria/localização. Não foi implementada a camada nova de persistência nem habilitado envio de dados.


## Atualização de 23/10 — base simulada ampliada

Após escolha explícita do usuário, catálogo local ampliado de 12 para 66 estações (54 novas, total 47 em SP e 19 no RJ). Dados anteriores preservados; novos pontos são fictícios, sem avaliações/fotos/favoritos atribuídos e sem fontes externas. Não representa base operacional verificada nem migração Supabase. Planejador ainda usa paradas próprias de destinosViagem e será revisado depois desta base, por instrução humana. Ver checkpoints S06/S09 no registro UX/UI.

Relato físico novo: offline não funcionou no iPhone. Sintomas solicitados, sem confirmação ainda. Fonte nativa de desenvolvimento depende do Metro; evidência de cache web não prova arranque ou fotos offline no iPhone. Nenhuma recompilação/instalação realizada.
