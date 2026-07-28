const glob = require('fs').readdirSync;
const files = glob('images/articles-site/ensembles/adultes/variants');
const pngs = files.filter(f => f.endsWith('.png'));
console.log(`There are ${pngs.length} PNGs in variants.`);
