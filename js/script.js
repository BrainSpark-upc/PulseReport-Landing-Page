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


  /* Problem section */
  function initProblemCards() {
    document.querySelectorAll('.problem-card').forEach((card) => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('is-focused');
          setTimeout(() => card.classList.remove('is-focused'), 600);
        }
      });
    });
  }

  /* How it works section */
  function initStepCards() {
    document.querySelectorAll('.step').forEach((card) => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.add('is-pulsing');
          setTimeout(() => card.classList.remove('is-pulsing'), 600);
        }
      });
    });
  }

  /* Features / Characteristics section */
  function initFeatureCards() {
    document.querySelectorAll('.feature-card').forEach((card) => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.add('is-pulsing');
          setTimeout(() => card.classList.remove('is-pulsing'), 600);
        }
      });
    });
  }
  /* Team section — keyboard interaction */
  function initTeamCards() {
    document.querySelectorAll('.team-card').forEach((card) => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Brief visual pulse via temporary class
          card.classList.add('is-focused');
          setTimeout(() => card.classList.remove('is-focused'), 500);
        }
      });
    });
  }
  /* Contact-Us Section*/
  function initContactForm() {
    var form          = document.getElementById('contactForm');
    var successNotice = document.getElementById('contactSubmitNotice');
    var errorNotice   = document.getElementById('contactErrorNotice');
    var submitBtn     = form ? form.querySelector('[type="submit"]') : null;
    if (!form || !submitBtn) return;

    /* ── Validation helpers ── */
    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function validateField(field) {
      var wrap  = field.closest('.contact-form__field');
      var name  = field.name;
      var value = field.value.trim();
      var ok    = true;

      if (field.required && !value) {
        ok = false;
      } else if (name === 'email' && value && !isValidEmail(value)) {
        ok = false;
      }

      if (wrap) wrap.classList.toggle('has-error', !ok);
      return ok;
    }

    function validateAll() {
      var fields = Array.from(form.querySelectorAll('input[required], input[name="email"]'));
      var allOk  = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allOk = false;
      });
      return allOk;
    }

    /* ── Real-time error clearing ── */
    form.querySelectorAll('.contact-form__input').forEach(function (input) {
      input.addEventListener('input', function () {
        var wrap = input.closest('.contact-form__field');
        if (wrap && wrap.classList.contains('has-error')) {
          validateField(input);
        }
      });

      input.addEventListener('blur', function () {
        if (input.value.trim() || input.required) validateField(input);
      });
    });

    /* ── Submit ── */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Hide previous notices */
      successNotice && successNotice.setAttribute('hidden', '');
      errorNotice   && errorNotice.setAttribute('hidden', '');

      if (!validateAll()) {
        errorNotice && errorNotice.removeAttribute('hidden');
        var firstError = form.querySelector('.has-error .contact-form__input');
        if (firstError) firstError.focus();
        return;
      }

      /* Loading state */
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      var spinner = document.createElement('span');
      spinner.className = 'submit-spinner';
      spinner.setAttribute('aria-hidden', 'true');
      submitBtn.appendChild(spinner);

      /* Simulated async send (replace with real fetch() when backend is ready) */
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        if (spinner.parentNode) spinner.parentNode.removeChild(spinner);

        successNotice && successNotice.removeAttribute('hidden');
        form.reset();

        /* Auto-hide success notice after 7s */
        setTimeout(function () {
          successNotice && successNotice.setAttribute('hidden', '');
        }, 7000);
      }, 1400);
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
    initProblemCards();
    initStepCards();
    initFeatureCards();
    initTeamCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();