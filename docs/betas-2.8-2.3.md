# Betas 2.8 e 2.3 — entrega sequencial

Refs #91, #25, #26 e #27. Base: main `7335322`, em 20/10/2026. Branch: `beta/refinamentos-ux-energy-orb-2.8-2.3`.

Registro inicial de 20/10/2026: a PR #90 ainda era independente. As validações abaixo mantêm seus commits e datas originais. A integração posterior com a Beta 2.5 está registrada ao final; não houve merge da PR #94 na main nem início da Beta 2.7.

## Beta 2.8 — refinamentos

Referências: cinco capturas fornecidas em `Desktop/prints figma`, observadas diretamente. As anotações orientam os ajustes visuais; o escopo e as restrições são os da solicitação humana e da #91.

- Filtros rápidos sempre visíveis e roláveis, com estado selecionado acessível. Removidos os controles e animações de ocultação desses filtros.
- Acesso à FluIA com nome persistente, centralizado em retrato. Na tela compacta ocupa uma fileira própria, sem disputar espaço com zoom, centralização ou planejador. O painel reserva esse espaço.
- “Pontos de recarga” e “No catálogo” substituem os rótulos repetidos “Opções demonstrativas”. O aviso explícito de catálogo, disponibilidade e distâncias demonstrativos foi preservado.
- Feedback de carregamento com ícone acima do texto centralizado, respeitando redução de movimento.
- Ficha com capa menor, sem o grande bloco “Guia do ponto”; status, autonomia, potência, conectores e distância ganham prioridade. Estimativas e avisos continuam disponíveis abaixo. Removida a faixa redundante de horários sugeridos do exemplo, sem alterar os dados. Corrigido o recorte do status na linha de avaliações.
- Pesos tipográficos mais leves nos títulos da ficha, recomendações e critérios de avaliação.
- Modal de origem com escolhas explícitas: usar localização atual, continuar sem localização ou cancelar. Conteúdo rolável e botões que admitem texto ampliado. Confirmação de funcionamento e escolha do aplicativo externo preservadas.
- Recomendações com resumo e explicação completa expansível. CTA “Iniciar rota” encaminha à ficha com escolha de origem e confirmação, sem abrir navegação automaticamente. Respostas completas e conteúdo falado do motor permanecem iguais.

### Verificações da 2.8

- TypeScript e lint aprovados; **110/110 testes**. Novo teste comprova que o resumo mantém valores e ressalvas do motor sem modificar seu resultado. Teste de layout ajustado para o espaço reservado à FluIA.
- Exportação web: **12 rotas**. Navegador integrado, **320 × 568**: filtros, posições dos controles, chat, resumo/explicação e fechamento conferidos. O mapa web continua sendo a prévia existente.
- iOS Simulator: **iPhone 17e, iOS 27.0, 390 × 844 pt**, Expo Go SDK 54. Conferidos filtro rápido, recomendação, CTA, escolha sem GPS, confirmação Google/Waze, ficha e tipografia da avaliação.
- Dynamic Type `extra-extra-extra-large`: corrigido isolamento de acessibilidade do modal; foi necessário manter `accessibilityViewIsModal` no contêiner externo, pois no ScrollView os botões ficavam visualmente presentes, mas indisponíveis para toque. XCTest posterior percorreu o fluxo, fechamento/reabertura e controles sem interseção: **1 teste, 0 falhas**.
- A primeira execução bem-sucedida detectava existência do teclado, sem comprovar sua presença na área visível. Essa evidência não é usada para aprovar teclado virtual. A configuração do Device Hub foi ajustada e a verificação foi reforçada com geometria real. A conferência final desse ponto foi concluída após aguardar a estabilização do teclado e digitar caractere a caractere no roteiro de automação, sem alteração adicional no aplicativo: **1 teste nativo, 0 falhas**, teclado visível em y=560, CTA terminando em y≈406 e Enviar em y≈482. Botões acessíveis, envio, rolagem, fechamento sem teclado residual e reabertura aprovados. Capturas reais e roteiro em `validacao-2.8/`.

Os ensaios exploratórios que falharam são preservados em `output/betas-2.8-2.3-20261020`, separados dos resultados aprovados. O harness XCTest existente foi reutilizado em cópia isolada `/tmp/flui-ux28-native`; não foi instalada ferramenta adicional.

## Ponto de controle

Checkpoint da Beta 2.8 concluído em 20/10/2026: implementação, 110 testes, web e cenário iOS compacto/ampliado aprovados. A Beta 2.3 pode iniciar a partir deste marco, em commit separado.

