import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const imagesRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "images");
const files = fs.readdirSync(imagesRoot).filter((f) => f.startsWith("ChatGPT") && f.endsWith(".png"));

const batches = new Map();
for (const file of files) {
  const m = file.match(/^(ChatGPT Image .+ \d+_\d+_\d+) \((\d+)\)\.png$/);
  if (!m) {
    console.log("Unparsed:", file);
    continue;
  }
  const key = m[1];
  if (!batches.has(key)) batches.set(key, []);
  batches.get(key).push({ file, num: Number(m[2]) });
}

for (const [key, items] of [...batches.entries()].sort()) {
  items.sort((a, b) => a.num - b.num);
  console.log(`\n${key} (${items.length} images)`);
  console.log(items.map((i) => i.num).join(", "));
}

console.log("\nTotal batches:", batches.size);
console.log("Total new files:", files.length);
