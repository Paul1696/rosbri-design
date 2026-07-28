import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /"title":\s*"Pochette ROSBRI 09"[\s\S]*?"description":\s*"[^"]+"/;
content = content.replace(
  regex,
  `"title": "Sacoche ROSBRI 09",
    "category": "Bandoulieres",
    "price": "4 500 FCFA",
    "image": "images/articles-site/pochettes/variants/pochette-rosbri-wax-09.png",
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

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated Sacoche 09!");