A pausa solicitada para a 2.5 preservou integralmente o diff da 2.8 (comparação byte a byte). A rodada iOS da PR #90 foi inconclusiva por não haver corte de rede isolado verificável; o ambiente anterior foi restaurado. Parecer e logs locais em `output/beta-2.5-ios-20261020`.


## Beta 2.3 — Energy Orb

Implementada depois do checkpoint da 2.8, em commit separado. `EnergyOrb.tsx` usa SVG e Animated já disponíveis: gradiente, brilho, aro e raio da identidade Flui, sem WebGL, renderizador 3D, efeitos elétricos ou dependências novas. Uma progressão com driver nativo controla somente escala e rotação; não há atualização React por quadro.

`energyOrbPresentation.ts` cobre os seis estados existentes: Pronta, Escrevendo, Pensando, Respondendo, Aviso e Alerta. Cores e movimento reforçam o rótulo textual acessível; o desenho é decorativo e não duplica anúncios do leitor de tela. Na espera dos atalhos, o rótulo e a esfera passam a Pensando usando `isAnalyzing`, sem alterar motor, cálculos, conteúdo falado ou temporizadores. Aviso e Alerta são estáticos, sem piscadas. A redução de movimento e o fechamento interrompem o ciclo; o hook existente observa a preferência do sistema.

### Evidências da versão com Orb

- TypeScript, ESLint e **112/112 testes**, zero falhas. Dois casos novos verificam todos os estados, redução de movimento, suspensão ao fechar e limites de frequência/amplitude. Exportação final: **12 rotas**.
- iPhone 17e / iOS27.0 / Expo Go, 390×844 pt, fonte padrão: **3 casos XCTest dirigidos, cada um com 0 falhas**, executados na implementação com Orb. Primeiro: Pronta → Escrevendo → Pensando → Respondendo, Aviso, fechamento e reabertura, com teclado real verificado. Segundo: busca `zzorb` sem resultados e pedido de recarga produzem Alerta real; busca limpa ao terminar, sem alterar bateria ou fixtures. Terceiro: `UIAccessibility.isReduceMotionEnabled == true`, abertura e três capturas separadas por 1,1 segundo.
- Comparação das três capturas de redução: região da esfera x=55..199/y=390..534 na imagem 1170×2532, **zero canais diferentes** nas duas comparações. Script, capturas e log permitem reproduzir a conferência de esfera parada.
- Capturas completas dos seis estados em `validacao-2.3/`. `orb-estados-ios.mp4` é um trecho real de 29 segundos (183..212 s da gravação original), comprimido com AVFoundation para revisão, sem alterar eventos ou velocidade. A gravação original permanece em `output/betas-2.8-2.3-20261020/2.3-orb-ios.mov` no workspace.
- Exportação web final: abertura da FluIA, desenho da Orb, rótulo acessível e retorno ao mapa conferidos. Captura `orb-web.jpg`. Fluxos completos web/320×568 da 2.8 não foram repetidos.

### Limites e revisão

- A rodada completa de texto ampliado/teclado da 2.8 foi executada no commit `b5f15ee`, antes de adicionar a Orb. Os três casos da Orb usam fonte padrão; não representam nova certificação integral do fluxo ampliado após essa adição.
- Não foi medido FPS ou consumo de memória, nem validado aparelho físico/Android. O vídeo e os testes de interação no simulador comprovam a execução dirigida, sem substituir medições em dispositivos reais. Não há novas chamadas a serviços remotos.
- Não foram revalidados aplicativos externos instalados nem a integração offline da PR #90. A validação da 2.5 ficou inconclusiva por falta de desconexão real isolada; nenhum resultado antigo foi apresentado como nova evidência offline.
- Ao terminar, fonte original large, redução de movimento desativada e teclado físico simulado foram restaurados. Busca voltou vazia; veículo/bateria/origem preservados. Orientação global continua portrait.
- Beta 2.7 não iniciada. Issues/Projects intactos; revisão humana e merge continuam decisões da equipe.

## Integração com a Beta 2.5 — 21/10/2026

Main `23cc909` integrada na branch da PR #94 por merge normal. A ficha mantém o layout simplificado, o aviso de conexão e o erro visível no rodapé. O atalho de rota da FluIA agora compartilha a verificação de conexão antes de pedir GPS. TypeScript e exportação web aprovados (12 rotas); lint sem erros, com aviso herdado da main; **123/123 testes** aprovados. Roteiro nativo inicial parcialmente executado e retomada de teclado/Orb aprovada (1 teste, 0 falhas), com texto XXXL. Não houve desconexão nativa real comprovada. Resultados novos, falha inicial de automação, capturas e limites em [validacao-pr94-integracao/README.md](validacao-pr94-integracao/README.md).
