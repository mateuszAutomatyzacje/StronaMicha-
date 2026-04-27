import * as THREE from './assets/vendor/three/three.module.js';
import { gsap } from './assets/vendor/gsap/index.js';

const imageData = [
  { src: 'assets/img18.jpg', title: 'Premium bathroom finish', text: 'A complete bathroom view showing the final standard: light, surfaces, fittings and a calm premium finish.' },
  { src: 'assets/img22.jpg', title: 'Stone and warm metal', text: 'Warm metal accents and deep stone texture help the work feel considered, modern and high-end.' },
  { src: 'assets/img20.jpg', title: 'Pattern and contrast', text: 'A stronger tile pattern adds character while keeping the installation clean and controlled.' },
  { src: 'assets/img19.jpg', title: 'Joinery and LED detail', text: 'Vertical light, clean planes and fitted details show the quality clients notice every day.' },
  { src: 'assets/img21.jpg', title: 'Shower zone', text: 'Close detail on fittings, glass and finish builds confidence in the installation quality.' },
  { src: 'assets/img17.jpg', title: 'Finish line detail', text: 'Corners, grout lines and surface transitions show the standard better than generic sales copy.' },
  { src: 'assets/img16.jpg', title: 'Soft minimal finish', text: 'A lighter project balances the dark showcase and shows the process works across styles.' },
  { src: 'assets/img14.jpg', title: 'Material depth', text: 'Texture, light and layered materials create a premium impression without shouting.' }
];

const proofData = [
  { src: 'assets/proofs/svg/reference-01.svg', title: 'Reference 01', text: 'Original client reference screen.' },
  { src: 'assets/proofs/svg/reference-02.svg', title: 'Reference 02', text: 'Original client reference screen.' },
  { src: 'assets/proofs/svg/reference-03.svg', title: 'Reference 03', text: 'Original client reference screen.' },
  { src: 'assets/proofs/svg/reference-04.svg', title: 'Reference 04', text: 'Original client reference screen.' },
  { src: 'assets/proofs/svg/reference-05.svg', title: 'Reference 05', text: 'Original client reference screen.' }
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobileIntroRisk = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches || /Android|SamsungBrowser/i.test(navigator.userAgent);
const body = document.body;
const siteLoader = document.getElementById('site-loader');
const siteLoaderProgress = document.getElementById('site-loader-progress');
const siteLoaderLabel = document.getElementById('site-loader-label');
const introReveal = document.getElementById('intro-reveal');
const introPanels = [...document.querySelectorAll('.intro-panel')];
const introTitle = document.getElementById('intro-title');
const introText = document.getElementById('intro-text');
const introProgressBar = document.getElementById('intro-progress-bar');
const heroPanels = [...document.querySelectorAll('.reveal-panel')];
const heroProgress = document.getElementById('hero-progress');
const track = document.getElementById('carousel-track');
const viewport = document.getElementById('carousel-viewport');
const counter = document.getElementById('slider-counter');
const title = document.getElementById('slider-title');
const text = document.getElementById('slider-text');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const proofsGrid = document.getElementById('proofs-grid');
const proofViewer = document.getElementById('proof-viewer');
const proofTrack = document.getElementById('proof-track');
const proofCounter = document.getElementById('proof-counter');
const proofTitle = document.getElementById('proof-title');
const proofText = document.getElementById('proof-text');
const proofPrev = document.getElementById('proof-prev');
const proofNext = document.getElementById('proof-next');
const proofClose = document.getElementById('proof-close');
const phaseCards = [...document.querySelectorAll('[data-phase-card]')];

let activeHero = 0;
let heroInterval;
let activeIndex = 0;
let autoplay;
let cards = [];
let proofSlides = [];
let activeProof = 0;
let carouselDragStartX = 0;
let carouselDragLastX = 0;
let carouselDragging = false;
let carouselPointerId = null;
let proofDragStartX = 0;
let proofDragging = false;

function runLoader() {
  body.classList.add('is-loading');
  if (!siteLoader || !siteLoaderProgress || !siteLoaderLabel || prefersReducedMotion) {
    body.classList.add('is-loaded');
    body.classList.remove('is-loading');
    siteLoader?.classList.add('is-hidden');
    return Promise.resolve();
  }

  return new Promise(resolve => {
    const state = { value: 0 };
    gsap.to(state, {
      value: 100,
      duration: 1.35,
      ease: 'power3.inOut',
      onUpdate: () => {
        const val = Math.round(state.value);
        siteLoaderProgress.style.width = `${val}%`;
        siteLoaderLabel.textContent = `${val}%`;
      },
      onComplete: () => {
        gsap.to(siteLoader, {
          opacity: 0,
          duration: 0.42,
          ease: 'power3.out',
          onComplete: () => {
            siteLoader.classList.add('is-hidden');
            body.classList.remove('is-loading');
            body.classList.add('is-loaded');
            resolve();
          }
        });
      }
    });
  });
}

function initHeroScene() {
  const canvas = document.getElementById('hero-webgl');
  if (!canvas || prefersReducedMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));

  const particleCount = 90;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xf7e1a9,
    size: 0.045,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 7, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xd9b266, transparent: true, opacity: 0.055 })
  );
  plane.rotation.z = -0.22;
  plane.position.set(1.3, 0.2, -1.5);
  scene.add(plane);

  const plane2 = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 5.5, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x8bb8ff, transparent: true, opacity: 0.045 })
  );
  plane2.rotation.z = 0.14;
  plane2.position.set(-2.4, -1.1, -2.1);
  scene.add(plane2);

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  let pointerX = 0;
  let pointerY = 0;
  window.addEventListener('mousemove', event => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.45;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.25;
  }, { passive: true });

  const clock = new THREE.Clock();
  const render = () => {
    const time = clock.getElapsedTime();
    particles.rotation.y = time * 0.06 + pointerX * 0.8;
    particles.rotation.x = -0.08 + pointerY * 0.8;
    plane.position.x = 1.3 + Math.sin(time * 0.35) * 0.25 + pointerX * 0.8;
    plane2.position.y = -1.1 + Math.cos(time * 0.28) * 0.22 - pointerY * 0.6;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();
}

