import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assets = {
  index: fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf-8'),
  admin: fs.readFileSync(path.join(__dirname, '..', 'public', 'admin.html'), 'utf-8'),
  appJs: fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'app.js'), 'utf-8'),
  adminJs: fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'admin.js'), 'utf-8')
};

const output = `export const ASSETS = ${JSON.stringify(assets, null, 2)};`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'assets.js'), output);

console.log('✅ Assets bundled successfully!');
console.log('📦 Output: src/assets.js');