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
As fotografias vistas dentro do PDF não foram exportadas como assets separados, porque o pedido forneceu o PDF como referência e não arquivos-fonte das fotos. Para produção, solicitar os retratos originais em alta resolução com autorização de uso web.

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
