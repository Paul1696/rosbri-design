import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogJs = fs.readFileSync(path.join(root, "catalog.js"), "utf8");
const catalogData = fs.readFileSync(path.join(root, "catalog-data.js"), "utf8");

const keepPng = new Set();

for (const m of catalogData.matchAll(/"image": "(images\/[^"]+)"/g)) {
  keepPng.add(m[1]);
}

const blockRe = /fullTshirtVariants\("([^"]+)", \[([^\]]+)\]\)/g;
let bm;
while ((bm = blockRe.exec(catalogJs))) {
  const slug = bm[1];
  const colors = [...bm[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  const folderMatch = catalogData.match(
    new RegExp(`"image": "images/([^/]+)/variants/${slug}-[^"]+\\.png"`)
  );
  const folder = folderMatch?.[1] || "heritage";
  for (const c of colors) {
    keepPng.add(`images/${folder}/variants/${slug}-${c}.png`);
  }
}

const imagesRoot = path.join(root, "images");
let deleted = 0;
let kept = 0;

function walk(dir, rel = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, relPath);
      if (fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
      }
      continue;
    }
    const key = `images/${relPath.replace(/\\/g, "/")}`;
    if (keepPng.has(key)) {
      kept++;
      continue;
    }
    fs.unlinkSync(full);
    deleted++;
  }
}

console.log("PNG to keep:", keepPng.size);
walk(imagesRoot);
console.log("Kept:", kept, "Deleted:", deleted);
