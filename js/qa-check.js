/**
 * ROSBRI DESIGN - Automated QA Diagnostic Script
 * Checks DOM integrity, duplicate elements, broken links, accessibility attributes, and missing data attributes.
 */
(function () {
  function runQaDiagnostics() {
    console.group("🔍 ROSBRI DESIGN - QA Diagnostics");

    // 1. Check Mount Points
    const requiredMounts = ["site-announcement", "site-header", "main-content", "site-footer", "site-mobile-menu", "site-cart-drawer"];
    requiredMounts.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) {
        console.warn(`[QA Warning] Point de montage absent: #${id}`);
      }
    });

    // 2. Check Duplicates
    const headers = document.querySelectorAll("header");
    if (headers.length > 1) console.warn(`[QA Warning] Plusieurs headers trouvés (${headers.length})`);

    const footers = document.querySelectorAll("footer");
    if (footers.length > 1) console.warn(`[QA Warning] Plusieurs footers trouvés (${footers.length})`);

    const announcements = document.querySelectorAll("#rosbri-announcement-bar, #announcement-bar");
    if (announcements.length > 1) console.warn(`[QA Warning] Plusieurs barres promotionnelles trouvées (${announcements.length})`);

    const carts = document.querySelectorAll("#cart-drawer, .cart-drawer");
    if (carts.length > 1) console.warn(`[QA Warning] Plusieurs drawers de panier trouvés (${carts.length})`);

    // 3. Check Links
    const emptyLinks = document.querySelectorAll('a[href="#"]');
    if (emptyLinks.length > 0) {
      console.warn(`[QA Warning] ${emptyLinks.length} lien(s) avec href="#" trouvé(s).`);
    }

    const wameLinks = document.querySelectorAll('a[href*="wa.me"]');
    wameLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href.includes("wa.me/#") || href.includes("wa.me/237690087213")) {
        console.warn(`[QA Warning] Lien WhatsApp obsolète ou incomplet: ${href}`, link);
      }
    });

    // 4. Check Product Cards
    const cards = document.querySelectorAll(".product-card");
    cards.forEach((card) => {
      const slug = card.dataset.slug || card.dataset.productSlug || card.getAttribute("href");
      if (!slug) {
        console.warn("[QA Warning] Carte produit sans slug ou href:", card);
      }
    });

    // 5. Check Accessibility Attributes
    const iconButtons = document.querySelectorAll("button:not([aria-label])");
    iconButtons.forEach((btn) => {
      if (!btn.textContent.trim()) {
        console.warn("[QA Warning] Bouton d'icône sans aria-label:", btn);
      }
    });

    console.log("✅ Diagnostic QA terminé. Aucun problème bloquant détecté.");
    console.groupEnd();
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(runQaDiagnostics, 1500);
  });
})();
