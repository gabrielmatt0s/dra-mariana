# assets.md

## Regra de proveniência
Prioridade solicitada: EPS vetorial > PSD vetorial > PNG rastreado. A auditoria mostrou que os EPS são exports do Adobe Photoshop com `ImageData`, ou seja, raster encapsulado. Os PSDs exibem múltiplas camadas raster no parser disponível, mas não forneceram uma fonte vetorial confirmável. Assim, os SVGs entregues usam rastreamento dos PNGs transparentes de 2048 px.

Todos os arquivos de origem (PNG, EPS, PSD, PDF) citados abaixo estão em `_originais/`. Os SVGs usados pelo site estão em `site/assets/logo/` (5 arquivos: favicon, favicon-32, apple-touch-icon, logo horizontal do header e logo horizontal clara do rodapé). Os demais SVGs preparados (versões principal, símbolo, selo, escala de cinza, negativa e positiva) não são usados pelo site e ficam em `_originais/logos-nao-usadas/`, fora do git e da publicação.

**Exceção à regra de "não alterar cores" do `CLAUDE.md`:** em 2026-10-05, a cor do nome/monograma em `logo-horizontal-header.svg` e `logo-horizontal-original-claro.svg` foi trocada de grafite/off-white para dourado da paleta (`--color-brand-bronze` e `--color-brand-sand`), a pedido da própria cliente (repassado pelo Gabriel). A regra do `CLAUDE.md` existe para impedir alteração de cor sem aprovação da cliente; aqui a alteração partiu dela, então a exceção é registrada, não a regra revogada. Favicon, favicon-32 e apple-touch-icon **não** foram alterados (não fizeram parte do pedido) e continuam `#414042`/`#ffffff`. O `og-image.jpg` também não foi regenerado: é um JPG estático com o logo antigo (grafite) já composto na imagem, não deriva do SVG em tempo real.

