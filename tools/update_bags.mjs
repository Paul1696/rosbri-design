import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const updates = {
  "Sac cabas ROSBRI 63": {
    newTitle: "Sac de voyage Floral Sombre",
    newDesc: "Sac de voyage cylindrique spacieux avec un élégant motif floral sur fond noir."
  },
  "Sac cabas ROSBRI 65": {
    newTitle: "Sac de voyage Soleil Éclatant",
    newDesc: "Sac de voyage cylindrique aux motifs géométriques jaunes et détails bleus."
  },
  "Sac cabas ROSBRI 66": {
    newTitle: "Sac de voyage Nuit Étoilée",
    newDesc: "Sac de voyage pratique au tissu sombre moucheté de couleurs vives."
  },
  "Sac cabas ROSBRI 67": {
    newTitle: "Sac de voyage Indigo Tradition",
    newDesc: "Sac de voyage robuste en tissu bleu à motifs avec extrémités texturées."
  },
  "Sac cabas ROSBRI 68": {
    newTitle: "Sac d'ordinateur Patchwork",
    newDesc: "Sacoche d'ordinateur matelassée aux motifs géométriques colorés, avec sangle réglable."
  }
};

const blocks = content.split('  {\n');
for (let i = 1; i < blocks.length; i++) {
  for (const [oldTitle, data] of Object.entries(updates)) {
    if (blocks[i].includes(`"title": "${oldTitle}"`)) {
      blocks[i] = blocks[i].replace(`"title": "${oldTitle}"`, `"title": "${data.newTitle}"`);
      // Update description
      blocks[i] = blocks[i].replace(/"description": "[^"]+"/, `"description": "${data.newDesc}"`);
    }
  }
}

fs.writeFileSync(filePath, blocks.join('  {\n'), 'utf8');
console.log("Updated bags!");
