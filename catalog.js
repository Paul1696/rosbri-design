(function () {
  const SITE_URL = "https://rosbridesign.ateliersdepaul.com/";
  const catalog = window.ROSBriCatalog || [];
  const categories = ["Tous", "Heritage", "Anime", "Maman", "Customisation", "Sacs", "Accessoires", "Disponibles"];
  const labels = {
    Tous: "Tous les articles",
    Heritage: "Héritage & Culture",
    Anime: "Anime & Pop Culture",
    Maman: "Maman & Famille",
    Customisation: "Customisation",
    Sacs: "Sacs à main",
    Accessoires: "Accessoires",
    Disponibles: "Disponibles maintenant"
  };

  const state = {
    category: "Tous",
    query: "",
    sort: "default",
    visibleLimit: 24
  };
  const pageSize = 24;
  const categoryCounts = catalog.reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {});
  const searchIndex = new Map(catalog.map((item) => [
    item.id,
    `${displayTitle(item)} ${labels[item.category]} ${item.title} ${item.category} ${item.price}`.toLowerCase()
  ]));

  function byId(id) {
    return document.getElementById(id);
  }

  function announceRender(target) {
    document.dispatchEvent(new CustomEvent("catalog:render", { detail: { target } }));
  }

  function displayTitle(item) {
    return item.title || labels[item.category] || "Article personnalisé";
  }

  function orderUrl(item) {
    const productUrl = `${SITE_URL}boutique.html#article-${item.id}`;
    const message = `Bonjour ROSBRI DESIGN, je suis intéressé par ${displayTitle(item)} (${item.price}). Lien: ${productUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  function productCard(item, compact, eager) {
    const title = displayTitle(item);
    const loading = eager ? "eager" : "lazy";
    const priority = eager ? " fetchpriority=\"high\"" : "";
    return `
      <article class="product-card" id="article-${item.id}" data-category="${item.category}">
        <button class="product-media" type="button" data-open-product="${item.id}" aria-label="Voir ${title}">
          <img src="${item.image}" alt="${title}" loading="${loading}" decoding="async"${priority}>
          <span class="tag">${labels[item.category] || item.category}</span>
        </button>
        <div class="product-body">
          <h3>${title}</h3>
          <div class="product-meta">
            <span>${compact ? "Création ROSBRI" : labels[item.category]}</span>
            <span class="price">${item.price}</span>
          </div>
          <div class="product-actions">
            <button class="secondary-btn" type="button" data-open-product="${item.id}">Aperçu</button>
            <a class="mini-order" href="${orderUrl(item)}">Commander</a>
          </div>
        </div>
      </article>
    `;
  }

  function emptyCard() {
    return `
      <article class="product-card product-empty">
        <div class="product-body">
          <h3>Aucun article trouvé</h3>
          <p>Essayez une autre catégorie ou un autre mot-clé.</p>
        </div>
      </article>
    `;
  }

  function filteredCatalog() {
    const query = state.query.trim().toLowerCase();
    let result = catalog.filter((item) => {
      const categoryMatch = state.category === "Tous" || item.category === state.category;
      const queryMatch = !query || (searchIndex.get(item.id) || "").includes(query);
      return categoryMatch && queryMatch;
    });

    if (state.sort === "name") {
      result = result.slice().sort((a, b) => displayTitle(a).localeCompare(displayTitle(b)));
    }

    if (state.sort === "category") {
      result = result.slice().sort((a, b) => a.category.localeCompare(b.category) || a.id - b.id);
    }

    return result;
  }

  function renderFeatured() {
    const target = byId("featured-grid");
    if (!target) return;

    const picks = [
      ...catalog.filter((item) => item.category === "Heritage").slice(0, 3),
      ...catalog.filter((item) => item.category === "Anime").slice(0, 1),
      ...catalog.filter((item) => item.category === "Maman").slice(0, 2),
      ...catalog.filter((item) => item.category === "Customisation").slice(0, 1),
      ...catalog.filter((item) => item.category === "Sacs").slice(0, 1)
    ];

    target.innerHTML = picks.map((item, index) => productCard(item, true, index < 4)).join("");
    announceRender(target);
  }

  function updateLoadMore(total) {
    const button = byId("catalog-load-more");
    if (!button) return;

    const remaining = total - state.visibleLimit;
    button.hidden = remaining <= 0;
    button.textContent = remaining > pageSize
      ? `Afficher ${pageSize} articles de plus`
      : `Afficher les ${remaining} derniers articles`;
  }

  function renderShop() {
    const grid = byId("shop-grid");
    if (!grid) return;

    const result = filteredCatalog();
    const visible = result.slice(0, state.visibleLimit);
    grid.innerHTML = visible.length
      ? visible.map((item, index) => productCard(item, false, index < 8)).join("")
      : emptyCard();
    announceRender(grid);
    updateLoadMore(result.length);

    const count = byId("result-count");
    if (count) {
      count.textContent = `${visible.length} article${visible.length > 1 ? "s" : ""} affiché${visible.length > 1 ? "s" : ""} sur ${result.length}`;
    }
  }

  function renderFilters() {
    const target = byId("filter-list");
    if (!target) return;

    target.innerHTML = categories.map((category) => {
      const count = category === "Tous" ? catalog.length : (categoryCounts[category] || 0);
      return `<button class="filter-btn${category === state.category ? " active" : ""}" type="button" data-category="${category}">${labels[category]} (${count})</button>`;
    }).join("");
  }

  function resetVisibleLimit() {
    state.visibleLimit = pageSize;
  }

  function openProduct(id) {
    const item = catalog.find((entry) => String(entry.id) === String(id));
    const lightbox = byId("lightbox");
    if (!item || !lightbox) return;

    byId("lightbox-image").src = item.image;
    byId("lightbox-image").alt = displayTitle(item);
    byId("lightbox-title").textContent = displayTitle(item);
    byId("lightbox-meta").textContent = `${labels[item.category]} - ${item.price}`;
    const order = byId("lightbox-order");
    if (order) {
      order.href = orderUrl(item);
      order.textContent = `Commander ${displayTitle(item)}`;
    }
    lightbox.classList.add("open");
    document.dispatchEvent(new CustomEvent("catalog:lightbox-open", { detail: { item } }));
    document.body.style.overflow = "hidden";
  }

  function closeProduct() {
    const lightbox = byId("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.dispatchEvent(new CustomEvent("catalog:lightbox-close"));
    document.body.style.overflow = "";
  }

  function bindEvents() {
    const navToggle = byId("nav-toggle");
    const navLinks = byId("nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    document.addEventListener("click", (event) => {
      const categoryButton = event.target.closest("[data-category]");
      if (categoryButton && categoryButton.classList.contains("filter-btn")) {
        state.category = categoryButton.dataset.category;
        resetVisibleLimit();
        renderFilters();
        renderShop();
      }

      const openButton = event.target.closest("[data-open-product]");
      if (openButton) {
        openProduct(openButton.dataset.openProduct);
      }

      if (event.target.closest("[data-close-lightbox]")) {
        closeProduct();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeProduct();
    });

    const search = byId("catalog-search");
    if (search) {
      let searchTimer;
      search.addEventListener("input", (event) => {
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(() => {
          state.query = event.target.value;
          resetVisibleLimit();
          renderShop();
        }, 120);
      });
    }

    const sort = byId("catalog-sort");
    if (sort) {
      sort.addEventListener("change", (event) => {
        state.sort = event.target.value;
        resetVisibleLimit();
        renderShop();
      });
    }

    const loadMore = byId("catalog-load-more");
    if (loadMore) {
      loadMore.addEventListener("click", () => {
        state.visibleLimit += pageSize;
        renderShop();
      });
    }
  }

  function updateCounts() {
    document.querySelectorAll("[data-catalog-count]").forEach((node) => {
      node.textContent = catalog.length;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCounts();
    renderFeatured();
    renderFilters();
    renderShop();
    bindEvents();
  });
})();