| Asset final | Origem | Método | Status | Observação |
|---|---|---|---|---|
| `_originais/logos-nao-usadas/logo-principal.svg` | `logotipo-mariana-zunino.png` | rastreamento por contornos/cor | APROXIMADO | composição e cores dominantes preservadas; AA/curvas finas podem variar |
| `_originais/logos-nao-usadas/logo-simbolo.svg` | símbolo recortado do PNG principal | rastreamento | APROXIMADO | usar em favicon/avatar; recorte técnico do símbolo |
| `site/assets/logo/favicon.svg` | `logo-simbolo.svg` (símbolo "Mz" completo, 3 paths) | **adaptação para ícone**: fundo transparente, viewBox quadrado com o símbolo na largura total (mais meia espessura de traço) e centralizado na vertical. Cor `#414042` por padrão e `#ffffff` com `prefers-color-scheme: dark`, dentro do SVG (`<style>` com classe `.mz`, a pedido do Gabriel em 27/09/2026, para não sumir na aba escura). Traço de 40 unidades do viewBox (0,4 px a 16 px, 0,8 px a 32 px), mesma cor do fill, `stroke-linejoin="round"`. Espessuras testadas: 0, 30, 40, 50, 70, 90 e 120; 30 ficou apagada a 16 px, 50 já engrossa demais | APROXIMADO (composição para favicon) | substitui a versão "Mz" recortada anterior. Ponto bronze do símbolo vira cor única |
| `site/assets/logo/favicon-32.png` | `favicon.svg` | render com sharp, fundo transparente, símbolo `#414042` com o mesmo traço | derivado | 32x32. PNG não se adapta ao tema escuro (limitação aceita) |
| `site/assets/logo/apple-touch-icon.png` | `logo-simbolo.svg` | render com sharp: fundo opaco `#e9e6e1`, símbolo `#414042` com 15% de respiro lateral, traço leve de 20 unidades | derivado | 180x180, sem transparência (o iOS preenche de preto) |
| `site/assets/logo/logo-horizontal-header.svg` | paths de `logo-principal.svg` (monograma + nome, sem DERMATOLOGISTA) | **variação horizontal para header** (SUGESTÃO aprovada): monograma à esquerda (scale 0,6) e nome à direita, na mesma linha; só translate/scale sobre os paths originais. **Espessura por parte**: assinatura "Mz" com floreio (`<g id="assinatura">`) com `stroke` de 0,8 px e nome (`<g id="nome">`) com `stroke` de 0,3 px; em cada path o stroke tem a cor do próprio fill, `stroke-linejoin="round"` e `vector-effect="non-scaling-stroke"` | APROXIMADO (composição) | em uso no `index.html`. Largura 216 a 232 px no mobile (maiúscula de 12,2 a 13,1 px) e 280 px no desktop (15,8 px). Medição por simulação em 216, 232 e 280 px: com 0,3 px nenhuma letra se funde com outra. As únicas junções são de lascas do próprio traçado (ponta da serifa do M e borda do O). "MARIA" já vem unida no rastreamento original. Com 0,4 px, Z-U-N se fundem a 216 px. Depende de aprovação final da cliente. **Cor alterada em 2026-10-05** (pedido da cliente, repassado pelo Gabriel): `fill`/`stroke` do nome e do monograma de `#414042` para `#a0815c` (token `--color-brand-bronze`, extraído do manual p.18). Ponto bronze (`#b4987b`) e traço taupe (`#ada195`) preservados sem alteração |
| `_originais/logos-nao-usadas/logo-horizontal-original.svg` | os mesmos paths e a mesma composição da variação horizontal | **versão horizontal sem traço**, para rodapé e usos grandes | APROXIMADO (composição) | não usar no header em tela pequena (hastes finas) |
| `site/assets/logo/logo-horizontal-original-claro.svg` | `logo-horizontal-original.svg` | versão clara para fundo escuro (rodapé `#414042`): mesmos paths, `fill` do nome e do monograma de `#414042` para `#e9e6e1`; ponto bronze e pontinhos preservados | APROXIMADO (composição) | em uso no rodapé. Sem traço (versão original). **Cor alterada em 2026-10-05** (mesmo pedido acima): `fill` do nome e do monograma de `#e9e6e1` para `#d0baa0` (token `--color-brand-sand`, mais claro que o `--color-brand-bronze` do header para manter contraste sobre o fundo escuro do rodapé `#414042`; contraste estimado ~4,6:1). Ponto bronze e traço taupe preservados |
| `_originais/logos-nao-usadas/logo-header-sem-descritor.svg` | paths de `logo-principal.svg` | opção A: logo original sem a linha DERMATOLOGISTA, mesmas coordenadas | APROXIMADO | alternativa guardada, não usada |
| `_originais/logos-nao-usadas/logo-escala-cinza.svg` | `logotipo-mariana-zunino-escala-cinza.png` | rastreamento | APROXIMADO | monocromia/cinzas preservados |
| `_originais/logos-nao-usadas/logo-negativa.svg` | `logotipo-mariana-zunino-negativo.png` | rastreamento | APROXIMADO | arquivo de origem é escuro apesar do nome "negativo" |
| `_originais/logos-nao-usadas/logo-positiva.svg` | `logotipo-mariana-zunino-positivo.png` | rastreamento | APROXIMADO | arquivo de origem é branco apesar do nome "positivo" |
| `_originais/logos-nao-usadas/logo-selo.svg` | `Selo-MarianaZunino.png` | rastreamento | APROXIMADO | selo circular |
| `_originais/logos-nao-usadas/logo-selo-escala-cinza.svg` | PNG homônimo | rastreamento | APROXIMADO | selo cinza |
| `_originais/logos-nao-usadas/logo-selo-negativa.svg` | PNG homônimo | rastreamento | APROXIMADO | selo escuro |
| `_originais/logos-nao-usadas/logo-selo-positiva.svg` | PNG homônimo | rastreamento | APROXIMADO | selo branco |
| vetor original da logo | `logotipo-mariana-zunino.eps` | inspeção EPS | FALHOU como vetor-fonte | EPS contém imagem raster, não paths vetoriais reutilizáveis |
| vetor original do selo | `Selo-MarianaZunino.eps` | inspeção EPS | FALHOU como vetor-fonte | EPS contém imagem raster, não paths vetoriais reutilizáveis |
| formas vetoriais PSD logo | `logotipo-mariana-zunino.psd` | inspeção de camadas disponível | NÃO CONFIRMADO | pedir arquivo AI/SVG/PDF vetorial original ao designer |
| formas vetoriais PSD selo | `Selo-MarianaZunino.psd` | inspeção de camadas disponível | NÃO CONFIRMADO | pedir arquivo AI/SVG/PDF vetorial original ao designer |

