import fs from 'fs';

const file = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(file, 'utf8');

// The broken JSON starts around line 3294. Let's find it.
// It looks like:
//   {
//         "name": "Yasmine",
//         "rating": 5,
//         "text": "J?aime le rendu, c?est simple et ?l?gant."
//       }
//     ],
//     "description": "Pochette ROSBRI compacte, pratique pour les essentiels et facile a glisser dans un sac ou a offrir."
//   },

const fixRegex = /\{\s*"name":\s*"Yasmine"[\s\S]*?"Pochette ROSBRI compacte, pratique pour les essentiels et facile a glisser dans un sac ou a offrir\."\s*\},/g;

content = content.replace(fixRegex, '');

fs.writeFileSync(file, content, 'utf8');
console.log("Fix applied");
