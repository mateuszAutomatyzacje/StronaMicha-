const imageData = [
  { src: 'assets/img18.jpg', title: 'Salonowa łazienka premium', text: 'Szeroki kadr z wanną wolnostojącą, światłem liniowym i pełnym efektem wow od pierwszego wejścia.' },
  { src: 'assets/img22.jpg', title: 'Miedź i kamień', text: 'Ciepłe akcenty metalu i głęboka faktura ściany świetnie pracują w animacji 3D.' },
  { src: 'assets/img24.jpg', title: 'Prysznic i wanna w jednej osi', text: 'Kadr, który pokazuje ergonomię układu oraz poziom wykończenia w jednym ujęciu.' },
  { src: 'assets/img20.jpg', title: 'Kontrastowy motyw', text: 'Mocny wzór płytek przełamuje minimalistyczne realizacje i dodaje galerii charakteru.' },
  { src: 'assets/img19.jpg', title: 'Zabudowa i światło LED', text: 'Dobry przykład tego, jak detal meblowy i pionowe światło robią klimat premium.' },
  { src: 'assets/img21.jpg', title: 'Strefa prysznica', text: 'Bliski kadr na armaturę i szkło buduje zaufanie do jakości wykonania.' },
  { src: 'assets/img17.jpg', title: 'Dopracowane wykończenie', text: 'Zbliżenie na gotowy efekt, który dobrze działa jako element wiarygodności i portfolio.' },
  { src: 'assets/img23.jpg', title: 'Przed i po', text: 'Ujęcie etapu prac przypomina, że za efektem finalnym stoi realna robota i proces wykonawczy.' }
];

const heroPanels = [...document.querySelectorAll('.reveal-panel')];
const heroProgress = document.getElementById('hero-progress');
let activeHero = 0;

function setHeroSlide(nextIndex) {
  heroPanels.forEach((panel, index) => {
    panel.classList.remove('is-active', 'is-exit');
    if (index === nextIndex) panel.classList.add('is-active');
    if (index === activeHero && index !== nextIndex) panel.classList.add('is-exit');
  });
  heroProgress.style.transform = `translateX(${nextIndex * 100}%)`;
  activeHero = nextIndex;
}

if (heroPanels.length) {
  setInterval(() => setHeroSlide((activeHero + 1) % heroPanels.length), 3200);
}

const track = document.getElementById('carousel-track');
const viewport = document.getElementById('carousel-viewport');
const counter = document.getElementById('slider-counter');
const title = document.getElementById('slider-title');
const text = document.getElementById('slider-text');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
let activeIndex = 0;
let autoplay;
let startX = 0;
let endX = 0;

function createCards() {
  if (!track) return;
  track.innerHTML = imageData.map((item, index) => `
    <article class="carousel-card" data-index="${index}">
      <img src="${item.src}" alt="Realizacja łazienki ${index + 1}">
      <div class="carousel-card-label">
        <span>Realizacja ${String(index + 1).padStart(2, '0')}</span>
        <strong>${item.title}</strong>
      </div>
    </article>
  `).join('');
}

function renderCarousel() {
  const cards = [...document.querySelectorAll('.carousel-card')];
  if (!cards.length) return;

  cards.forEach((card, index) => {
    const offset = index - activeIndex;
    const abs = Math.abs(offset);
    const clamped = Math.min(abs, 4);
    const translateX = offset * 190;
    const translateZ = -abs * 160;
    const rotateY = offset * -18;
    const scale = 1 - abs * 0.08;
    card.style.opacity = abs > 4 ? '0' : String(1 - abs * 0.14);
    card.style.filter = abs === 0 ? 'none' : `blur(${clamped * 0.8}px) saturate(${1 - abs * 0.08})`;
    card.style.transform = `translateX(calc(-50% + ${translateX}px)) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    card.style.zIndex = String(100 - abs);
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
  autoplay = setInterval(() => goToSlide(activeIndex + 1), 2800);
}

createCards();
renderCarousel();
startAutoplay();

prevBtn?.addEventListener('click', () => {
  goToSlide(activeIndex - 1);
  startAutoplay();
});

nextBtn?.addEventListener('click', () => {
  goToSlide(activeIndex + 1);
  startAutoplay();
});

viewport?.addEventListener('mousemove', event => {
  const rect = viewport.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  track.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -5}deg)`;
});

viewport?.addEventListener('mouseleave', () => {
  track.style.transform = 'rotateY(0deg) rotateX(0deg)';
});

viewport?.addEventListener('touchstart', event => {
  startX = event.touches[0].clientX;
}, { passive: true });

viewport?.addEventListener('touchend', event => {
  endX = event.changedTouches[0].clientX;
  const delta = endX - startX;
  if (Math.abs(delta) > 40) {
    goToSlide(delta < 0 ? activeIndex + 1 : activeIndex - 1);
    startAutoplay();
  }
}, { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.style.transitionDelay = `${[...entry.target.parentElement.children].indexOf(entry.target) * 0.08}s`;
    if (entry.isIntersecting) entry.target.style.opacity = '1';
    if (entry.isIntersecting) entry.target.style.transform = 'none';
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal-up').forEach(item => observer.observe(item));

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

window.addEventListener('load', () => {
  document.body.classList.add('is-loaded');
});
