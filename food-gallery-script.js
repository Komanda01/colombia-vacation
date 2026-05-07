// ══════════════════════════════════════
// SCROLL REVEAL
// Identical pattern to all previous pages
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
      /*
        Gallery items get a stagger of 60ms each.
        With 12 items that means a cascade from 0ms to 660ms total.
        60ms (vs 80ms on index cards, 120ms on photo panels) is faster
        because there are more items — a slower stagger would feel sluggish
        by the time item 12 finally appears.
      */
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

// Get references to all the lightbox DOM elements we'll need to control
const items         = document.querySelectorAll('.gallery-item');
const lightbox      = document.getElementById('lightbox');
const lightboxImgWrap = document.getElementById('lightboxImgWrap');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxNum   = document.getElementById('lightboxNum');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

/*
  Build a data array from the gallery HTML.
  Rather than hardcoding captions in the script, we read them
  directly from the DOM — this way the HTML is the single
  source of truth for all image data.
*/
const galleryData = Array.from(items).map(item => ({
  src:     item.getAttribute('href'),
  alt:     item.querySelector('img')
             ? item.querySelector('img').getAttribute('alt')
             : '',
  caption: item.querySelector('.overlay-caption').textContent,
  number:  item.querySelector('.overlay-number').textContent
}));

// Tracks which image is currently open in the lightbox
let currentIndex = 0;

// ── OPEN ──
function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden'; // Prevent page scrolling behind lightbox
}

// ── CLOSE ──
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = ''; // Restore page scrolling
}

// ── RENDER ──
/*
  Builds the lightbox content for the current index.
  Called every time the user opens a new image or navigates
  between images with the arrows.
*/
function renderLightbox() {
  const data = galleryData[currentIndex];

  /*
    Clear the image wrap but keep the corner accent elements.
    We store references to the corners first, clear innerHTML,
    then put the corners back in before adding the new image.
  */
  const corners = lightboxImgWrap.querySelectorAll('.lb-corner');
  lightboxImgWrap.innerHTML = '';
  corners.forEach(c => lightboxImgWrap.appendChild(c));

  /*
    Attempt to load the real image.
    onerror handles the case where the image file doesn't exist —
    removes the broken img element and inserts a placeholder div instead.
  */
  const img = document.createElement('img');
  img.src = data.src;
  img.alt = data.alt;
  img.onerror = function() {
    this.remove();
    const placeholder = document.createElement('div');
    placeholder.className = 'lightbox-placeholder';
    placeholder.innerHTML = `<span class="placeholder-icon">🍽️</span>`;
    lightboxImgWrap.appendChild(placeholder);
  };
  lightboxImgWrap.appendChild(img);

  // Update the caption text and number
  lightboxNum.textContent     = data.number;
  lightboxCaption.textContent = data.caption;
}

// ── NAVIGATE ──
function showPrev() {
  /*
    The % (modulo) operator wraps the index around.
    If currentIndex is 0 and we go back, we want index 11 (last item).
    (0 - 1 + 12) % 12 = 11 ✓

    Without the + galleryData.length, negative modulo in JavaScript
    would return a negative number, causing an array access error.
  */
  currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
  renderLightbox();
}

function showNext() {
  /*
    Going forward wraps from the last item back to the first.
    (11 + 1) % 12 = 0 ✓
  */
  currentIndex = (currentIndex + 1) % galleryData.length;
  renderLightbox();
}

// ── EVENT LISTENERS ──

// Each gallery item opens the lightbox at its index
items.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    e.preventDefault(); // Stops the browser navigating to the image file URL
    openLightbox(index);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

/*
  Close lightbox when clicking the dark backdrop.
  e.target is the element that was actually clicked.
  If it's the lightbox div itself (not any child inside it),
  the user clicked outside the image — so we close.
*/
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/*
  Keyboard navigation — only active when lightbox is open.
  The guard at the top (if !lightbox.classList.contains('open') return)
  means key presses have no effect when the lightbox is closed,
  so normal page keyboard shortcuts still work.
*/
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});


// ══════════════════════════════════════
// NAV ACTIVE STATE
// ══════════════════════════════════════

const navLinks   = document.querySelectorAll('.nav-inner a');
const currentPage = window.location.pathname.split('/').pop();

navLinks.forEach(link => {
  link.classList.remove('active');
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});