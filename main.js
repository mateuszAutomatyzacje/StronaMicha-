import * as THREE from './node_modules/three/build/three.module.js';
import { gsap } from './node_modules/gsap/index.js';

const imageData = [
  { src: 'assets/img18.jpg', title: 'Salonowa łazienka premium', text: 'Szeroki kadr z wanną wolnostojącą, światłem liniowym i pełnym efektem wow od pierwszego wejścia.' },
  { src: 'assets/img22.jpg', title: 'Miedź i kamień', text: 'Ciepłe akcenty metalu i głęboka faktura ściany świetnie pracują w animacji 3D.' },
  { src: 'assets/img20.jpg', title: 'Kontrastowy motyw', text: 'Mocny wzór płytek przełamuje minimalistyczne realizacje i dodaje galerii charakteru.' },
  { src: 'assets/img19.jpg', title: 'Zabudowa i światło LED', text: 'Dobry przykład tego, jak detal meblowy i pionowe światło robią klimat premium.' },
  { src: 'assets/img21.jpg', title: 'Strefa prysznica', text: 'Bliski kadr na armaturę i szkło buduje zaufanie do jakości wykonania.' },
  { src: 'assets/img17.jpg', title: 'Dopracowane wykończenie', text: 'Zbliżenie na gotowy efekt, który dobrze działa jako element wiarygodności i portfolio.' },
  { src: 'assets/img16.jpg', title: 'Stonowany minimalizm', text: 'Jaśniejsza realizacja równoważy ciemniejsze kadry i poprawia rytm całej sekcji.' },
  { src: 'assets/img14.jpg', title: 'Głębia materiałów', text: 'Kadr oparty na fakturze, świetle i warstwach, żeby galeria nie wpadała w powtarzalność.' }
];

