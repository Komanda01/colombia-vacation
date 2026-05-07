// ══════════════════════════════════════
// SCROLL REVEAL
// Identical pattern to all previous pages
// ══════════════════════════════════════

const revealTargets = document.querySelectorAll(
  '.videos-label, .video-card, .note-section, .bottom-strip'
);

revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      /*
        Video cards get a 100ms stagger — slightly longer than
        gallery items (60ms) because cards are much taller and
        a slower cascade feels more deliberate and cinematic.
        Three cards at 100ms = 0ms, 100ms, 200ms total spread.
      */
      const delay = entry.target.classList.contains('video-card')
        ? index * 100
        : 0;

      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

revealTargets.forEach(el => observer.observe(el));


// ══════════════════════════════════════
// VIDEO PLACEHOLDER LOGIC
// ══════════════════════════════════════

/*
  Videos behave differently to images when files are missing.

  With images, onerror fires immediately when the file isn't found.
  With videos, the browser loads them asynchronously and fires
  different events at different stages of loading.

  We need to listen for multiple events to handle all cases:

  loadedmetadata → browser got enough data to know duration/dimensions
  canplay        → browser has enough data to start playing
  error          → the video file couldn't be loaded at all

  The placeholder is shown by default (CSS display: flex).
  It gets hidden when the video successfully loads.
  It stays visible when the video errors.
*/

document.querySelectorAll('.video-ratio').forEach(wrapper => {
  const video       = wrapper.querySelector('video');
  const placeholder = wrapper.querySelector('.video-placeholder');

  if (!video || !placeholder) return; /* Safety check */

  /*
    Hide placeholder when video loads successfully.
    Both events do the same thing — we listen to both because
    different browsers fire them at different times.
    loadedmetadata fires first (just dimensions and duration),
    canplay fires once there's enough data to actually play.
    Whichever fires first will hide the placeholder.
  */
  function hidePlaceholder() {
    placeholder.style.display = 'none';
  }

  video.addEventListener('loadedmetadata', hidePlaceholder);
  video.addEventListener('canplay', hidePlaceholder);

  /*
    Show placeholder (and hide video) when video fails to load.
    This fires when the file is missing, the format is unsupported,
    or the server returns an error.
  */
  video.addEventListener('error', () => {
    video.style.display = 'none'; /* Remove broken video element */
    placeholder.style.display = 'flex'; /* Show placeholder */
  });

  /*
    Edge case: if the video src is empty or missing entirely,
    the error event may not fire. We check immediately whether
    the video has a valid source to handle this case.
  */
  const source = video.querySelector('source');
  if (!source || !source.getAttribute('src')) {
    video.style.display = 'none';
    placeholder.style.display = 'flex';
  }
});


// ══════════════════════════════════════
// NAV ACTIVE STATE
// ══════════════════════════════════════

/*
  Dynamically highlights the current page's nav link.
  Although class="active" is already hardcoded on the Videos
  link in the HTML, this JavaScript version handles it
  dynamically — useful if this script is reused across pages.
*/
const navLinks    = document.querySelectorAll('.nav-inner a');
const currentPage = window.location.pathname.split('/').pop();

navLinks.forEach(link => {
  link.classList.remove('active');
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});