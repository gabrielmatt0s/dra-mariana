# CLAUDE.md

## Objetivo
Construir uma landing page responsiva para **Dra. Mariana Zunino, Dermatologista, Curitiba**, usando exclusivamente os dados e regras deste handoff. A página deve comunicar cuidado profundo, naturalidade, conhecimento, acolhimento e segurança, com conversão para agendamento sem promessas de resultado médico.

## Fontes de verdade
1. `content.md`: textos e dados profissionais extraídos do material.
2. `design-system.md`: identidade, acessibilidade, UI e regras de uso.
3. `tokens.css` e `tokens.json`: tokens de implementação.
4. `assets.md`: proveniência e status de cada asset.
5. `assets/logo/`: SVGs preparados para implementação.
6. `referencia/REFERENCIA.md`: referência de estrutura/estilo de layout observada em site análogo.
7. `referencia/screens/`: capturas de tela da referência visual.

## Regras obrigatórias
- Não inventar formação, procedimentos, endereço, telefone, WhatsApp, e-mail, URL, redes sociais, horários, convênios, preços, depoimentos, resultados, títulos acadêmicos ou registros além dos explicitamente documentados.
- Dados confirmados no PDF: nome Mariana Zunino; atuação como Dermatologista; Curitiba; CRM/PR 26153; RQE 19939. Fonte: `MarianaZunino.pdf`, p. 8.
- Não prometer cura, resultado garantido, superioridade, exclusividade clínica ou transformação estética certa.
- Não usar antes/depois ou prova social sem material real e autorização adequada.
- Não alterar proporções, traços, cores ou composição das logos.
- Os SVGs deste pacote são **APROXIMADOS (vetorizados de imagem)**. O EPS recebido é um EPS gerado pelo Photoshop contendo imagem raster, não arte vetorial editável. Os PSDs possuem camadas raster detectáveis, mas não foi possível confirmar formas vetoriais reutilizáveis. Ver `assets.md`.
- Para texto corrido, priorizar contraste WCAG AA. Não usar `#a0815c` ou `#d0baa0` como texto pequeno sobre branco.
- A fonte Collection New Style exige licença comercial/web apropriada antes de uso em site. Até a licença ser fornecida, não carregar arquivo de fonte não licenciado.
- SALVAGER consta no manual, mas arquivo/licença não foram fornecidos. Não presumir direito de uso web.
- Poppins pode ser carregada via Google Fonts. Enquanto SALVAGER não tiver licença webfont, usar Cormorant Garamond (SUBSTITUTA, SUGESTÃO) no display: só a partir de 24px, peso 500 na headline e 600 nos títulos em caixa alta, nunca 300. Abaixo de 24px, Poppins. Assinatura cursiva somente via logo SVG.
- Nunca usar no site: a pesquisa de valores da p. 10 do PDF, a foto de família da p. 21 e as imagens de banco da p. 20.
- Formação acadêmica: AGUARDANDO CLIENTE. Construir sem ela, com bloco comentado no HTML.
- Não usar em-dash nos textos do projeto.
- `_originais/` contém os arquivos-fonte da marca (PSD, EPS, PDF). Consulte se precisar, mas o site usa somente os arquivos de `assets/`.

## Padrões de animação (GSAP)
Toda seção nova (Avaliações, CTA, Contato, Rodapé e o que vier depois) segue este sistema. A lógica fica em `js/animations.js`; a seção só precisa dos atributos e da estrutura abaixo. Não criar animações soltas em `main.js` nem em CSS de entrada.

