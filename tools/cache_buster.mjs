import fs from 'fs';

for (let file of ['e:/APPS/ROSBRI DESIGN/boutique.html', 'e:/APPS/ROSBRI DESIGN/index.html']) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\?v=20260602-cms/g, "?v=20260606-new" + Date.now());
  fs.writeFileSync(file, content, 'utf8');
}
console.log("Cache busted.");