## Nova tentativa de reconversão dos EPS (2026-09-25)
Resultado: **não foi possível**, os SVGs aproximados continuam em uso.
- Os EPS pesam 129 MB (logo) e 107 MB (selo). O cabeçalho PostScript mostra `Adobe Photoshop Version 12.0`, `ImageData` e `colorimage`, ou seja, uma imagem raster embutida, sem paths vetoriais (apenas 7 ocorrências de `curveto/lineto` no início, do código de preâmbulo).
- Nesta máquina não há Ghostscript, Inkscape, ImageMagick nem potrace. Mesmo com essas ferramentas, converter o EPS geraria SVG a partir de pixels, sem ganho sobre o rastreamento atual.
- Para obter vetor real, é preciso pedir ao designer o arquivo AI, PDF vetorial ou SVG original da marca.

## Cores observadas nos PNGs de logo
Estas cores são **APROXIMADAS, extraídas de imagem**, e não substituem a paleta oficial da p. 18:
- Logo principal: grafite dominante próximo de `#414042`, taupe do descriptor próximo de `#ada195`, ponto bronze próximo de `#b4987b`.
- A paleta oficial escrita no manual continua sendo a fonte de verdade para UI: `#a0815c`, `#d0baa0`, `#e9e6e1`, `#ffffff`, `#762d2d`, `#414042`.

## Fotografias
As fotografias vistas dentro do PDF não foram exportadas como assets separados.
Os 6 cards de "Tratamentos" (`site/index.html`) foram decididos sem foto (só número, divisor e nome), então não é mais necessário solicitar fotos para eles.

### Retratos da Dra. Mariana (26/09/2026)
Recebidos dois JPEGs (metadados já ausentes, sRGB, ver verificação de perfil de cor abaixo), guardados sem alteração em `_originais/fotos/` (fora do git). O site nunca usa o original.
| Original | Resolução | Uso | Recorte |
|---|---|---|---|
| dra1.jpeg (sentada no banco, com a revista "VOGUE BELEZA" à mostra) | 1112 x 1600, 90,5 KB | Hero, 3:4 (ver edição abaixo) | 990 x 1320, x=110 e y=30, com a Dra. centrada no quadro e mais ar ao redor. Sem retoque |
| dra2.jpeg (retrato de busto, luz lateral) | 1066 x 1600, 102,8 KB | Sobre, 2:3 | Foto inteira, 1066 x 1600, sem recorte (a foto termina na altura do quadril). Sem retoque |

Versões em `site/assets/img/` (`dra-mariana-zunino-sobre-{480,800,1200}`), geradas com sharp (Lanczos3), sem metadados, com perfil sRGB embutido. Só recorte, redimensionamento e compressão: AVIF q50, WebP q75, JPEG q80 progressivo (mozjpeg). (Os arquivos `dra-mariana-zunino-hero-*` seguem outra receita, ver "Foto do hero editada" abaixo.)
| Arquivo | 480 | 800 | 1200 |
|---|---|---|---|
| sobre AVIF / WebP / JPEG (KB) | 10,3 / 12,7 / 23,3 | 21,3 / 27,1 / 50,9 | 37,4 / 46,5 / 94,2 |

Atenção: como a foto do Sobre tem 1066 px, a versão de 1200 px é uma ampliação de cerca de 13%; a de 800 px não é ampliada. Se a cliente enviar a foto em resolução maior, refazer o recorte.
A foto do Sobre (`.photo--inteira`, `data-parallax-off`) não tem folga vertical nem parallax, para o cabelo, que começa a 1,6% da borda de cima, não ser cortado. Para a Dra. aparecer inteira e centrada no hero, a folga vertical das fotos passou de 10% para 4% (`.photo__inner` em `components.css`) e o parallax de ±8% para ±3,5% (`animations.js`).

