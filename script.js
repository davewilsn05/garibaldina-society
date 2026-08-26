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

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const viewport = carousel.querySelector("[data-carousel-viewport]");
  const track = carousel.querySelector(".instagram-track");
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const previousButton = carousel.querySelector("[data-carousel-previous]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const currentLabel = carousel.querySelector("[data-carousel-current]");
  const totalLabel = carousel.querySelector("[data-carousel-total]");
  const progressBar = carousel.querySelector("[data-carousel-progress]");
  let activeIndex = 0;
  let carouselFrame;

  const formatSlideNumber = (value) => String(value).padStart(2, "0");

  const getNearestSlideIndex = () => {
    if (!viewport || !track || !slides.length) return 0;
    const trackPadding = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;

    return slides.reduce(
      (nearest, slide, index) => {
        const targetLeft = slide.offsetLeft - track.offsetLeft - trackPadding;
        const distance = Math.abs(targetLeft - viewport.scrollLeft);
        return distance < nearest.distance ? { index, distance } : nearest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;
  };

  const updateCarousel = (index) => {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    if (currentLabel) currentLabel.textContent = formatSlideNumber(activeIndex + 1);
    if (totalLabel) totalLabel.textContent = formatSlideNumber(slides.length);
    if (progressBar) {
      progressBar.style.transform = `scaleX(${(activeIndex + 1) / slides.length})`;
    }
    const maxScroll = viewport ? viewport.scrollWidth - viewport.clientWidth : 0;
    if (previousButton) previousButton.disabled = !viewport || viewport.scrollLeft <= 1;
    if (nextButton) nextButton.disabled = !viewport || viewport.scrollLeft >= maxScroll - 1;
  };

  const scrollToSlide = (index) => {
    if (!viewport || !track || !slides.length) return;
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const trackPadding = Number.parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const targetLeft = slides[nextIndex].offsetLeft - track.offsetLeft - trackPadding;
    viewport.scrollTo({ left: targetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    updateCarousel(nextIndex);
  };

  previousButton?.addEventListener("click", () => scrollToSlide(activeIndex - 1));
  nextButton?.addEventListener("click", () => scrollToSlide(activeIndex + 1));

  viewport?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollToSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  });

  viewport?.addEventListener(
    "scroll",
    () => {
      if (carouselFrame) window.cancelAnimationFrame(carouselFrame);
      carouselFrame = window.requestAnimationFrame(() => {
        updateCarousel(getNearestSlideIndex());
      });
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    updateCarousel(getNearestSlideIndex());
  });

  updateCarousel(0);
}
