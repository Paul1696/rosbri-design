import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const wrongContent = `"title": "Sac banane ROSBRI 06",
    "category": "Pochettes",
    "price": "4 500 FCFA",
    "image": "images/articles-site/pochettes/variants/pochette-rosbri-wax-06.png",
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
    "description": "Sac banane matelassé aux motifs africains colorés. Pratique et tendance, idéal pour garder vos essentiels à portée de main tout en gardant les mains libres."`;

const originalChapeau = `"title": "Chapeau paille rose bordure",
    "category": "Chapeaux",
    "price": "8 500 FCFA",
    "image": "images/articles-site/chapeaux/variants/chapeau-rosbri-wax-06.png",
    "description": "Chapeau de paille rose avec bordure et ruban contrastés, pensé pour apporter une note féminine et colorée."`;

content = content.replace(wrongContent, originalChapeau);

const oldPochetteRegex = new RegExp(`"title":\\s*"Pochette ROSBRI 06"[\\s\\S]*?\\}`);
if (oldPochetteRegex.test(content)) {
  content = content.replace(oldPochetteRegex, (match) => {
    let block = match.replace(/"title":\s*"Pochette ROSBRI 06"/, `"title": "Sac banane ROSBRI 06"`);
    block = block.replace(/"description":\s*"[^"]+"/, `"description": "Sac banane matelassé aux motifs africains colorés. Pratique et tendance, idéal pour garder vos essentiels à portée de main tout en gardant les mains libres."`);
    return block;
  });
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Fixed!");
