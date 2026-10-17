# Alfa 1.3 — Dados demonstrativos para o NEXT

Base conferida: `main` em `19f035ccf5149b0259ce8a1431b0205935f38182`, incluindo a Alfa 1.2. Trabalho exclusivo em `alfa/dados-demonstrativos-1.3`; nenhuma alteração direta na main ou merge realizado por esta execução.

## Alterações

- Configurações → Demonstração NEXT: nome do veículo, autonomia com bateria cheia e seleção de origem. Valores salvos explicitamente, com validação (nome de até 60 caracteres; autonomia positiva até 2.000 km).
- Origens fixas: FIAP (padrão preservado), Paulista e Vila Mariana. Coordenadas de exemplo locais, sem GPS ou consulta externa.
- Padrões centralizados em `src/data/demonstracao.ts`: BYD Dolphin Plus, 400 km, bateria demonstrativa em 70% e origem FIAP. Nome e autonomia são parâmetros do exemplo, não especificações verificadas do fabricante.
- Mesmo controle de bateria do mapa, com origem manual/data da edição preservadas. A configuração não sobrescreve bateria, favoritos, histórico, aparência ou filtros salvos.
- `PreferencesContext` fornece a origem e a mesma lista de estações com distância geográfica recalculada (Haversine). Mapa, filtro completo, ficha e FluIA usam esses dados. O catálogo não foi reescrito.
- Distâncias identificadas como aproximadas e em linha reta, sem cálculo de percurso. Precisão numérica mantida nos cortes de filtro/reserva; arredondamento somente na apresentação.
- Chegada apresentada pela FluIA usa o mesmo avaliador do mapa/ficha. Mantidas pontuação, elegibilidade e reserva exata de 5% anteriores. A mudança elimina a diferença entre arredondamentos de apresentação.
- Origem estável no contexto: reavaliações de horário não criam uma nova origem. O bloqueio de reposicionamento periódico da Alfa 1.2 foi mantido; centralização usa a origem selecionada.
- Sem dependências novas, backend, serviços, GPS, controles experimentais ou implementação da Beta 2.1.

Arquivos principais: `src/data/demonstracao.ts`, `src/utils/demonstracao.ts`, `src/context/PreferencesContext.tsx`, `src/storage/fluiStorage.ts`, `src/types/storage.ts`; telas de configurações, perfil, mapa, filtros, ficha e assistente; `tests/demonstracao.test.ts`. As mudanças de estilos limitam-se ao formulário e aos textos de origem/distância.

## Verificações automatizadas

- `npm run check`: TypeScript e lint aprovados, **51/51 testes**, sem falhas. São 44 cenários existentes e 7 novos; [log](validacao-1.3/check.log).
- Novos cenários: migração de preferências antigas; serialização com bateria demonstrativa/manual; validação e recuperação de dados inválidos; distância conhecida e imutabilidade do catálogo; alteração de raio e viabilidade pela origem; concordância da chegada entre consumidores; cortes sem arredondar distância/reserva.
- `EXPO_OFFLINE=1 CI=1 npx expo export --platform web --output-dir /tmp/flui-alfa-1.3-web`: sucesso, **11 rotas**; [log](validacao-1.3/exportacao-web.log).
- `git diff --check`: aprovado. Dependências, lockfile e workflows preservados. A CI da PR é informada nos Checks, separadamente destes resultados locais.

## Funcionamento observado no navegador

Exportação local servida pelo auxiliar existente `scripts/validar-horarios-web.cjs`, em `127.0.0.1:8773`, sem ativar seu relógio de teste. Interações reais com os controles, sem editar AsyncStorage ou estado React pela automação.

