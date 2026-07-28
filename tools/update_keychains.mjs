import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

for (let i = 1; i <= 17; i++) {
  const num = i.toString().padStart(2, '0');
  const oldTitle = `Accessoire ROSBRI ${num}`;
  const newTitle = i === 7 ? `Porte-clés Bourse ROSBRI 07` : `Porte-clés ROSBRI ${num}`;
  
  const description = i === 7 
    ? "Porte-clés bourse ROSBRI avec pochette zippée, parfait pour ranger votre monnaie et garder vos clés à portée de main."
    : "Porte-clés lanière ROSBRI en tissu coloré. L'accessoire pratique et original pour retrouver facilement vos clés.";

  const regexTitle = new RegExp(`"title":\\s*"${oldTitle}"`);
  if (regexTitle.test(content)) {
    const blockRegex = new RegExp(`("title":\\s*"${oldTitle}"[\\s\\S]*?\\})`, 'g');
    
    content = content.replace(blockRegex, (match) => {
      let newBlock = match.replace(regexTitle, `"title": "${newTitle}"`);
      // Update price
      newBlock = newBlock.replace(/"price":\s*"[^"]+"/, `"price": "5 000 FCFA"`);
      // Update description
      newBlock = newBlock.replace(/"description":\s*"[^"]+"/, `"description": "${description}"`);
      // Ensure category is Accessoires (it already should be, but just in case)
      newBlock = newBlock.replace(/"category":\s*"[^"]+"/, `"category": "Accessoires"`);
      return newBlock;
    });
  } else {
    console.log(`Could not find: ${oldTitle}`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Updated keychains!");
