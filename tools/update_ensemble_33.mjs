import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /"title":\s*"Ensemble adulte ROSBRI 33"[\s\S]*?"description":\s*"[^"]+"/;
content = content.replace(
  regex,
  `"title": "Ensemble enfant ROSBRI 33",
    "category": "Ensembles",
    "price": "10 000 FCFA",
    "image": "images/articles-site/ensembles/adultes/variants/ensemble-adultes-rosbri-wax-33.png",
    "reviews": [
      {
        "name": "Murielle",
        "rating": 5,
        "text": "La coupe est confortable et le motif ressort tr?s bien."
      },
      {
        "name": "Ariane",
        "rating": 5,
        "text": "Belle finition, exactement l?esprit ROSBRI que je voulais."
      }
    ],
    "description": "Ensemble haut et bas pour enfant avec motifs en wax colorés. Une tenue confortable et joyeuse pour les petits."`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated Ensemble 33!");
