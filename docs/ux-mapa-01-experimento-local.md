# UX-MAPA-01 — experiência local

Base: `abd5dfacaf51350b32fa77066ee849dbfcc9fbdc`.
Branch: `local/ux-mapa-01-reacticx-20261022`.
Cópia: `flui-ux-mapa-01`, independente da consolidação.

## Implementação

- Busca mantém o filtro completo e ganha um botão independente para atalhos.
  Atalhos começam recolhidos, preservam suas seleções e devolvem a altura ao mapa.
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

Aplicativo: **Flui Mapa 01**. Bundle ID: `com.guicunhasou.fluiuxmapa01`.
Metro: porta **8116**; o aplicativo de referência continua na **8106**.

```sh
cd /Users/guicunha/.codex/.chatgpt-projects/g-p-69f512a9480481918bb9b34c4162ae65/flui-ux-mapa-01
EXPO_NO_DOTENV=1 EXPO_OFFLINE=1 ./node_modules/.bin/expo start --go --lan --port 8116 --max-workers 2
```

O binário Debug separado contém Skia e Google Maps. Expo Go não substitui esse
binário. Alterações JS/estilos posteriores podem usar Fast Refresh na porta8116.
O comando não carrega `.env.local` no manifesto LAN; a configuração Google já
está no projeto nativo local ignorado. Não exibir nem versionar credenciais.

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
- `npm-ls.json`: sem problemas na árvore. `build-ios.log`: BUILD SUCCEEDED.
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
