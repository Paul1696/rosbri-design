/**
 * ROSBRI DESIGN - Unified Search Engine
 * Intercepts header & mobile search submissions, redirects to boutique.html?recherche=...
 * and filters products automatically across all fields (title, category, subcategory, description, slug).
 */
(function () {
  function handleSearchSubmit(event) {
    const form = event.target.closest("form");
    if (!form) return;
    const input = form.querySelector("input[name='recherche'], input[name='q']");
    if (!input || !input.value.trim()) return;

    // If already on boutique.html, let catalog.js handle live filtering
    if (window.location.pathname.includes("boutique.html")) {
      const query = input.value.trim();
      const params = new URLSearchParams(window.location.search);
      params.set("recherche", query);
      window.history.pushState({}, "", `boutique.html?${params.toString()}`);
      if (window.ROSBriCatalogApi) {
        document.dispatchEvent(new CustomEvent("catalog:search", { detail: { query } }));
      }
    } else {
      event.preventDefault();
      const query = encodeURIComponent(input.value.trim());
      window.location.href = `boutique.html?recherche=${query}`;
    }
  }

  document.addEventListener("submit", (event) => {
    if (event.target.matches("#header-search-form, form[action*='boutique.html']")) {
      handleSearchSubmit(event);
    }
  });
})();
