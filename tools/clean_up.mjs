import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

// I want to remove the block:
//   {
//     "id": 142,
//     "title": "Sac banane ROSBRI 06",
// ...
//   },

const badBlockRegex = /\{\s*"id": 142,\s*"title": "Sac banane ROSBRI 06"[\s\S]*?"description": "Sac banane matelassé aux motifs africains colorés[^"]+"\s*\},\s*/;

content = content.replace(badBlockRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Cleaned up ID 142!");
