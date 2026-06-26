// scripts/font-to-base64.js

const fs = require('fs');

const font = fs.readFileSync('./public/fonts/NotoSans-Regular.ttf');

const base64 = font.toString('base64');

fs.writeFileSync(
  './src/fonts/notoSansBase64.ts',
  `export default '${base64}';`,
);
