(function () {
  const SITE_URL = "https://rosbridesign.ateliersdepaul.com/";
  const WHATSAPP_PHONE = "237690087213";
  const catalog = window.ROSBriCatalog || [];
  const categories = [
    "Tous", "Tshirts", "Sacs", "Ensembles", "Babouches", "Sandales", "Chapeaux",
    "Bobs", "Pochettes", "Accessoires", "Coussins", "Robes", "Chemises", "Affiches"
  ];
  const productLabels = {
    Tous: "Tous les articles",
    Tshirts: "T-shirts",
    Polos: "Polos",
    Debardeurs: "Débardeurs",
    Sacs: "Sacs",
    Ensembles: "Ensembles",
    Babouches: "Babouches",
    Sandales: "Sandales",
    Chaussures: "Chaussures",
    Chapeaux: "Chapeaux",
    Casquettes: "Casquettes",
    Bobs: "Bobs",
    Pochettes: "Pochettes",
    Trousses: "Trousses",
    Portefeuilles: "Portefeuilles",
    Accessoires: "Accessoires",
    Coussins: "Coussins",
    Robes: "Robes",
    Boubous: "Boubous",
    Chemises: "Chemises",
    Affiches: "Affiches"
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

  const state = {
    category: "Tous",
    subcategory: "Tous",
    query: "",
    price: "all",
    need: "all",
    sort: "default",
    visibleLimit: 24
  };
  const pageSize = 24;
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

  catalog.forEach((item) => {
    const match = item.image.match(/^images\/(.+)\/variants\/(.+)\.png$/i);
    if (!match) return;
    slugToCategory[slugFromFileName(`${match[2]}.png`)] = match[1];
  });

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
    quantity: 1,
    customText: ""
  };
  const variantGroups = [];
  const hiddenProductIds = [];
  const groupedVariantIds = new Set([
    ...variantGroups.flatMap((group) => group.variantIds),
    ...hiddenProductIds
  ]);
  const visibleVariantGroups = variantGroups.filter(isVisibleCatalogItem);
  const catalogView = [
    ...catalog.filter((item) => !groupedVariantIds.has(item.id) && isVisibleCatalogItem(item)),
    ...visibleVariantGroups.map((group) => ({
      ...group,
      id: group.id,
      sourceIds: group.variantIds
    }))
  ].sort((a, b) => {
    return catalogOrderKey(a) - catalogOrderKey(b);
  });
  const categoryCounts = catalogView.reduce((counts, item) => {
    const category = productCategory(item);
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
  const searchIndex = new Map(catalogView.map((item) => [
    item.id,
    `${displayTitle(item)} ${productDescription(item)} ${productLabel(item)} ${subcategoryLabel(item)} ${item.title} ${item.category} ${item.price} tailles pointures avis pack ${(item.reviews || []).map((review) => `${review.name} ${review.text}`).join(" ")} ${(item.sourceIds || []).join(" ")}`.toLowerCase()
  ]));

  function byId(id) {
    return document.getElementById(id);
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
    return item.description || "Creation ROSBRI au motif wax, pensee pour une finition originale et soignee.";
  }

  function productCategory(item) {
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
      trousses: "Trousses",
      portefeuilles: "Portefeuilles",
      accessoires: "Accessoires",
      coussins: "Coussins",
      robes: "Robes",
      boubous: "Boubous",
      chemises: "Chemises",
      affiches: "Affiches"
    };
    return map[folder] || item.category || "Autres";
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
      const detail = subcategory || productLabels[category] || category;
      return `Pack coordonne - ${detail}`;
    }
    return subcategory ? `${productLabels[category]} - ${subcategory}` : productLabels[category];
  }

  function catalogOrderKey(item) {
    return Array.isArray(item.sourceIds) ? Math.min(...item.sourceIds) : item.id;
  }

  function isTshirt(item) {
    return displayTitle(item).toLowerCase().includes("t-shirt");
  }

  function isClothing(item) {
    return ["Tshirts", "Ensembles", "Robes", "Boubous", "Chemises", "Polos", "Debardeurs"].includes(productCategory(item));
  }

  function isChildClothing(item) {
    return isClothing(item) && productSubcategory(item) === "Enfants";
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
    const productSlug = productVariantSlugs[item.id];
    return productSlug ? universalProductVariants(productSlug) : (productColorVariants[item.id] || []);
  }

  function colorOptionsFor(item) {
    if (!item || !isTshirt(item)) return [];
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

  function canCustomize(item) {
    const title = displayTitle(item).toLowerCase();
    return item.category === "Customisation" || title.includes("personnalis") || title.includes("pack");
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

  function orderUrlWithOptions(item, options = {}) {
    const productUrl = `${SITE_URL}boutique.html#article-${item.id}`;
    const details = [];
    if (options.sizeQuantities && options.sizeQuantities.length) {
      details.push(`Tailles: ${options.sizeQuantities.map((item) => `${item.size} x ${item.quantity}`).join(", ")}`);
    } else if (options.sizes && options.sizes.length) {
      details.push(`Tailles: ${options.sizes.join(", ")}`);
    }
    if (options.shoeSizeQuantities && options.shoeSizeQuantities.length) {
      details.push(`Pointures: ${options.shoeSizeQuantities.map((item) => `${item.size} x ${item.quantity}`).join(", ")}`);
    } else if (options.shoeSizes && options.shoeSizes.length) {
      details.push(`Pointures: ${options.shoeSizes.join(", ")}`);
    }
    if (options.color) details.push(`Couleur: ${options.color}`);
    if (options.quantity) details.push(`Quantite: ${options.quantity}`);
    if (options.customText) details.push(`Personnalisation: ${options.customText}`);
    const detailsBlock = details.length ? `\n\n${details.join("\n")}` : "";
    const message = `Bonjour ROSBRI DESIGN 👋

Je souhaite commander : ${displayTitle(item)}
Prix affiché : ${item.price}${detailsBlock}

Lien article : ${productUrl}

Merci de me confirmer la disponibilité, les tailles et le délai à Douala.`;
    return whatsAppUrl(message);
  }

  function optimizedImage(path) {
    return path;
  }

  function priceBand(item) {
    if (item.price === "Sur devis") return "quote";
    if (item.price.includes("3 500")) return "starter";
    if (item.price.includes("4 500") || item.price.includes("5 000")) return "low";
    if (item.price.includes("6 500")) return "mid";
    if (item.price.includes("8 500") || item.price.includes("10 000")) return "premium";
    if (item.price.includes("15 000") || item.price.includes("18 000")) return "set";
    return "premium";
  }

  function needMatch(item, need) {
    const text = searchIndex.get(item.id) || "";
    if (need === "all") return true;
    if (need === "gift") return item.category === "Maman" || text.includes("maman") || text.includes("famille") || text.includes("fête");
    if (need === "culture") return item.category === "Heritage" || text.includes("kribi") || text.includes("cameroun") || text.includes("tradition");
    if (need === "custom") return item.category === "Customisation" || text.includes("personnalisation") || text.includes("pack");
    if (need === "bags") return productCategory(item) === "Sacs";
    return true;
  }

  function productCard(item, compact, eager) {
    const title = displayTitle(item);
    const description = productDescription(item);
    const loading = eager ? "eager" : "lazy";
    const priority = eager ? " fetchpriority=\"high\"" : "";
    const collage = isColorCollage(item);
    const colorChoices = hasColorChoices(item);
    const colorCount = colorOptionsFor(item).length;
    const category = productCategory(item);
    const meta = productMetaLabel(item);
    return `
      <article class="product-card${collage ? " has-variants" : ""}" id="article-${item.id}" data-category="${category}">
        <button class="product-media" type="button" data-open-product="${item.id}" aria-label="Voir ${title}">
          <img class="${collage ? "variant-crop" : ""}" src="${optimizedImage(displayImage(item))}" alt="${title}" loading="${loading}" decoding="async"${priority}>
          <span class="tag">${item.isPack ? "Pack" : (productLabels[category] || category)}</span>
          ${item.isPack ? `<span class="pack-note">Lot assorti</span>` : ""}
          ${colorChoices ? `<span class="variant-note">${colorCount} couleurs</span>` : ""}
        </button>
        <div class="product-body">
          <h3>${title}</h3>
          <p class="product-description">${description}</p>
          <div class="product-meta">
            <span>${compact ? "Création ROSBRI" : meta}</span>
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
      const categoryMatch = state.category === "Tous" || productCategory(item) === state.category;
      const subcategoryMatch = state.subcategory === "Tous" || productSubcategory(item) === state.subcategory;
      const queryMatch = !query || (searchIndex.get(item.id) || "").includes(query);
      const priceMatch = state.price === "all" || priceBand(item) === state.price;
      return categoryMatch && subcategoryMatch && queryMatch && priceMatch && needMatch(item, state.need);
    });

    if (state.sort === "name") {
      result = result.slice().sort((a, b) => displayTitle(a).localeCompare(displayTitle(b)));
    }

    if (state.sort === "category") {
      result = result.slice().sort((a, b) => productCategory(a).localeCompare(productCategory(b)) || catalogOrderKey(a) - catalogOrderKey(b));
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
      ...catalogView.filter((item) => productCategory(item) === "Tshirts").slice(0, 3),
      ...catalogView.filter((item) => productCategory(item) === "Sacs").slice(0, 2),
      ...catalogView.filter((item) => productCategory(item) === "Ensembles").slice(0, 2),
      ...catalogView.filter((item) => productCategory(item) === "Babouches").slice(0, 1)
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

    const visibleCategories = categories.filter((category) => category === "Tous" || (categoryCounts[category] || 0) > 0);
    const categoryButtons = visibleCategories.map((category) => {
      const count = category === "Tous" ? catalogView.length : (categoryCounts[category] || 0);
      return `<button class="filter-btn${category === state.category ? " active" : ""}" type="button" data-category="${category}">${labels[category]} (${count})</button>`;
    }).join("");

    const subcategoryEntries = catalogView.reduce((counts, item) => {
      if (state.category === "Tous" || productCategory(item) !== state.category) return counts;
      const subcategory = productSubcategory(item);
      if (subcategory === "Tous") return counts;
      counts[subcategory] = (counts[subcategory] || 0) + 1;
      return counts;
    }, {});
    const subcategories = Object.keys(subcategoryEntries).sort((a, b) => {
      return (subcategoryLabels[a] || a).localeCompare(subcategoryLabels[b] || b);
    });
    const subcategoryButtons = subcategories.length > 1
      ? `
        <div class="filter-group">
          <strong class="filter-subtitle">Sous-catégories</strong>
          <button class="filter-btn${state.subcategory === "Tous" ? " active" : ""}" type="button" data-subcategory="Tous">Toutes (${categoryCounts[state.category] || 0})</button>
          ${subcategories.map((subcategory) => (
            `<button class="filter-btn${subcategory === state.subcategory ? " active" : ""}" type="button" data-subcategory="${subcategory}">${subcategoryLabels[subcategory] || subcategory} (${subcategoryEntries[subcategory]})</button>`
          )).join("")}
        </div>
      `
      : "";

    target.innerHTML = `
      <div class="filter-group">
        <strong class="filter-subtitle">Types d'articles</strong>
        ${categoryButtons}
      </div>
      ${subcategoryButtons}
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
      quantity: clothing ? totalSelectedSizeQuantity() : (footwear ? totalSelectedShoeSizeQuantity() : orderState.quantity),
      customText: canCustomize(orderState.item) ? orderState.customText.trim() : ""
    };
    if (order) {
      order.href = orderUrlWithOptions(orderState.item, selectedOptions);
      order.textContent = "Commander";
    }
    if (summary) {
      const parts = [];
      if (selectedOptions.sizeQuantities.length) parts.push(`tailles ${sizeQuantitiesText()}`);
      if (selectedOptions.shoeSizeQuantities.length) parts.push(`pointures ${shoeSizeQuantitiesText()}`);
      if (selectedOptions.color) parts.push(`couleur ${selectedOptions.color}`);
      parts.push(`${selectedOptions.quantity} article${selectedOptions.quantity > 1 ? "s" : ""}`);
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

  function addCurrentItemToCart() {
    if (!orderState.item) return;
    const item = orderState.item;
    const entry = {
      id: item.id,
      title: displayTitle(item),
      price: item.price,
      sizes: isClothing(item) ? orderState.sizes.slice() : [],
      sizeQuantities: isClothing(item) ? selectedSizeQuantities() : [],
      shoeSizes: isFootwear(item) ? orderState.shoeSizes.slice() : [],
      shoeSizeQuantities: isFootwear(item) ? selectedShoeSizeQuantities() : [],
      color: hasColorChoices(item) ? selectedColor().label : "",
      quantity: isClothing(item) ? totalSelectedSizeQuantity() : (isFootwear(item) ? totalSelectedShoeSizeQuantity() : orderState.quantity),
      customText: canCustomize(item) ? orderState.customText.trim() : "",
      url: `${SITE_URL}boutique.html#article-${item.id}`
    };
    const items = cartItems();
    items.push(entry);
    saveCartItems(items);

    const cart = byId("lightbox-cart");
    const summary = byId("choice-summary");
    if (cart) cart.textContent = `Ajoute au panier (${items.length})`;
    if (summary) {
      const sizes = entry.sizeQuantities.length
        ? ` (${entry.sizeQuantities.map((size) => `${size.size} x ${size.quantity}`).join(", ")})`
        : "";
      const shoeSizes = entry.shoeSizeQuantities.length
        ? ` (${entry.shoeSizeQuantities.map((size) => `${size.size} x ${size.quantity}`).join(", ")})`
        : "";
      summary.textContent = `Ajouté au panier: ${entry.quantity} x ${entry.title}${sizes}${shoeSizes}. Vous pouvez continuer ou commander directement.`;
    }
  }

  function updateActiveNeeds() {
    document.querySelectorAll("[data-need]").forEach((button) => {
      button.classList.toggle("active", button.dataset.need === state.need);
    });
  }

  function productUrl(item) {
    return `${SITE_URL}boutique.html#article-${item.id}`;
  }

  function defaultReviews(item) {
    const category = productCategory(item);
    if (category === "Sacs" || productSubcategory(item) === "Accessoires") {
      return [
        { name: "Clarisse", rating: 5, text: "Le rendu est solide, pratique et très élégant." },
        { name: "Nadine", rating: 5, text: "Les couleurs ressortent bien, parfait pour offrir." }
      ];
    }
    if (isFootwear(item)) {
      return [
        { name: "Stéphanie", rating: 5, text: "Confortable au pied et très joli avec une tenue simple." },
        { name: "Grâce", rating: 4, text: "Belle finition, le détail wax fait la différence." }
      ];
    }
    if (category === "Coussins" || category === "Affiches") {
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
    `;
  }

  function shareLinks(item) {
    const url = productUrl(item);
    const text = `Découvrez ${displayTitle(item)} chez ROSBRI DESIGN`;
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
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
      const summary = byId("choice-summary");
      if (summary) summary.textContent = "Lien de l’article copié.";
    }
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
    orderState.customText = "";

    byId("lightbox-image").src = optimizedImage(displayImage(item));
    byId("lightbox-image").alt = displayTitle(item);
    byId("lightbox-title").textContent = displayTitle(item);
    byId("lightbox-meta").textContent = `${productMetaLabel(item)} - ${item.price}`;
    const description = byId("lightbox-description");
    if (description) description.textContent = productDescription(item);
    const cart = byId("lightbox-cart");
    if (cart) cart.textContent = "Ajouter au panier";
    renderOrderOptions(item);
    renderReviews(item);
    renderShareButtons(item);
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
        state.subcategory = "Tous";
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

      const sizeButton = event.target.closest("[data-size]");
      if (sizeButton) {
        const size = sizeButton.dataset.size;
        const selected = new Set(orderState.sizes);
        if (selected.has(size) && selected.size > 1) {
          selected.delete(size);
          delete orderState.sizeQuantities[size];
        } else {
          selected.add(size);
          orderState.sizeQuantities[size] = orderState.sizeQuantities[size] || 1;
        }
        orderState.sizes = sizeOptionsFor(orderState.item).filter((option) => selected.has(option));
        renderOrderOptions(orderState.item);
      }

      const shoeSizeButton = event.target.closest("[data-shoe-size]");
      if (shoeSizeButton) {
        const size = shoeSizeButton.dataset.shoeSize;
        const selected = new Set(orderState.shoeSizes);
        if (selected.has(size) && selected.size > 1) {
          selected.delete(size);
          delete orderState.shoeSizeQuantities[size];
        } else {
          selected.add(size);
          orderState.shoeSizeQuantities[size] = orderState.shoeSizeQuantities[size] || 1;
        }
        orderState.shoeSizes = shoeSizeOptions.filter((option) => selected.has(option));
        renderOrderOptions(orderState.item);
      }

      const sizeQuantityButton = event.target.closest("[data-size-quantity-step]");
      if (sizeQuantityButton) {
        const size = sizeQuantityButton.dataset.sizeQuantity;
        const input = document.querySelector(`[data-size-quantity-input="${size}"]`);
        const current = Math.max(1, Number(orderState.sizeQuantities[size]) || 1);
        const nextQuantity = Math.max(1, Math.min(99, current + Number(sizeQuantityButton.dataset.sizeQuantityStep)));
        orderState.sizeQuantities[size] = nextQuantity;
        if (input) input.value = String(nextQuantity);
        updateOrderLink();
      }

      const shoeSizeQuantityButton = event.target.closest("[data-shoe-size-quantity-step]");
      if (shoeSizeQuantityButton) {
        const size = shoeSizeQuantityButton.dataset.shoeSizeQuantity;
        const input = document.querySelector(`[data-shoe-size-quantity-input="${size}"]`);
        const current = Math.max(1, Number(orderState.shoeSizeQuantities[size]) || 1);
        const nextQuantity = Math.max(1, Math.min(99, current + Number(shoeSizeQuantityButton.dataset.shoeSizeQuantityStep)));
        orderState.shoeSizeQuantities[size] = nextQuantity;
        if (input) input.value = String(nextQuantity);
        updateOrderLink();
      }

      const quantityButton = event.target.closest("[data-quantity-step]");
      if (quantityButton) {
        const input = byId("quantity-input");
        const nextQuantity = Math.max(1, Math.min(99, orderState.quantity + Number(quantityButton.dataset.quantityStep)));
        orderState.quantity = nextQuantity;
        if (input) input.value = String(nextQuantity);
        updateOrderLink();
      }

      if (event.target.closest("#lightbox-cart")) {
        addCurrentItemToCart();
      }

      if (event.target.closest("[data-share-native]")) {
        shareCurrentItem();
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

    document.addEventListener("input", (event) => {
      if (event.target.id === "custom-text") {
        orderState.customText = event.target.value;
        updateOrderLink();
      }
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

  document.addEventListener("DOMContentLoaded", () => {
    updateCounts();
    renderFeatured();
    renderFilters();
    renderShop();
    bindEvents();
    updateActiveNeeds();
    openProductFromHash();
  });
})();
