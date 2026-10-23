# Consolidação NEXT — candidata local validada

Base exata 77ea55a. Cópia independente flui-consolidado-next, branch local/consolidacao-next-20261022.

UX-PLN-01 incorporada por cherry-pick d7cce43; React #418 por 0085527 e a25565d. Sem conflitos. P1 transportada por comparação estrutural e substituição de apenas quatro nós do lockfile; sem pacotes adicionados/removidos, sem Skia/Reacticx e sem mudança em package.json.

Implementação integrada e verificações principais aprovadas: TypeScript, lint (um aviso herdado), 143 testes, cinco diagnósticos de protocolos, integridade de dependências e compatibilidade Expo. Auditoria atual: 41 pacotes sinalizados (1 crítico, 30 altos, 9 moderados, 1 baixo); não representa segurança integral.

Exportação web: 14 rotas. Matriz de 120 combinações aprovada; 16 cenários de hidratação aprovados; favorito, avaliação editada/persistida, busca/filtro, FluIA com recuperação, Plano B, navegação interna e cache offline do Chromium aprovados. Metro entregou bundle iOS, gzip íntegro e atualização HMR.

Execução real no simulador exclusivo iPhone 17e/iOS 27.0/Expo Go 54.0.7: avaliação persistida, viagem direta, três paradas com fontes ampliadas e viagem inviável com fontes ampliadas aprovadas. Indicadores legíveis e rolagem final verificada. Automação de favorito e FluIA encontrou interferência da camada Bottom Sheet do Expo; abordagem interrompida e limitação registrada. Não declarar esses fluxos aprovados nativamente.

Limitação herdada confirmada por comparação com 77ea55a: abrir ficha não grava viewed_station; salvar avaliação grava sent_review. Não corrigida, pois está fora das três correções autorizadas.

Fast Refresh visual aprovado no Chromium conectado ao Metro: texto A → B e contador 2 preservado. Isso não comprova Fast Refresh nativo. Rota e módulo temporários removidos; a exportação final tem somente as 14 rotas esperadas.

Conferência final: HEAD, branch, refs, configuração, estado Git e hashes dos arquivos rastreados dos seis ambientes originais permaneceram iguais. Servidores exclusivos 8130/8131 e simulador exclusivo encerrados. A porta 8106 não recebeu intervenção; já não havia listener na conferência inicial. Bloqueios de push permanecem ativos nesta candidata.

Parecer: APTA COM RESSALVAS para iniciar revisão humana controlada. Nenhuma regressão introduzida pela consolidação foi comprovada nos cenários concluídos. Favorito/FluIA/Fast Refresh nativos, Android, Release, aparelho físico e avaliação humana de acessibilidade permanecem sem comprovação. Não promover a candidata para o ambiente de apresentação sem autorização expressa.

Retomada: começar pelo relatório final e pelos resultados existentes, sem repetir instalação, matriz web ou os quatro cenários nativos aprovados se o código continuar igual. Antes de novo trabalho, obter o próximo objetivo humano. Para retomar automação nativa, reavaliar o menu do Expo/hit testing; não repetir os mesmos toques que falharam.

Evidências e marcos: output/consolidacao-next-20261022. Push bloqueado. Originais preservados. Sem integração posterior ou publicação autorizadas.
