# AUDITORIA.md

Auditoria do site da Dra. Mariana Zunino em 26/09/2026. Nada foi corrigido: este arquivo é o único que foi criado. O estado auditado é o working tree (inclui alterações ainda não commitadas, ver item C1).

**Como foi feito:** leitura estática de `index.html`, CSS e JS (parser de HTML, contagem de ids, headings, classes e variáveis); medição no Chrome em iframes de 320, 360, 390, 414, 768, 1024, 1366x650, 1440x780 e 1920x950 (alturas úteis, já descontada a barra do navegador); teste de cada link externo com `curl`; conferência do SRI baixando cada arquivo da CDN; contraste calculado pelos estilos computados; teste do menu, do carrossel e das âncoras por script.

**Limites:** não consegui simular arrastar com o mouse nem deslizar com o dedo (o navegador de teste não gera esses eventos), então isso ficou sem verificação. O navegador de teste roda a página como oculta e o GSAP quase não avança, então **as animações não foram vistas rodando**. O navegador não expõe os tamanhos das requisições, então o peso vem de `gzip` dos arquivos locais e da CDN.

## Resumo

| Gravidade | Qtd | Destaques |
|---|---|---|
| Crítico | 2 | Pasta `_originais` (254 MB, com o PDF do manual) versionada e na raiz do site; trabalho recente sem commit |
| Alto | 5 | Links das avaliações todos iguais; marcas comerciais sem confirmação; placeholders; Google (fontes, mapa) sem aviso de privacidade; conteúdo escondido até o GSAP carregar |
| Médio | 10 | Sem "Avaliações" no menu; `@import` bloqueia render; Swiper e GSAP pesados; SEO e OG ausentes; áreas de toque; faixa de avaliações sem controle no desktop; aria-label apaga o texto da avaliação |
| Baixo | cerca de 25 | Viúvas nos títulos, CSS e JS mortos, tokens sem uso, SVGs sem uso, docs desatualizados |

O que está **bom**: sem erros de console, sem ids duplicados, HTML bem formado, um único h1 e sem pular níveis, todos os links externos respondem, SRI de todos os 6 arquivos da CDN confere, nenhuma âncora sem alvo, sem overflow horizontal em nenhuma das 9 larguras, todas as seções cabem na altura da tela nos 4 tamanhos de desktop testados, contraste AA em todas as combinações reais de texto, `prefers-reduced-motion` tratado no CSS e no JS, nenhum resto de Playfair, Tenor, Gilda, Marcellus ou EB Garamond no site (só em `_testes/`).

## 1. Bugs

| # | Problema | Onde | Gravidade | Correção proposta |
|---|---|---|---|---|
| B1 | Os 6 cards de avaliação e o link "Ver todas" apontam para o mesmo link (o perfil, `share.google/SD7QJqkNnq5ACpZ09`). O rótulo "Ver no Google" promete a avaliação individual e a leva ao perfil | `index.html` 337 a 397 e 411; `content.md` (Lacunas) | Alto | Obter o link "Compartilhar" de cada avaliação e trocar os `href`. Enquanto isso, trocar "Ver no Google" por texto que não prometa a avaliação, ou remover o link dos cards |
| B2 | O `aria-label="Ler avaliação de X no Google"` do link substitui o conteúdo do card: leitor de tela lê só o rótulo e nunca o texto da avaliação | `index.html` 337 a 397 (`a.review`) | Médio | Tirar o `aria-label` (o texto visível já é o nome acessível) ou usar `aria-describedby` apontando para o texto |
| B3 | O menu do header não tem "Avaliações" (o rodapé tem), então a seção só é alcançada rolando | `index.html` 52 a 56 | Médio | Incluir o link no menu (ou tirar do rodapé, por consistência). Confirmar que cabe em 1280 a 1439 px |
| B4 | A logo do rodapé usa `href="#topo"` nativo, sem o comportamento do header: deixa `#topo` na URL, e o rótulo é outro ("Mariana Zunino. Ir para o topo") | `index.html` 496; `js/main.js` (handler só em `.site-header__logo`) | Baixo | Aplicar o mesmo handler a todo `a[href="#topo"]` e padronizar o aria-label para "Voltar ao início" |
| B5 | Avaliações no desktop com altura útil de até 860 px viram uma faixa com rolagem lateral sem setas, contador nem dica. Com mouse só se chega aos cards 4 a 6 arrastando ou com shift+roda | `css/sections.css` bloco final (`max-height: 860px`) | Médio | Reaproveitar o par de setas do carrossel de Tratamentos, ou mostrar barra de rolagem visível e uma dica |
| B6 | Botão flutuante do WhatsApp cobre texto quando está visível: em 390 px, com o botão forçado visível, sobrepôs títulos, parágrafos, o botão "Como chegar" e itens do rodapé em 11 dos ~21 pontos de rolagem amostrados. Por design ele some ao rolar para baixo, mas volta ao rolar para cima e no fim da página | `css/components.css` (`.whatsapp-float`), `js/main.js` | Baixo | Aceitável como está por causa do esconde-ao-rolar. Se quiser mais folga: `padding-bottom` extra nos blocos finais e no botão do contato, ou esconder também ao parar |
| B7 | Verificado e funcionando | menu mobile (abre, fecha com Esc e ao escolher link, devolve foco, bloqueia o scroll do body); carrossel de Tratamentos (setas, contador "1 / 2" no desktop e "01 / 06" no mobile, barra de progresso, teclado, estado desabilitado das setas); âncoras do menu (topo da seção encosta na base do header em 6 de 6); logo volta ao topo e limpa o `#hash`; `tel:`, WhatsApp, Instagram, perfil no Google, mapa | n/a | n/a |
| B8 | **Não verificado:** arrastar com mouse e deslizar com o dedo no carrossel, e as animações de entrada rodando | `js/carrossel.js`, `js/animations.js` | n/a | Testar num aparelho real e num Chrome com a aba em primeiro plano |