### Verificação de perfil de cor (27/09/2026)
Conferido se `dra1.jpeg` e `dra2.jpeg` tinham perfil de cor diferente de sRGB (Adobe RGB, Display P3 ou outro). Não fiei na leitura do Pillow: fiz uma varredura byte a byte de todos os marcadores JPEG dos dois arquivos.

**Resultado: nenhum perfil de cor embutido em nenhuma das duas fotos.** Nenhum segmento `APP2 "ICC_PROFILE"`, nenhum marcador `APP14 "Adobe"` (sinal comum de edição em Adobe RGB) e nenhum EXIF (logo, também sem a tag `ColorSpace`). Só o cabeçalho JFIF padrão. Sem perfil embutido, a convenção universal é tratar o arquivo como sRGB; não havia Adobe RGB, Display P3 nem qualquer outro perfil para converter, então **nenhuma correção foi necessária e nenhum arquivo de imagem foi alterado por esta verificação.**

Comparação lado a lado (original x exportada, hero e Sobre) sem diferença de cor visível. Confirmado também que as exportações da foto do Sobre (`dra-mariana-zunino-sobre-*.jpg`, geradas com sharp numa sessão anterior) têm um perfil sRGB de verdade embutido (nome e descrição do perfil: "sRGB"), enquanto as do hero (geradas com Pillow, ver abaixo) não embutem nenhum perfil, do mesmo jeito que o original. As duas formas são equivalentes; nenhuma representa erro ou perda de cor.

### Foto do Sobre trocada (05/10/2026)
A Dra. Mariana enviou uma nova foto de retrato (blazer branco, brincos dourados) para substituir `dra2.jpeg` na seção Sobre. Guardada sem alteração em `_originais/fotos/dra3.jpg` (fora do git). Sem perfil de cor embutido e sem EXIF, igual às outras duas fotos (tratada como sRGB por convenção).

- **Original:** 953 x 1280, 73,3 KB.
- **Recorte:** centralizado para 852 x 1278 (2:3 exato), 50 px cortados de cada lado e 1 px de cada topo/base. Nada do enquadramento (ombros, mãos, cabelo) é tocado.
- **Exportação** (`site/assets/img/dra-mariana-zunino-sobre-{480,640,852}.{avif,webp,jpg}`): gerada com Pillow + plugin AVIF (não com sharp, que não está disponível neste ambiente; mesmas configurações de qualidade do padrão do projeto: AVIF q50, WebP q75, JPEG q80 progressivo). JPEG usa o codificador padrão do Pillow (libjpeg), não mozjpeg. Perfil sRGB padrão (gerado pelo `ImageCms` do Pillow) embutido nos três formatos.
- **Tamanhos:** só até 852 px de largura (o máximo que o recorte de 2:3 permite sem ampliar; o antigo tinha uma faixa de 1200 px, com ~13% de ampliação sobre `dra2.jpeg`). Como o novo original é mais estreito, a faixa de 800 px foi trocada por 640 px, para manter 3 tamanhos bem espaçados sem ampliar.
| Arquivo | 480 | 640 | 852 |
|---|---|---|---|
| sobre AVIF / WebP / JPEG (KB), foto nova | 12,4 / 15,9 / 34,6 | 17,9 / 22,6 / 53,0 | 26,3 / 32,3 / 80,8 |

Os arquivos `dra-mariana-zunino-sobre-800.*` e `dra-mariana-zunino-sobre-1200.*` (da foto antiga) foram apagados; `index.html` foi atualizado para o novo `srcset` (480/640/852w), `width="852" height="1278"` e o `alt` ("blazer branco" no lugar de "blusa preta").

### Foto do hero editada: logotipo VOGUE removido (27/09/2026)
A pendência acima ("a capa da revista VOGUE na foto do hero pode sugerir matéria ou parceria") foi resolvida removendo o logotipo, sem mexer em mais nada da foto: **foto do hero editada, logotipo de terceiro removido por inpainting; original preservado em `_originais/fotos/dra1.jpeg`.**

