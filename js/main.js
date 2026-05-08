/* ============================================================
   ECOMAR — Main JavaScript
   Features:
     - Navbar scroll + mobile menu
     - Scroll-reveal animations (Intersection Observer)
     - Project filter
     - Animated counters
     - Gallery lightbox
     - Contact form handler
     - Scroll-to-top button
     - Auto-update copyright year
   ============================================================ */

'use strict';


/* ============================================================
   UTILITY
   ============================================================ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ============================================================
   1. NAVBAR — scroll effect + mobile menu
   ============================================================ */
(function initNavbar() {
  const navbar    = qs('#navbar');
  const hamburger = qs('#hamburger');
  const navLinks  = qs('#navLinks');

  // Scroll effect: add .scrolled class after 60px
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    toggleScrollTopBtn();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  qsa('.nav-link, .btn-nav', navLinks).forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


/* ============================================================
   2. SCROLL-REVEAL ANIMATIONS
   Adds .visible to elements with .fade-up / .fade-left / .fade-right
   ============================================================ */
(function initScrollReveal() {
  const targets = qsa('.fade-up, .fade-left, .fade-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ============================================================
   3. ANIMATED COUNTERS
   Triggers when the hero stats section enters the viewport.
   Uses data-target attribute on .stat-num elements.
   ============================================================ */
(function initCounters() {
  const statNums  = qsa('.stat-num[data-target]');
  if (!statNums.length) return;

  let counted = false;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800; // ms
    const step     = 16;   // ~60fps
    const increments = Math.ceil(target / (duration / step));
    let current = 0;

    const timer = setInterval(() => {
      current += increments;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNums.forEach(animateCounter);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = qs('.hero-stats');
  if (heroStats) observer.observe(heroStats);
})();


/* ============================================================
   4. PROJECT FILTER
   Filters .proj-card elements by data-category attribute.
   ============================================================ */
(function initProjectFilter() {
  const filterBtns = qsa('.filter-btn');
  const cards      = qsa('.proj-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show / hide cards
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();


/* ============================================================
   5. GALLERY LIGHTBOX
   Opens a simple overlay when a gallery item is clicked.
   If the item contains a real <img>, it shows the image.
   Placeholder items show a "Coming soon" message.
   ============================================================ */
(function initLightbox() {
  const lightbox        = qs('#lightbox');
  const lightboxContent = qs('#lightboxContent');
  const lightboxClose   = qs('#lightboxClose');
  const galItems        = qsa('.gal-item');
  if (!lightbox) return;

  function openLightbox(item) {
    const img = item.querySelector('img');
    if (img) {
      lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
    } else {
      // Placeholder — no real image yet
      lightboxContent.innerHTML = `
        <div style="text-align:center;color:#fff;padding:40px 20px;">
          <i class="fas fa-camera" style="font-size:3rem;opacity:.4;margin-bottom:16px;display:block;"></i>
          <p style="font-size:1.1rem;opacity:.7;">Imagen próximamente</p>
          <p style="font-size:.85rem;opacity:.45;margin-top:8px;">Reemplazar con imagen real del proyecto.</p>
        </div>`;
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxContent.innerHTML = ''; }, 300);
  }

  galItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();


/* ============================================================
   6. CONTACT FORM
   Handles client-side submission.
   To connect a real backend, replace the setTimeout block with
   a fetch() call to your API endpoint or Netlify Forms.
   ============================================================ */
(function initContactForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    /*
      BACKEND CONNECTION
      ==================
      Option A — Netlify Forms (easiest):
        Add `data-netlify="true"` to the <form> tag in HTML.
        Netlify handles submissions automatically.

      Option B — EmailJS / Formspree / other service:
        Replace this setTimeout with your fetch/service call.

      Option C — Custom API:
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
    */

    // Simulate async submission (replace with real call)
    await new Promise(resolve => setTimeout(resolve, 1400));

    // Show success message
    form.reset();
    success.classList.add('show');
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';

    // Hide success after 6 seconds
    setTimeout(() => success.classList.remove('show'), 6000);
  });
})();


/* ============================================================
   7. SCROLL-TO-TOP BUTTON
   ============================================================ */
function toggleScrollTopBtn() {
  const btn = qs('#scrollTopBtn');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 500);
}

(function initScrollTop() {
  const btn = qs('#scrollTopBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   8. AUTO-UPDATE COPYRIGHT YEAR
   ============================================================ */
(function updateYear() {
  const yearEl = qs('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ============================================================
   9. SMOOTH SCROLL FOR ANCHOR LINKS
   Accounts for fixed navbar height offset.
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const target = qs(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    const navH   = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-h'), 10) || 82;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();
