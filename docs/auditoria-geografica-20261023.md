# Auditoria geográfica do catálogo Flui — 23/10/2026

## Resultado

Foram cruzados os **80 pontos** com limites municipais do IBGE. **79 estão dentro do município informado**; Búzios está fora da malha consultada, a aproximadamente 268 m da borda terrestre mais próxima. Foram também cruzados os **27 pontos da capital paulista** com os 96 distritos do GeoSampa e os **quatro pontos da capital fluminense** com os 167 bairros publicados pelo município.

Isso verifica posição administrativa, não garante que o nome de um bairro informal, número de rua ou entrada de estacionamento esteja correto. Não existe certificação de um posto de recarga real. Dados do cenário e fotos continuam ilustrativos.

**Nomes recentes:** Villa-Lobos está dentro do polígono do parque; Leopoldina está dentro do distrito Vila Leopoldina. Arca está nesse mesmo distrito e próxima da Av. Manuel Bandeira, mas seu endereço cadastrado não corresponde ao publicado pelo espaço. O prédio/lote exato não foi certificado.

**Problema de formação dos dados:** os 68 pontos adicionais receberam endereços gerados ciclicamente e o campo bairro reutiliza o nome local, muitas vezes a cidade. A estrutura completa da ficha e os testes de integridade não haviam feito validação cartográfica. Todos esses endereços/bairros permanecem pendentes de correspondência com a posição, mesmo quando o município está correto.

## Achados prioritários e propostas (ainda não aplicadas)

| Prioridade | Ponto | Evidência | Encaminhamento |
|---|---|---|---|
| P1 | Flui Búzios + origem Búzios | Fora da malha terrestre do IBGE, ≈268 m da borda | Escolher posição em terra e acesso viário; conferir nome/endereço juntos antes de mover. |
| P2 | Flui Politécnica | Vila Leopoldina; ≈2,79 km da Av. Escola Politécnica | Preservando o entorno NEXT: preferir nome local, por exemplo Flui Leopoldina Norte. Se o nome for obrigatório, escolher uma referência precisa na Politécnica. |
| P2 | Flui Corifeu | Jaguaré; ≈973 m da Av. Corifeu de Azevedo Marques | Nome local como Flui Jaguaré ou posição/endereço coerentes com a avenida. |
| P2 | Flui Rio Pequeno | Dentro do distrito Jaguaré, fora de Rio Pequeno | Nome local como Flui Jaguaré Oeste, preservando o reforço próximo ao NEXT; ou nova posição no distrito Rio Pequeno. |
| P2 | Flui Rio Centro + origem Centro | Bairro oficial Lapa | Usar Lapa, ou mover a referência para o bairro Centro. Não confundir com o centro de eventos Riocentro. |
| P2 | Flui Arca | Cadastro: Avenida das Palmeiras, 720; referência oficial: Av. Manuel Bandeira, 360 | Alinhar endereço/bairro com a referência do espaço e conferir o lote/entrada, sem inventar uma recarga real ali. |
| P2 | Flui Pamplona | ≈436 m do eixo da Rua Pamplona | Conferir o endereço/posição ou usar nome regional. |
| P2 | Higienópolis, Consolação e Jardins | Marcadores a ≈231/317/190 m das vias citadas no endereço | Revisar coordenada e endereço. O nome regional pode estar correto; distância da via não prova bairro incorreto. |
| P2 | Vila Lageado, Vila Universitária, Campus Oeste e cadastro Brigadeiro | Bairro informal/referência não delimitados ou cadastro diferente do distrito encontrado | Não certificar só por semelhança do nome. Identificar a referência local antes de escolher outro nome/posição. |

A recomendação para o entorno NEXT é **corrigir nomes e endereços para a região atual sempre que possível**, evitando mover os oito pontos para longe e desfazer a cobertura solicitada. Nomes explicitamente escolhidos pelo usuário, como Arca/Villa-Lobos/Leopoldina, foram preservados. Não houve mudança de coordenadas nesta auditoria.

