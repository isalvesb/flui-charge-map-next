# UX-MAPA-01 — Flui 2.1 experimental

Base: `abd5dfacaf51350b32fa77066ee849dbfcc9fbdc`.
Branch exclusiva: `local/ux-mapa-01-reacticx-20261022`.
Diretório: `/Users/guicunha/.codex/.chatgpt-projects/g-p-69f512a9480481918bb9b34c4162ae65/flui-ux-mapa-01`.

## Estado entregue

Experiência local instalada separadamente como **Flui 2.1**, versão2.1.0,
bundleID `com.guicunhasou.fluiuxmapa01`. Candidata consolidada, sua instalação
Flui NEXT Revisão, antigo flui-charge-map e servidor8106 preservados.
Apta à avaliação humana experimental; aprovação estética final permanece humana.
Nenhum push, PR, merge, publicação ou alteração do GitHub foi realizado.

## Alterações

- Filtros rápidos começam recolhidos. Botão independente mostra apenas chevron
  para baixo/cima; filtro completo e seleção dos atalhos foram preservados.
  Recolher devolve toda a altura ao mapa.
- À esquerda: viagem e sugestões. À direita: zoom vertical agrupado e
  centralização. Colunas alinhadas, alvos48pt. Contraste invertido conforme tema:
  roxo escuro/ícones claros no claro; lavanda/ícones escuros no escuro.
- Sugestões reutilizam catálogo/cartões existentes em popup com fundo escurecido,
  X fixo e fechamento ao tocar fora. Tocar dentro não fecha; ficha e retorno
  funcionam. O antigo comportamento de recolher o painel foi substituído por
  esse acesso, a pedido do usuário.
- Centralização deixou de compensar o antigo painel; usa diretamente latitude e
  longitude da origem demonstrativa e atualiza a referência utilizada pelo zoom.
  Continua sendo origem demonstrativa, preservando o comportamento de localização.
- Mapa desenha até a parte inferior. Insets reais do iOS foram mantidos; Orb
  recebe afastamento inferior calculado. Removidos8pt do padding interno superior.
  A marcação vermelha dos insets, solicitada para inspeção, foi removida.
- Orb nativa de128pt, sem disco escuro ou moldura. Variante do mapa alterna
  `#2B0055`/`#C797FF`, com núcleo sempre visível. Ciclo3,6s: escuro0,2s,
  transição ao claro1,35s, claro1,1s e retorno0,95s. Transparência uniforme
  de20%–40% em todo o corpo, com antialiasing discreto na borda.
  Raio com estrelinhas reutiliza FluiAiIcon, em primeiro plano, sem nome.
- Expansão parte da posição medida da Orb; conversa aparece progressivamente em
  tela cheia. Mapa permanece montado. Histórico/motor/ações conversacionais
  existentes foram reaproveitados; fechamento mantém a reinicialização anterior
  da conversa. Movimento reduzido elimina a transição e congela o shader.
  Animação pausa em segundo plano, tela inativa ou popup aberto.
- No final dos Ajustes: Flui2.1.0 e identificação de revisão local. Versão vem
  do package.json, alinhada ao binário; evita metadados estáticos desatualizados.

## Arquivos e Reacticx

