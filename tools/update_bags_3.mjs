import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

const updates = {
  // Sacs à dos
  "Sac cabas ROSBRI 74": {
    title: "Sac à dos ROSBRI 74",
    category: "SacsADos",
    description: "Sac à dos ROSBRI confortable et spacieux, parfait pour le quotidien ou les déplacements."
  },
  "Sac cabas ROSBRI 76": {
    title: "Sac à dos ROSBRI 76",
    category: "SacsADos",
    description: "Sac à dos ROSBRI confortable et spacieux, parfait pour le quotidien ou les déplacements."
  },
  "Sac cabas ROSBRI 78": {
    title: "Sac à dos ROSBRI 78",
    category: "SacsADos",
    description: "Sac à dos ROSBRI confortable et spacieux, parfait pour le quotidien ou les déplacements."
  },
  "Sac cabas ROSBRI 80": {
    title: "Sac à dos ROSBRI 80",
    category: "SacsADos",
    description: "Sac à dos ROSBRI confortable et spacieux, parfait pour le quotidien ou les déplacements."
  },
  "Sac cabas ROSBRI 91": {
    title: "Sac à dos ROSBRI 91",
    category: "SacsADos",
    description: "Sac à dos ROSBRI confortable et spacieux, parfait pour le quotidien ou les déplacements."
  },
  "Sac cabas ROSBRI 93": {
    title: "Sac à dos ROSBRI 93",
    category: "SacsADos",
    description: "Sac à dos ROSBRI confortable et spacieux, parfait pour le quotidien ou les déplacements."
  },
  "Sac cabas ROSBRI 96": {
    title: "Sac à dos ROSBRI 96",
    category: "SacsADos",
    description: "Sac à dos ROSBRI confortable et spacieux, parfait pour le quotidien ou les déplacements."
  },
  "Duo sac a dos orange ROSBRI et trousse assortie": {
    category: "Packs",
    isPack: true
  },
  "Sac cabas ROSBRI 97": {
    title: "Trousse de voyage ROSBRI 97",
    category: "Trousses",
    description: "Trousse de voyage pratique et colorée, idéale pour ranger vos essentiels de toilette ou d'accessoires."
  },
  "Sac cabas ROSBRI 98": {
    title: "Sac bandoulière ROSBRI 98",
    category: "Bandoulieres",
    description: "Sacoche bandoulière légère et stylée, idéale pour garder vos essentiels à portée de main."
  },
  "Babouches ROSBRI orange 16": {
    title: "Pack Babouches ROSBRI orange 16",
    category: "Packs",
    isPack: true
  }
};

for (const [oldTitle, data] of Object.entries(updates)) {
  const regexTitle = new RegExp(`"title":\\s*"${oldTitle}"`);
  if (regexTitle.test(content)) {
    // Find the block from "title": "oldTitle" down to "description": "..."
    const blockRegex = new RegExp(`("title":\\s*"${oldTitle}"[\\s\\S]*?\\})`, 'g');
    
    content = content.replace(blockRegex, (match) => {
        let newBlock = match;
        if (data.title) {
            newBlock = newBlock.replace(regexTitle, `"title": "${data.title}"`);
        }
        if (data.category) {
            newBlock = newBlock.replace(/"category":\s*"[^"]+"/, `"category": "${data.category}"`);
        }
        if (data.description) {
            newBlock = newBlock.replace(/"description":\s*"[^"]+"/, `"description": "${data.description}"`);
        }
        if (data.isPack) {
            if (!newBlock.includes('"isPack"')) {
                newBlock = newBlock.replace(/"image":\s*"([^"]+)",/, `"image": "$1",\n    "isPack": true,`);
            }
        }
        return newBlock;
    });
  } else {
    console.log("Could not find:", oldTitle);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated bags 3!");
