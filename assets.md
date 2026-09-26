# assets.md

## Regra de proveniência
Prioridade solicitada: EPS vetorial > PSD vetorial > PNG rastreado. A auditoria mostrou que os EPS são exports do Adobe Photoshop com `ImageData`, ou seja, raster encapsulado. Os PSDs exibem múltiplas camadas raster no parser disponível, mas não forneceram uma fonte vetorial confirmável. Assim, os SVGs entregues usam rastreamento dos PNGs transparentes de 2048 px.

Todos os arquivos de origem (PNG, EPS, PSD, PDF) citados abaixo estão em `_originais/`. Os SVGs usados pelo site estão em `site/assets/logo/` (5 arquivos: favicon, favicon-32, apple-touch-icon, logo horizontal do header e logo horizontal clara do rodapé). Os demais SVGs preparados (versões principal, símbolo, selo, escala de cinza, negativa e positiva) não são usados pelo site e ficam em `_originais/logos-nao-usadas/`, fora do git e da publicação.

| Asset final | Origem | Método | Status | Observação |
|---|---|---|---|---|
| `_originais/logos-nao-usadas/logo-principal.svg` | `logotipo-mariana-zunino.png` | rastreamento por contornos/cor | APROXIMADO | composição e cores dominantes preservadas; AA/curvas finas podem variar |
| `_originais/logos-nao-usadas/logo-simbolo.svg` | símbolo recortado do PNG principal | rastreamento | APROXIMADO | usar em favicon/avatar; recorte técnico do símbolo |
| `site/assets/logo/favicon.svg` | `logo-simbolo.svg` (símbolo "Mz" completo, 3 paths) | **adaptação para ícone**: fundo transparente, viewBox quadrado com o símbolo na largura total (mais meia espessura de traço) e centralizado na vertical. Cor `#414042` por padrão e `#e9e6e1` com `prefers-color-scheme: dark`, dentro do SVG. Traço de 40 unidades do viewBox (0,4 px a 16 px, 0,8 px a 32 px), mesma cor do fill, `stroke-linejoin="round"`. Espessuras testadas: 0, 30, 40, 50, 70, 90 e 120; 30 ficou apagada a 16 px, 50 já engrossa demais | APROXIMADO (composição para favicon) | substitui a versão "Mz" recortada anterior. Ponto bronze do símbolo vira cor única |
| `site/assets/logo/favicon-32.png` | `favicon.svg` | render com sharp, fundo transparente, símbolo `#414042` com o mesmo traço | derivado | 32x32. PNG não se adapta ao tema escuro (limitação aceita) |
| `site/assets/logo/apple-touch-icon.png` | `logo-simbolo.svg` | render com sharp: fundo opaco `#e9e6e1`, símbolo `#414042` com 15% de respiro lateral, traço leve de 20 unidades | derivado | 180x180, sem transparência (o iOS preenche de preto) |
| `site/assets/logo/logo-horizontal-header.svg` | paths de `logo-principal.svg` (monograma + nome, sem DERMATOLOGISTA) | **variação horizontal para header** (SUGESTÃO aprovada): monograma à esquerda (scale 0,6) e nome à direita, na mesma linha; só translate/scale sobre os paths originais, cores preservadas. **Espessura por parte**: assinatura "Mz" com floreio (`<g id="assinatura">`) com `stroke` de 0,8 px e nome (`<g id="nome">`) com `stroke` de 0,3 px; em cada path o stroke tem a cor do próprio fill, `stroke-linejoin="round"` e `vector-effect="non-scaling-stroke"` | APROXIMADO (composição) | em uso no `index.html`. Largura 216 a 232 px no mobile (maiúscula de 12,2 a 13,1 px) e 280 px no desktop (15,8 px). Medição por simulação em 216, 232 e 280 px: com 0,3 px nenhuma letra se funde com outra. As únicas junções são de lascas do próprio traçado (ponta da serifa do M e borda do O). "MARIA" já vem unida no rastreamento original. Com 0,4 px, Z-U-N se fundem a 216 px. Depende de aprovação final da cliente |
| `_originais/logos-nao-usadas/logo-horizontal-original.svg` | os mesmos paths e a mesma composição da variação horizontal | **versão horizontal sem traço**, para rodapé e usos grandes | APROXIMADO (composição) | não usar no header em tela pequena (hastes finas) |
| `site/assets/logo/logo-horizontal-original-claro.svg` | `logo-horizontal-original.svg` | versão clara para fundo escuro (rodapé `#414042`): mesmos paths, `fill` do nome e do monograma de `#414042` para `#e9e6e1`; ponto bronze e pontinhos preservados | APROXIMADO (composição) | em uso no rodapé. Sem traço (versão original) |
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
As fotografias vistas dentro do PDF não foram exportadas como assets separados. Para os 6 cards de tratamento, ainda é preciso solicitar as fotos com autorização de uso web.

