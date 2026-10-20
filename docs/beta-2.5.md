# Beta 2.5 — consulta local e conectividade

Refs #31, #32 e #33. Validação local em 20/10/2026.

## Base e recuperação

Branch `beta/armazenamento-offline-2.5`, criada da main `ba7680f` (PRs #79 e #89 integradas). A implementação descrita anteriormente na #31 não estava nos refs locais/remotos nem em PR publicada. O próprio comentário informa que o trabalho estava sem commit na máquina do colaborador. Não foi possível recuperá-lo; nenhum arquivo ou histórico desse trabalho foi descartado.

Foram reutilizados o catálogo e as imagens empacotados, cálculos locais, FluIA demonstrativa, AsyncStorage e as quatro chaves existentes de preferências, favoritos, histórico e avaliações. Não foi criada outra cópia do catálogo nem migração de armazenamento.

## Comportamento entregue

- `expo-network ~8.0.8`, compatível com SDK 54, informa conexão, ausência de conexão ou estado desconhecido. A leitura tem limite de três segundos, trata rejeição e é renovada por evento de rede, retorno ao app e nova tentativa. Eventos novos prevalecem sobre leituras antigas.
- Mapa, ficha e planejador apresentam aviso compacto quando offline ou sem confirmação da conexão, com botão Verificar. O catálogo permanece consultável. Estado positivo do sistema não garante que um serviço externo responderá.
- Ficha verifica conexão antes da solicitação de GPS. Ficha e planejador revalidam antes de abrir Google Maps/Waze. Offline/estado desconhecido produzem mensagem recuperável, sem abrir o aplicativo externo; uma nova tentativa pode prosseguir ao reconectar. Os erros do aplicativo externo continuam tratados. Os cálculos e a reserva mínima permanecem iguais.
- Preferências, favoritos, histórico e avaliações continuam locais. Avaliações não são enviadas ao reconectar. Nenhuma coordenada demonstrativa passa a ser localização real.
- O catálogo é o da versão do aplicativo, demonstrativo, possivelmente desatualizado e sem atualização pela conectividade. Horários continuam avaliados pelo relógio local com as regras existentes. Não existe backend, telemetria, download periódico ou sincronização remota. Não foi inventado um horário de atualização do catálogo a partir de uma simples leitura local.
- Na web de produção, um service worker armazena páginas e assets públicos da mesma origem após acesso online. O cache é identificado pelo hash do bundle exportado pelo Expo: uma nova versão prepara seu próprio cache antes de ativar e remover o anterior. Navegação usa rede com limite de três segundos e fallback local; assets já armazenados usam cache. Erro HTTP também admite a página armazenada. Não intercepta POSTs, APIs ou serviços de terceiros. Falha de quota não transforma uma resposta online em erro.

## Arquivos e dependência

| Área | Arquivos |
| --- | --- |
| Estado de rede e aviso | `src/context/ConnectivityContext.tsx`, `src/utils/connectivity.ts`, `src/components/ConnectionNotice.tsx`, `app/_layout.tsx` |
| Ações externas | `src/utils/externalRoute.ts`, `src/hooks/useExternalApp.ts`, `src/features/stations/PointDetailsScreen.tsx`, seu arquivo de estilos, `src/features/trip/TripPlannerScreen.tsx` |
| Comunicação | `src/data/identificacaoDados.ts`, `src/features/map/HomeMapScreen.tsx`, `src/features/settings/SettingsScreen.tsx` |
| Abertura web offline | `public/offline-worker.js` |
| Dependência e verificações | `package.json`, `package-lock.json`, `tests/connectivity.test.ts`, `tests/offlineWorker.test.ts` |
| Evidências | Este documento e `docs/validacao-2.5/` |

Única dependência adicionada: `expo-network`. Sem alterações em fixtures, cálculo de viagens, motor da FluIA, esquema ou chaves do AsyncStorage.

## Resultados automatizados

- TypeScript e ESLint: aprovados em `npm run check`.
- **119/119 testes**, zero falhas. Dez casos novos cobrem classificação online/offline/desconhecida, recuperação, timeout/rejeição tardia, bloqueio de ambos os provedores, nova tentativa, falha externa, preparo/invalidação do cache por versão, ficha com parâmetros, abertura offline, recuperação, erro HTTP e quota.
- Exportação web: **12 rotas**, concluída.
- Expo Doctor: **18/18 verificações**, sem problemas detectados.
- Logs: [check](validacao-2.5/check-final.log), [exportação](validacao-2.5/exportacao-web.log), [Doctor](validacao-2.5/expo-doctor.log). O Quality remoto é vinculado ao commit da PR e registrado no acompanhamento da #31.

## Verificação prática web

Navegador integrado do Codex no macOS, viewport 1280 × 720. Exportação de produção servida em `127.0.0.1:8130`, com resolução de rotas HTML sem extensão. Origem exclusiva de teste; nenhum dado do aplicativo nativo foi apagado.

| Cenário executado | Resultado observado |
| --- | --- |
| Preparação online | Catálogo e ficha acessíveis; favorito em Flui Vila Mariana Lins salvo. Configuração alterada de BYD/400 km/FIAP/70% demonstrativa para Beta 2.5 Offline/350 km/Vila Mariana/60% manual. |
| Servidor encerrado | Ficha recarregou com favorito, chegada 60%, distância aproximadamente zero da origem e avisos demonstrativos/fechamento. |
| FluIA sem servidor | Recomendou Higienópolis Prime Charge: aproximadamente 4,9 km e chegada de 59%, com ressalvas demonstrativas. |
| Planejador sem servidor | Vila Mariana → Campos do Jordão: 210 km de autonomia, percurso demonstrativo de 141 km, uma parada, chegada 53%. |
| Busca e filtros sem servidor | CCS2 + Aberto agora reduziram 12 estações para uma. |
| Fechar aba e reabrir sem servidor | Configurações e bateria manual preservadas; consulta independente da sessão anteriormente aberta. |
| Servidor restabelecido | Consulta voltou a usar a versão disponível online; veículo, origem, bateria e favorito mantidos. Filtros aplicados ao mapa permaneceram após recarregar. |
| Atualização do cache | Detectada e corrigida durante o ensaio uma mistura de páginas de bundles diferentes. O preparo passou a usar cache próprio por hash do bundle; a reabertura final foi conferida novamente. |

Capturas e árvore acessível em [validacao-2.5](validacao-2.5/). `01-reabertura-final-sem-servidor` e `02-ficha-final-sem-servidor` comprovam a versão final após corrigir o versionamento do cache. Os registros 03/04/06/08 são etapas anteriores desta mesma execução e não são usados como comprovação dessa correção do cache. Registros completos da sessão ficam no diretório `output/beta-2.5-20261020` do workspace local.

## Limitações e aprovação

- O ensaio prático desligou o servidor da aplicação, **não a conexão do macOS**. Comportamentos online/offline/desconhecido do detector e bloqueios de navegação foram exercitados por testes automatizados; o aviso offline e sua recuperação não receberam comprovação prática com a rede do sistema desligada nesta rodada.
- Não foram executados testes nativos iOS/Android, abertura de Google Maps/Waze instalados ou modo avião em aparelho. Expo Doctor verifica compatibilidade, não comportamento nativo.
- Mapas de fundo nativos dependem do provedor/rede/cache do sistema; não há download de mapas offline. A web utiliza a prévia local existente. Voz pode depender dos recursos instalados no dispositivo e não foi certificada offline.
- Na web, é necessário acesso online inicial em HTTPS ou localhost, service worker permitido e espaço de armazenamento. Limpeza/expulsão do cache pelo navegador remove a garantia de reabertura. Fotos não previamente armazenadas podem faltar; o catálogo textual é empacotado no bundle. A política web é aplicada à exportação de produção, não ao servidor Metro de desenvolvimento.
- A exportação apresentou aviso recuperável de hidratação React #418 na abertura. O mesmo aviso foi reproduzido numa exportação isolada da main `ba7680f`, sem estas alterações; os fluxos funcionais terminaram normalmente. Essa limitação preexistente não foi ampliada para uma refatoração fora do escopo.
- #32 e #33 já estavam fechadas no início; #31 estava aberta. Nenhum estado foi alterado. A entrega implementa os critérios funcionais para revisão coletiva; a conclusão da #31 deve aguardar a revisão/integração humana e a aceitação explícita das limitações de validação nativa. Não houve merge nem aprovação presumida.
