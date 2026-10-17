# Flui NEXT 2026 — Validação iOS da Alfa 1.3

Data: 16/10/2026. Resultado geral: **PARCIAL — validação restante impedida pela automação**. Não equivale a reprovação do aplicativo nem a aprovação integral da tarefa.

## Ambiente e escopo

Repositório `isalvesb/flui-charge-map-next`, branch `alfa/dados-demonstrativos-1.3`, commit executado `d14b85b763a9f4a40c99b1f16574ad3fb0a50e36`. Árvore Git limpa antes e depois; nenhuma alteração local preexistente. Xcode 27.1 (27A9275), iPhone 18 Pro Max, iOS Simulator 27.0, Expo Go 54.0.7. Dispositivo `4A2C862B-D6FC-4E88-8FB5-88164A5C5A2E`.

Lidos `docs/alfa-1.3.md`, código dos controles afetados e o “Protocolo de Colaboração com IA — Projeto Flui, versão 1.0” fornecido em RTF. Reutilizados Metro e projeto XCTest existentes. Nenhuma ferramenta instalada, infraestrutura nova, funcionalidade, refatoração ou mudança visual do aplicativo. As duas fontes Swift são sondas de validação locais, não fazem parte do aplicativo.

## Cenários e resultados

| Cenário | Resultado | Evidência e limite |
| --- | --- | --- |
| Nome, autonomia e origem salvos | APROVADO | Pela interface: BYD Dolphin Plus / 400 km / FIAP alterados para Flui iOS NEXT / 300 km / Vila Mariana. Salvamento confirmado. |
| Persistência dos três parâmetros | APROVADO | Expo Go encerrado e relançado por `terminate/launch`; projeto reaberto. Campos Flui iOS NEXT e 300 e seleção Vila Mariana conferidos novamente. |
| Bateria preservada ao configurar/reabrir | APROVADO | 45%, Informado manualmente, data exibida 16/10, 06:33, preservados antes/depois. Não foi reatribuída origem demonstrativa. |
| Distância da mesma estação por origem | OBSERVADO | Higienópolis: FIAP ≈2,1 km; Vila Mariana ≈4,9 km. Ambos os valores aparecem no mapa nativo, identificado como linha reta/sem percurso. A autonomia também mudou de 400 para 300 km nessa sequência; esta observação não isola o efeito da origem sobre a bateria de chegada. |
| Origem no mapa | PARCIAL | A árvore nativa troca “Origem demonstrativa: FIAP” por “Origem demonstrativa: Vila Mariana”; o mapa mostra a região da nova origem. O comando de centralização e a preservação após arraste/ciclo não foram atingidos pela sonda. |
| Consistência mapa × ficha × FluIA | NÃO EXECUTADO | A sonda parou na preparação da bateria antes de abrir ficha e FluIA ou executar a comparação controlada entre origens. |
| Nova edição manual e persistência da bateria | INCONCLUSIVO | Primeira tentativa mostrou seleção visual 45% → 40%, sem salvar. Não confirmou edição para 35% nem persistência dessa nova edição. Segunda tentativa falhou antes de tocar no ajuste. |
| Avisos demonstrativos/ausência de telemetria | OBSERVADO | Configurações: veículo/autonomia usados em simulações, sem GPS/integração, distâncias em linha reta e não percursos reais. Mapa: opções/origem demonstrativas. Seletor: ≈135 km estimados · sem telemetria. |
| Filtros, elegibilidade, funcionamento e reserva mínima | NÃO REVALIDADO NO IOS | Filtros foram limpos somente para preparar o cenário; não houve novas asserções nativas de cortes, disponibilidade ou reserva. Evidências automatizadas/web prévias não foram tratadas como prova nativa. |

### Valores registrados na interface nativa

| Momento | Origem | Veículo/autonomia | Bateria/origem | Alcance mostrado | Higienópolis / chegada |
| --- | --- | --- | --- | --- | --- |
| Inicial | FIAP | BYD Dolphin Plus / 400 km | 45%, manual, 16/10 06:33 | ≈180 km | ≈2,1 km em linha reta / 44% |
| Após configuração e reinício | Vila Mariana | Flui iOS NEXT / 300 km | Os mesmos 45%, origem e data | ≈135 km | ≈4,9 km em linha reta / 43% |
| Seleção não salva | Vila Mariana | Flui iOS NEXT / 300 km | Seletor chegou visualmente a 40%; valor salvo permaneceu 45% | ≈120 km no seletor; ≈135 km salvos | Não houve comparação completa nesse estado |

Os valores vêm das árvores/capturas da execução em `d14b85b`, não da web nem dos testes da Alfa 1.2. No log inicial, linhas 55 e 136 registram bateria/estação desde FIAP; linhas 753 e 932 registram persistência e a mesma estação desde Vila Mariana. A árvore dirigida e a captura final mostram bateria salva de 45%.