const proofData = [
  { src: 'assets/proofs/proof01.jpg', title: 'Proof 01', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof02.jpg', title: 'Proof 02', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof03.jpg', title: 'Proof 03', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof04.jpg', title: 'Proof 04', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof05.jpg', title: 'Proof 05', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof07.jpg', title: 'Proof 06', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof08.jpg', title: 'Proof 07', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof10.jpg', title: 'Proof 08', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof13.jpg', title: 'Proof 09', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof14.jpg', title: 'Proof 10', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof15.jpg', title: 'Proof 11', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof16.jpg', title: 'Proof 12', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' },
  { src: 'assets/proofs/proof24.jpg', title: 'Proof 13', text: 'Realny screen dokumentu lub wiadomości referencyjnej.' }
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const body = document.body;
const siteLoader = document.getElementById('site-loader');
const siteLoaderProgress = document.getElementById('site-loader-progress');
const siteLoaderLabel = document.getElementById('site-loader-label');
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
      duration: 0.85,
      ease: 'power2.inOut',
      onUpdate: () => {
        const val = Math.round(state.value);
        siteLoaderProgress.style.width = `${val}%`;
        siteLoaderLabel.textContent = `${val}%`;
      },
      onComplete: () => {
        gsap.to(siteLoader, {
          opacity: 0,
          duration: 0.22,
          ease: 'power2.out',
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

function initHeroAnimations() {
  setHeroSlide(0, true);
  if (!prefersReducedMotion) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.topbar', { y: -18, opacity: 0, duration: 0.65 })
      .from('.hero-copy .eyebrow', { y: 22, opacity: 0, duration: 0.6 }, '-=0.2')
      .from('.hero-copy h1', { y: 34, opacity: 0, duration: 0.85 }, '-=0.38')
      .from('.hero-copy .lead', { y: 20, opacity: 0, duration: 0.75 }, '-=0.55')
      .from('.hero-actions a', { y: 18, opacity: 0, stagger: 0.08, duration: 0.55 }, '-=0.48')
      .from('.trust-list li', { y: 12, opacity: 0, stagger: 0.07, duration: 0.45 }, '-=0.36')
      .from('.hero-stage', { opacity: 0, scale: 0.98, duration: 0.8 }, '-=0.75')
      .from('.hero-stage-chip', { opacity: 0, x: -24, duration: 0.6 }, '-=0.5')
      .from('.hero-stage-progress', { opacity: 0, x: 24, duration: 0.6 }, '<');
  }
  startHeroAutoplay();
}

function createCards() {
  if (!track) return;
  track.innerHTML = imageData.map((item, index) => `
    <article class="carousel-card" data-index="${index}">
      <div class="carousel-card-media">
        <img src="${item.src}" alt="Realizacja łazienki ${index + 1}">
      </div>
      <div class="carousel-card-label">
        <span>Realizacja ${String(index + 1).padStart(2, '0')}</span>
        <strong>${item.title}</strong>
      </div>
    </article>
  `).join('');
  cards = [...track.querySelectorAll('.carousel-card')];
}

function renderCarousel(immediate = false) {
  if (!cards.length) return;

  cards.forEach((card, index) => {
    let offset = index - activeIndex;
    if (offset > imageData.length / 2) offset -= imageData.length;
    if (offset < -imageData.length / 2) offset += imageData.length;

    const abs = Math.abs(offset);
    const direction = Math.sign(offset) || 1;
    const baseX = abs === 0 ? 0 : 120 + (abs - 1) * 108;
    const translateX = direction * baseX;
    const translateZ = -abs * 150;
    const rotateY = direction * -22;

    gsap.to(card, {
      xPercent: -50,
      x: translateX,
      z: translateZ,
      rotateY,
      scale: 1 - abs * 0.08,
      opacity: abs > 4 ? 0 : Math.max(0.16, 1 - abs * 0.17),
      duration: immediate || prefersReducedMotion ? 0 : 1,
      ease: 'power3.inOut',
      overwrite: true
    });
    gsap.to(card, {
      filter: abs === 0 ? 'blur(0px) saturate(1) brightness(1)' : `blur(${Math.min(abs, 4) * 1.35}px) saturate(${1 - abs * 0.06}) brightness(${1 - abs * 0.06})`,
      duration: immediate || prefersReducedMotion ? 0 : 1,
      ease: 'power3.inOut',
      overwrite: true
    });

    const media = card.querySelector('.carousel-card-media');
    const image = card.querySelector('img');
    if (media && image) {
      const mediaBaseX = direction * abs * -14;
      const imageBaseX = direction * abs * 2.6;
      media.dataset.baseX = String(mediaBaseX);
      image.dataset.baseX = String(imageBaseX);
      gsap.to(media, { x: mediaBaseX, duration: immediate || prefersReducedMotion ? 0 : 1.1, ease: 'power3.inOut', overwrite: true });
      gsap.to(image, {
        scale: abs === 0 ? 1.08 : 1.16 + abs * 0.015,
        xPercent: imageBaseX,
        duration: immediate || prefersReducedMotion ? 0 : 1.1,
        ease: 'power3.inOut',
        overwrite: true
      });
    }
    card.style.zIndex = String(100 - abs);
    card.classList.toggle('is-active', abs === 0);
  });

  const item = imageData[activeIndex];
  counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(imageData.length).padStart(2, '0')}`;
  title.textContent = item.title;
  text.textContent = item.text;
}

function goToSlide(index) {
  activeIndex = (index + imageData.length) % imageData.length;
  renderCarousel();
}

function startAutoplay() {
  clearInterval(autoplay);
}

function onCarouselPointerEnd(clientX) {
  if (!carouselDragging) return;
  const delta = clientX - carouselDragStartX;
  carouselDragging = false;
  carouselPointerId = null;
  if (Math.abs(delta) > 30) {
    goToSlide(delta < 0 ? activeIndex + 1 : activeIndex - 1);
    startAutoplay();
  }
}

function initCarousel() {
  createCards();
  renderCarousel(true);
  startAutoplay();

  prevBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    goToSlide(activeIndex - 1);
    startAutoplay();
  });
  nextBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    goToSlide(activeIndex + 1);
    startAutoplay();
  });

  viewport?.addEventListener('mousemove', event => {
    if (prefersReducedMotion || carouselDragging) return;
    const rect = viewport.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(track, { rotateY: x * 8, rotateX: y * -5, x: x * 26, duration: 0.7, ease: 'power3.out', overwrite: true });
    cards.forEach((card, index) => {
      const offset = Math.abs(index - activeIndex);
      const media = card.querySelector('.carousel-card-media');
      const image = card.querySelector('img');
      if (!media || !image) return;
      const depth = Math.max(0, 1 - Math.min(offset, 3) * 0.22);
      const mediaBaseX = Number(media.dataset.baseX || 0);
      const imageBaseX = Number(image.dataset.baseX || 0);
      gsap.to(media, { y: y * 22 * depth, x: mediaBaseX + x * 10 * depth, duration: 0.75, ease: 'power3.out', overwrite: true });
      gsap.to(image, { xPercent: imageBaseX + x * 7 * depth, yPercent: y * 8 * depth, duration: 0.75, ease: 'power3.out', overwrite: true });
    });
  });

  viewport?.addEventListener('mouseleave', () => {
    if (carouselDragging) return;
    gsap.to(track, { rotateY: 0, rotateX: 0, x: 0, duration: 0.8, ease: 'power3.out', overwrite: true });
    cards.forEach(card => {
      const media = card.querySelector('.carousel-card-media');
      const image = card.querySelector('img');
      if (!media || !image) return;
      gsap.to(media, { y: 0, x: Number(media.dataset.baseX || 0), duration: 0.85, ease: 'power3.out', overwrite: true });
      gsap.to(image, { xPercent: Number(image.dataset.baseX || 0), yPercent: 0, duration: 0.85, ease: 'power3.out', overwrite: true });
    });
  });

  track?.addEventListener('click', event => {
    const card = event.target.closest('.carousel-card');
    if (!card || carouselDragging) return;
    const nextIndex = Number(card.dataset.index || 0);
    if (nextIndex !== activeIndex) {
      goToSlide(nextIndex);
      startAutoplay();
    }
  });

  viewport?.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) < 8 && Math.abs(event.deltaX) < 8) return;
    event.preventDefault();
    goToSlide((Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) > 0 ? activeIndex + 1 : activeIndex - 1);
    startAutoplay();
  }, { passive: false });

  viewport?.addEventListener('pointerdown', event => {
    carouselDragging = true;
    carouselPointerId = event.pointerId;
    carouselDragStartX = event.clientX;
    viewport.setPointerCapture(event.pointerId);
  });
  viewport?.addEventListener('pointerup', event => onCarouselPointerEnd(event.clientX));
  viewport?.addEventListener('pointerleave', event => {
    if (carouselDragging && carouselPointerId === event.pointerId) onCarouselPointerEnd(event.clientX);
  });
  viewport?.addEventListener('pointercancel', () => {
    carouselDragging = false;
    carouselPointerId = null;
  });
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
    <button class="proof-card reveal-up" data-proof-index="${index}" aria-label="Otwórz proof ${index + 1}">
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

  document.querySelectorAll('.reveal-up').forEach(item => observer.observe(item));
}

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
  initRevealObserver();
  await runLoader();
  initHeroAnimations();
});