function setHeroSlide(nextIndex, immediate = false) {
  const currentPanel = heroPanels[activeHero];
  const nextPanel = heroPanels[nextIndex];
  if (!nextPanel) return;

  heroPanels.forEach(panel => panel.classList.remove('is-active', 'is-exit'));
  currentPanel?.classList.add('is-exit');
  nextPanel.classList.add('is-active');

  if (heroProgress) {
    const maxTravel = Math.max((heroProgress.parentElement?.offsetWidth || 420) - heroProgress.offsetWidth, 0);
    const step = maxTravel / Math.max(heroPanels.length - 1, 1);
    gsap.to(heroProgress, {
      x: nextIndex * step,
      duration: immediate || prefersReducedMotion ? 0 : 1.05,
      ease: 'power3.inOut'
    });
  }

  activeHero = nextIndex;
}

function startHeroAutoplay() {
  clearInterval(heroInterval);
  if (heroPanels.length <= 1 || prefersReducedMotion) return;
  heroInterval = setInterval(() => {
    setHeroSlide((activeHero + 1) % heroPanels.length);
  }, 4200);
}

function finishIntroReveal() {
  if (introReveal) {
    introReveal.classList.remove('is-running');
    introReveal.classList.add('is-hidden');
    introReveal.setAttribute('aria-hidden', 'true');
  }
  body.classList.remove('is-intro-revealing');
  gsap.set(['.topbar', '.hero-copy', '.hero-copy *', '.hero-stage'], { clearProps: 'opacity,transform' });
  setHeroSlide(2, true);
  startHeroAutoplay();
}

