/*
 * Estado expandido dos cards de Tratamentos (GSAP Flip + gsap.matchMedia). Escopo: só a seção #tratamentos.
 * Dois comportamentos bem diferentes por tamanho de tela, cada um com seu próprio setup/cleanup:
 * - Desktop/tablet (48rem+, ver CSS): o card cresce na horizontal e empurra os vizinhos para fora do
 *   trilho visível (abrirDesktop/fecharDesktop).
 * - Mobile (abaixo de 48rem): acordeão vertical simples, sem empurrar ninguém (abrirMobile/fecharMobile).
 * gsap.matchMedia troca de um para o outro automaticamente ao cruzar o breakpoint (ou redimensionar a
 * janela), fechando qualquer card aberto na hora, sem animação, e limpando os estilos inline.
 *
 * Sem GSAP/Flip ou sem o Swiper iniciado, os cards continuam só como grade/carrossel normal (o botão
 * .card__hit existe mas não expande nada: o clique simplesmente não faz efeito, nenhum conteúdo é escondido).
 *
 * Texto de cada tratamento: placeholder, só em JS (ver TEXTOS abaixo). Nunca colocar no HTML estático
 * nem publicar como texto real sem indicações terapêuticas, fatores de resultado e complicações
 * (art. 14, I da Resolução CFM 2.336/2023 — ver CLAUDE.md).
 */
