import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Rename Sac cabas ROSBRI 109 to Sac à dos
const regex109 = /"title":\s*"Sac cabas ROSBRI 109"[\s\S]*?"description":\s*"[^"]+"/;
content = content.replace(
  regex109,
  `"title": "Sac à dos ROSBRI 109",
    "category": "SacsADos",
    "price": "10 000 FCFA",
    "image": "images/articles-site/sacs/variants/sac-rosbri-wax-109.png",
    "reviews": [
      {
        "name": "Clarisse",
        "rating": 5,
        "text": "Le sac est solide, pratique et les couleurs attirent les compliments."
      },
      {
        "name": "Nadine",
        "rating": 5,
        "text": "Tr?s belle qualit?, parfait pour une sortie ou un cadeau."
      }
    ],
    "description": "Sac à dos pratique et confortable avec motifs wax vibrants. Idéal pour transporter vos affaires de tous les jours avec un style original."`
);

// 2. Rename Duo cabas vert... to Duo bandouliere et babouche
const regexVert = /"title":\s*"Duo cabas vert ROSBRI et babouches assorties"[\s\S]*?"description":\s*"[^"]+"/;
content = content.replace(
  regexVert,
  `"title": "Pack Bandoulière verte & Babouches ROSBRI",
    "category": "Packs",
    "price": "10 000 FCFA",
    "image": "images/articles-site/sacs/variants/sac-rosbri-wax-114.png",
    "reviews": [
      {
        "name": "Clarisse",
        "rating": 5,
        "text": "Le sac est solide, pratique et les couleurs attirent les compliments."
      },
      {
        "name": "Nadine",
        "rating": 5,
        "text": "Tr?s belle qualit?, parfait pour une sortie ou un cadeau."
      }
    ],
    "isPack": true,
    "description": "Ensemble assorti comprenant un sac bandoulière vert en wax et sa paire de babouches. Un duo parfait pour un style décontracté et coloré."`
);

// 3. Delete Duo sac bowling floral noir ROSBRI et babouches assorties
// We match from { to }, followed by comma
const regexDelete = /\{\s*"id":\s*\d+,\s*"title":\s*"Duo sac bowling floral noir ROSBRI et babouches assorties"[^}]+\},\s*/;
if (regexDelete.test(content)) {
    content = content.replace(regexDelete, '');
} else {
    console.log("Delete target not found!");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updates applied successfully!");
