# design-system.md

## 1. Inventário de arquivos

| Status | Arquivo | Tipo | Leitura | Conteúdo / observação | Origem |
|---|---|---|---|---|---|
| EXTRAÍDO | `MarianaZunino.pdf` | PDF, 27 páginas | Sim, inspeção página a página por renderização | Branding, propósito, valores, tom de voz, imagem, diferencial, guia visual, paleta, fontes e exemplos de aplicação | arquivo enviado |
| EXTRAÍDO | `logotipo-mariana-zunino.eps` | EPS binário DOS | Sim | EPS exportado pelo Adobe Photoshop CS5; conteúdo principal identificado como `ImageData`, portanto raster encapsulado, não vetor editável | arquivo enviado |
| EXTRAÍDO | `logotipo-mariana-zunino.psd` | PSD | Parcial | 4961x3508, RGB, múltiplas camadas raster detectáveis; formas vetoriais reutilizáveis não confirmadas | arquivo enviado |
| EXTRAÍDO | `logotipo-mariana-zunino.png` | PNG RGBA | Sim | logo principal colorida, fundo transparente | arquivo enviado |
| EXTRAÍDO | `logotipo-mariana-zunino-escala-cinza.png` | PNG RGBA | Sim | logo em escala de cinza | arquivo enviado |
| EXTRAÍDO | `logotipo-mariana-zunino-negativo.png` | PNG RGBA | Sim | logo monocromática escura conforme arquivo | arquivo enviado |
| EXTRAÍDO | `logotipo-mariana-zunino-positivo.png` | PNG RGBA | Sim | logo monocromática branca conforme arquivo | arquivo enviado |
| EXTRAÍDO | `Selo-MarianaZunino.eps` | EPS binário DOS | Sim | EPS exportado pelo Photoshop; imagem raster encapsulada | arquivo enviado |
| EXTRAÍDO | `Selo-MarianaZunino.psd` | PSD | Parcial | 3508x3508, RGB, múltiplas camadas raster detectáveis; formas vetoriais reutilizáveis não confirmadas | arquivo enviado |
| EXTRAÍDO | `Selo-MarianaZunino.png` | PNG RGBA | Sim | selo circular colorido | arquivo enviado |
| EXTRAÍDO | `Selo-MarianaZunino-escala-cinza.png` | PNG RGBA | Sim | selo circular em escala de cinza | arquivo enviado |
| EXTRAÍDO | `Selo-MarianaZunino-negativo.png` | PNG RGBA | Sim | selo monocromático escuro | arquivo enviado |
| EXTRAÍDO | `Selo-MarianaZunino-positivo.png` | PNG RGBA | Sim | selo monocromático branco | arquivo enviado |

### Cobertura do PDF
- p. 1: abertura "BRANDING / sua marca é você".
- p. 2: índice: introdução, manifesto, propósito, valores, momento, Golden Circle, tom de voz, imagem, diferencial, guia visual.
- p. 3-5: introdução, verdade/imagem e conceito de beleza.
- p. 6-8: propósito e aplicação de posicionamento.
- p. 9-10: valores e pesquisa de valores.
- p. 11-12: crenças/movimento e manifesto de cuidado.
- p. 13: tom de voz.
- p. 14: imagem percebida e projetada.
- p. 15: diferencial.
- p. 16-19: guia visual, logo, paleta e fontes.
- p. 20-26: referências/aplicações de feed, vídeos, destaques e mockup.
- p. 27: créditos do branding.

## 2. Logotipo e SVGs

**Conclusão técnica:** não foi encontrado vetor-fonte utilizável nos EPS recebidos. Ambos foram exportados pelo Photoshop e declaram dados de imagem raster. Por isso, para cumprir a entrega em SVG sem redesenhar a marca, os SVGs foram rastreados a partir dos PNGs transparentes de alta resolução. Todos são **APROXIMADO (vetorizado de imagem)**. A fidelidade pode cair em antialiasing, curvas muito finas e microdetalhes tipográficos. As cores dominantes do arquivo raster foram preservadas no rastreamento.

