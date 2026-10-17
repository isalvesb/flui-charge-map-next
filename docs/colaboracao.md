# Colaboração no Flui NEXT

Convenções propostas para revisão da **isalvesb**, responsável pela Alfa 1.1 (#11). Este documento consolida o fluxo observado; não representa sua aprovação nem cria novas etapas obrigatórias.

## Branches

- `main` reúne integrações revisadas. Trabalhar em branch própria; não enviar commits diretamente à main.
- Para trabalho da Alfa, usar `alfa/<assunto-curto>`; exemplos existentes: `alfa/auditoria-tecnica-1.2` e `alfa/dados-demonstrativos-1.3`.
- Manter os nomes existentes e usar o escopo correspondente para outros trabalhos já autorizados, como `feature/fluia-chat` e `beta/dados-simulados-2.1`. O nome não autoriza iniciar uma tarefa do backlog.
- Antes de mudar de branch, conferir o estado local e preservar alterações de outras pessoas. Não reescrever o histórico compartilhado.

## Commits

Escrever assunto curto, com verbo e mudança concreta: `documenta convenções da equipe` ou `corrige aviso de recarga ao fechar`. Prefixos já usados, como `docs:` e `fix:`, são aceitos; Conventional Commits não é requisito novo. Agrupar apenas mudanças relacionadas e evitar arquivos gerados, credenciais e dependências sem justificativa.

## Pull requests e revisão

1. Abrir PR da branch de trabalho para `main`, inicialmente em rascunho enquanto houver preparo ou validação pendente.
2. Usar título com escopo e resultado. Descrever problema, mudanças, Issues relacionadas, verificações executadas e limitações. Distinguir teste local, CI, interface web e observação nativa; uma não comprova automaticamente a outra.
3. Executar `npm run check` nas mudanças de código e as verificações proporcionais ao impacto. Reutilizar evidências anteriores com seu commit; repetir somente o que mudou ou ficou sem comprovação. A workflow Quality existente verifica tipos, lint, testes e exportação web.
4. Encaminhar à responsável pelo trabalho. Na Alfa 1.1, a revisão/aprovação é da isalvesb. Conflitos, falhas de CI e limitações relevantes devem estar explícitos antes da decisão de integração.
5. O responsável humano decide aprovação e merge; não presumir aprovação por uma PR aberta ou testes aprovados. Preservar a estratégia de merge utilizada pela equipe, sem impor outra.

## Acompanhamento e evidências

Referenciar Issues com `Refs #numero` enquanto existirem pendências. Usar fechamento automático somente quando o critério inteiro estiver comprovado e aprovado, quando aplicável. Subtarefas e tarefas principais têm estados independentes: não fechar a principal enquanto faltar alguma entrega.

Registrar em `docs/` resultados relevantes, dispositivo/plataforma, versão testada, valores observados, capturas e impedimentos. Manter claro quando uma captura é histórica. Evitar copiar resultados nativos volumosos para o Git; publicar as capturas e logs úteis e indicar onde o resultado completo foi preservado.

Não instalar ferramentas pesadas sem autorização. Após duas tentativas sem progresso verificável, interromper o cenário, registrar o diagnóstico e reavaliar a abordagem. Não transformar validações da Alfa em implementação da Beta/Gama.
