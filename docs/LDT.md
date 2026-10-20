# Flui NEXT 2026 | Lista de Tarefas (LDT)

**Versão:** 2.3 | **Replanejamento:** 20/10/2026  
**Repositório:** `isalvesb/flui-charge-map-next`  
**GitHub Projects:** https://github.com/users/guicunhasou/projects/2

> Esta lista é o planejamento de execução. O estado comprovado de cada trabalho permanece nas Issues, PRs, comentários e testes. Não transformar prazo em status `Done`. A Gama segue sujeita à definição e aprovação de escopo antes da implementação.

## Marcos e critérios

| Marco | Data/hora (Brasília) | Objetivo |
| --- | --- | --- |
| Avaliação da banca | **Quarta-feira, 21/10/2026, às 19:00** | Beta concluída, integrada e demonstrável no ambiente escolhido |
| Evento NEXT | **Sábado, 24/10/2026, às 13:00** | Apresentação, acesso público e materiais viáveis preparados |

**Regra de priorização:** funcionalidade correta, experiência compreensível e demonstração confiável vêm antes de novos efeitos ou recursos avançados. A equipe pretende encerrar toda a Beta até a banca, mas só deve marcar uma issue como concluída após validação do objetivo próprio. Aprovação/merge continuam coletivos.

## 1. ALFA | Preparação concluída