Principais: HomeMapScreen.tsx/.styles.ts, mapExperimentLayout.ts,
FluiAssistantSheet.tsx, OrbAssistantModal.tsx, MapEnergyOrb* e reacticx/*;
SettingsScreen.tsx; app.config.js; package.json/lock; testes e scripts de validação.
Lista completa na evidência `arquivos-modificados.json`.

Renderer originário de `flui-local-isolado`, checkpointf23c69c,
upstreamReacticx `4e11fcfe04e0bd7054574acc1557320911d70e4c`, MIT.
Licença integral e adaptações em `src/features/assistant/reacticx/`.
Somente Skia2.2.12 e nós ausentes foram adicionados. Entradas de dependências
existentes da consolidação/P1 foram preservadas; não se importou a branch inteira.
Shader da variante do mapa foi adaptado para paleta, transparência e ritmo
solicitados; estados conversacionais continuam usando a apresentação existente.
Web/SSR usa SVG, sem CanvasKit/CDN: não comprova visual ou desempenho do shader.

## Validação

Evidências absolutas:
`/Users/guicunha/.codex/.chatgpt-projects/g-p-69f512a9480481918bb9b34c4162ae65/output/ux-mapa-01-20261022`.

- TypeScript aprovado; ESLint zero erros, aviso herdado ConnectivityContext:48.
- Suíte completa150/150;7 testes direcionados aprovados após ajustes da Orb.
- npm ls sem problemas. Verificação Expo local/offline aprovou versões;
  modo offline não comprova metadados remotos mais recentes.
- Exportação estática14rotas.
- Matriz web30/30:320,375,393,481,768px; fontes padrão/ampliada;
  claro,escuro,alto contraste. Geometria, filtros e Orb128pt conferidos.
- Uma imagem teve ERR_CONNECTION_RESET no servidor temporário. Recurso respondeu
  200 na conferência; os12casos pendentes passaram na retomada. Falha original
  preservada em layout-web-primeira-execucao-final.json; não atribuída ao app.
- Fluxos web: sugestões/ficha/retorno, planejador, filtros completos, zoom e
  centralização acionáveis na prévia, conversa, Plano B e retorno ao mapa.
- Popup5cenários: limites da tela, alvoX44pt, toque interno, fechamento externo
  e ficha/retorno. ModalFluIA4cenários: fontes/temas/movimento reduzido.
- Contraste dos ícones dos controles:11,95:1 a17,65:1 nas quatro combinações.
  Não constitui certificação de acessibilidade.
- Debug iOS compilado/instalado no iPhone16. runtime-ios.json confirmou Hermes,
  SkiaApi e appID próprio na porta8116. Capturas físicas reais disponíveis.
- Humano confirmou abertura/fechamento da FluIA, mapa preservado, teclado/envio/
  resposta e identificação em Ajustes. Depois confirmou popup, chevron e
  centralização. Orb recebeu os refinamentos estéticos posteriores solicitados.

## Inicialização nativa e limitações

Foi necessária nova compilação porque a referência não continha Skia. Motivo
explicado previamente. `ios/` ignorado foi copiado do preparo nativo validado
flui-consolidado-iphone16-build, sem alterar a origem; preserva GoogleMaps8.4.0,
Utils5.0.0 e UIScene do iOS27. Identidade, nome e Metro são exclusivos.

Nas primeiras aberturas, RCTBundleURLProvider retornou URL nula. Endpoint Debug
LAN explícito mostrou falha real de transporte. Diagnóstico em primeiro plano
registrou URLSession-1009; depois de acrescentar conexão TCP por NWConnection,
o próximo lançamento teve TCPready, status200 e carregamento normal. A causa
subjacente da recusa inicial não foi isolada. Nenhuma política ATS, firewall ou
configuração do iPhone foi alterada automaticamente. A abordagem segue a
[nota técnica Apple TN3179](https://developer.apple.com/documentation/technotes/tn3179-understanding-local-network-privacy).

Diagnóstico temporário permanece apenas no Debug local; não deve ser incorporado
automaticamente a Release ou à candidata. Fontes nativas de reprodução sem chave
estão em nativo-reproducao/. Credencial permanece local/ignorada, sem valor nos
commits ou neste relatório.

Houve erro transitório de importação duplicada X durante Fast Refresh; corrigido,
com TypeScript/lint/suíte aprovados depois. CoreDevice não suporta gravação de
vídeo neste aparelho; a tentativa foi interrompida, usando capturas e retorno humano.
Avisos nativos herdados de textura de marcadores/eventos foram observados,
sem bloqueio comprovado nos fluxos conferidos.

Sem certificação de FPS, VoiceOver, Android, Release ou acessibilidade humana.
Temas/fontes/redução de movimento têm testes web/automatizados; não equivalem a
uma auditoria física completa. Controles flutuantes podem encobrir parcialmente
um marcador durante gestos; fichas também permanecem acessíveis pelo popup.

## Executar e retomar

Abrir **Flui2.1** no iPhone, na mesma LAN do Mac, com Mac acordado e Metro8116
ativo. Cabo USB não é necessário para servir JavaScript. Alterações JS/estilos
usam Fast Refresh; futuras mudanças nativas podem exigir nova compilação isolada.

```sh
cd /Users/guicunha/.codex/.chatgpt-projects/g-p-69f512a9480481918bb9b34c4162ae65/flui-ux-mapa-01
EXPO_NO_DOTENV=1 EXPO_OFFLINE=1 ./node_modules/.bin/expo start --go --lan --port 8116 --max-workers 2
```

App Debug usa192.168.0.130:8116. Se IP/rede mudar, revisar essa configuração
local antes de recompilar. Expo Go não substitui este binário. Não reiniciar8106.
Encerrar somente o Metro experimental identificado pela porta8116, quando desejado.
Push continua bloqueado por remote disabled:// e hook local pre-push.