## Método e fontes

- Coordenadas interpretadas como longitude/latitude em EPSG:4326; leitura do catálogo local após o checkpoint de nomes `f8cbdd8`. Comentários exclusivos da Arca estão no commit `7e734ad` e não alteram a geometria auditada.
- Ponto em polígono com anéis externos e furos; caixas envolventes limitam o cruzamento. Casos sintéticos de dentro/fora/furo conferidos. Nenhuma coordenada duplicada ou ID duplicado foi usada para eliminar pontos da análise.
- Distâncias a vias e bordas: menor distância local ao segmento, aproximação equiretangular em quilômetros; são medidas cartográficas aproximadas, não distância de trajeto. Não são geocodificação de número predial ou prova de acesso a pé/carro.
- [IBGE, documentação de malhas v3](https://servicodados.ibge.gov.br/api/docs/malhas?versao=3): malhas simplificadas em qualidade máxima, municípios SP/RJ e nomes pela API de Localidades. Perto da costa/limites, exigir conferência mais detalhada antes de corrigir posição.
- [GeoSampa, portal de dados da Prefeitura de São Paulo](https://download.geosampa.prefeitura.sp.gov.br/PaginasPublicas/_SBC.aspx): WFS distrito_municipal, parques/unidades de conservação e segmentos de logradouro. [Documentação municipal de acesso aos geosserviços](https://download.geosampa.prefeitura.sp.gov.br/PaginasPublicas/downloadArquivo.aspx?arq=tutorial_mapa.pdf&arqTipo=TUTORIAL&orig=DownloadTutorial). O arquivo de distritos consultado inclui atualização em 2026.
- [Prefeitura do Rio, limites administrativos / bairros](https://pgeo3.rio.rj.gov.br/arcgis/rest/services/Cartografia/Limites_administrativos/FeatureServer/4): polígonos exportados em EPSG:4326, sem limite de feições atingido.
- [Villa-Lobos, acessos oficiais](https://parquevillalobos.com.br/como-chegar/), [ARCA, endereço e localização](https://www.arcaspaces.com/aboutarca), [FIAP NEXT, local do evento](https://experience.fiap.com.br/next), [MASP, visita](https://masp.org.br/visite).
- [Referência municipal a Vila Lageado na Corifeu](https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/acesso_a_informacao/index.php?p=299147); não é uma delimitação cartográfica do bairro e não foi usada como prova automática de que todo outro ponto está fora dele.

Arquivos brutos, URLs, SHA-256 e scripts reproduzíveis em `../output/auditoria-geografica-20261023/`: fontes*.json, geometrias, catálogo-inicial.json, resultado-geometrico.json, resultado-vias.json e resultado-origens.json. Os arquivos externos não foram incorporados ao aplicativo ou ao bundle. A [planilha CSV](auditoria-geografica-20261023.csv) contém os 80 registros e coordenadas.

## Matriz dos 80 pontos

Compatível município/distrito é um resultado limitado ao nível conferido. Um bairro informal pode atravessar distritos; por isso Vila Olímpia/Itaim Bibi, Higienópolis/Consolação ou Paraíso/Liberdade não foram marcados automaticamente como erros só pela diferença de nomes.

| ID | Nome | Latitude, longitude | Município encontrado | Distrito SP / bairro Rio | Resultado |
|---|---|---|---|---|---|
| station-01 | Flui Higienópolis | -23.5472, -46.6618 | São Paulo | CONSOLACAO | Revisar endereço |
| station-02 | Flui MASP | -23.5616, -46.6554 | São Paulo | BELA VISTA | Referência aproximada compatível |
| station-03 | Flui Consolação | -23.5559, -46.6584 | São Paulo | CONSOLACAO | Revisar endereço |
| station-04 | Flui Jardins | -23.5597, -46.6631 | São Paulo | JARDIM PAULISTA | Revisar endereço |
| station-05 | Flui Pamplona | -23.5685, -46.6527 | São Paulo | JARDIM PAULISTA | Revisar referência |
| station-06 | Flui Lins de Vasconcelos | -23.5738, -46.6237 | São Paulo | CAMBUCI | Região compatível; precisão pendente |
| station-07 | Flui Parque Aclimação | -23.5732, -46.6288 | São Paulo | LIBERDADE | Nome compatível com polígono |
| station-08 | Flui Paraíso | -23.5721, -46.6394 | São Paulo | LIBERDADE | Bairro informal a conferir |
| station-09 | Flui Cambuci | -23.5686, -46.6179 | São Paulo | CAMBUCI | Distrito compatível |
| station-10 | Flui Liberdade | -23.5619, -46.6355 | São Paulo | LIBERDADE | Distrito compatível |
| station-11 | Flui Ana Rosa | -23.5818, -46.6383 | São Paulo | VILA MARIANA | Referência pontual a conferir |
| station-12 | Flui Brigadeiro | -23.5727, -46.6481 | São Paulo | VILA MARIANA | Revisar cadastro local |
| next-butanta | Flui Villa-Lobos | -23.542, -46.728 | São Paulo | ALTO DE PINHEIROS | Nome compatível com polígono |
| next-vila-sonia | Flui Vila Sônia | -23.592, -46.737 | São Paulo | VILA SONIA | Distrito compatível |
| next-pinheiros | Flui Pinheiros | -23.566, -46.696 | São Paulo | PINHEIROS | Distrito compatível |
| next-alto-pinheiros | Flui Alto de Pinheiros | -23.548, -46.71 | São Paulo | ALTO DE PINHEIROS | Distrito compatível |
| next-osasco | Flui Osasco | -23.532, -46.792 | Osasco | — | Município compatível |
| next-alphaville | Flui Alphaville | -23.497, -46.849 | Barueri | — | Município compatível |
| next-taboao | Flui Taboão da Serra | -23.613, -46.768 | Taboão da Serra | — | Município compatível |
| next-cotia | Flui Cotia | -23.603, -46.919 | Cotia | — | Município compatível |
| next-carapicuiba | Flui Carapicuíba | -23.522, -46.835 | Carapicuíba | — | Município compatível |
| next-mogi | Flui Mogi das Cruzes | -23.523, -46.188 | Mogi das Cruzes | — | Município compatível |
| next-aruja | Flui Arujá | -23.397, -46.32 | Arujá | — | Município compatível |
| next-guarulhos | Flui Guarulhos | -23.455, -46.534 | Guarulhos | — | Município compatível |
| next-jundiai | Flui Jundiaí | -23.185, -46.895 | Jundiaí | — | Município compatível |
| next-campinas | Flui Campinas | -22.908, -47.062 | Campinas | — | Município compatível |
| next-americana | Flui Americana | -22.738, -47.333 | Americana | — | Município compatível |
| next-limeira | Flui Limeira | -22.565, -47.4 | Limeira | — | Município compatível |
| next-sao-carlos | Flui São Carlos | -22.017, -47.891 | São Carlos | — | Município compatível |
| next-ribeirao | Flui Ribeirão Preto | -21.177, -47.811 | Ribeirão Preto | — | Município compatível |
| next-atibaia | Flui Atibaia | -23.117, -46.553 | Atibaia | — | Município compatível |
| next-braganca | Flui Bragança Paulista | -22.951, -46.541 | Bragança Paulista | — | Município compatível |
| next-jacarei | Flui Jacareí | -23.305, -45.966 | Jacareí | — | Município compatível |
| next-sao-jose-campos | Flui São José dos Campos | -23.185, -45.884 | São José dos Campos | — | Município compatível |
| next-cacapava | Flui Caçapava | -23.101, -45.707 | Caçapava | — | Município compatível |
| next-taubate | Flui Taubaté | -23.026, -45.556 | Taubaté | — | Município compatível |
| next-pinda | Flui Pindamonhangaba | -22.924, -45.462 | Pindamonhangaba | — | Município compatível |
| next-guaratingueta | Flui Guaratinguetá | -22.809, -45.193 | Guaratinguetá | — | Município compatível |
| next-lorena | Flui Lorena | -22.732, -45.126 | Lorena | — | Município compatível |
| next-cruzeiro | Flui Cruzeiro | -22.577, -44.962 | Cruzeiro | — | Município compatível |
| next-queluz | Flui Queluz | -22.537, -44.775 | Queluz | — | Município compatível |
| next-itatiaia | Flui Itatiaia | -22.488, -44.566 | Itatiaia | — | Município compatível |
| next-resende | Flui Resende | -22.469, -44.451 | Resende | — | Município compatível |
| next-barra-mansa | Flui Barra Mansa | -22.544, -44.172 | Barra Mansa | — | Município compatível |
| next-volta-redonda | Flui Volta Redonda | -22.523, -44.104 | Volta Redonda | — | Município compatível |
| next-pirai | Flui Piraí | -22.629, -43.901 | Piraí | — | Município compatível |
| next-seropedica | Flui Seropédica | -22.747, -43.708 | Seropédica | — | Município compatível |
| next-itaguai | Flui Itaguaí | -22.863, -43.776 | Itaguaí | — | Município compatível |
| next-rio-centro | Flui Rio Centro | -22.911, -43.185 | Rio de Janeiro | Lapa | Revisar referência |
| next-rio-barra | Flui Barra da Tijuca | -23.003, -43.365 | Rio de Janeiro | Barra da Tijuca | Bairro compatível |
| next-santos | Flui Santos | -23.96, -46.333 | Santos | — | Município compatível |
| next-guaruja | Flui Guarujá | -23.993, -46.255 | Guarujá | — | Município compatível |
| next-bertioga | Flui Bertioga | -23.854, -46.139 | Bertioga | — | Município compatível |
| next-sao-sebastiao | Flui São Sebastião | -23.798, -45.414 | São Sebastião | — | Município compatível |
| next-caraguatatuba | Flui Caraguatatuba | -23.622, -45.412 | Caraguatatuba | — | Município compatível |
| next-ubatuba | Flui Ubatuba | -23.434, -45.074 | Ubatuba | — | Município compatível |
| next-paraty | Flui Paraty | -23.218, -44.714 | Paraty | — | Município compatível |
| next-angra | Flui Angra dos Reis | -23.006, -44.318 | Angra dos Reis | — | Município compatível |
| next-mangaratiba | Flui Mangaratiba | -22.96, -44.04 | Mangaratiba | — | Município compatível |
| next-niteroi | Flui Niterói | -22.883, -43.104 | Niterói | — | Município compatível |
| next-marica | Flui Maricá | -22.919, -42.819 | Maricá | — | Município compatível |
| next-saquarema | Flui Saquarema | -22.932, -42.51 | Saquarema | — | Município compatível |
| next-araruama | Flui Araruama | -22.873, -42.343 | Araruama | — | Município compatível |
| next-cabo-frio | Flui Cabo Frio | -22.879, -42.019 | Cabo Frio | — | Município compatível |
| next-arraial | Flui Arraial do Cabo | -22.969, -42.027 | Arraial do Cabo | — | Município compatível |
| next-buzios | Flui Búzios | -22.752, -41.887 | Fora da malha | — | Revisar coordenada — P1 |
| next-moema | Flui Moema | -23.602, -46.664 | São Paulo | MOEMA | Distrito compatível |
| next-vila-olimpia | Flui Vila Olímpia | -23.595, -46.683 | São Paulo | ITAIM BIBI | Bairro compatível; limite informal |
| next-santo-amaro | Flui Santo Amaro | -23.651, -46.708 | São Paulo | SANTO AMARO | Distrito compatível |
| next-copacabana | Flui Copacabana | -22.972, -43.186 | Rio de Janeiro | Copacabana | Bairro compatível |
| next-tijuca | Flui Tijuca | -22.924, -43.233 | Rio de Janeiro | Tijuca | Bairro compatível |
| next-petropolis | Flui Petrópolis | -22.505, -43.179 | Petrópolis | — | Município compatível |
| next-acesso-next | Flui Arca | -23.5416, -46.733 | São Paulo | VILA LEOPOLDINA | Região compatível; endereço divergente |
| next-vila-lageado | Flui Vila Lageado | -23.5338, -46.7389 | São Paulo | VILA LEOPOLDINA | Revisar localidade |
| next-campus-oeste | Flui Campus Oeste | -23.5481, -46.7318 | São Paulo | JAGUARE | Referência indefinida |
| next-jaguare | Flui Leopoldina | -23.5358, -46.7281 | São Paulo | VILA LEOPOLDINA | Distrito compatível |
| next-corifeu | Flui Corifeu | -23.5521, -46.741 | São Paulo | JAGUARE | Revisar referência |
| next-rio-pequeno | Flui Rio Pequeno | -23.5488, -46.7511 | São Paulo | JAGUARE | Revisar referência |
| next-politecnica | Flui Politécnica | -23.5271, -46.7461 | São Paulo | VILA LEOPOLDINA | Revisar referência |
| next-vila-universitaria | Flui Vila Universitária | -23.5421, -46.7485 | São Paulo | JAGUARE | Localidade não confirmada |

## Localizações iniciais

As mesmas inconsistências se propagam aos cenários que reutilizam a coordenada. NEXT permanece no topo; esta auditoria não alterou a origem salva, a ordem ou o zoom.

| Opção | Município encontrado | Distrito / bairro | Conferência |
|---|---|---|---|
| NEXT | São Paulo | VILA LEOPOLDINA | Vila Leopoldina; prédio/entrada exatos não certificados |
| FIAP | São Paulo | BELA VISTA | Compatível ao nível administrativo |
| Paulista | São Paulo | BELA VISTA | Compatível ao nível administrativo |
| Vila Mariana | São Paulo | CAMBUCI | Distrito Cambuci; esclarecer se o rótulo designa campus/região ou distrito |
| Campinas | Campinas | — | Compatível ao nível administrativo |
| Santos | Santos | — | Compatível ao nível administrativo |
| São José dos Campos | São José dos Campos | — | Compatível ao nível administrativo |
| Paraty | Paraty | — | Compatível ao nível administrativo |
| Rio de Janeiro — Centro | Rio de Janeiro | Lapa | Revisar: bairro Lapa, não Centro |
| Rio de Janeiro — Barra | Rio de Janeiro | Barra da Tijuca | Compatível ao nível administrativo |
| Cabo Frio | Cabo Frio | — | Compatível ao nível administrativo |
| Búzios | Fora da malha | — | Revisar: fora da malha terrestre, mesmo ponto de Búzios |

## Limites e estado recuperável

Auditoria concluída no nível municipal para todos os 80 pontos, nos distritos da capital paulista e bairros da capital fluminense, com verificações específicas de parques e 11 referências de vias. Não equivale a checar os 80 endereços prediais, acessos, estacionamentos ou estações reais. Áreas informais e campos gerados continuam explicitamente pendentes.

Nenhuma coordenada, nome adicional, endereço ou filtro do produto foi alterado por esta auditoria. Não repetida a suíte do app por produção de relatório; cálculos cartográficos, contagens e arquivos de fonte conferidos. Sem serviço contratado, chave usada, dependência/SDK, instalação, publicação ou mudança na consolidação. Próximas correções podem partir das propostas acima, preservando IDs e registros pessoais.
