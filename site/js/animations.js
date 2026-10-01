/*
 * Camada de animações (GSAP + ScrollTrigger + SplitText + DrawSVGPlugin).
 * Sistema orientado por atributos: cada seção nova só precisa dos data-attributes (ver CLAUDE.md, "Padrões de animação").
 *
 * - Sem GSAP (arquivo não carregou), com prefers-reduced-motion ou se a animação do hero não começar em 1,5 s: a classe js-anim nunca existe e todo o conteúdo fica visível.
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
        // aria: 'none' porque o modo 'auto' põe aria-label no <p>, atributo proibido em parágrafo (o texto continua sendo lido normalmente)
        SplitText.create(el, {
          type: 'lines', linesClass: 'sl', autoSplit: true, aria: 'none',
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
        // Só cria o tween quando o card tem o elemento (os cards de avaliação não têm número, título nem mídia)
        function setIf(sel, card, vars) { var els = $$(sel, card); if (els.length) gsap.set(els, vars); }
        function toIf(tl, sel, card, vars, pos) { var els = $$(sel, card); if (els.length) tl.to(els, vars, pos); }
        cards.forEach(function (card) {
          gsap.set(card, { autoAlpha: 0, y: 40 });
          setIf('.card__num', card, { autoAlpha: 0, y: 12 });
          setIf('.card__line', card, { scaleX: 0 });
          setIf('.review__linha', card, { scaleX: 0 });
          setIf('.card__title', card, { autoAlpha: 0, y: 14 });
          setIf('.card__media', card, { autoAlpha: 0 });
        });
        gsap.set(list, { autoAlpha: 1 });
        ScrollTrigger.batch(cards, {
          start: 'top 90%', once: true,
          onEnter: function (batch) {
            var tl = gsap.timeline();
            batch.forEach(function (card, i) {
              var at = i * 0.12;
              tl.to(card, { autoAlpha: 1, y: 0, duration: 1 * k, ease: EASE }, at);
              toIf(tl, '.card__media', card, { autoAlpha: 1, duration: 0.9 * k, ease: EASE }, at + 0.1);
              toIf(tl, '.card__num', card, { autoAlpha: 1, y: 0, duration: 0.8 * k, ease: EASE }, at + 0.15);
              toIf(tl, '.card__line', card, { scaleX: 1, duration: 0.9 * k, ease: EASE }, at + 0.3);
              toIf(tl, '.review__linha', card, { scaleX: 1, duration: 0.9 * k, ease: EASE }, at + 0.3);
              toIf(tl, '.card__title', card, { autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE }, at + 0.4);
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

      /* 9 e 16. Valores. Mobile (células): entram em stagger curto com o losango desenhado dentro de cada uma.
         Desktop: o losango é desenhado (DrawSVG) e só depois a palavra aparece. */
      valores: function (ul) {
        var items = $$(':scope > li', ul);
        var cells = window.matchMedia('(max-width: 47.9375rem)').matches;
        items.forEach(function (li) {
          gsap.set($$('.valor__icone path', li), { drawSVG: '0%' });
          if (cells) gsap.set(li, { autoAlpha: 0, y: 16 });
          else gsap.set($$('span', li), { autoAlpha: 0, y: 10 });
        });
        gsap.set(ul, { autoAlpha: 1 });
        var tl = gsap.timeline({ scrollTrigger: { trigger: ul, start: cells ? 'top 90%' : 'top 88%', once: true } });
        items.forEach(function (li, i) {
          if (cells) {
            var c = i * 0.1;
            tl.to(li, { autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE }, c);
            tl.to($$('.valor__icone path', li), { drawSVG: '100%', duration: 1 * k, ease: 'power3.inOut' }, c + 0.2);
          } else {
            var at = i * 0.18, draw = 1.1 * k;
            tl.to($$('.valor__icone path', li), { drawSVG: '100%', duration: draw, ease: 'power3.inOut' }, at);
            tl.to($$('span', li), { autoAlpha: 1, y: 0, duration: 0.9 * k, ease: EASE }, at + draw);
          }
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
        if (isHero) {
          // A entrada da foto do hero está em hero() (junto com a headline). Aqui só o parallax de rolagem; a foto nunca fica escondida (LCP).
          if (desktop && !fig.hasAttribute('data-parallax-off')) {
            gsap.fromTo(inner, { yPercent: -3.5 }, {
              yPercent: 3.5, ease: 'none',
              scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
            });
          }
          return;
        }
        gsap.set(clip, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(inner, { scale: 1.15 });

        var tl = gsap.timeline({
          delay: isHero ? 0.2 : 0,
          scrollTrigger: { trigger: fig, start: 'top 90%', once: true }
        });
        tl.to(clip, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 * k, ease: 'power3.inOut' }, 0);
        tl.to(inner, { scale: 1, duration: 1.8 * k, ease: EASE }, 0);
        tl.call(function () { fig._pronta = true; if (fig._onPronto) fig._onPronto(); }, null, 1.8 * k);   // hover só depois da entrada; avisa se o mouse já estiver em cima

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

        // Parallax sutil na imagem interna (yPercent de -3.5 a 3.5, dentro da folga de 4% da imagem), só no desktop. Funciona igual com placeholder e foto real.
        if (desktop && !fig.hasAttribute('data-parallax-off')) {
          gsap.fromTo(inner, { yPercent: -3.5 }, {
            yPercent: 3.5, ease: 'none',
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

      // Foto do hero: NUNCA começa escondida (afeta o LCP). Estado inicial: 65% visível e um pouco ampliada.
      var photo = g('photo');
      var pClip = photo && photo.querySelector('.photo__clip'), pInner = photo && photo.querySelector('.photo__inner');
      var pFrame = photo && photo.querySelector('.photo__frame');
      if (photo) {
        gsap.set(pClip, { clipPath: 'inset(35% 0% 0% 0%)' });
        gsap.set(pInner, { scale: desktop ? 1.12 : 1.06 });
        if (pFrame) gsap.set(pFrame, { x: 16, y: 16, opacity: 0 });
      }

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

        if (photo) {
          // A foto começa junto com a headline (mesmo instante das linhas do título). Moldura desliza quando a foto está em 60%.
          var pd = desktop ? 1.2 : 1, p0 = 0.1, fd = 0.9;
          tl.to(pClip, { clipPath: 'inset(0% 0% 0% 0%)', duration: pd, ease: 'expo.out' }, p0);
          tl.to(pInner, { scale: 1, duration: pd, ease: 'expo.out' }, p0);
          if (pFrame) tl.to(pFrame, { x: 0, y: 0, opacity: 1, duration: fd, ease: 'expo.out' }, p0 + 0.6 * pd);
          tl.call(function () { photo._pronta = true; if (photo._onPronto) photo._onPronto(); }, null, p0 + 0.6 * pd + fd);   // hover só depois da entrada; avisa se o mouse já estiver em cima
        }
      }

      // Espera as fontes para a primeira quebra de linhas sair correta (com teto de 0,9 s para não atrasar o CTA)
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
      window.setTimeout(start, 900);
    }

    /* 19. Hover das fotos (hero e sobre), só com mouse e só depois da entrada: zoom leve, moldura se aproxima e parallax da imagem pelo cursor
       "over" (mouse em cima) e "ativo" (tweens ligados) são independentes: se o mouse entra antes da entrada terminar
       (fig._pronta ainda false), o hover fica registrado como "over" e liga sozinho assim que a entrada chama fig._onPronto,
       sem precisar que o mouse saia e volte a entrar. */
    function photoHover(fig) {
      var inner = fig.querySelector('.photo__inner'), frame = fig.querySelector('.photo__frame');
      var qx, qy, over = false, ativo = false;
      function ativar() {
        if (ativo) return;
        ativo = true;
        gsap.killTweensOf(inner, 'x,y,scale');
        qx = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' });
        qy = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' });
        gsap.to(inner, { scale: 1.04, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
        if (frame) gsap.to(frame, { x: -8, y: -8, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
      }
      function desativar() {
        if (!ativo) return;
        ativo = false; qx = qy = null;
        gsap.killTweensOf(inner, 'x,y');
        gsap.to(inner, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
        if (frame) gsap.to(frame, { x: 0, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
      }
      function entra() {
        over = true;
        if (fig._pronta) ativar();
      }
      function move(e) {
        if (!over || !ativo) return;
        var r = fig.getBoundingClientRect();
        var nx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2)));
        var ny = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 2)));
        qx(-nx * 10); qy(-ny * 10);   // até 10px, na direção oposta ao mouse
      }
      function sai() {
        over = false;
        desativar();
      }
      fig.addEventListener('mouseenter', entra);
      fig.addEventListener('mousemove', move);
      fig.addEventListener('mouseleave', sai);
      // Avisada pela entrada (fig._pronta = true): liga na hora se o mouse já estiver parado em cima
      fig._onPronto = function () { if (over) ativar(); };
      // Mouse já pode estar parado sobre a foto quando o script inicializa (ex.: cursor não se moveu desde o carregamento)
      try { if (fig.matches(':hover')) { over = true; if (fig._pronta) ativar(); } } catch (e) {}
      return function () {
        fig.removeEventListener('mouseenter', entra);
        fig.removeEventListener('mousemove', move);
        fig.removeEventListener('mouseleave', sai);
        fig._onPronto = null;
      };
    }

    /* 18. Header: esconde ao rolar para baixo e reaparece ao rolar para cima (fundo já é sólido) */
    function header() {
      var bar = document.querySelector('.site-header');
      var toggle = document.querySelector('.menu-toggle');
      if (!bar) return;
      var hidden = false;
      var locked = false;   // durante a rolagem de um link do menu o header fica visível, para a seção encostar na base dele
      function unlock() { locked = false; }
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a || a.getAttribute('href') === '#topo' || a.classList.contains('site-header__logo')) return;
        locked = true; set(false);
        window.setTimeout(unlock, 1600);
      });
      ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, unlock, { passive: true }); });
      function set(hide) {
        if (hide === hidden) return;
        hidden = hide;
        gsap.to(bar, { yPercent: hide ? -100 : 0, duration: 0.6 * k + 0.2, ease: 'power3.out', overwrite: 'auto' });
      }
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: function (self) {
          var menuOpen = toggle && toggle.getAttribute('aria-expanded') === 'true';
          if (menuOpen || locked || self.scroll() < bar.offsetHeight * 1.5) { set(false); return; }
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

    /* 12. Procedimentos: só um aberto por vez (reforça o name="procedimentos" do HTML, para navegadores sem o agrupamento nativo);
       ao abrir, a frase de indicação entra com fade + y (o <details> nativo já cuida de mostrar/esconder, sem animar altura). */
    function procedimentos(restore) {
      var items = $$('.proc-item');
      items.forEach(function (details) {
        var desc = details.querySelector('.proc-item__desc');
        function onToggle() {
          if (!details.open) return;
          items.forEach(function (other) { if (other !== details) other.open = false; });
          if (desc) gsap.fromTo(desc, { autoAlpha: 0, y: dy }, { autoAlpha: 1, y: 0, duration: 0.6 * k, ease: EASE });
        }
        details.addEventListener('toggle', onToggle);
        restore.push(function () { details.removeEventListener('toggle', onToggle); });
      });
    }

    /* 13. Hover do nome de cada procedimento: o texto desliza para a direita e o nome + seta tingem de bordô (currentColor) */
    function procedimentosHover() {
      var burgundy = getComputedStyle(html).getPropertyValue('--color-brand-burgundy').trim();
      var graphite = getComputedStyle(html).getPropertyValue('--color-text').trim();
      var limpar = $$('.proc-item summary').map(function (summary) {
        var label = summary.querySelector('.proc-item__label');
        if (!label) return function () {};
        var qx = gsap.quickTo(label, 'x', { duration: 0.4, ease: 'power3.out' });
        function entra() { qx(6); gsap.to(summary, { color: burgundy, duration: 0.3, overwrite: 'auto' }); }
        function sai() { qx(0); gsap.to(summary, { color: graphite, duration: 0.3, overwrite: 'auto' }); }
        summary.addEventListener('mouseenter', entra);
        summary.addEventListener('mouseleave', sai);
        return function () {
          summary.removeEventListener('mouseenter', entra);
          summary.removeEventListener('mouseleave', sai);
          gsap.killTweensOf([label, summary]);
        };
      });
      return function () { limpar.forEach(function (fn) { fn(); }); };
    }

    function run() {
      html.classList.add('js-anim');
      rollButtons(undo);
      header();
      hero();
      procedimentos(undo);

      // Hover das fotos e dos procedimentos: só em dispositivo com mouse (hover e ponteiro fino). Sem movimento reduzido, porque init() nem roda nesse caso.
      var hoverMM = gsap.matchMedia();
      hoverMM.add('(hover: hover) and (pointer: fine)', function () {
        var limparFotos = $$('[data-anim="photo"]').map(photoHover);
        var limparProc = procedimentosHover();
        return function () { limparFotos.forEach(function (fn) { fn(); }); limparProc(); };
      });
      undo.push(function () { hoverMM.revert(); });

      // Seções: sempre na ordem do documento (ScrollTrigger calcula as posições de cima para baixo)
      $$('[data-anim]').forEach(function (el) {
        var effect = EFFECTS[el.getAttribute('data-anim')];
        if (effect) effect(el); else gsap.set(el, { autoAlpha: 1 });
      });

      // Recalcula posições quando as fontes chegam (as linhas do SplitText mudam de altura)
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }

    run();

    /* Rede de segurança: o conteúdo nunca depende das animações. Se em 1,5 s a animação do hero não começou
       (JS travado, aba em segundo plano, ticker parado), a classe js-anim sai e tudo fica visível. */
    window.setTimeout(function () {
      var title = document.querySelector('[data-hero="title"]');
      if (title && window.getComputedStyle(title).visibility !== 'hidden') return;   // a animação do hero começou
      html.classList.remove('js-anim');
      mm.revert();
    }, 1500);

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
