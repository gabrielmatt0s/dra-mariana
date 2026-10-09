# AUDITORIA-CFM.md

Auditoria de conformidade do site da Dra. Mariana Zunino com a Resolução CFM nº 2.336/2023 (publicidade médica), em 27/09/2026. **Nada foi alterado.** Este é o único arquivo criado.

**Escopo verificado:** `site/index.html`, `site/privacidade.html`, `site/404.html`, todos os `alt`, `title`, `meta description`, Open Graph/Twitter Card, os dois blocos JSON-LD, `site/assets/og-image.jpg`, as fotos já publicadas (hero e Sobre) e o texto pré-preenchido do link do WhatsApp. Também usei `content.md`, `CLAUDE.md`, `design-system.md` e `AUDITORIA.md` como referência do que já foi decidido, e conferi se o repositório GitHub que hospeda esses documentos é público.

**A numeração dos artigos foi conferida em 27/09/2026** contra o texto da própria Resolução (tentei ler o PDF oficial em `sistemas.cfm.org.br`, mas ele veio como imagem/binário ilegível; usei então o resumo oficial do CFM em `publicidademedica.cfm.org.br/resolucao/o-que-muda`, que cita os artigos com trechos literais). Isso confirmou os artigos 4º, 5º, 6º, 11 (incisos II, V e XII) e o conteúdo de "sensacionalismo", "marcas comerciais", "imagens" e "conteúdo educativo" que você já tinha indicado em cada regra. Duas diferenças que vale registrar: o art. 4º pede a palavra "MÉDICO" junto do CRM (adaptei para "Médica", forma correta em português para uma profissional mulher, que é o que você pediu); e a regra de antes/depois é ainda mais estrita do que eu tinha escrito: "o paciente não pode ser reconhecível", não só "sem autorização por escrito" (ver nota no item 7.2).

## Resumo

| Situação | Qtd |
|---|---|
| Não conforme | 4 |
| Atenção | 7 |
| Conforme | 10 |

**O achado mais importante:** a palavra "Médica" nunca aparece no site, em lugar nenhum, e o CRM/RQE nunca aparecem no JSON-LD. Isso afeta hero, Sobre, rodapé e os dados estruturados: é o item 1 da sua lista, e é o que eu mais recomendo corrigir antes de publicar.

## Status das correções (27/09/2026)

Este bloco resume o que foi feito depois da auditoria (commit "conformidade cfm"). As tabelas abaixo, a partir de "1. Identificação", são o relatório original da auditoria e não foram reescritas: onde um item foi corrigido, a correção real pode diferir um pouco do "proposta" registrado ali (ex.: ordem exata do texto), porque você ajustou a redação ao aprovar.

