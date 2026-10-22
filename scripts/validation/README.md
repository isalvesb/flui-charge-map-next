# Validação integrada local

Executar a partir da raiz desta cópia isolada. Nenhum roteiro publica ou atualiza dependências. A suíte principal continua em `npm run check`; estes roteiros verificam interfaces e protocolos reais, separadamente dos testes unitários.

Os navegadores usam o Playwright já disponível no ambiente de trabalho. Definir `FLUI_PLAYWRIGHT_MODULE` com o caminho do módulo instalado, sem adicionar dependências ao projeto. Definir `FLUI_EVIDENCE_DIR` com uma pasta absoluta e exclusiva para cada execução. Os roteiros web usam `FLUI_BASE_URL`, padrão `http://127.0.0.1:8131`, servindo uma exportação estática com fallback para as rotas HTML.

Sequência web:

```sh
node scripts/validation/hydration-routes.cjs
node scripts/validation/station-persistence.cjs
node scripts/validation/map-assistant-flow.cjs
node scripts/validation/planner-matrix.cjs
node scripts/validation/offline-cache.cjs
```

A matriz verifica 120 combinações de largura, fonte, tema e viagem. Os demais fluxos validam parâmetros de URL, favoritos, avaliação/histórico persistidos, busca e filtro, recuperação da FluIA, Plano B e navegação interna. O teste offline desliga a rede somente do contexto Chromium e exige que uma requisição sem cache falhe. Não comprova desconexão do Mac ou do aparelho físico.

Protocolos e desenvolvimento:

```sh
node --test scripts/validation/development-protocols.cjs
node scripts/validation/metro-http.cjs
node scripts/validation/metro-hmr.cjs
```

Os dois últimos exigem Metro exclusivo na porta 8130, com monitoramento de arquivos ativo. O roteiro HMR exige a pasta local ignorada `consolidacao-validation-local/`; altera apenas seu módulo diagnóstico. Não prova atualização visual.

Para a verificação visual, preparar somente nesta cópia a rota temporária abaixo, ignorada localmente, com o Metro de desenvolvimento ativo:

```sh
cp scripts/validation/fast-refresh-fixture.tsx.txt app/consolidacao-fast-refresh.tsx
node scripts/validation/fast-refresh-visual.cjs
```

O teste aumenta o contador para 2, muda o texto do módulo e exige atualização visual com estado preservado. É um cliente Chromium, sem comprovação de Fast Refresh nativo. Remover a rota temporária e a pasta de diagnóstico após encerrar o servidor exclusivo. Nunca exportar ou entregar a rota temporária como produto.

As evidências desta execução ficam fora do Git, em `/Users/guicunha/.codex/.chatgpt-projects/g-p-69f512a9480481918bb9b34c4162ae65/output/consolidacao-next-20261022`. Os testes XCTest e seus resultados estão na subpasta `ios/`; não equivalem a validação no aparelho físico.
