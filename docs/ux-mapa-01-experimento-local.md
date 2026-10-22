# UX-MAPA-01 — experiência local

Base: `abd5dfacaf51350b32fa77066ee849dbfcc9fbdc`.
Branch: `local/ux-mapa-01-reacticx-20261022`.
Cópia: `flui-ux-mapa-01`, independente da consolidação.

## Implementação

- Busca mantém o filtro completo e ganha um botão independente para atalhos.
  Atalhos começam recolhidos, preservam suas seleções e devolvem a altura ao mapa.
- Controles sobre o mapa usam contraste invertido: roxo escuro/ícones claros
  no tema claro; lavanda/ícones escuros no tema escuro. A alteração solicitada
  pelo usuário chegou ao iPhone via Fast Refresh, sem reinstalação.
- Viagem e sugestões formam a coluna esquerda; zoom vertical e centralização,
  a direita, com início alinhado e alvos de 48 pontos.
- Lista existente começa oculta e abre pelo novo botão. Seu conteúdo continua
  rolável e sua altura respeita a Orb e os controles.
- Mapa passa a desenhar até o limite inferior. A área segura superior/lateral
  continua ativa; a Orb de 64 pontos recebe distância inferior pelo inset real.
- Orb nativa usa o renderer MIT da Reacticx, origem `4e11fcf`, a partir da cópia
  experimental `f23c69c`. Apenas Skia `2.2.12` e seus nós novos foram acrescentados;
  versões P1 e dependências existentes da candidata foram mantidas.
- Expansão usa a posição medida da Orb e cobre os cantos do viewport. A conversa
  aparece progressivamente em tela cheia, com área segura. O mapa fica montado.
  Fechamento conserva o comportamento anterior de reinicialização da conversa.
- Movimento reduzido elimina a transição; renderer pausa em segundo plano e
  quando o mapa perde foco. Avisos/alertas permanecem estáticos.
- Web/SSR usa a Orb SVG existente; não carrega CanvasKit. Erro nativo possui
  fallback SVG. A presença de uma Orb na web não comprova execução de Skia.

## Execução isolada

Aplicativo: **Flui 2.1**. Bundle ID: `com.guicunhasou.fluiuxmapa01`.
Metro: porta **8116**; o aplicativo de referência continua na **8106**.

```sh
cd /Users/guicunha/.codex/.chatgpt-projects/g-p-69f512a9480481918bb9b34c4162ae65/flui-ux-mapa-01
EXPO_NO_DOTENV=1 EXPO_OFFLINE=1 ./node_modules/.bin/expo start --go --lan --port 8116 --max-workers 2
```

O binário Debug separado contém Skia e Google Maps. Expo Go não substitui esse
binário. Alterações JS/estilos posteriores podem usar Fast Refresh na porta8116.
O comando não carrega `.env.local` no manifesto LAN; a configuração Google já
está no projeto nativo local ignorado. Não exibir nem versionar credenciais.

A pedido do usuário, o nome instalado é Flui 2.1 (versão 2.1.0). O final dos
Ajustes mostra versão e identificação do experimento; o número vem de
package.json, alinhado à versão nativa 2.1.0; a candidata original não foi alterada.

## Configuração nativa local

`ios/` permanece ignorado. Foi copiado da preparação nativa validada em
`flui-consolidado-iphone16-build`, sem modificar a origem. Mantém Google Maps
8.4.0, Utils5.0.0 e a adaptação UIScene de iOS27. `pod install` acrescentou Skia
(95 Pods). Alterações isoladas: Info.plist (nome e esquema), projeto Xcode
(bundle ID próprio) e AppDelegate (Metro8116/log UX-MAPA-01). Assinatura local
usa a equipe já configurada; não há distribuição/publicação.

Para reconstruir, usar `ios/fluichargemap.xcworkspace`, esquema `fluichargemap`,
Debug e destino iPhone16; definir `RCT_METRO_PORT=8116`, `SKIP_BUNDLING=1` e
DerivedData na pasta de evidências desta tarefa. Não executar prebuild sobre a
cópia de referência. Se a chave Google estiver restrita a bundle IDs, o novo
identificador precisa constar entre os permitidos antes do mapa funcionar.

