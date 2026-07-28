const fs = require('fs');
const glob = require('fs').readdirSync;

const files = glob('images/articles-site/ensembles/adultes/variants');
const pngs = files.filter(f => f.endsWith('.png'));

let fileStats = [];
for (const f of pngs) {
    const stat = fs.statSync(`images/articles-site/ensembles/adultes/variants/${f}`);
    fileStats.push({ name: f, mtime: stat.mtime });
}

fileStats.sort((a, b) => b.mtime - a.mtime);
for (const f of fileStats) {
    console.log(`${f.name} - ${f.mtime}`);
}
