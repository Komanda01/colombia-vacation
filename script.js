// ── SCROLL-TRIGGERED FADE-IN FOR WELCOME & CARDS SECTIONS ──
// Select all elements we want to animate on scroll
const revealTargets = document.querySelectorAll(
    '.welcome, .welcome h2, .welcome-text, .cards-section, .card'
);

// Add the hidden starting state to each target
revealTargets.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
});

// IntersectionObserver watches when elements enter the viewport
const observer = new IntersectionObserver (
    (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation delay for each card
                const delay = entry.target.classList.contains("card") ? index * 80 : 0;

                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, delay);

                // Once revealed, stop observing that element
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12, // Trigger when 12% of the element is visible
        rootMargin:"0px 0px -40px 0px" // Trigger slightly before the element fully enters
    }
);

// Attach observer to each target
revealTargets.forEach(el => observer.observe(el));

// ── NAV ACTIVE STATE ──
// Highlight the nav link matching the current page
const navLinks = document.querySelectorAll(".nav-inner a");
const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
        link.style.color = "var(--gold)"; // Gold colour for the active page
        link.style.borderBottom = "2px solid var(--gold)";
    }
});

// ── HERO PARALLAX ──
// As the user scrolls, the hero content shifts slightly upward
// creating a parallax depth effect
const heroContent = document.querySelector(".hero-content");

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Skip parallax entirely on mobile — CSS handles layout there
    if (window.innerWidth <= 768) return;

    // Only apply effect while the hero is still in view
    if (scrollY < window.innerHeight) {
        // Moves content up at half the scroll speed
        heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
        // Fades out as you scroll away
        heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.7);
    }
})