| Status | SVG | Versão | Origem | Uso recomendado |
|---|---|---|---|---|
| APROXIMADO | `assets/logo/logo-principal.svg` | principal colorida horizontal | `logotipo-mariana-zunino.png` | header claro, hero claro, assinatura institucional |
| APROXIMADO | `assets/logo/logo-simbolo.svg` | símbolo MZ | recorte do símbolo de `logotipo-mariana-zunino.png` | favicon grande, detalhes, avatar quando necessário |
| APROXIMADO | `assets/logo/favicon.svg` | símbolo MZ | mesma origem do símbolo | favicon |
| APROXIMADO | `assets/logo/logo-escala-cinza.svg` | escala de cinza | PNG homônimo | impressão/uso neutro |
| APROXIMADO | `assets/logo/logo-negativa.svg` | monocromática escura | PNG homônimo | fundos claros |
| APROXIMADO | `assets/logo/logo-positiva.svg` | monocromática branca | PNG homônimo | fundos escuros/fotográficos com contraste suficiente |
| APROXIMADO | `assets/logo/logo-selo.svg` | selo circular colorido | `Selo-MarianaZunino.png` | social, assinatura secundária, composição editorial |
| APROXIMADO | `assets/logo/logo-selo-escala-cinza.svg` | selo cinza | PNG homônimo | uso neutro |
| APROXIMADO | `assets/logo/logo-selo-negativa.svg` | selo escuro | PNG homônimo | fundos claros |
| APROXIMADO | `assets/logo/logo-selo-positiva.svg` | selo branco | PNG homônimo | fundos escuros |

### Validação visual
Todos os SVGs foram renderizados novamente para PNG e inspecionados visualmente. A composição, proporção geral, símbolo, nome e descriptor foram preservados. O `viewBox` foi recortado ao conteúdo opaco para eliminar margens transparentes externas.

### Área de proteção, tamanho mínimo, fundos e usos proibidos
- Área de proteção: **Ausente no material**.
- Tamanho mínimo oficial: **Ausente no material**.
- Fundos permitidos explicitamente: o manual demonstra logo escura sobre fundo claro (p. 17) e logo branca sobre fundo fotográfico/terroso (p. 23). Outros fundos: **Ausente no material**.
- Usos proibidos oficiais: **Ausente no material**.
- **SUGESTÃO (não consta no material):** usar área de proteção mínima igual à altura de "DERMATOLOGISTA" ao redor da assinatura. Justificativa: evita colisão visual sem alterar a marca.
- **SUGESTÃO (não consta no material):** mínimo de 180 px de largura para a logo completa e 32 px para o símbolo digital. Justificativa: preservar leitura do descriptor e traços finos.
- **SUGESTÃO (não consta no material):** nunca esticar, inclinar, recolorir, aplicar sombra, contorno, glow, gradiente ou separar elementos da composição original.

## 3. Paleta de cores

Valores abaixo são **EXTRAÍDOS** da página 18 do PDF, portanto têm precedência sobre amostras visuais.

| Status | Token | HEX | RGB | HSL | Função web proposta |
|---|---|---:|---|---|---|
| EXTRAÍDO | bronze | `#a0815c` | 160, 129, 92 | 33, 27%, 49% | primária de marca / detalhe |
| EXTRAÍDO | areia | `#d0baa0` | 208, 186, 160 | 32, 34%, 72% | secundária / superfície |
| EXTRAÍDO | off-white | `#e9e6e1` | 233, 230, 225 | 38, 15%, 90% | fundo suave |
| EXTRAÍDO | branco | `#ffffff` | 255, 255, 255 | 0, 0%, 100% | fundo |
| EXTRAÍDO | bordô | `#762d2d` | 118, 45, 45 | 0, 45%, 32% | apoio / destaque / CTA |
| EXTRAÍDO | grafite | `#414042` | 65, 64, 66 | 270, 2%, 25% | texto principal / apoio |

CMYK/Pantone: **Ausente no material**.

### Contraste WCAG para texto normal
| Texto | Fundo | Razão | Resultado |
|---|---|---:|---|
| `#414042` | `#ffffff` | 10.31:1 | AAA |
| `#414042` | `#e9e6e1` | 8.28:1 | AAA |
| `#414042` | `#d0baa0` | 5.51:1 | AA |
| `#762d2d` | `#ffffff` | 9.62:1 | AAA |
| `#762d2d` | `#e9e6e1` | 7.73:1 | AAA |
| `#762d2d` | `#d0baa0` | 5.14:1 | AA |
| `#ffffff` | `#414042` | 10.31:1 | AAA |
| `#ffffff` | `#762d2d` | 9.62:1 | AAA |