| Item | Status | O que foi feito |
|---|---|---|
| 1.1 Hero sem "Médica" | Corrigido | `.hero__creds` agora é "Médica, CRM/PR 26153 \| Dermatologista, RQE 19939" |
| 1.2 Sobre sem "Médica" | Corrigido | `.cred__text` agora é "Médica, CRM/PR 26153, Dermatologista, RQE 19939" |
| 1.3 Rodapé sem "Médica" | Corrigido | `.site-footer__id` agora é "Dra. Mariana Zunino, Médica, CRM/PR 26153, Dermatologista, RQE 19939" |
| 1.4 JSON-LD sem CRM/RQE | Corrigido | Acrescentado `identifier` com 2 `PropertyValue` (CRM/PR 26153 e RQE 19939) e `jobTitle: "Médica dermatologista"`. O `identifier` é válido para qualquer tipo do schema.org (domínio `Thing`) e não gerou nenhum aviso na validação. O `jobTitle` gerou 1 aviso: essa propriedade só é definida pelo schema.org para o tipo `Person`, não para `Physician`/`MedicalBusiness` (que são tipos de organização, não de pessoa, na modelagem do schema.org). Mantive porque você pediu explicitamente; o Google costuma ignorar propriedades não reconhecidas em vez de invalidar o restante, mas registro que ela é "extra", não uma propriedade garantida pelo padrão |
| 1.5 Meta description/OG sem CRM | Decisão do Gabriel: manter sem CRM | Nenhuma mudança, conforme instrução |
| 1.6 Alt das fotos e logos | Já conforme | Nenhuma mudança necessária |
| 2.1 Marcas comerciais no site | Já conforme | Nenhuma mudança necessária |
| 2.2 `content.md` público no GitHub | Decisão do Gabriel: manter como está | Nenhuma mudança pedida; documentado como pendente de decisão no resumo original |
| 2.3 Revista Vogue na og-image | Corrigido | `site/assets/og-image.jpg` foi refeita: mesmo layout (logo à esquerda sobre `#e9e6e1`, foto à direita), mas o recorte da foto do hero agora vai só até o busto (antes da revista aparecer). Nenhuma marca de terceiro na imagem. **A foto usada na própria seção do hero continua com a revista** (isso não foi pedido; ver a pendência já registrada em `assets.md`) |
| 3.4 "Realçar a beleza que existe em você" | Decisão do Gabriel: manter como está | Nenhuma mudança, conforme instrução |
| 6.3 "Recomendo muito a visita" (Alisson R.) | Corrigido | Frase final cortada com reticências no `index.html` e o corte registrado em `content.md`, com o texto original preservado ali para referência |
| 7.2 Critério de fotos de paciente ainda não publicadas | Corrigido | Os 6 comentários dos cards de Tratamentos (`index.html`) agora incluem "nenhuma foto de paciente com rosto identificável sem autorização por escrito", além do critério que já existia. Ver a nota acima sobre a regra oficial ser ainda mais estrita para demonstrações de antes/depois especificamente |
| 8.2 Palavra "clínica" | Corrigido | As 3 ocorrências em `privacidade.html` e a 1 em `404.html` viraram "a Dra. Mariana" ou "o consultório", conforme a frase |
| 8.4 `MedicalBusiness` no JSON-LD | Decisão do Gabriel: manter | Nenhuma mudança, conforme instrução |
| 9.3 Conteúdo educativo futuro | Registrado | Regra incluída no `CLAUDE.md`, na nova seção "Conformidade com a Resolução CFM nº 2.336/2023", para valer em qualquer texto novo |

**Também adicionado ao `CLAUDE.md`:** uma seção nova com as 6 regras da Resolução que valem daqui em diante (identificação completa, sem marcas, sem promessa de resultado, sensacionalismo, avaliações como fala da médica, conteúdo educativo completo).

**Verificado depois das correções:** em 1366x650 o hero continua cabendo na altura da tela (569 de 569 px, sem estourar) e a linha de credenciais não corta nem quebra. Em 360px não há overflow horizontal em lugar nenhum da página (conferido com o Chrome em primeiro plano). O JSON-LD dos dois blocos continua sintaticamente válido.

## 1. Identificação (art. 4º e 6º)

