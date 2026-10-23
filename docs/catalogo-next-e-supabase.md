# 31 — Catálogo do NEXT e decisão sobre Supabase

Conferido em 23/10/2026, no Flui 2.3 experimental. Pesquisa e diagnóstico local, sem criação de serviço remoto.

## Atualização solicitada: 72 pontos e 12 imagens reutilizadas

Em 23/10, após feedback no iPhone, o catálogo foi ampliado de 66 para 72 pontos (50 SP/22 RJ): Moema, Vila Olímpia, Santo Amaro, Copacabana, Tijuca e Petrópolis. Os 60 pontos adicionais reutilizam ciclicamente as 12 imagens originais, sem novas cópias ou downloads. São fotos ilustrativas; não documentam esses locais. As 12 entradas originais e todos os IDs anteriores foram preservados. Os novos pontos continuam sem notas/comentários agregados inventados.

Endereços dos pontos adicionais agora seguem formato de rua e número plausível para o cenário, sem “Local fictício para Flui NEXT”. Não foram geocodificados ou confirmados; a identificação de dados simulados permanece no rodapé das fichas e em Sobre os dados. Catálogo completo e mapa local são contagens diferentes: os 16 marcadores observados antes eram o recorte de 10 km da FIAP, não o total de 66.

TypeScript, ESLint dirigido e 14 testes de catálogo/planejador/escopo de busca aprovados. A matriz de 32 cenários abaixo é histórica, anterior a esta ampliação; não foi repetida integralmente.

## Resultado anterior (66 pontos)

A base já ampliada contém 66 estações fictícias: 47 em SP e 19 no RJ. As 54 novas não receberam fotos ou avaliações inventadas de estabelecimentos reais: usam a capa gráfica existente e não têm notas. As 12 originais preservam imagens e avaliações do cenário. IDs e registros locais foram mantidos.

No relógio fixo 23/10/2026 às 15:00 UTC, 45 pontos satisfazem a regra de funcionamento/conector utilizável. Foram conferidos IDs únicos, coordenadas válidas, contagem de carregadores e ausência de nota artificial em ponto sem avaliações. A matriz de 32 simulações usa FIAP, oito destinos, autonomias 200/400 km e baterias 20/70%. Evidência: ../output/ux-retomada-20261023/catalogo.json. Sete testes dirigidos do planejador passaram.

Com autonomia de cenário de 200 km e 70% de bateria:

| Destino | Recargas calculadas |
|---|---:|
| Campinas / Santos | 0 |
| Campos do Jordão / Paraty / Angra dos Reis | 1 |
| Rio de Janeiro | 2 |
| Cabo Frio / Búzios | 3 |

A base atual já permite múltiplas paradas. Não foi necessário criar mais pontos nem forçar contagens. Isso não comprova a revisão humana da tela do item 01. Os trechos são em linha reta; o algoritmo minimiza recargas e distância, sem seguir rodovias, relevo, trânsito ou consumo real. Não usar esses exemplos para orientar uma viagem real. Não existe cobertura nacional ou verificação de postos reais.

## Decisão proposta para esta apresentação

Manter catálogo versionado e dados pessoais locais. Um banco remoto não aumenta a qualidade ou a quantidade de estações por si só. A demonstração não precisa de edição simultânea, contas compartilhadas ou atualização ao vivo. A manutenção local permite controlar procedência, funcionamento sem rede e restauração do cenário sem provisionamento.

Supabase passa a ser pertinente se houver uma fonte de dados real licenciada, edição compartilhada e sincronização entre dispositivos. Nesse caso, separar catálogo público, perfis, favoritos, avaliações e arquivos, com regras de acesso e procedência. Políticas RLS e autenticação seriam necessárias; chaves secretas nunca pertenceriam ao aplicativo. A integração React Native exige projeto e cliente/configuração próprios. Fontes: [guia Expo](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [chaves](https://supabase.com/docs/guides/getting-started/api-keys).

Persistência de sessão não equivale a sincronização de dados offline. Uma solução completa teria armazenamento local, fila, resolução de conflitos e controle de imagens; o catálogo de parceiros apresenta, por exemplo, uma integração específica para isso: [PowerSync](https://supabase.com/partners/catalog/powersync). Não foi adotada ou instalada.

## Ampliação futura

Ampliar por necessidade de demonstração: novo destino/corredor → identificar lacuna de alcance com reserva de 5% → inserir ponto explicitamente fictício → validar coordenadas/IDs/conectores/horários → conferir plano. Fotos continuam ilustrativas; não atribuir avaliações a novos pontos sem criar explicitamente um cenário de avaliação. Para dados reais, primeiro escolher fonte e licença, data de atualização e tratamento de indisponibilidade. Nenhuma fonte real foi importada.

## Estado

Investigação concluída; ampliação anterior reconferida. Recomendação técnica: não introduzir Supabase agora. Nenhuma dependência, infraestrutura, cobrança, chamada de API ou alteração no catálogo/planejador nesta rodada. Necessidades novas podem reabrir a avaliação.
