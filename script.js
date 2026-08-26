document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setMenu(open) {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", open);
  header?.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigation?.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (link) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 36);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-35% 0px -52%", threshold: [0.05, 0.3, 0.65] },
  );

  trackedSections.forEach((section) => navObserver.observe(section));
}

if (!reduceMotion) {
  const hero = document.querySelector(".hero");
  let queued = false;

  const updateHeroParallax = () => {
    const offset = Math.min(window.scrollY * 0.11, 74);
    hero?.style.setProperty("--hero-shift", `${offset}px`);
    queued = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (queued || window.scrollY > window.innerHeight * 1.2) return;
      queued = true;
      window.requestAnimationFrame(updateHeroParallax);
    },
    { passive: true },
  );
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
