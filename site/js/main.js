(function () {
  'use strict';

  /* Menu mobile. As animações ficam em js/animations.js. */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu-principal');

  if (toggle && nav) {
    var desktop = window.matchMedia('(min-width: 80rem)');

    var isOpen = function () {
      return toggle.getAttribute('aria-expanded') === 'true';
    };

    var syncInert = function () {
      // Mobile com painel fechado: links escondidos não recebem foco
      var hidden = !desktop.matches && !isOpen();
      if (hidden) nav.setAttribute('inert', ''); else nav.removeAttribute('inert');
    };

    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      syncInert();
    };

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    // Fecha ao escolher um link do menu
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    // Fecha com Esc e devolve o foco ao botão
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Ao passar para desktop, o menu volta ao estado normal
    desktop.addEventListener('change', function (event) {
      if (event.matches) setOpen(false); else syncInert();
    });

    syncInert();
  }

  /* Ano do rodapé automático */
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });

  /* Botão flutuante do WhatsApp: não fica em cima do texto durante a leitura */
  var fab = document.querySelector('.whatsapp-float');
  if (fab) {
    var lastY = window.pageYOffset;
    var ticking = false;
    var update = function () {
      var y = window.pageYOffset;
      var nearEnd = y + window.innerHeight >= document.documentElement.scrollHeight - 320;
      if (nearEnd || y < 300 || y < lastY - 4) fab.classList.remove('is-away');
      else if (y > lastY + 4) fab.classList.add('is-away');
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
  }
  /* Altura do header em --header-h: as seções do desktop usam 100svh menos essa altura */
  var header = document.querySelector('.site-header');
  if (header) {
    var setHeaderH = function () { document.documentElement.style.setProperty('--header-h', header.getBoundingClientRect().height + 'px'); };
    setHeaderH();
    if (window.ResizeObserver) new ResizeObserver(setHeaderH).observe(header);
    else window.addEventListener('resize', setHeaderH);
  }
  /* Logo do header: volta ao topo (suave, ou instantâneo com movimento reduzido), fecha o menu mobile e deixa a URL limpa */
  var logo = document.querySelector('.site-header__logo');
  if (logo && (logo.getAttribute('href') || '').charAt(0) === '#') {
    logo.addEventListener('click', function (event) {
      event.preventDefault();
      if (toggle && toggle.getAttribute('aria-expanded') === 'true') toggle.click();
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
    });
  }
  /* Mapa: o iframe do Google só é criado depois do clique em "Ver mapa" (nenhum dado vai ao Google antes disso) */
  var mapa = document.querySelector('.mapa[data-mapa-src]');
  if (mapa) {
    var botao = mapa.querySelector('.mapa__botao');
    if (botao) botao.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.title = mapa.getAttribute('data-mapa-titulo') || 'Mapa';
      frame.src = mapa.getAttribute('data-mapa-src');
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      var previa = mapa.querySelector('.mapa__previa');
      mapa.replaceChild(frame, previa);
      frame.focus();
    });
  }
})();
