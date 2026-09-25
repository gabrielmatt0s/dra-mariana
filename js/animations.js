/*
 * Camada de animações guiadas pela rolagem (GSAP + ScrollTrigger + SplitText + DrawSVGPlugin).
 * Sistema orientado por atributos: cada seção nova só precisa dos data-attributes (ver CLAUDE.md, "Padrões de animação").
 *
 * - Toda entrada usa scrub: o efeito acompanha a rolagem e volta junto quando a pessoa rola para cima.
 *   Padrão: scrub 1, início com o elemento a 85% da altura da tela, fim a 50% (clamp() garante que termine mesmo no fim da página).
 * - Exceção: o hero anima ao carregar (não depende de rolagem).
 * - Sem GSAP (CDN fora do ar) ou com prefers-reduced-motion: a classe js-anim nunca existe e todo o conteúdo fica visível.
 * - Só transform, opacity e clip-path.
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
    var m = desktop ? 1 : 0.5;     // mobile: metade dos deslocamentos em y
    var k = desktop ? 1 : 0.75;    // mobile: hero mais curto
    var dy = 20 * m;               // deslocamento padrão de texto
    var dyBig = 40 * m;            // cards e itens de lista
    var undo = [];

    // ScrollTrigger padrão: scrub 1, começa a 85% da tela e termina a 50%. clamp() evita que o fim fique além do fim da página.
    function st(trigger, o) {
      return Object.assign({ trigger: trigger, start: 'clamp(top 85%)', end: 'clamp(top 50%)', scrub: 1 }, o || {});
    }
    // Revela o elemento depois de preparar os filhos (o CSS o esconde sob .js-anim). Só visibility: opacity fica com cada efeito.
    function show(el) { gsap.set(el, { visibility: 'visible' }); }

    var EFFECTS = {
      /* Títulos: linhas sobem de dentro de uma máscara */
      title: function (el) {
        SplitText.create(el, {
          type: 'lines', mask: 'lines', linesClass: 'sl', autoSplit: true,
          onSplit: function (self) {
            var tween = gsap.fromTo(self.lines, { yPercent: 110 }, {
              yPercent: 0, ease: 'none', stagger: 0.2, scrollTrigger: st(el)
            });
            show(el);
            return tween;
          }
        });
      },

      /* Eyebrows: a linha fina cresce e depois o texto entra pela esquerda */
      eyebrow: function (el) {
        var line = el.querySelector('.eyebrow__line'), text = el.querySelector('.eyebrow__text');
        var tl = gsap.timeline({ scrollTrigger: st(el) });
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 });
        tl.fromTo(text, { opacity: 0, x: -14 }, { opacity: 1, x: 0, ease: 'none', duration: 1 }, 0.5);
        show(el);
      },

      /* Parágrafos: linhas de opacity 0 para 1 e y 20 para 0. No mobile, parágrafo longo anima como bloco. */
      text: function (el) {
        if (!desktop && el.textContent.length > 160) {
          gsap.fromTo(el, { opacity: 0, y: dy }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: st(el) });
          show(el);
          return;
        }
        SplitText.create(el, {
          type: 'lines', linesClass: 'sl', autoSplit: true,
          onSplit: function (self) {
            var tween = gsap.fromTo(self.lines, { opacity: 0, y: dy }, {
              opacity: 1, y: 0, ease: 'none', stagger: 0.25, scrollTrigger: st(el)
            });
            show(el);
            return tween;
          }
        });
      },

      /* Frase de destaque: PALAVRAS (nunca caracteres, para não separar acentos) de opacity 0.15 para 1 em sequência,
         com cada linha subindo de leve (y 20 para 0). Início a 80% da tela, fim a 40%. */
      quote: function (el) {
        SplitText.create(el, {
          type: 'lines,words', linesClass: 'sl', wordsClass: 'sw', autoSplit: true,
          onSplit: function (self) {
            var tl = gsap.timeline({ scrollTrigger: st(el, { start: 'clamp(top 80%)', end: 'clamp(top 40%)' }) });
            tl.fromTo(self.words, { opacity: 0.15 }, { opacity: 1, ease: 'none', stagger: 0.1, duration: 0.6 }, 0);
            tl.fromTo(self.lines, { y: dy }, { y: 0, ease: 'none', stagger: { amount: 0.7 }, duration: 0.5 }, 0);
            show(el);
            return tl;
          }
        });
      },

      /* Credencial/proposta: linhas de bronze crescem das pontas para o centro, o texto aparece depois */
      cred: function (el) {
        var halves = $$('.rule i', el), text = el.querySelector('.cred__text');
        var tl = gsap.timeline({ scrollTrigger: st(el) });
        tl.fromTo(halves, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 });
        tl.fromTo(text, { opacity: 0, y: dy / 2 }, { opacity: 1, y: 0, ease: 'none', duration: 0.7 }, 0.5);
        show(el);
      },

      /* Cards: entrada escalonada (y 40 para 0, opacity 0 para 1), um após o outro conforme a rolagem.
         Número, linha e nome entram em sequência dentro de cada card. */
      cards: function (list) {
        var cards = $$('.card', list);
        // Adiciona o tween só se o card tiver o elemento (evita avisos do GSAP para alvos vazios)
        function part(tl, sel, card, from, to, pos) {
          var els = $$(sel, card);
          if (els.length) tl.fromTo(els, from, to, pos);
        }
        cards.forEach(function (card, i) {
          var col = desktop ? i % 3 : 0;               // colunas seguintes começam um pouco depois
          var tl = gsap.timeline({ scrollTrigger: st(card, { start: 'clamp(top ' + (88 - col * 4) + '%)', end: 'clamp(top ' + (52 - col * 4) + '%)' }) });
          tl.fromTo(card, { opacity: 0, y: dyBig }, { opacity: 1, y: 0, ease: 'none', duration: 1 }, 0);
          part(tl, '.card__num', card, { opacity: 0, y: 12 * m }, { opacity: 1, y: 0, ease: 'none', duration: 0.6 }, 0.25);
          part(tl, '.line', card, { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 0.6 }, 0.5);
          part(tl, '.card__title', card, { opacity: 0, y: 14 * m }, { opacity: 1, y: 0, ease: 'none', duration: 0.6 }, 0.7);
          part(tl, '.card__media', card, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.8 }, 0.2);
        });
        show(list);
      },

      /* Listas (procedimentos, contatos): cada item entra conforme a rolagem; o divisor de 1px cresce antes do texto */
      list: function (ul) {
        var items = $$(':scope > li', ul);
        var twoCols = desktop && getComputedStyle(ul).gridTemplateColumns.split(' ').length > 1;
        items.forEach(function (li, i) {
          var col = twoCols ? i % 2 : 0;
          var tl = gsap.timeline({ scrollTrigger: st(li, { start: 'clamp(top ' + (90 - col * 4) + '%)', end: 'clamp(top ' + (54 - col * 4) + '%)' }) });
          tl.fromTo($$('.line', li), { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 0.7 }, 0);
          tl.fromTo($$('.li__text', li), { opacity: 0, y: dyBig }, { opacity: 1, y: 0, ease: 'none', duration: 0.9 }, 0.3);
        });
        show(ul);
      },

      /* Valores: o losango é desenhado (DrawSVG) e só depois a palavra aparece */
      valores: function (ul) {
        var items = $$(':scope > li', ul);
        var tl = gsap.timeline({ scrollTrigger: st(ul, { start: 'clamp(top 88%)', end: 'clamp(top 45%)' }) });
        items.forEach(function (li, i) {
          var at = i * 0.18;
          tl.fromTo($$('.valor__icone path', li), { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: 1 }, at);
          tl.fromTo($$('span', li), { opacity: 0, y: 10 * m }, { opacity: 1, y: 0, ease: 'none', duration: 0.6 }, at + 1);
        });
        show(ul);
      },

      /* Grafismo de losangos (SVG decorativo): contorno desenhado com DrawSVG */
      draw: function (svg) {
        gsap.fromTo($$('path', svg), { drawSVG: '0%' }, {
          drawSVG: '100%', ease: 'none', stagger: 0.3,
          scrollTrigger: st(svg, { start: 'clamp(top 85%)', end: 'clamp(top 40%)' })
        });
        show(svg);
      },

      /* Fotos e placeholders: clip-path de baixo para cima com zoom 1.15 para 1 e parallax sutil no desktop.
         O hero faz a revelação ao carregar (ver hero()) e aqui só ganha o parallax. */
      photo: function (fig) {
        var isHero = fig.hasAttribute('data-hero');
        var clip = fig.querySelector('.photo__clip'), inner = fig.querySelector('.photo__inner');
        if (!isHero) {
          var tl = gsap.timeline({ scrollTrigger: st(fig, { start: 'clamp(top 85%)', end: 'clamp(top 45%)' }) });
          tl.fromTo(clip, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0);
          tl.fromTo(inner, { scale: 1.15 }, { scale: 1, ease: 'none', duration: 1 }, 0);
        }
        show(fig);
        if (desktop) {
          gsap.fromTo(inner, { yPercent: -8 }, {
            yPercent: 8, ease: 'none',
            scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
          });
        }
      },

      /* Bloco simples: opacity 0 para 1 e y 20 para 0 */
      fade: function (el) {
        gsap.fromTo(el, { opacity: 0, y: dy }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: st(el) });
        show(el);
      },

      /* Linha fina isolada: scaleX de 0 para 1, transform-origin left */
      line: function (el) {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st(el) });
        show(el);
      }
    };

    /* ---------- Hero: anima ao carregar, em sequência (CTA visível em ~1,2 s) ---------- */
    function hero() {
      var g = function (name) { return document.querySelector('[data-hero="' + name + '"]'); };
      var title = g('title'), eyebrow = g('eyebrow'), subtitle = g('subtitle');
      var creds = g('creds'), cta = g('cta'), note = g('note'), fig = g('photo');
      if (!title) return;

      var line = eyebrow.querySelector('.eyebrow__line'), etext = eyebrow.querySelector('.eyebrow__text');
      gsap.set(line, { scaleX: 0 });
      gsap.set(etext, { autoAlpha: 0, x: -14 });
      gsap.set(eyebrow, { autoAlpha: 1 });
      gsap.set([subtitle, creds, cta, note], { autoAlpha: 0, y: 20 * m });

      var clip = fig.querySelector('.photo__clip'), inner = fig.querySelector('.photo__inner');
      var top = fig.querySelector('.f-top'), right = fig.querySelector('.f-right');
      var bottom = fig.querySelector('.f-bottom'), left = fig.querySelector('.f-left');
      gsap.set(clip, { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(inner, { scale: 1.15 });
      gsap.set([top, bottom], { scaleX: 0 });
      gsap.set([right, left], { scaleY: 0 });

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
        tl.to(line, { scaleX: 1, duration: 0.8 * k, ease: EASE }, 0.35);
        tl.to(etext, { autoAlpha: 1, x: 0, duration: 0.9 * k, ease: EASE }, 0.35 + 0.5 * k);
        tl.to(subtitle, { autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE }, 0.5);
        tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.75 * k, ease: EASE }, 0.45);
        tl.to(creds, { autoAlpha: 1, y: 0, duration: 0.8 * k, ease: EASE }, 0.55);
        tl.to(note, { autoAlpha: 1, y: 0, duration: 0.8 * k, ease: EASE }, 0.65);
        // foto do hero: clip-path de baixo para cima e zoom; moldura de bronze desenhada depois
        tl.to(clip, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 * k, ease: 'power3.inOut' }, 0.2);
        tl.to(inner, { scale: 1, duration: 1.8 * k, ease: EASE }, 0.2);
        var t0 = 1.0 * k, d = 0.6 * k;
        tl.to(top, { scaleX: 1, duration: d, ease: 'power2.out' }, t0);
        tl.to(right, { scaleY: 1, duration: d, ease: 'power2.out' }, t0 + d * 0.7);
        tl.to(bottom, { scaleX: 1, duration: d, ease: 'power2.out' }, t0 + d * 1.4);
        tl.to(left, { scaleY: 1, duration: d, ease: 'power2.out' }, t0 + d * 2.1);
      }

      // Espera as fontes para a primeira quebra de linhas sair correta (teto de 0,9 s para não atrasar o CTA)
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
      window.setTimeout(start, 900);
    }

    /* Header: esconde ao rolar para baixo e reaparece ao rolar para cima (fundo já é sólido) */
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

    /* Botões: efeito roll (o texto sobe e uma cópia idêntica entra por baixo). Duplicata com aria-hidden. */
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
        if (effect) effect(el); else show(el);
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
