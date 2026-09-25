(function () {
  'use strict';

  /* Menu mobile. As animações ficam em js/animations.js. */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu-principal');

  if (toggle && nav) {
    var desktop = window.matchMedia('(min-width: 64rem)');

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
})();
