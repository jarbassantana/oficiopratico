/**
 * main.js — Ofício Prático / Higienização de Estofados
 * Módulos: reveal, faq, anti-clone, geoloc, prova social,
 *          contadores, barra de progresso, sticky-cta, parallax
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     1. DESBLOQUEIO — página oculta por padrão via CSS (.js-hidden)
     ────────────────────────────────────────────────────────────── */
  document.documentElement.classList.add('js-on');

  /* ──────────────────────────────────────────────────────────────
     2. ANTI-CLONE — múltiplas camadas de proteção
     ────────────────────────────────────────────────────────────── */
  const AntiClone = {
    init() {
      this.blockRightClick();
      this.blockKeyboardShortcuts();
      this.blockDragSelect();
      this.enforceCanonical();
    },

    blockRightClick() {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    },

    blockKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        const blocked =
          (e.ctrlKey && ['u', 's', 'a', 'c', 'p'].includes(e.key.toLowerCase())) ||
          (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
          e.key === 'F12';
        if (blocked) e.preventDefault();
      });
    },

    blockDragSelect() {
      document.addEventListener('dragstart', (e) => e.preventDefault());
      document.addEventListener('selectstart', (e) => {
        // Permite seleção apenas em inputs e textareas
        if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
          e.preventDefault();
        }
      });
    },

    detectDevTools() {
      // Só ativa em desktop — mobile tem chrome/UI que dispara falso-positivo
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        || window.matchMedia('(pointer: coarse)').matches;
      if (isMobile) return;

      let devtoolsOpen = false;
      const threshold = 200; // margem generosa para evitar falsos positivos

      const check = () => {
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        if ((widthDiff || heightDiff) && !devtoolsOpen) {
          devtoolsOpen = true;
        } else if (!widthDiff && !heightDiff && devtoolsOpen) {
          devtoolsOpen = false;
        }
      };

      setInterval(check, 1500);
    },

    enforceCanonical() {
      const canonical = 'oficiopratico.online';
      if (
        document.location.hostname &&
        document.location.hostname !== 'localhost' &&
        document.location.hostname !== '127.0.0.1' &&
        !document.location.hostname.includes(canonical)
      ) {
        // Redireciona clones para o site original
        document.body.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;flex-direction:column;gap:1rem"><p style="font-size:1.2rem">Redirecionando...</p></div>';
        setTimeout(() => {
          window.location.href = 'https://oficiopratico.online/higienizacao-de-estofados/';
        }, 800);
      }
    },
  };

  AntiClone.init();

  /* ──────────────────────────────────────────────────────────────
     3. BARRA DE PROGRESSO DE SCROLL
     ────────────────────────────────────────────────────────────── */
  const ProgressBar = {
    el: null,

    init() {
      this.el = document.createElement('div');
      this.el.id = 'scroll-progress';
      document.body.prepend(this.el);
      window.addEventListener('scroll', () => this.update(), { passive: true });
    },

    update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.el.style.width = pct + '%';
    },
  };

  ProgressBar.init();

  /* ──────────────────────────────────────────────────────────────
     4. GEOLOCALIZAÇÃO POR IP — exibe cidade no announcement bar
     ────────────────────────────────────────────────────────────── */
  const GeoLocation = {
    init() {
      const bar = document.querySelector('.announcement');
      if (!bar) return;

      fetch('https://ip-api.com/json/?fields=city,regionName&lang=pt-BR')
        .then((r) => r.json())
        .then((data) => {
          if (data.city) {
            const geoSpan = document.createElement('span');
            geoSpan.className = 'announcement-geo';
            geoSpan.innerHTML = ` • 📍 <strong>${data.city}</strong>`;
            bar.appendChild(geoSpan);
          }
        })
        .catch(() => { }); // Falha silenciosa
    },
  };

  GeoLocation.init();

  /* ──────────────────────────────────────────────────────────────
     5. PROVA SOCIAL — notificações de compra + contador online
     ────────────────────────────────────────────────────────────── */
  const SocialProof = {
    // Cada entrada: [nome, cidade, estado, foto-id-pravatar]
    buyers: [
      ['Anderson S.', 'Manaus', 'AM', 11],
      ['Maria F.', 'São Paulo', 'SP', 47],
      ['João C.', 'Fortaleza', 'CE', 15],
      ['Carla M.', 'Belo Horizonte', 'MG', 26],
      ['Roberto A.', 'Salvador', 'BA', 8],
      ['Juliana T.', 'Curitiba', 'PR', 33],
      ['Marcos V.', 'Recife', 'PE', 18],
      ['Patrícia G.', 'Porto Alegre', 'RS', 56],
      ['Ricardo N.', 'Goiânia', 'GO', 12],
      ['Beatriz F.', 'Belém', 'PA', 44],
      ['Thiago I.', 'Campinas', 'SP', 22],
      ['Larissa J.', 'São Luís', 'MA', 38],
      ['Felipe K.', 'Natal', 'RN', 5],
      ['Vanessa R.', 'Maceió', 'AL', 62],
      ['Bruno Q.', 'Campo Grande', 'MS', 29],
    ],
    times: ['agora mesmo', 'há 1 min', 'há 2 min', 'há 5 min', 'há 8 min', 'há 12 min', 'há 18 min', 'há 35 min'],
    productName: 'Higienização de Sofás do Zero',
    onlineCount: 0,
    toast: null,
    counter: null,

    init() {
      this.createToast();
      this.createOnlineCounter();
      this.onlineCount = this.randomInt(18, 47);
      this.updateCounter();
      this.scheduleNotification();
      this.oscillateCounter();
    },

    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    createToast() {
      this.toast = document.createElement('div');
      this.toast.id = 'sp-toast';
      this.toast.setAttribute('role', 'status');
      this.toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.toast);
    },

    createOnlineCounter() {
      this.counter = document.createElement('div');
      this.counter.id = 'sp-online';
      this.counter.innerHTML =
        '<span class="sp-dot"></span><span id="sp-count">--</span> pessoas vendo agora';
      document.body.appendChild(this.counter);
    },

    updateCounter() {
      const el = document.getElementById('sp-count');
      if (el) el.textContent = this.onlineCount;
    },

    oscillateCounter() {
      setInterval(() => {
        const delta = this.randomInt(-2, 3);
        this.onlineCount = Math.max(12, Math.min(60, this.onlineCount + delta));
        this.updateCounter();
      }, 8000);
    },

    showNotification() {
      const buyer = this.pick(this.buyers); // [nome, cidade, estado, fotoId]
      const [name, city, state, photoId] = buyer;
      const time = this.pick(this.times);

      this.toast.innerHTML = `
        <div class="sp-toast-inner">
          <img
            src="https://i.pravatar.cc/48?img=${photoId}"
            alt="${name}"
            class="sp-photo"
            loading="lazy"
          />
          <div class="sp-info">
            <p class="sp-name"><strong>${name}</strong> comprou ${this.productName}</p>
            <p class="sp-meta">${city}, ${state} • <em>${time}</em></p>
          </div>
          <svg class="sp-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>`;

      this.toast.classList.add('sp-toast--visible');

      setTimeout(() => {
        this.toast.classList.remove('sp-toast--visible');
      }, 4500);
    },

    scheduleNotification() {
      // Primeira após 6s
      setTimeout(() => {
        this.showNotification();
        // Subsequentes a cada 22-40s
        setInterval(
          () => this.showNotification(),
          this.randomInt(22000, 40000)
        );
      }, 6000);
    },
  };

  SocialProof.init();

  /* ──────────────────────────────────────────────────────────────
     6. STICKY CTA — aparece após scrollar além do hero
     ────────────────────────────────────────────────────────────── */
  const StickyCta = {
    el: null,
    heroEl: null,

    init() {
      this.el = document.createElement('div');
      this.el.id = 'sticky-cta';
      this.el.innerHTML = `
        <div class="sticky-cta-inner">
          <div class="sticky-cta-text">
            <strong>Higienização de Sofás do Zero</strong>
            <span>De <s>R$ 97</s> por <strong class="sticky-price">R$ 19,90</strong></span>
          </div>
          <a href="https://pay.kiwify.com.br/AALp7LS" target="_blank" rel="noopener" class="sticky-cta-btn">
            Compre agora
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>`;
      document.body.appendChild(this.el);

      this.heroEl = document.querySelector('.hero');
      window.addEventListener('scroll', () => this.update(), { passive: true });
    },

    update() {
      if (!this.heroEl) return;
      const heroBottom = this.heroEl.getBoundingClientRect().bottom;
      const visible = heroBottom < 0;
      this.el.classList.toggle('sticky-cta--visible', visible);

      // Empurra o toast para cima da sticky CTA
      const ctaHeight = this.el.offsetHeight;
      const offset = visible ? ctaHeight + 12 + 'px' : '20px';
      const toastEl = document.getElementById('sp-toast');
      if (toastEl) toastEl.style.bottom = `calc(${offset} + 60px)`;
    },
  };

  StickyCta.init();

  /* ──────────────────────────────────────────────────────────────
     7. ANIMAÇÕES DE SCROLL — IntersectionObserver
     ────────────────────────────────────────────────────────────── */
  const RevealAnimations = {
    init() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal,.reveal-fade,.reveal-stagger').forEach((el) => {
          el.classList.add('visible');
        });
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
      );

      document.querySelectorAll('.reveal,.reveal-fade,.reveal-stagger').forEach((el) => {
        observer.observe(el);
      });
    },
  };

  RevealAnimations.init();

  /* ──────────────────────────────────────────────────────────────
     8. FAQ ACCORDION
     ────────────────────────────────────────────────────────────── */
  const FaqAccordion = {
    init() {
      document.querySelectorAll('.faq-q').forEach((btn) => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.faq-item');
          const isOpen = item.classList.contains('open');

          // Fecha todos
          document.querySelectorAll('.faq-item.open').forEach((openItem) => {
            FaqAccordion.close(openItem);
          });

          // Abre o clicado (se estava fechado)
          if (!isOpen) FaqAccordion.open(item);
        });
      });
    },

    open(item) {
      const answer = item.querySelector('.faq-a');
      item.classList.add('open');
      item.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    },

    close(item) {
      const answer = item.querySelector('.faq-a');
      item.classList.remove('open');
      item.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = null;
    },
  };

  FaqAccordion.init();

  /* ──────────────────────────────────────────────────────────────
     9. CONTADOR ANIMADO — stats (R$10, R$250, etc.)
     ────────────────────────────────────────────────────────────── */
  const CounterAnimation = {
    init() {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('[data-count]').forEach((el) => {
              this.animateCount(el);
            });
            statsObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );

      document.querySelectorAll('.stats-grid').forEach((el) => statsObserver.observe(el));
    },

    animateCount(el) {
      const target = parseFloat(el.dataset.count);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = eased * target;
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(2)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    },
  };

  CounterAnimation.init();

  /* ──────────────────────────────────────────────────────────────
     10. PARALLAX LEVE — hero background
     ────────────────────────────────────────────────────────────── */
  const Parallax = {
    hero: null,

    init() {
      this.hero = document.querySelector('.hero');
      if (!this.hero) return;
      // Desativa em mobile (performance)
      if (window.matchMedia('(max-width: 768px)').matches) return;

      window.addEventListener('scroll', () => this.update(), { passive: true });
    },

    update() {
      const scrollY = window.scrollY;
      this.hero.style.backgroundPositionY = `calc(center + ${scrollY * 0.25}px)`;
    },
  };

  Parallax.init();

  /* ──────────────────────────────────────────────────────────────
     11. TYPEWRITER — subtítulo da hero
     ────────────────────────────────────────────────────────────── */
  const Typewriter = {
    init() {
      const target = document.querySelector('[data-typewriter]');
      if (!target) return;

      const phrases = target.dataset.typewriter.split('|');
      let phraseIdx = 0;
      let charIdx = 0;
      let deleting = false;

      const type = () => {
        const phrase = phrases[phraseIdx];
        if (!deleting) {
          target.textContent = phrase.slice(0, ++charIdx);
          if (charIdx === phrase.length) {
            deleting = true;
            setTimeout(type, 2200);
            return;
          }
        } else {
          target.textContent = phrase.slice(0, --charIdx);
          if (charIdx === 0) {
            deleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
          }
        }
        setTimeout(type, deleting ? 40 : 75);
      };

      type();
    },
  };

  Typewriter.init();

  /* ──────────────────────────────────────────────────────────────
     12. HOVER 3D LEVE — cards do currículo
     ────────────────────────────────────────────────────────────── */
  const CardTilt = {
    init() {
      if (window.matchMedia('(hover: none)').matches) return; // skip touch

      document.querySelectorAll('.module-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
          card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    },
  };

  CardTilt.init();

})();
