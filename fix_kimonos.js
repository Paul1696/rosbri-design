const fs = require('fs');

try {
    let content = fs.readFileSync('catalog-data.js', 'utf8');
    const prefix = 'window.ROSBriCatalog = ';
    let jsonStr = content.substring(prefix.length).trim();
    if (jsonStr.endsWith(';')) jsonStr = jsonStr.substring(0, jsonStr.length - 1);
    
    let catalog = JSON.parse(jsonStr);
    let maxId = Math.max(...catalog.map(i => i.id || 0));
    
    // First, remove the 5 we just added. They were added at the beginning (unshift).
    const addedTitles = [
        "Kimono Royal Coloré",
        "Kimono Terre Nomade",
        "Kimono Éclat Urbain",
        "Kimono Palette Chic",
        "Kimono Safari Chic"
    ];
    catalog = catalog.filter(item => !addedTitles.includes(item.title));
    
    // Get the 14 newest images
    const glob = require('fs').readdirSync;
    const files = glob('images/articles-site/ensembles/adultes/variants');
    const pngs = files.filter(f => f.endsWith('.png'));
    let fileStats = pngs.map(f => {
        return { name: f, mtime: fs.statSync(`images/articles-site/ensembles/adultes/variants/${f}`).mtimeMs };
    });
    fileStats.sort((a, b) => b.mtime - a.mtime);
    
    const top14 = fileStats.slice(0, 14).map(f => `images/articles-site/ensembles/adultes/${f.name}`);
    
    // Add 14 new products
    for (let i = 0; i < 14; i++) {
        maxId++;
        catalog.unshift({
            id: maxId,
            title: `Kimono adulte ROSBRI wax ${String(i+1).padStart(2, '0')}`,
            category: "Vêtements",
            price: "20 000 FCFA",
            image: top14[i],
            description: "Magnifique Kimono pour un style unique et élégant.",
            colorVariants: [] // No color variants, just the single product
        });
    }
    
    fs.writeFileSync('catalog-data.js', prefix + JSON.stringify(catalog, null, 2) + ';\n', 'utf8');
    
    // Also update cache buster in boutique.html
    let html = fs.readFileSync('boutique.html', 'utf8');
    html = html.replace('catalog-data.js?v=20260727-v5', 'catalog-data.js?v=20260727-v6');
    fs.writeFileSync('boutique.html', html, 'utf8');
    
    console.log(`Removed 5, added 14.`);
} catch (e) {
    console.error(e);
}
