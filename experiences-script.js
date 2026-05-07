// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════

/*
  Targets four types of elements:
  .intro         — the intro text section
  .stories-label — the "13 Stories" counter label
  .story-card    — each of the 13 story cards
  .closing-note  — the final sign-off section
  .bottom-strip  — the decorative strip before the footer
*/
const revealTargets = document.querySelectorAll(
  '.intro, .stories-label, .story-card, .closing-note, .bottom-strip'
);

// Phase 1 — hide all targets on page load
revealTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
});

// Phase 2 — watch for elements entering the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      /*
        Story cards get an 80ms stagger.
        13 cards × 80ms = up to 1040ms total spread.

        This is between the gallery items (60ms) and
        video cards (100ms) — story cards are taller than
        gallery items but shorter than full video players,
        so 80ms feels appropriately paced.

        As the user scrolls, only the cards currently
        entering the viewport are in `entries` — the
        IntersectionObserver fires in batches as elements
        cross the threshold. This means the stagger applies
        naturally within each visible batch rather than
        delaying the 13th card by a full second.
      */
      const delay = entry.target.classList.contains('story-card')
        ? index * 80
        : 0;

      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);

      // Stop observing once revealed — each card animates once only
      observer.unobserve(entry.target);
    }
  });
}, {
  /*
    threshold: 0.06 — fires when 6% of the element is visible.
    Lower than other pages (0.08–0.12) because story cards can
    be quite tall on mobile — a higher threshold might not fire
    until the user has already scrolled well past the top of the card.
  */
  threshold: 0.06,
  rootMargin: '0px 0px -30px 0px'
});

// Phase 3 — register all targets with the observer
revealTargets.forEach(el => observer.observe(el));


// ══════════════════════════════════════
// NAV ACTIVE STATE
// ══════════════════════════════════════

/*
  Dynamically highlights the current page's nav link.
  Although class="active" is already hardcoded on the
  Stories link in the HTML, this JavaScript version
  handles it dynamically for robustness — useful if the
  script is reused or the HTML is ever updated.
*/
const navLinks    = document.querySelectorAll('.nav-inner a');
const currentPage = window.location.pathname.split('/').pop();

navLinks.forEach(link => {
  link.classList.remove('active');
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});