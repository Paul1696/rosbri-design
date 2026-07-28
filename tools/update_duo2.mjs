import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /"title":\s*"Pack Banane bleue & Babouches ROSBRI"[\s\S]*?"description":\s*"[^"]+"/,
  `"title": "Pack Banane bleue & Babouches ROSBRI",
    "category": "Packs",
    "price": "10 000 FCFA",
    "image": "images/articles-site/sacs/variants/sac-rosbri-wax-124.png",
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
    "description": "Ensemble pratique et stylé comprenant une banane matelassée bleue et sa paire de babouches assorties aux motifs wax colorés."`
);

content = content.replace(
  /"title":\s*"Sac cabas ROSBRI 101"[\s\S]*?"description":\s*"[^"]+"/,
  `"title": "Sac cabas ROSBRI 101",
    "category": "Sacs",
    "price": "10 000 FCFA",
    "image": "images/articles-site/sacs/variants/sac-rosbri-wax-101.png",
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
    "description": "Sac cabas grand format avec motifs wax élégants. Idéal pour vos achats, vos sorties ou comme sac de tous les jours."`
);

content = content.replace(
  /"title":\s*"Sac cabas ROSBRI 102"[\s\S]*?"description":\s*"[^"]+"/,
  `"title": "Sac cabas ROSBRI 102",
    "category": "Sacs",
    "price": "10 000 FCFA",
    "image": "images/articles-site/sacs/variants/sac-rosbri-wax-102.png",
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
    "description": "Cabas spacieux en wax, parfait pour allier style africain et grande capacité. Un compagnon résistant et confortable à porter."`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated descriptions!");
