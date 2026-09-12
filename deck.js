const SECTIONS = [
  'sections/01-preview.html',
];

// URL hash -> which SECTIONS file it belongs to (by index above)
const SECTION_ANCHORS = {
  'preview': 0,
};

const deck = document.getElementById('deck');
let slides = [];
let current = 0;

function goTo(index) {
  if (!slides.length) return;
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
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
  if (event.key === 'ArrowRight' || event.key === ' ') goTo(current + 1);
  if (event.key === 'ArrowLeft') goTo(current - 1);
});
window.addEventListener('hashchange', startFromHash);

loadSections();
