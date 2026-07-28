import fs from 'fs';

const file = 'e:/APPS/ROSBRI DESIGN/catalog-data.js';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Verify that line 3294 (index 3293) is "  {"
// and line 3301 (index 3300) is "  },"

if (lines[3293].trim() === "{" && lines[3300].trim() === "},") {
  lines.splice(3293, 8); // Remove 8 lines
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log("Fix applied successfully by line numbers.");
} else {
  console.log("Lines didn't match expectation:");
  console.log("3294:", lines[3293]);
  console.log("3301:", lines[3300]);
}
