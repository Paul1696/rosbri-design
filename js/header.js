/**
 * ROSBRI DESIGN - Header & Navigation Interaction Engine
 * Manages active page links, mobile menu drawer, announcement bar sessionStorage, and search redirects.
 */
(function () {
  function initHeader() {
    // 1. Highlight Active Nav Link
    const fullPath = window.location.pathname.split("/").pop() || "index.html";
    const searchParams = new URLSearchParams(window.location.search);
    const categoryParam = searchParams.get("categorie") || "";

    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const target = link.dataset.navLink;
      let isActive = false;

      link.classList.remove("active");
      link.removeAttribute("aria-current");

      if (categoryParam.toLowerCase().includes("entreprise") || categoryParam.toLowerCase().includes("b2b")) {
        if (target === "b2b") isActive = true;
      } else if (fullPath === "produit.html") {
        if (target === "boutique.html") isActive = true;
      } else if (fullPath === target || (fullPath === "" && target === "index.html") || (fullPath === "/" && target === "index.html")) {
        isActive = true;
      }

      if (isActive) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    // 2. Announcement Bar Session Storage Check
    const bar = document.getElementById("rosbri-announcement-bar") || document.getElementById("announcement-bar");
    const closeBarBtn = document.getElementById("close-announcement-bar") || document.getElementById("announcement-bar-close");
    if (bar) {
      if (sessionStorage.getItem("rosbri_announcement_closed") === "true") {
        bar.style.display = "none";
      } else if (closeBarBtn) {
        closeBarBtn.addEventListener("click", () => {
          bar.style.display = "none";
          sessionStorage.setItem("rosbri_announcement_closed", "true");
        });
      }
    }

    // 3. Mobile Menu Toggle Logic
    const drawer = document.getElementById("mobile-menu-drawer") || document.getElementById("mobile-menu");
    const panel = document.getElementById("mobile-menu-panel");

    function openMobileMenu() {
      if (!drawer) return;
      drawer.style.display = "block";
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        drawer.classList.remove("pointer-events-none", "opacity-0");
        drawer.classList.add("opacity-100");
        if (panel) {
          panel.classList.remove("translate-x-full");
          panel.classList.add("translate-x-0");
        }
        drawer.setAttribute("aria-hidden", "false");
      }, 10);
    }

    function closeMobileMenu() {
      if (!drawer) return;
      if (panel) {
        panel.classList.remove("translate-x-0");
        panel.classList.add("translate-x-full");
      }
      drawer.classList.remove("opacity-100");
      drawer.classList.add("opacity-0");
      drawer.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        drawer.style.display = "none";
        drawer.classList.add("pointer-events-none");
        document.body.style.overflow = "";
      }, 300);
    }

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-toggle-mobile-menu]")) {
        openMobileMenu();
      }
      if (event.target.closest("[data-close-mobile-menu]")) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer && drawer.style.display !== "none") {
        closeMobileMenu();
      }
    });

    // 4. Pre-fill Search Input if query exists in URL
    const query = searchParams.get("recherche") || searchParams.get("q");
    if (query) {
      document.querySelectorAll("#header-search-input, input[name='recherche']").forEach((input) => {
        input.value = query;
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initHeader);
  document.addEventListener("components:loaded", initHeader);
  document.addEventListener("rosbri:components-loaded", initHeader);
})();
