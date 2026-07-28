import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

// Update Title
content = content.replace(/"title":\s*"Ensemble enfant ROSBRI (\d+)"/g, '"title": "Ensemble Confort Enfant $1"');

// We also need to update price for these specific items.
// Since we don't know the exact lines, we'll replace the price and description within objects that have "category": "Ensembles" and an image matching "ensemble-enfants-rosbri-wax".
// A safer way is to find each block between '{' and '}' and modify it if it's an "Ensemble enfant".

const blocks = content.split('  {\n');
for (let i = 1; i < blocks.length; i++) {
    if (blocks[i].includes('"category": "Ensembles"') && blocks[i].includes('ensemble-enfants-rosbri-wax')) {
        // It's an ensemble enfant
        blocks[i] = blocks[i].replace(/"price":\s*"[^"]+"/, '"price": "10 000 FCFA"');
        blocks[i] = blocks[i].replace(/"description":\s*"Ensemble enfant haut et bas ROSBRI, confortable, colore et pense pour bouger facilement."/, '"description": "Ensemble deux pièces pour enfant, alliant douceur et liberté de mouvement. Ses couleurs vives et ses finitions soignées en font la tenue parfaite pour le quotidien."');
    }
}
content = blocks.join('  {\n');

// Also some items are just "Ensemble enfant avec t-shirt, short et casquette assortis."
// Let's also update any price for category "Enfants" if they are ensembles.
// The user said "améliore le nom et la description des ensembles enfant". The ones like "Mini Aventure" (Enfants) already have a custom name and a price of 17000. Do we change those? "met le prix a 10000". Usually this applies to the standard "Ensemble enfant ROSBRI XX".
// I will only touch the ones matching "Ensemble Confort Enfant" or "ensemble-enfants-rosbri-wax".

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated!");
