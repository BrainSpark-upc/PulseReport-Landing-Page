(function () {
  'use strict';
  function initMobileNav() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute(
        'aria-label',
        isOpen ? 'Close navigation menu' : 'Open navigation menu'
      );
      toggle.classList.toggle('is-open', isOpen);
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
      }
    });
  }

  /*Hero animations*/

  function initHeroAnimations() {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.classList.add('hero--ready');

    if (prefersReduced) {
      hero.querySelectorAll('[data-hero-anim]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const items = hero.querySelectorAll('[data-hero-anim]');
    items.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.12 + 0.2}s`;
      el.classList.add('hero-anim-in');
    });

    const visual = hero.querySelector('.hero-visual');
    if (visual) {
      visual.classList.add('hero-visual--float');
    }
  }

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      /* Fallback: make everything visible */
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);

          if (prefersReduced || delay === 0) {
            el.classList.add('is-visible');
          } else {
            setTimeout(() => el.classList.add('is-visible'), delay);
          }

          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });
  }

  /* Hero Stats*/
  function animateCounter(el) {
    const target = parseFloat(el.dataset.counterTarget || el.textContent);
    const suffix = el.dataset.counterSuffix || '';
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease-out cubic */
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-counter-target]').forEach((el) => {
      observer.observe(el);
    });
  }

  function initActiveNav() {
    const sections = Array.from(
      document.querySelectorAll('main section[id]')
    );
    const navLinks = Array.from(
      document.querySelectorAll('.nav-menu a[href^="#"]')
    );
    if (!sections.length || !navLinks.length) return;

    const OFFSET = 120;

    function updateActive() {
      const scrollY = window.scrollY + OFFSET;
      let current = sections[0].id;

      sections.forEach((sec) => {
        if (sec.offsetTop <= scrollY) current = sec.id;
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href').slice(1);
        link.classList.toggle('is-active', href === current);
        link.setAttribute('aria-current', href === current ? 'true' : 'false');
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* Navbar scroll */
  function initNavbarShadow() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    function update() {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Contact Form */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const notice = document.getElementById('contactSubmitNotice');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach((field) => {
        field.classList.remove('field--error');
        if (!field.value.trim()) {
          field.classList.add('field--error');
          valid = false;
        }
      });

      if (!valid) {
        const firstError = form.querySelector('.field--error');
        firstError?.focus();
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = '…';

      /* Simulate async send */
      setTimeout(() => {
        btn.disabled = false;
        const lang = window.i18n?.getCurrent() || 'es';
        btn.textContent = lang === 'en' ? 'Send message' : 'Enviar al equipo';

        if (notice) {
          const msg =
            lang === 'en'
              ? '✓ Message sent! We will get back to you shortly.'
              : '✓ ¡Mensaje enviado! Te responderemos pronto.';
          notice.textContent = msg;
          notice.removeAttribute('hidden');
          setTimeout(() => notice.setAttribute('hidden', ''), 6000);
        }

        form.reset();
      }, 1200);
    });

    /* Real-time error clear */
    form.querySelectorAll('[required]').forEach((field) => {
      field.addEventListener('input', () =>
        field.classList.remove('field--error')
      );
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        /* Set focus for accessibility */
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener(
          'blur',
          () => target.removeAttribute('tabindex'),
          { once: true }
        );
      });
    });
  }

  //Boot function
  function boot() {
    initMobileNav();
    initHeroAnimations();
    initScrollReveal();
    initCounters();
    initActiveNav();
    initNavbarShadow();
    initContactForm();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();