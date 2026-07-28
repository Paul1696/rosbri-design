import fs from 'fs';

const origPath = 'e:/APPS/ROSBRI DESIGN/tools/orig_catalog.js';
const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';

let origContent = fs.readFileSync(origPath, 'utf8');
let currentContent = fs.readFileSync(filePath, 'utf8');

// I need to extract the original ID 141 to 143 blocks from origContent
const origRegex = /(\{\s*"id": 141,[\s\S]*?\},\s*\{\s*"id": 142,[\s\S]*?\},\s*\{\s*"id": 143,[\s\S]*?"title": "Pochette ROSBRI wax 02",[\s\S]*?\})/;
// Wait, orig_catalog.js has ID 143 as "Pochette ROSBRI wax 02" ? No, let's just find "id": 141 and "id": 143 in orig_catalog.js and see.

// Let's just do it manually:
const originalBlock = `{
    "id": 141,
    "title": "Chapeau paille rose bordure wax",
    "category": "Chapeaux",
    "price": "5 000 FCFA",
    "image": "images/articles-site/chapeaux/variants/chapeau-rosbri-wax-06.png",
    "description": "Chapeau de paille rose avec bordure et ruban wax contrastés, pensé pour apporter une note féminine et colorée."
  },
  {
    "id": 143,
    "title": "Pochette ROSBRI 01",
    "category": "Pochettes",
    "price": "4 500 FCFA",
    "image": "images/articles-site/pochettes/variants/pochette-rosbri-wax-01.png",
    "description": "Pochette ROSBRI compacte, pratique pour les essentiels et facile a glisser dans un sac ou a offrir."
  }`;

// Find the bad block in currentContent:
const badBlock = /\{\s*"id": 141,[\s\S]*?"title": "Sacoche ROSBRI 08",[\s\S]*?"category": "Bandoulieres",[\s\S]*?"description": "Sacoche pratique et élégante avec détails en wax\. Idéale pour transporter vos petits essentiels \(téléphone, clés, portefeuille\) tout en gardant les mains libres\."\s*\}/;

currentContent = currentContent.replace(badBlock, originalBlock);

// Now correctly replace Pochette ROSBRI 08
const pochette8Regex = /"title":\s*"Pochette ROSBRI 08"[\s\S]*?"description":\s*"[^"]+"/;
currentContent = currentContent.replace(
  pochette8Regex,
  `"title": "Sacoche ROSBRI 08",
    "category": "Bandoulieres",
    "price": "4 500 FCFA",
    "image": "images/articles-site/pochettes/variants/pochette-rosbri-wax-08.png",
    "reviews": [
      {
        "name": "Brenda",
        "rating": 5,
        "text": "Petit d?tail original, tr?s propre et facile ? offrir."
      },
      {
        "name": "Yasmine",
        "rating": 5,
        "text": "J?aime le rendu, c?est simple et ?l?gant."
      }
    ],
    "description": "Sacoche pratique et élégante avec détails en wax. Idéale pour transporter vos petits essentiels tout en gardant les mains libres."`
);

fs.writeFileSync(filePath, currentContent, 'utf8');
console.log("Fixed and Updated Sacoche 08!");
