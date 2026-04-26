# Immersive reveal animation — implementation plan

## Cel
Po pierwszym wejściu klient ma dostać krótką, premium pokazówkę procesu: od stanu przed pracami, przez wykonanie, do gotowego efektu. Reveal ma budować zaufanie i głębię strony, a nie być pustym efektem.

## Rekomendowana technologia

### 1. GSAP — główna technologia animacji
Użyć jako główny silnik timeline:
- loader progress,
- reveal zdjęć,
- wejście tekstu hero,
- przejście Before → Craft → Finish,
- clip-path / mask reveal,
- kontrola fallbacku `prefers-reduced-motion`.

Powód: obecna strona już używa GSAP, jest szybki, precyzyjny i wystarczy do premium efektu bez ciężkiego WebGL.

### 2. CSS 3D + transform — głębia zdjęć
Użyć do efektu warstw:
- `perspective`,
- `translateZ`,
- `rotateY`,
- `scale`,
- lekkie parallax movement.

Powód: daje efekt 3D bez kosztu pełnego WebGL.

### 3. Three.js — tylko jako subtelne tło
Użyć opcjonalnie do:
- lekkich particle highlights,
- miękkiej głębi światła,
- nie do samego reveal zdjęć.

Powód: Three.js ma sens jako ambient premium layer, ale nie powinien być wymagany do załadowania strony na mobile.

### 4. Vite / obecny setup
Na teraz wdrożenie robić w aktualnym setupie statycznym/Vite-like.

### 5. Next.js + React — docelowo
Jeśli strona ma iść produkcyjnie dalej:
- `HeroReveal` jako komponent React,
- `PortfolioCarousel3D` jako komponent,
- Next.js dla SEO/deployment/routingu.

### 6. Barba.js — nie do pierwszego loada
Barba.js zostawić na przyszłe przejścia między podstronami. Nie jest potrzebny do initial immersive reveal.

---

## Zdjęcia do użycia

### Reveal hero — narracja procesu
Najlepszy zestaw:
1. `assets/progress/bath-01-before.jpg` — Before / stan przed
2. `assets/progress/bath-01-during.jpg` — Craft / w trakcie
3. `assets/img18.jpg` — Finish / premium final

Alternatywa jeśli img18 jest za szerokie albo ciemne:
- `assets/img22.jpg` — stone/brass premium mood
- `assets/img20.jpg` — mocniejszy detal/kontrast
- `assets/progress/bath-01-after.jpg` — logiczne domknięcie before/during/after

### Portfolio 3D
Użyć aktualnej serii:
- `assets/img18.jpg`
- `assets/img22.jpg`
- `assets/img20.jpg`
- `assets/img19.jpg`
- `assets/img21.jpg`
- `assets/img17.jpg`
- `assets/img16.jpg`
- `assets/img14.jpg`

### Process / proof visual accents
Do małych kart lub backgroundów:
- `assets/progress/bath-02-before.jpg`
- `assets/progress/bath-02-during.jpg`
- `assets/progress/bath-02-after.jpg`
- `assets/progress/bath-03-during.jpg`

---

## Proposed user experience

### Etap 0 — preloader, 0.0–1.2s
Widok:
- czarne tło #050505,
- subtle grain,
- duży procent w tle,
- cienka linia progress w złocie,
- napis: `BUILD MASTERS` / `BATHROOM INSTALLATION SPECIALISTS`.

Animacja:
- progress 0–100,
- tekst brandu pojawia się z lekkim letter reveal,
- gold sheen przechodzi po panelu.

### Etap 1 — Before, 1.2–2.0s
Widok:
- zdjęcie `bath-01-before.jpg`,
- karta w hero lekko cofnięta w Z,
- label: `01 / Before`,
- tekst: `We start with the real condition of the room.`

Animacja:
- clip-path z lewej do prawej,
- zdjęcie wchodzi z blur 10px → 0,
- delikatny zoom out.

### Etap 2 — Craft, 2.0–2.8s
Widok:
- zdjęcie `bath-01-during.jpg`,
- label: `02 / Craft`,
- tekst: `Waterproofing, tiling, fitting and detail control.`