**SUGESTÃO (não consta no material):** para corpo de texto, limitar combinações às aprovadas acima. Bronze e areia devem atuar principalmente como superfície, borda, ícone ou detalhe, pois não atingem AA como texto pequeno sobre branco.

### Regras de cor (decisão da cliente/equipe)
- Texto corrido em `#414042`.
- CTA principal com fundo `#762d2d` e texto branco.
- `#a0815c` somente em títulos acima de 24px e em detalhes (linhas, ícones, bordas).
- Nunca texto branco sobre `#d0baa0`. Sobre `#d0baa0`, usar texto `#414042`.

## 4. Tipografia

Fontes **EXTRAÍDAS** da p. 19 do PDF.

| Status | Família | Uso no manual | Google Fonts / licença | Uso web |
|---|---|---|---|---|
| EXTRAÍDO | SALVAGER | nome/títulos serifados/display | Não identificada como Google Fonts no material. Arquivo e licença: Ausente no material. | Não embarcar até receber licença/webfont |
| EXTRAÍDO | Collection New Style | assinatura/script | Não é Google Fonts. Evidência externa indica uso pessoal gratuito e licença comercial necessária. | Reservar para acentos curtos após licenciamento |
| EXTRAÍDO | Poppins | sans serif | Google Fonts | corpo, UI, botões, labels |

Importação permitida para Poppins: `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap`.

### Regra de fontes enquanto não houver licença webfont confirmada
- **Display (no lugar de SALVAGER): Tenor Sans**, via Google Fonts. **SUGESTÃO (não consta no material)**, para aprovação. Importação: `https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap`.
- **Corpo: Poppins.**
- **Assinatura cursiva (Collection New Style): somente via logo SVG.** Não carregar arquivo de fonte nem usar `font-family` script.
- Ao receber a licença webfont de SALVAGER, ela substitui Tenor Sans.

### Escala web
A hierarquia e tamanhos exatos não constam no manual. A escala abaixo é **SUGESTÃO (não consta no material)**, baseada no contraste editorial visto nas pp. 16-26.

| Papel | Desktop | Mobile | Peso | Line-height | Família |
|---|---:|---:|---:|---:|---|
| display/hero | 4.5rem | 2.75rem | 400 | 1.00 | SALVAGER se licenciada; senão Tenor Sans (SUGESTÃO) |
| h1 | 3.5rem | 2.375rem | 400 | 1.08 | display |
| h2 | 2.5rem | 2rem | 400 | 1.15 | display |
| h3 | 1.5rem | 1.375rem | 500 | 1.25 | Poppins |
| lead | 1.25rem | 1.125rem | 300 | 1.65 | Poppins |
| body | 1rem | 1rem | 400 | 1.70 | Poppins |
| small | 0.875rem | 0.875rem | 400 | 1.55 | Poppins |
| button | 0.9375rem | 0.9375rem | 500 | 1.20 | Poppins |

## 5. Elementos gráficos

**EXTRAÍDO, pp. 7, 9, 12, 15-26:**
- Linhas finas horizontais/verticais como divisores editoriais.
- Formas geométricas de contorno, incluindo losangos empilhados (p. 9).
- Curvas/ovais lineares orgânicos sobre fundos terrosos (p. 12).
- Muito espaço negativo.
- Alternância entre fotografia colorida quente e preto e branco.
- Composições de grid editorial para redes sociais.
- Bordas, raios e sombras sistematizados: **Ausente no material**.
- Família de ícones: **Ausente no material**.

**SUGESTÃO (não consta no material):** radius 2px/8px/999px, sombras discretas e raras, ícones outline 1.5px. Justificativa: preservar o caráter editorial e não transformar a marca em estética de app genérico.

## 6. Estilo fotográfico

**EXTRAÍDO, pp. 2, 6, 8, 11, 17, 20-26:**
- Retratos profissionais da médica em branco/preto e em looks branco e preto.
- Luz suave, contraste controlado, fundos neutros ou terrosos.
- Pele com textura natural, close-ups dermatológicos e recortes de corpo/rosto.
- Tratamento quente em imagens coloridas, com bronze, bege, creme e marrom.
- Preto e branco usado para autoridade/editorial.
- Mistura de retrato, detalhes de pele, rotina e conteúdo educativo.

