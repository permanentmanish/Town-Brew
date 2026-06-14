const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const navActions = document.querySelector('.nav-actions');
const navLinks = [...document.querySelectorAll('.site-nav a')];

const phoneNumber = '911234567890';
const waMessage = encodeURIComponent(
  'Hi Town Brew Cafe, I want to know about the menu and visiting today.'
);
const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;

document.querySelectorAll('[data-wa-link]').forEach((el) => {
  el.href = waUrl;
});

document.querySelectorAll('[data-phone-link]').forEach((el) => {
  el.href = `tel:+${phoneNumber}`;
});

const setMenuState = (open) => {
  if (!menuToggle || !siteNav) return;

  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.classList.toggle('open', open);

  siteNav.classList.toggle('open', open);
  navActions?.classList.toggle('open', open);
};

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenuState(!isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('click', (e) => {
  if (header && !header.contains(e.target) && siteNav?.classList.contains('open')) {
    setMenuState(false);
  }
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
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

  sections.forEach((section) => observer.observe(section));
}

window.addEventListener(
  'scroll',
  () => {
    header?.classList.toggle('scrolled', window.scrollY > 10);
  },
  { passive: true }
);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const offset = 82;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenuState(false);
});
