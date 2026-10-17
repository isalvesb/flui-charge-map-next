# Beta 2.6 — Responsividade e acessibilidade básica

16/10/2026. Escopo da LDT e Issues #34, #35, #36 e #39. Branch `beta/responsividade-acessibilidade-2.6`, criada da main `93c453c8b01638a40b98560651382804b44eccc0`. A PR #77 já estava integrada; [Quality dessa main aprovada](https://github.com/isalvesb/flui-charge-map-next/actions/runs/38993533974). As falhas técnicas anteriores da main foram resolvidas pela #77, sem duplicar suas correções.

## Problemas e ajustes

| Problema observado | Ajuste pontual |
| --- | --- |
| Em 320 px, ilustração do veículo e informações de bateria sobrepunham o logo. | Oculta somente a ilustração no cabeçalho compacto; valor e rótulo acessível completos continuam disponíveis. Metadados recebem fontes mínimas de estilo maiores. |
| Em 844×390 e 1920×480, painel de pontos ultrapassava a área do mapa, ficando atrás do cabeçalho e escondendo a ação de minimizar. | Limita altura à área efetivamente disponível e permite rolar o painel completo. Em horizontal largo, usa painel lateral de até 400 px. Mantém os componentes existentes. |
| Painel alto/texto ampliado podia sobrepor zoom e FluIA; símbolos de zoom cresciam além dos botões. | Considera a altura real do painel e a escala de texto para dispor controles em linha. Nesse modo, separa o acesso FluIA. Apenas os símbolos decorativos +/− do zoom deixam de escalar; seus rótulos acessíveis permanecem completos. |
| Puxador de filtros tinha 16 px de altura; busca/filtros 42×42 e fechar bateria 40×40. | Áreas visuais/acionáveis passam a pelo menos 44 pontos. Nomes de estações e badges podem crescer/quebrar linha. |
| Seletor de bateria era uma sobreposição sem isolamento de foco/fechamento por Escape na web; em pouca altura não havia rolagem. | Usa o `Modal` existente do React Native, com ação de fechar e conteúdo rolável, até 90% da altura e 560 px de largura. FluIA também limita largura de leitura e amplia a área de fechar. |
| `accessibilityState` não chegava ao DOM na versão instalada de React Native Web. Conteúdo oculto ainda tinha cartões com Tab e leitura acessível. | O `PressableScale` existente transmite estados ARIA na web; seleção usa `aria-pressed`. Painéis ocultos recebem `aria-hidden`, e seus controles saem da sequência de Tab. Sem novo sistema de componentes. |
| Textos secundários e indicadores claros tinham contraste abaixo de 4,5:1. | Ajusta tokens existentes e cria tons de texto para aviso/erro, preservando as cores decorativas amarelas. Mantém as regras e significados dos estados. |

Antes: [320×568](validacao-2.6/antes-compacta.png) · [844×390](validacao-2.6/antes-horizontal.png). São capturas da exportação da base, cujo código é idêntico ao da main `93c453c`; não são evidência da correção.

## Arquivos de produção e testes

- `src/features/map/HomeMapScreen.tsx` e `.styles.ts`: cabeçalho, disposição de controles, limites/rolagem de painéis, modal de bateria e foco de conteúdo oculto.
- `src/features/map/mapLayout.ts`: cálculo pequeno de limites do painel, considerando área do mapa e altura ocupada; sem alteração da arquitetura.
- `src/components/PressableScale/index.tsx`: compatibilidade dos estados acessíveis com a web, mantendo propriedades nativas.
- `src/features/assistant/FluiAssistantSheet.tsx`: limite de largura/altura e botão de fechar com 44 pontos.
- `src/theme/appTheme.ts` e `src/hooks/useTelaComPreferencias.ts`: contraste e disponibilização de tons de texto dos indicadores.
- `tests/responsividade.test.ts`: três casos sobre limites de layout e contraste de textos/indicadores nos dois temas.

Nenhuma dependência, lockfile, workflow, regra de negócio, cálculo de autonomia, catálogo ou orientação global foi alterado. `app.config.js` continua `portrait`. Não há Android Auto, CarPlay, Flui Auto Experience ou novas opções de acessibilidade ampliada.

## Validação web final

Chromium headless já disponível no runtime local; Expo web atual, sem instalação de ferramentas. Em todas as resoluções: fonte maior do aplicativo, mapa e controles sem overflow horizontal, oito controles principais dentro da tela e com dimensões mínimas de 44, rolagem até o último cartão, exclusão do painel oculto do Tab, bateria com foco contido/Escape, cinco opções FluIA alcançáveis e filtros/perfil/ficha sem overflow horizontal. A conferência de outras telas é de layout, não uma nova auditoria funcional integral.

| Resolução CSS | Proporção/tema | Evidência final |
| --- | --- | --- |
| 320×568 | Vertical compacta, claro | [Mapa](validacao-2.6/depois-compacta.png) · [lista rolada](validacao-2.6/depois-lista-compacta.png) · [bateria](validacao-2.6/depois-bateria-compacta.png) |
| 844×390 | Horizontal, claro | [Mapa](validacao-2.6/depois-horizontal.png) · [bateria](validacao-2.6/depois-bateria-horizontal.png) · [FluIA](validacao-2.6/depois-assistente-horizontal.png) |
| 768×1024 | Tablet vertical, escuro | [Mapa](validacao-2.6/depois-tablet.png) |
| 1920×480 | Panorâmica, claro | [Mapa](validacao-2.6/depois-panoramica.png) |

