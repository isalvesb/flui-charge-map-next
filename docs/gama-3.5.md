# Gama 3.5 — Auto Experience local

Primeira proposta acessível em Configurações → Demonstrações locais.
Três molduras vetoriais genéricas: horizontal 16:9, vertical 3:4 e panorâmica 24:9.
São proporções editoriais, não medidas certificadas de veículos.

Referências de estudo: [central do Tesla Model 3](https://www.tesla.com/ownersmanual/model3/en_eu/GUID-518C51C1-E9AC-4A68-AE12-07F4FF8C881E.html)
e [central vertical do Polestar 2](https://www.polestar.cn/dato-assets/11286/1676895700-specifications-ps2-ie-fleet.pdf).
A [página atual da Polestar](https://www.polestar.com/uk/polestar-2/technology/)
também apresenta a central. Não foram copiadas molduras, marcas ou telas proprietárias.
O formato panorâmico é um estudo livre, sem atribuição a modelo específico.

Reutiliza preferências, estação local e apresentação textual de funcionamento;
diagrama é explicitamente ilustrativo. Textos respeitam fontes/contraste existentes,
e a moldura aceita rolagem em vez de reduzir textos. A seleção tem estado acessível e ícone.
Não acessa GPS, microfone, telemetria ou comandos de veículos, nem inicia navegação.
A ação externa à moldura apenas abre o mapa já existente do aplicativo.

Verificações: TypeScript, lint sem erros (aviso herdado), 130 testes aprovados;
teste de proporções em larguras 280, 350, 768 e 1920. Device Hub / iPhone 17e / iOS 27.0 /
Expo Go: navegação até a área e seleção dos três formatos; capturas locais em
`.validation/gama-avancada/3.5-*.png`. Exportação integrada aprovada com 14 rotas;
carregamento e legibilidade da página Auto Experience observados também no navegador local.

Limites: a moldura representa uma proposta de estudo, sem homologação automotiva,
CarPlay ou Android Auto. Não testa uso ao dirigir, hardware real, desempenho em
centrais ou reprodução exata de telas de fabricantes. Adoção de molduras de marca
ou arte final mais realista depende de escolha visual humana; esta proposta permanece reversível.