- **Máscara:** só as 5 letras de "VOGUE" (440 pixels, dentro de um retângulo de 34 x 35 px), localizadas por brilho e isoladas por componentes conectados (excluindo o brilho dos anéis e a lombada branca da revista, que ficam bem perto). "BE LEZA" e o resto da capa não foram tocados.
- **Reconstrução:** OpenCV `INPAINT_TELEA` (raio 5px), com uma checagem posterior confirmando 0 pixels alterados fora da máscara.
- **Grão:** a reconstrução inicial ficava mais lisa que o grão da foto ao redor (desvio padrão de luminância 5,0 contra 7,6 da vizinhança). Foi somado ruído gaussiano (sigma 5,88, calibrado por busca binária) só dentro da máscara, igual nos 3 canais de cor: resultado final 7,65 contra 7,60 da vizinhança.
- **Arquivo de trabalho:** `_originais/fotos/dra1-sem-logo.png` (1112 x 1600, sem perdas, mesma resolução do original; guardado fora do git como o restante de `_originais/`).
- **Recorte para 3:4:** o original tem só 1112 px de largura (menor que os 1200 px usados antes, que eram uma extensão sintética de canvas). Sem ampliar a largura, a altura para fechar 3:4 a 1112 px é 1483 px; os 117 px cortados saem do chão vazio abaixo do banco (nem o banco, nem a Dra. Mariana são tocados). O enquadramento da cabeça aos pés fica idêntico ao original.
- **Exportação** (`site/assets/img/dra-mariana-zunino-hero-{480,800,1112}.{avif,webp,jpg}`): larguras 480, 800 e 1112 (sem 1200 nem 1600, para não ampliar além do original), todas na proporção exata 1112:1483 (altura 640, 1067 e 1483). AVIF qualidade 60, WebP qualidade 85, JPEG qualidade 90 progressivo, sem EXIF nem perfil ICC embutido (sRGB implícito, igual ao original).
| Arquivo | 480 | 800 | 1112 |
|---|---|---|---|
| hero AVIF / WebP / JPEG (KB), antes (480/800/1200) | 8,9 / 11,4 / 20,4 | 17,2 / 21,8 / 42,1 | 28,0 / 34,9 / 72,4 (era 1200px) |
| hero AVIF / WebP / JPEG (KB), depois (480/800/1112) | 11,5 / 16,3 / 36,5 | 23,2 / 32,6 / 79,9 | 37,6 / 53,1 / 92,2 |

Os arquivos ficaram maiores (+125,8 KB no total dos 9 arquivos: 257,1 KB antes, 382,9 KB depois), porque a qualidade pedida desta vez é mais alta (AVIF 60 contra 50, WebP 85 contra 75, JPEG 90 contra 80). Lighthouse mobile depois da troca: 92, 98 e 98 em 3 medições (mediana 98); desktop: 100. Sem esse item cair abaixo de 90.

### og-image (26/09/2026, recorte refeito em 27/09/2026)
`site/assets/og-image.jpg`, 1200 x 630: fundo #e9e6e1, logo horizontal (`site/assets/logo/logo-horizontal-header.svg`) à esquerda e recorte da foto do hero à direita. Recorte refeito em 27/09/2026 (AUDITORIA-CFM.md, item 2.3): a versão anterior mostrava a foto inteira, com a revista "Vogue" nas mãos da Dra. Mariana; a versão atual usa só a parte de cima da mesma foto (topo até 900 px de 1600, antes da revista aparecer), então nenhuma marca de terceiro sai na og-image. **A foto usada na própria seção do hero (`index.html`) continua com a revista à mostra**, porque a pendência é sobre aquela foto, não sobre o recorte da og-image; ver a nota logo acima sobre a capa da Vogue.

### Fotos ilustrativas da seção Tratamentos (05/10/2026)
`site/assets/acne.jpeg`, `rosacea.jpeg`, `cabelo.jpeg` e `melasma.jpeg` foram adicionados à pasta pelo cliente/Gabriel, sem metadado de origem ou licença registrado até o momento. Pelo conteúdo (modelos genéricos em still de banco de imagens, sem relação com a clínica), não se tratam de pacientes reais da Dra. Mariana, então a regra do `CLAUDE.md` sobre foto de paciente não se aplica; mesmo assim, **falta confirmar a licença de uso comercial/web** de cada uma antes da publicação (mesmo tratamento dado às fontes: ver Collection New Style e SALVAGER acima). Status: AGUARDANDO CONFIRMAÇÃO DE LICENÇA.