- **1.1** [#11](https://github.com/isalvesb/flui-charge-map-next/issues/11) — colaboração e rastreabilidade. Subissues: [#12](https://github.com/isalvesb/flui-charge-map-next/issues/12), [#13](https://github.com/isalvesb/flui-charge-map-next/issues/13), [#74](https://github.com/isalvesb/flui-charge-map-next/issues/74). **Concluída.**
- **1.2** [#14](https://github.com/isalvesb/flui-charge-map-next/issues/14) — auditoria e validação. Subissues: [#15](https://github.com/isalvesb/flui-charge-map-next/issues/15), [#16](https://github.com/isalvesb/flui-charge-map-next/issues/16), [#75](https://github.com/isalvesb/flui-charge-map-next/issues/75) (validação móvel iOS e/ou Android). **Concluída.**
- **1.3** [#17](https://github.com/isalvesb/flui-charge-map-next/issues/17) — dados e configurações demonstrativas. Subissues: [#18](https://github.com/isalvesb/flui-charge-map-next/issues/18), [#19](https://github.com/isalvesb/flui-charge-map-next/issues/19), [#20](https://github.com/isalvesb/flui-charge-map-next/issues/20), [#76](https://github.com/isalvesb/flui-charge-map-next/issues/76) (validação móvel iOS e/ou Android). **Concluída.**

## 2. BETA | Entrega obrigatória para a banca

### Ordem de execução até 21/10, às 19:00

| Ordem | Tarefa e estado observado | Próximo resultado verificável |
| --- | --- | --- |
| **1 · P0** | **2.5** [#31](https://github.com/isalvesb/flui-charge-map-next/issues/31) — aberta | Revisão coletiva da [PR #90](https://github.com/isalvesb/flui-charge-map-next/pull/90), validação dirigida, merge aprovado e decisão de fechamento |
| **2 · P0** | **2.8** [#91](https://github.com/isalvesb/flui-charge-map-next/issues/91) — aberta | Correções de UX/UI prioritárias para a banca, com demonstração comparável e regressão verificada |
| **3 · P0** | **2.3** [#25](https://github.com/isalvesb/flui-charge-map-next/issues/25) — aberta | Energy Orb **leve** integrada à FluIA; sem voz avançada, 3D ou efeitos elétricos complexos |
| **4 · P0** | **2.7** [#49](https://github.com/isalvesb/flui-charge-map-next/issues/49) — aberta | Teste integrado **da versão final**, ensaio no dispositivo escolhido e evidências de apresentação |

**Paralelismo:** UX/UI (#91) e Energy Orb (#25) podem evoluir em branches independentes após conferência dos componentes compartilhados. A validação integrada (#49) deve ser repetida depois das integrações aprovadas. Se alguma alteração ameaçar estabilidade ou tempo, reduzir a implementação e registrar a limitação antes de acrescentar complexidade.

### Tarefas Beta concluídas (preservar histórico e estados)

- **2.1** [#7](https://github.com/isalvesb/flui-charge-map-next/issues/7) — identificar dados demonstrativos e controlar recursos experimentais. Subissues: [#8](https://github.com/isalvesb/flui-charge-map-next/issues/8), [#9](https://github.com/isalvesb/flui-charge-map-next/issues/9), [#10](https://github.com/isalvesb/flui-charge-map-next/issues/10). **Concluída.**
- **2.2** [#21](https://github.com/isalvesb/flui-charge-map-next/issues/21) — chat, recomendações e síntese de voz da FluIA. Subissues: [#22](https://github.com/isalvesb/flui-charge-map-next/issues/22), [#23](https://github.com/isalvesb/flui-charge-map-next/issues/23), [#24](https://github.com/isalvesb/flui-charge-map-next/issues/24). **Concluída.**
- **2.4** [#28](https://github.com/isalvesb/flui-charge-map-next/issues/28) — planejador demonstrativo de viagens e paradas. Subissues: [#29](https://github.com/isalvesb/flui-charge-map-next/issues/29), [#30](https://github.com/isalvesb/flui-charge-map-next/issues/30). **Concluída.**
- **2.6** [#34](https://github.com/isalvesb/flui-charge-map-next/issues/34) — responsividade e acessibilidade básica. Subissues: [#35](https://github.com/isalvesb/flui-charge-map-next/issues/35), [#36](https://github.com/isalvesb/flui-charge-map-next/issues/36), [#39](https://github.com/isalvesb/flui-charge-map-next/issues/39). **Concluída.**

### Escopo das tarefas Beta em aberto

- **2.5** [#31](https://github.com/isalvesb/flui-charge-map-next/issues/31) — consulta local e conectividade. [#32](https://github.com/isalvesb/flui-charge-map-next/issues/32) e [#33](https://github.com/isalvesb/flui-charge-map-next/issues/33) já estão fechadas. A [PR #90](https://github.com/isalvesb/flui-charge-map-next/pull/90), commit `a98b143`, possui Quality aprovado e dois apontamentos P2 respondidos; **não estava integrada na última conferência**. Manter #31 aberta até a decisão coletiva.
- **2.8** [#91](https://github.com/isalvesb/flui-charge-map-next/issues/91) — refinamento UX/UI de impacto imediato: manter filtros rápidos descobríveis, melhorar feedback de carregamento e alertas, clareza de rótulos demonstrativos, hierarquia de ficha/tipografia e reduzir passos e excesso de texto na FluIA. Aproveitar o fluxo de rota existente sem contornar confirmações de segurança. Não remover a identificação dos dados simulados.
- **2.3** [#25](https://github.com/isalvesb/flui-charge-map-next/issues/25) — esfera visual simples e estados da FluIA. [#26](https://github.com/isalvesb/flui-charge-map-next/issues/26): Orb leve com identidade do Flui; [#27](https://github.com/isalvesb/flui-charge-map-next/issues/27): transições/integração e validação de desempenho e redução de movimento. Efeitos elétricos ou 3D avançados ficam em Gama 3.10.
- **2.7** [#49](https://github.com/isalvesb/flui-charge-map-next/issues/49) — validação integrada e ensaio da banca. [#50](https://github.com/isalvesb/flui-charge-map-next/issues/50): mapa, filtros, ficha, FluIA, viagem e consulta local; [#51](https://github.com/isalvesb/flui-charge-map-next/issues/51): dispositivo, roteiro e limitações conhecidos. O Quality por PR não substitui a conferência final do conjunto.

## 3. GAMA | Evento NEXT e recursos posteriores

### Prioridade para 24/10, às 13:00

| Prioridade | Tarefa | Entrega desejada |
| --- | --- | --- |
| **G0 · providências antecipadas** | **3.8** [#43](https://github.com/isalvesb/flui-charge-map-next/issues/43) — MGIK | [#44](https://github.com/isalvesb/flui-charge-map-next/issues/44) identidade e [#45](https://github.com/isalvesb/flui-charge-map-next/issues/45) arquivos de produção; conferir **prazo da gráfica imediatamente** |
| **G0 · apresentação** | **3.9** [#46](https://github.com/isalvesb/flui-charge-map-next/issues/46) — comunicação NEXT | [#47](https://github.com/isalvesb/flui-charge-map-next/issues/47) vídeos/conteúdos e [#48](https://github.com/isalvesb/flui-charge-map-next/issues/48) roteiro de apresentação; priorizar o indispensável |
| **G1 · acesso público** | **3.7** [#40](https://github.com/isalvesb/flui-charge-map-next/issues/40) — publicação web/QR Code | [#41](https://github.com/isalvesb/flui-charge-map-next/issues/41) URL e QR Code e [#42](https://github.com/isalvesb/flui-charge-map-next/issues/42) compatibilidade; não prometer mapa web nativo ou totalmente interativo |

**Nota:** essas tarefas deixaram de ser exigências da Beta da banca. Se a gráfica exigir antecedência, MGIK pode precisar avançar em paralelo à Beta. O evento não autoriza concluir trabalhos sem evidências.

### Propostas avançadas, não obrigatórias na banca nem no evento

- **3.1** [#52](https://github.com/isalvesb/flui-charge-map-next/issues/52) — comandos/reconhecimento de fala e experiência por voz. [#53](https://github.com/isalvesb/flui-charge-map-next/issues/53), [#54](https://github.com/isalvesb/flui-charge-map-next/issues/54). Síntese de voz da Beta 2.2 não comprova reconhecimento.
- **3.2** [#55](https://github.com/isalvesb/flui-charge-map-next/issues/55) — integração avançada da FluIA com dados, ações e permissões. [#56](https://github.com/isalvesb/flui-charge-map-next/issues/56), [#57](https://github.com/isalvesb/flui-charge-map-next/issues/57). Requer análise de segurança e viabilidade.
- **3.3** [#58](https://github.com/isalvesb/flui-charge-map-next/issues/58) — evolução avançada do planejamento de viagens. [#59](https://github.com/isalvesb/flui-charge-map-next/issues/59), [#60](https://github.com/isalvesb/flui-charge-map-next/issues/60). Rotas reais e serviços externos dependem de investigação.
- **3.4** [#61](https://github.com/isalvesb/flui-charge-map-next/issues/61) — personagem animada em After Effects. [#62](https://github.com/isalvesb/flui-charge-map-next/issues/62), [#63](https://github.com/isalvesb/flui-charge-map-next/issues/63).
- **3.5** [#64](https://github.com/isalvesb/flui-charge-map-next/issues/64) — Flui Auto Experience, **simulação visual** de centrais multimídia. [#65](https://github.com/isalvesb/flui-charge-map-next/issues/65), [#66](https://github.com/isalvesb/flui-charge-map-next/issues/66), [#67](https://github.com/isalvesb/flui-charge-map-next/issues/67), [#68](https://github.com/isalvesb/flui-charge-map-next/issues/68). Nunca anunciar integração automotiva nativa.
- **3.6** [#69](https://github.com/isalvesb/flui-charge-map-next/issues/69) — personalização avançada de acessibilidade. [#70](https://github.com/isalvesb/flui-charge-map-next/issues/70), [#71](https://github.com/isalvesb/flui-charge-map-next/issues/71), [#72](https://github.com/isalvesb/flui-charge-map-next/issues/72), [#73](https://github.com/isalvesb/flui-charge-map-next/issues/73).
- **3.10** [#92](https://github.com/isalvesb/flui-charge-map-next/issues/92) — investigação de raios elétricos e efeitos avançados da Orb, sem bloquear a entrega mínima da Beta 2.3.

## 4. Definição de concluído e limites de demonstração

1. Respeitar objetivo e escopo da issue, com implementação na versão integrada e evidências suficientes.
2. Corrigir bloqueios relevantes, conferir Quality e executar testes específicos proporcionais à mudança.
3. Validar no ambiente da demonstração e registrar limitações sem confundir web, simulador iOS e Android físico.
4. Preservar advertências sobre dados demonstrativos, disponibilidade não verificada, estimativas e rotas.
5. Não reabrir entregas antigas apenas para acomodar refinamentos novos; tratar o refinamento na #91 ou nas propostas Gama.
6. Alterar estado de tarefa principal mediante avaliação própria, não por fechamento automático das subissues.
7. Não executar merge, edição de Project ou fechamento de PR/issue sem aprovação ou confirmação humana pertinente.

## 5. Renumeração e rastreabilidade

| Referência anterior | Referência atual | Issues preservadas |
| --- | --- | --- |
| Beta 2.7 (web/QR) | **Gama 3.7** | [#40](https://github.com/isalvesb/flui-charge-map-next/issues/40), [#41](https://github.com/isalvesb/flui-charge-map-next/issues/41), [#42](https://github.com/isalvesb/flui-charge-map-next/issues/42) |
| Beta 2.8 (MGIK) | **Gama 3.8** | [#43](https://github.com/isalvesb/flui-charge-map-next/issues/43), [#44](https://github.com/isalvesb/flui-charge-map-next/issues/44), [#45](https://github.com/isalvesb/flui-charge-map-next/issues/45) |
| Beta 2.9 (divulgação) | **Gama 3.9** | [#46](https://github.com/isalvesb/flui-charge-map-next/issues/46), [#47](https://github.com/isalvesb/flui-charge-map-next/issues/47), [#48](https://github.com/isalvesb/flui-charge-map-next/issues/48) |
| Beta 2.10 (validação final) | **Beta 2.7** | [#49](https://github.com/isalvesb/flui-charge-map-next/issues/49), [#50](https://github.com/isalvesb/flui-charge-map-next/issues/50), [#51](https://github.com/isalvesb/flui-charge-map-next/issues/51) |
| Nova demanda UX/UI da Mirna | **Beta 2.8** | [#91](https://github.com/isalvesb/flui-charge-map-next/issues/91) |
| Efeitos elétricos complexos originalmente na Beta 2.3 | **Gama 3.10** | [#92](https://github.com/isalvesb/flui-charge-map-next/issues/92) |

As antigas issues de validação por plataforma #81, #82 e #83 foram excluídas; as validações móveis consolidadas permanecem em #75, #76 e #10. As issues históricas duplicadas #37 e #38 seguem fechadas, fora da contagem canônica. Links de PRs, comentários e histórico Git não devem ser reescritos.

## 6. Histórico de versões

### v2.3 | 20/10/2026

- Replanejamento para a banca de 21/10, às 19h, e evento de 24/10, às 13h.
- Preservadas as Alfas concluídas e as Betas 2.1, 2.2, 2.4 e 2.6 concluídas.
- Beta concentrada nas quatro pendências: 2.5, 2.8 (nova UX/UI), 2.3 (Orb leve) e 2.7 (validação integrada).
- Antigas Betas 2.7, 2.8 e 2.9 movidas para Gama 3.7, 3.8 e 3.9; antiga Beta 2.10 renumerada para 2.7.
- Nova Gama 3.10 para visuais avançados da Orb. O escopo permanece sujeito à aprovação antes da implementação.
- Atualização dos títulos/descrições das issues, preservando números das issues GitHub e históricos de discussão.

### v2.2 e anteriores

Planejamento anterior preservado no histórico Git de `docs/LDT.md`. Esta versão substitui descrições de status datadas de 17/10 e referências às três issues excluídas por um panorama atual.

---

**Projeto:** Flui NEXT 2026  
**Lista de Tarefas:** v2.3  
**Tarefas principais:** 21 (3 Alfa, 8 Beta e 10 Gama). **Subtarefas canônicas:** 49; desconsideradas as duas duplicatas históricas #37/#38.
