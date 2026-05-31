import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesRoot = path.join(root, "images");

const categoryFolders = {
  Heritage: "heritage",
  Anime: "anime",
  Maman: "maman",
  Customisation: "customisation",
  Sacs: "sacs",
  Accessoires: "accessoires"
};

function parseCatalogData() {
  const raw = fs.readFileSync(path.join(root, "catalog-data.js"), "utf8");
  return JSON.parse(raw.replace(/^window\.ROSBriCatalog\s*=\s*/, "").replace(/;\s*$/, ""));
}

const colorSuffixes = [
  "rouge-corail", "sable-clair", "gris-fonce", "vert-foret", "vert-sauge", "vert-olive",
  "bleu-canard", "bleu-ciel", "bleu-nuit", "rouge", "blancs", "bordeaux", "menthe",
  "orange", "mauve", "jaune", "marron", "sable", "blanc", "noir", "rose", "gris", "dore"
];

function slugFromFileName(fileName) {
  const base = fileName.replace(/\.(png|jpg|jpeg)$/i, "");
  for (const color of colorSuffixes) {
    if (base.endsWith(`-${color}`)) {
      return base.slice(0, -(color.length + 1));
    }
  }
  return base;
}

function moveFile(fromRel, toRel) {
  const from = path.join(imagesRoot, fromRel);
  const to = path.join(imagesRoot, toRel);
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (path.resolve(from) === path.resolve(to)) return true;
  fs.renameSync(from, to);
  return true;
}

const catalog = parseCatalogData();
const slugToFolder = {};

for (const item of catalog) {
  const folder = categoryFolders[item.category];
  if (!folder) continue;
  const fileName = path.basename(item.image);
  slugToFolder[slugFromFileName(fileName)] = folder;
}

let moved = 0;

for (const [slug, folder] of Object.entries(slugToFolder)) {
  const legacyDir = path.join(imagesRoot, "variants");
  if (fs.existsSync(legacyDir)) {
    for (const file of fs.readdirSync(legacyDir)) {
      const base = file.replace(/\.png$/, "");
      if (!file.endsWith(".png") || (base !== slug && !base.startsWith(`${slug}-`))) continue;
      if (moveFile(`variants/${file}`, `${folder}/variants/${file}`)) moved++;
    }
  }

  for (const file of fs.readdirSync(imagesRoot)) {
    if (!file.endsWith(".png")) continue;
    const base = file.replace(/\.png$/, "");
    if (base !== slug && !base.startsWith(`${slug}-`)) continue;
    if (moveFile(file, `${folder}/variants/${file}`)) moved++;
  }
}

const updatedCatalog = catalog.map((item) => {
  const fileName = path.basename(item.image);
  const slug = slugFromFileName(fileName);
  const folder = slugToFolder[slug];
  return {
    ...item,
    image: `images/${folder}/variants/${fileName}`
  };
});

fs.writeFileSync(
  path.join(root, "catalog-data.js"),
  "window.ROSBriCatalog = " + JSON.stringify(updatedCatalog, null, 2) + ";\n",
  "utf8"
);

for (const dir of ["variants", "optimized"]) {
  const full = path.join(imagesRoot, dir);
  if (fs.existsSync(full) && fs.readdirSync(full).length === 0) {
    fs.rmdirSync(full);
  }
}

console.log("Moved files:", moved);
console.log("Catalog paths refreshed");
