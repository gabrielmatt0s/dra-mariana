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