function setIntroStage(index) {
  const stages = [
    { title: 'Before', text: 'We start with the real condition of the room.' },
    { title: 'Craft', text: 'Waterproofing, tiling, fitting and detail control.' },
    { title: 'Finish', text: 'A clean handover with a premium bathroom finish.' }
  ];
  introPanels.forEach((panel, panelIndex) => {
    panel.classList.toggle('is-active', panelIndex === index);
    panel.classList.toggle('is-past', panelIndex < index);
  });
  if (introTitle) introTitle.textContent = stages[index]?.title || stages[0].title;
  if (introText) introText.textContent = stages[index]?.text || stages[0].text;
  if (introProgressBar) {
    gsap.to(introProgressBar, { width: `${((index + 1) / stages.length) * 100}%`, duration: 0.42, ease: 'power3.out', overwrite: true });
  }
}

function initHeroAnimations() {
  clearInterval(heroInterval);
  setHeroSlide(2, true);
  gsap.set(['.topbar', '.hero-copy', '.hero-copy *', '.hero-stage'], { clearProps: 'opacity,transform' });

  if (prefersReducedMotion || isMobileIntroRisk || !introReveal || introPanels.length < 3) {
    finishIntroReveal();
    return;
  }

  body.classList.add('is-intro-revealing');
  introReveal.classList.remove('is-hidden');
  introReveal.classList.add('is-running');
  introReveal.setAttribute('aria-hidden', 'false');
  gsap.set(introPanels, { clearProps: 'opacity,transform,clipPath' });
  gsap.set(introProgressBar, { width: '0%' });
  setIntroStage(0);

  const revealTimers = [
    window.setTimeout(() => setIntroStage(1), 950),
    window.setTimeout(() => setIntroStage(2), 1850),
    window.setTimeout(() => {
      gsap.to(introReveal, { opacity: 0, scale: 1.015, duration: 0.62, ease: 'power3.inOut', overwrite: true, onComplete: () => {
        gsap.set(introReveal, { clearProps: 'opacity,transform' });
        finishIntroReveal();
      }});
    }, 2850)
  ];

  window.setTimeout(() => {
    revealTimers.forEach(timer => window.clearTimeout(timer));
    finishIntroReveal();
  }, 4700);
}

function createCards() {
  if (!track) return;
  track.innerHTML = imageData.map((item, index) => `
    <article class="carousel-card" data-index="${index}">
      <div class="carousel-card-media">
        <img src="${item.src}" alt="Bathroom project ${index + 1}">
      </div>
      <div class="carousel-card-label">
        <span>Project ${String(index + 1).padStart(2, '0')}</span>
        <strong>${item.title}</strong>
      </div>
    </article>
  `).join('');
  cards = [...track.querySelectorAll('.carousel-card')];
  const controls = document.querySelector('.carousel-controls');
  if (controls && !document.querySelector('.carousel-dots')) {
    controls.insertAdjacentHTML('afterend', `<div class="carousel-dots" aria-label="Project image selection">${imageData.map((_, index) => `<button class="carousel-dot" data-slide="${index}" aria-label="Show project image ${index + 1}"></button>`).join('')}</div>`);
  }
}

