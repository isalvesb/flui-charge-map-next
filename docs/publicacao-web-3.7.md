# Gama 3.7 — preparação web para o NEXT de 24/10/2026

Referências: LDT v2.3 e issues [#40](https://github.com/isalvesb/flui-charge-map-next/issues/40), [#41](https://github.com/isalvesb/flui-charge-map-next/issues/41) e [#42](https://github.com/isalvesb/flui-charge-map-next/issues/42).

**Estado:** preparação técnica para revisão. Nenhum deploy autorizado ou executado; URL e QR definitivo ainda não existem. A validação do endereço publicado e dos dispositivos continua pendente. Este documento não conclui as issues.

## Decisão e limites

Manter Expo Router com `web.output: static`, sem backend, mapas externos ou novas dependências. A opção recomendada é **Cloudflare Pages Free, Direct Upload pelo painel**, publicando somente `dist/` na raiz de um domínio HTTPS. Não exige conectar o GitHub, expor o repositório ou instalar uma CLI. Requer uma conta autorizada e a escolha humana do nome/endereço. Nada foi configurado no provedor.

O serviço aceita rotas HTML sem extensão, como `/map` e `/point-details?stationId=...`. O preparo adiciona `404.html`, verifica assets e o limite de upload manual de 1.000 arquivos / 25 MiB por arquivo. Não usar GitHub Pages com subpasta: o worker e os assets existentes usam caminhos absolutos na raiz. Netlify com upload manual é uma alternativa, mas exigiria conferir suas condições de conta e limites antes de trocar de provedor.

Limitações visíveis e preservadas:

- O mapa web é **uma prévia esquemática**, com posições ilustrativas; não é cartografia nem equivalente ao mapa nativo. Marcadores abrem fichas. Zoom e centralização não oferecem navegação geográfica real nessa prévia.
- Estações, disponibilidade, imagens, notas e horários são demonstrativos; distância, autonomia e recarga são estimativas. Permanecem os avisos existentes.
- Preferências, favoritos e avaliações ficam no navegador/dispositivo. Não há sincronização; limpeza de dados ou modo privado pode descartar registros.
- Consulta offline exige uma primeira visita conectada, HTTPS e suporte/permissão do navegador para service worker/cache. Abertura externa de rotas exige conexão e comportamento compatível de Google Maps/Waze no dispositivo.
- Não se deve anunciar compatibilidade visual ou desempenho em Safari iOS/Chrome Android antes de testar a versão publicada nesses ambientes.

## Preparar e conferir localmente

No commit que receber aprovação humana, com Node 22 ou superior:

```bash
npm ci
npm run check
npm run build:web
npm run preview:web
```

Abrir `http://127.0.0.1:8790`; encerrar com Ctrl+C. O servidor aceita apenas conexões locais e reproduz rotas HTML sem extensão. Não é um servidor de produção. Parar esse servidor **não equivale** a colocar o navegador offline.

`dist/build-info.json` identifica commit, existência de alterações locais, bundle e data da exportação. Para a publicação final, exigir `dirty: false` e o SHA aprovado. O build não lê credenciais de hospedagem e não faz upload. A pasta `dist/` não deve ser commitada.

## Publicação — somente depois da autorização

1. Revisar coletivamente o commit, os textos e o conteúdo que poderá se tornar público. Todo HTML/JS/asset entregue ao navegador é inspecionável; `noindex` e `robots.txt` não protegem diferenciais reservados. Não publicar antes da liberação da equipe.
2. Confirmar uma conta **Free** da equipe no Cloudflare e a ausência de produtos pagos, Functions, integrações automáticas ou domínio comprado. Não aceitar contratação/upgrade.
3. No painel, seguir **Workers & Pages → Create application → Pages → Direct Upload / Drag and drop**. Escolher o nome aprovado. O nome pode depender da disponibilidade; não presumir uma URL.
4. Enviar somente os arquivos de `dist/`, incluindo `_headers`, `404.html`, `offline-worker.js`, assets e `build-info.json`. Não enviar o repositório, `.env`, documentação interna ou `node_modules`. Confirmar o deploy apenas com a autorização de publicação já recebida.
5. Registrar o endereço HTTPS **real** retornado pelo provedor e conferir `/build-info.json`: SHA aprovado, `dirty: false` e bundle correspondente. Se não corresponder, interromper a divulgação.
6. Validar a URL sem sessão da equipe: entrada pelo endereço raiz, onboarding, mapa esquemático, marcadores/fichas, busca/filtros, FluIA, perfil/configurações e retorno pelo navegador. Reabrir `/map`, `/loading` e uma ficha diretamente, incluindo parâmetros. Conferir endereço inexistente com HTTP 404.
7. Conferir no navegador que o worker está ativo, que o cache da versão inclui `/loading` e que não há erros impeditivos. Testar offline real com as ferramentas do navegador, distinguindo esse teste de indisponibilidade do servidor. Não prometer offline antes dessa comprovação.

## QR Code — depois de validar o endereço

Usar a URL raiz HTTPS estável aprovada, sem encurtador, serviço de QR dinâmico ou credenciais. Nunca codificar localhost, IP do Mac, URL de preview descartável ou endereço inventado.

No Mac, uma opção local é o app **Atalhos**: montar a sequência **Texto** (URL real validada) → **Gerar Código QR** → **Salvar Arquivo**. Conferir a imagem gerada e exportar como PNG para o material de apresentação. Não foi criado nem executado esse atalho nesta preparação.

Ler o QR com a câmera de um iPhone e de um Android, com Wi-Fi desligado quando houver dados móveis disponíveis. Confirmar o endereço aberto e o funcionamento sem Expo Go, conta GitHub ou conexão com o Mac. Fazer também um teste do material impresso no tamanho previsto. Registrar URL, SHA, data, navegador/dispositivo e resultado; disponibilizar a URL por escrito como alternativa ao QR.

## Compatibilidade a registrar antes da divulgação

| Ambiente | Conferência necessária | Estado nesta preparação |
| --- | --- | --- |
| Exportação de produção / HTTP local | Rotas diretas, assets, HTML, worker e 404 | Ver evidências abaixo |
| Safari no iPhone | QR, navegação, toque, armazenamento e retorno de rota externa | Pendente |
| Chrome no Android | QR, navegação, toque, armazenamento e retorno de rota externa | Pendente |
| Desktop em navegador atual | Teclado, redimensionamento, navegação e erros de console | Pendente |
| URL pública HTTPS | Cache/worker, versão e acesso fora da rede local | Bloqueado até autorização e publicação |

## Fontes consultadas em 21/10/2026

- [Expo: publicação web](https://docs.expo.dev/deploy/web/) e [exportação estática](https://docs.expo.dev/router/web/static-rendering/).
- [Cloudflare: Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [rotas HTML e 404](https://developers.cloudflare.com/pages/configuration/serving-pages/), [headers](https://developers.cloudflare.com/pages/configuration/headers/) e [limites](https://developers.cloudflare.com/pages/platform/limits/).
- [Cloudflare: preços](https://developers.cloudflare.com/pages/functions/pricing/): requisições a assets estáticos são gratuitas e ilimitadas; Functions têm regras próprias e não fazem parte desta proposta.

## Evidências da preparação

Base conferida em 21/10/2026: `main` em `94c862eacf86cd44d3de0535e08d1d35d2666b42`. Branch exclusiva `gama/preparacao-web-qr-3.7`; nenhuma alteração de dependência ou arquivo nativo.

| Verificação local | Resultado |
| --- | --- |
| `npm run check` | TypeScript aprovado; lint sem erros; 126 testes aprovados, zero falhas |
| Lint herdado | Um aviso `react-hooks/exhaustive-deps` em `src/context/ConnectivityContext.tsx:48`, arquivo idêntico à base; não alterado nesta tarefa |
| `npm run build:web` | Expo exportou 12 rotas; preparo conferiu documentos, assets e limite de upload; 62 arquivos |
| HTTP da exportação | 200 para `/`, `/map`, `/search`, `/point-details?stationId=vm`, `/profile`, `/settings`, `/review`, `/trip-planner`, `/onboarding`, `/loading`, worker e `build-info.json`; bundle também retornou 200 |
| Documento e avisos | HTML em `pt-BR`, título da demonstração, aviso esquemático em `/map` e avisos demonstrativos na ficha presentes no HTML exportado |
| Caminho inexistente | HTTP 404 com página exportada; não retorna a entrada como se fosse uma rota válida |
| Três testes novos de HTTP | Rotas/parâmetros/404, tipo/cache do worker e HEAD, recusa de escrita/URL inválida/leitura fora da exportação |

As dependências locais foram reutilizadas de uma instalação com `package-lock.json` de SHA-256 idêntico; não houve instalação ou atualização. O Quality remoto fará a instalação limpa via `npm ci` e verificará a mesma preparação web.

**Limitação:** não havia controle de navegador disponível nesta sessão; não foram obtidas capturas nem executadas interações visuais. HTTP 200 não comprova hidratação React, layout, acessibilidade prática, interação com marcadores, filtros, FluIA, persistência ou offline real. Não foram repetidas validações nativas. A revisão visual e os testes em Safari iOS/Chrome Android são condições antes de divulgar o QR; validação pública depende de autorização de deploy e de conta/URL reais.

**Parecer:** base técnica preparada para revisão, sem comprovação suficiente para liberar publicação ao público. Sem URL validada, não foi gerado QR definitivo.
