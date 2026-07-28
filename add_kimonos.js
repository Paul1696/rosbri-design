const fs = require('fs');
const glob = require('fs').readdirSync;

try {
    // 1. Get images
    const files = glob('images/articles-site/ensembles/adultes/variants');
    const pngs = files.filter(f => f.endsWith('.png')).map(f => `images/articles-site/ensembles/adultes/${f}`);
    
    // 2. Read catalog
    let content = fs.readFileSync('catalog-data.js', 'utf8');
    const prefix = 'window.ROSBriCatalog = ';
    let jsonStr = content.substring(prefix.length).trim();
    if (jsonStr.endsWith(';')) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 1);
    }
    
    let catalog = JSON.parse(jsonStr);
    let maxId = Math.max(...catalog.map(i => i.id || 0));
    
    // 3. Create 5 products
    const titles = [
        "Kimono Royal Coloré",
        "Kimono Terre Nomade",
        "Kimono Éclat Urbain",
        "Kimono Palette Chic",
        "Kimono Safari Chic"
    ];
    
    let imgCounter = 0;
    
    titles.forEach(title => {
        maxId++;
        let prod = {
            id: maxId,
            title: title,
            category: "Vêtements",
            price: "20 000 FCFA",
            image: pngs[imgCounter % pngs.length],
            description: "Magnifique Kimono pour un style unique et élégant.",
            colorVariants: []
        };
        imgCounter++;
        
        // Add 5 color variants just to show variety
        const colors = ["#1e1f1f", "#eeeee5", "#decfb5", "#9ca3af", "#1e2b48"];
        colors.forEach((c, idx) => {
            prod.colorVariants.push({
                label: `Modèle ${idx + 1}`,
                swatch: c,
                image: pngs[imgCounter % pngs.length]
            });
            imgCounter++;
        });
        
        // Unshift to put at top, or push to put at end. Let's push to end, or unshift.
        catalog.unshift(prod);
    });
    
    fs.writeFileSync('catalog-data.js', prefix + JSON.stringify(catalog, null, 2) + ';\n', 'utf8');
    
    // Also update cache buster in boutique.html
    let html = fs.readFileSync('boutique.html', 'utf8');
    html = html.replace('catalog-data.js?v=20260727-v4', 'catalog-data.js?v=20260727-v5');
    fs.writeFileSync('boutique.html', html, 'utf8');
    
    console.log(`Added 5 Kimono products using ${pngs.length} available PNG images.`);
} catch (e) {
    console.error(e);
}
