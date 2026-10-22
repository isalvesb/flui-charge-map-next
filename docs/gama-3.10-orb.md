# Gama 3.10 — laboratório da Orb

Protótipo isolado em Configurações → Demonstrações locais → Laboratório da Energy Orb.
A Orb utilizada no chat, os seis estados, motor e síntese não foram substituídos.

Comparação lado a lado da Orb atual com um componente que a reutiliza e acrescenta
halos/arcos SVG discretos. Um valor Animated controla opacidade e escala do efeito;
sem texturas grandes, blur, partículas, renderizador 3D ou dependências novas.
Referência: [Animated e driver nativo](https://reactnative.dev/docs/animated#using-the-native-driver).
É uma escolha de implementação, não uma medição de desempenho.

- Reutiliza as cores e durações dos estados existentes. Aviso/alerta permanecem estáticos.
- Efeitos adicionais somem com redução de movimento; a opção nativa sempre prevalece.
- “Prévia estática” é somente um teste do laboratório, sem gravar outra preferência global.
- Perda de foco ou segundo plano interrompe os ciclos do laboratório.
- Estado é identificado por texto; a decoração não duplica conteúdo para leitor de tela.

Validações: TypeScript e lint sem erros (um aviso herdado), 136 testes no checkpoint
integrado, incluindo dois testes novos sobre seis estados, redução de movimento e
inatividade. Exportação web aprovada com 14 rotas. No Device Hub/iPhone 17e/iOS 27.0/
Expo Go foram acionados Pronta, Escrevendo, Pensando, Respondendo, Aviso e Alerta,
além da prévia estática em Pensando.

Evidências em `.validation/gama-avancada/`: `3.10-orb-pensando.png`,
`3.10-orb-estatica.png` e vídeo real `3.10-orb-comparacao.mp4` (11,46 s, sem áudio).
Gravação terminou com sucesso e estrutura MP4/duração foram verificadas.

Limites: observação visual curta, sem medição de FPS, consumo energético, GPU,
memória ou ensaio físico/Android/Release. O driver nativo evita atualizações JS por
quadro para os atributos animados, mas há mais trabalho de composição e um ciclo
adicional. A comparação renderiza duas Orbs; não é benchmark equivalente ao chat.
A preferência nativa é respeitada por código e testes de contrato; a opção estática
do laboratório não comprova uma mudança nas configurações globais do iOS.

Próximo passo: avaliação humana da utilidade/estética. Somente depois, medir em
aparelho físico e decidir se vale adotar os efeitos. Não há ativação automática no chat.
