const fs = require('fs');

try {
    let content = fs.readFileSync('catalog-data.js', 'utf8');
    
    // Extract the JSON part
    const prefix = 'window.ROSBriCatalog = ';
    if (!content.startsWith(prefix)) {
        console.error("Format mismatch");
        process.exit(1);
    }
    
    let jsonStr = content.substring(prefix.length).trim();
    if (jsonStr.endsWith(';')) {
        jsonStr = jsonStr.substring(0, jsonStr.length - 1);
    }
    
    let catalog = JSON.parse(jsonStr);
    const initialLength = catalog.length;
    
    const toRemove = [
        "Kimono Royal Coloré",
        "Kimono Terre Nomade",
        "Kimono Éclat Urbain",
        "Kimono Palette Chic",
        "Kimono Safari Chic"
    ];
    
    catalog = catalog.filter(item => !toRemove.includes(item.title));
    
    const removedCount = initialLength - catalog.length;
    
    fs.writeFileSync('catalog-data.js', prefix + JSON.stringify(catalog, null, 2) + ';\n', 'utf8');
    
    // Also update cache buster in boutique.html
    let html = fs.readFileSync('boutique.html', 'utf8');
    html = html.replace('catalog-data.js?v=20260727-v3', 'catalog-data.js?v=20260727-v4');
    fs.writeFileSync('boutique.html', html, 'utf8');
    
    console.log(`Removed ${removedCount} items.`);
} catch (e) {
    console.error(e);
}
