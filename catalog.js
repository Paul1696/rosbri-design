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
    price: "all",
    need: "all",
    sort: "default",
    visibleLimit: 24
  };
  const pageSize = 24;
  const sizeOptions = ["S", "M", "L", "XL", "XXL"];
  const colorVariants = [
    { id: "blanc", label: "Blanc", swatch: "#eeeee5" },
    { id: "noir", label: "Noir", swatch: "#1e1f1f" },
    { id: "sable", label: "Sable", swatch: "#decfb5" },
    { id: "rose", label: "Rose", cropX: "0%", cropY: "0%", swatch: "#f7b8c9", tint: "#f4a9bc" },
    { id: "mauve", label: "Mauve", cropX: "-50%", cropY: "0%", swatch: "#d7b3f4", tint: "#c8a2ea" },
    { id: "menthe", label: "Vert menthe", cropX: "0%", cropY: "-50%", swatch: "#cfeee4", tint: "#a9dfd1" },
    { id: "jaune", label: "Jaune", cropX: "-50%", cropY: "-50%", swatch: "#ffe6a4", tint: "#ffd777" },
    { id: "bleu-nuit", label: "Bleu nuit", swatch: "#1e2b48" }
  ];
  const productColorVariants = {
    1: [
      productVariant("tshirt-reine-africaine-wax", "sable", "Sable", "#c4ab81"),
      productVariant("tshirt-reine-africaine-wax", "blanc", "Blanc", "#eeeee5"),
      productVariant("tshirt-reine-africaine-wax", "noir", "Noir", "#222322"),
      productVariant("tshirt-reine-africaine-wax", "bleu-nuit", "Bleu nuit", "#263452"),
      productVariant("tshirt-reine-africaine-wax", "bordeaux", "Bordeaux", "#702737"),
      productVariant("tshirt-reine-africaine-wax", "vert-sauge", "Vert sauge", "#8fa48b")
    ],
    2: darkProductVariants("tshirt-luffy-feu-foudre"),
    3: darkProductVariants("tshirt-luffy-impact"),
    4: [
      productVariant("tshirt-pont-allemands-edea", "vert-foret", "Vert forêt", "#184931"),
      productVariant("tshirt-pont-allemands-edea", "noir", "Noir", "#1e1f1f"),
      productVariant("tshirt-pont-allemands-edea", "bleu-nuit", "Bleu nuit", "#1e2b48"),
      productVariant("tshirt-pont-allemands-edea", "bordeaux", "Bordeaux", "#672330"),
      productVariant("tshirt-pont-allemands-edea", "marron", "Marron", "#563a24")
    ],
    5: mamanLightVariants("tshirt-merci-maman-01"),
    6: mamanLightVariants("tshirt-merci-maman-02"),
    "maman-coeur-force": mamanLightVariants("tshirt-maman-coeur-force"),
    "maman-merci-tout": [
      productVariant("tshirt-merci-maman-meilleure", "rose", "Rose", "#f7b8c9"),
      productVariant("tshirt-merci-maman-meilleure", "menthe", "Vert menthe", "#cfeee4"),
      productVariant("tshirt-merci-maman-meilleure", "mauve", "Mauve", "#d5b3f4"),
      productVariant("tshirt-merci-maman-meilleure", "jaune", "Jaune", "#ffe6a4")
    ],
    "maman-amour-force": [
      productVariant("tshirt-maman-amour-force", "blanc", "Blanc", "#eeeee5"),
      productVariant("tshirt-maman-amour-force", "rose", "Rose", "#f7b8c9"),
      productVariant("tshirt-maman-amour-force", "mauve", "Mauve", "#d5b3f4"),
      productVariant("tshirt-maman-amour-force", "menthe", "Vert menthe", "#cfeee4")
    ],
    24: [
      productVariant("tshirt-merci-maman-20", "blanc", "Blanc", "#eeeee5"),
      productVariant("tshirt-merci-maman-20", "rose", "Rose", "#f7b8c9"),
      productVariant("tshirt-merci-maman-20", "menthe", "Vert menthe", "#cfeee4"),
      productVariant("tshirt-merci-maman-20", "jaune", "Jaune", "#ffe6a4")
    ],
    25: [
      productVariant("tshirt-merci-maman-21", "blanc", "Blanc", "#eeeee5"),
      productVariant("tshirt-merci-maman-21", "sable", "Sable", "#decfb5"),
      productVariant("tshirt-merci-maman-21", "menthe", "Vert menthe", "#cfeee4"),
      productVariant("tshirt-merci-maman-21", "mauve", "Mauve", "#d5b3f4")
    ],
    26: foldedMamanVariants("tshirt-merci-maman-22"),
    27: [
      productVariant("tshirt-merci-maman-23", "blanc", "Blanc", "#eeeee5"),
      productVariant("tshirt-merci-maman-23", "sable", "Sable", "#decfb5"),
      productVariant("tshirt-merci-maman-23", "mauve", "Mauve", "#d5b3f4"),
      productVariant("tshirt-merci-maman-23", "menthe", "Vert menthe", "#cfeee4")
    ],
    28: [
      productVariant("tshirt-merci-maman-24", "menthe", "Vert menthe", "#cfeee4"),
      productVariant("tshirt-merci-maman-24", "mauve", "Mauve", "#d5b3f4"),
      productVariant("tshirt-merci-maman-24", "rose", "Rose", "#f7b8c9"),
      productVariant("tshirt-merci-maman-24", "sable", "Sable", "#decfb5")
    ],
    29: foldedMamanVariants("tshirt-merci-maman-25"),
    30: [
      productVariant("tshirt-merci-maman-26", "sable", "Sable", "#decfb5"),
      productVariant("tshirt-merci-maman-26", "rose", "Rose", "#f7b8c9"),
      productVariant("tshirt-merci-maman-26", "menthe", "Vert menthe", "#cfeee4"),
      productVariant("tshirt-merci-maman-26", "mauve", "Mauve", "#d5b3f4")
    ],
    31: [
      productVariant("tshirt-merci-maman-27", "menthe", "Vert menthe", "#cfeee4"),
      productVariant("tshirt-merci-maman-27", "mauve", "Mauve", "#d5b3f4"),
      productVariant("tshirt-merci-maman-27", "sable", "Sable", "#decfb5"),
      productVariant("tshirt-merci-maman-27", "rose", "Rose", "#f7b8c9")
    ],
    32: darkProductVariants("tshirt-patricks-feu"),
    33: [
      productVariant("tshirt-world-best-mom", "mauve", "Mauve", "#d5b3f4"),
      productVariant("tshirt-world-best-mom", "rose", "Rose", "#f7b8c9"),
      productVariant("tshirt-world-best-mom", "menthe", "Vert menthe", "#cfeee4"),
      productVariant("tshirt-world-best-mom", "jaune", "Jaune", "#ffe6a4")
    ],
    35: [
      productVariant("tshirt-maman-mon-bonheur", "sable", "Sable", "#decfb5"),
      productVariant("tshirt-maman-mon-bonheur", "rose", "Rose", "#f7b8c9"),
      productVariant("tshirt-maman-mon-bonheur", "menthe", "Vert menthe", "#cfeee4"),
      productVariant("tshirt-maman-mon-bonheur", "mauve", "Mauve", "#d5b3f4")
    ],
    36: heritageThreeVariants("tshirt-palaise-dschang"),
    37: heritageThreeVariants("tshirt-chutes-lobe"),
    38: heritageThreeVariants("tshirt-mont-cameroun")
  };
  const orderState = {
    item: null,
    size: "M",
    color: colorVariants[0].id,
    customText: ""
  };
  const variantGroups = [
    {
      id: "maman-coeur-force",
      title: "T-shirt Maman mon cœur ma force",
      category: "Maman",
      price: "6 500 FCFA",
      image: "images/ChatGPT Image 21 mai 2026, 23_35_03.png",
      variantIds: [7],
      colorPreview: true
    },
    {
      id: "maman-merci-tout",
      title: "T-shirt Merci Maman - Tu es la meilleure",
      category: "Maman",
      price: "6 500 FCFA",
      image: "images/ChatGPT Image 21 mai 2026, 23_35_12.png",
      variantIds: [8, 9, 10],
      colorPreview: true
    },
    {
      id: "maman-amour-force",
      title: "T-shirt Maman amour et force",
      category: "Maman",
      price: "6 500 FCFA",
      image: "images/ChatGPT Image 21 mai 2026, 23_35_35.png",
      variantIds: [11, 12, 13, 14, 15],
      colorPreview: true
    },
  ];
  const hiddenProductIds = [16, 17, 18, 19, 20, 21, 22, 23, 34];
  const groupedVariantIds = new Set([
    ...variantGroups.flatMap((group) => group.variantIds),
    ...hiddenProductIds
  ]);
  const catalogView = [
    ...catalog.filter((item) => !groupedVariantIds.has(item.id)),
    ...variantGroups.map((group) => ({
      ...group,
      id: group.id,
      sourceIds: group.variantIds
    }))
  ].sort((a, b) => {
    return catalogOrderKey(a) - catalogOrderKey(b);
  });
  const categoryCounts = catalogView.reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {});
  const searchIndex = new Map(catalogView.map((item) => [
    item.id,
    `${displayTitle(item)} ${labels[item.category]} ${item.title} ${item.category} ${item.price} ${(item.sourceIds || []).join(" ")}`.toLowerCase()
  ]));

  function byId(id) {
    return document.getElementById(id);
  }

  function productVariant(productSlug, colorSlug, label, swatch) {
    return {
      id: colorSlug,
      label,
      swatch,
      image: `images/variants/${productSlug}-${colorSlug}.png`
    };
  }

  function darkProductVariants(productSlug) {
    return [
      productVariant(productSlug, "noir", "Noir", "#1e1f1f"),
      productVariant(productSlug, "bleu-nuit", "Bleu nuit", "#1e2b48"),
      productVariant(productSlug, "bordeaux", "Bordeaux", "#672330"),
      productVariant(productSlug, "vert-foret", "Vert forêt", "#224432"),
      productVariant(productSlug, "violet-nuit", "Violet nuit", "#3e2d58")
    ];
  }

  function mamanLightVariants(productSlug) {
    return [
      productVariant(productSlug, "mauve", "Mauve", "#d5b3f4"),
      productVariant(productSlug, "rose", "Rose", "#f7b8c9"),
      productVariant(productSlug, "menthe", "Vert menthe", "#cfeee4"),
      productVariant(productSlug, "jaune", "Jaune", "#ffe6a4")
    ];
  }

  function foldedMamanVariants(productSlug) {
    return [
      productVariant(productSlug, "blanc", "Blanc", "#eeeee5"),
      productVariant(productSlug, "sable", "Sable", "#decfb5"),
      productVariant(productSlug, "menthe", "Vert menthe", "#cfeee4"),
      productVariant(productSlug, "mauve", "Mauve", "#d5b3f4")
    ];
  }

  function heritageThreeVariants(productSlug) {
    return [
      productVariant(productSlug, "vert-foret", "Vert forêt", "#184931"),
      productVariant(productSlug, "bordeaux", "Bordeaux", "#672330"),
      productVariant(productSlug, "moutarde", "Moutarde", "#c7901f")
    ];
  }

  function announceRender(target) {
    document.dispatchEvent(new CustomEvent("catalog:render", { detail: { target } }));
  }

  function displayTitle(item) {
    return item.title || labels[item.category] || "Article personnalisé";
  }

  function catalogOrderKey(item) {
    return Array.isArray(item.sourceIds) ? Math.min(...item.sourceIds) : item.id;
  }

  function isTshirt(item) {
    return displayTitle(item).toLowerCase().includes("t-shirt");
  }

  function productVariantsFor(item) {
    return item ? (productColorVariants[item.id] || []) : [];
  }

  function colorOptionsFor(item) {
    if (!item || !isTshirt(item)) return [];
    const productVariants = productVariantsFor(item);
    return colorVariants.map((variant) => ({
      ...variant,
      image: (productVariants.find((productVariant) => productVariant.id === variant.id) || {}).image
    }));
  }

  function displayImage(item) {
    return (productVariantsFor(item).find((variant) => variant.image) || {}).image || item.image;
  }

  function hasColorChoices(item) {
    return colorOptionsFor(item).length > 0;
  }

  function isColorCollage(item) {
    return item.colorPreview === true && !productColorVariants[item.id];
  }

  function canCustomize(item) {
    const title = displayTitle(item).toLowerCase();
    return item.category === "Customisation" || title.includes("personnalis") || title.includes("pack");
  }

  function selectedColor() {
    const options = colorOptionsFor(orderState.item);
    return options.find((variant) => variant.id === orderState.color) || options[0] || colorVariants[0];
  }

  function orderUrlWithOptions(item, options = {}) {
    const productUrl = `${SITE_URL}boutique.html#article-${item.id}`;
    const details = [];
    if (options.size) details.push(`Taille: ${options.size}`);
    if (options.color) details.push(`Couleur: ${options.color}`);
    if (options.customText) details.push(`Personnalisation: ${options.customText}`);
    const detailsText = details.length ? ` ${details.join(" | ")}.` : "";
    const message = `Bonjour ROSBRI DESIGN, je suis intéressé par ${displayTitle(item)} (${item.price}).${detailsText} Lien: ${productUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  function optimizedImage(path) {
    const dot = path.lastIndexOf(".");
    const base = dot > -1 ? path.slice(0, dot) : path;
    return base.replace("images/", "images/optimized/") + ".jpg";
  }

  function priceBand(item) {
    if (item.price === "Sur devis") return "quote";
    if (item.price.includes("4 500") || item.price.includes("5 000")) return "low";
    if (item.price.includes("6 500")) return "mid";
    return "premium";
  }

  function needMatch(item, need) {
    const text = searchIndex.get(item.id) || "";
    if (need === "all") return true;
    if (need === "gift") return item.category === "Maman" || text.includes("maman") || text.includes("famille") || text.includes("fête");
    if (need === "culture") return item.category === "Heritage" || text.includes("kribi") || text.includes("cameroun") || text.includes("tradition");
    if (need === "custom") return item.category === "Customisation" || text.includes("personnalisation") || text.includes("pack");
    if (need === "bags") return item.category === "Sacs";
    return true;
  }

  function productCard(item, compact, eager) {
    const title = displayTitle(item);
    const loading = eager ? "eager" : "lazy";
    const priority = eager ? " fetchpriority=\"high\"" : "";
    const collage = isColorCollage(item);
    const colorChoices = hasColorChoices(item);
    const colorCount = colorOptionsFor(item).length;
    return `
      <article class="product-card${collage ? " has-variants" : ""}" id="article-${item.id}" data-category="${item.category}">
        <button class="product-media" type="button" data-open-product="${item.id}" aria-label="Voir ${title}">
          <img class="${collage ? "variant-crop" : ""}" src="${optimizedImage(displayImage(item))}" alt="${title}" loading="${loading}" decoding="async"${priority}>
          <span class="tag">${labels[item.category] || item.category}</span>
          ${colorChoices ? `<span class="variant-note">${colorCount} couleurs</span>` : ""}
        </button>
        <div class="product-body">
          <h3>${title}</h3>
          <div class="product-meta">
            <span>${compact ? "Création ROSBRI" : labels[item.category]}</span>
            <span class="price">${item.price}</span>
          </div>
          <div class="product-actions">
            <button class="secondary-btn" type="button" data-open-product="${item.id}">Aperçu</button>
            <button class="mini-order" type="button" data-open-product="${item.id}">Commander</button>
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
    let result = catalogView.filter((item) => {
      const categoryMatch = state.category === "Tous" || item.category === state.category;
      const queryMatch = !query || (searchIndex.get(item.id) || "").includes(query);
      const priceMatch = state.price === "all" || priceBand(item) === state.price;
      return categoryMatch && queryMatch && priceMatch && needMatch(item, state.need);
    });

    if (state.sort === "name") {
      result = result.slice().sort((a, b) => displayTitle(a).localeCompare(displayTitle(b)));
    }

    if (state.sort === "category") {
      result = result.slice().sort((a, b) => a.category.localeCompare(b.category) || catalogOrderKey(a) - catalogOrderKey(b));
    }

    if (state.sort === "price") {
      const order = { low: 1, mid: 2, premium: 3, quote: 4 };
      result = result.slice().sort((a, b) => order[priceBand(a)] - order[priceBand(b)] || catalogOrderKey(a) - catalogOrderKey(b));
    }

    return result;
  }

  function renderFeatured() {
    const target = byId("featured-grid");
    if (!target) return;

    const picks = [
      ...catalogView.filter((item) => item.category === "Heritage").slice(0, 3),
      ...catalogView.filter((item) => item.category === "Anime").slice(0, 1),
      ...catalogView.filter((item) => item.category === "Maman").slice(0, 2),
      ...catalogView.filter((item) => item.category === "Customisation").slice(0, 1),
      ...catalogView.filter((item) => item.category === "Sacs").slice(0, 1)
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
      const count = category === "Tous" ? catalogView.length : (categoryCounts[category] || 0);
      return `<button class="filter-btn${category === state.category ? " active" : ""}" type="button" data-category="${category}">${labels[category]} (${count})</button>`;
    }).join("");
  }

  function resetVisibleLimit() {
    state.visibleLimit = pageSize;
  }

  function optionMarkup(item) {
    const sizePicker = isTshirt(item)
      ? `
        <label class="option-group" for="size-select">
          <strong>Taille</strong>
          <select class="select" id="size-select">
            ${sizeOptions.map((size) => `<option value="${size}"${size === orderState.size ? " selected" : ""}>${size}</option>`).join("")}
          </select>
        </label>
      `
      : "";

    const colorOptions = colorOptionsFor(item);
    const colorPicker = colorOptions.length
      ? `
        <div class="option-group">
          <strong>Couleur</strong>
          <div class="swatch-list" role="radiogroup" aria-label="Choisir la couleur">
            ${colorOptions.map((variant) => `
              <button class="swatch-btn${variant.id === orderState.color ? " active" : ""}" type="button" data-color="${variant.id}" style="--swatch:${variant.swatch}">
                <span></span>${variant.label}
              </button>
            `).join("")}
          </div>
        </div>
      `
      : "";

    const customField = canCustomize(item)
      ? `
        <label class="option-group" for="custom-text">
          <strong>Personnalisation</strong>
          <textarea id="custom-text" rows="3" placeholder="Nom, phrase, logo, couleur spéciale...">${orderState.customText}</textarea>
        </label>
      `
      : "";

    return `
      <div class="order-options">
        ${sizePicker}
        ${colorPicker}
        ${customField}
      </div>
    `;
  }

  function applyPreviewCrop() {
    const image = byId("lightbox-image");
    const visual = byId("lightbox-visual");
    if (!image || !visual || !orderState.item) return;

    const color = selectedColor();
    const collage = isColorCollage(orderState.item);
    image.src = optimizedImage(color.image || displayImage(orderState.item));
    image.classList.toggle("variant-crop", collage);
    visual.classList.toggle("has-variants", collage);
    image.style.setProperty("--crop-x", color.cropX || "0%");
    image.style.setProperty("--crop-y", color.cropY || "0%");
  }

  function updateOrderLink() {
    if (!orderState.item) return;
    const order = byId("lightbox-order");
    const summary = byId("choice-summary");
    const tshirt = isTshirt(orderState.item);
    const colorChoices = hasColorChoices(orderState.item);
    const selectedOptions = {
      size: tshirt ? orderState.size : "",
      color: colorChoices ? selectedColor().label : "",
      customText: canCustomize(orderState.item) ? orderState.customText.trim() : ""
    };
    if (order) {
      order.href = orderUrlWithOptions(orderState.item, selectedOptions);
      order.textContent = `Commander ${displayTitle(orderState.item)}`;
    }
    if (summary) {
      const parts = [];
      if (selectedOptions.size) parts.push(`taille ${selectedOptions.size}`);
      if (selectedOptions.color) parts.push(`couleur ${selectedOptions.color}`);
      if (selectedOptions.customText) parts.push("personnalisation ajoutée");
      summary.textContent = parts.length ? `Votre choix: ${parts.join(" · ")}` : "Votre choix sera confirmé sur WhatsApp.";
    }
  }

  function renderOrderOptions(item) {
    const target = byId("lightbox-options");
    if (!target) return;
    target.innerHTML = optionMarkup(item);
    updateOrderLink();
  }

  function updateActiveNeeds() {
    document.querySelectorAll("[data-need]").forEach((button) => {
      button.classList.toggle("active", button.dataset.need === state.need);
    });
  }

  function openProduct(id) {
    const item = catalogView.find((entry) => String(entry.id) === String(id));
    const lightbox = byId("lightbox");
    if (!item || !lightbox) return;

    orderState.item = item;
    orderState.size = "M";
    orderState.color = (colorOptionsFor(item)[0] || colorVariants[0]).id;
    orderState.customText = "";

    byId("lightbox-image").src = optimizedImage(displayImage(item));
    byId("lightbox-image").alt = displayTitle(item);
    byId("lightbox-title").textContent = displayTitle(item);
    byId("lightbox-meta").textContent = `${labels[item.category]} - ${item.price}`;
    renderOrderOptions(item);
    applyPreviewCrop();
    lightbox.classList.add("open");
    document.dispatchEvent(new CustomEvent("catalog:lightbox-open", { detail: { item } }));
    document.body.style.overflow = "hidden";
  }

  function closeProduct() {
    const lightbox = byId("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("open");
    orderState.item = null;
    const image = byId("lightbox-image");
    const visual = byId("lightbox-visual");
    if (image) {
      image.removeAttribute("src");
      image.classList.remove("variant-crop");
      image.style.removeProperty("--crop-x");
      image.style.removeProperty("--crop-y");
    }
    if (visual) {
      visual.classList.remove("has-variants");
    }
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

      const colorButton = event.target.closest("[data-color]");
      if (colorButton) {
        orderState.color = colorButton.dataset.color;
        document.querySelectorAll("[data-color]").forEach((button) => {
          button.classList.toggle("active", button.dataset.color === orderState.color);
        });
        applyPreviewCrop();
        updateOrderLink();
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

    const price = byId("catalog-price");
    if (price) {
      price.addEventListener("change", (event) => {
        state.price = event.target.value;
        resetVisibleLimit();
        renderShop();
      });
    }

    document.addEventListener("click", (event) => {
      const needButton = event.target.closest("[data-need]");
      if (!needButton) return;
      state.need = needButton.dataset.need;
      resetVisibleLimit();
      updateActiveNeeds();
      renderShop();
    });

    const loadMore = byId("catalog-load-more");
    if (loadMore) {
      loadMore.addEventListener("click", () => {
        state.visibleLimit += pageSize;
        renderShop();
      });
    }

    document.addEventListener("change", (event) => {
      if (event.target.id === "size-select") {
        orderState.size = event.target.value;
        updateOrderLink();
      }
    });

    document.addEventListener("input", (event) => {
      if (event.target.id === "custom-text") {
        orderState.customText = event.target.value;
        updateOrderLink();
      }
    });
  }

  function updateCounts() {
    document.querySelectorAll("[data-catalog-count]").forEach((node) => {
      node.textContent = catalogView.length;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCounts();
    renderFeatured();
    renderFilters();
    renderShop();
    bindEvents();
    updateActiveNeeds();
  });
})();
