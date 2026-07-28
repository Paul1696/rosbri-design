import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const targets = [
  "Duo sac gris et bleu ROSBRI avec coussin assorti",
  "Ensemble adulte ROSBRI 21",
  "Ensemble adulte ROSBRI 22",
  "Ensemble adulte ROSBRI 23",
  "Ensemble adulte ROSBRI 24",
  "Ensemble adulte ROSBRI 25",
  "Ensemble adulte ROSBRI 26",
  "Ensemble adulte ROSBRI 27",
  "Ensemble adulte ROSBRI 28",
  "Ensemble adulte ROSBRI 29",
  "Ensemble adulte ROSBRI 30"
];

for (const title of targets) {
  // Use regex to match the item block and replace its price
  // The regex looks for the title, and then the next price field
  const regex = new RegExp(`("title":\\s*"${title}"[\\s\\S]*?"price":\\s*")[^"]+(")`);
  content = content.replace(regex, `$110 000 FCFA$2`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated prices to 10000 FCFA!");
