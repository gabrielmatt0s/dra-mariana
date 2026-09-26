/*
 * Carrossel de Tratamentos (Swiper). Sem Swiper ou sem JavaScript, os cards ficam em grade normal e os controles ficam ocultos.
 * Desktop (1024+): 3 cards, avança de 3 em 3. Tablet (768 a 1023): 2 cards e ~15% do próximo, avança de 1 em 1.
 * Mobile: 1 card e ~15% do próximo, avança de 1 em 1. Sem loop.
 */
(function () {
  'use strict';

  var root = document.querySelector('.trat');
  if (!root || !window.Swiper) return;

  var wrap = root.closest('.trat__wrap');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var atual = wrap.querySelector('.trat__atual');
  var total = wrap.querySelector('.trat__total');
  var dica = wrap.querySelector('.trat__dica');
  var interacted = false;

  function pad(n, twoDigits) { return twoDigits && n < 10 ? '0' + n : String(n); }

  var swiper = new Swiper(root, {
    // slidesPerView 'auto' + largura em CSS deixa exatamente ~15% do próximo card à mostra (mobile e tablet)
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    spaceBetween: 16,
    slidesOffsetBefore: 20,
    slidesOffsetAfter: 20,
    speed: reduce ? 0 : 500,
    grabCursor: true,
    watchOverflow: true,
    breakpoints: {
      768: { spaceBetween: 24, slidesOffsetBefore: 24, slidesOffsetAfter: 24 },
      1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24, slidesOffsetBefore: 0, slidesOffsetAfter: 0 }
    },
    navigation: { prevEl: '.trat__seta--ant', nextEl: '.trat__seta--prox' },
    pagination: { el: '.trat__progresso', type: 'progressbar' },
    keyboard: { enabled: false },     // teclado só com o carrossel em foco (ver abaixo)
    a11y: {
      enabled: true,
      prevSlideMessage: 'Tratamento anterior',
      nextSlideMessage: 'Próximo tratamento',
      slideLabelMessage: 'Tratamento {{index}} de {{slidesLength}}'
    }
  });

  function atualizaContador() {
    var pares = swiper.params.slidesPerGroup > 1;      // desktop: "1 / 2"; mobile e tablet: "01 / 06"
    var n = swiper.snapGrid.length;
    atual.textContent = pad(swiper.snapIndex + 1, !pares);
    total.textContent = pad(n, !pares);
  }
  swiper.on('slideChange', atualizaContador);
  swiper.on('snapGridLengthChange', atualizaContador);
  swiper.on('breakpoint', atualizaContador);
  swiper.on('resize', atualizaContador);
  atualizaContador();

  // Teclado: setas esquerda e direita quando o carrossel (região) está em foco
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { swiper.slideNext(); e.preventDefault(); markInteracted(); }
    else if (e.key === 'ArrowLeft') { swiper.slidePrev(); e.preventDefault(); markInteracted(); }
  });

  // "Deslize para ver mais" some depois da primeira interação
  function markInteracted() {
    interacted = true;
    if (dica) dica.classList.add('is-hidden');
  }
  swiper.on('touchStart', markInteracted);
  wrap.querySelectorAll('.trat__seta').forEach(function (b) { b.addEventListener('click', markInteracted); });

  // Só mostra os controles quando o Swiper iniciou
  wrap.classList.add('trat-ready');

  // Na primeira vez que entra na tela: deslocamento de ~40px para o lado e de volta (uma vez, não roda com movimento reduzido)
  if (!reduce && 'IntersectionObserver' in window && root.animate) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.disconnect();
        window.setTimeout(function () {
          if (interacted || swiper.isEnd) return;
          var base = swiper.translate;
          var anim = swiper.wrapperEl.animate([
            { transform: 'translate3d(' + base + 'px,0,0)' },
            { transform: 'translate3d(' + (base - 40) + 'px,0,0)', offset: 0.45 },
            { transform: 'translate3d(' + base + 'px,0,0)' }
          ], { duration: 1300, easing: 'ease-in-out' });
          swiper.once('touchStart', function () { anim.cancel(); });
        }, 900);
      });
    }, { threshold: 0.5 });
    io.observe(root);
  }
})();

/*
 * Avaliações no desktop baixo (faixa com rolagem lateral, ver css/sections.css): setas, contador e barra de progresso
 * no mesmo padrão do carrossel de Tratamentos. Fora desse modo os controles ficam ocultos e a lista é grade (ou rolagem nativa no mobile).
 */
(function () {
  'use strict';

  var lista = document.querySelector('.avaliacoes__lista');
  var controles = document.querySelector('.avaliacoes__controles');
  if (!lista || !controles) return;

  var ant = controles.querySelector('.avaliacoes__seta--ant');
  var prox = controles.querySelector('.avaliacoes__seta--prox');
  var atual = controles.querySelector('.avaliacoes__atual');
  var total = controles.querySelector('.avaliacoes__total');
  var fill = controles.querySelector('.avaliacoes__progresso-fill');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function atualiza() {
    var max = lista.scrollWidth - lista.clientWidth;
    if (max <= 2) { ant.disabled = true; prox.disabled = true; return; }
    var paginas = Math.max(1, Math.ceil(lista.scrollWidth / lista.clientWidth - 0.05));
    var noInicio = lista.scrollLeft <= 2;
    var noFim = lista.scrollLeft >= max - 2;
    var pagina = noInicio ? 1 : noFim ? paginas : Math.round(lista.scrollLeft / max * (paginas - 1)) + 1;
    atual.textContent = String(pagina);
    total.textContent = String(paginas);
    fill.style.transform = 'scaleX(' + Math.min(1, (lista.scrollLeft + lista.clientWidth) / lista.scrollWidth).toFixed(3) + ')';
    ant.disabled = noInicio;
    prox.disabled = noFim;
  }

  function passo(direcao) {
    lista.scrollBy({ left: direcao * lista.clientWidth * 0.95, behavior: reduce ? 'auto' : 'smooth' });
  }

  ant.addEventListener('click', function () { passo(-1); });
  prox.addEventListener('click', function () { passo(1); });
  lista.addEventListener('scroll', atualiza, { passive: true });
  window.addEventListener('resize', atualiza);
  atualiza();
})();