**Setup:** GSAP 3.15 via jsDelivr (`gsap`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`, todos gratuitos), scripts com `defer` e `integrity` (SRI), nessa ordem, antes de `main.js` e `animations.js`.

**Regras gerais**
- **Tudo é guiado pela rolagem (scrub).** Toda animação de entrada usa `scrub: 1` (suavização de 1 s), começa com o elemento a 85% da altura da tela e termina a 50%. Se a pessoa rolar de volta, o efeito volta junto. Nada de gatilho único (`once`) nas entradas. Use sempre `clamp()` no início e no fim (`clamp(top 85%)`) para o efeito terminar mesmo no fim da página.
- **Exceção: o hero** anima ao carregar (não depende de rolagem), em sequência, com o CTA visível em até 1,5 s.
- `gsap.matchMedia()` com 3 cenários: desktop (`min-width: 64rem`), mobile (`max-width: 63.99rem`, deslocamentos em y pela metade e sem parallax) e `prefers-reduced-motion` (sem animação, tudo visível).
- Conteúdo visível sem JavaScript. A classe `js-anim` no `<html>` é adicionada só pelo `animations.js` quando o GSAP carregou e não há movimento reduzido. O CSS só esconde `[data-anim]` e `[data-hero]` sob `.js-anim`. Nunca esconder conteúdo por outro caminho.
- Animar só `transform`, `opacity` e `clip-path`. Nunca width, height, top, margin nem letter-spacing. O `visibility` é usado só para revelar o elemento depois de preparar os filhos.
- Easing `none` nos efeitos com scrub (o ritmo vem da rolagem) e `expo.out` no hero. Proibido bounce, elastic e back, typewriter, scramble e letras girando.
- Sem pin de seção, sem scroll horizontal, sem smooth scroll que sequestre a rolagem nativa.
- SplitText por linhas e palavras, **nunca por caracteres** (para não separar letra e acento). Sempre com `autoSplit: true` e a animação criada dentro de `onSplit()` (retornando a animação). `aria` fica em `auto`, então leitores de tela leem o texto original. Máscaras de linha usam `linesClass: 'sl'` (a classe `.sl-mask` tem folga para acentos de Cormorant).
- Nenhuma animação pode causar overflow horizontal em 360 px. Testar 360 e 1440 px rolando devagar, rápido e de volta para cima.

**Atributos (`data-anim`)**
| Valor | Onde | Efeito (todos em scrub) |
|---|---|---|
| `title` | h2/h3 de seção | linhas sobem de máscara |
| `eyebrow` | `<p class="eyebrow"><span class="eyebrow__line"></span><span class="eyebrow__text">...</span></p>` | linha cresce, depois o texto entra pela esquerda |
| `text` | parágrafos | linhas com opacity 0 para 1 e y 20 para 0; no mobile, parágrafo com mais de 160 caracteres anima como bloco |
| `quote` | frase de destaque | palavras de opacity 0.15 para 1 em sequência, linhas subindo de 20 px para 0 (início a 80%, fim a 40%) |
| `cred` | credencial ou proposta: `.rule--top`, `.cred__text`, `.rule--bottom` (cada `.rule` com 2 `<i>`) | linhas de bronze crescem das pontas para o centro, texto depois |
| `cards` | `<ol>` de `.card` (`.card__num`, `.line`, `.card__title`, `.card__media` opcional) | cada card entra (y 40 para 0) na sua vez; número antes do nome |
| `list` | `<ul>` de `<li>` com `.line--top` (e `.line--bottom` nos últimos) e `.li__text` | cada item entra (y 40 para 0); o divisor de 1px cresce antes do texto. Usar também para listas de contato |
| `valores` | `<ul>` de `.valor` com `.valor__icone path` e `<span>` | losango desenhado (DrawSVG), palavra aparece depois |
| `draw` | `<svg>` decorativo com paths de traço | contorno desenhado com DrawSVG |
| `photo` | `<figure class="photo">` com `.photo__clip > .photo__inner > (img ou .photo-placeholder)`, `--ratio` no style e `.photo__frame` opcional | clip-path de baixo para cima, zoom 1.15 para 1, parallax (yPercent -8 a 8) só no desktop |
| `fade` | qualquer bloco | opacity 0 para 1 e y 20 para 0 |
| `line` | `.line` isolada | scaleX de 0 a 1, origin left |

O hero usa `data-hero` (`eyebrow`, `title`, `subtitle`, `creds`, `cta`, `note`, `photo`) e roda ao carregar.

**Hover e header:** links do menu e do rodapé usam sublinhado de 1px que cresce da esquerda (`.hover-underline` no rodapé). Botões `.btn` ganham efeito roll (texto duplicado com `aria-hidden`, criado pelo JS). O header esconde ao rolar para baixo e volta ao rolar para cima.

## Texto em Unicode NFC
Todo texto do projeto (HTML, MD, CSS, JS, JSON) deve estar em NFC (letra acentuada em um único code point, ex.: `ê` = U+00EA). Texto copiado de PDF pode vir em NFD (letra + acento combinante U+0300 a U+036F), que desloca os acentos em algumas fontes. Antes de commitar, conferir com: `python -c "import re,sys;print(len(re.findall('[̀-ͯ]',open(sys.argv[1],encoding='utf8').read())))" arquivo` (deve dar 0) e normalizar com `unicodedata.normalize('NFC', texto)`.

## Estrutura recomendada do projeto
```text
projeto-dra-mariana/
├── CLAUDE.md
├── design-system.md
├── content.md
├── assets.md
├── tokens.css
├── tokens.json
├── assets/
│   ├── logo/
│   │   ├── logo-principal.svg
│   │   ├── logo-simbolo.svg
│   │   ├── logo-selo.svg
│   │   ├── logo-escala-cinza.svg
│   │   ├── logo-negativa.svg
│   │   ├── logo-positiva.svg
│   │   ├── logo-selo-escala-cinza.svg
│   │   ├── logo-selo-negativa.svg
│   │   ├── logo-selo-positiva.svg
│   │   └── favicon.svg
│   └── img/
├── referencia/
│   ├── REFERENCIA.md
│   ├── reference-tokens.css
│   └── screens/
└── _originais/
```

## Estrutura da landing page
1. Header compacto com logo e CTA de agendamento apenas se o destino real for fornecido.
2. Hero com posicionamento e imagem autorizada da médica.
3. Sobre / propósito.
4. Valores e abordagem.
5. Dermatologia / atendimento: não listar procedimentos não fornecidos.
6. Diferenciais de experiência, sem alegações comparativas.
7. CTA de consulta.
8. Rodapé com CRM/RQE e contatos somente quando fornecidos.

## Direção visual
Editorial, sofisticada e humana. Muito espaço negativo, fundos `#ffffff` e `#e9e6e1`, texto `#414042`, bordô `#762d2d` para ênfase/CTA, terrosos `#a0815c` e `#d0baa0` como superfícies e detalhes. Fotografias naturais e profissionais, com pele real, luz suave, tons quentes e preto e branco quando coerente com o manual.

## Critério de aceite
A implementação final deve funcionar sem consultar os arquivos originais. Quando um dado estiver marcado como `Ausente no material`, manter placeholder de desenvolvimento claramente marcado ou omitir a seção/componente até receber o dado real.
