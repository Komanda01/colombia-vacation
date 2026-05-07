// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════

const revealTargets = document.querySelectorAll(
  '.intro, .gallery-count, .gallery-item, .bottom-strip'
);

revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // 14 items × 60ms = 840ms total cascade
      const delay = entry.target.classList.contains('gallery-item')
        ? index * 60
        : 0;

      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -30px 0px'
});

revealTargets.forEach(el => revealObserver.observe(el));


// ══════════════════════════════════════
// LIGHTBOX
// ══════════════════════════════════════

const items           = document.querySelectorAll('.gallery-item');
const lightbox        = document.getElementById('lightbox');
const lightboxImgWrap = document.getElementById('lightboxImgWrap');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxNum     = document.getElementById('lightboxNum');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');

// Build data array by reading directly from the DOM
const galleryData = Array.from(items).map(item => ({
  src:     item.getAttribute('href'),
  alt:     item.querySelector('img')
             ? item.querySelector('img').getAttribute('alt')
             : '',
  caption: item.querySelector('.overlay-caption').textContent,
  number:  item.querySelector('.overlay-number').textContent
}));

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const data = galleryData[currentIndex];

  // Preserve corner accents while clearing image content
  const corners = lightboxImgWrap.querySelectorAll('.lb-corner');
  lightboxImgWrap.innerHTML = '';
  corners.forEach(c => lightboxImgWrap.appendChild(c));

  // Create and inject the image — fall back to placeholder on error
  const img = document.createElement('img');
  img.src = data.src;
  img.alt = data.alt;
  img.onerror = function() {
    this.remove();
    const placeholder = document.createElement('div');
    placeholder.className = 'lightbox-placeholder';
    placeholder.innerHTML = `<span class="placeholder-icon">🏔️</span>`;
    lightboxImgWrap.appendChild(placeholder);
  };
  lightboxImgWrap.appendChild(img);

  lightboxNum.textContent     = data.number;
  lightboxCaption.textContent = data.caption;
}

function showPrev() {
  // Wrap backwards — from item 0 goes to item 13 (last)
  currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
  renderLightbox();
}

function showNext() {
  // Wrap forwards — from item 13 goes back to item 0 (first)
  currentIndex = (currentIndex + 1) % galleryData.length;
  renderLightbox();
}

// Click handlers
items.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    openLightbox(index);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});


// ══════════════════════════════════════
// NAV ACTIVE STATE
// ══════════════════════════════════════

const navLinks    = document.querySelectorAll('.nav-inner a');
const currentPage = window.location.pathname.split('/').pop();

navLinks.forEach(link => {
  link.classList.remove('active');
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});