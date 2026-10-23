# Flui 2.3 — entrega para revisão de UX/UI e FluIA

## Escopo da revisão

A branch de trabalho é `local/fluia-google-stt-atual-20261023`, derivada do Flui 2.3 em `715ba52`. A main conferida no GitHub estava em `94c862e`: a proposta inclui também as melhorias locais acumuladas de mapa/Orb, catálogo, perfil, configurações, acessibilidade, ficha de estação, planejador, apresentação e offline. O histórico completo foi preservado, sem reescrever branches protegidas.

Trata-se de **revisão em rascunho**, com voz experimental dependente de intermediário privado no Mac. A configuração nativa atual identifica o app separado **Flui Voz 2.3**, não uma candidata de produção. Não há deploy, publicação de aplicativo, atualização de SDK, integração Zephyr ou reconhecimento independente do Mac nesta entrega.

## Itens 36–43

Os dois pedidos chamados 43 foram mantidos e diferenciados pelo assunto.

| Pedido | Implementação atual | Evidência e limite |
| --- | --- | --- |
| 36 — retirar alternância manual de status | Feito | Ciclo/flag removidos; Orb reflete estados reais. |
| 37 — gravar/parar pela Orb | Feito | Botões antigos fora da tela atual. Toque inicia/conclui; pressão longa cancela. Cancelamento físico completo ainda pendente. |
| 38 — ouvir ao abrir pela Home | Feito | Uma escuta, com conexão previamente ativada, permissão e primeiro plano. Fluxo principal conferido no iPhone; não é escuta contínua. |
| 39 — concluir pelo silêncio | Feito, ajustado para cerca de 2 s | Usuário pediu prazo maior que 1 s e confirmou frase completa/resposta única no iPhone. |
| 40 — transcrição ao vivo e resposta automática | Feito | Parciais na tela, sem preencher o campo digitado; resultado final segue para o motor determinístico e leitura. Fluxo principal conferido; rascunho durante cancelamento ainda não homologado fisicamente. |
| 41 — conexão nas Configurações | Feito | Sem botão/campos técnicos e sem os avisos de apoio antigos no rodapé da FluIA. Consentimento sobre envio de áudio permanece nas Configurações. |
| 42 — voz Zephyr | Pendente | Saída continua expo-speech/iPhone. Google TTS não ativado nem integrado. |
| 43 — conectar sem burocracia | Parcial | Pareamento sem colar código confirmado no iPhone/Mac. Ainda depende do Mac e de permissão local; execução autônoma no iPhone foi adiada. |
| 43 — abrir PR | Publicação desta proposta autorizada | Exceção específica ao bloqueio anterior de operações remotas; sem merge automático nem outras publicações. |

## Verificações desta preparação

- `npm run check`: TypeScript e lint sem erros; **271/271 testes do app** aprovados. Um aviso preexistente de dependência de ref em `ConnectivityContext.tsx:48` permanece.
- Intermediário: **40/40 testes locais** aprovados na última rodada, incluindo limites, cancelamento, silêncio, PCM tardio e pareamento com autorização simulada. Não são testes de precisão Google ou homologação física completa.
- Exportação web aprovada com **15 rotas**, sem publicar a exportação. Não equivale a uma nova revisão visual no navegador ou a validação nativa.
- Versões de blobs novas no histórico revisadas para padrões de credenciais/arquivos protegidos, sem achados pelos padrões utilizados. `.validation`, ADC, chaves TLS e arquivos nativos gerados não entram na proposta.
- Usuário confirmou no iPhone a frase com pausa no meio, conclusão automática e uma única resposta falada; retenção após bloquear/desbloquear; remoção de Parar leitura; conexão sem colar código.

## Limitações para a revisão

- Não certifica Android, Release, VoiceOver humano, desempenho, operação sem Mac ou estabilidade prolongada. Cancelamento físico, rascunho e segundo plano durante captura continuam pendentes.
- Configuração experimental/bundle, patch nativo restrito ao expo-audio 1.1.1 e ferramentas temporárias precisam de decisão antes de uma integração para distribuição. Não substituir outros apps nem reaproveitar credenciais locais.
- OAuth Google e TLS ficam exclusivamente no Mac. Entrada usa Google STT V2; saída usa voz do iPhone; o motor continua determinístico. Não há IA generativa nesta alteração.
- Orçamento conservador por escuta, uma chamada por vez, máximo 30 s e sem repetição automática. Extensões de teste são expressamente autorizadas e não renovam o ledger em reinícios.
- Sem incorporar as PRs 99/100 nesta preparação, sem alterar issues/Projects ou modificar a consolidação protegida.

Registro detalhado de continuidade e evidências: `docs/fluia-google-stt/PROGRESSO.md` e `CONTINUIDADE-36-42.md`. Os checkpoints antigos descrevem etapas históricas; os estados atuais acima prevalecem para esta revisão.
