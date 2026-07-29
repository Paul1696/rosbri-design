(function () {
  const SITE_URL = "https://rosbridesign.ateliersdepaul.com/";
  const WHATSAPP_PHONE = "237690087213";
  let catalog = normalizeCatalog(window.ROSBriCatalog || []);
  const categories = [
      "Tous",
      "Packs & Idées Cadeaux",
      "Tshirts", "Sacs", "Ensembles", "Babouches", "Sandales", "Chapeaux",
      "Casquettes", "Bobs", "Pochettes", "GantsCuisine", "Maniques", "Trousses",
      "Portefeuilles", "Accessoires", "Coussins", "Robes", "Boubous", "Chemises",
      "Sweats", "Hoodies", "Jupes", "Shorts", "Pantalons", "Bijoux", "Tabliers",
      "Serviettes", "Mugs", "Gourdes", "Affiches", "Cartes", "Stickers",
      "Pagnes", "CoquesTelephone", "Chaussures", "Polos", "Debardeurs"
    ];
  const productLabels = {
    Tous: "Tous les articles",
    Nouveautes: "Nouveautés",
    Populaires: "Populaires",
    PetitPrix: "Petit prix",
    Produits: "Produits",
    SurDevis: "Sur devis",
    Cadeaux: "Cadeaux",
    Famille: "Famille",
    Couple: "Couple",
    Entreprise: "Entreprise",
    Wax: "Wax",
    Maison: "Maison",
    CadeauxPersonnalises: "Cadeaux personnalisés",
    TassesGourdes: "Tasses & gourdes",
    TelephoneOrdinateur: "Téléphone & ordinateur",
    PapeteriePersonnalisee: "Papeterie personnalisée",
    MaisonCuisine: "Maison & cuisine",
    BebeEnfant: "Bébé & enfant",
    CoupleFamille: "Couple & famille",
    EntrepriseEvenement: "Entreprise & événement",
    WaxLifestyle: "Wax & lifestyle",
    PatrimoineCameroun: "Patrimoine Cameroun",
    PacksCadeaux: "Packs cadeaux",
    PacksEntreprise: "Packs entreprise",
    PacksFamille: "Packs famille",
    PacksEvenement: "Packs événement",
    "Packs & Idées Cadeaux": "Packs & Idées Cadeaux",
    Tshirts: "T-shirts",
    Polos: "Polos",
    Debardeurs: "Débardeurs",
    Sacs: "Sacs",
    SacsADos: "Sacs à dos",
    SacsDeVoyage: "Sacs de voyage",
    SacsCabas: "Sacs cabas",
    Bandoulieres: "Bandoulières",
    Ensembles: "Ensembles",
    Babouches: "Babouches",
    Sandales: "Sandales",
    Chaussures: "Chaussures",
    Chapeaux: "Chapeaux",
    Casquettes: "Casquettes",
    Bobs: "Bobs",
    Pochettes: "Pochettes",
    GantsCuisine: "Gants de cuisine",
    Maniques: "Maniques",
    Trousses: "Trousses",
    Portefeuilles: "Portefeuilles",
    Accessoires: "Accessoires",
    Coussins: "Coussins",
    Robes: "Robes",
    Boubous: "Boubous",
    Chemises: "Chemises",
    Sweats: "Sweats",
    Hoodies: "Hoodies",
    Jupes: "Jupes",
    Shorts: "Shorts",
    Pantalons: "Pantalons",
    Bijoux: "Bijoux",
    Tabliers: "Tabliers",
    Serviettes: "Serviettes",
    Mugs: "Mugs",
    Gourdes: "Gourdes",
    Affiches: "Affiches",
    Cartes: "Cartes de vœux",
    Stickers: "Stickers",
    Pagnes: "Pagnes",
    CoquesTelephone: "Coques de téléphone"
  };
  const subcategoryLabels = {
    Heritage: "Héritage & Culture",
    Anime: "Anime & Pop Culture",
    Maman: "Maman & Famille",
    Customisation: "Customisation",
    Accessoires: "Accessoires",
    Vetements: "Vêtements",
    Adultes: "Adultes",
    Enfants: "Enfants",
    Autres: "Autres"
  };
  const labels = { ...productLabels, ...subcategoryLabels };

  
  const categoryFamilies = {
    "MODE & TEXTILE": ["Tshirts", "Ensembles", "Casquettes", "Bobs", "Chapeaux", "Robes", "Chemises", "Boubous", "Polos", "Debardeurs", "Sweats", "Hoodies", "Jupes", "Shorts", "Pantalons"],
    "SACS & ACCESSOIRES": ["Sacs", "Pochettes", "Portefeuilles", "Trousses", "Accessoires", "Bijoux"],
    "CHAUSSURES": ["Babouches", "Sandales", "Chaussures"],
    "MAISON & CUISINE": ["GantsCuisine", "Maniques", "Coussins", "Tabliers", "Serviettes", "Mugs", "Gourdes"],
    "CADEAUX": ["Packs & Idées Cadeaux", "Cartes", "Affiches", "Stickers", "CoquesTelephone", "Pagnes"]
  };
  
  function getFamilyForCategory(cat) {
    for (const [family, cats] of Object.entries(categoryFamilies)) {
      if (cats.includes(cat)) return family;
    }
    return "AUTRES";
  }

  const state = {
    category: "Tous",
    subcategory: "Tous",
    query: "",
    price: "all",
    sort: "default",
    visibleLimit: 1000
  };
  const pageSize = 1000;
  const sizeOptions = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const childSizeOptions = ["1 an", "2 ans", "3 ans", "4 ans", "5 ans", "6 ans", "7 ans", "8 ans", "9 ans"];
  const shoeSizeOptions = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
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
  const categoryFolders = {
    Heritage: "heritage",
    Anime: "anime",
    Maman: "maman",
    Customisation: "customisation",
    Sacs: "sacs"
  };
  const colorSuffixes = [
    "rouge-corail", "sable-clair", "gris-fonce", "vert-foret", "vert-sauge", "vert-olive",
    "bleu-canard", "bleu-ciel", "bleu-nuit", "rouge", "blancs", "bordeaux", "menthe",
    "orange", "mauve", "jaune", "marron", "sable", "blanc", "noir", "rose", "gris", "dore"
  ];
  const slugToCategory = {};

  function slugFromFileName(fileName) {
    const base = fileName.replace(/\.(png|jpg|jpeg)$/i, "");
    for (let i = 0; i < colorSuffixes.length; i += 1) {
      const color = colorSuffixes[i];
      if (base.endsWith(`-${color}`)) {
        return base.slice(0, -(color.length + 1));
      }
    }
    return base;
  }

  function normalizeCatalog(items) {
    return (Array.isArray(items) ? items : [])
      .filter((item) => item && item.visible !== false)
      .map((item) => ({
        ...item,
        id: Number(item.id),
        title: item.title || item.name || "Article ROSBRI",
        category: item.category || "Accessoires",
        price: item.price || "Sur devis",
        image: item.image || item.image_url || "",
        description: item.description || "",
        isPack: item.isPack ?? item.is_pack ?? false,
        reviews: Array.isArray(item.reviews) ? item.reviews : []
      }));
  }

  function rebuildSlugToCategory() {
    Object.keys(slugToCategory).forEach((key) => delete slugToCategory[key]);
    catalog.forEach((item) => {
    const match = item.image.match(/^images\/(.+)\/variants\/(.+)\.png$/i);
    if (!match) return;
    slugToCategory[slugFromFileName(`${match[2]}.png`)] = match[1];
    });
  }

  rebuildSlugToCategory();

  const tshirtColors = {
    blanc: { label: "Blanc", swatch: "#eeeee5" },
    noir: { label: "Noir", swatch: "#1e1f1f" },
    sable: { label: "Sable", swatch: "#decfb5" },
    rose: { label: "Rose", swatch: "#f7b8c9" },
    mauve: { label: "Mauve", swatch: "#d7b3f4" },
    menthe: { label: "Vert menthe", swatch: "#cfeee4" },
    jaune: { label: "Jaune", swatch: "#ffe6a4" },
    "bleu-nuit": { label: "Bleu nuit", swatch: "#1e2b48" },
    gris: { label: "Gris", swatch: "#c9c9c7" },
    orange: { label: "Orange", swatch: "#ef6f16" },
    bordeaux: { label: "Bordeaux", swatch: "#762033" },
    "vert-sauge": { label: "Vert sauge", swatch: "#b9ca8b" },
    "vert-foret": { label: "Vert foret", swatch: "#184931" },
    "bleu-ciel": { label: "Bleu ciel", swatch: "#9fd2f2" },
    "vert-olive": { label: "Vert olive", swatch: "#536331" },
    "gris-fonce": { label: "Gris fonce", swatch: "#4d5354" },
    marron: { label: "Marron", swatch: "#4a2818" },
    "rouge-corail": { label: "Rouge corail", swatch: "#f04f43" },
    "sable-clair": { label: "Sable clair", swatch: "#eee1cd" },
    "bleu-canard": { label: "Bleu canard", swatch: "#468f96" }
  };
  const productColorVariants = {
    1: fullTshirtVariants("tshirt-reine-africaine-wax", ["orange", "mauve", "jaune", "bordeaux", "vert-sauge", "bleu-ciel", "noir", "sable", "rose", "gris"]),
    2: fullTshirtVariants("tshirt-luffy-feu-foudre", ["orange", "mauve", "jaune", "bordeaux", "vert-sauge", "bleu-ciel", "noir", "sable", "rose", "gris"]),
    3: fullTshirtVariants("tshirt-pont-allemands-edea", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    4: fullTshirtVariants("tshirt-merci-maman-meilleure", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    5: fullTshirtVariants("tshirt-maman-merci-pour-tout", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    6: fullTshirtVariants("tshirt-merci-maman-meilleure-studio", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    7: fullTshirtVariants("tshirt-maman-coeur-force", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    8: fullTshirtVariants("tshirt-maman-amour-force", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    9: fullTshirtVariants("tshirt-maman-merci-pour-tout-amour", ["blanc", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    10: fullTshirtVariants("tshirt-maman-mon-bonheur", ["blanc", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    11: fullTshirtVariants("tshirt-maman-mon-bonheur-studio", ["blanc", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    12: fullTshirtVariants("tshirt-maman-a-croquer", ["blanc", "sable", "vert-sauge", "mauve", "rose", "gris", "noir", "bleu-ciel", "bordeaux", "orange"]),
    13: fullTshirtVariants("tshirt-super-maman", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    14: fullTshirtVariants("tshirt-mom-maman-a-cherir", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    15: fullTshirtVariants("tshirt-mama-coeur-prenoms", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    16: fullTshirtVariants("tshirt-mom-personnalise-prenoms", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    17: fullTshirtVariants("tshirt-world-best-mom", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    18: fullTshirtVariants("tshirt-falaise-dschang", ["blanc", "sable", "vert-sauge", "bleu-ciel", "mauve", "gris", "noir", "bordeaux", "orange", "jaune"]),
    19: fullTshirtVariants("tshirt-chutes-lobe-kribi", ["vert-foret", "bordeaux", "jaune", "noir", "sable", "blanc", "gris", "bleu-ciel", "vert-sauge", "mauve"]),
    20: fullTshirtVariants("tshirt-mont-cameroun-buea", ["vert-foret", "bordeaux", "jaune", "sable", "noir", "blanc", "gris-fonce", "vert-olive", "orange", "gris"]),
    21: fullTshirtVariants("tshirt-cases-mousgoum-maroua", ["vert-foret", "bordeaux", "jaune", "sable", "noir", "bleu-ciel", "vert-sauge", "rose", "mauve", "orange"]),
    22: fullTshirtVariants("tshirt-rois-bamoun-foumban", ["vert-foret", "bordeaux", "jaune", "sable", "noir", "blanc", "vert-olive", "marron", "gris-fonce", "orange"]),
    23: fullTshirtVariants("tshirt-nouvelle-liberte-douala", ["gris", "rose", "sable", "noir", "bleu-ciel", "vert-sauge", "bordeaux", "jaune", "mauve", "orange"]),
    24: fullTshirtVariants("tshirt-monument-reunification-yaounde", ["vert-foret", "bordeaux", "jaune", "noir", "sable", "blanc", "vert-olive", "orange", "gris-fonce", "bleu-nuit"]),
    25: fullTshirtVariants("tshirt-mayi-09-mai", ["sable", "bleu-ciel", "vert-sauge", "mauve", "jaune", "orange", "bleu-nuit", "gris-fonce", "bordeaux", "rouge-corail"]),
    26: fullTshirtVariants("tshirt-je-suis-batanga", ["sable", "blanc", "vert-sauge", "mauve", "jaune", "rose", "bleu-ciel", "bordeaux", "noir", "gris"]),
    27: fullTshirtVariants("tshirt-kribi-cest-ma-ville", ["blanc", "sable", "vert-sauge", "mauve", "rose", "bleu-ciel", "jaune", "gris", "menthe", "sable-clair"]),
    28: fullTshirtVariants("tshirt-mayi-kribi-batanga", ["blanc", "noir", "sable", "gris", "bleu-ciel", "vert-sauge", "rose", "mauve", "sable-clair", "jaune"]),
    29: fullTshirtVariants("tshirt-fete-mayi-kribi-batanga", ["blanc", "sable", "vert-sauge", "bleu-ciel", "mauve", "rose", "gris", "bleu-canard", "jaune", "sable-clair"]),
    30: fullTshirtVariants("tshirt-mayi-2026-batanga", ["vert-sauge", "sable", "blanc", "rose", "bleu-ciel", "mauve", "jaune", "orange", "gris", "bleu-nuit"]),
    31: fullTshirtVariants("tshirt-for-you-jimmy", ["blanc", "sable", "rose", "vert-sauge", "mauve", "bleu-ciel", "gris", "jaune", "bordeaux", "noir"]),
    32: fullTshirtVariants("duo-tshirts-big-brother-lil-brother", ["blanc", "sable", "sable-clair", "rose", "vert-sauge", "mauve", "bleu-ciel", "gris", "bordeaux", "noir"]),
    39: fullTshirtVariants("tshirt-systeme-solaire-pacman", ["blanc","gris","bleu-nuit","bleu-ciel","bordeaux","vert-foret","vert-sauge","sable","noir","orange"]),
    40: fullTshirtVariants("tshirt-life-is-beautiful-mandala", ["blanc","noir","gris","bleu-nuit","bleu-ciel","bordeaux","vert-foret","vert-sauge","rose","jaune"]),
    41: fullTshirtVariants("tshirt-des-colores-eclaboussures", ["noir","blanc","gris","bleu-nuit","bleu-ciel","vert-sauge","bordeaux","vert-foret","sable","jaune"]),
    42: fullTshirtVariants("tshirt-queen-heritage-africain", ["noir","blanc","gris","bleu-nuit","bleu-ciel","vert-sauge","bordeaux","vert-foret","sable","jaune"]),
    43: fullTshirtVariants("tshirt-black-is-beautiful-heritage", ["noir","blanc","gris","bleu-nuit","bleu-ciel","vert-sauge","bordeaux","vert-foret","sable","jaune"]),
    44: fullTshirtVariants("tshirt-landry-feg-leopard", ["noir","sable","gris","bleu-nuit","bleu-ciel","vert-sauge","bordeaux","vert-foret","jaune","blanc"]),
    45: fullTshirtVariants("tshirt-profil-femme-afrique-colore", ["noir","blanc","gris","bleu-nuit","bleu-ciel","vert-sauge","bordeaux","vert-foret","sable","jaune"]),
    46: fullTshirtVariants("tshirt-heritage-afrique-savane-coucher-soleil", ["blanc","gris","bleu-nuit","bleu-ciel","bordeaux","vert-foret","vert-sauge","sable","orange","noir"]),
    47: fullTshirtVariants("tshirt-ako-yem-trois-femmes-tropical", ["blanc","sable","noir","bleu-nuit","bleu-ciel","vert-foret","bordeaux","jaune","rose","menthe"]),
    48: fullTshirtVariants("tshirt-maman-bonne-fete-des-meres-tropical", ["blanc","sable","noir","bleu-nuit","bleu-ciel","vert-foret","bordeaux","jaune","rose","menthe"])
  };
  const productVariantSlugs = {};
  const orderState = {
    item: null,
    sizes: ["M"],
    sizeQuantities: { M: 1 },
    shoeSizes: ["39"],
    shoeSizeQuantities: { 39: 1 },
    color: colorVariants[0].id,
    quantity: 1
  };
  const variantGroups = [];
  const hiddenProductIds = [];
  const groupedVariantIds = new Set([
    ...variantGroups.flatMap((group) => group.variantIds),
    ...hiddenProductIds
  ]);
  let catalogView = [];
  let categoryCounts = {};
  let searchIndex = new Map();

  function rebuildCatalogState() {
    rebuildSlugToCategory();
    const visibleVariantGroups = variantGroups.filter(isVisibleCatalogItem);
    catalogView = [
      ...catalog.filter((item) => !groupedVariantIds.has(item.id) && isVisibleCatalogItem(item)),
      ...visibleVariantGroups.map((group) => ({
        ...group,
        id: group.id,
        sourceIds: group.variantIds
      }))
    ].sort((a, b) => {
      return catalogOrderKey(a) - catalogOrderKey(b);
    });
    categoryCounts = categories.reduce((counts, category) => {
      counts[category] = catalogView.filter((item) => categoryMatches(item, category)).length;
      return counts;
    }, {});
    searchIndex = new Map(catalogView.map((item) => [
      item.id,
      normalizeText(`${displayTitle(item)} ${productDescription(item)} ${productLabel(item)} ${subcategoryLabel(item)} ${item.title} ${item.category} ${item.price} ${item.badge || ""} ${(item.items || []).join(" ")} tailles pointures avis pack ${(item.reviews || []).map((review) => `${review.name} ${review.text}`).join(" ")} ${(item.sourceIds || []).join(" ")}`)
    ]));
  }

  rebuildCatalogState();

  function byId(id) {
    return document.getElementById(id);
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function productVariant(productSlug, colorSlug, label, swatch) {
    const folder = slugToCategory[productSlug] || categoryFolders.Heritage;
    return {
      id: colorSlug,
      label,
      swatch,
      image: `images/${folder}/variants/${productSlug}-${colorSlug}.png`
    };
  }

  function fullTshirtVariants(productSlug, colorIds) {
    return colorIds.map((colorId) => {
      const color = tshirtColors[colorId];
      return productVariant(productSlug, colorId, color.label, color.swatch);
    });
  }

  function universalProductVariants(productSlug) {
    return colorVariants.map((variant) => (
      productVariant(productSlug, variant.id, variant.label, variant.swatch)
    ));
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
    return item.title || subcategoryLabels[item.category] || "Article personnalisé";
  }

  function productDescription(item) {
    return item.description || "Creation ROSBRI au motif imprime, pensee pour une finition originale et soignee.";
  }

  function productCategory(item) {
    if (item.commercialOffer && productLabels[item.category]) return item.category;
    if (item.isPack || item.category === "Packs & Idées Cadeaux") return "Packs & Idées Cadeaux";
    const path = item.image || "";
    const match = path.match(/^images\/articles-site\/([^/]+)/i);
    const folder = match ? match[1] : "";
    const map = {
      tshirts: "Tshirts",
      polos: "Polos",
      debardeurs: "Debardeurs",
      sacs: "Sacs",
      ensembles: "Ensembles",
      babouches: "Babouches",
      sandales: "Sandales",
      chaussures: "Chaussures",
      chapeaux: "Chapeaux",
      casquettes: "Casquettes",
      bobs: "Bobs",
      pochettes: "Pochettes",
      "gants-cuisine": "GantsCuisine",
      maniques: "Maniques",
      trousses: "Trousses",
      portefeuilles: "Portefeuilles",
      accessoires: "Accessoires",
      coussins: "Coussins",
      robes: "Robes",
      boubous: "Boubous",
      chemises: "Chemises",
      sweats: "Sweats",
      hoodies: "Hoodies",
      jupes: "Jupes",
      shorts: "Shorts",
      pantalons: "Pantalons",
      bijoux: "Bijoux",
      tabliers: "Tabliers",
      serviettes: "Serviettes",
      mugs: "Mugs",
      gourdes: "Gourdes",
      affiches: "Affiches",
      cartes: "Cartes",
      stickers: "Stickers",
      pagnes: "Pagnes",
      "coques-telephone": "CoquesTelephone"
    };
    return map[folder] || item.category || "Autres";
  }

  function isQuoteItem(item) {
    return item.price === "Sur devis" || item.badge === "Sur devis";
  }

  function isNewItem(item) {
    return item.badge === "Nouveau" || item.launchFirst === true || (item.commercialOffer === true && !item.isPack);
  }

  function isPopularItem(item) {
    return item.badge === "Populaire" || item.launchFirst === true || item.recommendedPack === true;
  }

  function isSmallPriceItem(item) {
    return item.badge === "Petit prix" || priceBand(item) === "starter" || priceBand(item) === "low";
  }

  function matchText(item, words) {
    const text = normalizeText(`${displayTitle(item)} ${productDescription(item)} ${productLabel(item)} ${item.badge || ""} ${(item.items || []).join(" ")}`);
    return words.some((word) => text.includes(normalizeText(word)));
  }

  function categoryMatches(item, category) {
    const productCat = productCategory(item);
    if (category === "Tous") return true;
    if (category === "Nouveautes") return isNewItem(item);
    if (category === "Populaires") return isPopularItem(item);
    if (category === "PetitPrix") return isSmallPriceItem(item);
    if (category === "Produits") return !item.isPack;
    if (category === "Packs & Idées Cadeaux") return item.isPack || productCat === "Packs & Idées Cadeaux";
    if (category === "SurDevis") return isQuoteItem(item);
    if (category === "Cadeaux") return ["CadeauxPersonnalises", "PacksCadeaux"].includes(productCat) || matchText(item, ["cadeau", "maman", "papa", "souvenir"]);
    if (category === "Famille") return ["CoupleFamille", "PacksFamille"].includes(productCat) || matchText(item, ["famille", "maman", "papa", "naissance", "bapteme"]);
    if (category === "Couple") return productCat === "CoupleFamille" || matchText(item, ["couple", "mariage", "evjf", "saint-valentin"]);
    if (category === "Entreprise") return ["EntrepriseEvenement", "PacksEntreprise"].includes(productCat) || matchText(item, ["entreprise", "bureau", "staff", "logo", "seminaire"]);
    if (category === "Wax") return productCat === "WaxLifestyle" || matchText(item, ["wax"]);
    if (category === "Maison") return productCat === "MaisonCuisine" || matchText(item, ["maison", "cuisine", "table", "coussin"]);
    return productCat === category;
  }

  function productSubcategory(item) {
    const category = productCategory(item);
    const path = item.image || "";
    if (category === "Tshirts") {
      return subcategoryLabels[item.category] ? item.category : "Autres";
    }
    if (category === "Ensembles") {
      if (path.includes("/ensembles/enfants/")) return "Enfants";
      if (path.includes("/ensembles/adultes/")) return "Adultes";
      if (path.includes("/ensembles/vetements/")) return "Adultes";
    }
    if (category === "Robes") {
      if (path.includes("/robes/enfants/")) return "Enfants";
      if (path.includes("/robes/adultes/")) return "Adultes";
    }
    return "Tous";
  }

  function productLabel(item) {
    return productLabels[productCategory(item)] || productCategory(item);
  }

  function subcategoryLabel(item) {
    const subcategory = productSubcategory(item);
    return subcategory === "Tous" ? "" : (subcategoryLabels[subcategory] || subcategory);
  }

  function productMetaLabel(item) {
    const category = productCategory(item);
    const subcategory = subcategoryLabel(item);
    if (item.isPack) {
      return productLabels[category] || "Pack";
    }
    return subcategory ? `${productLabels[category]} - ${subcategory}` : productLabels[category];
  }

  function catalogOrderKey(item) {
    return Array.isArray(item.sourceIds) ? Math.min(...item.sourceIds) : item.id;
  }

  function isTshirt(item) {
    if (!item) return false;
    const cat = (productCategory(item) || "").toLowerCase();
    const title = (displayTitle(item) || item.title || "").toLowerCase();
    return title.includes("t-shirt") || title.includes("tshirt") || title.includes("t shirt") || cat.includes("tshirt") || cat.includes("vetement") || cat.includes("vêtements") || isClothing(item);
  }

  function isClothing(item) {
    if (item.requiresSize) return true;
    const cat = productCategory(item);
    const title = (displayTitle(item) || item.title || "").toLowerCase();
    if (title.includes("t-shirt") || title.includes("tshirt") || title.includes("ensemble") || title.includes("robe") || title.includes("chemise") || title.includes("kimono")) return true;
    return ["Tshirts", "Ensembles", "Robes", "Boubous", "Chemises", "Polos", "Debardeurs", "Vêtements"].includes(cat);
  }

  function isChildClothing(item) {
    if (item.requiresChildSize) return true;
    return isClothing(item) && (productSubcategory(item) === "Enfants" || (displayTitle(item) || "").toLowerCase().includes("enfant") || (displayTitle(item) || "").toLowerCase().includes("bébé"));
  }

  function sizeOptionsFor(item) {
    return isChildClothing(item) ? childSizeOptions : sizeOptions;
  }

  function isFootwear(item) {
    return ["Babouches", "Sandales", "Chaussures"].includes(productCategory(item));
  }

  function isVisibleCatalogItem(item) {
    return Boolean(item);
  }

  function productVariantsFor(item) {
    if (!item) return [];
    if (Array.isArray(item.colorVariants) && item.colorVariants.length) return item.colorVariants;
    const productSlug = productVariantSlugs[item.id];
    return productSlug ? universalProductVariants(productSlug) : (productColorVariants[item.id] || []);
  }

  function colorOptionsFor(item) {
    if (!item) return [];
    if (Array.isArray(item.colorVariants) && item.colorVariants.length) return item.colorVariants;
    if (!isTshirt(item) && !isClothing(item)) return [];
    const productVariants = productVariantsFor(item);
    if (productVariants.length > colorVariants.length) return productVariants;
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

  function selectedColor() {
    const options = colorOptionsFor(orderState.item);
    return options.find((variant) => variant.id === orderState.color) || options[0] || colorVariants[0];
  }

  function selectedSizeQuantities() {
    return orderState.sizes.map((size) => ({
      size,
      quantity: Math.max(1, Math.min(99, Number(orderState.sizeQuantities[size]) || 1))
    }));
  }

  function totalSelectedSizeQuantity() {
    return selectedSizeQuantities().reduce((total, item) => total + item.quantity, 0);
  }

  function sizeQuantitiesText() {
    return selectedSizeQuantities().map((item) => `${item.size} x ${item.quantity}`).join(", ");
  }

  function selectedShoeSizeQuantities() {
    return orderState.shoeSizes.map((size) => ({
      size,
      quantity: Math.max(1, Math.min(99, Number(orderState.shoeSizeQuantities[size]) || 1))
    }));
  }

  function totalSelectedShoeSizeQuantity() {
    return selectedShoeSizeQuantities().reduce((total, item) => total + item.quantity, 0);
  }

  function shoeSizeQuantitiesText() {
    return selectedShoeSizeQuantities().map((item) => `${item.size} x ${item.quantity}`).join(", ");
  }

  function cartItems() {
    try {
      return JSON.parse(localStorage.getItem("rosbriCart") || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveCartItems(items) {
    localStorage.setItem("rosbriCart", JSON.stringify(items));
  }

  function whatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }

  function orderButtonLabel(item) {
    return isQuoteItem(item) ? "Demander un devis sur WhatsApp" : "Commander sur WhatsApp";
  }

  function orderUrlWithOptions(item, options = {}) {
    const productUrl = `${SITE_URL}boutique.html#article-${item.id}`;
    let msg = "";
    if (isQuoteItem(item)) {
      msg += `Bonjour ROSBRI DESIGN, je voudrais un devis pour : ${displayTitle(item)}.\n`;
      msg += `Quantité souhaitée :\n`;
      msg += `Délai souhaité :\n`;
      msg += `Détails de personnalisation :\n\n`;
    } else if (item.isPack) {
      const content = (item.items || []).length ? item.items.join(" + ") : "Articles assortis";
      msg += `Bonjour ROSBRI DESIGN, je suis intéressé par le pack : ${displayTitle(item)}.\n`;
      msg += `Contenu : ${content}.\n`;
      msg += `Je voudrais avoir plus d’informations et passer commande.\n\n`;
    } else {
      msg += `Bonjour ROSBRI DESIGN, je suis intéressé par : ${displayTitle(item)}.\n`;
      msg += `Je voudrais avoir plus d’informations et passer commande.\n\n`;
    }

    let hasOptions = false;
    let optionsText = `Détails de la commande :\n`;

    if (options.color) {
      optionsText += `- Couleur : ${options.color}\n`;
      hasOptions = true;
    }

    if (options.sizeQuantities && options.sizeQuantities.length) {
      const sizesStr = options.sizeQuantities.map((entry) => `${entry.size} (x${entry.quantity})`).join(", ");
      optionsText += `- Taille(s) : ${sizesStr}\n`;
      hasOptions = true;
    } else if (options.sizes && options.sizes.length) {
      optionsText += `- Taille(s) : ${options.sizes.join(", ")}\n`;
      hasOptions = true;
    }

    if (options.shoeSizeQuantities && options.shoeSizeQuantities.length) {
      const shoesStr = options.shoeSizeQuantities.map((entry) => `${entry.size} (x${entry.quantity})`).join(", ");
      optionsText += `- Pointure(s) : ${shoesStr}\n`;
      hasOptions = true;
    } else if (options.shoeSizes && options.shoeSizes.length) {
      optionsText += `- Pointure(s) : ${options.shoeSizes.join(", ")}\n`;
      hasOptions = true;
    }

    const showsIndividualQuantities = (options.sizeQuantities && options.sizeQuantities.length) || (options.shoeSizeQuantities && options.shoeSizeQuantities.length);
    if (options.quantity && !showsIndividualQuantities) {
      optionsText += `- Quantité : ${options.quantity}\n`;
      hasOptions = true;
    }

    if (hasOptions) {
      msg += optionsText + `\n`;
    }

    msg += `Lien produit : ${productUrl}`;

    return whatsAppUrl(msg);
  }

  function optimizedImage(path) {
    return path.includes("/placeholders/") ? `${path}?v=20260606-pro` : path;
  }

  function priceBand(item) {
    if (item.price === "Sur devis") return "quote";
    if (item.price.includes("1 000") || item.price.includes("1 500") || item.price.includes("3 500")) return "starter";
    if (item.price.includes("4 500") || item.price.includes("5 000")) return "low";
    if (item.price.includes("6 500")) return "mid";
    if (item.price.includes("8 500") || item.price.includes("10 000")) return "premium";
    if (item.price.includes("12 000") || item.price.includes("15 000") || item.price.includes("17 000") || item.price.includes("18 000") || item.price.includes("20 000") || item.price.includes("25 000") || item.price.includes("30 000")) return "set";
    return "premium";
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getProductSlug(item) {
    if (!item) return "";
    if (item.slug) return item.slug;
    const title = displayTitle(item);
    const clean = title.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `${clean}-${item.id}`;
  }

  function findProductBySlugOrId(identifier) {
    if (!identifier) return null;
    const target = String(identifier).toLowerCase().trim();
    let match = catalogView.find((item) => String(item.id) === target);
    if (match) return match;
    match = catalogView.find((item) => getProductSlug(item).toLowerCase() === target);
    if (match) return match;
    const idMatch = target.match(/-(\d+)$/);
    if (idMatch) {
      match = catalogView.find((item) => String(item.id) === idMatch[1]);
      if (match) return match;
    }
    return null;
  }

  function productCard(item, compact, eager) {
    const title = displayTitle(item);
    const category = productCategory(item);
    const badge = item.badge || (item.isPack ? "Pack" : (productLabels[category] || category));
    const loading = eager ? "eager" : "lazy";
    const priority = eager ? ' fetchpriority="high"' : '';
    const displayPrice = item.price ? item.price : "Sur Devis";
    const slug = getProductSlug(item);
    
    return `
      <a href="produit.html?slug=${encodeURIComponent(slug)}" data-slug="${slug}" data-open-product="${item.id}" data-product-slug="${slug}" class="product-card product-card-link group block bg-white/80 backdrop-blur-sm rounded-xl p-4 soft-shadow hover-lift border border-surface-variant/50 cursor-pointer transition-all duration-300 hover:border-champagne/60 focus:outline-none focus:ring-2 focus:ring-champagne no-underline text-ink" aria-label="${escapeHtml(title)} - ${escapeHtml(displayPrice)}">
        <div class="aspect-[4/5] rounded-lg overflow-hidden bg-cream mb-4 relative pointer-events-none">
          <img alt="${escapeHtml(title)}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none" src="${optimizedImage(displayImage(item))}" loading="${loading}" decoding="async"${priority}>
          <span class="absolute top-3 left-3 bg-champagne text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm pointer-events-none">${badge}</span>
        </div>
        <h4 class="font-headline-md text-lg mb-1 group-hover:text-champagne transition-colors line-clamp-2 text-ink font-bold pointer-events-none">${escapeHtml(title)}</h4>
        <p class="text-on-surface-variant text-sm mb-3 opacity-70 pointer-events-none">${escapeHtml(category)}</p>
        <div class="font-display-accent text-xl text-ink font-bold pointer-events-none">${escapeHtml(displayPrice)}</div>
      </a>
    `;
  }

  function emptyCard() {
    return `
      <div class="col-span-full py-12 text-center bg-surface-variant/30 rounded-2xl border border-surface-variant/50">
        <h3 class="font-display-accent text-2xl text-ink mb-2">Aucun article trouvÃ©</h3>
        <p class="text-on-surface-variant">Essayez une autre catÃ©gorie ou un autre mot-clÃ©.</p>
      </div>
    `;
  }

  function filteredCatalog() {
    const query = normalizeText(state.query.trim());
    let result = catalogView.filter((item) => {
      const categoryMatch = categoryMatches(item, state.category);
      const subcategoryMatch = state.subcategory === "Tous" || productSubcategory(item) === state.subcategory;
      const queryMatch = !query || (searchIndex.get(item.id) || "").includes(query);
      const priceMatch = state.price === "all" || priceBand(item) === state.price;
      return categoryMatch && subcategoryMatch && queryMatch && priceMatch;
    });

    if (state.sort === "name") {
      result = result.slice().sort((a, b) => displayTitle(a).localeCompare(displayTitle(b)));
    }

    if (state.sort === "category") {
      result = result.slice().sort((a, b) => productCategory(a).localeCompare(productCategory(b)) || catalogOrderKey(a) - catalogOrderKey(b));
    }

    if (state.sort === "price") {
      const order = { starter: 0, low: 1, mid: 2, premium: 3, set: 4, quote: 5 };
      result = result.slice().sort((a, b) => order[priceBand(a)] - order[priceBand(b)] || catalogOrderKey(a) - catalogOrderKey(b));
    }

    return result;
  }

  function renderB2B() {
    const target = byId("b2b-grid");
    if (!target) return;
    const picks = catalogView.filter((item) => productCategory(item) === "Entreprise & B2B").slice(0, 4);
    target.innerHTML = picks.map((item, index) => productCard(item, true, index < 4)).join("");
    announceRender(target);
  }

  function renderFeatured() {
    const target = byId("featured-grid");
    if (!target) return;

    // Obtenir toutes les catÃ©gories uniques
    const allCategories = [...new Set(catalogView.map(item => productCategory(item)))];
    let picks = [];
    
    // MÃ©langer un tableau (Fisher-Yates)
    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    // Prendre au moins un article de chaque catÃ©gorie
    let remainingItems = [...catalogView];
    shuffle(allCategories).forEach(cat => {
        const catItems = remainingItems.filter(item => productCategory(item) === cat);
        if (catItems.length > 0 && picks.length < 10) {
            const picked = catItems[Math.floor(Math.random() * catItems.length)];
            picks.push(picked);
            remainingItems = remainingItems.filter(item => item.id !== picked.id);
        }
    });

    // ComplÃ©ter jusqu'Ã  10 avec des articles alÃ©atoires du reste du catalogue
    if (picks.length < 10) {
        shuffle(remainingItems);
        picks = picks.concat(remainingItems.slice(0, 10 - picks.length));
    }

    // MÃ©langer les picks finaux pour ne pas avoir toujours le mÃªme ordre de catÃ©gories
    shuffle(picks);

    target.innerHTML = picks.map((item, index) => productCard(item, true, index < 4)).join("");
    announceRender(target);
  }


  function renderCuratedGrid(id, predicate, limit = 8) {
    const target = byId(id);
    if (!target) return;
    const picks = catalogView.filter(predicate).slice(0, limit);
    target.innerHTML = picks.length
      ? picks.map((item, index) => productCard(item, true, index < 4)).join("")
      : emptyCard();
    announceRender(target);
  }

  function renderCommercialSections() {
    renderCuratedGrid("launch-grid", (item) => item.launchFirst === true, 5);
    renderCuratedGrid("popular-packs-grid", (item) => item.recommendedPack === true, 5);
    renderCuratedGrid("personalized-products-grid", (item) => item.commercialOffer === true && !item.isPack, 5);
    renderCuratedGrid("business-events-grid", (item) => ["EntrepriseEvenement", "PacksEntreprise", "PacksEvenement"].includes(productCategory(item)), 5);
  }

  function updateLoadMore(total) {
    const button = byId("catalog-load-more");
    if (!button) return;

    const remaining = Math.max(0, total - state.visibleLimit);
    button.hidden = remaining <= 0;
    if (remaining <= 0) {
      button.textContent = "Afficher plus";
      return;
    }
    button.textContent = remaining > pageSize
      ? `Afficher ${pageSize} articles de plus`
      : `Afficher les ${remaining} derniers articles`;
  }

  function renderShop() {
    const grid = byId("shop-grid");
    if (!grid) return;

    const result = filteredCatalog();
    state.visibleLimit = Math.min(state.visibleLimit, Math.max(pageSize, result.length));
    const visible = result.slice(0, state.visibleLimit);
    grid.innerHTML = visible.length
      ? visible.map((item, index) => productCard(item, false, index < 8)).join("")
      : emptyCard();
    announceRender(grid);
    updateLoadMore(result.length);

    const count = byId("result-count");
    if (count) {
      count.textContent = `${visible.length} article${visible.length > 1 ? "s" : ""} affiché${visible.length > 1 ? 's' : ''} sur ${result.length}`;
    }
  }

  function renderFilters() {
    const target = byId("filter-list");
    if (!target) return;

    const families = {};
    Object.keys(categoryFamilies).forEach(fam => families[fam] = { categories: [], total: 0 });
    families["AUTRES"] = { categories: [], total: 0 };
    
    const validCategories = categories.filter((category) => category !== "Tous" && (categoryCounts[category] || 0) > 0);
    validCategories.forEach(cat => {
        const fam = getFamilyForCategory(cat);
        const count = categoryCounts[cat] || 0;
        if (!families[fam]) families[fam] = { categories: [], total: 0 };
        families[fam].categories.push({ name: cat, count: count });
        families[fam].total += count;
    });

    if (state.category !== "Tous" && !state.openFamily) {
        state.openFamily = getFamilyForCategory(state.category);
    }

    const tousCount = catalogView.length;
    const tousActive = state.category === "Tous";
    const tousBtn = `
        <button class="filter-btn group flex items-center justify-between w-full p-3.5 mb-6 rounded-xl transition-all duration-300 cursor-pointer ${tousActive ? 'bg-[#775a19] text-white shadow-md shadow-primary/20 scale-[1.02]' : 'bg-surface-variant/30 text-ink hover:bg-surface-variant'}" type="button" data-category="Tous">
            <span class="font-bold tracking-wide">Tous les articles</span>
            <span class="text-xs px-2.5 py-1 rounded-full font-bold ${tousActive ? 'bg-white/20 text-white' : 'bg-white text-primary shadow-sm'}">${tousCount}</span>
        </button>
    `;

    let familiesHtml = "";
    Object.keys(families).forEach(famName => {
        const famData = families[famName];
        if (famData.categories.length === 0) return;
        
        const isOpen = state.openFamily === famName;
        
        const majorCats = [];
        const minorCats = [];
        famData.categories.forEach(c => {
            if (c.count <= 3) minorCats.push(c);
            else majorCats.push(c);
        });
        
        let catsHtml = "";
        const renderCat = (c) => {
            const isActive = state.category === c.name;
            return `
                <button class="filter-btn group flex items-center justify-between w-full py-2.5 px-4 rounded-lg transition-all duration-300 cursor-pointer text-body-md ${isActive ? 'bg-[#f8f1e3] border-l-4 border-primary text-primary font-bold shadow-sm' : 'text-ink hover:bg-surface-variant/50 hover:pl-5 border-l-4 border-transparent'}" type="button" data-category="${c.name}">
                    <span>${labels[c.name] || c.name}</span>
                    <span class="text-xs px-2 py-0.5 rounded-full transition-colors ${isActive ? 'bg-primary text-white' : 'bg-surface-variant text-muted group-hover:bg-white group-hover:text-primary group-hover:shadow-sm'}">${c.count}</span>
                </button>
            `;
        };
        
        majorCats.forEach(c => catsHtml += renderCat(c));
        
        if (minorCats.length > 0) {
            const hasActiveMinor = minorCats.some(c => c.name === state.category);
            catsHtml += `
                <details class="group/details mt-1" ${hasActiveMinor ? 'open' : ''}>
                    <summary class="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted hover:text-primary hover:bg-surface-variant/30 px-4 py-2 rounded-lg list-none [&::-webkit-details-marker]:hidden transition-colors">
                        <span class="material-symbols-outlined text-[18px] group-open/details:rotate-180 transition-transform duration-300">expand_more</span>
                        Voir ${minorCats.length} autres
                    </summary>
                    <div class="pl-2 mt-1 space-y-1 relative before:content-[''] before:absolute before:left-6 before:top-0 before:bottom-2 before:w-px before:bg-line">
                        ${minorCats.map(c => renderCat(c)).join("")}
                    </div>
                </details>
            `;
        }

        familiesHtml += `
            <div class="border-b border-line/50 last:border-0 pb-3 mb-3">
                <button class="family-toggle flex items-center justify-between w-full py-3 px-2 text-left group rounded-lg hover:bg-surface-variant/20 transition-colors" data-family="${famName}">
                    <span class="font-bold text-[13px] uppercase tracking-widest transition-colors ${isOpen ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}">${famName}</span>
                    <div class="flex items-center gap-2 transition-colors ${isOpen ? 'text-primary' : 'text-muted group-hover:text-primary'}">
                        <span class="text-[11px] px-2 py-0.5 rounded-full font-bold ${isOpen ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-muted'}">${famData.total}</span>
                        <span class="material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}">expand_more</span>
                    </div>
                </button>
                <div class="grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}">
                    <div class="overflow-hidden">
                        <div class="space-y-1 pb-2">
                            ${catsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    target.innerHTML = `
      <div class="space-y-1">
        ${tousBtn}
        <div class="px-1">
            ${familiesHtml}
        </div>
      </div>
    `;
  }

  function resetVisibleLimit() {
    state.visibleLimit = pageSize;
  }

  function optionMarkup(item) {
    const clothing = isClothing(item);
    const footwear = isFootwear(item);
    const activeSizeOptions = sizeOptionsFor(item);
    const sizePicker = clothing
      ? `
        <div class="option-group">
          <strong>Taille</strong>
          <div class="size-list" role="group" aria-label="Choisir une ou plusieurs tailles">
            ${activeSizeOptions.map((size) => `
              <button class="size-btn${orderState.sizes.includes(size) ? " active" : ""}" type="button" data-size="${size}" aria-pressed="${orderState.sizes.includes(size)}">${size}</button>
            `).join("")}
          </div>
        </div>
      `
      : "";

    const sizeQuantityPicker = clothing
      ? `
        <div class="option-group">
          <strong>Quantité par taille</strong>
          <div class="size-quantity-list">
            ${selectedSizeQuantities().map((entry) => `
              <div class="size-quantity-row">
                <span>${entry.size}</span>
                <div class="quantity-control compact">
                  <button type="button" data-size-quantity="${entry.size}" data-size-quantity-step="-1" aria-label="Retirer un article taille ${entry.size}">-</button>
                  <input type="number" min="1" max="99" value="${entry.quantity}" inputmode="numeric" data-size-quantity-input="${entry.size}" aria-label="Quantite taille ${entry.size}">
                  <button type="button" data-size-quantity="${entry.size}" data-size-quantity-step="1" aria-label="Ajouter un article taille ${entry.size}">+</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `
      : "";

    const shoeSizePicker = footwear
      ? `
        <div class="option-group">
          <strong>Pointure</strong>
          <div class="size-list" role="group" aria-label="Choisir une ou plusieurs pointures">
            ${shoeSizeOptions.map((size) => `
              <button class="size-btn${orderState.shoeSizes.includes(size) ? " active" : ""}" type="button" data-shoe-size="${size}" aria-pressed="${orderState.shoeSizes.includes(size)}">${size}</button>
            `).join("")}
          </div>
        </div>
      `
      : "";

    const shoeSizeQuantityPicker = footwear
      ? `
        <div class="option-group">
          <strong>Quantité par pointure</strong>
          <div class="size-quantity-list">
            ${selectedShoeSizeQuantities().map((entry) => `
              <div class="size-quantity-row">
                <span>${entry.size}</span>
                <div class="quantity-control compact">
                  <button type="button" data-shoe-size-quantity="${entry.size}" data-shoe-size-quantity-step="-1" aria-label="Retirer un article pointure ${entry.size}">-</button>
                  <input type="number" min="1" max="99" value="${entry.quantity}" inputmode="numeric" data-shoe-size-quantity-input="${entry.size}" aria-label="Quantite pointure ${entry.size}">
                  <button type="button" data-shoe-size-quantity="${entry.size}" data-shoe-size-quantity-step="1" aria-label="Ajouter un article pointure ${entry.size}">+</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
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

    return `
      <div class="order-options">
        ${sizePicker}
        ${sizeQuantityPicker}
        ${shoeSizePicker}
        ${shoeSizeQuantityPicker}
        ${colorPicker}
        ${clothing || footwear ? "" : `
          <div class="option-group quantity-group">
            <strong>Quantité</strong>
            <div class="quantity-control">
              <button type="button" data-quantity-step="-1" aria-label="Retirer un article">-</button>
              <input id="quantity-input" type="number" min="1" max="99" value="${orderState.quantity}" inputmode="numeric">
              <button type="button" data-quantity-step="1" aria-label="Ajouter un article">+</button>
            </div>
          </div>
        `}
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
    const order = byId("lightbox-order") || byId("detail-whatsapp-btn");
    const clothing = isClothing(orderState.item);
    const footwear = isFootwear(orderState.item);
    const colorChoices = hasColorChoices(orderState.item);
    const sizeQuantities = clothing ? selectedSizeQuantities() : [];
    const shoeSizeQuantities = footwear ? selectedShoeSizeQuantities() : [];
    const selectedOptions = {
      sizes: clothing ? orderState.sizes.slice() : [],
      sizeQuantities,
      shoeSizes: footwear ? orderState.shoeSizes.slice() : [],
      shoeSizeQuantities,
      color: colorChoices ? selectedColor().label : "",
      quantity: clothing ? totalSelectedSizeQuantity() : (footwear ? totalSelectedShoeSizeQuantity() : orderState.quantity)
    };
    if (order) {
      order.href = orderUrlWithOptions(orderState.item, selectedOptions);
      if (order.id === "lightbox-order") {
        order.textContent = orderButtonLabel(orderState.item);
      }
    }
  }

  function renderOrderOptions(item) {
    if (!item) return;
    const target = byId("lightbox-options") || byId("detail-options");
    if (target) {
      target.innerHTML = optionMarkup(item);
    }
    updateOrderLink();
  }

  function addCurrentItemToCart() {
    if (!orderState.item) return;
    const item = orderState.item;
    const color = hasColorChoices(item) ? selectedColor().label : "";
    const sizes = isClothing(item) ? orderState.sizes.slice() : [];
    const sizeQuantities = isClothing(item) ? selectedSizeQuantities() : [];
    const shoeSizes = isFootwear(item) ? orderState.shoeSizes.slice() : [];
    const shoeSizeQuantities = isFootwear(item) ? selectedShoeSizeQuantities() : [];
    const quantity = isClothing(item) ? totalSelectedSizeQuantity() : (isFootwear(item) ? totalSelectedShoeSizeQuantity() : orderState.quantity);

    const entry = {
      id: item.id,
      title: displayTitle(item),
      price: item.price,
      sizes,
      sizeQuantities,
      shoeSizes,
      shoeSizeQuantities,
      color,
      quantity,
      url: `${SITE_URL}boutique.html#article-${item.id}`,
      image: displayImage(item)
    };

    const items = cartItems();
    const existingIndex = items.findIndex(i =>
      i.id === entry.id &&
      i.color === entry.color &&
      JSON.stringify(i.sizes) === JSON.stringify(entry.sizes) &&
      JSON.stringify(i.shoeSizes) === JSON.stringify(entry.shoeSizes)
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += entry.quantity;
      if (entry.sizeQuantities && entry.sizeQuantities.length) {
        entry.sizeQuantities.forEach(sq => {
          const matched = items[existingIndex].sizeQuantities.find(s => s.size === sq.size);
          if (matched) matched.quantity += sq.quantity;
          else items[existingIndex].sizeQuantities.push(sq);
        });
      }
      if (entry.shoeSizeQuantities && entry.shoeSizeQuantities.length) {
        entry.shoeSizeQuantities.forEach(sq => {
          const matched = items[existingIndex].shoeSizeQuantities.find(s => s.size === sq.size);
          if (matched) matched.quantity += sq.quantity;
          else items[existingIndex].shoeSizeQuantities.push(sq);
        });
      }
    } else {
      items.push(entry);
    }

    saveCartItems(items);

    const cart = byId("lightbox-cart");
    if (cart) {
      cart.textContent = `Ajouté au panier (${items.length})`;
    }

    if (typeof window.updateCartUi === "function") {
      window.updateCartUi();
    }
  }

  function productUrl(item) {
    return `${SITE_URL}boutique.html#article-${item.id}`;
  }

  function defaultReviews(item) {
    const category = productCategory(item);
    if (category === "Packs & Idées Cadeaux") {
      return [
        { name: "Clarisse", rating: 5, text: "Le pack est bien assorti, pratique et pret a offrir." },
        { name: "Nadine", rating: 5, text: "J'aime le fait que tout soit coordonne sans chercher." }
      ];
    }
    if (category === "Sacs" || productSubcategory(item) === "Accessoires") {
      return [
        { name: "Clarisse", rating: 5, text: "Le rendu est solide, pratique et très élégant." },
        { name: "Nadine", rating: 5, text: "Les couleurs ressortent bien, parfait pour offrir." }
      ];
    }
    if (isFootwear(item)) {
      return [
        { name: "Stéphanie", rating: 5, text: "Confortable au pied et très joli avec une tenue simple." },
        { name: "Grâce", rating: 4, text: "Belle finition, le detail imprime fait la difference." }
      ];
    }
    if (category === "Coussins") {
      return [
        { name: "Laure", rating: 5, text: "Les couleurs donnent beaucoup de chaleur à la pièce." },
        { name: "Estelle", rating: 5, text: "Très décoratif et fidèle au style ROSBRI." }
      ];
    }
    if (["Accessoires", "Pochettes", "Bobs", "Chapeaux"].includes(category)) {
      return [
        { name: "Brenda", rating: 5, text: "Petit détail original, très propre et facile à offrir." },
        { name: "Yasmine", rating: 5, text: "J’aime le rendu, c’est simple et élégant." }
      ];
    }
    return [
      { name: "Murielle", rating: 5, text: "La coupe est confortable et le motif ressort très bien." },
      { name: "Ariane", rating: 5, text: "Belle finition, exactement l’esprit ROSBRI que je voulais." }
    ];
  }

  function renderReviews(item) {
    const target = byId("lightbox-reviews");
    if (!target) return;
    const reviews = (item.reviews && item.reviews.length ? item.reviews : defaultReviews(item)).slice(0, 3);
    target.innerHTML = `
      <strong>Avis clients</strong>
      <div class="review-list">
        ${reviews.map((review) => `
          <figure class="review-item">
            <div class="stars" aria-label="${review.rating} sur 5">${"★".repeat(review.rating)}${"☆".repeat(Math.max(0, 5 - review.rating))}</div>
            <blockquote>${review.text}</blockquote>
            <figcaption>${review.name}</figcaption>
          </figure>
        `).join("")}
      </div>
      <details class="review-submit-box">
        <summary>Rédiger un avis</summary>
        <form class="review-submit-form" id="user-review-form">
          <input type="text" id="user-review-name" placeholder="Votre nom" required>
          <div class="review-stars-select" id="user-review-stars">
            <span class="star-input active" data-rating="1">★</span>
            <span class="star-input active" data-rating="2">★</span>
            <span class="star-input active" data-rating="3">★</span>
            <span class="star-input active" data-rating="4">★</span>
            <span class="star-input active" data-rating="5">★</span>
          </div>
          <textarea id="user-review-text" rows="3" placeholder="Votre commentaire..." required></textarea>
          <button type="submit" class="primary-btn compact">Soumettre via WhatsApp</button>
        </form>
      </details>
    `;

    // Bind rating stars click
    let currentRating = 5;
    const stars = target.querySelectorAll(".star-input");
    stars.forEach(star => {
      star.addEventListener("click", () => {
        const rating = parseInt(star.dataset.rating, 10);
        currentRating = rating;
        stars.forEach(s => {
          const r = parseInt(s.dataset.rating, 10);
          if (r <= rating) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });
      });
    });

    // Bind form submit to WhatsApp
    const form = target.querySelector("#user-review-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameVal = target.querySelector("#user-review-name").value;
        const textVal = target.querySelector("#user-review-text").value;

        const message = `Bonjour ROSBRI DESIGN 🌸\n\nJe souhaite soumettre un avis pour votre produit *${item.title}* :\n\n⭐ Note : *${currentRating}/5*\n✍️ Avis : "${textVal}"\n👤 Signé : *${nameVal}*\n\nMerci de le publier sur le site !`;
        const waLink = `https://wa.me/237690087213?text=${encodeURIComponent(message)}`;
        window.open(waLink, "_blank");

        form.reset();
        const details = target.querySelector(".review-submit-box");
        if (details) details.removeAttribute("open");
        alert("Votre avis a été préparé ! Vous allez être redirigé vers WhatsApp pour nous l'envoyer.");
      });
    }
  }

  function shareLinks(item) {
    const url = productUrl(item);
    const text = `Découvrez ${displayTitle(item)} chez ROSBRI DESIGN`;
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`${text} ${url}`)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      instagram: "https://www.instagram.com/"
    };
  }

  function renderShareButtons(item) {
    const target = byId("lightbox-share");
    if (!target) return;
    const links = shareLinks(item);
    target.innerHTML = `
      <strong>Partager</strong>
      <div class="share-list">
        <a href="${links.facebook}" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="${links.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="${links.x}" target="_blank" rel="noopener noreferrer">X</a>
        <a href="${links.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
        <button type="button" data-share-native>Plus</button>
      </div>
    `;
  }

  async function shareCurrentItem() {
    if (!orderState.item) return;
    const url = productUrl(orderState.item);
    const title = displayTitle(orderState.item);
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Découvrez ${title} chez ROSBRI DESIGN`, url });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
  }

  function openSizeGuide(item) {
    let modal = byId("size-guide-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "size-guide-modal";
      modal.className = "size-guide-modal";
      modal.innerHTML = `
        <div class="size-guide-overlay" id="close-size-guide-overlay"></div>
        <div class="size-guide-panel">
          <div class="size-guide-header">
            <h3>Guide des Tailles</h3>
            <button class="size-guide-close" id="close-size-guide" type="button">&times;</button>
          </div>
          <div class="size-guide-tabs" id="size-guide-tabs">
            <button class="size-guide-tab active" data-tab="tshirts">T-shirts</button>
            <button class="size-guide-tab" data-tab="ensembles">Ensembles Enfants</button>
            <button class="size-guide-tab" data-tab="chaussures">Chaussures / Pointures</button>
          </div>
          <div class="size-guide-content">
            <div class="size-guide-content-pane active" id="pane-tshirts">
              <table class="size-guide-table">
                <thead>
                  <tr>
                    <th>Taille</th>
                    <th>Largeur Poitrine (cm)</th>
                    <th>Longueur (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>S</td><td>47</td><td>69</td></tr>
                  <tr><td>M</td><td>50</td><td>72</td></tr>
                  <tr><td>L</td><td>53</td><td>74</td></tr>
                  <tr><td>XL</td><td>56</td><td>76</td></tr>
                  <tr><td>XXL</td><td>59</td><td>78</td></tr>
                </tbody>
              </table>
              <p class="size-guide-tips">💡 **Conseil :** Si vous hésitez entre deux tailles, nous vous conseillons de prendre la taille supérieure pour plus de confort.</p>
            </div>
            <div class="size-guide-content-pane" id="pane-ensembles">
              <table class="size-guide-table">
                <thead>
                  <tr>
                    <th>Âge</th>
                    <th>Hauteur Enfant (cm)</th>
                    <th>Tour de poitrine (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>2-3 ans</td><td>92 - 98</td><td>54 - 56</td></tr>
                  <tr><td>4-5 ans</td><td>104 - 110</td><td>57 - 59</td></tr>
                  <tr><td>6-7 ans</td><td>116 - 122</td><td>61 - 63</td></tr>
                  <tr><td>8-9 ans</td><td>128 - 134</td><td>65 - 67</td></tr>
                  <tr><td>10-11 ans</td><td>140 - 146</td><td>71 - 73</td></tr>
                </tbody>
              </table>
            </div>
            <div class="size-guide-content-pane" id="pane-chaussures">
              <table class="size-guide-table">
                <thead>
                  <tr>
                    <th>Pointure</th>
                    <th>Longueur du pied (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>38</td><td>24.0</td></tr>
                  <tr><td>39</td><td>24.6</td></tr>
                  <tr><td>40</td><td>25.3</td></tr>
                  <tr><td>41</td><td>26.0</td></tr>
                  <tr><td>42</td><td>26.6</td></tr>
                  <tr><td>43</td><td>27.3</td></tr>
                  <tr><td>44</td><td>28.0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const tabs = modal.querySelectorAll(".size-guide-tab");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          const targetPaneId = `pane-${tab.dataset.tab}`;
          const panes = modal.querySelectorAll(".size-guide-content-pane");
          panes.forEach(pane => {
            if (pane.id === targetPaneId) {
              pane.classList.add("active");
            } else {
              pane.classList.remove("active");
            }
          });
        });
      });

      modal.querySelector("#close-size-guide").addEventListener("click", () => {
        modal.classList.remove("active");
      });
      modal.querySelector("#close-size-guide-overlay").addEventListener("click", () => {
        modal.classList.remove("active");
      });
    }

    const tabs = modal.querySelectorAll(".size-guide-tab");
    tabs.forEach(t => t.classList.remove("active"));
    const panes = modal.querySelectorAll(".size-guide-content-pane");
    panes.forEach(p => p.classList.remove("active"));

    if (isFootwear(item)) {
      modal.querySelector('[data-tab="chaussures"]').classList.add("active");
      modal.querySelector("#pane-chaussures").classList.add("active");
    } else if (isChildClothing(item)) {
      modal.querySelector('[data-tab="ensembles"]').classList.add("active");
      modal.querySelector("#pane-ensembles").classList.add("active");
    } else {
      modal.querySelector('[data-tab="tshirts"]').classList.add("active");
      modal.querySelector("#pane-tshirts").classList.add("active");
    }
    modal.classList.add("active");
  }

  function renderLightboxThumbnails(item) {
    const visual = byId("lightbox-visual");
    if (!visual) return;
    const oldThumbs = visual.querySelector(".lightbox-thumbnails");
    if (oldThumbs) oldThumbs.remove();

    const variants = colorOptionsFor(item).filter(v => v.image);
    const defaultImg = item.image;
    if (variants.length === 0) return;

    const container = document.createElement("div");
    container.className = "lightbox-thumbnails";

    const defaultThumb = document.createElement("img");
    defaultThumb.src = optimizedImage(defaultImg);
    defaultThumb.className = "lightbox-thumb active";
    defaultThumb.alt = "Vue par défaut";
    defaultThumb.addEventListener("click", () => {
      const mainImg = byId("lightbox-image");
      if (mainImg) mainImg.src = optimizedImage(defaultImg);
      container.querySelectorAll(".lightbox-thumb").forEach(t => t.classList.remove("active"));
      defaultThumb.classList.add("active");
    });
    container.appendChild(defaultThumb);

    variants.forEach(variant => {
      const thumb = document.createElement("img");
      thumb.src = optimizedImage(variant.image);
      thumb.className = "lightbox-thumb";
      thumb.alt = variant.title || variant.label;
      thumb.addEventListener("click", () => {
        const mainImg = byId("lightbox-image");
        if (mainImg) mainImg.src = optimizedImage(variant.image);
        container.querySelectorAll(".lightbox-thumb").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");

        const swatchBtn = document.querySelector(`.swatch-btn[data-color="${variant.id}"]`);
        if (swatchBtn) {
          swatchBtn.click();
        }
      });
      container.appendChild(thumb);
    });
    visual.appendChild(container);
  }

  function openProduct(id) {
    const item = catalogView.find((entry) => String(entry.id) === String(id));
    const lightbox = byId("lightbox");
    if (!item || !lightbox) return;

    orderState.item = item;
    const defaultSize = isChildClothing(item) ? "4 ans" : "M";
    orderState.sizes = [defaultSize];
    orderState.sizeQuantities = { [defaultSize]: 1 };
    orderState.shoeSizes = ["39"];
    orderState.shoeSizeQuantities = { 39: 1 };
    orderState.color = (colorOptionsFor(item)[0] || colorVariants[0]).id;
    orderState.quantity = 1;

    byId("lightbox-image").src = optimizedImage(displayImage(item));
    byId("lightbox-image").alt = displayTitle(item);
    byId("lightbox-title").textContent = displayTitle(item);
    byId("lightbox-meta").textContent = `${productMetaLabel(item)} - ${item.price}`;

    const description = byId("lightbox-description");
    if (description) {
      description.textContent = productDescription(item);

      let extraActions = byId("lightbox-extra-actions");
      if (!extraActions) {
        extraActions = document.createElement("div");
        extraActions.id = "lightbox-extra-actions";
        extraActions.className = "lightbox-extra-actions";
        description.parentNode.appendChild(extraActions);
      }

      const isApparel = isClothing(item) || isFootwear(item);
      extraActions.innerHTML = `
        ${isApparel ? `<span class="lightbox-link-action" id="trigger-size-guide">📏 Guide des tailles</span>` : ""}
      `;
      const trigger = byId("trigger-size-guide");
      if (trigger) {
        trigger.addEventListener("click", () => {
          openSizeGuide(item);
        });
      }
    }

    const cart = byId("lightbox-cart");
    if (cart) cart.textContent = "Pré-commander";
    renderOrderOptions(item);
    renderReviews(item);
    renderShareButtons(item);
    renderLightboxThumbnails(item);
    lightbox.style.display = "";
    lightbox.classList.add("open");
    document.dispatchEvent(new CustomEvent("catalog:lightbox-open", { detail: { item } }));
    document.body.style.overflow = "hidden";
  }

  function closeProduct() {
    const lightbox = byId("lightbox");
    if (!lightbox) return;
    lightbox.style.display = "";
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
      const thumbs = visual.querySelector(".lightbox-thumbnails");
      if (thumbs) thumbs.remove();
    }
    document.dispatchEvent(new CustomEvent("catalog:lightbox-close"));
    document.body.style.overflow = "";
  }

  function openProductFromHash() {
    const match = window.location.hash.match(/^#article-(.+)$/);
    if (match) {
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        openProduct(match[1]);
      }, 80);
    }
  }

  function bindEvents() {
    document.addEventListener("catalog:source-change", updateCatalogSourceLabel);

    // Mobile Drawer Logic
    const mobileDrawer = document.getElementById("mobile-filter-drawer");
    const mobileBackdrop = document.getElementById("mobile-filter-backdrop");
    
    function openMobileFilters() {
        if (!mobileDrawer || !mobileBackdrop) return;
        mobileBackdrop.classList.remove("hidden");
        setTimeout(() => mobileBackdrop.classList.replace("opacity-0", "opacity-100"), 10);
        mobileDrawer.classList.replace("-translate-x-full", "translate-x-0");
        document.body.style.overflow = "hidden";
    }
    
    function closeMobileFilters() {
        if (!mobileDrawer || !mobileBackdrop) return;
        mobileBackdrop.classList.replace("opacity-100", "opacity-0");
        mobileDrawer.classList.replace("translate-x-0", "-translate-x-full");
        setTimeout(() => mobileBackdrop.classList.add("hidden"), 300);
        document.body.style.overflow = "";
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeProduct();
            closeMobileFilters();
        }
    });

    document.addEventListener("click", (event) => {
        // Mobile Drawer Toggles
        if (event.target.closest("#open-mobile-filters")) openMobileFilters();
        if (event.target.closest("#close-mobile-filters") || event.target.closest("#mobile-filter-backdrop") || event.target.closest("#apply-mobile-filters")) {
            closeMobileFilters();
        }
        if (event.target.closest("#reset-mobile-filters")) {
            state.category = "Tous";
            state.subcategory = "Tous";
            state.query = "";
            const searchInput = document.getElementById("catalog-search");
            if (searchInput) searchInput.value = "";
            resetVisibleLimit();
            renderFilters();
            renderShop();
            closeMobileFilters();
            return;
        }

        // Family Accordion Toggle
        const familyToggle = event.target.closest(".family-toggle");
        if (familyToggle) {
            const famName = familyToggle.dataset.family;
            state.openFamily = state.openFamily === famName ? null : famName;
            renderFilters();
            return;
        }

        const categoryButton = event.target.closest("[data-category]");
        if (categoryButton && categoryButton.classList.contains("filter-btn")) {
          state.category = categoryButton.dataset.category;
          state.subcategory = "Tous";
          state.openFamily = getFamilyForCategory(state.category); // Open family of selected category
          resetVisibleLimit();
          renderFilters();
          renderShop();
        }

        const subcategoryButton = event.target.closest("[data-subcategory]");
        if (subcategoryButton && subcategoryButton.classList.contains("filter-btn")) {
          state.subcategory = subcategoryButton.dataset.subcategory;
          resetVisibleLimit();
          renderFilters();
          renderShop();
        }

        const openButton = event.target.closest(".product-card, [data-open-product]");
        if (openButton) {
          const slug = openButton.dataset.slug || openButton.dataset.productSlug || openButton.dataset.openProduct;
          console.log("Carte cliquée");
          console.log("Slug :", slug);
          console.log("Destination :", `produit.html?slug=${encodeURIComponent(slug)}`);
          // Autoriser la navigation web native vers produit.html?slug=... sans preventDefault
        }

        if (event.target.closest("[data-close-lightbox]")) {
          closeProduct();
        }

        const colorButton = event.target.closest("[data-color]");
        if (colorButton) {
          orderState.color = colorButton.dataset.color;
          document.querySelectorAll("[data-color]").forEach((button) => {
             button.classList.remove("active");
          });
          colorButton.classList.add("active");
          applyPreviewCrop();
          updateOrderLink();
          // Sync thumbnail active state
          const visual = byId("lightbox-visual");
          if (visual) {
            const thumbs = visual.querySelectorAll(".lightbox-thumb");
            thumbs.forEach(t => t.classList.remove("active"));
          }
        }

        // ── Size selection (clothing) ──────────────────────
        const sizeBtn = event.target.closest("[data-size]");
        if (sizeBtn && !sizeBtn.closest("[data-shoe-size]")) {
          const size = sizeBtn.dataset.size;
          if (orderState.sizes.includes(size)) {
            if (orderState.sizes.length > 1) {
              orderState.sizes = orderState.sizes.filter(s => s !== size);
              delete orderState.sizeQuantities[size];
            }
          } else {
            orderState.sizes.push(size);
            orderState.sizeQuantities[size] = 1;
          }
          renderOrderOptions(orderState.item);
        }

        // ── Shoe size selection ────────────────────────────
        const shoeSizeBtn = event.target.closest("[data-shoe-size]");
        if (shoeSizeBtn && !shoeSizeBtn.closest("[data-shoe-size-quantity]") && !shoeSizeBtn.closest("[data-shoe-size-quantity-step]")) {
          const size = shoeSizeBtn.dataset.shoeSize;
          if (orderState.shoeSizes.includes(size)) {
            if (orderState.shoeSizes.length > 1) {
              orderState.shoeSizes = orderState.shoeSizes.filter(s => s !== size);
              delete orderState.shoeSizeQuantities[size];
            }
          } else {
            orderState.shoeSizes.push(size);
            orderState.shoeSizeQuantities[size] = 1;
          }
          renderOrderOptions(orderState.item);
        }

        // ── Quantity stepper (non-clothing items) ──────────
        const qtyStepBtn = event.target.closest("[data-quantity-step]");
        if (qtyStepBtn) {
          const step = parseInt(qtyStepBtn.dataset.quantityStep, 10);
          orderState.quantity = Math.max(1, Math.min(99, orderState.quantity + step));
          const qtyInput = byId("quantity-input");
          if (qtyInput) qtyInput.value = orderState.quantity;
          updateOrderLink();
        }

        // ── Size quantity stepper ──────────────────────────
        const sizeQtyBtn = event.target.closest("[data-size-quantity-step]");
        if (sizeQtyBtn) {
          const size = sizeQtyBtn.dataset.sizeQuantity;
          const step = parseInt(sizeQtyBtn.dataset.sizeQuantityStep, 10);
          const current = Number(orderState.sizeQuantities[size]) || 1;
          orderState.sizeQuantities[size] = Math.max(1, Math.min(99, current + step));
          const input = document.querySelector(`[data-size-quantity-input="${size}"]`);
          if (input) input.value = orderState.sizeQuantities[size];
          updateOrderLink();
        }

        // ── Shoe size quantity stepper ─────────────────────
        const shoeSizeQtyBtn = event.target.closest("[data-shoe-size-quantity-step]");
        if (shoeSizeQtyBtn) {
          const size = shoeSizeQtyBtn.dataset.shoeSizeQuantity;
          const step = parseInt(shoeSizeQtyBtn.dataset.shoeSizeQuantityStep, 10);
          const current = Number(orderState.shoeSizeQuantities[size]) || 1;
          orderState.shoeSizeQuantities[size] = Math.max(1, Math.min(99, current + step));
          const input = document.querySelector(`[data-shoe-size-quantity-input="${size}"]`);
          if (input) input.value = orderState.shoeSizeQuantities[size];
          updateOrderLink();
        }

        // ── Pré-commander → Add to cart ────────────────────
        if (event.target.closest("#lightbox-cart")) {
          addCurrentItemToCart();
          const cart = byId("lightbox-cart");
          if (cart) {
            const originalText = cart.textContent;
            cart.textContent = "✓ Ajouté au panier !";
            cart.style.background = "#c5a059";
            cart.style.color = "#fff";
            setTimeout(() => {
              cart.textContent = originalText;
              cart.style.background = "";
              cart.style.color = "";
            }, 2000);
          }
        }
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
    const sortSelectMobile = byId("catalog-sort-mobile");
    if (sort) {
      sort.addEventListener("change", (event) => {
        state.sort = event.target.value;
        if (sortSelectMobile) sortSelectMobile.value = state.sort;
        resetVisibleLimit();
        renderShop();
      });
    }
    if (sortSelectMobile) {
      sortSelectMobile.addEventListener("change", (e) => {
        state.sort = e.target.value;
        if (sort) sort.value = state.sort;
        resetVisibleLimit();
        renderShop();
      });
    }

    const price = byId("catalog-price");
    if (price) {
      price.addEventListener("change", (event) => {
        state.price = event.target.value;
        resetVisibleLimit();
      });
    }

    const loadMore = byId("catalog-load-more");
    if (loadMore) {
      loadMore.addEventListener("click", () => {
        state.visibleLimit += pageSize;
        renderShop();
      });
    }

    document.addEventListener("input", (event) => {
      if (event.target.id === "quantity-input") {
        orderState.quantity = Math.max(1, Math.min(99, Number(event.target.value) || 1));
        event.target.value = String(orderState.quantity);
        updateOrderLink();
      }
      if (event.target.matches("[data-size-quantity-input]")) {
        const size = event.target.dataset.sizeQuantityInput;
        orderState.sizeQuantities[size] = Math.max(1, Math.min(99, Number(event.target.value) || 1));
        event.target.value = String(orderState.sizeQuantities[size]);
        updateOrderLink();
      }

      if (event.target.matches("[data-shoe-size-quantity-input]")) {
        const size = event.target.dataset.shoeSizeQuantityInput;
        orderState.shoeSizeQuantities[size] = Math.max(1, Math.min(99, Number(event.target.value) || 1));
        event.target.value = String(orderState.shoeSizeQuantities[size]);
        updateOrderLink();
      }
    });
  }

  function updateCounts() {
    document.querySelectorAll("[data-catalog-count]").forEach((node) => {
      node.textContent = catalogView.length;
    });
  }

  function updateCatalogSourceLabel() {
    const node = byId("catalog-source");
    if (!node) return;
    const source = document.documentElement.dataset.catalogSource;
    const labels = {
      supabase: "Catalogue en ligne",
      "supabase-empty": "Supabase vide",
      "supabase-error": "Supabase indisponible",
      "supabase-stale": "Catalogue local complet"
    };
    node.textContent = labels[source] || "Catalogue local";
    node.dataset.source = source || "local";
  }

  function applyInitialFiltersFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("categorie") || params.get("category");
    const query = params.get("q") || params.get("recherche");
    if (category && categories.includes(category)) {
      state.category = category;
      state.subcategory = "Tous";
    }
    if (query) {
      state.query = query;
      const search = byId("catalog-search");
      if (search) search.value = query;
    }
  }

  function renderAll() {
    updateCounts();
    updateCatalogSourceLabel();
    renderFeatured();
    renderB2B();
    renderB2B();
    renderCommercialSections();
    renderFilters();
    renderShop();
    document.dispatchEvent(new CustomEvent("catalog:ready", {
      detail: {
        catalog: catalogView,
        categoryCounts,
        productLabels,
        categories
      }
    }));
  }

  window.ROSBriApplyCatalog = (items) => {
    catalog = normalizeCatalog(items);
    rebuildCatalogState();
    resetVisibleLimit();
    document.documentElement.dataset.catalogSource = "supabase";
    renderAll();
  };

  window.getProductSlug = getProductSlug;
  window.findProductBySlugOrId = findProductBySlugOrId;
  window.displayTitle = displayTitle;
  window.productCategory = productCategory;
  window.productDescription = productDescription;
  window.optimizedImage = optimizedImage;
  window.displayImage = displayImage;
  window.categoryMatches = categoryMatches;
  window.colorOptionsFor = colorOptionsFor;
  window.selectedColor = selectedColor;
  window.optionMarkup = optionMarkup;
  window.renderOrderOptions = renderOrderOptions;
  window.isChildClothing = isChildClothing;
  window.orderState = orderState;
  window.updateOrderLink = updateOrderLink;
  window.addCurrentItemToCart = addCurrentItemToCart;
  window.productCard = productCard;
  window.openProduct = openProduct;
  window.closeProduct = closeProduct;
  window.catalogView = catalogView;

  window.ROSBriCatalogApi = {
    get catalog() { return catalogView; },
    get categoryCounts() { return categoryCounts; },
    productLabels,
    categories,
    getProductSlug,
    findProductBySlugOrId
  };

  if (typeof window.addEventListener === "function") {
    window.addEventListener("popstate", () => {
      const lightbox = byId("lightbox");
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("slug") || params.get("id");
      if (slug) {
        const item = findProductBySlugOrId(slug);
        if (item) openProduct(item.id);
      } else if (lightbox && lightbox.classList.contains("open")) {
        closeProduct();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyInitialFiltersFromUrl();
    renderAll();
    bindEvents();
    openProductFromHash();
    
    // Refresh featured products every 10 minutes (600000 ms)
    setInterval(() => {
      if (document.getElementById("featured-grid")) {
        renderFeatured();
      }
    }, 600000);
  });
})();
