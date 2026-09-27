# CLAUDE.md

## Objetivo
Construir uma landing page responsiva para **Dra. Mariana Zunino, Dermatologista, Curitiba**, usando exclusivamente os dados e regras deste handoff. A página deve comunicar cuidado profundo, naturalidade, conhecimento, acolhimento e segurança, com conversão para agendamento sem promessas de resultado médico.

## Fontes de verdade
1. `content.md`: textos e dados profissionais extraídos do material.
2. `design-system.md`: identidade, acessibilidade, UI e regras de uso.
3. `site/css/tokens.css` e `tokens.json`: tokens de implementação.
4. `assets.md`: proveniência e status de cada asset.
5. `site/assets/logo/`: SVGs preparados para implementação (só os usados; os demais ficam em `_originais/logos-nao-usadas/`).
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
- Cormorant Garamond 500 e 600 é hospedada em `site/assets/fonts/` (woff2 latin, licença SIL OFL 1.1 em `site/assets/fonts/OFL.txt`), não mais pelo Google Fonts. É cópia modificada da v4.001: os acentos de U+00C0 a U+00FF foram recentralizados na horizontal, porque no original o acento sai deslocado para o lado. Não voltar a carregar a versão do Google.
- Desktop (1024px+ de largura e 600px+ de altura): cada seção ocupa `100svh - --header-h` (o `main.js` mede o header), com conteúdo centralizado e medidas por vh. Abaixo disso, altura natural.
- Poppins pode ser carregada via Google Fonts. Enquanto SALVAGER não tiver licença webfont, usar Cormorant Garamond (SUBSTITUTA, SUGESTÃO) no display: só a partir de 24px, peso 500 na headline e 600 nos títulos em caixa alta, nunca 300. Abaixo de 24px, Poppins. Assinatura cursiva somente via logo SVG.
- Nunca usar no site: a pesquisa de valores da p. 10 do PDF, a foto de família da p. 21 e as imagens de banco da p. 20.
- Formação acadêmica: AGUARDANDO CLIENTE. Construir sem ela, com bloco comentado no HTML.
- Avaliações do Google só entram se forem sóbrias: sem superlativos ("a melhor", "excelente", "impecável"), sem promessa ou descrição de resultado, sem elogio à técnica ou ao resultado de procedimentos e sem detalhe de saúde do paciente (Resolução CFM 2.336/2023). No máximo um corte por texto, marcado com reticências, e nunca alterar palavras, nem corrigir erros de digitação. Sem data no card. O registro dos textos e links fica em `content.md`.
- Não usar em-dash nos textos do projeto.
- `_originais/` contém os arquivos-fonte da marca (PSD, EPS, PDF). Consulte se precisar, mas o site usa somente os arquivos de `site/assets/`. `_originais/`, `_testes/` e `referencia/` não vão para o git (`.gitignore`) e nunca são publicados.
- **Somente a pasta `site/` é publicada.** Domínio definitivo: https://dermatomarianazunino.com (sem www). Falta antes de publicar: `CHECKLIST-PUBLICACAO.md`. Na raiz ficam apenas documentos de trabalho (CLAUDE.md, content.md, design-system.md, assets.md, tokens.json, AUDITORIA.md, AUDITORIA-CFM.md) e as pastas de material de apoio.