Links externos testados (`curl`): `wa.me/5541991780320` 200; `share.google/SD7QJqkNnq5ACpZ09` 200 (abre a pesquisa do Google do consultório); `instagram.com/marianazunino.dermato/` 200 (o Instagram responde 200 até para perfis inexistentes, então isso não prova que o perfil existe); iframe do mapa `google.com/maps?cid=...&output=embed` 200; Google Fonts 200; CDN 6 de 6 com SRI conferido.

## 2. Responsividade

Overflow horizontal: **nenhum em 320, 360, 390, 414, 768, 1024, 1366, 1440 e 1920**. Texto cortado por overflow do próprio elemento: nenhum (um falso positivo em `.visually-hidden`, que é esperado).

| Largura | Overflow | Cobertura pelo botão do WhatsApp | Viúvas (última linha com 1 palavra) | Áreas de toque menores que 44 px |
|---|---|---|---|---|
| 320 | não | ver B6 | hero "essência."; "Mariana" (Sobre); "clínica" (Procedimentos); "história." (CTA) | logo do header 216x29 |
| 360 | não | ver B6 | as mesmas 4 mais "reservados." (rodapé) | logo 216x29 |
| 390 | não | ver B6 | as mesmas 5 | logo 232x31 |
| 414 | não | ver B6 | as mesmas 4 | logo 232x31 |
| 768 | não | ver B6 | "essência." e "clínica" | logo 232x31 |
| 1024 | não | ver B6 | "essência." | logo 232x31 |
| 1366x768 | não | ver B6 | "essência." | logo 220x29; 5 links do menu com 40 px de altura |
| 1440x900 | não | ver B6 | "essência." | logo 280x37; links do menu 40 px |
| 1920x1080 | não | ver B6 | "essência." | logo 280x37; links do menu 40 px |

Áreas de toque menores que 44x44 (todas as larguras, do mobile ao desktop):

| Elemento | Tamanho | Onde | Gravidade | Correção proposta |
|---|---|---|---|---|
| Logo do header | 216 a 280 x 29 a 37 | `.site-header__logo` | Médio | `min-height: 44px` com padding vertical |
| Links do menu desktop | 40 px de altura | `.site-nav__list a` | Baixo | `padding-block` maior |
| Links de contato dentro dos itens (endereço, telefone "Ligar", Instagram) | 22 px de altura | `.dados a` | Médio | Aumentar a área do link (padding ou o item inteiro clicável) |
| Links do menu do rodapé e contatos do rodapé | 32 px de altura | `.site-footer a` | Médio | `padding-block: 0.75rem` |
| Logo do rodapé | 272x36 | `.site-footer__logo` | Baixo | Mesmo ajuste da logo do header |
| "Tire suas dúvidas" e "Ver todas as avaliações" | 43 px | `.link-cta` | Baixo | `min-height: 44px` |

