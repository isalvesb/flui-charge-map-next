# Gama 3.2 — contexto e ações internas

Implementado: painel recolhível “Ver contexto atual” na FluIA. Expõe veículo,
autonomia configurada, bateria e sua origem, origem demonstrativa e quantidade de
estações recebidas. Usa os valores efetivamente passados à consulta. Não apresenta
GPS demonstrativo como posição real nem catálogo como disponibilidade confirmada.
Explica que valores atuais servem para novas consultas; não reinterpreta mensagens antigas.

Atalhos por toque para Configurações, Perfil/favoritos e Planejador usam as rotas
existentes, fechando a ficha da FluIA. Não adicionam um executor de comandos.
Nada é alterado ou enviado apenas por abrir o painel. Cálculos e motor preservados.

## Evolução incremental proposta

| Recurso | Fonte atual / próximo limite |
| --- | --- |
| Veículo e bateria | PreferencesContext; edição continua nos controles existentes |
| Origem | Demonstração já selecionada; GPS somente pelo fluxo opcional de rota |
| Estações e filtros | Conjunto entregue pelo mapa; não inferir por que o filtro excluiu algo |
| Favoritos | Consultar pelo Perfil; eventual recomendação exclusiva de favoritos depende de decisão de produto |
| Viagem | Abrir o planejador, que lê as mesmas preferências; não duplicar o cálculo no chat |
| Ações locais futuras | Lista tipada de intenções, validação de parâmetros e confirmação para gravações |
| Ações externas | Reutilizar verificação de rede, escolha de localização e confirmação; nunca abrir por texto recebido automaticamente |

Não foi criada nova camada de IA, backend, credencial, coleta ou sincronização.
Se for aprovada ampliação de intenções, a apresentação deve chamar funções do
domínio existentes e retornar um resultado tipado, sem executar URLs ou código livre.

Verificações: TypeScript e lint; 35 testes pertinentes de apresentação, chat e
recomendação passaram, incluindo dois novos casos de contexto e preservação da
entrada. Nova execução dos testes de apresentação após o ajuste de texto passou.
Device Hub/iOS: painel expandido informa 70%, 400 km, FIAP e 12 estações; dados
demonstrativos e aviso sobre respostas anteriores foram observados na árvore acessível.
Captura e teste do atalho do planejador em `.validation/gama-avancada/`.

Limites: favoritos não são novo critério de recomendação; não há consulta a GPS,
execução por voz ou atualização retroativa de mensagens. Sem validação física/Android/Release.
Próximo passo: decidir quais ações de escrita justificam novas confirmações antes de ampliar o escopo.
