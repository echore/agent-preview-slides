const SECTIONS = [
  'sections/01-preview.html',
];

// URL hash -> which SECTIONS file it belongs to (by index above)
const SECTION_ANCHORS = {
  'preview': 0,
};

const deck = document.getElementById('deck');
const REVEAL_ALL = new URLSearchParams(window.location.search).has('all');
let slides = [];
let current = 0;

// ---- build steps -------------------------------------------------------
// Elements with data-step="N" stay hidden until step N is reached on that slide.
function maxStep(slide) {
  let max = 0;
  slide.querySelectorAll('[data-step]').forEach((el) => {
    max = Math.max(max, Number(el.dataset.step) || 0);
  });
  return max;
}

function setStep(slide, n) {
  const clamped = Math.max(0, Math.min(maxStep(slide), n));
  slide.dataset.build = clamped;
  slide.querySelectorAll('[data-step]').forEach((el) => {
    el.classList.toggle('is-revealed', (Number(el.dataset.step) || 0) <= clamped);
  });
}

function currentStep(slide) {
  return Number(slide.dataset.build) || 0;
}

// ---- navigation --------------------------------------------------------
function goTo(index, { revealAll = false } = {}) {
  if (!slides.length) return;
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
  setStep(slides[current], revealAll || REVEAL_ALL ? maxStep(slides[current]) : 0);
}

function next() {
  const slide = slides[current];
  if (currentStep(slide) < maxStep(slide)) {
    setStep(slide, currentStep(slide) + 1);
  } else if (current < slides.length - 1) {
    goTo(current + 1);
  }
}

function prev() {
  const slide = slides[current];
  if (currentStep(slide) > 0) {
    setStep(slide, currentStep(slide) - 1);
  } else if (current > 0) {
    goTo(current - 1, { revealAll: true });
  }
}

function startFromHash() {
  const hash = decodeURIComponent(window.location.hash.replace('#', '')).trim();
  if (!hash) { goTo(0); return; }
  const asNumber = parseInt(hash, 10);
  if (!Number.isNaN(asNumber)) { goTo(asNumber - 1); return; }
  const sectionIndex = SECTION_ANCHORS[hash];
  if (sectionIndex !== undefined) {
    const idx = slides.findIndex((s) => Number(s.dataset.section) === sectionIndex);
    if (idx !== -1) { goTo(idx); return; }
  }
  goTo(0);
}

async function loadSections() {
  for (let s = 0; s < SECTIONS.length; s++) {
    const html = await fetch(SECTIONS[s]).then((response) => response.text());
    const fragment = document.createRange().createContextualFragment(html);
    fragment.querySelectorAll('.slide').forEach((slide) => { slide.dataset.section = s; });
    deck.append(fragment);
  }
  slides = Array.from(deck.querySelectorAll('.slide'));
  slides.forEach((slide, i) => {
    const pagedot = slide.querySelector('.pagedot');
    if (pagedot) pagedot.textContent = `${i + 1} / ${slides.length}`;
  });
  startFromHash();
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'ArrowDown') { event.preventDefault(); next(); }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); prev(); }
});
window.addEventListener('hashchange', startFromHash);

loadSections();
