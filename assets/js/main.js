/* TSUCHI no HI — interactions */
(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Hamburger / Drawer ---------- */
  const hamburger = $('#hamburger');
  const drawer = $('#drawer');
  const body = document.body;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  };

  hamburger?.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });

  $$('#drawer a').forEach(a => a.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  /* ---------- Header shrink on scroll ---------- */
  const header = $('#siteHeader');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.style.padding = y > 60 ? '0' : '';
      header.style.boxShadow = y > 60 ? '0 6px 20px -10px rgba(0,0,0,.18)' : '';
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Smooth-scroll offset for sticky header ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = [
    '.hero__copy',
    '.section .sec-num',
    '.section .sec-en',
    '.section .sec-title',
    '.concept__body p',
    '.concept__photo',
    '.timeline > li',
    '.hscroll',
    '.plan-card',
    '.voice',
    '.access__map',
    '.access__info',
    '.faq details',
    '.booking',
  ].flatMap(sel => $$(sel));

  reveals.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Hide fixed CTA when booking form is in view ---------- */
  const fixedCta = $('.fixed-cta');
  const booking = $('#booking');
  if (fixedCta && booking && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(([entry]) => {
      fixedCta.style.opacity = entry.isIntersecting ? '0' : '1';
      fixedCta.style.pointerEvents = entry.isIntersecting ? 'none' : '';
      fixedCta.style.transform = entry.isIntersecting ? 'translateY(20px)' : '';
    }, { threshold: 0.15 });
    io2.observe(booking);
    fixedCta.style.transition = 'opacity .35s ease, transform .35s ease';
  }
})();
