# Gama 3.6.1 — alto contraste local

Implementação local em 22/10/2026, sobre `94c862e`, na branch
`local/desenvolvimento-isolado-2026-10-22`. Escopo: primeira melhoria de contraste
da issue #70 / LDT v2.3; não representa conclusão de toda a acessibilidade visual.

## Implementação

- Perfil → Configurações → Acessibilidade → Alto contraste.
- Controle com papel acessível `switch`, estado `checked` e identificação textual
  “Ativado” / “Desativado”. Bloqueado enquanto carrega ou salva; falha permite tentar novamente.
- Preferência booleana independente de claro/escuro e tamanho da fonte, salva na
  chave de preferências já existente. Dados antigos ou valores inválidos assumem `false`.
- Duas paletas de contraste usam os mesmos tokens e contexto; desativar restaura
  o tema escolhido. Sem novas dependências ou sistema paralelo de temas.
- Superfícies próprias da FluIA respeitam a paleta quando o modo está ativo;
  motor, estados, voz e Orb não foram alterados.
- Fundo fixo do aviso de erro de conexão da ficha substituído por `warningLight`,
  evitando texto claro sobre amarelo claro no tema escuro. Sem mudar bloqueios de rota.
- Estados textuais de funcionamento, alcance e dados demonstrativos preservados.

Arquivos: `src/types/storage.ts`, `src/storage/fluiStorage.ts`,
`src/context/PreferencesContext.tsx`, `src/theme/appTheme.ts`,
`src/features/settings/SettingsScreen.tsx`,
`src/features/assistant/FluiAssistantSheet.tsx`,
`src/features/stations/PointDetailsScreen.styles.ts` e `tests/highContrast.test.ts`.

## Verificação automatizada

- `npm run check`: TypeScript aprovado, lint com zero erros e **128 testes aprovados**.
- Um aviso herdado em `ConnectivityContext.tsx:48` (`react-hooks/exhaustive-deps`),
  também presente no código-base; arquivo preservado.
- Cinco testes novos: seleção/restauração das paletas; contraste numérico;
  migração de preferências; persistência sem alterar outros dados; falha de escrita.
- Testes de armazenamento usam a implementação real do Flui, substituindo apenas
  a ponte AsyncStorage por memória; não equivalem a persistência em dispositivo físico.
- Pares de tokens verificados: textos ≥ 7:1 e contornos ≥ 3:1. Mínimo observado
  para texto: claro 7,37:1 / escuro 10,96:1. Não é certificação de todas as telas.

## Conferência nativa executada

Device Hub, iPhone 17e, iOS 27.0, Expo Go 54.0.7, captura 1170 × 2532
(390 × 844 pontos). Bundle servido exclusivamente da cópia isolada em localhost.

| Cenário | Resultado observado |
| --- | --- |
| Ativar no claro, trocar para escuro e desativar | Controle alterna 0/1; tema escolhido é preservado |
| Alto contraste escuro com fonte maior | Texto, contornos e seleção legíveis em Configurações |
| Fechar Expo Go e reabrir o projeto | Alto contraste ativo, escuro e fonte maior permanecem selecionados |
| Mapa e filtros | Controles legíveis; CCS2 indica seleção e aplica o filtro |
| Ficha e confirmação de rota | Estado, aviso demonstrativo e ações legíveis; cancelamento funciona |
| FluIA | Abre/fecha, mostra estado textual e Orb; sugestão e mensagem digitada recebem resposta |
| Planejador | Abre/retorna; controles e avisos consultados, sem iniciar navegação externa |

Veículo BYD Dolphin Plus, autonomia 400 km, origem FIAP e bateria demonstrativa
70% permaneceram visíveis. Ficha/recomendação: Higienópolis Prime Charge,
≈2,1 km, chegada ≈69%, 150 kW. Nenhum cálculo foi alterado.

## Evidências e limites

Evidências persistentes e ignoradas pelo Git: `.validation/gama-3.6.1/` nesta cópia.
Há 12 PNGs reais, `check-final.log`, `testes-direcionados.log`,
`contraste-tokens.json`, logs Metro e manifesto com versão/arquivos.
Capturas 01–08 precedem apenas a troca final do token de fundo do aviso de erro;
09–12 foram obtidas após reiniciar o Metro com esse ajuste. O erro de conexão
não foi acionado nativamente nesta rodada; sua combinação de tokens foi testada.

- Expo Go não comprova Release, iPhone físico, Android ou compatibilidade oficial com iOS 27.
- Não houve auditoria completa de VoiceOver, daltonismo ou maior texto do sistema.
  A fonte maior testada foi a preferência existente do Flui.
- Mapa de terceiros, fotografias, teclado e ilustrações decorativas não recebem
  conversão integral de cores. Estados essenciais continuam identificados por texto.
- O layout existente do planejador usa reticências em alguns rótulos com fonte maior;
  não foi reformulado nesta melhoria de contraste.
- Sem nova validação de desconexão real, abertura de Google Maps/Waze ou todos os
  estados da Orb. Essas funcionalidades não foram anunciadas como revalidadas.
- PRs #99/#100 não incorporadas. Nenhum push, integração remota ou alteração no GitHub.
  Proteções de publicação da cópia independente permanecem habilitadas.