| Cenário | Evidência observada |
| --- | --- |
| Configuração persistida | Veículo NEXT, 300 km e Vila Mariana reapareceram após recarregar. FIAP e Paulista também foram selecionadas, salvas e conferidas após reload. [Vila](validacao-1.3/configuracao-persistida.png) · [FIAP](validacao-1.3/configuracao-fiap-manual.png) · [Paulista](validacao-1.3/configuracao-paulista.png). |
| Bateria e origem preservadas | Controle existente alterou 70% demonstrativos para 35% manuais. Após reload e novas configurações, manteve 35%, origem manual e a data real da edição. Alcance mostrado: 105 km com autonomia de 300 km; 70 km com autonomia de 200 km. |
| Mesma estação, origem diferente | Higienópolis: desde Vila Mariana, ≈4,9 km/chegada 33% (autonomia 300 km); desde FIAP, ≈2,1 km/34% (autonomia 200 km). Valores iguais no mapa e na ficha de cada configuração. [Mapa Vila](validacao-1.3/mapa-vila-mariana.png) · [mapa FIAP](validacao-1.3/mapa-fiap.png). |
| FluIA e ficha | Com Vila Mariana/300 km/35%, recomendou Flui Vila Mariana Lins: ≈0 m e chegada 35%, repetidos na ficha aberta pelo botão da assistente. A origem demonstrativa coincide com as coordenadas dessa estação do exemplo. [FluIA](validacao-1.3/fluia-vila-mariana.png). |
| Raio de busca muda com origem | Em 500 m, Vila Mariana retornou 1 ponto, com seu marcador/cartão. FIAP retornou 2 pontos: MASP ocupado e Pamplona em manutenção, ambos como marcadores; nenhum cartão de recarga utilizável e FluIA sem opção viável. [Vila](validacao-1.3/filtro-vila-mariana.png) · [FIAP](validacao-1.3/filtro-fiap.png) · [recusa](validacao-1.3/fluia-sem-opcao.png). |
| Entrada inválida | Autonomia zero foi rejeitada, sem substituir o valor anteriormente salvo. |
| Perfil e avisos | Perfil mostrou nome/autonomia/origem configurados. Permaneceram avisos de dados demonstrativos, ausência de telemetria e compatibilidade não confirmada. |

[Transcrição das interfaces](validacao-1.3/interface.txt). Uma sequência automática tentou alterar os campos/recarregar antes de aguardar o carregamento e a confirmação do salvamento; não comprovou a troca. A sequência corrigida aguardou a confirmação, recarregou e verificou os valores persistidos. Estados transitórios estão identificados na transcrição; não foi atribuído um defeito ao aplicativo por essa tentativa.

## Limitações

A validação prática desta PR foi **web**. Não foram executados testes de interface iOS/Android, build de distribuição ou dispositivo físico. Testes automatizados não substituem essa validação nativa. Nem todos os controles anteriores foram repetidos; a suíte de regressão passou e os fluxos afetados acima foram observados.

Alcance e chegada continuam estimativas lineares, sem considerar vias, relevo, trânsito, clima, consumo real ou capacidade de bateria. Tempos de carga continuam estimativas genéricas existentes. O nome do veículo não cadastra especificações ou conectores automaticamente; a ilustração permanece identificada como tal. Rotas externas existentes continuam independentes da origem demonstrativa; nenhuma navegação externa foi testada.

Revisão e aprovação da Alfa 1.3 ficam com a equipe; nenhum backlog foi marcado como aprovado.

## Complemento de evidências nativas — 16/10/2026

A limitação web descrita acima refere-se à execução original. A validação iOS posterior de `d14b85b` comprovou configuração/persistência, nova bateria manual, consistência mapa/ficha/FluIA e centralização/estabilidade. [Configuração](validacao-1.3/ios-config-d14b85b/RELATORIO.md) · [finalização dos três cenários](validacao-1.3/ios-final-d14b85b/RESUMO.md). Fontes, logs, capturas e falhas das sondas foram preservados com proveniência, sem atribuir esses resultados históricos à main atual.

A [situação atual das pendências](pendencias-alfa.md) identifica os testes desta branch e o impedimento Android da Issue #76. Nenhuma aprovação humana ou conclusão integral multiplataforma é presumida.
