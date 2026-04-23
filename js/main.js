// main.js — Shared JS: nav scroll, IntersectionObserver reveals, stagger, counter

// Set active nav link based on current page
const setActiveNavLink = () => {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile-overlay a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
};

// Scroll-based nav blur
const initNavScroll = () => {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
};

// Mobile overlay toggle
const initMobileNav = () => {
  const btn = document.querySelector('.nav__hamburger');
  const overlay = document.querySelector('.nav__mobile-overlay');
  if (!btn || !overlay) return;

  const open = () => {
    requestAnimationFrame(() => overlay.classList.add('open'));
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    btn.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  // Close on link click
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close();
  });
};

// IntersectionObserver for .reveal elements
const initReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
};

// Apply incremental transition-delay to stagger parent children
const initStagger = () => {
  document.querySelectorAll('.stagger').forEach(parent => {
    const step = parseInt(parent.dataset.staggerStep || '80', 10);
    [...parent.children].forEach((child, i) => {
      child.style.setProperty('--stagger-delay', `${i * step}ms`);
    });
  });
};

// Animated number counter on scroll entry
const initCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  initNavScroll();
  initMobileNav();
  initReveal();
  initStagger();
  initCounters();
});
