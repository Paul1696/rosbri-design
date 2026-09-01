(function () {
  const definitions = [
    { id: "vetements", label: "Vêtements", aliases: ["vêtements", "vetements", "tshirts", "t-shirts", "ensembles", "robes", "boubous", "chemises", "sweats", "hoodies", "jupes", "shorts", "pantalons", "polos", "debardeurs", "débardeurs"] },
    { id: "accessoires", label: "Accessoires", aliases: ["accessoires", "sacs", "sacs & pochettes", "pochettes", "portefeuilles", "trousses", "bijoux", "babouches", "sandales", "chaussures", "chapeaux", "casquettes", "bobs"] },
    { id: "enfants", label: "Enfants & Bébés", aliases: ["enfants", "enfants & bébés", "enfants & bebes", "bébé & enfant", "bebe enfant"] },
    { id: "cadeaux", label: "Packs & Idées Cadeaux", aliases: ["cadeaux", "packs & idées cadeaux", "packs & idees cadeaux", "packs cadeaux", "cartes", "affiches", "stickers", "coquestelephone", "coques téléphone", "pagnes"] },
    { id: "maison", label: "Maison & Déco", aliases: ["maison", "maison & déco", "maison & deco", "maison cuisine", "gantscuisine", "maniques", "coussins", "tabliers", "serviettes", "mugs", "gourdes"] },
    { id: "entreprise", label: "Entreprises & Événements", aliases: ["entreprise", "entreprises", "entreprise & b2b", "entreprises & b2b", "entreprise événement", "entreprise evenement", "entrepriseevenement", "packsentreprise", "packsevenement"] }
  ];

  function normalize(value) {
    return String(value || "").trim().toLowerCase().normalize("NFD")
      .replace(/[̀-ͯ]/g, "").replace(/[’']/g, "")
      .replace(/[^a-z0-9&]+/g, " ").replace(/s+/g, " ").trim();
  }

  const aliasMap = new Map();
  definitions.forEach((definition) => {
    [definition.id, definition.label, ...definition.aliases].forEach((alias) => aliasMap.set(normalize(alias), definition.id));
  });

  function resolve(value) {
    return aliasMap.get(normalize(value)) || null;
  }

  function label(value) {
    const id = resolve(value) || value;
    const definition = definitions.find((entry) => entry.id === id);
    return definition ? definition.label : String(value || "");
  }

  function idForItem(item, legacyCategory) {
    const haystack = normalize((item && item.title || "") + " " + (item && item.description || "") + " " + (item && item.image || ""));
    const has = (...words) => words.some((word) => haystack.includes(normalize(word)));
    const direct = resolve(item && item.category);
    const legacy = resolve(legacyCategory);

    // Classement éditorial : les indices explicites du produit priment sur
    // les anciennes catégories techniques du catalogue.
    if (has("entreprise", "corporate", "événement", "evenement", "séminaire", "seminaire", "staff", "logo")) return "entreprise";
    if (has("enfant", "bébé", "bebe", "junior", "naissance") || haystack.includes("ensembles enfants") || haystack.includes("robes enfants")) return "enfants";
    if (has("coussin", "cuisine", "tablier", "serviette", "mug", "gourde", "maison", "déco", "deco", "manique", "gant de cuisine")) return "maison";
    if (has("cadeau", "coffret", "pack", "maman", "papa", "souvenir", "sticker", "affiche")) return "cadeaux";
    if (has("t-shirt", "tshirt", "robe", "pantalon", "kimono", "chemise", "ensemble", "sweat", "hoodie", "jupe", "short", "polo", "boubou", "débardeur", "debardeur", "veste", "tenue")) return "vetements";
    if (direct) return direct;
    if (legacy) return legacy;
    return "accessoires";
  }

  function url(value) {
    const id = resolve(value);
    return id ? "boutique.html?categorie=" + encodeURIComponent(id) : "boutique.html";
  }

  window.ROSBriTaxonomy = Object.freeze({
    definitions: definitions.map((entry) => Object.freeze({ id: entry.id, label: entry.label })),
    normalize, resolve, label, idForItem, url
  });
})();
