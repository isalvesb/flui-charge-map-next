# Correção de localização ao iniciar rota — Issue #75

17/10/2026. Branch independente `fix/localizacao-iniciar-rota`, criada da main `b89a71b1ab1a0adc80c0b9f0ec0a47dda02b8e92`. A branch e a PR #79 permanecem em `99bd08d`, sem alterações desta tarefa. Referência: [relato e complementos da Issue #75](https://github.com/isalvesb/flui-charge-map-next/issues/75).

## Causa e comportamento

A evidência humana registra permissão concedida seguida de rejeição de `getCurrentPositionAsync` (`Cannot obtain current location`, `kCLErrorDomain error 0`). Na main, nem a solicitação de permissão/posição no contexto nem o botão Continuar capturavam essa rejeição: a Promise escapava do evento de toque. Permissão concedida não garante uma posição disponível.

Problemas adicionais confirmados no código: `canOpenURL` era tratado como booleano sem aguardar sua Promise; destino inválido registrava erro e continuava; o diálogo ignorava `error`/`isLoading` do hook e recebia estados independentes da ficha, deixando falhas externas sem apresentação.

| Antes | Depois |
| --- | --- |
| Falha de aquisição escapava do botão Continuar. | Contexto retorna sucesso, permissão negada ou indisponibilidade; diálogo contém proteção adicional e mostra mensagem recuperável. |
| Aquisição podia manter a interface aguardando indefinidamente. | Espera pela posição limitada a 15 segundos após a decisão da permissão. Retorno/rejeição tardios não atualizam a rota nem escapam da Promise. O limite não cancela a operação nativa do SDK. |
| Falha/recusa não tinha escolha explícita de recuperação. | Tentar novamente, Cancelar ou Continuar sem localização. Nesse último caso, a URL omite a origem; o navegador externo a define. |
| Uma rota seguinte podia pular a aquisição e reutilizar a posição no contexto. | Cada início reinicia a confirmação; somente o resultado desta tentativa segue pelo callback já existente para o diálogo/hook. Cancelamento impede avanço tardio do diálogo. |
| A consulta de suporte externo era ignorada e o erro não aparecia. | Aguarda `canOpenURL`, trata recusa/rejeição/erro ao abrir, mostra o erro no próprio diálogo e libera nova tentativa ou outro provedor. |

As URLs HTTPS existentes de Google Maps e Waze permanecem inalteradas. Não há origem demonstrativa, posição fixa ou GPS alternativo no código de produção. Cálculos, catálogo, preferências, FluIA, Beta 2.6, arquitetura Provider/hook/modal e dependências preservados. Removido o log de coordenadas no diálogo.

## Arquivos

- `src/context/LocationContext.tsx`: aquisição protegida e limpeza da posição no retorno de falha.
- `src/utils/currentLocation.ts`: limite/captura e validação do resultado do SDK, isolados para teste.
- `src/features/stations/components/RoutingModal.tsx`: feedback, espera, tentativas e escolha explícita sem origem; uso do estado real de abertura externa.
- `src/features/stations/PointDetailsScreen.tsx`: reinício do fluxo e encaminhamento do resultado desta tentativa; remoção de estado de erro desconectado.
- `src/hooks/useExternalApp.ts` e `src/utils/externalRoute.ts`: abertura aguardada, destino inválido interrompido e erro recuperável.
- `tests/routeFailures.test.ts`: 11 testes novos, sem nova ferramenta/suíte de componentes.

## Resultados

**TypeScript, lint e 71/71 testes aprovados** ([log](validacao-localizacao-ios/check.log)). Os 11 novos casos cobrem recusa, falha da API de permissão, rejeição GPS com a mensagem relatada, posição válida, nova tentativa, coordenadas inválidas, ausência de resposta/rejeição tardia, suporte externo assíncrono falso, rejeições de consulta/abertura, destino inválido e URLs dos dois provedores com/sem origem. Nenhum cenário de teste usa a origem demonstrativa como GPS. [Hashes dos arquivos testados](validacao-localizacao-ios/codigo-validado.sha256).

