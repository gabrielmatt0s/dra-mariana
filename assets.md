# assets.md

## Regra de proveniência
Prioridade solicitada: EPS vetorial > PSD vetorial > PNG rastreado. A auditoria mostrou que os EPS são exports do Adobe Photoshop com `ImageData`, ou seja, raster encapsulado. Os PSDs exibem múltiplas camadas raster no parser disponível, mas não forneceram uma fonte vetorial confirmável. Assim, os SVGs entregues usam rastreamento dos PNGs transparentes de 2048 px.

Todos os arquivos de origem (PNG, EPS, PSD, PDF) citados abaixo estão em `_originais/`. Os SVGs finais estão em `assets/logo/`.

| Asset final | Origem | Método | Status | Observação |
|---|---|---|---|---|
| `assets/logo/logo-principal.svg` | `logotipo-mariana-zunino.png` | rastreamento por contornos/cor | APROXIMADO | composição e cores dominantes preservadas; AA/curvas finas podem variar |
| `assets/logo/logo-simbolo.svg` | símbolo recortado do PNG principal | rastreamento | APROXIMADO | usar em favicon/avatar; recorte técnico do símbolo |
| `assets/logo/favicon.svg` | `logo-simbolo.svg` (símbolo "Mz" completo, 3 paths) | **adaptação para ícone**: fundo transparente, viewBox quadrado com o símbolo na largura total (mais meia espessura de traço) e centralizado na vertical. Cor `#414042` por padrão e `#e9e6e1` com `prefers-color-scheme: dark`, dentro do SVG. Traço de 40 unidades do viewBox (0,4 px a 16 px, 0,8 px a 32 px), mesma cor do fill, `stroke-linejoin="round"`. Espessuras testadas: 0, 30, 40, 50, 70, 90 e 120; 30 ficou apagada a 16 px, 50 já engrossa demais | APROXIMADO (composição para favicon) | substitui a versão "Mz" recortada anterior. Ponto bronze do símbolo vira cor única |
| `assets/logo/favicon-32.png` | `favicon.svg` | render com sharp, fundo transparente, símbolo `#414042` com o mesmo traço | derivado | 32x32. PNG não se adapta ao tema escuro (limitação aceita) |
| `assets/logo/apple-touch-icon.png` | `logo-simbolo.svg` | render com sharp: fundo opaco `#e9e6e1`, símbolo `#414042` com 15% de respiro lateral, traço leve de 20 unidades | derivado | 180x180, sem transparência (o iOS preenche de preto) |
| `assets/logo/logo-horizontal-header.svg` | paths de `logo-principal.svg` (monograma + nome, sem DERMATOLOGISTA) | **variação horizontal para header** (SUGESTÃO aprovada): monograma à esquerda (scale 0,6) e nome à direita, na mesma linha; só translate/scale sobre os paths originais, cores preservadas. **Espessura por parte**: assinatura "Mz" com floreio (`<g id="assinatura">`) com `stroke` de 0,8 px e nome (`<g id="nome">`) com `stroke` de 0,3 px; em cada path o stroke tem a cor do próprio fill, `stroke-linejoin="round"` e `vector-effect="non-scaling-stroke"` | APROXIMADO (composição) | em uso no `index.html`. Largura 216 a 232 px no mobile (maiúscula de 12,2 a 13,1 px) e 280 px no desktop (15,8 px). Medição por simulação em 216, 232 e 280 px: com 0,3 px nenhuma letra se funde com outra. As únicas junções são de lascas do próprio traçado (ponta da serifa do M e borda do O). "MARIA" já vem unida no rastreamento original. Com 0,4 px, Z-U-N se fundem a 216 px. Depende de aprovação final da cliente |
| `assets/logo/logo-horizontal-original.svg` | os mesmos paths e a mesma composição da variação horizontal | **versão horizontal sem traço**, para rodapé e usos grandes | APROXIMADO (composição) | não usar no header em tela pequena (hastes finas) |
| `assets/logo/logo-header-sem-descritor.svg` | paths de `logo-principal.svg` | opção A: logo original sem a linha DERMATOLOGISTA, mesmas coordenadas | APROXIMADO | alternativa guardada, não usada |
| `assets/logo/logo-escala-cinza.svg` | `logotipo-mariana-zunino-escala-cinza.png` | rastreamento | APROXIMADO | monocromia/cinzas preservados |
| `assets/logo/logo-negativa.svg` | `logotipo-mariana-zunino-negativo.png` | rastreamento | APROXIMADO | arquivo de origem é escuro apesar do nome "negativo" |
| `assets/logo/logo-positiva.svg` | `logotipo-mariana-zunino-positivo.png` | rastreamento | APROXIMADO | arquivo de origem é branco apesar do nome "positivo" |
| `assets/logo/logo-selo.svg` | `Selo-MarianaZunino.png` | rastreamento | APROXIMADO | selo circular |
| `assets/logo/logo-selo-escala-cinza.svg` | PNG homônimo | rastreamento | APROXIMADO | selo cinza |
| `assets/logo/logo-selo-negativa.svg` | PNG homônimo | rastreamento | APROXIMADO | selo escuro |
| `assets/logo/logo-selo-positiva.svg` | PNG homônimo | rastreamento | APROXIMADO | selo branco |
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