### Retratos da Dra. Mariana (26/09/2026)
Recebidos dois JPEGs (metadados já ausentes, sRGB), guardados sem alteração em `_originais/fotos/` (fora do git). O site nunca usa o original.
| Original | Resolução | Uso | Recorte |
|---|---|---|---|
| dra1.jpeg (sentada no banco, com a revista "VOGUE BELEZA" à mostra) | 1112 x 1600, 90,5 KB | Hero, 3:4 | 880 x 1173, x=200 e y=80, com a Dra. centrada no quadro. Sem retoque |
| dra2.jpeg (retrato de busto, luz lateral) | 1066 x 1600, 102,8 KB | Sobre, 4:5 | 952 x 1190, x=114 e y=0, com a Dra. centrada no quadro. Sem retoque |

Versões em `site/assets/img/` (`dra-mariana-zunino-hero-{480,800,1200}` e `dra-mariana-zunino-sobre-{480,800,1200}`), geradas com sharp (Lanczos3), sem metadados, com perfil sRGB embutido. Só recorte, redimensionamento e compressão: AVIF q50, WebP q75, JPEG q80 progressivo (mozjpeg).
| Arquivo | 480 | 800 | 1200 |
|---|---|---|---|
| hero AVIF / WebP / JPEG (KB) | 9,7 / 12,5 / 21,9 | 18,2 / 23,3 / 44,5 | 29,6 / 37,0 / 76,6 |
| sobre AVIF / WebP / JPEG (KB) | 10,2 / 12,9 / 22,9 | 21,6 / 28,0 / 51,0 | 37,4 / 46,0 / 93,0 |

Atenção: como o recorte centrado usa só 880 e 952 px de largura, as versões de 1200 px são ampliações de cerca de 36% (hero) e 26% (Sobre); as de 800 px, de 9% e nenhuma. Se a cliente enviar as fotos em resolução maior, refazer os recortes.
Para a Dra. aparecer inteira e centrada, a folga vertical das fotos passou de 10% para 4% (`.photo__inner` em `components.css`) e o parallax de ±8% para ±3,5% (`animations.js`).
Pendente com a cliente: a capa da revista "VOGUE" na foto do hero pode sugerir matéria ou parceria; confirmar o respaldo antes de publicar.

### og-image (26/09/2026)
`site/assets/og-image.jpg`, 1200 x 630: fundo #e9e6e1, logo principal (`_originais/logos-nao-usadas/logo-principal.svg`, versão escura) à esquerda e recorte da foto do hero à direita (880 x 924 do original, reduzido a 600 x 630). JPEG q85, 40 KB.

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
| `fonts/cormorant-garamond-italic-500.woff2` | Google Fonts, itálico 500, subset latin | SIL OFL 1.1 | Original, sem modificação. Só a assinatura da abordagem no mobile |
| `fonts/poppins-400.woff2`, `-500.woff2` | Google Fonts, Poppins v24, latin | SIL OFL 1.1 (`fonts/OFL-Poppins.txt`) | Sem modificação |
| `vendor/gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`, `DrawSVGPlugin.min.js` | GSAP 3.15.0 (jsDelivr) | Licença padrão GreenSock (gratuita, inclui os plugins) | Sem modificação |
| `vendor/swiper-custom.min.js`, `swiper-custom.min.css` | Swiper 14.2.0, build próprio só com Navigation, Pagination, A11y e Keyboard (esbuild) | MIT (`vendor/LICENSE-swiper.txt`) | 88,6 KB (27,4 KB gzip), contra 152,8 KB (43,9 KB gzip) do bundle completo |

### Verificação das fotos (26/09/2026)
Sem overflow horizontal em 320, 360, 390, 414, 768, 1024, 1280, 1440 e 1920 px. As 8 seções cabem na altura em 1024x768, 1366x650, 1440x780 e 1920x950. Lighthouse (servidor local com gzip): desktop 100/100/100/100 (LCP 0,5 s); mobile 98/100/100/100 (LCP 2,3 s, contra 2,1 s antes das fotos; agora o LCP é a foto do hero).
