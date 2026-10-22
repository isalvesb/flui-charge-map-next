# Gama avançada — checkpoints locais

Base `44cfa06`, branch `local/desenvolvimento-isolado-2026-10-22`.
Nenhum push, merge, deploy, PR ou alteração em issues/Projects.

| Entrega | Resultado | Checkpoint |
| --- | --- | --- |
| 3.6 | Leitura ampliada, alvos de toque, modal com redução de movimento | `689003c` |
| 3.5 | Auto Experience ilustrativa em três formatos | `aa6854a` |
| 3.1 | Alternativas e proposta de piloto por voz; sem captura | `ee9d8bf` |
| 3.2 | Contexto atual da FluIA e atalhos internos por toque | `733c60e` |
| 3.3 | Trecho final explícito, tempo esclarecido e atalho para resumo | `726efff` |
| 3.10 | Laboratório comparativo, sem adoção automática no chat | commit deste checkpoint |

Relatórios por entrega: `gama-3.6-continuacao.md`, `gama-3.5.md`,
`gama-3.1-voz.md`, `gama-3.2-integracao.md`, `gama-3.3-viagens.md` e `gama-3.10-orb.md`.

Checkpoint final: TypeScript, lint sem erros (um aviso preexistente em conectividade),
136 testes e exportação web de 14 rotas aprovados. Matriz de 315 planos mantém todos
os resultados anteriores. Testes não foram repetidos por alterações apenas documentais.

Validação nativa é exclusivamente Expo Go 54.0.7, iPhone 17e, iOS 27.0.
Não equivale a aparelho físico, Android, Release, certificação de acessibilidade
ou homologação automotiva. Voz/reconhecimento não foram implementados nem testados.
Persistem testes humanos de texto extremo do sistema, acessibilidade motora assistiva,
medição energética/FPS e adoção visual das molduras/efeitos.

Evidências persistentes ignoradas pelo Git: `.validation/gama-avancada/`, incluindo
capturas antes/depois, relatórios de testes/exportação, matriz de planos e vídeo real.
`manifesto-final.json` registra os hashes completos dos commits e arquivos produzidos.

## Aprovações necessárias e retomada

- Voz: biblioteca/versão, development build, permissões, política de processamento
  e eventual nuvem/orçamento antes de qualquer captura.
- FluIA: novas intenções de escrita e critérios de favoritos, caso se queira ampliá-los.
- Viagens: dados de conectores/paradas, preferências de seleção e APIs reais antes
  de prometer compatibilidade ou navegação otimizada.
- Auto/Orb: escolha visual humana e avaliação física antes de adoção definitiva.
- Publicação: autorização expressa e procedimento de integração seletiva já preparado;
  não remover as proteções deste ambiente nem incorporar #99/#100 automaticamente.

Para retomar: conferir branch/estado Git e ler este arquivo; abrir Configurações →
Demonstrações locais. Servidor de revisão em localhost:8096 enquanto ativo; se
necessário iniciar nesta cópia com `EXPO_OFFLINE=1 npm start -- --localhost --port 8096`.
Nenhuma alteração de orientação global ou adaptação UIScene foi incluída.
