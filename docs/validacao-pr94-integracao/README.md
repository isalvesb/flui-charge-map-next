# PR #94 — integração das Betas 2.5, 2.8 e 2.3

Data: 21/10/2026. Branch: `beta/refinamentos-ux-energy-orb-2.8-2.3`.

## Base e resolução

Integração por merge normal de `origin/main` `23cc9093d24182cc8d95d958884f58cbd8c188da` (PR #90 integrada) sobre `01809e4`, preservando os dois commits das Betas 2.8/2.3 e o histórico da main. A worktree estava limpa antes da operação; outras worktrees não foram alteradas.

O conflito textual ocorreu apenas em `PointDetailsScreen.tsx`: abertura do modal de rota e remoção do antigo bloco “Guia do ponto”. A ficha simplificada foi mantida, com `ConnectionNotice` junto à recomendação e erro de conectividade acima dos botões fixos, como na Beta 2.5. O merge automático preservou o aviso do mapa e os estilos do rodapé.

O novo parâmetro `startRoute=1`, usado pelo atalho da FluIA, abria diretamente a escolha de GPS. Para que a integração não contorne o bloqueio offline da 2.5, ambos os caminhos agora passam pelo mesmo `handleStartRoute` e por `prepareExternalRoute`, antes de mostrar a escolha de localização. A intenção automática é consumida uma vez por estação, sem reabrir o modal após cancelar. Se a consulta falhar, o estado desconhecido também bloqueia com mensagem recuperável; o botão permite nova tentativa.

Não houve alteração no motor, voz, estados ou desenho da Orb, cálculos, catálogo, orientação global ou integrações Google/Waze. Os seis estados da Orb e os refinamentos anteriores permanecem no diff da PR. Nenhum arquivo de `~/Flui-teste-2.5`, adaptação UIScene, assinatura ou projeto nativo foi incluído.

## Verificações da integração

- `npm run check`: TypeScript aprovado, ESLint sem erros e **123/123 testes** aprovados. Há um aviso `react-hooks/exhaustive-deps` em `ConnectivityContext.tsx:48`, herdado integralmente da main, registrado em `check.log`; não é falha introduzida pela resolução.
- Novo caso de regressão em `connectivity.test.ts`: offline, conexão desconhecida e rejeição do detector não executam a abertura da escolha de GPS; conexão confirmada executa uma única vez. Testes existentes verificam bloqueio nos dois provedores, recuperação da conexão, falha de abertura externa e consulta por cache.
- Exportação web aprovada: **12 rotas**. Log em `exportacao-web.log`.
- `git diff --check`: aprovado; nenhum marcador de conflito pendente.

## Validação nativa dirigida — versão integrada

Ambiente: iPhone 17e, iOS 27.0, 390 × 844 pt, Expo Go SDK 54, Xcode 27.1. Texto do sistema `extra-extra-extra-large` durante a execução. Bundle servido exclusivamente desta worktree na porta 8096; não é build standalone/Release.

A primeira execução reutilizou `testFluxoCompactoAmpliado`. Conferiu atalho da FluIA → verificação de conexão → escolha de origem → continuar sem GPS → confirmação Google Maps/Waze → cancelar → mapa. Assertivas de controles acessíveis e ausência de interseção com a FluIA passaram até esse ponto. O caso completo **falhou** ao aguardar prontidão do teclado em 8 segundos; não é apresentado como teste integral aprovado. O log foi preservado em `ios-integrado.log`. A finalização do primeiro xcresult travou e foi interrompida após o resultado, sem recuperar seus anexos; a captura direta `mapa-integrado-ampliado.png` está preservada.

Uma única retomada do trecho pendente, `testRetomadaTecladoIntegrado`, reutilizou o harness e a mensagem já digitada. O roteiro passou a comparar o teclado com `UIScreen.main.bounds`, evitando consultar repetidamente a moldura da aplicação pela árvore de acessibilidade, e admitiu espera de até 20 segundos. **1 teste, 0 falhas (21,248 s)**, finalizado com `TEST SUCCEEDED`; nenhuma mudança no aplicativo foi necessária para essa retomada.

Comprovados nesse caso: estado Escrevendo, teclado virtual visível, botão Enviar acessível, envio e resposta com CTA de rota alcançável, CTA acima do teclado, fechamento sem teclado residual, reabertura em Pronta e novo fechamento. Capturas reais `orb-digitando-integrada.png`, `resposta-orb-teclado-integrados.png` e `orb-reabertura-integrada.png`. Log em `ios-retomada.log`; roteiro em `roteiro-ios.swift`. O roteiro contém também casos antigos não selecionados nesta rodada; os nomes acima identificam exatamente os dois executados.

O pacote aprovado e os logs completos permanecem em `output/pr94-integracao-20261021/ios-retomada.xcresult` no workspace. A comparação geométrica e as capturas não representam medição de desempenho nem certificação integral de acessibilidade.

## Limitações

- Sem desconexão nativa real e isolada verificável no ambiente disponível. Os comandos de simulação/configuração do Device Hub não oferecem controle de rede; a rede geral do Mac foi preservada. Os testes automatizados não substituem uma rodada nativa em modo offline.
- Não foram reexecutados testes históricos completos dos seis estados, voz ou redução de movimento, cujo código não foi alterado. Evidências antigas continuam identificadas por seus commits em `../betas-2.8-2.3.md`.
- Sem nova validação em aparelho físico, build Release, Android ou aplicativos Google Maps/Waze instalados nesta rodada.
- Main, rascunho da PR, estados das issues e Projects permanecem preservados. A integração final exige revisão humana; não foi realizado merge da PR.
