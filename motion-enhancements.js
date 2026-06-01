const motionSource = "https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function markReady() {
  document.documentElement.classList.add("motion-ready");
}

function restoreVisibility() {
  document.querySelectorAll("[data-reveal], .product-card, .trust-pill, .universe, .benefit, .filters, .shop-toolbar").forEach((element) => {
    element.style.opacity = "";
    element.style.transform = "";
  });
}

if (reducedMotion) {
  markReady();
  restoreVisibility();
} else {
  const runWhenIdle = (callback) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 1800 });
    } else {
      window.setTimeout(callback, 400);
    }
  };

  const startMotion = () => import(motionSource)
    .then(({ animate, scroll, stagger }) => {
      markReady();

      document.querySelectorAll("[data-reveal], .trust-pill, .universe, .benefit, .filters, .shop-toolbar").forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(18px)";
      });

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealObserver.unobserve(entry.target);
          animate(entry.target, { opacity: 1, y: 0 }, { duration: 0.55, easing: [0.16, 1, 0.3, 1] });
        });
      }, { rootMargin: "0px 0px -10% 0px" });

      document.querySelectorAll("[data-reveal], .trust-pill, .universe, .benefit, .filters, .shop-toolbar").forEach((element) => {
        revealObserver.observe(element);
      });

      const hero = document.querySelector(".hero");
      const heroContent = document.querySelector(".hero-content");
      const heroShowcase = document.querySelector(".hero-showcase");
      if (hero && heroContent && heroShowcase) {
        animate(heroContent, { opacity: [0, 1], y: [22, 0] }, { duration: 0.7, easing: [0.16, 1, 0.3, 1] });
        animate(heroShowcase, { opacity: [0, 1], scale: [0.97, 1] }, { duration: 0.8, delay: 0.12, easing: [0.16, 1, 0.3, 1] });
        scroll(animate(heroShowcase, { y: [0, -36] }, { ease: "linear" }), { target: hero, offset: ["start start", "end start"] });
      }

      function animateCards(scope = document) {
        const cards = scope.querySelectorAll(".product-card");
        if (!cards.length) return;
        cards.forEach((card) => {
          card.style.opacity = "0";
          card.style.transform = "translateY(16px)";
        });
        animate(cards, { opacity: 1, y: 0 }, { delay: stagger(0.035), duration: 0.38, easing: [0.16, 1, 0.3, 1] });
      }

      document.addEventListener("catalog:render", (event) => {
        animateCards(event.detail?.target || document);
      });

      document.addEventListener("catalog:lightbox-open", () => {
        const panel = document.querySelector(".lightbox-panel");
        if (panel) {
          animate(panel, { opacity: [0, 1], scale: [0.96, 1], y: [18, 0] }, { duration: 0.28, easing: [0.16, 1, 0.3, 1] });
        }
      });

      document.addEventListener("pointerdown", (event) => {
        const target = event.target.closest(".primary-btn, .ghost-btn, .secondary-btn, .mini-order, .filter-btn, .brand");
        if (target) animate(target, { scale: 0.97 }, { duration: 0.12 });
      });

      document.addEventListener("pointerup", (event) => {
        const target = event.target.closest(".primary-btn, .ghost-btn, .secondary-btn, .mini-order, .filter-btn, .brand");
        if (target) animate(target, { scale: 1 }, { duration: 0.16, easing: "ease-out" });
      });

      animateCards();
    })
    .catch(() => {
      document.documentElement.classList.add("motion-unavailable");
      restoreVisibility();
    });

  if (document.readyState === "complete") {
    runWhenIdle(startMotion);
  } else {
    window.addEventListener("load", () => runWhenIdle(startMotion), { once: true });
  }
}
