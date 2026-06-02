(function () {
  let catalog = Array.isArray(window.ROSBriCatalog) ? window.ROSBriCatalog : [];
  const labels = {
    Packs: "Packs",
    Tshirts: "T-shirts",
    Sacs: "Sacs",
    Ensembles: "Ensembles",
    Babouches: "Babouches",
    Sandales: "Sandales",
    Chapeaux: "Chapeaux",
    Bobs: "Bobs",
    Pochettes: "Pochettes",
    GantsCuisine: "Gants de cuisine",
    Maniques: "Maniques",
    Accessoires: "Accessoires",
    Coussins: "Coussins",
    Robes: "Robes",
    Chemises: "Chemises"
  };
  const order = Object.keys(labels);
  const descriptions = {
    Packs: "Lots assortis prêts à offrir ou à porter ensemble.",
    Tshirts: "Visuels culturels, cadeaux famille et modèles personnalisables.",
    Sacs: "Cabas et sacs wax pour le quotidien, les sorties et les cadeaux.",
    Ensembles: "Tenues adulte et enfant coordonnées, avec choix de taille.",
    Babouches: "Paires légères avec finitions wax et choix de pointure.",
    Sandales: "Sandales plates, colorées et faciles à associer.",
    Chapeaux: "Chapeaux de paille avec bordures, rubans et noeuds wax.",
    Bobs: "Bobs wax modernes pour une touche casual et solaire.",
    Pochettes: "Petits formats pratiques pour accessoires, cadeaux et sacs.",
    GantsCuisine: "Accessoires cuisine matelassés avec motifs wax.",
    Maniques: "Maniques pratiques pour protéger les mains et décorer la cuisine.",
    Accessoires: "Petites pièces ROSBRI pour compléter un look ou offrir.",
    Coussins: "Objets déco pour donner du caractère au salon ou à la chambre.",
    Robes: "Robes adulte et enfant avec inspiration wax.",
    Chemises: "Pièces habillées pour une élégance africaine moderne."
  };

  function productCategory(item) {
    if (item.isPack || item.is_pack || item.category === "Packs") return "Packs";
    const path = item.image || "";
    const match = path.match(/^images\/articles-site\/([^/]+)/i);
    const folder = match ? match[1] : "";
    const map = {
      tshirts: "Tshirts",
      sacs: "Sacs",
      ensembles: "Ensembles",
      babouches: "Babouches",
      sandales: "Sandales",
      chapeaux: "Chapeaux",
      bobs: "Bobs",
      pochettes: "Pochettes",
      "gants-cuisine": "GantsCuisine",
      maniques: "Maniques",
      accessoires: "Accessoires",
      coussins: "Coussins",
      robes: "Robes",
      chemises: "Chemises"
    };
    return map[folder] || item.category || "Accessoires";
  }

  function renderCollections() {
    const target = document.getElementById("collection-grid");
    if (!target) return;
    const grouped = catalog.reduce((groups, item) => {
      if (item.visible === false) return groups;
      const category = productCategory(item);
      groups[category] = groups[category] || [];
      groups[category].push(item);
      return groups;
    }, {});
    const cards = order
      .filter((category) => grouped[category] && grouped[category].length)
      .map((category) => {
        const items = grouped[category];
        const images = items.slice(0, 4).map((item) => `<img src="${item.image}" alt="">`).join("");
        return `
          <article class="collection-card">
            <div class="collection-mosaic">${images}</div>
            <div class="collection-card-body">
              <span>${items.length} article${items.length > 1 ? "s" : ""}</span>
              <h2>${labels[category] || category}</h2>
              <p>${descriptions[category] || "Articles ROSBRI classés pour une commande rapide."}</p>
              <a class="primary-btn" href="boutique.html?categorie=${encodeURIComponent(category)}">Voir la collection</a>
            </div>
          </article>
        `;
      });
    target.innerHTML = cards.join("") || "<p>Aucune collection disponible.</p>";
    document.dispatchEvent(new CustomEvent("catalog:render", { detail: { target } }));
  }

  window.ROSBriApplyCatalog = (items) => {
    catalog = Array.isArray(items) ? items : catalog;
    renderCollections();
  };

  document.addEventListener("DOMContentLoaded", renderCollections);
})();