**iOS:** Device Hub/CoreSimulator, iPhone 18 Pro Max, iOS 27.0, Xcode 27.1, Expo Go 54.0.7, 440×956 pontos. Projeto XCTest local reutilizado; [fonte](validacao-localizacao-ios/FluiValidacao.swift). Coordenada de teste do simulador: `-23.5614,-46.6559`, definida pelo controle do simulador, nunca pelo aplicativo.

| Cenário efetivamente executado | Resultado/evidência |
| --- | --- |
| Posição disponível → escolha de provedor | **Aprovado**, [diálogo](validacao-localizacao-ios/02-posicao-disponivel-provedores.png). |
| Abrir Google Maps e retornar | **Aprovado para link web externo**. Safari exibiu Google Maps com origem `-23.5614000,-46.6559000` e destino da estação `-23.5472000,-46.6618000` ([captura](validacao-localizacao-ios/03-google-maps-aberto.png)). Não comprova navegação guiada/chegada. |
| Abrir Waze e retornar | **Aprovado para entrega ao Safari/domínio waze.com** ([captura](validacao-localizacao-ios/04-waze-aberto.png)). A captura mostra a página carregando; funcionamento completo do serviço não foi confirmado. |
| Cancelar e iniciar outra rota | **Aprovado**: reaparece a confirmação, sem reutilizar silenciosamente a etapa anterior ([captura](validacao-localizacao-ios/05-nova-rota-solicita-posicao-atual.png)). |
| Permissão negada | **Aprovado**, feedback e ações recuperáveis ([captura](validacao-localizacao-ios/06-permissao-negada-recuperavel.png)). |
| Escolher continuar sem localização | **Aprovado**, aviso explícito e abertura do Google no Safari ([escolha](validacao-localizacao-ios/07-escolha-explicita-sem-origem.png), [abertura](validacao-localizacao-ios/08-google-sem-origem.png)). A omissão da origem na URL é verificada adicionalmente nos testes automatizados. |
| Permissão concedida, GPS indisponível | **Inconclusivo no simulador**: após `simctl location clear`, o SDK ainda retornou uma posição armazenada e abriu a escolha de provedores. Não comprova a falha nativa. Rejeição/timeout/rejeição tardia aprovados somente nos testes automatizados. Sem terceira tentativa deste cenário. |
| Sistema não consegue abrir um aplicativo externo | **Aprovado somente nos testes automatizados** com `canOpenURL=false`, rejeição da consulta e da abertura. Não foi forçado no iOS, cujo Safari atende os links HTTPS. |

Duas execuções XCTest conclusivas, **1 teste/0 falhas cada**: [posição disponível](validacao-localizacao-ios/ios-posicao-disponivel.log), [permissão negada](validacao-localizacao-ios/ios-permissao-negada.log). Uma sonda preliminar falhou antes da ação por rótulo acessível incompleto; outra falhou na expectativa de GPS indisponível porque houve posição válida. Não foram contadas como aprovadas. Resultados `.xcresult` completos em `output/correcao-localizacao-20261017/` local, fora do Git.

## Limitações e estado final

Google Maps e Waze nativos não estão instalados neste simulador. A prova humana anterior de Google Maps pertence ao relato histórico, não à versão corrigida. Aparelho físico, apps nativos dos provedores, Android e precisão/chegada do trajeto não foram testados nesta rodada.

A preparação por links de dependências falhou no Metro; foi substituída por cópia local dos pacotes existentes, sem instalação nem mudança de manifest/lockfile/configuração. Permissão do Expo Go restaurada ao valor inicial observado (`Authorization: 2`); posição de teste mantida no simulador. Preferências e relógio não alterados. Resultado remoto do Quality registrado na PR após publicação.

A correção não encerra a auditoria iOS da Alfa 1.2.3: **Issue #75 permanece aberta**, incluindo a confirmação nativa da falha GPS e as demais pendências de auditoria/revisão humana. PR específica em rascunho, sem merge.
