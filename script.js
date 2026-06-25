// =========================
// DOM ELEMENTS
// =========================

const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const navActions = document.querySelector('.nav-actions');
const navLinks = [...document.querySelectorAll('.site-nav a')];

// =========================
// CONTACT SETTINGS
// =========================

const phoneNumber = '911234567890';

const waMessage = encodeURIComponent(
  'Hi Town Brew Cafe, I want to know about the menu and visiting today.'
);

const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;

// WhatsApp links
document.querySelectorAll('[data-wa-link]').forEach((el) => {
  el.href = waUrl;
});

// Phone links
document.querySelectorAll('[data-phone-link]').forEach((el) => {
  el.href = `tel:+${phoneNumber}`;
});

// =========================
// MOBILE MENU
// =========================

const setMenuState = (open) => {
  if (!menuToggle || !siteNav) return;

  menuToggle.setAttribute('aria-expanded', String(open));

  menuToggle.classList.toggle('open', open);
  siteNav.classList.toggle('open', open);
  navActions?.classList.toggle('open', open);

  // Accessibility focus management
  if (open) {
    navLinks[0]?.focus();
  } else {
    menuToggle.focus();
  }
};

// Toggle menu
menuToggle?.addEventListener('click', () => {
  const isOpen =
    menuToggle.getAttribute('aria-expanded') === 'true';

  setMenuState(!isOpen);
});

// Close menu after clicking nav link
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setMenuState(false);
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (
    header &&
    !header.contains(e.target) &&
    siteNav?.classList.contains('open')
  ) {
    setMenuState(false);
  }
});

// Close menu with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    setMenuState(false);
  }
});

// =========================
// ACTIVE NAVIGATION
// =========================

const sections = navLinks
  .map((link) =>
    document.querySelector(link.getAttribute('href'))
  )
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      });
    },
    {
      threshold: 0.25,
      rootMargin: '0px 0px -50% 0px',
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// =========================
// HEADER SCROLL EFFECT
// =========================

window.addEventListener(
  'scroll',
  () => {
    header?.classList.toggle(
      'scrolled',
      window.scrollY > 10
    );
  },
  { passive: true }
);

// =========================
// SMOOTH SCROLL
// =========================

const prefersReducedMotion =
  window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');

    if (!href || href === '#') return;

    const target = document.querySelector(href);

    if (!target) return;

    e.preventDefault();

    // Header height offset
    const offset = 82;

    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      offset;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion
        ? 'auto'
        : 'smooth',
    });
  });
});
