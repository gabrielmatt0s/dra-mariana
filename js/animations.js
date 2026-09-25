/*
 * Camada de animações (GSAP + ScrollTrigger + SplitText + DrawSVGPlugin).
 * Sistema orientado por atributos: cada seção nova só precisa dos data-attributes (ver CLAUDE.md, "Padrões de animação").
 *
 * - Sem GSAP (CDN fora do ar) ou com prefers-reduced-motion: a classe js-anim nunca existe e todo o conteúdo fica visível.
 * - Só transform, opacity, clip-path e visibility (via autoAlpha). Exceção pedida: letter-spacing dos títulos em caixa alta.
 * - Entradas com once: true. Só parallax e scrub reagem ao rolar de volta.
 */
(function () {
  'use strict';

  var html = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || !window.DrawSVGPlugin) return;

  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  var EASE = 'expo.out';

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function init(desktop) {
    var k = desktop ? 1 : 0.75;    // mobile: durações mais curtas
    var dy = desktop ? 20 : 14;    // mobile: deslocamentos menores
    var undo = [];

    /* ---------- Efeitos por atributo ---------- */

    var EFFECTS = {
      /* 2. Títulos de seção: linhas sobem de uma máscara; em caixa alta o letter-spacing abre levemente */
      title: function (el) {
        var cs = getComputedStyle(el);
        var finalLs = parseFloat(cs.letterSpacing) || 0;
        var startLs = 0.02 * parseFloat(cs.fontSize);
        var caps = cs.textTransform === 'uppercase' && finalLs > 0;
        SplitText.create(el, {
          type: 'lines', mask: 'lines', linesClass: 'sl', autoSplit: true,
          onSplit: function (self) {
            var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
            tl.from(self.lines, { yPercent: 110, duration: 1.2 * k, stagger: 0.12, ease: EASE });
            if (caps) {
              tl.fromTo(self.lines, { letterSpacing: startLs + 'px' }, { letterSpacing: finalLs + 'px', duration: 1.4 * k, stagger: 0.12, ease: 'power3.out' }, 0);
            }
            gsap.set(el, { autoAlpha: 1 });
            return tl;
          }
        });
      },

      /* 3. Eyebrows: a linha fina cresce primeiro, depois o texto entra com fade e deslocamento lateral */
      eyebrow: function (el) {
        var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
        eyebrowTweens(el, tl, 0);
      },

      /* 4. Parágrafos: linhas com fade e y 20 para 0. Parágrafo longo no mobile anima como bloco único. */
      text: function (el) {
        if (!desktop && el.textContent.length > 160) {
          gsap.fromTo(el, { autoAlpha: 0, y: dy }, {
            autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
          });
          return;
        }
        SplitText.create(el, {
          type: 'lines', linesClass: 'sl', autoSplit: true,
          onSplit: function (self) {
            var tween = gsap.fromTo(self.lines, { autoAlpha: 0, y: dy }, {
              autoAlpha: 1, y: 0, duration: 0.9 * k, stagger: 0.06, ease: EASE,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true }
            });
            gsap.set(el, { autoAlpha: 1 });
            return tween;
          }
        });
      },

      /* 5. Frase de destaque: palavras de opacity 0.15 para 1 conforme o scroll (scrub) */
      quote: function (el) {
        SplitText.create(el, {
          type: 'words', wordsClass: 'sw', autoSplit: true,
          onSplit: function (self) {
            gsap.set(el, { autoAlpha: 1 });
            return gsap.fromTo(self.words, { opacity: 0.15 }, {
              opacity: 1, ease: 'none', stagger: 0.1,
              scrollTrigger: { trigger: el, start: 'clamp(top 80%)', end: 'clamp(bottom 55%)', scrub: true }
            });
          }
        });
      },

      /* 6. Credencial: linhas de bronze crescem das pontas para o centro, o texto aparece depois */
      cred: function (el) {
        var halves = $$('.rule i', el), text = el.querySelector('.cred__text');
        gsap.set(halves, { scaleX: 0 });
        gsap.set(text, { autoAlpha: 0, y: 10 });
        gsap.set(el, { autoAlpha: 1 });
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
          .to(halves, { scaleX: 1, duration: 1.2 * k, ease: EASE })
          .to(text, { autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE }, '-=0.5');
      },

      /* 7 e 15. Cards: entram em stagger; o número vem antes do nome, com leve deslocamento vertical */
      cards: function (list) {
        var cards = $$('.card', list);
        cards.forEach(function (card) {
          gsap.set(card, { autoAlpha: 0, y: 40 });
          gsap.set($$('.card__num', card), { autoAlpha: 0, y: 12 });
          gsap.set($$('.line', card), { scaleX: 0 });
          gsap.set($$('.card__title', card), { autoAlpha: 0, y: 14 });
          if (card.querySelector('.card__media')) gsap.set($$('.card__media', card), { autoAlpha: 0 });
        });
        gsap.set(list, { autoAlpha: 1 });
        ScrollTrigger.batch(cards, {
          start: 'top 90%', once: true,
          onEnter: function (batch) {
            var tl = gsap.timeline();
            batch.forEach(function (card, i) {
              var at = i * 0.12;
              tl.to(card, { autoAlpha: 1, y: 0, duration: 1 * k, ease: EASE }, at);
              tl.to($$('.card__media', card), { autoAlpha: 1, duration: 0.9 * k, ease: EASE }, at + 0.1);
              tl.to($$('.card__num', card), { autoAlpha: 1, y: 0, duration: 0.8 * k, ease: EASE }, at + 0.15);
              tl.to($$('.line', card), { scaleX: 1, duration: 0.9 * k, ease: EASE }, at + 0.3);
              tl.to($$('.card__title', card), { autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE }, at + 0.4);
            });
          }
        });
      },

      /* 8. Listas (procedimentos, contatos): itens em stagger de 0.05s; o divisor de 1px cresce antes do texto */
      list: function (ul) {
        var items = $$(':scope > li', ul);
        items.forEach(function (li) {
          gsap.set($$('.line', li), { scaleX: 0 });
          gsap.set($$('.li__text', li), { autoAlpha: 0, y: 10 });
        });
        gsap.set(ul, { autoAlpha: 1 });
        ScrollTrigger.batch(items, {
          start: 'top 92%', once: true,
          onEnter: function (batch) {
            var tl = gsap.timeline();
            batch.forEach(function (li, i) {
              var at = i * (desktop ? 0.05 : 0.04);
              tl.to($$('.line', li), { scaleX: 1, duration: 0.9 * k, ease: EASE }, at);
              tl.to($$('.li__text', li), { autoAlpha: 1, y: 0, duration: 0.8 * k, ease: EASE }, at + 0.18);
            });
          }
        });
      },

      /* 9 e 16. Valores: o losango é desenhado (DrawSVG) e só depois a palavra aparece */
      valores: function (ul) {
        var items = $$(':scope > li', ul);
        items.forEach(function (li) {
          gsap.set($$('.valor__icone path', li), { drawSVG: '0%' });
          gsap.set($$('span', li), { autoAlpha: 0, y: 10 });
        });
        gsap.set(ul, { autoAlpha: 1 });
        var tl = gsap.timeline({ scrollTrigger: { trigger: ul, start: 'top 88%', once: true } });
        items.forEach(function (li, i) {
          var at = i * 0.18, draw = 1.1 * k;
          tl.to($$('.valor__icone path', li), { drawSVG: '100%', duration: draw, ease: 'power3.inOut' }, at);
          tl.to($$('span', li), { autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE }, at + draw);
        });
      },

      /* 16. Grafismo de losangos (SVG decorativo): contorno desenhado com DrawSVG */
      draw: function (svg) {
        var paths = $$('path', svg);
        gsap.set(paths, { drawSVG: '0%' });
        gsap.set(svg, { autoAlpha: 1 });
        gsap.to(paths, {
          drawSVG: '100%', duration: 1.6 * k, stagger: 0.25, ease: 'power2.inOut',
          scrollTrigger: { trigger: svg, start: 'top 85%', once: true }
        });
      },

      /* 12 e 13. Fotos: revelação por clip-path (de baixo para cima), zoom 1.15 para 1 e parallax no desktop */
      photo: function (fig) {
        var isHero = fig.hasAttribute('data-hero');
        var clip = fig.querySelector('.photo__clip'), inner = fig.querySelector('.photo__inner');
        var top = fig.querySelector('.f-top'), right = fig.querySelector('.f-right');
        var bottom = fig.querySelector('.f-bottom'), left = fig.querySelector('.f-left');
        gsap.set(clip, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(inner, { scale: 1.15 });

        var tl = gsap.timeline({
          delay: isHero ? 0.2 : 0,
          scrollTrigger: { trigger: fig, start: 'top 90%', once: true }
        });
        tl.to(clip, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 * k, ease: 'power3.inOut' }, 0);
        tl.to(inner, { scale: 1, duration: 1.8 * k, ease: EASE }, 0);

        if (top) {
          // Moldura de bronze desenhada depois da foto, no sentido horário
          gsap.set([top, bottom], { scaleX: 0 });
          gsap.set([right, left], { scaleY: 0 });
          var t0 = 1.0 * k, d = 0.6 * k;
          tl.to(top, { scaleX: 1, duration: d, ease: 'power2.out' }, t0);
          tl.to(right, { scaleY: 1, duration: d, ease: 'power2.out' }, t0 + d * 0.7);
          tl.to(bottom, { scaleX: 1, duration: d, ease: 'power2.out' }, t0 + d * 1.4);
          tl.to(left, { scaleY: 1, duration: d, ease: 'power2.out' }, t0 + d * 2.1);
        }
        gsap.set(fig, { autoAlpha: 1 });

        // Parallax sutil na imagem interna (yPercent de -8 a 8), só no desktop. Funciona igual com placeholder e foto real.
        if (desktop) {
          gsap.fromTo(inner, { yPercent: -8 }, {
            yPercent: 8, ease: 'none',
            scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
          });
        }
      },

      /* Bloco simples: fade com y 20 para 0 */
      fade: function (el) {
        gsap.fromTo(el, { autoAlpha: 0, y: dy }, {
          autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true }
        });
      },

      /* 14. Linha fina isolada: scaleX 0 para 1, transform-origin left */
      line: function (el) {
        gsap.fromTo(el, { scaleX: 0 }, {
          scaleX: 1, duration: 1 * k, ease: EASE,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true }
        });
        gsap.set(el, { autoAlpha: 1 });
      }
    };

    /* ---------- Helpers ---------- */

    function eyebrowTweens(el, tl, at) {
      var line = el.querySelector('.eyebrow__line'), text = el.querySelector('.eyebrow__text');
      gsap.set(line, { scaleX: 0 });
      gsap.set(text, { autoAlpha: 0, x: -14 });
      gsap.set(el, { autoAlpha: 1 });
      tl.to(line, { scaleX: 1, duration: 0.8 * k, ease: EASE }, at);
      tl.to(text, { autoAlpha: 1, x: 0, duration: 0.9 * k, ease: EASE }, at + 0.5 * k);
    }

    /* 1 e 17. Hero em sequência: headline, eyebrow, subtítulo, credenciais e CTA (CTA totalmente visível em ~1,2 s) */
    function hero() {
      var g = function (name) { return document.querySelector('[data-hero="' + name + '"]'); };
      var title = g('title'), eyebrow = g('eyebrow'), subtitle = g('subtitle');
      var creds = g('creds'), cta = g('cta'), note = g('note');
      if (!title) return;

      gsap.set([subtitle, creds, cta, note], { autoAlpha: 0, y: dy });

      var started = false;
      function start() {
        if (started) return;
        started = true;

        SplitText.create(title, {
          type: 'lines', mask: 'lines', linesClass: 'sl', autoSplit: true,
          onSplit: function (self) {
            gsap.set(title, { autoAlpha: 1 });
            return gsap.fromTo(self.lines, { yPercent: 110 }, {
              yPercent: 0, duration: 1.2 * k, stagger: 0.12, delay: 0.1, ease: EASE
            });
          }
        });

        var tl = gsap.timeline();
        eyebrowTweens(eyebrow, tl, 0.35);
        tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE }, 0.5);
        tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.75 * k, ease: EASE }, 0.45);
        tl.to(creds, { autoAlpha: 1, y: 0, duration: 0.8 * k, ease: EASE }, 0.55);
        tl.to(note, { autoAlpha: 1, y: 0, duration: 0.8 * k, ease: EASE }, 0.65);
      }

      // Espera as fontes para a primeira quebra de linhas sair correta (com teto de 0,9 s para não atrasar o CTA)
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
      window.setTimeout(start, 900);
    }

    /* 18. Header: esconde ao rolar para baixo e reaparece ao rolar para cima (fundo já é sólido) */
    function header() {
      var bar = document.querySelector('.site-header');
      var toggle = document.querySelector('.menu-toggle');
      if (!bar) return;
      var hidden = false;
      function set(hide) {
        if (hide === hidden) return;
        hidden = hide;
        gsap.to(bar, { yPercent: hide ? -100 : 0, duration: 0.6 * k + 0.2, ease: 'power3.out', overwrite: 'auto' });
      }
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: function (self) {
          var menuOpen = toggle && toggle.getAttribute('aria-expanded') === 'true';
          if (menuOpen || self.scroll() < bar.offsetHeight * 1.5) { set(false); return; }
          if (self.direction === 1) set(true);
          else if (self.direction === -1) set(false);
        }
      });
      bar.addEventListener('focusin', function () { set(false); });
    }

    /* 11. Botões: o texto sobe e uma cópia idêntica entra por baixo (CSS em components.css). Duplicata com aria-hidden. */
    function rollButtons(restore) {
      $$('.btn').forEach(function (btn) {
        var node = Array.prototype.filter.call(btn.childNodes, function (n) {
          return n.nodeType === 3 && n.textContent.trim();
        })[0];
        if (!node) return;
        var label = node.textContent.trim();
        var roll = document.createElement('span');
        var a = document.createElement('span'), b = document.createElement('span');
        roll.className = 'btn__roll';
        a.className = 'btn__roll-a'; a.textContent = label;
        b.className = 'btn__roll-b'; b.textContent = label; b.setAttribute('aria-hidden', 'true');
        roll.appendChild(a); roll.appendChild(b);
        btn.replaceChild(roll, node);
        restore.push(function () { if (roll.parentNode) roll.parentNode.replaceChild(document.createTextNode(label), roll); });
      });
    }

    function run() {
      html.classList.add('js-anim');
      rollButtons(undo);
      header();
      hero();

      // Seções: sempre na ordem do documento (ScrollTrigger calcula as posições de cima para baixo)
      $$('[data-anim]').forEach(function (el) {
        var effect = EFFECTS[el.getAttribute('data-anim')];
        if (effect) effect(el); else gsap.set(el, { autoAlpha: 1 });
      });

      // Recalcula posições quando as fontes chegam (as linhas do SplitText mudam de altura)
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }

    run();

    return function () {
      html.classList.remove('js-anim');
      undo.forEach(function (fn) { fn(); });
    };
  }

  var mm = gsap.matchMedia();
  mm.add({
    reduce: '(prefers-reduced-motion: reduce)',
    desktop: '(min-width: 64rem) and (prefers-reduced-motion: no-preference)',
    mobile: '(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)'
  }, function (context) {
    var c = context.conditions;
    if (c.reduce) return;   // sem animação: tudo visível direto
    try {
      return init(!!c.desktop);
    } catch (error) {
      // Qualquer falha deixa o conteúdo visível
      if (window.console) console.error('animations.js:', error);
      html.classList.remove('js-anim');
      window.setTimeout(function () { mm.revert(); }, 0);
    }
  });
})();
