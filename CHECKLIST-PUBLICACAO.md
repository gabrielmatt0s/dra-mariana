# CHECKLIST-PUBLICACAO.md

Tudo o que falta antes de o site ir ao ar em **https://dermatomarianazunino.com** (hospedagem: Locaweb, plano Linux, ainda a contratar). Só a pasta `site/` é publicada.

## Depende da cliente

- [ ] **Fotos aprovadas**, com autorização de uso web e no formato indicado nos comentários do `index.html`:
  - [ ] Hero: retrato 3:4, 1200x1600 px, WebP, até 250 KB (`assets/img/hero-mariana.webp`)
  - [ ] Sobre: retrato 4:5, 1200x1500 px, WebP, até 250 KB (`assets/img/sobre-mariana.webp`)
  - [ ] 6 tratamentos: 3:4, 900x1200 px, WebP, até 150 KB cada (`assets/img/tratamento-01.webp` a `06`). Sem lesões, antes e depois, agulhas ou procedimento em execução (regras do CFM)
  - [ ] Trocar cada placeholder pelo `<img>` e escrever o `alt` real (nos tratamentos, `alt=""` se a foto for decorativa)
  - [ ] Conferir o contraste do texto no vidro fosco dos cards com as fotos reais (com foto muito escura cai para ~4,4:1)
- [ ] **Texto da seção Sobre** (ideal: 3 parágrafos curtos, até ~90 palavras). Substituir o bloco reservado `SOBRE` no `index.html`
- [ ] **Formação acadêmica** (bloco comentado `FORMAÇÃO` no `index.html`; não inventar instituições, anos ou títulos)
- [ ] **Links individuais das 6 avaliações do Google** (hoje todos apontam para o perfil). Depois de trocar, o rótulo "Avaliação no Google" pode voltar a "Ver no Google". Atualizar também a nota e o total, com a data da coleta
- [ ] **Confirmação das marcas comerciais** (Sculptra, Radiesse, Skinbooster, Profhilo). Hoje o site usa só termos genéricos; as versões com marca estão no `content.md`
- [ ] **Revisão da política de privacidade** (`site/privacidade.html`, texto marcado como SUGESTÃO), pela cliente e, se ela quiser, por um advogado. Decidir se entra CNPJ/razão social
- [ ] **alternateName "Mariana Martins Bardou Zunino"**: confirmar com a cliente e ativar no JSON-LD (instruções no comentário acima do bloco, no `<head>` do `index.html`)
- [ ] URL do link "Desenvolvido por Gabriel Vigo" no rodapé (comentário no `index.html`)

## Depende de mim/de vocês, antes de subir

- [ ] **og-image definitiva** (`site/assets/og-image.jpg`, 1200x630): trocar a provisória (logo sobre #e9e6e1) por foto aprovada, e atualizar o `og:image:alt` e o `image` do JSON-LD
- [ ] Depois da troca, testar o compartilhamento (WhatsApp, Facebook Sharing Debugger, LinkedIn Post Inspector)
- [ ] Reler título, descrição e textos com a cliente (sem superlativos nem promessa de resultado)
- [ ] Rodar o Lighthouse de novo com as fotos reais e conferir o LCP

## Hospedagem (Locaweb, plano Linux)

- [ ] **Contratar a hospedagem** e apontar o domínio `dermatomarianazunino.com` (DNS)
- [ ] Ativar o **certificado SSL** (HTTPS) antes de publicar
- [ ] Subir **só o conteúdo de `site/`** para a raiz pública (nunca `_originais/`, `_testes/`, `referencia/` nem os `.md` da raiz)
- [ ] O domínio tem hoje um **WordPress padrão** publicado: apagar ou substituir esses arquivos e conferir que não sobrou `wp-*`
- [ ] **Validar o `.htaccess`** na hospedagem final (o Apache pode ter módulos desativados ou já redirecionar para HTTPS):
  - [ ] `http://` e `www.` redirecionam com 301 para `https://dermatomarianazunino.com/` em um salto só
  - [ ] `/hello-world/`, `/sample-page/`, `/?p=1`, `/?page_id=2`, `/wp-admin`, `/wp-login.php` e `/feed/` redirecionam com 301 para a home
  - [ ] Um endereço inexistente mostra o `404.html` com status 404
  - [ ] Cabeçalhos `X-Content-Type-Options`, `Referrer-Policy` e `X-Frame-Options` presentes; gzip ativo; cache longo em fontes e imagens
  - [ ] `robots.txt`, `sitemap.xml` e `manifest.webmanifest` abrem com o tipo certo
- [ ] Ao publicar mudanças em CSS ou JS, acrescentar `?v=NUMERO` nos `<link>` e `<script>` (o cache de css e js é de 1 mês e os arquivos não têm hash no nome)

## Depois de publicar

- [ ] Cadastrar o site no **Google Search Console** (propriedade do domínio) e enviar o `sitemap.xml`
- [ ] Testar o JSON-LD no **Rich Results Test** e no **validador do schema.org** (o teste aqui foi só contra o vocabulário do schema.org, sem acesso a essas ferramentas)
- [ ] Conferir o **perfil da empresa no Google** (nome, endereço e telefone iguais aos do site: "Avenida Sete de Setembro, 4214, Edifício Business Offices, sala 1304, Batel, Curitiba/PR, CEP 80250-085" e "(41) 99178-0320")
- [ ] Pedir a reindexação da home e remover do índice as URLs do WordPress antigo, se aparecerem
- [ ] Rodar o **Lighthouse** no domínio final (mobile e desktop)
- [ ] Testar o botão do WhatsApp, o telefone, o mapa ("Ver mapa") e o carrossel em um celular real
- [ ] Guardar um backup do site publicado
