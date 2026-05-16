/* Cinema reel scroll: Lenis smooth scroll + custom dot-track scrollbar.
   The track is a CSS background of evenly-spaced gold dots.
   The thumb is a single gold dot that travels through them based on scroll progress. */
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 980px)').matches;
  const thumb = document.querySelector('.scroll-dots-thumb');
  let lenis = null;

  function updateThumb(scrollY) {
    if (!thumb) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    const track = thumb.parentElement;
    if (!track) return;
    const travel = Math.max(0, track.offsetHeight - thumb.offsetHeight);
    thumb.style.transform = `translate3d(0, ${ratio * travel}px, 0)`;
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => updateThumb(window.scrollY), 100);
  }, { passive: true });

  function initLenis() {
    if (isMobile || prefersReducedMotion || typeof window.Lenis !== 'function') return null;
    const l = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    function raf(time) {
      l.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    l.on('scroll', ({ scroll }) => updateThumb(scroll));
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      a.addEventListener('click', (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        l.scrollTo(target, { offset: -80, duration: 1.2 });
      });
    });
    return l;
  }

  function initFallback() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateThumb(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    updateThumb(window.scrollY);
  }

  function init() {
    lenis = initLenis();
    if (!lenis) initFallback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
