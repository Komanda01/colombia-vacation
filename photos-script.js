// SCROLL-TRIGGERED REVEAL
/*
  Select the elements to animate on scroll.
  Three types of targets here:
  - .gallery-label  — the "Choose a Collection" label
  - .category-panel — the Food and Sights panels
  - .bottom-strip   — the decorative strip before the footer
*/
const revealTargets = document.querySelectorAll(".gallery-label, .category-panel, .bottom-strip");

/*
  Phase 1 — Hide all targets immediately on page load.
  Same three-property setup as the index page:
  opacity hides them, translateY shifts them down,
  transition defines how they'll animate back in.
*/
revealTargets.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = "opacity 0.7 ease, transform 0.7s ease";
});

/*
  Phase 2 — IntersectionObserver watches for elements
  entering the viewport and triggers the reveal.
*/
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            /*
        Stagger delay — only applied to category panels.
        The two panels reveal one after the other rather
        than both appearing simultaneously.

        Panel 0 (Food):   0  × 120 =   0ms — appears immediately
        Panel 1 (Sights): 1  × 120 = 120ms — appears 120ms later

        120ms (vs 80ms on index cards) is slightly longer because
        these are large, dramatic panels — a slower stagger feels
        more intentional and cinematic.
      */
     const delay = entry.target.classList.contains(".category-panel") ? index * 120 : 0;
     setTimeout(() => {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
     }, delay);
     // Stop watching once revealed — each panel only animates once
     observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1, // Fire when 10% of element is visible
    rootMargin: "0px 0px -40px 0px" // Trigger 40px before bottom edge
});

// Phase 3 — Register every target with the observer
revealTargets.forEach(el => observer.observe(el));

// NAV ACTIVE STATE
/*
  Although the Photos link already has class="active" hardcoded
  in the HTML, this JavaScript version handles the active state
  dynamically. This is useful if you reuse this script across
  multiple pages — it will always highlight the correct link
  based on the actual URL rather than relying on manual HTML edits.
*/

const navLinks = document.querySelectorAll(".nav-inner a");
const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {
    //Remove any hardcoded active class first
    link.classList.remove("active");

    // Then re-add it only to the link matching the current URL
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
})