[Resultados e sequência de foco](validacao-2.6/web-resultados.json) · [log](validacao-2.6/web.log) · [fonte exata da sonda](validacao-2.6/WebDirigido.cjs). Com `prefers-reduced-motion: reduce`, o hover do botão manteve transformação de escala 1, sem ampliação; as ramificações existentes de redução de movimento foram preservadas. Não é prova de todas as animações ou de todos os leitores de tela.

[Antes/depois de ARIA](validacao-2.6/aria-antes-depois.json): seleção antes sem estado exposto, depois `aria-pressed=true`; cartão de painel oculto antes com `tabIndex=0`/sem ancestral oculto, depois `-1`/`aria-hidden=true`. A sonda inicial teve erro de import do auxiliar de asserções; corrigido usando o pacote já instalado. A primeira checagem de seleção revelou a ausência real de ARIA. Uma coleta auxiliar feita antes da hidratação da página foi descartada e refeita após o carregamento; não foi atribuída uma falha de aplicação a essa coleta transitória.

## Contraste

Razões calculadas pela luminância relativa sRGB, para texto pequeno contra `#F3F8F4`. [Dados antes/depois](validacao-2.6/contraste-antes-depois.json). Os testes também exigem 4,5:1 nas superfícies dos dois temas e nos fundos dos indicadores.

| Texto | Antes | Depois |
| --- | --- | --- |
| Secundário | 4,49:1 | 5,05:1 |
| Bateria confortável | 2,80:1 | 4,98:1 |
| Bateria intermediária | 1,65:1 | 6,07:1 |
| Bateria baixa | 1,61:1 | 5,88:1 |

## Validação iOS do código atual

Xcode 27.1, iPhone 18 Pro Max / iOS 27.0, Expo Go 54.0.7, **440×956 pontos**, portrait, tema escuro. Dynamic Type do simulador configurado como `accessibility-medium`; nenhuma limitação nova de escala foi imposta aos textos de conteúdo. Preferências existentes: Flui iOS NEXT, 300 km, Paulista, bateria manual 40%/data original; não editadas por este teste.

Sonda existente reutilizada, sem nova infraestrutura: **1 teste, 0 falhas, 25,806 s; `TEST EXECUTE SUCCEEDED`, saída 0**. Verificou sete controles com pelo menos 44 pontos/acionáveis; ausência de interseção entre os frames de zoom e FluIA; ocultação/restauração do painel e remoção dos cartões da árvore acessível; abertura/fechamento do modal de bateria e acesso à ação final; acesso à última opção da FluIA e fechamento.

[Mapa com texto ampliado](validacao-2.6/ios-texto-ampliado-mapa.png) · [bateria e ação alcançável](validacao-2.6/ios-bateria-acao-alcancavel.png) · [opções FluIA](validacao-2.6/ios-fluia-opcoes-alcancaveis.png) · [log completo](validacao-2.6/ios.log) · [sonda](validacao-2.6/IosDirigido.swift) · [timestamps](validacao-2.6/ios-capturas-manifest.json).

Duas execuções preliminares da sonda passaram, mas as capturas mostraram bundle anterior em cache e sobreposição. **Foram descartadas como prova da versão final.** A abordagem foi reavaliada: Expo Go encerrado/reaberto explicitamente, novo bundle confirmado visualmente, sonda reforçada com asserções de interseção e só então a execução acima foi realizada. A abertura inicial por `simctl openurl` teve timeout embora o projeto carregasse; não foi usada como prova de prontidão. Bundles completos, inclusive preliminares, preservados localmente em `output/beta-2.6-20261016/`, fora do Git.

Tamanho de texto restaurado para `large`, valor original. Relógio não modificado. Metro/servidor encerrados e simulador desligado depois de salvar as evidências.

## Verificações finais e limites

- TypeScript e lint aprovados; **60/60 testes**, incluindo os três novos: [log](validacao-2.6/check.log).
- Exportação web final aprovada, **11 rotas**: [log](validacao-2.6/exportacao-web.log).
- `git diff --check` aprovado; [hashes dos arquivos validados](validacao-2.6/codigo-validado.sha256). Resultado de CI da PR deve ser consultado separadamente nos Checks.
- Android não executado: SDK, emulador, AVD e Android Studio ausentes; nenhuma ferramenta pesada instalada. Isso não impediu o desenvolvimento autorizado.
- Horizontal/panorâmica conferidos na **web**. iOS permaneceu portrait; não se afirma funcionamento nativo em landscape. Dispositivo físico, build de distribuição, Safari, VoiceOver/TalkBack e validação exaustiva WCAG não executados.
- O mapa web continua sendo uma prévia esquemática, sem projeção/navegação geográfica real. Nenhuma integração automotiva foi implementada.
- Em fonte muito ampliada, os metadados do cabeçalho continuam sujeitos à elipse; o nome acessível da bateria contém valor/origem/data completos. O painel exige rolagem para ler todos os avisos/cartões. Não foram conferidas todas as escalas, resoluções ou combinações de preferências.
- Avisos de APIs antigas de estilo/props no Expo e aviso de identificação de SDK no XCTest já existiam no ambiente; não foram tratados como falhas desta entrega. Sem bloqueio técnico herdado da main atualizado identificado nesta rodada.

Entrega pronta para revisão humana na PR em rascunho. Issues não encerradas automaticamente; nenhum merge realizado.
