# Checkpoint React #418 — 22/10/2026

Base: 77ea55ac35f838e2467cd587fcc596dc7aa6e08f. Branch exclusiva local/react-418-hidratacao-20261022, clone flui-react-418.

Estado inicial verificável: nenhuma branch, alteração ou correção anterior específica do React #418 encontrada. Evidência válida reaproveitada: output/auditoria-prontidao-next-20261022/RELATORIO.md, console-web.json e console-web-final.json. Um #418 recuperado às 15:21:47 UTC, em recarga no fluxo ficha/avaliação; causa não comprovada. UX-PLN-01 não investigou o erro geral e não foi incorporada.

Nenhuma alteração funcional neste checkpoint. Próximo passo delimitado: reproduzir ficha/avaliação na exportação existente e obter a diferença concreta entre HTML estático e primeiro render cliente. Hipóteses abertas: parâmetros da estação na URL, horários variáveis, preferências e armazenamento local. Não corrigir sem reprodução controlada. Interromper uma abordagem após duas tentativas sem progresso verificável.

Evidências e andamento: output/react-418-20261022/, fora do clone. Não repetir TypeScript, lint ou testes antes de haver mudança que justifique. Nenhuma publicação, integração ou mudança nos ambientes protegidos. Porta 8106 somente conferida por inspeção de processo, sem HTTP ou reinício.

## Diagnóstico e correção em continuidade

Causa reproduzida na exportação válida: /point-details sem ID e station-01 não geram #418; station-06 e ID inexistente geram #418. O HTML da ficha contém Higienópolis (station-01), mas o cliente recebe o parâmetro real. /review é exportada sem ID como Ponto não encontrado e diverge na abertura com station-01 ou station-06. Reproduções sem dados locais comprovam que a avaliação salva não é requisito para a falha.

Correção: RouteHydrationBoundary, restrita às duas rotas, usa os snapshots de hidratação do React para mostrar o mesmo carregamento no servidor e no primeiro render cliente. A tela com os parâmetros reais monta em seguida. Navegação cliente e execução nativa usam o snapshot pronto imediatamente. Sem suppressHydrationWarning, mudanças em telas, cálculos, dados ou dependências.

Validação: TypeScript aprovado; 141 testes aprovados (inclui teste SSR novo que impede avaliar a tela parametrizada no servidor); lint final sem erros ou novos avisos (resta ConnectivityContext.tsx:48); exportação web com 14 rotas e bundle iOS aprovados. 16 cenários web passaram, incluindo recarga, parâmetros ausentes/inválidos e dados persistidos. O fluxo real de favoritar, salvar e editar avaliação na estação 06, recarregar e abrir/cancelar startRoute=1 passou sem #418. A navegação cliente não exibiu o carregamento de hidratação.

A documentação final e os resultados suplementares de cache, preservação, processos e último commit ficam em output/react-418-20261022/RELATORIO.md e entrega-git.json. Não repetir os testes aprovados sem alteração de código ou nova evidência de falha. Para revisão futura: conferir HEAD e estado Git, ler o relatório e selecionar somente os commits autorizados. Nenhuma integração automática.

Limites: exportar iOS não comprova execução em simulador ou iPhone físico; não houve nova execução nativa. A seleção da estação nessas duas páginas estáticas exige JavaScript. Não há garantia de ausência de outras causas de hidratação em rotas fora do escopo, nem validação de cache antigo de uma eventual implantação. A UX-PLN-01 não foi incorporada: o P2 conhecido do planejador continua separado.