(function () {
  'use strict';

  var root = document.querySelector('.trat');
  if (!root || !window.gsap || !window.Flip || !window.Swiper) return;

  gsap.registerPlugin(Flip);

  var wrap = root.closest('.trat__wrap');
  var controles = wrap.querySelector('.trat__controles');
  var cards = Array.prototype.slice.call(root.querySelectorAll('.card--trat'));
  if (!cards.length) return;

  // Placeholder: um parágrafo-rascunho por tratamento, na mesma ordem dos cards. Ver aviso no topo do arquivo.
  var TEXTOS = [
    ['Texto placeholder sobre rejuvenescimento: indicação, como o procedimento costuma funcionar e o que esperar da recuperação.', 'Placeholder: fatores que influenciam o resultado e possíveis complicações, a confirmar com a Dra. Mariana antes de publicar.'],
    ['Texto placeholder sobre melasma: indicação, como o tratamento costuma funcionar e o que esperar ao longo do acompanhamento.', 'Placeholder: fatores que influenciam o resultado e possíveis complicações, a confirmar com a Dra. Mariana antes de publicar.'],
    ['Texto placeholder sobre acne: indicação, como o tratamento costuma funcionar e o que esperar ao longo do acompanhamento.', 'Placeholder: fatores que influenciam o resultado e possíveis complicações, a confirmar com a Dra. Mariana antes de publicar.'],
    ['Texto placeholder sobre rosácea: indicação, como o tratamento costuma funcionar e o que esperar ao longo do acompanhamento.', 'Placeholder: fatores que influenciam o resultado e possíveis complicações, a confirmar com a Dra. Mariana antes de publicar.'],
    ['Texto placeholder sobre queda de cabelo: indicação, como o tratamento costuma funcionar e o que esperar ao longo do acompanhamento.', 'Placeholder: fatores que influenciam o resultado e possíveis complicações, a confirmar com a Dra. Mariana antes de publicar.'],
    ['Texto placeholder sobre outras doenças de pele: indicação, como a avaliação costuma funcionar e o que esperar do acompanhamento.', 'Placeholder: fatores que influenciam o resultado e possíveis complicações, a confirmar com a Dra. Mariana antes de publicar.']
  ];

  var state = { expanded: null, busy: false, bloqueiaSwiperUpdate: false };

  // O Swiper (resizeObserver:true por padrão) observa o tamanho dos slides e desfaz qualquer largura/altura
  // forçada por nós assim que a detecta como uma mudança de tamanho. Trava update/updateSlides enquanto um
  // card está expandido (religada nos próprios fecharDesktop/fecharMobile, antes de cada chamada deliberada).
  (function travaAutoResizeDoSwiper() {
    var swiperInst = root.swiper;
    if (!swiperInst) return;
    ['update', 'updateSlides'].forEach(function (nome) {
      var original = swiperInst[nome];
      if (typeof original !== 'function') return;
      swiperInst[nome] = function () {
        if (state.bloqueiaSwiperUpdate) return;
        return original.apply(this, arguments);
      };
    });
  })();

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function indexOfCard(card) {
    var attr = card.getAttribute('data-trat-index');
    return attr !== null ? Number(attr) : cards.indexOf(card);
  }

  function preencheTexto(card) {
    var texto = card.querySelector('.card__texto');
    if (texto.childElementCount) return;
    var paragrafos = TEXTOS[indexOfCard(card)] || [];
    paragrafos.forEach(function (p) {
      var el = document.createElement('p');
      el.textContent = p;
      texto.appendChild(el);
    });
  }

  function trava(elementos, ligar) {
    elementos.forEach(function (el) {
      if (!el) return;
      if (ligar) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }

  // A entrada em stagger dos cards (data-anim="cards" em animations.js) anima transform/opacity do
  // próprio card e de .card__media/.card__num/.card__line/.card__title por até ~1,3s. Se o clique for
  // antes disso acabar, aquele tween e a nossa animação disputam as mesmas propriedades nos mesmos
  // elementos ao mesmo tempo — o resultado é um salto/corte brusco. Por isso, antes de qualquer coisa,
  // essa entrada é interrompida e levada direto ao estado final (visível, sem deslocamento).
  function garanteEntradaConcluida(card) {
    var alvos = [card]
      .concat($$('.card__media', card), $$('.card__num', card), $$('.card__line', card), $$('.card__title', card));
    gsap.killTweensOf(alvos);
    gsap.set(card, { autoAlpha: 1, y: 0 });
    gsap.set($$('.card__media', card), { autoAlpha: 1 });
    gsap.set($$('.card__num', card), { autoAlpha: 1, y: 0 });
    gsap.set($$('.card__line', card), { scaleX: 1 });
    gsap.set($$('.card__title', card), { autoAlpha: 1, y: 0 });
  }

  // Todo <details class="proc-item"> (accordion de Procedimentos, só existe no card de Rejuvenescimento)
  // começa recolhido sempre que o card abre, mesmo que um item tenha ficado aberto numa visita anterior.
  function recolheProcItens(texto) {
    $$('.proc-item[open]', texto).forEach(function (d) { d.removeAttribute('open'); });
  }

  // Entrada do conteúdo de .card__texto (desktop e mobile): só roda depois que o card/acordeão já
  // terminou de crescer (ver abrirDesktop/abrirMobile) -- nunca durante o tween de tamanho, pra nunca expor
  // a lista sendo reflowada/comprimida. ':scope > p' são os parágrafos-placeholder dos outros 5 cards;
  // '.lista-grid li' é a lista de subtratamentos do card de Rejuvenescimento (linha + accordion por item).
  function animaEntradaConteudo(texto) {
    var paragrafos = texto.querySelectorAll(':scope > p');
    var itensLista = texto.querySelectorAll('.lista-grid li');
    if (paragrafos.length) gsap.fromTo(paragrafos, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' });
    if (itensLista.length) gsap.fromTo(itensLista, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power3.out' });
  }

  function wrapperDoSwiper() { return root.querySelector('.swiper-wrapper'); }
  function restauraOrdemDosCards() {
    var wrapper = wrapperDoSwiper();
    cards.slice().sort(function (a, b) { return indexOfCard(a) - indexOfCard(b); })
      .forEach(function (c) { wrapper.appendChild(c); });
  }

  // swiper.visibleSlides só existe com watchSlidesProgress (não ligado em carrossel.js, fora do escopo
  // desta mudança), então a visibilidade de cada card é calculada aqui por geometria, contra a borda de .trat.
  function getVisiveis() {
    var trackRect = root.getBoundingClientRect();
    return cards.filter(function (c) {
      var r = c.getBoundingClientRect();
      return r.right > trackRect.left + 1 && r.left < trackRect.right - 1;
    });
  }

  /* =========================== DESKTOP / TABLET (48rem+) =========================== */
  function setupDesktop(reduceMotion) {
    var DURACAO = 0.7;
    var EASE = 'power3.inOut';

    // Placeholders: ocupam no .swiper-wrapper o lugar exato de cada card tirado dali (mesma largura e
    // margem), para o flex nunca mudar de forma enquanto a animação dura — sem isso, os slides seguintes
    // (inclusive os da próxima página) reflow para dentro da área visível no lugar do card/vizinhos.
    var placeholders = []; // [{ index, el }]
    function criaPlaceholder(original) {
      var ph = document.createElement('div');
      ph.className = 'trat-slot-placeholder';
      ph.setAttribute('aria-hidden', 'true');
      ph.style.width = original.style.width;
      ph.style.marginRight = original.style.marginRight || getComputedStyle(original).marginRight;
      ph.style.flexShrink = '0';
      ph.style.visibility = 'hidden';
      return ph;
    }
    function placeholderPara(card) {
      var index = indexOfCard(card);
      var entry = placeholders.filter(function (p) { return p.index === index; })[0];
      return entry ? entry.el : null;
    }

    // Remove TODO estado inline/classe dos 3 cards envolvidos, tira os placeholders e devolve ao
    // carrossel normal. Usado tanto no fechamento normal (via onComplete) quanto no fechamento forçado
    // ao trocar de breakpoint. Só roda depois que toda animação já terminou — nunca no meio dela.
    function limpezaCompleta(card, pushados) {
      gsap.killTweensOf([card].concat(pushados));
      // Mesmo cuidado pros itens que animam soltos (fade + stagger de animaEntradaConteudo): sem isso,
      // trocar de breakpoint bem no meio do stagger deixaria esses tweens órfãos ainda rodando.
      gsap.killTweensOf(card.querySelectorAll('.card__texto > p, .card__texto .lista-grid li'));
      [card].concat(pushados).forEach(function (c) {
        c.classList.remove('is-expanded', 'is-pushed-esquerda', 'is-pushed-direita');
        c.removeAttribute('style');
      });
      // Só a largura (travada em abrirDesktop/fecharDesktop) é nossa — o frame já chega do HTML com
      // --pos próprio (enquadramento/crop de cada foto), então remover o atributo style inteiro aqui
      // apagaria esse --pos e a foto voltaria ao enquadramento padrão (object-position: center).
      card.querySelector('.card__media__frame').style.width = '';
      placeholders.forEach(function (p) { p.el.remove(); });
      placeholders = [];
      restauraOrdemDosCards();
      state.bloqueiaSwiperUpdate = false;
      var swiper = root.swiper;
      if (swiper) swiper.update();
    }

    function abrirDesktop(card) {
      if (state.busy || state.expanded !== null) return;
      var swiper = root.swiper;
      if (!swiper) return;
      var index = indexOfCard(card);
      var visiveis = getVisiveis();
      if (visiveis.indexOf(card) === -1) visiveis.push(card);
      visiveis.forEach(garanteEntradaConcluida);
      var siblings = visiveis.filter(function (s) { return s !== card; });

      state.busy = true;
      state.expanded = index;

      var hit = card.querySelector('.card__hit');
      var fechar = card.querySelector('.card__fechar');
      var texto = card.querySelector('.card__texto');
      var cta = card.querySelector('.card__cta');
      preencheTexto(card);
      recolheProcItens(texto);

      var outros = cards.filter(function (c) { return c !== card; });
      trava(outros, true);
      trava([controles], true);
      swiper.allowTouchMove = false;
      if (swiper.navigation) swiper.navigation.disable();

      root.classList.add('has-expanded');
      hit.setAttribute('aria-expanded', 'true');

      var trackRect = root.getBoundingClientRect();

      // 1) MEDIR tudo (card e vizinhos) antes de qualquer mudança no DOM — é o único jeito de "alfinetar"
      // os vizinhos depois no lugar certo. Medir depois de mover é a causa do salto: o reparent para
      // dentro de .trat já muda a posição renderizada do elemento antes mesmo da gente medir.
      var mediaFrame = card.querySelector('.card__media__frame');
      var larguraFotoFechada = mediaFrame.getBoundingClientRect().width;
      // .card__media tem o mesmo padding-left fechado e expandido (só o padding-right some no expandido,
      // porque o column-gap da grade já separa da coluna de texto) — por isso dá pra somar os dois aqui e
      // achar a largura de coluna que devolve o frame exatamente do tamanho que ele já tinha.
      var paddingEsquerdaMedia = parseFloat(getComputedStyle(card.querySelector('.card__media')).paddingLeft) || 0;
      // Só o card entra no Flip. A foto e o corpo ficam numa posição fixa dentro dele (mesma coluna,
      // mesmo padding, largura travada em --trat-foto-w) — se entrassem como alvos do Flip também,
      // o Flip anima cada um pelo seu próprio caminho (posição "from"/"to" medida independentemente),
      // sem saber que o card (pai) está se movendo ao mesmo tempo. Os dois caminhos ficam fora de
      // sincronia e a foto passa boa parte da animação fora da área visível (por isso "sumia"/"cortava").
      // Deixando só o card, a foto e o corpo se movem de graça, herdando o transform do pai a cada quadro.
      var flipTargets = [card];
      var flipState = reduceMotion ? null : Flip.getState(flipTargets, { props: 'opacity,zIndex' });
      var siblingRects = siblings.map(function (s) {
        var r = s.getBoundingClientRect();
        return { el: s, top: r.top - trackRect.top, left: r.left - trackRect.left, width: r.width, height: r.height };
      });

      // 2) MUDAR o DOM de uma vez só, no mesmo passo síncrono: planta um placeholder no lugar de cada um
      // dos 3 (o .swiper-wrapper nunca muda de forma, então nada mais reflow para dentro da área visível),
      // reparenta os 3 para .trat, e fixa cada vizinho exatamente nas coordenadas medidas (delta zero —
      // não há, portanto, nenhum salto visível aqui).
      state.bloqueiaSwiperUpdate = true;
      visiveis.forEach(function (s) {
        var ph = criaPlaceholder(s);
        s.parentNode.insertBefore(ph, s);
        placeholders.push({ index: indexOfCard(s), el: ph });
      });
      visiveis.forEach(function (s) { root.appendChild(s); });
      siblingRects.forEach(function (sr) {
        sr.el.style.position = 'absolute';
        sr.el.style.margin = '0';
        sr.el.style.top = sr.top + 'px';
        sr.el.style.left = sr.left + 'px';
        sr.el.style.width = sr.width + 'px';
        sr.el.style.height = sr.height + 'px';
        sr.el.classList.add(indexOfCard(sr.el) < index ? 'is-pushed-esquerda' : 'is-pushed-direita');
        gsap.set(sr.el, { x: 0, autoAlpha: 1 });
      });
      card.classList.add('is-expanded');
      // O Swiper dá a cada slide uma largura fixa via style inline (slidesPerView:3); isso vence
      // qualquer width por classe no CSS, então o card expandido precisa da largura do trilho em JS.
      card.style.width = root.clientWidth + 'px';
      // Trava a coluna da foto na largura que ela já tinha fechada (ver medição acima) — só o texto
      // ganha o espaço extra do card expandido.
      card.style.setProperty('--trat-foto-w', (larguraFotoFechada + paddingEsquerdaMedia) + 'px');
      // Além da coluna da grade, trava a largura do frame em si, direto nele: ao fechar, a classe
      // is-expanded (e a grade que ela traz) sai ANTES do card terminar de encolher, então por um
      // tempo .card__media volta a ser width:100% do card --- que está encolhendo quadro a quadro.
      // Sem essa largura própria, a foto encolheria junto com o card em vez de ficar sempre do mesmo tamanho.
      mediaFrame.style.width = larguraFotoFechada + 'px';
      // Fechar e a lista ficam fora do fluxo (display:none, via hidden) durante TODA a expansão — não só
      // opacity 0. O Flip daqui é real (sem scale, ver comentário abaixo): a largura do card muda em px
      // quadro a quadro, então a grade recalcula a coluna "texto" junto. Sem nada pra desenhar ali (nem a
      // lista de subtratamentos do Rejuvenescimento, nem os parágrafos dos outros cards), não existe
      // reflow possível pra aparecer — a lista nunca quebra linha nem mostra scrollbar no meio do caminho.
      // card.style.overflow (abaixo) é só uma segunda trava, defensiva, pro mesmo efeito.
      card.style.overflow = 'hidden';

      if (reduceMotion) {
        siblingRects.forEach(function (sr) { gsap.set(sr.el, { autoAlpha: 0 }); });
        card.style.overflow = '';
        fechar.hidden = false;
        texto.hidden = false;
        gsap.set([fechar, texto], { autoAlpha: 1 });
        gsap.set(cta, { autoAlpha: 0 });
        state.busy = false;
        fechar.focus();
        return;
      }

      // 3) só agora anima — transform/opacity nos vizinhos, Flip (real, sem scale) no card clicado.
      gsap.to(cta, { autoAlpha: 0, duration: 0.3 });
      var distancia = root.clientWidth;
      siblingRects.forEach(function (sr) {
        gsap.to(sr.el, { x: indexOfCard(sr.el) < index ? -distancia : distancia, autoAlpha: 0, duration: DURACAO, ease: EASE });
      });

      Flip.from(flipState, {
        duration: DURACAO,
        ease: EASE,
        absolute: true,
        onComplete: function () {
          state.busy = false;
          card.style.overflow = '';
          // Só agora o card já está no tamanho final: a lista/X viram display:block e entram com
          // fade + stagger (animaEntradaConteudo), nunca durante o crescimento.
          fechar.hidden = false;
          texto.hidden = false;
          gsap.set(fechar, { autoAlpha: 0 });
          // Foco só depois que o X termina de aparecer (onComplete deste fade) — autoAlpha:0 deixa o
          // elemento com visibility:hidden, e focar nele nesse estado não funciona de forma confiável.
          gsap.to(fechar, { autoAlpha: 1, duration: 0.4, onComplete: function () { fechar.focus(); } });
          animaEntradaConteudo(texto);
        }
      });
    }

    function fecharDesktop(card) {
      if (state.busy || state.expanded === null || indexOfCard(card) !== state.expanded) return;
      var swiper = root.swiper;
      if (!swiper) return;

      state.busy = true;

      var hit = card.querySelector('.card__hit');
      var fechar = card.querySelector('.card__fechar');
      var texto = card.querySelector('.card__texto');
      var cta = card.querySelector('.card__cta');
      var pushados = cards.filter(function (c) {
        return c.classList.contains('is-pushed-esquerda') || c.classList.contains('is-pushed-direita');
      });
      [card].concat(pushados).forEach(garanteEntradaConcluida);
      // Só o card no Flip — ver nota em abrirDesktop sobre por que a foto não entra como alvo próprio.
      var flipTargets = [card];

      function restauraFoco() {
        limpezaCompleta(card, pushados);
        state.busy = false;
        state.expanded = null;
        root.classList.remove('has-expanded');
        hit.setAttribute('aria-expanded', 'false');
        trava(cards, false);
        trava([controles], false);
        swiper.allowTouchMove = true;
        if (swiper.navigation) swiper.navigation.enable();
        hit.focus();
      }

      if (reduceMotion) {
        fechar.hidden = true;
        texto.hidden = true;
        gsap.set(cta, { autoAlpha: 1 });
        restauraFoco();
        return;
      }

      // :scope > p são os parágrafos-placeholder (outros 5 cards); '.lista-grid li' é a lista do
      // Rejuvenescimento (ver animaEntradaConteudo). Os <p class="proc-item__desc"> do accordion nunca
      // entram — ficam de fora do autoAlpha pra não travar invisíveis num reabrir seguinte.
      // Primeiro a lista/X somem (fade curto, no máximo 0.2s pro clique no X continuar respondendo rápido);
      // só no onComplete disso é que o card começa a encolher — nunca os dois ao mesmo tempo, senão a
      // lista aparece sendo comprimida junto com o card (o Flip aqui é real, sem scale, ver nota em
      // abrirDesktop).
      var alvosSaidaTexto = [fechar].concat(Array.prototype.slice.call(texto.querySelectorAll(':scope > p, .lista-grid li')));
      gsap.to(alvosSaidaTexto, {
        autoAlpha: 0, duration: 0.2, ease: 'power2.out',
        onComplete: function () {
          fechar.hidden = true;
          texto.hidden = true;
          encolheCard();
        }
      });

      function encolheCard() {
        gsap.to(cta, { autoAlpha: 1, duration: DURACAO, delay: DURACAO * 0.3 });

        // O alvo (tamanho/posição de descanso) vem do próprio placeholder do card, que ficou parado no
        // slot certo o tempo todo — não precisa recolocar o card no .swiper-wrapper nem chamar
        // swiper.update() agora para medir isso. DOM e swiper.update() só mexem de novo no onComplete
        // (limpezaCompleta), depois que a animação toda (card e vizinhos) já terminou.
        var trackRectNow = root.getBoundingClientRect();
        var alvo = placeholderPara(card).getBoundingClientRect();

        var flipState = Flip.getState(flipTargets, { props: 'opacity,zIndex' });
        card.classList.remove('is-expanded');
        card.style.position = 'absolute';
        card.style.width = alvo.width + 'px';
        card.style.height = alvo.height + 'px';
        card.style.top = (alvo.top - trackRectNow.top) + 'px';
        card.style.left = (alvo.left - trackRectNow.left) + 'px';
        card.style.overflow = 'hidden';

        pushados.forEach(function (c) {
          gsap.to(c, { x: 0, autoAlpha: 1, duration: DURACAO, ease: EASE });
        });

        Flip.from(flipState, {
          duration: DURACAO,
          ease: EASE,
          absolute: true,
          onComplete: restauraFoco
        });
      }
    }

    function fecharInstantaneo(card) {
      var pushados = cards.filter(function (c) {
        return c.classList.contains('is-pushed-esquerda') || c.classList.contains('is-pushed-direita');
      });
      limpezaCompleta(card, pushados);
      root.classList.remove('has-expanded');
      card.querySelector('.card__hit').setAttribute('aria-expanded', 'false');
      card.querySelector('.card__fechar').hidden = true;
      card.querySelector('.card__texto').hidden = true;
      gsap.set(card.querySelector('.card__cta'), { autoAlpha: 1 });
      trava(cards, false);
      trava([controles], false);
      var swiper = root.swiper;
      if (swiper) {
        swiper.allowTouchMove = true;
        if (swiper.navigation) swiper.navigation.enable();
      }
      state.busy = false;
      state.expanded = null;
    }

    var listeners = [];
    function on(el, tipo, fn) { el.addEventListener(tipo, fn); listeners.push({ el: el, tipo: tipo, fn: fn }); }

    cards.forEach(function (card) {
      var hit = card.querySelector('.card__hit');
      var fechar = card.querySelector('.card__fechar');
      on(hit, 'click', function () {
        if (state.expanded !== null) return; // outro card expandido: ignora (ver inert nos outros cards)
        abrirDesktop(card);
      });
      on(fechar, 'click', function () { fecharDesktop(card); });
    });
    on(document, 'keydown', function (e) {
      if (e.key !== 'Escape' || state.expanded === null) return;
      var card = cards[state.expanded];
      if (card) fecharDesktop(card);
    });
    on(document, 'click', function (e) {
      if (state.expanded === null) return;
      var card = cards[state.expanded];
      if (card && !card.contains(e.target)) fecharDesktop(card);
    });

    return function cleanupDesktop() {
      listeners.forEach(function (l) { l.el.removeEventListener(l.tipo, l.fn); });
      if (state.expanded !== null) fecharInstantaneo(cards[state.expanded]);
    };
  }

  /* =========================== MOBILE (abaixo de 48rem) =========================== */
  function setupMobile(reduceMotion) {
    var DURACAO = 0.5;
    var EASE = 'power2.out';

    function headerH() {
      var v = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
      return parseFloat(v) || 0;
    }

    // autoHeight:true só no mobile (ver carrossel.js) é quem deixa o Swiper controlar a altura do
    // .swiper-wrapper pela altura real do slide ativo — sem isso, updateAutoHeight() não faz nada. Chama
    // com 0 (sem a transição própria do Swiper) sempre que é o PRÓPRIO GSAP quem está animando a altura
    // quadro a quadro (abrir/fechar o acordeão): sem o 0, o Swiper tentaria encadear a sua própria
    // transição de 500ms por cima disso a cada frame, brigando com o easing do GSAP. Na troca de slide via
    // arrasto (abaixo, slideChangeTransitionEnd) é diferente: aí é o Swiper quem está animando, então o
    // normal é deixar a transição dele (sem o 0) cuidar da suavidade.
    function syncAlturaInstantaneo() {
      var swiper = root.swiper;
      if (swiper && swiper.params.autoHeight) swiper.updateAutoHeight(0);
    }
    function syncAltura() {
      var swiper = root.swiper;
      if (swiper && swiper.params.autoHeight) swiper.updateAutoHeight();
    }

    function limpezaCompletaMobile(card) {
      var texto = card.querySelector('.card__texto');
      var fechar = card.querySelector('.card__fechar');
      gsap.killTweensOf([texto, fechar]);
      // Mesmo cuidado pros itens que animam soltos (fade + stagger de animaEntradaConteudo), ver nota
      // equivalente em limpezaCompleta (desktop).
      gsap.killTweensOf(texto.querySelectorAll(':scope > p, .lista-grid li'));
      card.classList.remove('is-expanded-mobile');
      fechar.hidden = true;
      texto.hidden = true;
      texto.removeAttribute('style');
      fechar.removeAttribute('style');
      card.querySelector('.card__hit').setAttribute('aria-expanded', 'false');
      root.style.overflow = '';
      syncAltura();
    }

    function abrirMobile(card) {
      if (state.busy || state.expanded !== null) return;
      var swiper = root.swiper;
      if (!swiper) return;
      garanteEntradaConcluida(card);

      state.busy = true;
      state.expanded = indexOfCard(card);

      var hit = card.querySelector('.card__hit');
      var fechar = card.querySelector('.card__fechar');
      var texto = card.querySelector('.card__texto');
      preencheTexto(card);
      recolheProcItens(texto);

      // Nada de inert nos outros cards nem de travar o arrasto: no mobile o carrossel continua
      // deslizando normalmente com um card aberto, inclusive pra tocar em outro card e trocar
      // (ver o roteamento do clique mais abaixo).
      root.style.overflow = 'visible'; // o card vai crescer além da altura atual do trilho; nada pode cortar

      card.classList.add('is-expanded-mobile');
      hit.setAttribute('aria-expanded', 'true');
      fechar.hidden = false;
      texto.hidden = false;

      // Sem o foco: finalizaAbertura só mede a altura real pro Swiper e rola a tela até o card, nunca
      // muda o quê está em foco. Quem foca o X é quem sabe que ele já está de fato visível -- no
      // reduceMotion isso é na hora (sem tween); animado, só no onComplete do próprio fade do X.
      function finalizaAbertura() {
        state.busy = false;
        syncAltura();
        var topo = card.getBoundingClientRect().top;
        if (topo < headerH()) {
          var destino = window.pageYOffset + topo - headerH() - 16;
          window.scrollTo({ top: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      }

      if (reduceMotion) {
        gsap.set(texto, { height: 'auto', autoAlpha: 1, overflow: 'visible' });
        gsap.set(fechar, { autoAlpha: 1 });
        finalizaAbertura();
        fechar.focus();
        return;
      }

      gsap.set(fechar, { autoAlpha: 0 });
      // texto (e tudo dentro dele) fica 100% invisível (autoAlpha, não só vazio) durante TODO o tween de
      // altura — mesmo raciocínio do desktop: a lista nunca aparece sendo revelada/comprimida no meio do
      // caminho. overflow:hidden (CSS já reforça isso) também evita qualquer scrollbar interna enquanto
      // a altura ainda está crescendo. Só quando o acordeão termina de crescer (onComplete) é que o
      // conteúdo aparece, com fade + stagger (animaEntradaConteudo) — ver abrirDesktop.
      gsap.set(texto, { height: 0, autoAlpha: 0, overflow: 'hidden' });
      // finalizaAbertura (mede a altura real pro Swiper, faz scroll) só roda depois do tween de altura
      // terminar. onUpdate mantém a altura do trilho (e o que vem depois da seção) descendo junto,
      // quadro a quadro, em vez de só pular pro tamanho certo no finalizaAbertura.
      gsap.to(texto, {
        height: 'auto', duration: DURACAO, ease: EASE, onUpdate: syncAlturaInstantaneo,
        onComplete: function () {
          texto.style.overflow = '';
          gsap.set(texto, { autoAlpha: 1 });
          animaEntradaConteudo(texto);
          gsap.to(fechar, { autoAlpha: 1, duration: 0.3, onComplete: function () { fechar.focus(); } });
          finalizaAbertura();
        }
      });
    }

    // aoTerminar (opcional): usado só por trocarMobile, pra abrir o próximo card no exato instante em que
    // este termina de fechar, sem soltar o "busy" entre os dois — assim um toque no meio da troca não cai
    // em nenhum card.
    function fecharMobile(card, aoTerminar) {
      if (state.busy || state.expanded === null || indexOfCard(card) !== state.expanded) return;
      var swiper = root.swiper;
      if (!swiper) return;
      garanteEntradaConcluida(card);

      state.busy = true;

      var hit = card.querySelector('.card__hit');
      var fechar = card.querySelector('.card__fechar');
      var texto = card.querySelector('.card__texto');

      function restauraFoco() {
        limpezaCompletaMobile(card);
        state.expanded = null;
        if (aoTerminar) { aoTerminar(); } else { state.busy = false; hit.focus(); }
      }

      if (reduceMotion) {
        restauraFoco();
        return;
      }

      // Primeiro a lista/X somem (fade curto); só no onComplete disso é que o acordeão começa a encolher
      // — nunca os dois ao mesmo tempo, senão a lista aparece sendo comprimida junto (mesmo raciocínio
      // do fecharDesktop).
      var alvosSaida = [fechar].concat(Array.prototype.slice.call(texto.querySelectorAll(':scope > p, .lista-grid li')));
      gsap.to(alvosSaida, {
        autoAlpha: 0, duration: 0.2, ease: 'power2.out',
        onComplete: function () {
          gsap.set(texto, { autoAlpha: 0, overflow: 'hidden' });
          gsap.to(texto, { height: 0, duration: DURACAO, ease: EASE, onUpdate: syncAlturaInstantaneo, onComplete: restauraFoco });
        }
      });
    }

    // Fecha o card antigo e, só quando essa animação termina de verdade (onComplete de fecharMobile),
    // abre o novo — nunca os dois ao mesmo tempo. state.busy fica true o tempo todo entre as duas, então
    // um toque nesse meio-tempo (em qualquer card) é ignorado pelo roteamento do clique, abaixo.
    function trocarMobile(cardAntigo, cardNovo) {
      fecharMobile(cardAntigo, function () {
        state.busy = false;
        abrirMobile(cardNovo);
      });
    }

    function fecharInstantaneo(card) {
      limpezaCompletaMobile(card);
      state.busy = false;
      state.expanded = null;
    }

    var listeners = [];
    function on(el, tipo, fn) { el.addEventListener(tipo, fn); listeners.push({ el: el, tipo: tipo, fn: fn }); }
    var swiperListeners = [];
    function onSwiper(evento, fn) {
      if (!root.swiper) return;
      root.swiper.on(evento, fn);
      swiperListeners.push({ evento: evento, fn: fn });
    }

    cards.forEach(function (card) {
      var hit = card.querySelector('.card__hit');
      var fechar = card.querySelector('.card__fechar');
      // O toque no card decide sozinho se abre, fecha ou troca, conforme o que já está aberto — cobre
      // tanto tocar no card fechado (abre) quanto tocar no próprio card já aberto, inclusive em cima do
      // texto do CTA "Fechar" (que é decorativo, aria-hidden, e fica dentro do .card__hit).
      on(hit, 'click', function () {
        if (state.busy) return;
        var meuIndex = indexOfCard(card);
        if (state.expanded === meuIndex) fecharMobile(card);
        else if (state.expanded === null) abrirMobile(card);
        else trocarMobile(cards[state.expanded], card);
      });
      on(fechar, 'click', function () { fecharMobile(card); });
    });
    on(document, 'keydown', function (e) {
      if (e.key !== 'Escape' || state.expanded === null) return;
      var card = cards[state.expanded];
      if (card) fecharMobile(card);
    });
    // Trocar de slide arrastando nunca fecha nem mexe no card aberto (ele continua aberto do jeito que
    // estava, CTA em "Fechar" e aria-expanded incluídos, mesmo se o usuário voltar pro slide dele depois)
    // — só mantém a altura do trilho em dia com a altura real de quem ficou visível (autoHeight, ver
    // carrossel.js). Sem argumento de velocidade aqui: é o Swiper quem está animando a troca de slide,
    // então o normal é a transição de altura dele (própria, suave) acompanhar junto.
    onSwiper('slideChangeTransitionEnd', syncAltura);

    return function cleanupMobile() {
      listeners.forEach(function (l) { l.el.removeEventListener(l.tipo, l.fn); });
      swiperListeners.forEach(function (l) { if (root.swiper) root.swiper.off(l.evento, l.fn); });
      if (state.expanded !== null) fecharInstantaneo(cards[state.expanded]);
    };
  }

  var mm = gsap.matchMedia();
  mm.add(
    // isDesktop e isMobile têm que ser o par completo (cobrem 100% dos casos, sem sobra nem buraco):
    // o gsap.matchMedia só chama essa função quando pelo menos UMA das condições do objeto for
    // verdadeira. Com só isDesktop + reduceMotion (como estava antes), um celular comum --- tela
    // estreita E sem "reduzir movimento" ligado no sistema --- deixa as duas falsas ao mesmo tempo,
    // a função nunca roda, setupMobile() nunca é chamado e nenhum clique no card funciona. isMobile
    // aqui só existe pra garantir que o OR das condições nunca fique com tudo falso; quem decide o
    // ramo continua sendo context.conditions.isDesktop.
    { isDesktop: '(min-width: 48rem)', isMobile: '(max-width: 47.99rem)', reduceMotion: '(prefers-reduced-motion: reduce)' },
    function (context) {
      var reduceMotion = context.conditions.reduceMotion;
      return context.conditions.isDesktop ? setupDesktop(reduceMotion) : setupMobile(reduceMotion);
    }
  );
})();
