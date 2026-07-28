import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /"title":\s*"Duo sac bandouliere ivoire ROSBRI et claquettes assorties"[\s\S]*?"description":\s*"[^"]+"/;
content = content.replace(
  regex,
  `"title": "Pack Bandoulière ivoire ROSBRI & Claquettes",
    "category": "Packs",
    "price": "12 000 FCFA",
    "image": "images/articles-site/sacs/variants/sac-rosbri-wax-137.png",
    "reviews": [
      {
        "name": "St?phanie",
        "rating": 5,
        "text": "Confortable au pied et tr?s joli avec une tenue simple."
      },
      {
        "name": "Gr?ce",
        "rating": 4,
        "text": "Belle paire, les finitions wax font vraiment la diff?rence."
      }
    ],
    "isPack": true,
    "description": "Ensemble estival comprenant un sac bandoulière ivoire aux détails wax et une paire de claquettes assorties. Idéal pour un look décontracté et élégant."`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated Duo claquettes!");