## Conformidade com a Resolução CFM nº 2.336/2023 (publicidade médica)
Regras conferidas contra o texto oficial em 27/09/2026 (ver `AUDITORIA-CFM.md` para a auditoria completa, artigo por artigo). Valem para qualquer texto, imagem ou dado estruturado novo, daqui em diante:
- **Identificação completa (art. 4º e 6º):** sempre que o nome da médica aparecer com o CRM, incluir também a palavra "Médica" e a especialidade junto do RQE. Formato de referência: "Dra. Mariana Zunino, Médica, CRM/PR 26153, Dermatologista, RQE 19939" (hero, Sobre e rodapé já seguem esse formato). No JSON-LD, `identifier` (CRM e RQE) precisa estar presente, não só em texto visível.
- **Sem marcas comerciais (art. 11, XVIII, c):** nenhuma marca de produto, equipamento ou fabricante (ex.: Sculptra, Radiesse, Profhilo, Skinbooster, Botox, Ultraformer, Fotona) em nenhum texto, `alt`, JSON-LD ou imagem publicados. Usar sempre o termo técnico genérico. Marcas citadas em documentos de trabalho (como `content.md`) como pendência não podem ir para `site/`.
- **Sem promessa de resultado (art. 11, XII e § 2º):** nenhum texto pode garantir, prometer ou insinuar resultado de tratamento. Revisar frase por frase qualquer texto novo, inclusive headlines e nomes de seção.
- **Sem sensacionalismo nem autopromoção (art. 11, XVI):** sem superlativos ("melhor", "referência", "excelência", "única"), sem comparação com outros profissionais, sem linguagem sedutora ou de urgência.
- **Avaliações tratadas como fala da própria médica (art. 8º, § 3º):** ao curar avaliações do Google (ou qualquer depoimento), aplicar as mesmas regras de resultado e sensacionalismo acima, mesmo sendo palavras de terceiros. Frases que soem como recomendação/endosso direto (ex.: "recomendo muito") podem ser cortadas com reticências, seguindo a regra já existente de avaliações (linha acima) de nunca alterar palavras, só cortar.
- **Conteúdo educativo de tratamento (art. 14, I):** qualquer parágrafo que descreva um tratamento específico (não só o nome, uma descrição de como funciona ou o que esperar) precisa trazer indicações terapêuticas, fatores que influenciam o resultado e as complicações descritas na literatura. Hoje "Tratamentos" e "Procedimentos" só têm nomes, sem descrição, então essa regra ainda não se aplica; se algum dia ganharem texto descritivo, ele precisa vir completo.
- **Imagens de paciente:** nenhuma foto de antes/depois, nenhuma foto de paciente com rosto identificável sem autorização por escrito, nenhuma imagem editada para sugerir resultado (ver os comentários nos cards de "Tratamentos" no `index.html`).

## Padrões de animação (GSAP)
Toda seção nova (Contato, Rodapé, CTA final e o que vier depois) segue este sistema. A lógica fica em `site/js/animations.js`; a seção só precisa dos atributos e da estrutura abaixo. Não criar animações soltas em `main.js` nem em CSS de entrada.

