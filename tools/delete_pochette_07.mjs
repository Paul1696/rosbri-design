import fs from 'fs';

const filePath = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to match the block for Pochette ROSBRI 07 and trailing comma if it exists
const regex = /\{\s*"id":\s*\d+,\s*"title":\s*"Pochette ROSBRI 07"[^}]+\},\s*/;

if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Deleted Pochette ROSBRI 07!");
} else {
    console.log("Pochette ROSBRI 07 not found or already deleted.");
}
