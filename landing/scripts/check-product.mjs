import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'product.css'), 'utf8');
const js = readFileSync(resolve(root, 'product.js'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Element IDs must be unique');
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(anchor), `Missing section: ${anchor}`);
}
for (const [, path] of html.matchAll(/(?:src|href|poster)="(\/[^"#]+)"/g)) {
  assert(existsSync(resolve(root, path.slice(1))) || existsSync(resolve(root, 'public', path.slice(1))), `Missing local asset: ${path}`);
}
for (const [, path] of css.matchAll(/url\('(\/[^']+)'\)/g)) {
  assert(existsSync(resolve(root, 'public', path.slice(1))), `Missing CSS asset: ${path}`);
}
for (const agent of ['Codex', 'OpenCode', 'Claude Code', 'Hermes']) assert(html.includes(agent));
for (const font of ['VT323', 'Source Serif 4', 'JetBrains Mono']) assert(css.includes(font));
assert(html.includes('$0.25') && html.includes('$2') && html.includes('fair-use limits'));
assert(!html.includes('/media/git.png'), 'Use HelixBox Git footage, not the branded reference');
assert(css.includes('#top.hero-shell{overflow:visible;z-index:20}'), 'Mobile dropdown must not be clipped');
assert(css.includes('prefers-reduced-motion:reduce'));
assert(!/<video[^>]*\bautoplay\b/.test(html), 'Start autoplay from JS so reduced motion works without JS too');
assert(js.includes('setMenu(false, true)'));
assert(html.includes('https://youtu.be/2cmHX_T2Qis'));
console.log(`Product checks passed: ${ids.length} unique IDs, local assets, section links, branding, pricing, fonts and motion safeguards.`);
