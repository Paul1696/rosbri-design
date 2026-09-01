(function () {
  "use strict";

  const FEATURED = Object.freeze([
    { id: "485", universe: "vetements", badge: "Signature", displayTitle: "Pantalon Palazzo Ankara" },
    { id: "33", universe: "accessoires", badge: "Icône", displayTitle: "Sac Cabas Africa" },
    { id: "334", universe: "enfants", badge: "Junior", displayTitle: "Ensemble Junior" },
    { id: "243", universe: "maison", badge: "Maison", displayTitle: "Coussin Wax Premium" }
  ]);

  const HOME_IMAGE_OVERRIDES = Object.freeze({
    "485": "images/optimized/home/kimono-adulte-rosbri-26.webp",
    "33": "images/optimized/home/sac-cabas-afrique-wax-rouge.webp",
    "334": "images/optimized/home/mini-aventure.webp",
    "243": "images/optimized/home/coussin-rosbri-wax-01.webp"
  });

  const UNIVERSE_CONTENT = Object.freeze({
    vetements: { description: "Des tenues contemporaines et pleines de vie, conçues pour affirmer votre style avec élégance.", image: "images/universes/univers-vetements-premium.png?v=2" },
    accessoires: { description: "Sacs, pochettes et détails qui font la différence et complètent votre signature Rosbri.", image: "images/universes/univers-accessoires-premium.png?v=2" },
    enfants: { description: "Des créations confortables et colorées, pensées pour accompagner les petits avec style.", image: "images/universes/univers-enfants-premium.png?v=2" },
    cadeaux: {
      description: "Des coffrets et sélections cadeaux qui racontent une histoire et font plaisir avec élégance.",
      image: "images/universes/univers-cadeaux-premium.png?v=2"
    },
    maison: { description: "Des pièces uniques pour sublimer votre intérieur et créer une ambiance chaleureuse et personnelle.", image: "images/universes/univers-maison-premium.png?v=2" }
  });

  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function catalog() {
    return Array.isArray(window.ROSBriCatalog) ? window.ROSBriCatalog : [];
  }

  function universeId(item) {
    if (!item || !window.ROSBriTaxonomy) return null;
    return window.ROSBriTaxonomy.idForItem(item);
  }

  function eligible(item, expectedUniverse) {
    return Boolean(item && item.image && universeId(item) === expectedUniverse);
  }

  function resolveFeatured(config) {
    const items = catalog();
    const preferred = items.find((item) => String(item.id) === config.id);
    if (eligible(preferred, config.universe)) return preferred;
    return items
      .filter((item) => eligible(item, config.universe))
      .sort((a, b) => Number(a.id) - Number(b.id))[0] || null;
  }

  function productImage(item) {
    return HOME_IMAGE_OVERRIDES[String(item.id)] || String(item.image || "");
  }

  function buildProductCard(item, config) {
    const title = String(config.displayTitle || item.title || "Création ROSBRI DESIGN");
    const price = String(item.price || "Sur devis");
    const image = productImage(item);
    const category = window.ROSBriTaxonomy.label(config.universe);
    const destination = "produit.html?id=" + encodeURIComponent(String(item.id));
    const card = create("article", "product-card");
    card.dataset.category = config.universe;
    card.dataset.productSlug = String(item.id);

    const mediaLink = create("a", "product-card__link");
    mediaLink.href = destination;
    mediaLink.setAttribute("aria-label", "Voir la fiche " + title);
    const media = create("div", "product-card__image-container");
    const badge = create("span", "product-badge");
    const badgeIcons = { Signature: "♛", "Icône": "★", Junior: "ϟ", Maison: "⌂" };
    const badgeIcon = create("span", "product-badge__icon", badgeIcons[config.badge] || "✦");
    badgeIcon.setAttribute("aria-hidden", "true");
    badge.append(badgeIcon, document.createTextNode(config.badge));
    media.append(badge);
    const img = create("img", "product-card__image");
    img.src = image;
    img.alt = title;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 720;
    img.height = 900;
    media.append(img);
    mediaLink.append(media);

    const favorite = create("button", "product-card__favorite", "♡");
    favorite.type = "button";
    favorite.setAttribute("aria-label", "Ajouter " + title + " aux favoris");
    favorite.setAttribute("aria-pressed", "false");
    favorite.addEventListener("click", function () {
      const active = favorite.getAttribute("aria-pressed") === "true";
      favorite.setAttribute("aria-pressed", String(!active));
      favorite.textContent = active ? "♡" : "♥";
    });

    const info = create("div", "product-card__info");
    info.append(create("span", "product-card__category", category));
    const heading = create("h3", "product-card__title card-title");
    const titleLink = create("a", "", title);
    titleLink.href = destination;
    heading.append(titleLink);
    info.append(heading, create("div", "product-card__price", price));

    const action = create("a", "product-card__discover", "DÉCOUVRIR  →");
    action.href = destination;
    info.append(action);
    card.append(mediaLink, favorite, info);
    return card;
  }

  function populateHomeSelection() {
    const grid = document.getElementById("home-products-grid");
    if (!grid) return;
    if (!catalog().length) {
      const empty = create("div", "catalog-empty-state");
      empty.append(create("h3", "", "La sélection est momentanément indisponible"));
      const link = create("a", "button-primary", "Découvrir la boutique");
      link.href = "boutique.html";
      empty.append(link);
      grid.replaceChildren(empty);
      grid.setAttribute("aria-busy", "false");
      return;
    }
    const cards = FEATURED
      .map((config) => ({ config, item: resolveFeatured(config) }))
      .filter(({ item }) => item)
      .map(({ item, config }) => buildProductCard(item, config));
    grid.replaceChildren(...cards);
    grid.setAttribute("aria-busy", "false");
  }

  function representativeFor(universe) {
    const featured = FEATURED.find((entry) => entry.universe === universe);
    if (featured) return resolveFeatured(featured);
    return catalog()
      .filter((item) => eligible(item, universe))
      .sort((a, b) => Number(a.id) - Number(b.id))[0] || null;
  }

  function buildUniverseCard(definition) {
    const content = UNIVERSE_CONTENT[definition.id];
    const representative = representativeFor(definition.id);
    if (!content || (!representative && !content.image)) return null;
    const link = create("a", "collection-card");
    link.href = window.ROSBriTaxonomy.url(definition.id);
    const media = create("div", "collection-card__image-wrapper");
    const img = create("img", "collection-card__image");
    img.src = content.image || productImage(representative);
    img.alt = "Univers " + definition.label + " ROSBRI DESIGN";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 720;
    img.height = 900;
    media.append(img);
    const body = create("div", "collection-card__content");
    const accent = create("span", "collection-card__accent");
    accent.setAttribute("aria-hidden", "true");
    body.append(
      create("h3", "collection-card__title card-title", definition.label),
      accent,
      create("p", "collection-card__desc card-description", content.description),
      create("span", "btn-link", "Explorer l’univers →")
    );
    link.append(media, body);
    return link;
  }

  function populateUniverses() {
    const grid = document.getElementById("home-universes-grid");
    if (!grid || !window.ROSBriTaxonomy || !catalog().length) {
      if (grid) grid.setAttribute("aria-busy", "false");
      return;
    }
    const cards = window.ROSBriTaxonomy.definitions
      .filter((definition) => definition.id !== "entreprise")
      .map(buildUniverseCard)
      .filter(Boolean);
    if (cards.length) grid.replaceChildren(...cards);
    grid.setAttribute("aria-busy", "false");
  }

  function initialize() {
    populateHomeSelection();
    populateUniverses();
    document.dispatchEvent(new CustomEvent("rosbri:home-content-ready"));
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (catalog().length) initialize();
    else window.setTimeout(initialize, 200);
  });
})();