| # | Trecho | Onde | Situação | Correção proposta |
|---|---|---|---|---|
| 1.1 | `CRM/PR 26153 \| RQE 19939` (sem nome, sem "Médica", sem "Dermatologista" junto) | Hero, `.hero__creds` (`index.html` 162) | Não conforme | Ex.: `CRM/PR 26153 (Médica) \| RQE 19939 (Dermatologista)`. O nome já aparece na logo ao lado e no eyebrow "Dermatologista em Curitiba" acima, mas nenhum dos dois diz "Médica" |
| 1.2 | `Dermatologista, CRM/PR 26153, RQE 19939` | Sobre, `.sobre__cred` (`index.html` 190), logo abaixo de "Sobre a Dra. Mariana" | Não conforme | Ex.: `Médica, CRM/PR 26153, Dermatologista, RQE 19939` (o nome completo já está no `<h2>` acima, mas abreviado como "Dra. Mariana", sem o sobrenome) |
| 1.3 | `Dra. Mariana Zunino, Dermatologista, CRM/PR 26153, RQE 19939` | Rodapé, `.site-footer__id` (`index.html` 597) | Não conforme | É o trecho mais completo do site (tem o nome inteiro), mas falta "Médica" e a ordem não é a do formato pedido. Trocar para `Dra. Mariana Zunino, Médica, CRM/PR 26153, Dermatologista, RQE 19939` |
| 1.4 | JSON-LD `Physician`/`MedicalBusiness`: tem `name`, `medicalSpecialty: "Dermatology"`, mas nenhum campo com o número do CRM ou do RQE | `index.html` 54-114 | Não conforme | Acrescentar um campo com o registro, ex.: `"identifier": {"@type": "PropertyValue", "propertyID": "CRM/PR", "value": "26153"}` e outro para o RQE (schema.org não tem propriedade nativa para RQE; `PropertyValue` com `propertyID` serve para os dois) |
| 1.5 | `<title>Dra. Mariana Zunino \| Dermatologista em Curitiba, Batel</title>`, meta description, Open Graph e Twitter Card: têm nome e especialidade, nunca CRM nem "Médica" | `index.html` 8-30 | Atenção | Esses textos aparecem como anúncio no resultado de busca e nas redes. Não é obrigatório caber o CRM em 60 caracteres, mas registrar a decisão: ou aceitar que a identificação completa fica só na página (itens acima), ou incluir o CRM na meta description quando ela for revisada com a cliente |
| 1.6 | `alt="Logotipo da Dra. Mariana Zunino, dermatologista"` (2x) e `alt="Dra. Mariana Zunino, dermatologista em Curitiba"` | Logos e foto do hero | Conforme | Têm nome e especialidade; o `alt` de uma imagem não é o lugar de colocar CRM/RQE, e a página já tem essa informação em texto ao lado |

## 2. Marcas comerciais (art. 11, XVIII, c)

