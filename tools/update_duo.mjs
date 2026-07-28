import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const updates = {
  "Duo banane bleue ROSBRI et babouches assorties": {
    title: "Pack Banane bleue & Babouches ROSBRI",
    price: "10 000 FCFA",
    description: "Ensemble pratique et stylé comprenant une banane matelassée bleue et sa paire de babouches assorties aux motifs wax colorés."
  },
  "Sac cabas ROSBRI 101": {
    title: "Sac cabas ROSBRI 101",
    price: "10 000 FCFA",
    description: "Sac cabas grand format avec motifs wax élégants. Idéal pour vos achats, vos sorties ou comme sac de tous les jours."
  },
  "Sac cabas ROSBRI 102": {
    title: "Sac cabas ROSBRI 102",
    price: "10 000 FCFA",
    description: "Cabas spacieux en wax, parfait pour allier style africain et grande capacité. Un compagnon résistant et confortable à porter."
  }
};

for (const [oldTitle, newProps] of Object.entries(updates)) {
  const regex = new RegExp(`"title":\\s*"${oldTitle}"[\\s\\S]*?\\}`);
  content = content.replace(regex, (match) => {
    let block = match.replace(/"title":\s*"[^"]+"/, `"title": "${newProps.title}"`);
    block = block.replace(/"price":\s*"[^"]+"/, `"price": "${newProps.price}"`);
    if (newProps.description) {
      block = block.replace(/"description":\s*"[^"]+"/, `"description": "${newProps.description}"`);
    }
    return block;
  });
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated!");
