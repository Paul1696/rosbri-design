/**
 * ROSBRI DESIGN - Unified Search Engine
 * Intercepts header & mobile search submissions, redirects to boutique.html?recherche=...
 * and filters products automatically across all fields (title, category, subcategory, description, slug, keywords)
 * with accent, case, hyphen and spacing normalization.
 */
(function () {
  function normalizeSearchText(str) {
    return String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function handleSearchSubmit(event) {
    const form = event.target.closest("form");
    if (!form) return;
    const input = form.querySelector("input[name='recherche'], input[name='q'], #header-search-input");
    if (!input || !input.value.trim()) return;

    const query = input.value.trim();

    // If already on boutique.html, update URL and dispatch event for catalog.js
    if (window.location.pathname.includes("boutique.html")) {
      event.preventDefault();
      const params = new URLSearchParams(window.location.search);
      params.set("recherche", query);
      window.history.pushState({}, "", `boutique.html?${params.toString()}`);
      
      const catalogInput = document.getElementById("catalog-search");
      if (catalogInput) catalogInput.value = query;

      document.dispatchEvent(new CustomEvent("catalog:search", { detail: { query } }));
    } else {
      event.preventDefault();
      const encoded = encodeURIComponent(query);
      window.location.href = `boutique.html?recherche=${encoded}`;
    }
  }

  document.addEventListener("submit", (event) => {
    if (event.target.matches("#header-search-form, form[action*='boutique.html']")) {
      handleSearchSubmit(event);
    }
  });

  window.normalizeSearchText = normalizeSearchText;
})();
