(function () {
  let catalog = Array.isArray(window.ROSBriCatalog) ? window.ROSBriCatalog : [];
  const labels = {
    "Tous": "Tous les produits",
    "Nouveautes": "Nouveautés",
    "Populaires": "Les plus vendus",
    "PetitPrix": "Moins de 10 000 FCFA",
    "Produits": "Catalogue régulier",
    "SurDevis": "Sur devis",
    "Vêtements": "Vêtements",
    "Accessoires": "Accessoires",
    "Maison & Déco": "Maison & Déco",
    "Mugs & Gourdes": "Mugs & Gourdes",
    "Enfants & Bébés": "Enfants & Bébés",
    "Packs & Idées Cadeaux": "Packs & Cadeaux",
    "Entreprise & B2B": "B2B & Pros",
    "Collections Spéciales": "Collections Spéciales"
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
    Chemises: "Pièces habillées pour une élégance africaine moderne.",
    Boubous: "Boubous amples et fluides ornés de superbes motifs wax.",
    Polos: "Polos habillés avec broderie signature inspirée du continent.",
    Debardeurs: "Débardeurs légers avec graphismes culturels stylisés.",
    Sweats: "Sweats col rond confortables aux visuels urbains et ethniques.",
    Hoodies: "Sweats à capuche doublés wax pour un style casual affirmé.",
    Jupes: "Jupes fluides et structurées aux motifs géométriques vibrants.",
    Shorts: "Shorts d'été décontractés en coton wax authentique.",
    Pantalons: "Pantalons coupe moderne avec touches africaines raffinées.",
    Bijoux: "Boucles d'oreilles et bijoux uniques en bois découpé et wax.",
    Portefeuilles: "Compagnons zippés associant cuir et empiècements wax.",
    Trousses: "Trousses de voyage et cosmétiques pratiques et matelassées.",
    Chaussures: "Tennis et baskets personnalisées avec finitions imprimées.",
    Tabliers: "Tabliers de cuisine élégants pour cuisiner avec style.",
    Serviettes: "Serviettes de bain et de plage aux visuels culturels hauts en couleur.",
    Mugs: "Mugs en céramique décorés de monuments et motifs traditionnels.",
    Gourdes: "Gourdes isothermes en acier inoxydable au design ROSBRI.",
    Affiches: "Affiches d'art de qualité galerie pour habiller vos murs.",
    Cartes: "Cartes de vœux texturées pour toutes vos occasions festives.",
    Stickers: "Stickers en vinyle résistant pour personnaliser vos objets.",
    Pagnes: "Coupes de pagnes wax traditionnels de qualité supérieure.",
    CoquesTelephone: "Coques de protection robustes aux motifs exclusifs."
  };

  function productCategory(item) {
    if (item.isPack || item.is_pack || item.category === "Packs & Idées Cadeaux") return "Packs & Idées Cadeaux";
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
      chemises: "Chemises",
      boubous: "Boubous",
      polos: "Polos",
      debardeurs: "Debardeurs",
      sweats: "Sweats",
      hoodies: "Hoodies",
      jupes: "Jupes",
      shorts: "Shorts",
      pantalons: "Pantalons",
      bijoux: "Bijoux",
      portefeuilles: "Portefeuilles",
      trousses: "Trousses",
      chaussures: "Chaussures",
      tabliers: "Tabliers",
      serviettes: "Serviettes",
      mugs: "Mugs",
      gourdes: "Gourdes",
      affiches: "Affiches",
      cartes: "Cartes",
      stickers: "Stickers",
      pagnes: "Pagnes",
      "coques-telephone": "CoquesTelephone",
      casquettes: "Casquettes"
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
<div class="group card-hover-effect flex flex-col bg-white overflow-hidden relative border border-transparent hover:border-gold-soft/20 rounded-2xl soft-shadow transition-all duration-500 hover:-translate-y-2">
<div class="aspect-[3/4] relative overflow-hidden bg-surface-container">
<img class="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700" src="${items[0].image}" loading="lazy" alt="">
<div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
<span class="absolute top-4 right-4 bg-white/90 backdrop-blur text-ink text-xs font-bold px-3 py-1 rounded-full">${items.length} articles</span>
</div>
<div class="p-6">
<h3 class="font-headline-md text-xl text-ink mb-2">${labels[category] || category}</h3>
<p class="font-body-md text-sm text-on-surface-variant line-clamp-2">${descriptions[category] || "Articles ROSBRI."}</p>
</div>
<a aria-label="Explore ${category}" class="absolute inset-0 z-10" href="boutique.html?categorie=${encodeURIComponent(category)}"></a>
</div>
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
