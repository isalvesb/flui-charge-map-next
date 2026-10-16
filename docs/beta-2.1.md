# Beta 2.1 — identificação dos dados e controles internos

Base: `7359237`, main após integração da PR #2 (Alfa 1.3) e do motor local de respostas da PR #3. Branch: `beta/dados-simulados-2.1`. Sem merge ou alteração direta da main.

## Classificação e mudanças

- Não foi encontrada integração de dados reais verificados de estações ou telemetria. Catálogo, horários, disponibilidade, notas, comentários, imagens e perfil são demonstrativos. Distância, alcance, chegada e tempos de carga são estimativas; relógio e datas de ações locais não são atualização de telemetria.
- `src/data/identificacaoDados.ts` centraliza classificação e avisos do conjunto atual. A bateria mantém `demo/manual/unknown` e as regras existentes. Preferências, parâmetros demonstrativos e AsyncStorage da Alfa 1.3 foram reutilizados, sem migração ou duplicação.
- Mapa, ficha, perfil, formulário de avaliação e onboarding explicitam os dados de exemplo. Notas/totais/distribuição não são recalculados com avaliações locais; essa limitação aparece na ficha. Cada comentário distingue exemplo de avaliação manual local. “Enviar” foi substituído por “Salvar”; não há publicação para terceiros.
- O formulário de avaliação usava distância fixa e classificava “available” como “Aberto agora”, ignorando horários. Agora usa `demoStations`, `useCurrentTime` e a apresentação compartilhada de horários/carregadores.
- `src/config/funcionalidadesExperimentais.ts` controla a FluIA inteira, habilitada por padrão (`fluia: true`). Para desabilitar, alterar esse valor e gerar novamente o app. Oculta botão/modal/animação e bloqueia recomendações e respostas locais. Não existe controle por tela, URL, armazenamento ou servidor; não é mecanismo de segurança.
- O motor local de chat já integrado pela equipe permanece sem nova interface. Respostas distinguem exemplos de disponibilidade real; a explicação de autonomia corresponde ao cálculo existente. Não foram adicionadas intenções, IA generativa ou funcionalidades futuras.

## Verificações executadas

- `npm run check`: TypeScript e lint aprovados; **57/57 testes**, incluindo 3 novos testes para padrão habilitado, bloqueio dos dois motores e ausência de falsa certeza quando não há opção viável.
- Exportação web: **11 rotas**, tanto com FluIA ligada quanto desligada. A alteração temporária para a segunda exportação foi restaurada para `true` antes da entrega.
- `git diff --check`: aprovado.

| Interação web efetivamente observada | Resultado / evidência |
| --- | --- |
| FluIA ligada por padrão | Abriu e sugeriu Higienópolis: ≈2,1 km, chegada ≈69%, com ressalvas demonstrativas. `fluia-ligada.txt` |
| FluIA desligada em exportação separada | Botão ausente; mapa, atalhos, filtro Aberto agora e navegação para ficha continuaram disponíveis. `fluia-desligada.txt`, `filtro-sem-fluia.txt`, `ficha-sem-fluia.txt`, `mapa-sem-fluia.png` |
| Avaliação manual versus catálogo | Salvei nota 4 e comentário de teste pela UI. Ao abrir a ficha em nova aba, apareceu “Sua avaliação · salva neste dispositivo”, separada de “Avaliação demonstrativa”. Perfil mostrou registro local. `avaliacao-persistida.txt`, `perfil.txt`, `avaliacoes.png` |
| Coerência de distância | Ficha e formulário de Higienópolis exibiram ≈2,1 km em linha reta desde FIAP, em vez do valor fixo de 2,4 km do catálogo. `ficha-demonstrativa.txt`, `avaliacao-formulario.txt` |
| Atualização de horários no formulário | EcoCarga Parque Aclimação passou de aberta/4 livres para “Fechado agora”/“Recarga não confirmada”, sem reload, após avanço do relógio de teste até 19:59:50 e ciclo normal de 30 s. `avaliacao-antes-fechamento.txt`, `avaliacao-depois-fechamento.txt` |

[Evidências e logs](validacao-2.1/). Relógio controlado apenas pelo auxiliar de teste já existente; não importado pelo app. O servidor local foi restabelecido após a interrupção da sessão; uma recarga falhou por conexão recusada antes disso. A validação prosseguiu em nova aba. O primeiro clique no filtro estava sobre atalhos recolhidos; expandi antes de aplicar.

## Limitações

Validação prática somente web. iOS, Android, distribuição, dispositivo físico e aplicativos de rota externos não testados nesta execução. A prévia web não comprova o mapa nativo: um clique dirigido ao marcador de Higienópolis após filtrar abriu Plug & Café; foi comprovada a navegação para ficha, não a precisão dos marcadores sobrepostos da prévia. Não houve alteração no componente do mapa.

As estimativas continuam simplificadas e os dados não foram verificados em campo. O motor de chat foi testado por funções, pois não possui tela integrada. Nenhuma dependência, backend, GPS, API externa, nova tela ou outra tarefa foi adicionada. Aprovação e integração permanecem com a equipe.
