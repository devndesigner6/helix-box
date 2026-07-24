import fs from 'fs';
import path from 'path';

const components = [
  'liquid-glass-card',
  'card-stack',
  'bento-grid',
  'morphic-navbar',
  'particle-button'
];

async function installComponent(name) {
  const url = `https://kokonutui.com/r/${name}.json`;
  console.log(`Fetching official registry definition from ${url}...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  }
  const data = await res.json();
  
  if (data.files && data.files.length > 0) {
    for (const file of data.files) {
      const targetPath = path.join(process.cwd(), file.target || file.path);
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, file.content, 'utf-8');
      console.log(`✓ Installed official ${name} to ${targetPath}`);
    }
  }
}

async function main() {
  for (const c of components) {
    try {
      await installComponent(c);
    } catch (e) {
      console.error(`Error installing ${c}:`, e.message);
    }
  }
}

main();
