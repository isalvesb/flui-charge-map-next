# Flui NEXT 2026 | Lista de Tarefas (LDT)

**Versão:** 2.1
**Repositório:** `isalvesb/flui-charge-map-next`

> Este documento organiza as tarefas do Flui NEXT 2026 em enunciados
> resumidos para enquetes do WhatsApp, acompanhados de subtarefas.
>
> As descrições são referências de planejamento, não transcrições
> integrais dos requisitos originais. Os escopos da Gama permanecem
> provisórios e sujeitos à aprovação da equipe.

---

## 1. ALFA | Preparação

### 1.1 | Organizar o repositório, o versionamento e o fluxo de branches e pull requests do Flui.

- Estruturar o repositório e estabelecer padrões para branches, commits e pull requests.
- Garantir a organização, a rastreabilidade e a preservação do histórico das implementações.
- [1.1.3](https://github.com/isalvesb/flui-charge-map-next/issues/74) | Documentar e consolidar as convenções de branches, commits e pull requests, para conferência da equipe.

### 1.2 | Auditar o aplicativo, corrigir problemas técnicos e validar as alterações realizadas.

- Identificar e corrigir inconsistências técnicas e funcionais dentro do escopo aprovado.
- Executar testes pertinentes e documentar evidências, resultados e limitações conhecidas.
- [1.2.3](https://github.com/isalvesb/flui-charge-map-next/issues/75) | Concluir a validação complementar dos fluxos auditados em iOS e Android, com evidências e limitações.

### 1.3 | Configurar veículo, bateria, autonomia e origem para os dados demonstrativos do NEXT.

- Configurar veículo, autonomia, nível de bateria e localização de origem para a demonstração.
- Permitir a seleção de origens demonstrativas e a atualização dos parâmetros disponíveis.
- Garantir coerência entre os dados configurados e as estimativas apresentadas nas diferentes interfaces.
- [1.3.4](https://github.com/isalvesb/flui-charge-map-next/issues/76) | Validar configurações e estimativas demonstrativas em iOS e Android, incluindo persistência.

---

## 2. BETA | Implementações e experiência

### 2.1 | Identificar dados demonstrativos e estimativas e controlar funcionalidades experimentais.

- Distinguir dados demonstrativos, estimativas e registros locais, evitando apresentar informações simuladas como dados verificados em tempo real.
- Centralizar os controles internos das funcionalidades experimentais, reutilizando a infraestrutura existente.
- [2.1.3](https://github.com/isalvesb/flui-charge-map-next/issues/10) | Validar as alterações da Beta 2.1 em iOS e Android e registrar as evidências.

### 2.2 | Evoluir a FluIA com chat, recomendações de recarga e possibilidades de interação por voz.

- Desenvolver a experiência de conversação em formato de chat, reutilizando o motor de respostas e as funcionalidades existentes.
- Integrar recomendações de recarga contextualizadas aos dados disponíveis no aplicativo.
- Avaliar possibilidades de interação por voz, considerando viabilidade técnica e dependências.

### 2.3 | Aprimorar a Energy Orb, os raios elétricos e as animações da experiência Flui.

- Desenvolver ou aprimorar a Energy Orb e os efeitos de raios elétricos, preservando a identidade visual do Flui.
- Integrar e validar as animações nas interfaces relevantes, considerando desempenho, fluidez e acessibilidade.

### 2.4 | Criar o planejamento de viagens com trajetos e necessidades de recarga.

- Desenvolver a experiência de planejamento de viagens, relacionando deslocamentos, autonomia e necessidades de recarga.
- Definir os dados, cálculos e critérios necessários, avaliando fontes de rotas e possíveis dependências externas antes de implementá-las.

### 2.5 | Preparar armazenamento e consultas de informações para uso com conexão instável ou ausente.

- Identificar e implementar mecanismos para armazenar e consultar informações relevantes sem conexão ou com conectividade instável.
- Definir como os dados armazenados serão atualizados e como possíveis desatualizações serão comunicadas ao usuário.

### 2.6 | Adaptar o Flui a diferentes telas e verificar responsividade e acessibilidade básica.

- Validar e ajustar a responsividade do aplicativo em diferentes resoluções e proporções, incluindo formatos verticais, horizontais e panorâmicos.
- Verificar requisitos essenciais de acessibilidade, como contraste, legibilidade, ampliação de textos, áreas de toque, navegação acessível e redução de movimento.
- Testar o comportamento dos componentes existentes, especialmente mapas e painéis, documentando limitações sem implementar integração automotiva nativa.

### 2.7 | Publicar a experiência web e preparar acesso por QR Code e diferentes dispositivos.

- Preparar a versão web e disponibilizar meios de acesso à demonstração por QR Code.
- Validar o funcionamento nos navegadores e dispositivos definidos para o NEXT, documentando restrições de compatibilidade.

### 2.8 | Produzir a identidade MGIK para camisas, bótons e materiais do NEXT.

- Consolidar a identidade visual da equipe MGIK, garantindo consistência entre as aplicações.
- Desenvolver e preparar para produção as artes de camisas, bótons e demais materiais de apresentação.

### 2.9 | Planejar redes sociais, vídeos e a experiência de apresentação do Flui no NEXT.

- Planejar e produzir conteúdos para redes sociais, vídeos e materiais de divulgação, alinhados às funcionalidades disponíveis.
- Organizar a experiência de apresentação do Flui ao público durante o NEXT.

### 2.10 | Testar os fluxos do Flui e registrar resultados, limitações e evidências de funcionamento.

- Executar testes integrados dos principais fluxos, interfaces e funcionalidades preparadas para o NEXT.
- Validar os ambientes e dispositivos definidos para demonstração, documentando resultados, limitações e evidências.

---

## 3. GAMA | Recursos avançados

> Os escopos desta seção são provisórios e dependem de definição
> e aprovação antes da implementação.

### 3.1 | Explorar uma experiência avançada de IA por voz para o Flui.

- Investigar tecnologias e possibilidades de interação por voz, incluindo comandos, reconhecimento de fala e respostas faladas.
- Avaliar a viabilidade técnica e definir os limites de integração considerando o contexto de mobilidade elétrica.

### 3.2 | Aprofundar a integração da FluIA às funcionalidades e aos dados do aplicativo.

- Investigar formas de conectar a FluIA aos dados, recursos e ações disponíveis no aplicativo.
- Avaliar possibilidades de automação, permissões e limites operacionais antes de definir a implementação.

### 3.3 | Evoluir o planejamento de viagens com recursos avançados a definir.

- Investigar funcionalidades que ampliem o planejamento inicial de trajetos e recargas.
- Definir os recursos prioritários, suas dependências e a viabilidade técnica antes da implementação.

### 3.4 | Criar uma personagem animada em After Effects para a experiência do Flui.

- Desenvolver o conceito visual da personagem e produzir suas animações utilizando After Effects.
- Avaliar aplicações na comunicação e na experiência do Flui, definindo posteriormente sua forma de integração.

### 3.5 | Criar o Flui Auto Experience, demonstração visual em centrais multimídia simuladas.

- Pesquisar marcas e modelos de veículos elétricos, identificando características visuais, dimensões e proporções de suas centrais multimídia.
- Produzir molduras ilustrativas padronizadas das centrais selecionadas, utilizando referências reais e recursos de IA generativa quando apropriado.
- Desenvolver uma página demonstrativa acessível pelas Configurações, permitindo selecionar o veículo e visualizar o Flui adaptado à respectiva moldura.
- Garantir que a experiência seja apresentada como simulação visual para demonstração e marketing, sem sugerir compatibilidade nativa com os veículos.

### 3.6 | Ampliar a acessibilidade com opções de personalização para diferentes necessidades.

- Desenvolver opções de acessibilidade visual, considerando diferentes tipos de daltonismo, baixa visão, contraste e identificação de informações sem depender exclusivamente das cores.
- Investigar adaptações de leitura para pessoas com dislexia e outras dificuldades, incluindo alternativas de tipografia, espaçamento, dimensionamento e organização dos conteúdos.
- Implementar opções de interação acessível, considerando limitações motoras, sensibilidade ao movimento e preferências de acessibilidade dos sistemas operacionais.
- Organizar as personalizações nas Configurações e validar sua eficácia, priorizando soluções fundamentadas em boas práticas e necessidades reais dos usuários.

---

## 4. Acompanhamento e evidências | 16/10/2026

> Registro do progresso conhecido nesta revisão. O [GitHub Projects](https://github.com/users/guicunhasou/projects/2/views/1) e as Issues são as referências para o estado corrente. Trabalho demonstrado, implementação integrada e validação concluída são fatos distintos. Não se atribui `Done` sem evidências e aprovação pertinentes.

| Tarefa | Situação constatada | Pendência |
| --- | --- | --- |
| **Alfa 1.1** | Histórico preservado, branches e PRs em uso. A [PR #77](https://github.com/isalvesb/flui-charge-map-next/pull/77) propõe a documentação das convenções e segue aberta. | Revisão das convenções pela responsável; [1.1.1](https://github.com/isalvesb/flui-charge-map-next/issues/12) e [1.1.3](https://github.com/isalvesb/flui-charge-map-next/issues/74) continuam abertas. |
| **Alfa 1.2** | Correções integradas; evidências web e iOS registradas em [auditoria-1.2.md](auditoria-1.2.md). A PR #77 reúne validações complementares e correções reproduzidas na base posterior, sem aprovação integral. | [1.2.3](https://github.com/isalvesb/flui-charge-map-next/issues/75): regressão complementar na versão atual, validação Android e revisão da equipe. |
| **Alfa 1.3** | Configurações e estimativas implementadas, com validação web e evidências iOS documentadas em [alfa-1.3.md](alfa-1.3.md) e na PR #77. | [1.3.4](https://github.com/isalvesb/flui-charge-map-next/issues/76): completar validação iOS da versão atual e Android. |
| **Beta 2.1** | [2.1.1](https://github.com/isalvesb/flui-charge-map-next/issues/8) e [2.1.2](https://github.com/isalvesb/flui-charge-map-next/issues/9) integradas à `main` pela [PR #4](https://github.com/isalvesb/flui-charge-map-next/pull/4). | [2.1.3](https://github.com/isalvesb/flui-charge-map-next/issues/10): validação iOS e Android; tarefa principal permanece aberta. |
| **Beta 2.2** | Motor local de respostas integrado pela [PR #3](https://github.com/isalvesb/flui-charge-map-next/pull/3); [PR #6](https://github.com/isalvesb/flui-charge-map-next/pull/6) apresenta interface conversacional, mas segue aberta. Imagens compartilhadas pela equipe mostram chat com entrada/resposta e interface de recomendações. | [2.2.1](https://github.com/isalvesb/flui-charge-map-next/issues/22) em andamento; verificar recomendações contextualizadas no chat ([2.2.2](https://github.com/isalvesb/flui-charge-map-next/issues/23)) e avaliar voz ([2.2.3](https://github.com/isalvesb/flui-charge-map-next/issues/24)). |

**Demonstrações compartilhadas pela equipe, ainda não arquivadas como evidências no repositório:**

- Imagens da Isa exibem a interface da FluIA com opções de necessidades, conversa com campo de entrada e resposta, além de uma recomendação demonstrativa. Elas comprovam estados visuais capturados; não substituem testes de fluxo completo, testes de regressão ou a integração da PR #6.
- Vídeo do Camilo demonstra a ação de iniciar rota e a abertura do Google Maps no ambiente apresentado. Isso acrescenta evidência ao fluxo de navegação externa observado, mas **não comprova** o planejamento de viagens com autonomia/paradas da **Beta 2.4**, nem funcionamento equivalente em todas as plataformas.
- Na PR #77, Android segue impedido pela ausência do ambiente de SDK/emulador disponível; o iOS contém evidências históricas e testes dirigidos atuais com limites documentados. Nenhum desses impedimentos deve ser registrado como validação aprovada.

As demais tarefas da Beta e as propostas da Gama mantêm seus escopos originais. Esta revisão não atesta nem descarta trabalho feito fora do repositório; o andamento deve ser confirmado com seus responsáveis antes de alterar os status.

---

## 5. Orientações gerais de execução

1. Preservar as decisões aprovadas e a arquitetura existente.
2. Priorizar soluções simples, eficientes e reutilizáveis.
3. Desenvolver alterações de código em branches e pull requests.
4. Distinguir dados verificados, demonstrativos e estimados.
5. Não antecipar tarefas ou ampliar escopos sem autorização.
6. Exigir testes e evidências proporcionais às alterações.
7. Não apresentar compatibilidade automotiva simulada como integração real.
8. Tratar acessibilidade como requisito transversal, reservando personalizações avançadas para tarefas específicas.
9. Manter os escopos da Gama como propostas até sua aprovação.

---

## 6. Histórico de versões

### v2.1 | 16/10/2026 (proposta de atualização)

- Incorporação ao planejamento das subtarefas 1.1.3, 1.2.3, 1.3.4 e 2.1.3, já cadastradas nas Issues.
- Registro de evidências e pendências verificadas da Alfa e das Betas 2.1 e 2.2, sem presumir conclusão a partir de capturas ou PRs abertas.
- Inclusão do vídeo demonstrativo da abertura de rotas como evidência delimitada, sem confundi-la com o planejamento de viagens da Beta 2.4.
- Manutenção das 19 tarefas principais e dos escopos provisórios da Gama; total atualizado para **49 subtarefas**.


### v2.0 | 16/10/2026

- Reorganização da LDT em enunciados principais e subtarefas.
- Padronização dos enunciados principais para enquetes do WhatsApp, com até 100 caracteres.
- Simplificação das subtarefas, agrupando atividades relacionadas.
- Atualização da Beta 2.6 para priorizar responsividade e acessibilidade básica, sem implementar a experiência automotiva demonstrativa.
- Ampliação da Gama 3.5 com a proposta Flui Auto Experience, incluindo seleção de veículos e simulação visual em centrais multimídia.
- Inclusão da Gama 3.6, dedicada à acessibilidade ampliada e às opções de personalização.
- Ampliação do planejamento de 18 para 19 tarefas.
- Preservação da numeração e dos objetivos das demais tarefas.

### v1.2 | Versão anterior

- Organização do backlog em Alfa, Beta e Gama.
- Registro dos objetivos conhecidos e das descrições recuperadas do projeto.
- Manutenção dos escopos provisórios da Gama.

---

**Projeto:** Flui NEXT 2026
**Lista de Tarefas:** v2.1
**Total:** 19 tarefas principais (3 Alfa, 10 Beta e 6 Gama) e 49 subtarefas