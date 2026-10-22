# Energy Orb — Reacticx

Fonte: https://github.com/rit3zh/reacticx/tree/4e11fcfe04e0bd7054574acc1557320911d70e4c/src/components/organisms/energy-orb

Documentação: https://www.reacticx.com/components/energy-orb

Copyright (c) 2026 rit3zh. Licença MIT integral preservada em `LICENSE`.
`conf.ts`, `helper.ts` e `types.ts` derivam dos arquivos correspondentes.
`EnergyOrbSkia.native.tsx` adapta o renderer de `index.tsx`.

Adaptações locais:

- Cores dos seis estados do Flui, intensidade 1,1–1,5 e dimensões compactas do mapa experimental.
- Tempo decorrido real em vez de incremento fixo por quadro; velocidade aplicada
  uma vez pelo shader. Intervalos limitados a 64 ms ao retomar.
- Uniforme de tempo atualizado com orçamento de 30 atualizações/s. Não é uma
  medição nem garantia de 30 FPS de renderização.
- Callback desativado com movimento reduzido, aviso/alerta ou tela inativa.
- Brilho mínimo na onda e alpha/canais limitados. Na revisão física UX-MAPA-01,
  o usuário pediu a retirada do disco escuro; Canvas e botão ficam transparentes.
- Adapter nativo com proteção a erro de importação/renderização. Web/SSR usa
  SVG explicitamente identificado, sem habilitar CanvasKit/CDN.

A implementação foi trazida da branch local
`local/experimento-orb-reacticx-20261022` no checkpoint `f23c69c`.
As evidências originais permanecem na cópia `flui-local-isolado`, em
`.validation/orb-reacticx-20261022/upstream/` e `upstream.json`.

Na experiência UX-MAPA-01, `MapEnergyOrb.native.tsx` adapta a apresentação
para o mapa e o cabeçalho conversacional; `OrbAssistantModal.tsx` faz a
transição de abertura. O motor conversacional existente foi preservado.
A incorporação é exclusiva da branch experimental; não altera a candidata
consolidada nem substitui sua instalação de referência.

Revisão física final UX-MAPA-01: Orb do mapa128pt, variante de paleta roxa
e alfa próprio; ciclo3,6s com transições smoothstep. Transparência uniforme
20%–40%, sem disco de fundo. Ícone FluiAiIcon original em
primeiro plano, sem nome. A variante conversacional mantém suas seis paletas.