**Evitar, SUGESTÃO (não consta no material):** pele excessivamente alisada, filtros frios/saturados, banco de imagem com estética hospitalar genérica, instrumentos invasivos como elemento hero, imagens que impliquem resultado garantido.

## 7. Tom de voz e posicionamento

### Personalidade e voz
**EXTRAÍDO, p. 13:**
- Amigável: próxima sem ser íntima.
- Rebuscada: mostrar embasamento sem ser prolixa.
- Bem humorada: humor leve e alegria.
- Informal: poucos termos técnicos e, quando usados, explicá-los.

### Propósito e crenças
**EXTRAÍDO, pp. 5-7, 11-12:** beleza ligada a sentir-se confortável na própria pele; cuidado e transformação a partir do melhor que a pessoa pode se tornar; escuta, cuidado, atenção plena, naturalidade, essência e história pessoal.

### Valores
**EXTRAÍDO, p. 9:** Saúde, Empatia, Família, Crescimento, Essência.

### Imagem desejada
**EXTRAÍDO, p. 14:**
- Percebida: saúde, conhecimento, segurança, sofisticação, sucesso, beleza, acolhimento.
- Projetada: autoestima, oportunidades, visibilidade, reconhecimento, sucesso.

### Diferencial
**EXTRAÍDO, p. 15:** História/identidade; proposta de valor "Conhecimento + atendimento 360°"; posicionamento por crenças e valores.

### Público
Público demográfico detalhado: **Ausente no material**.
**SUGESTÃO (não consta no material):** estruturar a página para pessoas em Curitiba que buscam consulta dermatológica com abordagem humana, natural e tecnicamente embasada. Não inferir idade, gênero, renda ou diagnóstico.

### Comunicação médica
**SUGESTÃO (não consta no material):** manter linguagem informativa e institucional, sem garantia de resultado, sem sensacionalismo, sem comparação com outros médicos e sem depoimentos inventados.

## 8. Componentes de UI

Todos os valores abaixo são **SUGESTÃO (não consta no material)**, pois o PDF não define um design system web.

### Botões
- Primário: fundo `#762d2d`, texto `#ffffff`, altura 48px, padding 0 24px, radius 2px, Poppins 500 0.9375rem.
- Hover primário: reduzir luminosidade do bordô em cerca de 8%, sem mudar hue.
- Focus: outline 3px `#d0baa0` + offset 3px.
- Disabled: fundo `#e9e6e1`, texto `#414042`, opacity 0.55, cursor not-allowed.
- Secundário: transparente, texto `#414042`, border 1px `#414042`.
- Link textual: `#762d2d`, underline no hover/focus; nunca depender só de cor para estado.

### Cards
Fundo branco ou off-white, border 1px com grafite a 12% de opacidade, radius 8px, sem sombra por padrão. Cards de "Tratamentos" levam apenas o título da lista oficial. Texto de apoio, se necessário, no máximo uma linha neutra marcada como SUGESTÃO para aprovação. "Procedimentos" ficam em lista compacta, sem cards.

### Formulário de contato
Campos 48-52px, label persistente, border 1px `#414042` a 35%, focus 2px `#762d2d`, mensagens de erro textuais. Campos sugeridos: nome, telefone/e-mail, mensagem e consentimento. Destino e política de privacidade: Ausente no material.

### Header/Footer
Header desktop 80-88px, sticky apenas se não cobrir conteúdo; logo 180-220px. Mobile 64-72px, símbolo ou logo completa conforme legibilidade. Footer em `#414042` com logo positiva e textos brancos, contendo CRM/RQE e contatos reais quando fornecidos.

### Grid, espaçamento e breakpoints
- Container max: 1200px.
- Gutter desktop: 32px; tablet 24px; mobile 20px.
- Grid desktop: 12 colunas; tablet 8; mobile 4.
- Seções: 96-128px vertical desktop; 64-80px mobile.
- Escala spacing: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128px.
- Breakpoints: 480, 768, 1024, 1280px.

## 9. Observações de implementação
- Priorizar HTML semântico, navegação por teclado, foco visível e `prefers-reduced-motion`.
- Não usar texto sobre fotografia sem overlay que preserve contraste.
- Não usar script font para corpo, navegação ou botão.
- Não usar bronze/areia como texto pequeno sobre branco.