## Resultados XCTest, sem ocultar falhas

| Rodada | Resultado efetivo |
| --- | --- |
| Inicial | 2 casos: **1 aprovado e 1 falho**. `test01ConfiguracaoEPersistencia` aprovado em 135,681 s. `test02OrigemConsistenciaEBateria` falhou em 55,066 s, antes de salvar bateria ou comparar telas. Saída 65. |
| Dirigida, sem repetir o caso aprovado | Somente `test02OrigemConsistenciaEBateria`: **1 caso falho**, 46,636 s. Saída 65. |

**Diagnóstico do impedimento:** minha sonda procurou o rótulo “Bateria selecionada em ... por cento”. Na segunda rodada, a árvore nativa mostra os botões de ajuste e “Definir carga da bateria”, o texto “45%” e a ressalva de ausência de telemetria, mas não expõe o rótulo composto esperado pela sonda. Portanto, a segunda falha é de localização pela automação, não prova de que o seletor deixou de funcionar. Na primeira rodada, o vídeo confirma um ajuste até 40%, mas não comprova o segundo ajuste nem o salvamento; a causa exata dessa interrupção não foi estabelecida.

Após as duas tentativas no cenário pendente, a investigação foi encerrada conforme a restrição. Nenhum terceiro teste, ajuste especulativo ou repetição do cenário aprovado foi executado. A suíte experimental agregada NÃO passou. Não foi identificado defeito funcional comprovado que justifique alterar o aplicativo nesta execução.

A abertura inicial por `simctl openurl` retornou timeout, porém o Flui carregou, e o Metro e o contexto Hermes foram conferidos antes do XCTest. O relógio não foi simulado nem alterado. A exportação inicial do resultado exigiu acesso fora do sandbox aos recursos do Xcode; concluída com sucesso, sem instalações.

## Evidências produzidas

- [Mapa inicial desde FIAP](mapa-inicial-fiap.png).
- [Configuração salva](configuracao-salva-vila.png).
- [Configuração persistida após encerrar/reabrir](configuracao-persistida.png).
- [Seleção de 40%, sem salvar — frame da gravação XCTest](bateria-selecao-40-sem-salvar.png).
- [Estado final: seletor em 45%, ≈135 km e sem telemetria](estado-final.png).
- [Log integral da rodada inicial](execucao.log) e [log dirigido](dirigido.log).
- [Árvore nativa do seletor na segunda falha](arvore-seletor-dirigido.txt).
- [Fonte inicial](FluiValidacao.swift), [fonte dirigida](Dirigido.swift), comandos, códigos de saída e manifests com nomes/timestamps dos anexos nesta pasta.
- Resultados nativos completos: `Resultado.xcresult` e `Resultado-dirigido.xcresult`; capturas e gravações originais em `capturas/` e `capturas-dirigidas/`.

As capturas de configuração persistida, mapa inicial, seletor final e frames da primeira falha foram inspecionadas visualmente. Os frames extraídos não foram retocados. Nem todas as capturas cobrem todos os campos simultaneamente; as árvores registram os valores integrais.

## Alterações e encerramento

Nenhum arquivo do repositório, código, dependência, configuração, commit ou branch foi modificado. Evidências e este relatório foram salvos somente em `output/validacao-ios-alfa-1.3-20261016/`, fora do repositório. Nenhum push, comentário, merge ou encerramento da PR foi realizado nesta execução.

Estado de teste deixado no simulador: Flui iOS NEXT, 300 km, Vila Mariana, bateria salva em 45%, manual, data anterior preservada. O seletor foi abandonado sem salvar ao desligar o dispositivo. Metro interrompido e simulador confirmado em Shutdown. Runner existente pode permanecer instalado no simulador. Main local preservada em `9708084c7bd74c03f016b7cb3f680a2c063ddac9`; essa referência local anterior não foi atualizada para a main remota.

## Prontidão da PR #2

**Pode seguir para revisão de código, acompanhada destas ressalvas; não recomendo considerar a validação iOS concluída nem autorizar merge com base nesta rodada.** Ainda faltam edição/salvamento e persistência da nova bateria manual, comparação controlada de ficha/FluIA/mapa, comando de centralização e estabilidade da câmera com mudança de origem. A decisão de merge continua com a equipe. Esta execução não aprova a tarefa no backlog.

Os 51 testes, a exportação web e a CI aprovados previamente permanecem evidências históricas de `d14b85b`; não foram repetidos nem apresentados como resultados desta sessão. Não houve teste Android, dispositivo físico, build de distribuição, VoiceOver, todos os temas/fontes, Paulista ou novas funcionalidades.

Verificação remota final: PR #2 aberta, em rascunho, sem merge; HEAD `d14b85b763a9f4a40c99b1f16574ad3fb0a50e36`, base remota `19f035ccf5149b0259ce8a1431b0205935f38182`, preservados.
