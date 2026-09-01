const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "catalog-data.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);
const products = Array.isArray(sandbox.window.ROSBriCatalog) ? sandbox.window.ROSBriCatalog : [];
const baseUrl = "https://rosbridesign.ateliersdepaul.com";
const outDir = path.join(root, "produits");
fs.mkdirSync(outDir, { recursive: true });

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, function (char) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
  });
}
function slugify(item) {
  return String(item.slug || item.title || "produit").toLowerCase().normalize("NFD")
    .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + "-" + item.id;
}
function absolute(resource) {
  return new URL(String(resource || "images/brand/rosbri-wax-design-logo.jpg"), baseUrl + "/").href;
}

const sitemap = [
  baseUrl + "/",
  baseUrl + "/boutique.html",
  baseUrl + "/collections.html",
  baseUrl + "/a_propos.html"
];

products.forEach(function (item) {
  if (!item || item.id === undefined) return;
  const slug = slugify(item);
  const title = String(item.title || "Création ROSBRI DESIGN");
  const description = String(item.description || "Découvrez cette création ROSBRI DESIGN.");
  const image = absolute(item.image);
  const pageUrl = baseUrl + "/produits/" + slug + ".html";
  const dynamicUrl = "../produit.html?id=" + encodeURIComponent(String(item.id));
  const numericPrice = Number(String(item.price || "").replace(/[^0-9]/g, ""));
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description,
    image: [image],
    sku: String(item.id),
    brand: { "@type": "Brand", name: "ROSBRI DESIGN" },
    url: pageUrl
  };
  if (numericPrice > 0) {
    productLd.offers = {
      "@type": "Offer",
      priceCurrency: "XAF",
      price: numericPrice,
      availability: "https://schema.org/PreOrder",
      url: pageUrl
    };
  }

  const html = [
    "<!doctype html>",
    '<html lang="fr"><head><meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    "<title>" + escapeHtml(title) + " | ROSBRI DESIGN</title>",
    '<meta name="description" content="' + escapeHtml(description.slice(0, 160)) + '">',
    '<link rel="canonical" href="' + pageUrl + '">',
    '<meta property="og:type" content="product">',
    '<meta property="og:title" content="' + escapeHtml(title) + '">',
    '<meta property="og:description" content="' + escapeHtml(description.slice(0, 200)) + '">',
    '<meta property="og:image" content="' + image + '">',
    '<meta property="og:url" content="' + pageUrl + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<link rel="stylesheet" href="../css/tokens.css">',
    '<link rel="stylesheet" href="../css/base.css">',
    '<link rel="stylesheet" href="../css/seo-product.css">',
    '<script type="application/ld+json">' + JSON.stringify(productLd).replace(/</g, "\u003c") + "</script>",
    "</head><body>",
    '<a class="skip-link" href="#main-content">Aller au contenu principal</a>',
    '<main id="main-content" class="seo-product-page">',
    '<a class="seo-product-back" href="../boutique.html">← Retour à la boutique</a>',
    '<article class="seo-product-card">',
    '<div class="seo-product-media"><img src="' + image + '" alt="' + escapeHtml(title) + '" width="900" height="1100"></div>',
    '<div class="seo-product-content"><span class="eyebrow">' + escapeHtml(item.category || "Création ROSBRI DESIGN") + "</span>",
    "<h1>" + escapeHtml(title) + "</h1>",
    '<p class="seo-product-price">' + escapeHtml(item.price || "Sur devis") + "</p>",
    '<p class="seo-product-description">' + escapeHtml(description) + "</p>",
    '<p class="seo-product-note">Options, disponibilité et délai confirmés avant validation.</p>',
    '<a class="button-primary" href="' + dynamicUrl + '">Configurer et commander</a>',
    "</div></article></main></body></html>"
  ].join("");
  fs.writeFileSync(path.join(outDir, slug + ".html"), html, "utf8");
  sitemap.push(pageUrl);
});

const today = new Date().toISOString().slice(0, 10);
const newline = String.fromCharCode(10);
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  sitemap.map(function (url, index) {
    const priority = index === 0 ? "1.0" : (index < 4 ? "0.8" : "0.6");
    return "  <url><loc>" + url.replace(/&/g, "&amp;") + "</loc><lastmod>" + today + "</lastmod><priority>" + priority + "</priority></url>";
  }).join(newline),
  "</urlset>"
].join(newline);
fs.writeFileSync(path.join(root, "sitemap.xml"), xml, "utf8");
console.log("Generated " + products.length + " SEO product pages and sitemap.xml");