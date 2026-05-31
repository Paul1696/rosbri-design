import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesRoot = path.join(root, "images");
const newProducts = JSON.parse(
  fs.readFileSync(path.join(root, "tools", "new-products.json"), "utf8")
);

const categoryFolders = {
  Heritage: "heritage",
  Anime: "anime",
  Maman: "maman",
  Customisation: "customisation",
  Sacs: "sacs",
  Accessoires: "accessoires"
};

let copied = 0;
let removed = 0;

for (const product of newProducts) {
  const folder = categoryFolders[product.category];
  const destDir = path.join(imagesRoot, folder, "variants");
  fs.mkdirSync(destDir, { recursive: true });

  product.filenames.forEach((sourceName, index) => {
    const color = product.colors[index];
    const destName = `${product.slug}-${color}.png`;
    const sourcePath = path.join(imagesRoot, sourceName);
    const destPath = path.join(destDir, destName);

    if (!fs.existsSync(sourcePath)) {
      console.warn("Missing source:", sourceName);
      return;
    }
    fs.copyFileSync(sourcePath, destPath);
    fs.unlinkSync(sourcePath);
    copied++;
    removed++;
  });
}

const catalogRaw = fs.readFileSync(path.join(root, "catalog-data.js"), "utf8");
const catalog = JSON.parse(
  catalogRaw.replace(/^window\.ROSBriCatalog\s*=\s*/, "").replace(/;\s*$/, "")
);

let nextId = Math.max(...catalog.map((item) => item.id)) + 1;
const newEntries = [];

for (const product of newProducts) {
  const folder = categoryFolders[product.category];
  const image = `images/${folder}/variants/${product.slug}-${product.defaultColor}.png`;
  newEntries.push({
    id: nextId++,
    title: product.title,
    category: product.category,
    price: "6 500 FCFA",
    image
  });
}

const merged = [...catalog, ...newEntries];
const catalogOut =
  "window.ROSBriCatalog = " + JSON.stringify(merged, null, 2) + ";\n";
fs.writeFileSync(path.join(root, "catalog-data.js"), catalogOut, "utf8");

const variantLines = newEntries
  .map((entry, i) => {
    const product = newProducts[i];
    const colorsJson = JSON.stringify(product.colors);
    return `    ${entry.id}: fullTshirtVariants("${product.slug}", ${colorsJson})`;
  })
  .join(",\n");

const catalogJsPath = path.join(root, "catalog.js");
let catalogJs = fs.readFileSync(catalogJsPath, "utf8");
const insertMarker = "    32: fullTshirtVariants(\"duo-tshirts-big-brother-lil-brother\"";
if (!catalogJs.includes(insertMarker)) {
  throw new Error("Could not find productColorVariants insertion point");
}
if (!catalogJs.includes("tshirt-systeme-solaire-pacman")) {
  catalogJs = catalogJs.replace(
    insertMarker + ', ["blanc", "sable", "sable-clair", "rose", "vert-sauge", "mauve", "bleu-ciel", "gris", "bordeaux", "noir"])\n  };',
    insertMarker + ', ["blanc", "sable", "sable-clair", "rose", "vert-sauge", "mauve", "bleu-ciel", "gris", "bordeaux", "noir"]),\n' +
      variantLines + "\n  };"
  );
  fs.writeFileSync(catalogJsPath, catalogJs, "utf8");
}

console.log("Imported variants:", copied);
console.log("Removed ChatGPT sources:", removed);
console.log("New catalog items:", newEntries.length);
