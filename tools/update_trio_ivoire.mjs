import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /"title":\s*"Duo sac bandouliere ivoire ROSBRI et sandales assorties"[\s\S]*?"description":\s*"[^"]+"/;
content = content.replace(
  regex,
  `"title": "Trio bandoulière ivoire ROSBRI, pochette et sandales",
    "category": "Packs",
    "price": "18 000 FCFA",
    "image": "images/articles-site/sacs/variants/sac-rosbri-wax-131.png",
    "reviews": [
      {
        "name": "Aïssatou",
        "rating": 5,
        "text": "L?ensemble est sublime, parfait pour un mariage ou une f?te."
      },
      {
        "name": "Fran?oise",
        "rating": 5,
        "text": "Tr?s chic et agr?able ? porter, je suis ravie."
      }
    ],
    "isPack": true,
    "description": "Superbe ensemble comprenant un sac bandoulière ivoire aux détails wax, sa petite pochette assortie et une paire de sandales. Un trio complet pour une allure chic et parfaitement coordonnée."`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated Trio ivoire!");
