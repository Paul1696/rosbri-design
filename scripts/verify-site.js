const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const failures = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}
function read(file) { return fs.readFileSync(path.join(root, file), "utf8"); }

const publicPages = ["index.html","boutique.html","collections.html","produit.html","a_propos.html","404.html"];
publicPages.forEach(function (file) {
  const html = read(file);
  check(html.includes("<main") && html.includes("</main>"), file + ": main manquant");
  check(html.includes('class="skip-link"'), file + ": lien d’évitement manquant");
  check(/<meta[^>]+name="description"/.test(html), file + ": description SEO manquante");
  check(/rel="canonical"/.test(html), file + ": canonical manquante");
  check(/twitter:card/.test(html), file + ": Twitter Card manquante");
  check(!html.includes("cdn.tailwindcss.com"), file + ": Tailwind CDN encore présent");
});

const home = read("index.html");
const order = [
  "home-hero", "home-products section", "home-collections section", "home-customization section",
  "commitments-section", "home-story section", "home-b2b section",
  "home-faq section", "home-social section"
].map(function (marker) { return home.indexOf(marker); });
check(order.every(function (value) { return value >= 0; }), "Accueil : section manquante");
check(order.every(function (value, index) { return index === 0 || value > order[index - 1]; }), "Accueil : ordre des sections incorrect");
check(home.includes("js/home-products.js"), "Accueil : rendu DOM sécurisé absent");
check(!home.includes("home-testimonials"), "Accueil : témoignages temporaires encore visibles");
check(!home.includes("bientôt disponible"), "Accueil : message temporaire encore visible");
check(!home.includes("grid.innerHTML = selection.map"), "Accueil : ancienne injection innerHTML encore présente");

check(!home.includes("home-redesign.css"), "Homepage: retired stylesheet is still loaded");
check(!home.includes("product-filters") && !home.includes("filter-btn"), "Homepage: unsupported catalogue filters remain visible");
check(home.includes('id="home-universes-grid"'), "Homepage: universe mount is missing");
check(home.includes('href="boutique.html"') && /D.couvrir la boutique/.test(home), "Homepage: primary catalogue CTA is missing");

const homeCss = read("css/home.css");
const homeLogic = read("js/home-products.js");
const mainLogic = read("js/main.js");
check(!/object-fit\s*:\s*fill/i.test(homeCss), "Homepage: object-fit fill can still deform imagery");
check(homeCss.includes("@media (prefers-reduced-motion: reduce)"), "Homepage: reduced-motion CSS is missing");
check(mainLogic.includes("prefers-reduced-motion: reduce"), "Homepage: reduced-motion JS behavior is missing");
check(!/week|weekly|filter-btn|product-filters/i.test(homeLogic), "Homepage: obsolete weekly rotation or filters remain");
check(homeLogic.includes("const FEATURED") && homeLogic.includes("resolveFeatured"), "Homepage: deterministic selection and fallback are missing");
check(homeLogic.includes("ROSBriTaxonomy") && homeLogic.includes("ROSBriTaxonomy.url"), "Homepage: taxonomy-derived destinations are missing");
check(homeLogic.includes("replaceChildren"), "Homepage: safe DOM rendering is missing");
[
  "kimono-adulte-rosbri-26.webp",
  "sac-cabas-afrique-wax-rouge.webp",
  "mini-aventure.webp",
  "coussin-rosbri-wax-01.webp",
  "hero-bag-mobile.webp"
].forEach(function (file) {
  check(fs.existsSync(path.join(root, "images", "optimized", "home", file)), "Homepage: optimized image missing: " + file);
});

const productHtml = read("produit.html");
check(!productHtml.includes("item = window.catalogView[0]"), "Produit : repli silencieux vers le premier produit");
check(productHtml.includes('id="product-not-found"'), "Produit : état introuvable absent");
check(productHtml.includes("eligibleItems"), "Produit : exclusion du produit courant non vérifiable");
check(productHtml.includes('id="product-jsonld"'), "Produit : JSON-LD absent");

const notFound = read("404.html");
check(/name="robots" content="noindex/.test(notFound), "404 : noindex absent");
check(!notFound.includes("catalog-data.js") && !notFound.includes('src="catalog.js'), "404 : catalogue chargé inutilement");
check(!notFound.includes("<style>"), "404 : CSS intégré encore présent");

const taxonomySource = read("js/taxonomy.js");
const catalogSource = read("catalog-data.js");
const catalogLogic = read("catalog.js");
const callbacks = {};
const documentStub = {
  documentElement: { dataset: {} },
  body: { style: {} },
  getElementById: function () { return null; },
  querySelectorAll: function () { return []; },
  querySelector: function () { return null; },
  addEventListener: function (name, callback) { callbacks[name] = callback; },
  dispatchEvent: function () {}
};
const sandbox = {
  window: {
    location: { search: "", pathname: "/boutique.html", hash: "" },
    addEventListener: function () {},
    history: { replaceState: function () {} },
    setTimeout: function () {},
    clearTimeout: function () {}
  },
  document: documentStub,
  console: console,
  URLSearchParams: URLSearchParams,
  CustomEvent: function () {},
  setInterval: function () {},
  setTimeout: function () {},
  clearTimeout: function () {}
};
sandbox.window.window = sandbox.window;
sandbox.window.document = documentStub;
vm.createContext(sandbox);
vm.runInContext(taxonomySource, sandbox);
vm.runInContext(catalogSource, sandbox);
vm.runInContext(catalogLogic, sandbox);

[
  ["accessoires","accessoires"],
  ["Accessoires","accessoires"],
  ["Sacs & Pochettes","accessoires"],
  ["entreprise","entreprise"],
  ["Vêtements","vetements"],
  ["Packs & Idées Cadeaux","cadeaux"]
].forEach(function (test) {
  check(sandbox.window.ROSBriTaxonomy.resolve(test[0]) === test[1], "Alias de catégorie non reconnu : " + test[0]);
});
const validProduct = sandbox.window.findProductBySlugOrId("483");
const invalidProduct = sandbox.window.findProductBySlugOrId("999999");
check(validProduct && String(validProduct.id) === "483", "Produit 483 introuvable");
check(invalidProduct === null, "Produit 999999 ne renvoie pas null");
check(sandbox.window.catalogView.length > 0, "Catalogue vide");
sandbox.window.ROSBriTaxonomy.definitions.forEach(function (definition) {
  const count = sandbox.window.catalogView.filter(function (item) {
    return sandbox.window.categoryMatches(item, definition.id);
  }).length;
  check(count > 0 || definition.id === "entreprise", "Catégorie canonique vide : " + definition.id);
});

const products = sandbox.window.ROSBriCatalog || [];
const ids = products.map(function (item) { return String(item.id); });
check(ids.length === new Set(ids).size, "Catalogue : identifiants dupliqués");
products.forEach(function (item) {
  if (item.image) check(fs.existsSync(path.join(root, item.image)), "Image absente : " + item.image);
});
const collectionCards = (read("collections.html").match(/class="collection-universe /g) || []).length;
check(collectionCards === 6, "Collections : six univers attendus, trouvé " + collectionCards);
check(fs.existsSync(path.join(root, "css/tailwind.generated.min.css")), "CSS Tailwind local absent");
check(fs.existsSync(path.join(root, "produits")), "Pages produits SEO absentes");

if (failures.length) {
  console.error(failures.map(function (failure) { return "FAIL " + failure; }).join(String.fromCharCode(10)));
  process.exit(1);
}
console.log("All site verification checks passed (" + products.length + " products).");
