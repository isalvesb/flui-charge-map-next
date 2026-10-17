# PR #79 — FluIA no iOS

17/10/2026. Validação dirigida a partir de `84ab3fc`, somente na branch `beta/responsividade-acessibilidade-2.6`. Device Hub, iPhone 18 Pro Max, iOS 27.0, Xcode 27.1 (27A9275), Expo Go 54.0.7. Tela: 440×956 pontos, capturas: 1320×2868. Escalas do sistema: `small` (encontrada no início) e `accessibility-medium`. Preferências demonstrativas preexistentes preservadas: veículo “Teste”, origem Vila Mariana, bateria manual 5%; relógio não alterado.

## Diagnóstico e correção

- **Fechamento:** o usuário relatou aparição transitória do botão flutuante sobre o modal. Não houve reprodução determinística dessa sobreposição exata na gravação local. A inspeção confirmou que o botão permanecia montado durante a saída; o vídeo também registrou a resposta sendo substituída pelos atalhos antes do fim da animação ([quadro anterior](antes-fechamento-troca-conteudo.png)). Agora o botão fica ausente até `Modal.onDismiss` no iOS e retorna já recolhido. O teclado é dispensado explicitamente; a conversa só é limpa após a saída nativa, preservando a limpeza na reabertura.
- **Leitura:** descrição, contexto, atalhos/resultados e histórico dividiam áreas roláveis/fixas concorrentes. Com fonte ampliada e teclado, descrição e contexto consumiam boa parte do espaço disponível ([antes](antes-ampliado-teclado.png)). Agora o conteúdo usa uma única rolagem; título/fechar e campo/envio ficam fixos. Avisos, contexto, atalhos e respostas permanecem completos. A rolagem automática considera chegada de conteúdo e mudança da área visível, respeitando redução de movimento.
- **Retorno ao mapa na escala original:** a captura final do chat revelou outra interseção concreta, já presente na base: centralizar ocupava `y=384…436` e FluIA `y=417,3…469,3`, sobreposição de cerca de 18,7 pontos. O limite de espaço vertical foi corrigido de 200 para 250 pontos, soma das alturas e intervalos dos controles existentes. A disposição compacta já implementada é reutilizada, sem novo layout. `tests/responsividade.test.ts` cobre o caso reproduzido e a fronteira de 249/250 pontos.
- **Arquivos de produção:** `FluiAssistantSheet.tsx`, `HomeMapScreen.tsx` e o limite em `mapLayout.ts`. Motor de respostas, recomendações, cálculos, preferências, dependências, orientação portrait e Configurações preservados. [Hashes do código conferido](codigo-validado.sha256).

## Resultados finais

**Aprovado no escopo dirigido: 3 execuções XCTest conclusivas, 0 falhas: chat em duas escalas e regressão isolada do mapa após o último ajuste.** [Log original](ios-original.log) · [Log ampliado](ios-ampliado.log). As duas execuções do chat são do commit `ae83813`; seu código em `FluiAssistantSheet.tsx` e `HomeMapScreen.tsx` permaneceu idêntico após o ajuste exclusivo do limite em `mapLayout.ts`, conferido pelos hashes; Expo Go encerrado e reaberto explicitamente após a alteração e antes de cada escala final.

| Cenário | Resultado observado |
| --- | --- |
| Abrir/fechar sem teclado | Fechamento e novo acesso funcionam. |
| Digitar e enviar com teclado virtual | Pergunta “autonomia” confirmada no campo; resposta programada recebida; teclado permanece na tela. Campo, enviar e fechar alcançáveis. Enviar/fechar com área mínima de 44 pontos. |
| Ler a última resposta | Fim da resposta dentro da área rolável e acima do campo, confirmado por coordenadas e captura. Rolagem permite ler o início e retornar ao fim com teclado ativo. |
| Fechar com teclado ativo | Retorno ao mapa sem teclado/modal; botão reaparece com largura de no máximo 52,5 pontos. |
| Reabrir | Campo vazio e conversa limpa; teclado pode ser reaberto e o modal fechado novamente. |
| Abrir com teclado da busca ativo | FluIA abre e campo, envio e fechamento continuam alcançáveis. |
| Texto ampliado | Mesma sequência aprovada em `accessibility-medium`; histórico de 364 pontos com teclado, envio com 50 pontos. Na escala original, histórico de 383 e envio de 44 pontos. |