function updateCarouselCaption() {
  const item = imageData[activeIndex];
  if (!item) return;
  counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(imageData.length).padStart(2, '0')}`;
  title.textContent = item.title;
  text.textContent = item.text;
}

function renderCarousel(immediate = false) {
  if (!cards.length || !track || !viewport) return;

  const viewportWidth = viewport.clientWidth;
  const cardWidth = cards[0].offsetWidth;
  const gap = parseFloat(getComputedStyle(track).gap || '24') || 24;
  const edgePadding = Math.max((viewportWidth - cardWidth) / 2, 0);
  track.style.paddingLeft = `${edgePadding}px`;
  track.style.paddingRight = `${edgePadding}px`;
  const targetX = activeIndex * (cardWidth + gap);

  gsap.to(track, {
    x: -targetX,
    duration: immediate || prefersReducedMotion ? 0 : 0.68,
    ease: 'power3.out',
    overwrite: true
  });

  cards.forEach((card, index) => {
    const offset = index - activeIndex;
    const abs = Math.abs(offset);
    const side = Math.sign(offset) || 0;
    card.classList.toggle('is-active', index === activeIndex);
    card.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    card.style.zIndex = String(40 - abs);

    gsap.to(card, {
      rotateY: side * -10,
      rotateZ: side * 0.8,
      y: abs === 0 ? 0 : 18 + Math.min(abs, 3) * 6,
      z: abs === 0 ? 80 : -Math.min(abs, 4) * 42,
      scale: abs === 0 ? 1.03 : 0.94 - Math.min(abs, 3) * 0.025,
      opacity: abs > 4 ? 0.34 : Math.max(0.58, 1 - abs * 0.13),
      filter: abs === 0 ? 'saturate(1.08) brightness(1.04)' : `saturate(${Math.max(0.76, 1 - abs * 0.08)}) brightness(${Math.max(0.74, 0.94 - abs * 0.05)})`,
      duration: immediate || prefersReducedMotion ? 0 : 0.68,
      ease: 'power3.out',
      overwrite: true
    });
  });

  document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('is-active', index === activeIndex);
    dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
  });

  updateCarouselCaption();
}

function goToSlide(index) {
  activeIndex = (index + imageData.length) % imageData.length;
  renderCarousel();
}

function startAutoplay() {
  clearInterval(autoplay);
  if (prefersReducedMotion || imageData.length <= 1) return;
  autoplay = window.setInterval(() => {
    goToSlide(activeIndex + 1);
  }, 4200);
}

function pauseAutoplay() {
  clearInterval(autoplay);
}

function onCarouselPointerEnd(clientX) {
  if (!carouselDragging) return;
  const delta = clientX - carouselDragStartX;
  carouselDragging = false;
  carouselPointerId = null;
  viewport?.classList.remove('is-dragging');
  if (Math.abs(delta) > 34) {
    goToSlide(delta < 0 ? activeIndex + 1 : activeIndex - 1);
  } else {
    renderCarousel();
  }
  startAutoplay();
}

function initCarousel() {
  createCards();
  renderCarousel(true);
  startAutoplay();

  prevBtn?.addEventListener('click', event => {
    event.preventDefault();
    pauseAutoplay();
    goToSlide(activeIndex - 1);
    startAutoplay();
  });
  nextBtn?.addEventListener('click', event => {
    event.preventDefault();
    pauseAutoplay();
    goToSlide(activeIndex + 1);
    startAutoplay();
  });

  track?.addEventListener('click', event => {
    const card = event.target.closest('.carousel-card');
    if (!card || carouselDragging) return;
    pauseAutoplay();
    goToSlide(Number(card.dataset.index || 0));
    startAutoplay();
  });

  document.querySelector('.carousel-dots')?.addEventListener('click', event => {
    const dot = event.target.closest('.carousel-dot');
    if (!dot) return;
    pauseAutoplay();
    goToSlide(Number(dot.dataset.slide || 0));
    startAutoplay();
  });

  let wheelLocked = false;
  viewport?.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) < 8 && Math.abs(event.deltaX) < 8) return;
    event.preventDefault();
    if (wheelLocked) return;
    wheelLocked = true;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    pauseAutoplay();
    goToSlide(delta > 0 ? activeIndex + 1 : activeIndex - 1);
    startAutoplay();
    window.setTimeout(() => { wheelLocked = false; }, 420);
  }, { passive: false });

  viewport?.addEventListener('pointerdown', event => {
    carouselDragging = true;
    carouselPointerId = event.pointerId;
    pauseAutoplay();
    carouselDragStartX = event.clientX;
    carouselDragLastX = event.clientX;
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(event.pointerId);
  });
  viewport?.addEventListener('pointermove', event => {
    if (!carouselDragging || carouselPointerId !== event.pointerId || !track) return;
    const delta = event.clientX - carouselDragLastX;
    carouselDragLastX = event.clientX;
    gsap.to(track, { x: `+=${delta}`, duration: 0.12, ease: 'power2.out', overwrite: true });
  });
  viewport?.addEventListener('pointerup', event => onCarouselPointerEnd(event.clientX));
  viewport?.addEventListener('pointerleave', event => {
    if (carouselDragging && carouselPointerId === event.pointerId) onCarouselPointerEnd(event.clientX);
  });
  viewport?.addEventListener('pointercancel', () => {
    carouselDragging = false;
    carouselPointerId = null;
    viewport.classList.remove('is-dragging');
    renderCarousel();
    startAutoplay();
  });

  viewport?.addEventListener('mouseenter', pauseAutoplay);
  viewport?.addEventListener('mouseleave', startAutoplay);

  window.addEventListener('resize', () => renderCarousel(true));
}

function renderProofs(immediate = false) {
  proofSlides.forEach((slide, index) => {
    let offset = index - activeProof;
    if (offset > proofData.length / 2) offset -= proofData.length;
    if (offset < -proofData.length / 2) offset += proofData.length;
    const abs = Math.abs(offset);
    const direction = Math.sign(offset) || 1;
    gsap.to(slide, {
      xPercent: -50,
      x: abs === 0 ? 0 : direction * (178 + (abs - 1) * 112),
      z: -abs * 180,
      rotateY: direction * -20,
      scale: 1 - abs * 0.06,
      opacity: abs > 3 ? 0 : Math.max(0.15, 1 - abs * 0.18),
      duration: immediate || prefersReducedMotion ? 0 : 0.9,
      ease: 'power3.inOut',
      overwrite: true
    });
    slide.style.zIndex = String(100 - abs);
  });
  const item = proofData[activeProof];
  proofCounter.textContent = `${String(activeProof + 1).padStart(2, '0')} / ${String(proofData.length).padStart(2, '0')}`;
  proofTitle.textContent = item.title;
  proofText.textContent = item.text;
}

function changeProof(direction) {
  activeProof = (activeProof + direction + proofData.length) % proofData.length;
  renderProofs();
}

function initProofs() {
  if (!proofsGrid || !proofTrack) return;

  proofsGrid.innerHTML = proofData.map((item, index) => `
    <button class="proof-card reveal-up" data-proof-index="${index}" aria-label="Open proof ${index + 1}">
      <img src="${item.src}" alt="${item.title}">
      <div class="proof-card-copy">
        <span>Proof ${String(index + 1).padStart(2, '0')}</span>
        <strong>${item.title}</strong>
      </div>
    </button>
  `).join('');

  proofTrack.innerHTML = proofData.map((item, index) => `
    <article class="proof-slide" data-proof-slide="${index}">
      <img src="${item.src}" alt="${item.title}">
    </article>
  `).join('');
  proofSlides = [...proofTrack.querySelectorAll('.proof-slide')];

  const openProofViewer = index => {
    activeProof = index;
    proofViewer.classList.add('is-open');
    proofViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderProofs();
  };

  const closeProofViewer = () => {
    proofViewer.classList.remove('is-open');
    proofViewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = body.classList.contains('is-loading') ? 'hidden' : '';
  };

  proofsGrid.querySelectorAll('[data-proof-index]').forEach(btn => {
    btn.addEventListener('click', () => openProofViewer(Number(btn.dataset.proofIndex || 0)));
  });

  proofPrev?.addEventListener('click', () => changeProof(-1));
  proofNext?.addEventListener('click', () => changeProof(1));
  proofClose?.addEventListener('click', closeProofViewer);
  proofViewer?.addEventListener('click', event => {
    if (event.target === proofViewer) closeProofViewer();
  });
  proofTrack?.addEventListener('pointerdown', event => {
    proofDragging = true;
    proofDragStartX = event.clientX;
    proofTrack.setPointerCapture(event.pointerId);
  });
  proofTrack?.addEventListener('pointerup', event => {
    if (!proofDragging) return;
    const delta = event.clientX - proofDragStartX;
    proofDragging = false;
    if (Math.abs(delta) > 25) changeProof(delta < 0 ? 1 : -1);
  });
  proofTrack?.addEventListener('pointercancel', () => { proofDragging = false; });

  window.addEventListener('keydown', event => {
    if (!proofViewer?.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeProofViewer();
    if (event.key === 'ArrowLeft') changeProof(-1);
    if (event.key === 'ArrowRight') changeProof(1);
  });

  renderProofs(true);
}

function setPhase(card, nextIndex, immediate = false) {
  const images = [...card.querySelectorAll('[data-phase-image]')];
  const tabs = [...card.querySelectorAll('.phase-tab')];
  const range = card.querySelector('[data-phase-range]');
  images.forEach((image, index) => {
    image.classList.toggle('is-active', index === nextIndex);
    gsap.to(image, {
      opacity: index === nextIndex ? 1 : 0,
      scale: index === nextIndex ? 1 : 1.03,
      duration: immediate || prefersReducedMotion ? 0 : 0.55,
      ease: 'power3.out',
      overwrite: true
    });
  });
  tabs.forEach((tab, index) => tab.classList.toggle('is-active', index === nextIndex));
  if (range) range.value = String(nextIndex);
}

function initPhaseSliders() {
  phaseCards.forEach(card => {
    const tabs = [...card.querySelectorAll('.phase-tab')];
    const range = card.querySelector('[data-phase-range]');
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => setPhase(card, index));
    });
    range?.addEventListener('input', () => setPhase(card, Number(range.value)));
    setPhase(card, 0, true);
  });
}


function initExpandableSections() {
  document.querySelectorAll('[data-expand-target]').forEach(button => {
    const panel = document.getElementById(button.dataset.expandTarget || '');
    if (!panel) return;
    const cards = [...panel.querySelectorAll('.process-card, .service-card')];
    gsap.set(cards, { opacity: 0, y: 28, scale: 0.96 });

    button.addEventListener('click', () => {
      panel.classList.remove('is-collapsed');
      panel.classList.add('is-expanded');
      button.setAttribute('aria-expanded', 'true');
      button.classList.add('is-hidden');
      gsap.fromTo(cards,
        { opacity: 0, y: 28, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: prefersReducedMotion ? 0 : 0.62, stagger: 0.09, ease: 'power3.out', overwrite: true }
      );
      window.setTimeout(() => {
        const top = panel.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }, 80);
    }, { once: true });
  });
}

function initRevealObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gsap.to(entry.target, {
        opacity: 1,
        y: 0,
        duration: prefersReducedMotion ? 0 : 0.8,
        delay: [...entry.target.parentElement.children].indexOf(entry.target) * 0.08,
        ease: 'power3.out'
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal-up').forEach(item => {
    if (item.closest('[data-expand-panel]')) return;
    observer.observe(item);
  });
}


const quoteModal = document.getElementById('quote-modal');
const quoteOpeners = [...document.querySelectorAll('[data-quote-open]')];
const quoteClosers = [...document.querySelectorAll('[data-quote-close]')];
const quoteCopyStatus = document.getElementById('quote-copy-status');

function openQuoteModal() {
  if (!quoteModal) return;
  quoteModal.classList.add('is-open');
  quoteModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('quote-modal-open');
  if (quoteCopyStatus) quoteCopyStatus.textContent = '';
}

function closeQuoteModal() {
  if (!quoteModal) return;
  quoteModal.classList.remove('is-open');
  quoteModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('quote-modal-open');
}

quoteOpeners.forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    openQuoteModal();
  });
});

quoteClosers.forEach(button => {
  button.addEventListener('click', closeQuoteModal);
});

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy || '';
    try {
      await navigator.clipboard.writeText(value);
      if (quoteCopyStatus) quoteCopyStatus.textContent = 'Copied to clipboard';
    } catch {
      if (quoteCopyStatus) quoteCopyStatus.textContent = value;
    }
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeQuoteModal();
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const selector = link.getAttribute('href');
    if (!selector) return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

window.addEventListener('load', async () => {
  initHeroScene();
  initCarousel();
  initProofs();
  initPhaseSliders();
  initExpandableSections();
  initRevealObserver();
  await runLoader();
  initHeroAnimations();
});
