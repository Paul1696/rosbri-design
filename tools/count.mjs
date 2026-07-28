import fs from 'fs';

const content = fs.readFileSync('e:/APPS/ROSBRI DESIGN/catalog-data.js', 'utf8');
const match = content.match(/window\.ROSBriCatalog\s*=\s*(\[[\s\S]*\]);/);
if (match) {
  try {
    const arr = eval(match[1]);
    console.log("Total articles:", arr.length);
  } catch(e) {
    console.log("Parse error:", e.message);
  }
} else {
  console.log("Could not find array");
}