**Setup:** GSAP 3.15 hospedado em `site/assets/vendor/` (`gsap`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin`, todos gratuitos), scripts com `defer`, nessa ordem, antes de `main.js` e `animations.js`. Nada de CDN.

**Regras gerais**
- `gsap.matchMedia()` com 3 cenários: desktop (`min-width: 64rem`), mobile (efeitos mais curtos e leves) e `prefers-reduced-motion` (sem animação, tudo visível).
- Conteúdo visível sem JavaScript. A classe `js-anim` no `<html>` é adicionada só pelo `animations.js` quando o GSAP carregou e não há movimento reduzido. O CSS só esconde `[data-anim]` e `[data-hero]` sob `.js-anim`. Nunca esconder conteúdo por outro caminho. Rede de segurança: se a animação do hero não começar em 1,5 s, o `animations.js` remove `js-anim` e revela tudo.
- Easing `expo.out` ou `power3.out`, durações de 0,8 s a 1,4 s. Proibido bounce, elastic e back, typewriter, scramble e letras girando.
- Animar só `transform`, `opacity`, `clip-path` (e `visibility` via autoAlpha). Nunca width, height, top, margin. Única exceção pedida: `letter-spacing` dos títulos em caixa alta (de 0.02em ao valor final).
- Sem pin de seção, sem scroll horizontal, sem smooth scroll que sequestre a rolagem nativa.
- Entradas com `once: true`. Só parallax e scrub reagem ao rolar de volta.
- SplitText sempre com `autoSplit: true` e animação criada dentro de `onSplit()` (retornando a animação). `aria` fica em `auto` em títulos, então leitores de tela leem o texto original; em parágrafos (`<p>`) usar `aria: 'none'`, porque o `aria-label` que o modo `auto` cria é atributo proibido em `<p>` (o Lighthouse reprova). Máscaras de linha usam `linesClass: 'sl'` (classe `.sl-mask` tem folga para acentos de Cormorant).
- Nenhuma animação pode causar overflow horizontal em 360 px. Testar 360, 390 e 1440.

**Atributos (`data-anim`)**
| Valor | Onde | Efeito |
|---|---|---|
| `title` | h2/h3 de seção | linhas sobem de máscara; em caixa alta o letter-spacing abre |
| `eyebrow` | `<p class="eyebrow"><span class="eyebrow__line"></span><span class="eyebrow__text">...</span></p>` | linha cresce, depois o texto entra pela esquerda |
| `text` | parágrafos | linhas com fade e y 20 para 0, stagger 0.06; no mobile, parágrafo com mais de 160 caracteres anima como bloco |
| `cred` | credencial ou proposta: `.rule--top`, `.cred__text`, `.rule--bottom` (cada `.rule` com 2 `<i>`) | linhas de bronze crescem das pontas para o centro, texto depois |
| `cards` | `<ol>` de `.card` (`.card__num`, `.line`, `.card__title`, `.card__media` opcional) | cards em stagger; número antes do nome |
| `list` | `<ul>` de `<li>` com `.line--top` (e `.line--bottom` nos últimos) e `.li__text` | divisor de 1px cresce antes do texto, stagger 0.05. Usar também para listas de contato |
| `valores` | `<ul>` de `.valor` com `.valor__icone path` e `<span>` | losango desenhado (DrawSVG), palavra aparece depois |
| `draw` | `<svg>` decorativo com paths de traço | contorno desenhado com DrawSVG |
| `photo` | `<figure class="photo">` com `.photo__clip > .photo__inner > (img ou .photo-placeholder)`, `--ratio` no style e `.photo__frame` opcional | clip-path de baixo para cima, zoom 1.15 para 1, parallax no desktop |
| `fade` | qualquer bloco | fade com y 20 para 0 |

O hero usa `data-hero` (`eyebrow`, `title`, `subtitle`, `creds`, `cta`, `note`, `photo`) e roda em sequência ao carregar, com o CTA visível em ~1,2 s.

**Hover e header:** links do menu e do rodapé usam sublinhado de 1px que cresce da esquerda (`.hover-underline` no rodapé). Botões `.btn` ganham efeito roll (texto duplicado com `aria-hidden`, criado pelo JS). O header esconde ao rolar para baixo e volta ao rolar para cima.

## Texto em Unicode NFC
Todo texto do projeto (HTML, MD, CSS, JS, JSON) deve estar em NFC (letra acentuada em um único code point, ex.: `ê` = U+00EA). Texto copiado de PDF pode vir em NFD (letra + acento combinante U+0300 a U+036F), que desloca os acentos em algumas fontes. Antes de commitar, conferir com: `python -c "import re,sys;print(len(re.findall('[\u0300-\u036f]',open(sys.argv[1],encoding='utf8').read())))" arquivo` (deve dar 0) e normalizar com `unicodedata.normalize('NFC', texto)`.

## Estrutura do projeto
```text
projeto-dra-mariana/
├── CLAUDE.md, content.md, design-system.md, assets.md, tokens.json, AUDITORIA.md   (documentos de trabalho)
├── .gitignore                       (ignora _originais/, _testes/, referencia/, .DS_Store, Thumbs.db)
├── site/                            (ÚNICA pasta publicada)
│   ├── index.html, privacidade.html, 404.html
│   ├── robots.txt, sitemap.xml, manifest.webmanifest
│   ├── .htaccess                    (Apache; validar na hospedagem final)
│   ├── css/  (tokens.css, base.css, components.css, sections.css)
│   ├── js/   (main.js, carrossel.js, animations.js)
│   └── assets/
│       ├── fonts/   (Cormorant Garamond, Poppins, OFL.txt)
│       ├── og-image.jpg  (logo + foto do hero), img/ (fotos otimizadas)
│       ├── logo/    (somente os SVG/PNG usados)
│       └── vendor/  (GSAP, Swiper, quando hospedados)
├── _originais/       (PSD, EPS, PDF, logos não usadas; fora do git)
├── _testes/          (páginas de teste; fora do git)
└── referencia/       (capturas e notas de outro site; fora do git)
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