Usadas nos cards "Melasma" (02), "Acne" (03), "Rosácea" (04) e "Queda de cabelo" (05, depois trocada por `cabelo2.jpeg`, ver nota abaixo) da seção Tratamentos (`index.html`). Exportação em `site/assets/img/trat-{melasma,acne,rosacea,queda-cabelo}-{320,480,640}.{avif,webp,jpg}`, gerada com Pillow + plugin AVIF, mesma receita do projeto (AVIF q50, WebP q75, JPEG q80 progressivo, perfil sRGB do `ImageCms` embutido). `alt` descreve a condição de pele/cabelo de forma genérica, sem sugerir resultado de tratamento (Resolução CFM 2.336/2023, art. 11 XII).

**Ajuste de 05/10/2026 (duas rodadas):** 1) recorte trocado de 4:5 de ponta a ponta do card para 1:1 recuado (`.card__media` com `padding: var(--space-6)` e moldura `.card__media__frame` com borda de 1px), a pedido do cliente ("quero elas menores, o zoom esta muito alto"). 2) Cliente esclareceu que quis dizer o oposto do recorte: não cortar a foto, mostrar ela inteira, só menor dentro do card. Trocado o recorte quadrado por **redimensionamento sem corte**, na proporção original de cada arquivo (`acne.jpeg`/`melasma.jpeg` 1024:1536, `rosacea.jpeg` 1122:1402, `cabelo.jpeg` 924:1600), com a moldura usando `aspect-ratio: var(--ratio)` (definido inline por card) e `object-fit: contain`. A foto continua recuada com `padding`, então fica visivelmente menor que o card, mas inteira, sem nenhuma borda cortada.

**Ajuste adicional (card "Queda de cabelo"):** a moldura do carrossel foi padronizada depois para 4:5 fixo em todos os cards (ver CSS, comentário sobre `--fit`/`--pos`/`--zoom`), para o carrossel manter sempre a mesma altura. Com `cabelo.jpeg` em 924:1600 (bem mais estreita que 4:5), `--fit: contain` deixava faixas da cor da moldura (`--color-brand-offwhite`) visíveis nos cantos. A pedido do cliente ("sem bordas nos cantos"), trocado para o `cover` padrão com `--pos: center 75%`, que preenche o quadro inteiro recortando um pouco do topo (rosto desfocado ao fundo), sem deixar fundo à mostra.

**Troca de foto do card "Queda de cabelo" (05/10/2026):** `cabelo.jpeg` (mão com fios soltos) foi substituída por `site/assets/cabelo2.jpeg` (1086 x 1448, homem observando a entrada do cabelo no espelho), a pedido do cliente. Mesmo status de licença AGUARDANDO CONFIRMAÇÃO. `cabelo.jpeg` não é mais referenciada por nenhum card; o arquivo permanece em `site/assets/` sem uso. Exportação sem corte, proporção original 1086:1448 (3:4 exato), em `trat-queda-cabelo-{320,480,640}.{avif,webp,jpg}` (mesmos nomes de arquivo de antes, conteúdo sobrescrito), mesma receita (AVIF q50/WebP q75/JPEG q80 progressivo, sRGB embutido). Como 3:4 é próximo do 4:5 da moldura, nenhum ajuste de `--pos`/`--zoom` foi necessário (`cover` padrão já preenche sem cortar o assunto). `alt` atualizado para descrever a nova cena sem sugerir resultado.

**Mesma correção aplicada ao card "Melasma" (05/10/2026):** `melasma.jpeg` (1024:1536, mais estreita que 4:5) também estava com `--fit: contain`, deixando faixas da moldura visíveis nas laterais ("bordas do lado", mesmo pedido do card de cabelo). Trocado para `cover` com `--pos: center 35%`, que preenche o quadro inteiro recortando um pouco da base (ombro/alça da camiseta), mantendo rosto e mão no enquadramento.

