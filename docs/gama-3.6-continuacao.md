# Gama 3.6 — continuação local

Base preservada: `44cfa06`, alto contraste. Nenhuma nova preferência duplicada.

- Planejador: rótulos de autonomia, bateria, rota e rodapé sem limite de uma linha.
  Blocos empilhados conforme largura efetiva, considerando fontes do app e do sistema.
- Conteúdo reserva a altura real do rodapé, inclusive quando o aviso ocupa várias linhas.
- Edição de destino, opções e cancelamento com alvos de ao menos 48 pontos;
  botão principal aceita texto em várias linhas e espaçamento vertical.
- Modal de seletores usa animação nula quando a preferência nativa de redução
  de movimento está ativa. Preferências do sistema não foram substituídas por controles locais.
- Alto contraste continua independente do tamanho de texto; estados conservam
  rótulos e ícones. Não foi aplicada uma transformação única de cores para todas
  as formas de daltonismo nem introduzida fonte anunciada como solução para dislexia.

Referências: [React Native AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
e [W3C: uso da cor](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
Essas referências orientam escolhas; não representam certificação do aplicativo.

Validação automatizada: TypeScript, lint sem erros (um aviso herdado de conectividade),
129 testes aprovados. Novo teste cobre largura compacta, fonte do app e ampliação do sistema.
Registros e capturas em `.validation/gama-avancada/`.

Limites: sem ensaio com usuários com deficiência, Voice Control/Switch Control,
Android, aparelho físico ou Release. O teste numérico de fonte do sistema não
equivale a uma validação visual de todas as categorias máximas do iOS.

Conferência iOS: iPhone 17e / iOS 27.0 / Expo Go 54.0.7, alto contraste e fonte maior. As capturas antes/depois comprovam os rótulos de autonomia e bateria completos. A árvore acessível contém título e subtítulo completos. A rolagem automatizada do Device Hub não permitiu enquadrar o resumo; após tentativas sem progresso, essa abordagem foi interrompida. A inspeção visual do resumo e dos tamanhos extremos do sistema permanece pendente.

Atualização no checkpoint 3.3: o atalho acessível para os trechos permitiu conferir
também o resumo no iOS, sem reticências no título/subtítulo, com edição em linha
própria e avisos desobstruídos. Evidência `3.3-trecho-final-e-resumo.png`.
Permanece pendente a conferência visual dos tamanhos extremos de texto do sistema.
