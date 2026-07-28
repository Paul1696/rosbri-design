import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find and replace the block for Babouches ROSBRI multicolores 21
const regex = /"title":\s*"Babouches ROSBRI multicolores 21"[\s\S]*?"description":\s*"[^"]+"/;

content = content.replace(
  regex,
  `"title": "Pack Babouches multicolores ROSBRI 21",
    "category": "Packs",
    "price": "8 500 FCFA",
    "image": "images/articles-site/babouches/variants/babouches-rosbri-wax-21.png",
    "reviews": [
      {
        "name": "Brenda",
        "rating": 5,
        "text": "La paire est légère et les couleurs ressortent très bien."
      },
      {
        "name": "Yasmine",
        "rating": 5,
        "text": "Confortable pour la maison, avec une vraie touche wax."
      }
    ],
    "isPack": true,
    "description": "Pack coordonné comprenant une paire de babouches multicolores en wax et son accessoire assorti. Un ensemble vibrant et coloré pour égayer votre quotidien."`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated Pack Babouches 21!");