**Reposicionamento fino (05/10/2026):** com `--pos: center 35%` o recorte ainda tirava uma fatia do topo do cabelo. A pedido do cliente ("enquadrando o rosto todo... no centro do card certinho"), ajustado para `--pos: center 5%`: a janela de corte passa a começar quase no topo da foto original, mostrando cabelo e rosto inteiros; o que sobra de corte (proporção da moldura é mais baixa que a foto original) sai todo da base (ombro/alça), não do rosto.

### Foto do card "Rejuvenescimento" (05/10/2026)
`site/assets/rejuvenescimento.jpeg` (817 x 1225) foi adicionada pelo Gabriel, sem metadado de origem ou licença registrado — mesmo status de AGUARDANDO CONFIRMAÇÃO DE LICENÇA das outras quatro. Diferente das demais (que mostram só a condição de pele/cabelo), esta foto mostra uma agulha/seringa sendo aplicada no rosto, ou seja, um procedimento injetável em andamento, não uma condição. Perguntado explicitamente se era essa a imagem pretendida para "Rejuvenescimento" mesmo com essa diferença de conteúdo (risco de associar visualmente o tratamento a um procedimento injetável específico, Resolução CFM 2.336/2023), o Gabriel confirmou que sim. Usada no card "Rejuvenescimento" (01), antes só com número/nome sem foto. Mesma receita de exportação sem corte (`trat-rejuvenescimento-{320,480,640}.{avif,webp,jpg}`, proporção original 817:1225, AVIF q50/WebP q75/JPEG q80 progressivo, perfil sRGB embutido). `alt` descreve a cena sem sugerir resultado.

### Troca completa das fotos de Tratamentos + foto nova para "Outras doenças de pele" (06/10/2026)
Gabriel enviou um novo conjunto de 6 fotos (`acnehd.png`, `melasmahd.png`, `outrasdoencas.png`, `quedadecabelohd.png`, `rejuvenescimentohd.png`, `rosaceahd.png`, todas 941 x 1672), para substituir as 5 fotos anteriores (`acne.jpeg`, `melasma.jpeg`, `rosacea.jpeg`, `cabelo2.jpeg`, `rejuvenescimento.jpeg`) e dar ao card "Outras doenças de pele" (06) uma foto pela primeira vez (antes só tinha número, divisor e nome). Sem metadado de origem ou licença registrado — mesmo status AGUARDANDO CONFIRMAÇÃO DE LICENÇA das fotos anteriores. Pelo conteúdo (modelos e cenas genéricas de banco de imagens/still, sem relação com a clínica ou com pacientes reais da Dra. Mariana), a regra do `CLAUDE.md` sobre foto de paciente não se aplica. Nenhuma marca de produto, equipamento ou fabricante aparece em nenhuma das 6 fotos.

Conteúdo de cada foto, por card: 01 Rejuvenescimento — aplicação de agulha/seringa próxima ao olho (mesma natureza da foto anterior, procedimento injetável em andamento, não uma condição); 02 Melasma — mulher com a mão no rosto observando manchas no espelho; 03 Acne — pele da bochecha com lesões de acne; 04 Rosácea — pele do rosto com vermelhidão, com uma lupa ampliando a área afetada; 05 Queda de cabelo — homem observando a linha do cabelo no espelho, com a mão na cabeça; 06 Outras doenças de pele — avaliação da pele com dermatoscópio (card novo, sem foto antes).

Exportação sem corte (mesma receita do projeto: Pillow + plugin AVIF, AVIF q50, WebP q75, JPEG q80 progressivo, perfil sRGB do `ImageCms` embutido), na proporção original 941:1672 de cada arquivo, em `site/assets/img/trat-{rejuvenescimento,melasma,acne,rosacea,queda-cabelo,outras-doencas}-{320,480,640}.{avif,webp,jpg}` (os 5 primeiros sobrescrevem os arquivos antigos; `trat-outras-doencas-*` é novo). Como a proporção original é bem mais estreita que a moldura 4:5 do card, `--pos` foi ajustado por card para manter o rosto/foco de cada foto visível: `center 0%` em Rejuvenescimento, Melasma, Acne, Rosácea e Queda de cabelo (o conteúdo relevante de cada uma já fica todo na metade de cima da foto original); `center 15%` em Outras doenças de pele, para incluir tanto o rosto da profissional quanto o dermatoscópio e as mãos. `alt` de cada card descreve a cena de forma genérica, sem sugerir resultado de tratamento (Resolução CFM 2.336/2023, art. 11 XII); nenhum texto novo foi adicionado ao HTML além dos `alt`, então a regra de conteúdo educativo (art. 14, I) não se aplica.