| # | Trecho | Onde | Situação | Correção proposta |
|---|---|---|---|---|
| 2.1 | Nenhuma marca comercial (Sculptra, Radiesse, Profhilo, Skinbooster, Botox, Ultraformer, Fotona, Dysport, Xeomin, Juvederm, Restylane, HIFU, Thermage, Morpheus) em `index.html`, `privacidade.html`, `404.html`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml` ou nos `alt` | Todo o site publicado | Conforme | Nenhuma. A lista de Procedimentos usa só termos técnicos genéricos: "Toxina botulínica" (denominação farmacológica, não marca), "Preenchimento com ácido hialurônico", "Bioestimulador de colágeno", "Hidratação injetável com ácido hialurônico", "Biorremodelador tecidual", "Ultrassom microfocado", "Peeling químico", "Microagulhamento IPCA", "Luz intensa pulsada", "Laser" |
| 2.2 | `content.md` (documento de trabalho, **não faz parte de `site/`**, não é publicado no domínio) cita Sculptra, Radiesse, Skinbooster, Profhilo e Botox, com a nota "aguardando confirmação da cliente" | `content.md` | Atenção | O repositório `github.com/gabrielmatt0s/dra-mariana` é **público**, então esse arquivo pode ser lido por qualquer pessoa e indexado por buscadores, mesmo não sendo parte do site. Não é "publicidade médica" no sentido da Resolução (é planejamento interno), mas associa o nome da médica a marcas comerciais num lugar público. Se isso incomodar, a correção é tornar o repositório privado, não o conteúdo do `content.md` |
| 2.3 | og-image mostra a médica segurando uma edição da revista **Vogue** ("BE / LEZA" na capa) | `assets/og-image.jpg` | Atenção | "Vogue" não é marca de produto, equipamento ou fabricante (não é o tipo de marca que o art. 11, XVIII, c veda), mas funciona como referência de terceiro que pode sugerir endosso ou prestígio. Não é o mesmo risco de citar Botox, mas vale confirmar com a cliente se ela quer manter esse elemento na imagem oficial usada em redes sociais e buscadores |

## 3. Promessa de resultado (art. 11, XII e § 2º)

| # | Trecho | Onde | Situação | Correção proposta |
|---|---|---|---|---|
| 3.1 | "Cuido da sua pele honrando a sua essência." | Headline do hero (h1) | Conforme | Declaração de cuidado e valores, sem prometer efeito, cura ou transformação |
| 3.2 | "Sua pele, sua história." | Subtítulo do hero e título do CTA final | Conforme | Frase de posicionamento, sem promessa |
| 3.3 | "A beleza é quando você se sente confortável na sua própria pele." | Citação de destaque, seção Minha abordagem | Conforme | Definição pessoal de beleza, não descreve nem promete resultado de procedimento |
| 3.4 | "Gosto de deixar as pessoas melhores, através do ouvir, do cuidar e da atenção plena, por isso, entrego meu tempo, carinho e conhecimento para realçar a beleza que existe em você, valorizando sua essência e trazendo sempre a naturalidade." | Parágrafo da seção Minha abordagem | Atenção | "Realçar a beleza que existe em você" é próximo de insinuar resultado estético, ainda que em linguagem afetiva e sem citar procedimento, medida ou prazo. Não usa palavras como "elimina", "corrige" ou "garante", então não considero "não conforme", mas é o trecho mais perto da linha em todo o site. Se quiser reduzir o risco: trocar "realçar a beleza que existe em você" por algo como "cuidar de você com atenção e respeito" |
| 3.5 | Nomes de seção: "Sobre", "Tratamentos", "Procedimentos", "Minha abordagem", "Avaliações", "Contato", "Dermatologia estética e clínica" | Menu e títulos de seção | Conforme | São rótulos neutros, sem adjetivo de resultado |
| 3.6 | Nomes dos 6 cards de tratamento: "Rejuvenescimento", "Melasma", "Acne", "Rosácea", "Queda de cabelo", "Outras doenças de pele" | Seção Tratamentos | Conforme | São nomes de condições/áreas de cuidado, não descrevem o resultado do tratamento em si (não há texto de apoio nos cards, só o nome) |
| 3.7 | Textos de `privacidade.html` e `404.html` | Páginas legais | Conforme | Não fazem nenhuma promessa; são texto institucional e de erro |

## 4. Sensacionalismo e autopromoção (art. 11, XVI)

| # | Trecho | Onde | Situação | Correção proposta |
|---|---|---|---|---|
| 4.1 | Busca por "melhor", "referência", "excelência", "única", "top", "renomada", "premiada", "exclusiv-", "infalível", "garant-", "comprovad-", "milagr-", "revolucionári-" no texto visível | Todo o site | Conforme | Nenhuma ocorrência real. A única palavra "melhor" que aparece está em "deixar as pessoas melhores" (3.4), que é sobre as pessoas, não sobre a médica ou a técnica dela, e "exclusivo(s)" só existe dentro de um comentário HTML invisível sobre CSS ("aspas e subtítulo são exclusivos de cada versão"), não é texto de página |
| 4.2 | Nenhuma comparação com outros profissionais em nenhum texto | Todo o site | Conforme | Não há menção a outros médicos, clínicas ou concorrentes |
| 4.3 | Linguagem em geral (hero, Sobre, Abordagem) | Todo o site | Conforme | Tom pessoal e sóbrio ("cuido", "honrando", "atenção plena"), sem apelo sedutor ou de urgência ("últimas vagas", "só hoje" etc. não aparecem) |

## 5. Aparelhagem (art. 11, II)

| # | Trecho | Onde | Situação | Correção proposta |
|---|---|---|---|---|
| 5.1 | Nenhum equipamento nomeado ou descrito com capacidade privilegiada | Todo o site | Conforme | "Ultrassom microfocado" e "Laser" descrevem a categoria da técnica, sem nome de marca de aparelho nem alegação sobre a máquina ("o mais potente", "tecnologia exclusiva" etc.) |

## 6. Avaliações (art. 8º, § 3º), cruzadas de novo com os itens 3 e 4

| # | Avaliação (autor) | Situação | Observação |
|---|---|---|---|
| 6.1 | Céline B.: "A Dra. é uma querida, calma e possui um consultório bem organizado para receber os clientes... Foi uma indicação e estou gostando bastante do atendimento." | Conforme | Elogia trato pessoal e organização do consultório, não técnica nem resultado |
| 6.2 | Marcia F.: "A Dra Mariana, é realmente muito atenciosa, explica tudo com muita calma e esclarecendo as dúvidas!!" | Conforme | Sobre atendimento, não resultado |
| 6.3 | Alisson R.: "Atendimento muito bom da dra Mariana, super atenciosa, instruções extremamente claras sobre o diagnóstico durante a consulta, além de ser muito simpatica e ter boa conversa. Recomendo muito a visita." | Atenção | "Recomendo muito a visita" é uma recomendação explícita. Como o art. 8º, §3º trata a avaliação como se fosse publicação da própria médica, essa frase funciona como um endosso publicitário, mesmo sem elogiar técnica ou resultado. Não chega a ferir os itens 3 ou 4 (não promete resultado, não é sensacionalista), mas é o texto mais parecido com propaganda direta entre os 6. Se quiser reduzir o risco, a única forma é usar reticências para cortar só essa frase final (a regra do `CLAUDE.md` já permite um corte por texto), mas isso muda o que a paciente escreveu, então fica como decisão sua, não uma correção que eu aplicaria sozinho |
| 6.4 | Vanessa U.: "Sou paciente da Dra Mariana há alguns anos… Ela é sempre pontual, atenciosa e toda a equipe me recebe com muito carinho" | Conforme | Sobre pontualidade e acolhimento da equipe, não resultado |
| 6.5 | Ana Claudia B.: "…Desde o agendamento, o atendimento na recepção e a consulta. Fui tratada com muita atenção e cuidado." | Conforme | Sobre atendimento, não resultado |
| 6.6 | Mirian G.: "A dra Mariana é sempre muito pontual e atenciosa… É minha dermatologista há muito tempo." | Conforme | Sobre pontualidade e tempo de relacionamento, não resultado |
| 6.7 | Nenhuma das 6 revela diagnóstico, doença ou procedimento específico do paciente | (geral) | Conforme | A única menção a algo clínico é "diagnóstico durante a consulta" (6.3), sem dizer qual, o que não identifica a condição de saúde da paciente |

## 7. Imagens (art. 14)

| # | Trecho | Onde | Situação | Correção proposta |
|---|---|---|---|---|
| 7.1 | Foto do hero e foto da seção Sobre: retratos profissionais da médica, sozinha, sem paciente | `assets/img/dra-mariana-zunino-hero-*` e `-sobre-*` | Conforme | Não são antes/depois, não mostram paciente, não mostram pele com lesão nem procedimento em execução |
| 7.2 | Nenhuma foto de paciente publicada (os 6 cards de Tratamentos ainda são placeholder) | Seção Tratamentos | Conforme (por enquanto) | Critério já registrado para quando as fotos reais entrarem: comentário em cada card do `index.html` diz "Sem lesões, acne visível, pele doente, antes e depois, agulhas, seringas ou procedimento em execução (regras do CFM)". Esse critério cobre a exigência do art. 14 sobre antes/depois e paciente identificável, mas vale reforçar explicitamente aqui: **nenhuma foto de paciente deve identificar o rosto sem autorização documentada**, o que ainda não está escrito nesses comentários |
| 7.3 | og-image: retrato editorial em estúdio, sem edição que simule "antes/depois" nem retoque de pele visível a olho nu | `assets/og-image.jpg` | Conforme | É retrato profissional da própria médica, não de paciente nem de resultado de procedimento |

## 8. Diretor técnico (art. 5º)

| # | Trecho | Onde | Situação | Correção proposta |
|---|---|---|---|---|
| 8.1 | O site se apresenta com o nome da própria médica em todo lugar (domínio `dermatomarianazunino.com`, rodapé "Dra. Mariana Zunino", sem nome comercial de clínica) | Todo o site | Conforme | O site não se apresenta como estabelecimento com nome próprio (tipo "Clínica X"); é a página profissional de uma médica individual. Não vejo obrigação de diretor técnico nesse cenário |
| 8.2 | A palavra "clínica" é usada 3 vezes como substantivo genérico para "o consultório/a médica": "fale com a clínica pelo WhatsApp" (`privacidade.html`, `404.html`) e "mande uma mensagem para o WhatsApp da clínica" (`privacidade.html`) | `privacidade.html` linhas 46, 65, 73; `404.html` linha 38 | Atenção | Isoladamente parece só um jeito de falar, mas reforça a leitura de "estabelecimento" em vez de "profissional individual". Para eliminar qualquer dúvida sobre precisar de diretor técnico, sugiro trocar essas 3 ocorrências por "a Dra. Mariana" ou "o consultório" |
| 8.3 | Meta description e og:description usam "Dermatologia clínica e estética" | `index.html` 9, 20, 28 | Conforme | Aqui "clínica" é adjetivo (tipo de dermatologia: clínica vs. estética), não é o substantivo que nomeia um estabelecimento. Não tem relação com o art. 5º |
| 8.4 | JSON-LD usa o tipo `MedicalBusiness` além de `Physician` | `index.html` 57-60 | Atenção | `MedicalBusiness` é o tipo do schema.org recomendado pelo Google para negócios locais de saúde (é o que habilita o card de mapa/horário na busca), não é uma declaração de que existe um estabelecimento formal com CNPJ e diretor técnico. Ainda assim, por ser dado estruturado lido por máquinas e devolvido em resultados de busca, vale que a cliente saiba que essa é uma escolha técnica de SEO, não uma afirmação sobre a estrutura legal do consultório |

## 9. Conteúdo educativo (art. 14, I)

| # | Trecho | Onde | Situação | Correção proposta |
|---|---|---|---|---|
| 9.1 | Os 6 cards de "Tratamentos" mostram só o nome da condição (ex.: "Melasma"), sem nenhum texto descrevendo o tratamento | Seção Tratamentos | Conforme | Como não há descrição do tratamento (nem como funciona, nem benefício, nem duração), a exigência de indicações/fatores/complicações do art. 14, I não chega a se aplicar: não descrever nada evita o problema, mas também não informa a paciente |
| 9.2 | Cada item de "Procedimentos" agora abre (details/summary) e mostra uma frase curta de indicação terapêutica (ex.: "Indicada para linhas de expressão, contorno do rosto e região do pescoço") | Seção Procedimentos | Conforme | A cliente enviou em 2026-10-01 um texto completo por procedimento (mecanismo de ação + resultado esperado), que acionaria a exigência de fatores/complicações do art. 14, I e continha afirmações de resultado. Por decisão do Gabriel, o texto publicado foi resumido para só a indicação (a condição/área atendida), sem descrever mecanismo de ação nem resultado esperado, o que mantém fora do gatilho do art. 14, I. Ver `content.md`, "Textos de indicação (Procedimentos, clicável)" |
| 9.3 | Se a cliente pedir o texto completo (mecanismo + resultado) nos itens de "Procedimentos" ou nos cards de "Tratamentos" | (geral) | Atenção (regra a aplicar no futuro) | Antes de publicar esse texto completo: pedir também, para cada item, os fatores que influenciam o resultado e as complicações descritas na literatura (art. 14, I), e revisar frase por frase para tom de indicação em vez de afirmação de resultado (art. 11, XII e XVI) |
| 9.4 | Em 2026-10-05 a cliente pediu, por mensagem, para publicar o texto completo (indicação + mecanismo de ação) de 6 procedimentos (Preenchimento, Bioestimulador de colágeno, Hidratação injetável, Biorremodelador tecidual, Ultrassom microfocado, Peeling químico), com as frases de resultado que ela mesma apontou reescritas em tom de indicação | Seção Procedimentos | **Não conforme (pendência aceita)** | As frases de resultado apontadas pela cliente foram reescritas (ver `content.md`), o que resolve a parte do art. 11, XII/XVI para esses trechos. Mas o texto passou a descrever mecanismo de ação, o que aciona o art. 14, I: falta incluir, para esses 6 procedimentos, os fatores que influenciam o resultado e as complicações descritas na literatura. Por decisão do Gabriel (2026-10-05), publicado mesmo assim; pendência aberta até a cliente fornecer esse conteúdo |

## Resumo final

### Conforme
- Nenhuma marca comercial no site publicado (Procedimentos e Tratamentos usam só termos técnicos genéricos).
- Nenhuma promessa, garantia ou insinuação forte de resultado na headline, nos títulos de seção ou nos nomes dos tratamentos.
- Sem superlativos, sem comparação com outros profissionais, sem linguagem sedutora ou de urgência.
- Nenhum equipamento citado com capacidade privilegiada (nenhum equipamento é citado, ponto).
- 5 das 6 avaliações são sóbrias, sobre atendimento e não sobre resultado; nenhuma revela condição de saúde da paciente.
- As fotos publicadas (hero, Sobre, og-image) são retratos profissionais da médica, sem antes/depois nem paciente.
- O site se apresenta como página de uma médica individual, não como estabelecimento com nome próprio: o cenário do art. 5º (diretor técnico) não parece se aplicar.
- Os cards de Tratamentos não descrevem os tratamentos; os itens de Procedimentos agora abrem com uma frase de indicação (sem mecanismo de ação nem resultado esperado), então a exigência de conteúdo educativo completo (indicações, fatores, complicações) ainda não é acionada em nenhum dos dois.
- O critério para as futuras fotos de tratamento (sem lesão, sem antes/depois, sem procedimento em execução) já está escrito nos comentários do HTML.

### Precisa corrigir antes de publicar
1. **A palavra "Médica" nunca aparece no site.** Corrigir hero (`.hero__creds`), Sobre (`.sobre__cred`) e rodapé (`.site-footer__id`) para incluir "Médica" junto do CRM, no formato "Dra. Mariana Zunino, Médica, CRM/PR 26153, Dermatologista, RQE 19939" (ao menos no rodapé, que já tem o nome completo).
2. **O JSON-LD não tem CRM nem RQE em nenhum campo.** Acrescentar um `identifier` com CRM/PR 26153 e outro com RQE 19939.

### Depende de confirmação da cliente
1. **"Recomendo muito a visita"** (avaliação de Alisson R., item 6.3): decidir se mantém o texto completo (regra do `CLAUDE.md` de não alterar palavras das avaliações) ou corta essa frase com reticências.
2. **"Realçar a beleza que existe em você"** (item 3.4): confirmar se a cliente está confortável com essa frase ou prefere uma redação mais neutra.
3. **A revista Vogue na og-image** (item 2.3): confirmar se mantém esse elemento na imagem usada para compartilhamento e busca.
4. **Trocar "clínica" por "a Dra. Mariana" ou "o consultório"** nas 3 ocorrências de `privacidade.html` e `404.html` (item 8.2), para reforçar que o site é de uma profissional individual.
5. **Tornar o repositório GitHub privado**, se a cliente não quiser que `content.md` (com os nomes de marcas registrados como pendência) fique publicamente legível (item 2.2).
6. **Meta description e Open Graph sem CRM** (item 1.5): decidir se isso é aceitável como está, já que o CRM aparece na própria página.

### Pendência aceita, falta material da cliente
7. **Fatores que influenciam o resultado e complicações descritas na literatura** para Preenchimento, Bioestimulador de colágeno, Hidratação injetável, Biorremodelador tecidual, Ultrassom microfocado e Peeling químico (item 9.4): exigidos pelo art. 14, I por esses 6 textos agora descreverem mecanismo de ação. Publicado sem esse conteúdo por decisão do Gabriel em 2026-10-05; pedir à cliente e completar os textos quando ela fornecer.
