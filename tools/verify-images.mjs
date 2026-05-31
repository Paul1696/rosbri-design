import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogJs = fs.readFileSync(path.join(root, "catalog.js"), "utf8");
const catalogData = fs.readFileSync(path.join(root, "catalog-data.js"), "utf8");
const keep = new Set();

for (const m of catalogData.matchAll(/"image": "(images\/[^"]+)"/g)) {
  keep.add(m[1]);
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
    keep.add(`images/${folder}/variants/${slug}-${c}.png`);
  }
}

const missing = [...keep].filter((p) => !fs.existsSync(path.join(root, p)));
const extras = [];

function walk(dir, rel = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, relPath);
      continue;
    }
    const key = `images/${relPath.replace(/\\/g, "/")}`;
    if (!keep.has(key)) extras.push(key);
  }
}

walk(path.join(root, "images"));

console.log("Referenced:", keep.size);
console.log("Missing:", missing.length);
console.log("Extra:", extras.length);
if (missing.length) console.log(missing.slice(0, 5));
if (extras.length) console.log(extras.slice(0, 5));