Viúvas: título do hero em 5 larguras, "Sobre a Dra. Mariana", "Dermatologia estética e clínica", "Sua pele, sua história." e o "reservados." do rodapé. Correção proposta única: `text-wrap: balance` em `h1, h2, .cta__title` e `text-wrap: pretty` nos parágrafos (hoje só `.valores__titulo` e a frase da abordagem têm). Gravidade baixa.

Seções na altura da tela (desktop, a partir de 1024 px e 600 px de altura): todas as 8 seções cabem, e nenhuma estoura. Medido: 1024x768 (707 de 707 px), 1366x650 (569), 1440x780 (699) e 1920x950 (869). O rodapé não é seção e tem altura natural (~514 px). Abaixo de 1024 px de largura ou de 600 px de altura a altura é natural, como pedido.

## 3. Acessibilidade

| # | Problema | Onde | Gravidade | Correção proposta |
|---|---|---|---|---|
| A1 | Contraste: única combinação abaixo do mínimo entre os 14 pares de cor reais do mobile (medição por estilos computados) é a aspa decorativa `#a0815c` sobre `#e9e6e1` (2,91:1, mínimo 3:1 por ser grande). É `aria-hidden`, então não afeta leitura | `.abordagem__aspas` | Baixo | Escurecer a aspa ou aceitar como ornamento |
| A2 | O rótulo do bloco reservado do Sobre ("TEXTO: aguardando…", 12 px, #414042 a 60% sobre branco) fica perto de 3,4:1, abaixo de 4,5:1. É placeholder e some quando o texto chegar | `.sobre__reserva-label` | Baixo | Nenhuma (temporário), ou usar 80% de opacidade |
| A3 | Os placeholders de foto usam `role="img"` com rótulo "Espaço reservado para…". Se a foto real entrar sem trocar o rótulo, o leitor de tela lerá "espaço reservado" | `index.html` 90, 134 e 155 a 230 | Médio | Ao trocar pelas `<img>`, escrever o `alt` real (ou `alt=""` se decorativa) e remover o `role` |
| A4 | O card de tratamento em vidro fosco tem contraste que depende da foto: 7,0:1 sobre o placeholder e 8,9:1 sobre foto clara, mas 4,4:1 sobre foto muito escura (número de 13 px) | `.card--trat .card__body` | Baixo | Rever com as fotos reais; se preciso, subir a opacidade do vidro de 70% para 80% |
| A5 | Foco visível: regra global `:focus-visible` (contorno de 3px em bordô, claro no rodapé, na faixa bordô e no botão do WhatsApp), sem nenhum `outline: none` | `css/base.css` 25 e 94 | OK | n/a |
| A6 | Teclado: skip-link "Ir para o conteúdo", menu com `aria-expanded`, `aria-controls` e `inert` quando fechado, Esc fecha e devolve o foco, carrossel com região focável e setas do teclado | `index.html`, `js/main.js`, `js/carrossel.js` | OK | n/a |
| A7 | Headings: um único `h1`; `h2` para as seções e `h3` dentro de Tratamentos e Abordagem; sem pular nível. O `h3` "Valores que orientam o cuidado" fica com `display: none` no mobile | `index.html` | OK | n/a |
| A8 | Alt: as 2 logos têm `alt="Mariana Zunino"`. Nenhuma outra imagem. Estrelas com `role="img"` e rótulo | `index.html` | OK | n/a |
| A9 | `prefers-reduced-motion`: o CSS zera transições e animações, o GSAP nem ativa a classe `js-anim`, o Swiper usa velocidade 0, a rolagem da logo vira instantânea e o aceno do carrossel não roda | `css/base.css`, `js/*.js` | OK | n/a |
| A10 | Os slides do carrossel fora da vista não recebem `aria-hidden` (mesmo comportamento do Swiper padrão). Nenhum conteúdo focável dentro deles | `.swiper-slide` | Baixo | Opcional |

## 4. Performance

Peso aproximado transferido (gzip) na primeira visita: **~220 KB**.

| Recurso | Tamanho (bruto / gzip) | Observação |
|---|---|---|
| `index.html` | 44,9 KB / 8,8 KB | |
| CSS próprio (`tokens` + `base` + `components` + `sections`) | 46,4 KB / 13,4 KB | `sections.css` é o maior (28 KB) |
| Swiper CSS (CDN) | 14,6 KB / 3,0 KB | |
| JS próprio (`main`, `carrossel`, `animations`) | 25,4 KB / 8,2 KB | |
| GSAP core + ScrollTrigger + SplitText + DrawSVG (CDN) | 129,6 KB / 52,3 KB | |
| Swiper JS bundle completo (CDN) | 152,8 KB / 43,9 KB | Todos os módulos, usa só navegação, paginação, a11y e teclado |
| Cormorant Garamond 500 e 600 (local, woff2) | 39,8 KB | Já está comprimido |
| Poppins 400 e 500 (Google Fonts, latin) | 15,6 KB | |
| Logo do header + logo do rodapé (SVG) | 72,6 KB / 28,5 KB | Os dois SVGs de ~36 KB cada |
| Favicon SVG + PNG + apple-touch | 22 KB / 12 KB | |

Não há imagens raster. Nenhum script bloqueia render (todos com `defer`).

| # | Problema | Onde | Gravidade | Correção proposta |
|---|---|---|---|---|
| P1 | `@import url("../tokens.css")` no topo do `base.css`: o navegador só descobre o `tokens.css` depois de baixar o `base.css` (requisição encadeada em CSS que bloqueia o render) | `css/base.css` linha 1 | Médio | Trocar por `<link rel="stylesheet" href="tokens.css">` antes do `base.css` no `index.html` (ou concatenar) |
| P2 | Conteúdo do hero e das seções começa escondido (`.js-anim`) e só aparece depois que o GSAP (CDN) carrega e executa. Se a CDN demorar, o primeiro conteúdo demora (a classe só entra quando o GSAP existe, então não fica em branco para sempre, mas atrasa) | `js/animations.js`, CSS `.js-anim` | Alto | Hospedar GSAP e Swiper em `assets/vendor/` (mesma origem, cacheável), e/ou limitar o tempo de espera para revelar o conteúdo |
| P3 | Swiper completo (153 KB / 44 KB gz) carregado para um único carrossel abaixo da dobra | `index.html` 539 | Médio | Usar o build modular (só Navigation, Pagination, A11y, Keyboard) ou carregar sob demanda quando a seção se aproxima |
| P4 | 4 arquivos do GSAP (130 KB) em 4 requisições. Todos são usados: SplitText (títulos e textos), DrawSVG (losangos), ScrollTrigger (tudo) | `index.html` 534 a 537 | Baixo | Considerar a versão combinada, ou reduzir os efeitos |
| P5 | As duas logos SVG têm ~36 KB cada (vetorização aproximada de imagem, ver `assets.md`). A do rodapé só aparece no fim da página | `assets/logo/logo-horizontal-*.svg` | Baixo | Otimizar com SVGO ou redesenhar a arte vetorial; `loading` não se aplica a SVG em `<img>`, mas pode ser `fetchpriority`/`decoding` |
| P6 | Só o Cormorant 500 tem `preload`. O 600 (títulos em caixa alta) é descoberto tarde | `index.html` 29 | Baixo | Preload do 600 se algum título fica acima da dobra em telas comuns |
| P7 | Carrega 3 domínios de terceiros (Google Fonts, jsDelivr, Google Maps) | `index.html` | Baixo | Hospedar Poppins localmente também (ver Priv1) |
| P8 | 11 dos 16 SVGs de `assets/logo/` não são usados pelo site (~500 KB no repositório, 0 KB transferidos) | `assets/logo/` | Baixo | Mover para `_originais/` ou documentar. Só `logo-horizontal-header`, `logo-horizontal-original-claro` e o favicon são usados |
| P9 | Nenhum arquivo de `_testes/` é referenciado pelo `index.html`, CSS ou JS (verificado) | n/a | OK | n/a |

Fontes carregadas: **Cormorant Garamond 500 e 600** (local) e **Poppins 400 e 500** (Google Fonts). Nada mais. O itálico do Cormorant usado na assinatura mobile ("Dra. Mariana Zunino") não tem arquivo: o navegador sintetiza o oblíquo (falso itálico). Gravidade baixa; correção: incluir o Cormorant itálico 500 ou trocar o estilo.

Bibliotecas carregadas e não usadas: nenhuma. GSAP (todos os plugins) e Swiper estão em uso. Há **2 handlers mortos** em `animations.js` (ver seção 5).

## 5. Código

| # | Problema | Onde | Gravidade | Correção proposta |
|---|---|---|---|---|
| C1 | **Trabalho sem commit.** `git status` mostra modificados `css/base.css`, `css/sections.css`, `js/animations.js`, `js/main.js` e novo `_testes/teste-cards-tratamento.html`. Ali estão a altura exata das seções no clique do menu, o header que fica visível ao clicar, o card em vidro fosco e a medição fracionária do header. O último commit é "sobre aguardando texto da cliente" | working tree | Crítico | Commitar (ou descartar) antes de qualquer outra coisa. Sugestão de mensagem: "tratamentos em vidro fosco e altura exata das secoes" |
| C2 | A pasta `_originais/` (**254 MB**) está no repositório (13 arquivos rastreados) e na mesma raiz do site. Contém `MarianaZunino.pdf` (manual da marca, com a pesquisa de valores da p. 10, a foto de família da p. 21 e as imagens de banco da p. 20, que o `CLAUDE.md` proíbe usar), os PSD e EPS. Se a hospedagem publicar a raiz do projeto, tudo isso fica público. `referencia/` (2 MB, capturas de outro site) e `_testes/` (268 KB, 11 arquivos rastreados) idem | raiz do projeto, sem `.gitignore` | Crítico | Publicar só o necessário (`index.html`, `css/`, `js/`, `assets/`), ou mover os materiais de trabalho para fora da pasta publicada e adicionar `.gitignore`. Nunca subir `_originais/` |
| C3 | HTML válido: sem ids duplicados, sem tags não fechadas, sem âncoras sem alvo, `target="_blank"` todos com `rel="noopener"` | `index.html` | OK | n/a |
| C4 | Bloco antigo de "cards tipográficos numerados" (`.cards`, `.card`, `.card__body`, `.card__media` 4/5, `.card__num`, `.card__line`) continua no CSS. A classe `.cards` não existe mais no HTML; `.card` só serve de base para `.card--trat` e `.card--review`, e é toda sobrescrita | `css/sections.css` linhas 49 a 57 | Baixo | Remover o que não é usado e deixar só o mínimo comum |
| C5 | Handlers de animação sem nenhum elemento usando: `quote` (frase da abordagem agora usa `fade`) e `line` | `js/animations.js` linhas 80 e 239 | Baixo | Remover (e, com `quote`, o uso de SplitText por palavra) |
| C6 | Classes CSS sem uso no HTML: `.section--sand`, `.title-sub`. `.sobre__formacao` e `.sobre__lista` são o bloco de Formação comentado, de propósito | `css/base.css`, `css/sections.css` | Baixo | Remover `.section--sand` e `.title-sub`; manter as de Formação |
| C7 | Tokens definidos e nunca usados: `--bp-*`, `--color-accent`, `--color-focus`, `--color-surface`, `--color-text-inverse`, `--font-script`, `--fs-display`, `--fs-h1`, `--fs-lead`, `--lh-display`, `--lh-h1`, `--lh-lead`, `--radius-*`, `--shadow-soft`, `--space-32` e outros. Variáveis usadas sem definição (com valor de reserva): `--header-h` (definida por JS), `--ratio` e `--rule-color` (inline/local) | `tokens.css`, `tokens.json` | Baixo | Limpar ou marcar como reserva do design system |
| C8 | Regra duplicada de overrides do desktop: `sections.css` tem um bloco grande `@media (min-width: 64rem) and (min-height: 600px)` que sobrescreve valores definidos antes no mesmo arquivo (hero, tratamentos, contato). Funciona, mas dificulta manutenção | `css/sections.css` final do arquivo | Baixo | Consolidar por seção quando a fase de ajustes acabar |
| C9 | Restos de tentativas antigas: **nenhum** no site. Playfair Display, Gilda Display, Marcellus, EB Garamond e Tenor Sans só aparecem em `_testes/teste-acentos.html` e `_testes/teste-fontes.html` | `_testes/` | Baixo | Apagar `_testes/` antes do deploy (ver C2) |
| C10 | Documentação e comentários possivelmente desatualizados sobre fontes, layout e seções (ex.: `assets.md` e `design-system.md` ainda podem descrever o Google Fonts para Cormorant e o Sobre com texto). O `CLAUDE.md` e o `tokens.css` já foram atualizados | `assets.md`, `design-system.md`, `content.md` | Baixo | Revisar. Em especial, `content.md` diz "Prova social: Ausente no material" mas o site tem a seção Avaliações (documentada mais abaixo no mesmo arquivo) |

## 6. Conteúdo

| # | Problema | Onde | Gravidade | Correção proposta |
|---|---|---|---|---|
| K1 | **Placeholders visíveis:** 8 espaços de foto com o texto "FOTO: ..." (retrato do hero, retrato do Sobre e 6 tratamentos) e o bloco "TEXTO: aguardando a Dra. Mariana" no Sobre | `index.html` 90, 134, 155 a 230 e 296 | Alto (para publicar) | Aguardar fotos e texto da cliente. Não publicar antes |
| K2 | **Marcas comerciais publicadas sem a confirmação da cliente:** "Sculptra e Radiesse", "Skinbooster", "Profhilo" na lista de Procedimentos. O `content.md` registra isso como pendência em aberto | `index.html` 265 a 268; `content.md` (Em aberto) | Alto | Confirmar com a cliente. Enquanto não houver, usar só os termos genéricos (bioestimulador de colágeno, hidratação injetável, biorremodelador) |
| K3 | Nenhum texto marcado como SUGESTÃO não aprovada está no ar (as sugestões do `content.md` foram removidas ou nunca entraram). A meta description e o `og:description` são texto derivado do site, sem alegação de resultado | `index.html` 8 a 20 | OK | n/a |
| K4 | Acentos: nenhum texto em NFD (0 caracteres combinantes em HTML, CSS, JS, `content.md` e `CLAUDE.md`). Os acentos deslocados do Cormorant foram corrigidos na fonte hospedada (`assets/fonts/`) | todo o projeto | OK | n/a |
| K5 | Erros de digitação nos textos que não vêm das avaliações: nenhum encontrado (todo o texto visível foi lido). "Atendimento particular." aparece 3 vezes (nota do hero, CTA, contato) e "Segunda a sexta, das 9h às 12h e das 13h às 18h" 2 vezes, de propósito | `index.html` | OK | n/a |
| K6 | Sem em-dash nem en-dash nos textos do projeto (regra do `CLAUDE.md`) | todo o projeto | OK | n/a |
| K7 | Formação acadêmica continua pendente (bloco comentado no HTML, conforme combinado) | `index.html` 121 a 129 | Baixo | Ativar quando a cliente enviar |
| K8 | A nota "5,0 no Google, 61 avaliações" e os 6 textos são estáticos, com data de coleta 25/09/2026 num comentário. Vão ficar defasados | `index.html` 321 a 397 | Baixo | Reatualizar a cada coleta, como já registrado |

## Privacidade e SEO (fora da lista original, mas relevantes)

| # | Problema | Onde | Gravidade | Correção proposta |
|---|---|---|---|---|
| Priv1 | O site carrega o Google Fonts (Poppins), o mapa do Google (iframe) e a CDN jsDelivr, o que envia o IP do visitante a terceiros. Não há política de privacidade nem aviso de cookies/consentimento. Site de saúde no Brasil (LGPD) | `index.html` 25 a 31, 484 | Alto | Hospedar Poppins e as bibliotecas localmente; carregar o mapa só após clique ("Ver mapa"); incluir política de privacidade com o contato do responsável |
| SEO1 | Sem `og:image`, sem `og:url`, sem `<link rel="canonical">`, sem dados estruturados (JSON-LD `Physician`/`MedicalBusiness` com endereço, horário e telefone), sem `robots.txt` e sem `sitemap.xml`. O comentário do HTML já prevê `og:url` e `og:image` para quando houver domínio e imagem | `index.html` `<head>` | Médio | Adicionar quando houver domínio. O JSON-LD ajuda muito na busca local (Curitiba/Batel) |
| SEO2 | O rótulo `aria-label` dos links do WhatsApp e o texto "(abre em nova aba)" estão corretos, mas há 5 CTAs de WhatsApp com a mesma mensagem pré-preenchida. Não dá para saber de qual botão o paciente veio | `index.html` | Baixo | Opcional: variar o texto da mensagem ou usar UTM para medir |

## Ordem sugerida de correção

1. **Commitar o working tree** (C1) e **tirar `_originais/`, `referencia/` e `_testes/` do que vai ao ar** (C2).
2. **Decidir as pendências de conteúdo:** links individuais das avaliações (B1), marcas comerciais (K2), fotos e texto do Sobre (K1).
3. **Privacidade** (Priv1) e **carregamento do GSAP/Swiper** (P2, P3): hospedar localmente resolve as duas coisas.
4. **Acessibilidade e toque:** `aria-label` das avaliações (B2), alvos de 44 px, "Avaliações" no menu (B3).
5. **Limpeza:** `@import` (P1), código e CSS mortos, tokens, SVGs sem uso, viúvas (`text-wrap`), documentação.
