import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

// Update Babouches ROSBRI 20
content = content.replace(
  /"title":\s*"Babouches ROSBRI 20"[\s\S]*?"description":\s*"[^"]+"/,
  `"title": "Babouches ROSBRI 20",
    "category": "Babouches",
    "price": "5 000 FCFA",
    "image": "images/articles-site/babouches/variants/babouches-rosbri-wax-20.png",
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
    "description": "Paire de babouches artisanales avec détails wax. Confortables et légères, idéales pour se détendre à la maison avec une touche d'élégance africaine."`
);

// Update Coussin ROSBRI 01
content = content.replace(
  /"title":\s*"Coussin ROSBRI 01"[\s\S]*?"description":\s*"[^"]+"/,
  `"title": "Pack de 3 Coussins ROSBRI 01",
    "category": "Coussins",
    "price": "7 000 FCFA",
    "image": "images/articles-site/coussins/variants/coussin-rosbri-wax-01.png",
    "reviews": [
      {
        "name": "Clarisse",
        "rating": 5,
        "text": "Le coussin est moelleux et les couleurs sont éclatantes."
      },
      {
        "name": "Nadine",
        "rating": 5,
        "text": "Très belle finition, parfait pour décorer le salon."
      }
    ],
    "isPack": true,
    "description": "Ensemble de 3 coussins décoratifs avec motifs wax assortis. Parfaits pour habiller votre salon ou votre chambre d'une touche chaleureuse et colorée."`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated Babouches and Coussins!");
