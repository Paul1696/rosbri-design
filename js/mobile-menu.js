/**
 * ROSBRI DESIGN - Accessible Mobile Drawer Handler
 * Controls opening, closing, overlay backdrop, ESC key handling, and body scroll locking.
 */
(function () {
  function initMobileMenu() {
    const menuDrawer = document.getElementById("mobile-menu");
    const backdrop = document.querySelector("[data-close-mobile-menu]");

    function openMenu() {
      if (!menuDrawer) return;
      menuDrawer.classList.remove("hidden");
      menuDrawer.style.display = "block";
      document.body.classList.add("overflow-hidden");
      const button = document.querySelector("[data-toggle-mobile-menu]");
      if (button) button.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      if (!menuDrawer) return;
      menuDrawer.classList.add("hidden");
      menuDrawer.style.display = "none";
      document.body.classList.remove("overflow-hidden");
      const button = document.querySelector("[data-toggle-mobile-menu]");
      if (button) button.setAttribute("aria-expanded", "false");
    }

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-toggle-mobile-menu]")) {
        openMenu();
      } else if (event.target.closest("[data-close-mobile-menu]") || (menuDrawer && event.target === menuDrawer)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuDrawer && !menuDrawer.classList.contains("hidden")) {
        closeMenu();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initMobileMenu);
  document.addEventListener("components:loaded", initMobileMenu);
})();
