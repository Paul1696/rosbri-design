const fs = require('fs');
let content = fs.readFileSync('catalog-data.js', 'utf8');
const prefix = 'window.ROSBriCatalog = ';
let jsonStr = content.substring(prefix.length).trim();
if (jsonStr.endsWith(';')) jsonStr = jsonStr.substring(0, jsonStr.length - 1);
let catalog = JSON.parse(jsonStr);
let kimonos = catalog.filter(c => c.title.includes('Kimono adulte'));
console.log(JSON.stringify(kimonos[0], null, 2));