Animacja:
- poprzednie zdjęcie odsuwa się w tył,
- nowe zdjęcie przechodzi diagonal maską,
- subtelna linia progress przesuwa się na drugi punkt.

### Etap 3 — Finish, 2.8–3.7s
Widok:
- zdjęcie `assets/img18.jpg` lub `bath-01-after.jpg`,
- label: `03 / Finish`,
- tekst: `A clean handover with a premium finish.`

Animacja:
- karta wychodzi do przodu `translateZ(50px)`,
- hero copy pojawia się fade-up,
- CTA pojawia się po tekście,
- scroll indicator dopiero na końcu.

### Etap 4 — normalna strona
Po zakończeniu:
- hero zostaje statycznie czytelny,
- reveal może delikatnie auto-rotować co 4–5s,
- użytkownik może scrollować bez blokady.

---

## Struktura HTML

Dodać/utrzymać w hero:

```html
<div class="hero-depth-stage">
  <div class="reveal-stack">
    <article class="reveal-panel" data-stage="before"></article>
    <article class="reveal-panel" data-stage="craft"></article>
    <article class="reveal-panel" data-stage="finish"></article>
  </div>
  <div class="hero-reveal-ui">
    <div class="hero-stage-chip">Before → Craft → Finish</div>
    <div class="hero-stage-progress"><span></span></div>
    <div class="hero-reveal-steps"><span>Before</span><span>Craft</span><span>Finish</span></div>
  </div>
</div>
```

---

## GSAP timeline

Pseudokod:

```js
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl
  .from('.loader-brand-lines strong', { y: 32, opacity: 0, duration: .55 })
  .to(progressState, { value: 100, duration: 1.15 })
  .to('.site-loader', { opacity: 0, duration: .42 })
  .fromTo('[data-stage="before"]', { clipPath: 'inset(0 100% 0 0)', z: -80 }, { clipPath: 'inset(0 0% 0 0)', z: 0, duration: .8 })
  .to('[data-stage="before"]', { z: -90, scale: .96, duration: .55 })
  .fromTo('[data-stage="craft"]', { clipPath: 'inset(0 0 100% 0)', z: -50 }, { clipPath: 'inset(0 0 0% 0)', z: 18, duration: .8 }, '-=.25')
  .to('[data-stage="craft"]', { z: -70, rotateY: -5, duration: .55 })
  .fromTo('[data-stage="finish"]', { clipPath: 'inset(0 0 0 100%)', z: -40 }, { clipPath: 'inset(0 0 0 0%)', z: 56, duration: .9 }, '-=.25')
  .from('.hero-copy > *', { y: 22, opacity: 0, stagger: .08, duration: .65 }, '-=.45');
```

---

## CSS essentials

- `body.is-loading { overflow: hidden; }`
- `body.is-loaded { overflow: auto; }`
- `.hero-depth-stage { perspective: 1400px; transform-style: preserve-3d; }`
- `.reveal-panel { will-change: transform, clip-path, opacity; }`
- `@media (prefers-reduced-motion: reduce)` → instant load, no forced animation.
- Na mobile: wyłączyć ciężkie parallax/Three.js, zostawić fade + clip reveal.

---

## Fallback mobile

Na mobile:
- loader max 0.8–1.0s,
- bez intensywnego WebGL,
- tylko 2D mask reveal,
- hero image jako static final po zakończeniu,
- nie blokować scrolla dłużej niż ~1.5s.

---

## Kolejność wdrożenia

1. Uporządkować `hero-stage` i zdjęcia: before/craft/finish.
2. Zrobić GSAP timeline po loaderze.
3. Dodać stage labels i progress line.
4. Dodać 3D depth CSS tylko na desktop.
5. Dodać mobile fallback.
6. Sprawdzić Lighthouse/performance ręcznie w Playwright:
   - brak JS errorów,
   - hero visible po load,
   - scroll odblokowany,
   - first/last slide portfolio nadal center.
7. Dopiero potem ewentualnie przenieść do React/Next component.

---

## Rekomendacja końcowa
Najlepszy stack dla obecnego wdrożenia: **GSAP + CSS 3D + lekki Three.js ambient**.  
Docelowy stack produkcyjny: **Next.js + React + GSAP + Three.js**, z **Barba.js tylko jeśli będą osobne podstrony i transitions między nimi**.