Os 6 arquivos `*hd.png`/`outrasdoencas.png` originais foram movidos para `_originais/fotos/` (fora do git), mesmo tratamento dado às fotos anteriores. `cabelo.jpeg` (substituída por `cabelo2.jpeg` em 05/10/2026, depois por `quedadecabelohd.png` nesta troca) e as demais fotos antigas (`acne.jpeg`, `melasma.jpeg`, `rosacea.jpeg`, `cabelo2.jpeg`, `rejuvenescimento.jpeg`) também já estavam em `_originais/fotos/`; nenhuma referenciada por nenhum card continua em `site/assets/`.

## Verificação
Cada SVG gerado foi renderizado para PNG após a conversão e comparado visualmente com o respectivo original. Não foram adicionados fundo, efeitos, texto novo ou redesenho intencional. O `viewBox` foi ajustado ao bounding box do conteúdo.

## Otimização dos SVGs usados (SVGO, 26/09/2026)
Os 3 SVGs com peso relevante foram otimizados com SVGO (multipass, precisão 2, sem juntar grupos nem caminhos, para preservar `vector-effect="non-scaling-stroke"` da logo do header). Comparação por renderização em 1800 px, sobre branco e sobre #414042: no máximo 0,003% dos pixels diferem, com diferença de até 2 em 255 num canal (imperceptível).

| Arquivo | Antes | Depois |
|---|---:|---:|
| `logo-horizontal-header.svg` | 36,9 KB | 22,5 KB |
| `logo-horizontal-original-claro.svg` | 35,7 KB | 21,3 KB |
| `favicon.svg` | 18,0 KB | 8,4 KB |

## Fontes e bibliotecas hospedadas em `site/assets/`
Nada é carregado de terceiros junto com a página (o Google Maps só carrega depois do clique em "Ver mapa").

| Arquivo | Origem | Licença | Observação |
|---|---|---|---|
| `fonts/cormorant-garamond-500.woff2`, `-600.woff2` | Google Fonts, Cormorant Garamond v4.001, subset latin | SIL OFL 1.1 (`fonts/OFL-Cormorant.txt`) | **Modificada**: acentos de U+00C0 a U+00FF recentralizados na horizontal (no original saem deslocados) |
| `fonts/poppins-400.woff2`, `-500.woff2` | Google Fonts, Poppins v24, latin | SIL OFL 1.1 (`fonts/OFL-Poppins.txt`) | Sem modificação |
| `vendor/gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`, `DrawSVGPlugin.min.js`, `Flip.min.js` | GSAP 3.15.0 (jsDelivr/unpkg) | Licença padrão GreenSock (gratuita, inclui os plugins) | Sem modificação. `Flip.min.js` adicionado em 2026-10-08 para o estado expandido dos cards de Tratamentos (ver `js/trat-expand.js`) |
| `vendor/swiper-custom.min.js`, `swiper-custom.min.css` | Swiper 14.2.0, build próprio só com Navigation, Pagination, A11y e Keyboard (esbuild) | MIT (`vendor/LICENSE-swiper.txt`) | 88,6 KB (27,4 KB gzip), contra 152,8 KB (43,9 KB gzip) do bundle completo |

### Verificação das fotos (26/09/2026)
Sem overflow horizontal em 320, 360, 390, 414, 768, 1024, 1280, 1440 e 1920 px. As 8 seções cabem na altura em 1024x768, 1366x650, 1440x780 e 1920x950. Lighthouse (servidor local com gzip): desktop 100/100/100/100 (LCP 0,5 s); mobile 98/100/100/100 (LCP 2,3 s, contra 2,1 s antes das fotos; agora o LCP é a foto do hero).
