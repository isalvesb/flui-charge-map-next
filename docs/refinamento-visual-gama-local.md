# Refinamento visual da Gama — 22/10/2026

Base `43814f8`, branch exclusivamente local `local/refinamento-visual-gama-20261022`.
Nenhuma publicação, integração remota ou incorporação das PRs #99/#100.

## Alterações

| Entrega | Resultado | Commits locais |
| --- | --- | --- |
| 3.2 | Contexto compacto no início do conteúdo, recolhido ao reabrir; detalhes e atalhos secundários; opções menores, texto sem cortes e respostas mais largas. Expandir o contexto não força a rolagem ao fim da conversa. | `bcfa8f5` |
| 3.3 | Resumo com indicação de estimativa em linha reta; trajeto direto sem repetição de distância/tempo; chegada e saída identificadas; último trecho das viagens com recarga preservado; métricas empilhadas quando a largura de leitura exige. | `9783b5f` |
| 3.5 | Introdução curta, seletor compacto e prévias com mapa ilustrativo, ponto em destaque e barra visual. Formatos largos permitem exploração lateral sem reduzir fonte. Limites e acesso ao mapa do app preservados. | `9fc002a`, `3741141` |
| 3.10 | Halo, arcos e contornos distintos nos seis estados, somente no laboratório; ciclos nativos leves, avisos/alertas estáticos e acabamento estático com movimento reduzido. | `e38e213` |
| 3.10 / acessibilidade | Correção comprovada no iOS: o switch da prévia agora anuncia o estado efetivo quando a redução de movimento do sistema tem prioridade. Antes anunciava desligado, apesar da prévia estática. | `132273b` |

Arquivos: `FluiAssistantSheet.tsx`, `assistantPresentation.ts`, `TripPlannerScreen.tsx`,
`TripPlannerScreen.styles.ts`, `tripLayout.ts`, `AutoExperienceScreen.tsx`,
`autoPresentation.ts`, `EnergyOrbPrototype.tsx`, `OrbLabScreen.tsx`,
`orbPrototypePresentation.ts` e quatro testes correspondentes.

Comparação Git com a base confirmou inalterados: motor conversacional/recomendações,
`tripPlanner.ts`, catálogo, Orb principal, dependências e orientação global.
Os hooks locais, o destino de push inválido e `push.default=nothing` permanecem ativos.

## Verificações executadas

- TypeScript aprovado; lint sem erros, com um aviso herdado em
  `ConnectivityContext.tsx:48` (`revision.current` no cleanup).
- Suíte final: **140/140 testes**, incluindo resumos/contexto, largura de leitura,
  três proporções da prévia e estados/movimento do protótipo.
- Exportação web final: **14 rotas**. Prévia horizontal e panorâmica conferidas
  visualmente em janela web de 1280 × 720.
- iOS: **iPhone 17e, iOS 27.0, Expo Go**, 390 × 844 pontos;
  capturas reais de 1170 × 2532 pixels.
- FluIA: abertura, expansão/recolhimento, duas mensagens e resposta/recomendação,
  rolagem automática até a última resposta, botões de explicação/rota presentes,
  fechamento/reabertura recolhida e atalho para Configurações.
- Planejador: FIAP → Campos do Jordão, 400 km/70%: 142 km, 2h02min,
  chegada de 34%. Com autonomia temporária de 80 km: três paradas,
  último trecho ≈21 km/18min, chegada de 53% na árvore acessível.
- Temas claro, escuro e alto contraste escuro; fonte padrão/maior do app.
  Ampliação nativa do iOS (`extra-extra-extra-large`) conferida na FluIA e
  no planejador: métricas empilhadas e textos sem truncamento nos trechos visíveis.
- Redução de movimento **nativa** ativada nos Ajustes do simulador:
  controle do laboratório ligado/desabilitado; duas capturas consecutivas
  idênticas em bytes no estado Pensando. Preferência nativa restaurada para desligada.
- Vídeo real dos seis estados: **32,32 s**, H.264, 1170 × 2532, sem áudio.
  Estrutura/finalização verificadas; não representa medição de FPS ou consumo.

## Evidências e limites

Evidências novas: `.validation/refinamento-gama-20261022/`.
Abra `comparacoes.html` para os pares antes/depois e `LEIA-ME.md` para o índice.
As imagens antigas em `.validation/gama-avancada/` são referências do antes;
não foram apresentadas como testes da versão modificada.

Não foi possível ativar o **teclado virtual**: o menu Controls do Device Hub
não ofereceu essa opção e o Simulator separado não está disponível.
Digitação/teclado físico não comprovam comportamento com teclado virtual.

O Mac foi bloqueado ao tentar rolar além do resumo com três paradas.
A chegada está na árvore acessível, mas a captura desse cenário ainda tem
parte do conteúdo sob o rodapé; falta comprovar a leitura ao rolar até o fim.
No trajeto direto, os avisos foram capturados integralmente acima do rodapé.

O texto do iOS foi restaurado para `large`, e Reduzir Movimento foi restaurado
para desligado. Ao ocorrer o bloqueio, o app de teste estava em tema claro,
fonte padrão, contraste desligado e autonomia **80 km**; retornar a **400 km**,
tema escuro, fonte maior e alto contraste ligado após desbloquear o Mac.
Veículo, origem e bateria permaneceram BYD Dolphin Plus/FIAP/70% demonstrativos.

Pendentes: teclado virtual, rolagem final com três paradas, alto contraste claro,
leitura humana com VoiceOver, tamanhos extremos do sistema, aparelho físico,
Android, Release e medição de desempenho/energia. Adoção do protótipo da Orb
continua dependente de avaliação humana; a Orb principal permanece igual.