**Regressão final do mapa:** [1 XCTest/0 falhas](ios-mapa-final.log), antes e depois de abrir/fechar FluIA. Botão em `(16,264,52,52)`, centralizar em `(372,264,52,52)`, zoom à direita; nenhuma interseção, todos alcançáveis. [Captura final](mapa-final-controles-separados.png) · [fonte](RetornoMapa.swift). Não foi necessário repetir o chat, cujos dois arquivos permanecem idênticos ao código aprovado nas duas escalas.

**Capturas:** [original: última resposta](original-fim-resposta.png) · [ampliado: teclado](ampliado-teclado.png) · [início da resposta](ampliado-inicio-resposta.png) · [fim da resposta](ampliado-fim-resposta.png) · [reabertura com teclado](ampliado-reabertura-teclado.png) · [abertura a partir da busca](ampliado-abertura-teclado-mapa.png) · [retorno antes do ajuste final dos controles](original-retorno-mapa.png).

**Transição:** vídeo local `FechamentoValidado.mp4`; quadros em 7,0 s ([mapa antes de restaurar o botão](depois-mapa-antes-retorno-botao.png)) e 9,0 s ([botão já recolhido](depois-botao-recolhido.png)). Nenhuma sobreposição do botão à FluIA observada nessa sequência final.

**Verificações de código:** TypeScript, lint e **63/63 testes** aprovados ([log](check.log)); `git diff --check` sem erros. Resultado remoto do Quality registrado nos Checks e na conversa da PR após publicação.

Escala do sistema restaurada para `small`, como encontrada, e opção “Simulate Hardware Keyboard” restaurada pelo Device Hub. Preferências do aplicativo e relógio preservados. As execuções exploratórias não são contadas como aprovadas. **Pronta para revisão técnica final no escopo dirigido; integração depende da revisão e aprovação humanas.**

## Rastreabilidade e limites

- Reutilizado o projeto XCTest local de validações anteriores; [fonte do teste dirigido](FluiValidacao.swift). Nenhuma ferramenta ou dependência instalada. Bundles `.xcresult`, anexos completos e vídeos permanecem no `output/pr79-ios-20261017/` local, fora do Git.
- Antes da correção: uma execução exploratória com teclado físico não serve como prova de teclado virtual. Após desativar temporariamente “Simulate Hardware Keyboard” no Device Hub, a execução com teclado na tela confirmou envio/fechamento/reabertura. A escala foi ampliada durante essa exploração; suas medidas não são uma comparação quantitativa controlada entre escalas. As execuções finais aplicam cada escala antes de abrir o aplicativo.
- Duas execuções intermediárias do código corrigido pararam por limitações do teste: identificador não exposto pelo ScrollView nativo e gesto que voltou além da primeira linha da resposta. O seletor e o gesto foram corrigidos no teste; não motivaram novas alterações do aplicativo. Não foram contadas como aprovadas.
- Não executados: aparelho físico, build de distribuição, outras versões do iOS, Android, landscape nativo e sessão VoiceOver. Não é certificação integral de acessibilidade. A sobreposição fugaz relatada pelo usuário exige confirmação visual humana final; sua prevenção por ciclo de vida e o retorno/reabertura são conferidos nesta rodada.
- Testes web funcionais anteriores não repetidos. Quality verifica tipos, lint, 63 testes de domínio/layout existentes e exportação web; isso não substitui a verificação nativa.

A PR permanece em rascunho, sem merge. Aprovação visual e integração cabem à equipe.