## Validação e evidências

Pasta absoluta:
`/Users/guicunha/.codex/.chatgpt-projects/g-p-69f512a9480481918bb9b34c4162ae65/output/ux-mapa-01-20261022`.

- `check-final.log`: TypeScript aprovado, ESLint zero erros/aviso herdado em
  ConnectivityContext, 149/149 testes (6 novos de layout, expansão e movimento).
- `layout-web.json`: 30 combinações: 320,375,393,481,768px; fonte padrão/ampliada;
  claro,escuro,alto contraste. Alinhamento, alvos, posição da Orb, seleção dos
  filtros e recuperação de altura conferidos por geometria/DOM real.
- `fluxos-web.json`: sugestões/ficha/retorno; planejador; busca/filtro completo;
  zoom/centralização acionáveis na prévia; conversa, fechamento, recomendação
  e Plano B. Nenhuma exceção/erro/requisição falha na execução aprovada.
- `npm-ls.json`: sem problemas na árvore. `build-ios-endpoint.log`: BUILD SUCCEEDED.
- Capturas web em `capturas/`. Web é prévia e não valida mapa/zoom nativos,
  desempenho físico, teclado iOS ou VoiceOver.

As primeiras falhas do roteiro web eram de asserção (`aria-selected` em vez
 de `aria-pressed`) e de esperar Plano B após restringir o catálogo a uma única
estação. Foram diagnosticadas e corrigidas no roteiro; não motivaram alteração
no motor de filtros/conversa. Houve uma falha de rede isolada na primeira
execução; não reapareceu na execução completa aprovada.

Estado físico e relatório final devem ser consultados na pasta de evidências.
A instalação/compilação, por si só, não comprova funcionamento no iPhone.
Android, Release, auditoria humana de acessibilidade e medições de FPS não
fazem parte da comprovação disponível.

## Inicialização física e limitação de rede

As primeiras aberturas falharam antes da execução JS. A cópia nativa recebeu
um endpoint Debug LAN explícito, verificado em `/status` e no bundle. Um
diagnóstico URLSession em primeiro plano registrou -1009. Uma conexão TCP
via Network.NWConnection, conforme orientação Apple TN3179, foi acrescentada
somente ao projeto nativo local ignorado. Na abertura seguinte, TCP ficou
ready, `/status` retornou200 e o aplicativo executou no iPhone. O motivo
subjacente da primeira recusa não foi isolado; não atribuir a falha à Reacticx
ou a ATS sem prova. Não houve mudança de firewall, rede, nem política ATS.

O diagnóstico temporário permanece no Debug local, sem dados pessoais ou
credenciais na requisição. Código nativo de reprodução sem chave está em
`nativo-reproducao/` na pasta de evidências. Não importar esse diagnóstico
automaticamente para a candidata consolidada ou para Release.

`runtime-ios.json` confirma Hermes e SkiaApi no iPhone, appID exclusivo e
Metro8116. Capturas físicas comprovam mapa Google, marcadores, distribuição
e novas cores. O shader real é visualmente distinto do fallback SVG web.

Gravação de tela via CoreDevice foi tentada uma vez e informou recurso não
suportado no dispositivo; não foi produzido vídeo. Capturas e retorno humano
são as evidências físicas disponíveis.

Confirmação humana em22/10: a FluIA abre e fecha corretamente e o mapa
preserva sua posição ao voltar. `iphone-fluia-tela-cheia.png` registra a
conversa em tela cheia no iPhone16; `iphone-cores-controles.png` registra o
mapa com as cores atualizadas. Não houve medição de FPS.

Contraste dos ícones nos controles web finais: claro16,77:1, escuro11,95:1,
claro/alto contraste17,65:1, escuro/alto contraste15,33:1. As medições não
constituem certificação de acessibilidade. VoiceOver e ajustes do sistema
continuam sujeitos à revisão humana.
