# Flui 2.3 — entrega para revisão de UX/UI e FluIA

## Escopo da revisão

A branch de trabalho é `local/fluia-google-stt-atual-20261023`, derivada do Flui 2.3 em `715ba52`. A main conferida no GitHub estava em `94c862e`: a proposta inclui também as melhorias locais acumuladas de mapa/Orb, catálogo, perfil, configurações, acessibilidade, ficha de estação, planejador, apresentação e offline. O histórico completo foi preservado, sem reescrever branches protegidas.

Trata-se de **revisão em rascunho**, com voz experimental dependente de intermediário privado no Mac. A configuração nativa atual identifica o app separado **Flui Voz 2.3**, não uma candidata de produção. Não há deploy, publicação de aplicativo, atualização de SDK ou reconhecimento independente do Mac. A integração Zephyr foi implementada após a abertura da PR; síntese real Google aprovada e reprodução no iPhone confirmada pelo usuário, com atraso percebido antes de tocar.

## Itens 36–46

Numeração corrigida pelo usuário: 43 corresponde à conexão e 44 à criação da PR.

| Pedido | Implementação atual | Evidência e limite |
| --- | --- | --- |
| 36 — retirar alternância manual de status | Feito | Ciclo/flag removidos; Orb reflete estados reais. |
| 37 — gravar/parar pela Orb | Feito | Botões antigos fora da tela atual. Toque inicia/conclui; pressão longa cancela. Cancelamento físico completo ainda pendente. |
| 38 — ouvir ao abrir pela Home | Feito | Uma escuta, com conexão previamente ativada, permissão e primeiro plano. Fluxo principal conferido no iPhone; não é escuta contínua. |
| 39 — concluir pelo silêncio | Feito, ajustado para cerca de 2 s | Usuário pediu prazo maior que 1 s e confirmou frase completa/resposta única no iPhone. |
| 40 — transcrição ao vivo e resposta automática | Feito | Parciais na tela, sem preencher o campo digitado; resultado final segue para o motor determinístico e leitura. Fluxo principal conferido; rascunho durante cancelamento ainda não homologado fisicamente. |
| 41 — conexão nas Configurações | Feito | Sem botão/campos técnicos e sem os avisos de apoio antigos no rodapé da FluIA. Consentimento sobre envio de áudio permanece nas Configurações. |
| 42 — voz Zephyr | Feito; reprodução conferida no iPhone | Backend privado ativo com teto autorizado de 10 sínteses/10.000 caracteres, cumulativo em ledger separado. Google real aprovado; usuário confirmou “demorou mas funcionou”. Há atraso antes da fala; latência física não foi medida. Voz do iPhone preservada quando Zephyr não estiver habilitada ou não houver sessão ativa. |
| 43 — conectar sem burocracia | Parcial | Pareamento sem colar código confirmado no iPhone/Mac. Ainda depende do Mac e de permissão local; execução autônoma no iPhone foi adiada. |
| 44 — abrir PR | Feito | [PR #103](https://github.com/isalvesb/flui-charge-map-next/pull/103) aberta em rascunho para revisão; sem merge automático nem outras publicações. |
| 45 — animação da Orb na Home | Esclarecido | Usuário confirmou Reduzir movimento ativado; nenhuma alteração de código. |
| 46 — respostas com IA | Análise | Motor permanece determinístico. Serviço, custos e política de dados precisam de proposta separada. |

## Verificações desta preparação

- `npm run check`: TypeScript e lint sem erros; **271/271 testes do app** aprovados. Um aviso preexistente de dependência de ref em `ConnectivityContext.tsx:48` permanece.
- Intermediário: **40/40 testes locais** aprovados na última rodada, incluindo limites, cancelamento, silêncio, PCM tardio e pareamento com autorização simulada. Não são testes de precisão Google ou homologação física completa.
- Exportação web aprovada com **15 rotas**, sem publicar a exportação. Não equivale a uma nova revisão visual no navegador ou a validação nativa.
- Versões de blobs novas no histórico revisadas para padrões de credenciais/arquivos protegidos, sem achados pelos padrões utilizados. `.validation`, ADC, chaves TLS e arquivos nativos gerados não entram na proposta.
- Usuário confirmou no iPhone a frase com pausa no meio, conclusão automática e uma única resposta falada; retenção após bloquear/desbloquear; remoção de Parar leitura; conexão sem colar código.
- Item 42, rodada posterior: **285/285 testes do app**, TypeScript/lint sem erros (um aviso preexistente), **48/48 testes do intermediário**, bundle iOS JavaScript aprovado. Síntese Google real com Zephyr pt-BR/MP3 aprovada em aproximadamente 2,2 s no Mac; reprodução no iPhone confirmada separadamente pelo usuário, com atraso percebido. Nenhuma build nativa reinstalada.

## Limitações para a revisão

- Não certifica Android, Release, VoiceOver humano, desempenho, operação sem Mac ou estabilidade prolongada. Cancelamento físico, rascunho e segundo plano durante captura continuam pendentes.
- Configuração experimental/bundle, patch nativo restrito ao expo-audio 1.1.1 e ferramentas temporárias precisam de decisão antes de uma integração para distribuição. Não substituir outros apps nem reaproveitar credenciais locais.
- OAuth Google e TLS ficam exclusivamente no Mac. Entrada usa Google STT V2; saída pode usar Zephyr Google TTS ou a voz do iPhone conforme capacidade da sessão. O texto continua vindo do motor determinístico; nenhum modelo generativo de respostas foi conectado. A síntese Zephyr não torna o motor conversacional generativo.
- Orçamento conservador por escuta, uma chamada por vez, máximo 30 s e sem repetição automática. Extensões de teste são expressamente autorizadas e não renovam o ledger em reinícios.
- Sem incorporar as PRs 99/100 nesta preparação, sem alterar issues/Projects ou modificar a consolidação protegida.

Registro detalhado de continuidade e evidências: `docs/fluia-google-stt/PROGRESSO.md` e `CONTINUIDADE-36-42.md`. Os checkpoints antigos descrevem etapas históricas; os estados atuais acima prevalecem para esta revisão.
