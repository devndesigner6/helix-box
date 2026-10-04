import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const landing = resolve(root, 'landing');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('landing asset URLs in every page and stylesheet resolve to public files', () => {
  for (const name of readdirSync(landing).filter(name => /\.(html|css)$/.test(name))) {
    const source = read(`landing/${name}`);
    for (const [, path] of source.matchAll(/(?:["']|\()(\/assets\/(?:images|media|fonts|logos)\/[^"')\s?#]+)["')]/g)) {
      assert(existsSync(resolve(landing, 'public', path.slice(1))), `${name}: missing ${path}`);
    }
  }
  for (const path of ['images/helixbox-splash.png', 'images/helixbox.png', 'images/helixbox-readme.png', 'media/helixbox-preview.mp4']) {
    assert(existsSync(resolve(landing, 'public/assets', path)), `Missing canonical asset: ${path}`);
  }
});

test('legacy landing asset URLs rewrite to the same available media', () => {
  const config = JSON.parse(read('landing/vercel.json'));
  const examples = [
    ['/media/helixbox-preview.mp4', '/assets/media/helixbox-preview.mp4'],
    ['/media/dark-landscape.png', '/assets/media/dark-landscape.png'],
    ['/logos/codex.png', '/assets/logos/codex.png'],
    ['/fonts/VT323-Regular.ttf', '/assets/fonts/VT323-Regular.ttf'],
    ['/helixbox.png', '/assets/images/helixbox.png'],
    ['/helixbox-splash.png', '/assets/images/helixbox-splash.png'],
    ['/checkout', '/checkout.html'],
  ];
  for (const [url, expected] of examples) {
    const rule = config.rewrites.find(rule => rule.source === url || (rule.source.endsWith('/:path*') && url.startsWith(rule.source.slice(0, -7))));
    assert(rule, `Missing backward-compatible route: ${url}`);
    const destination = rule.destination.replace(':path*', url.slice(rule.source.indexOf(':path*')));
    assert.equal(destination, expected);
    assert(existsSync(resolve(landing, 'public', destination.slice(1))) || existsSync(resolve(landing, destination.slice(1))), `Missing rewrite target: ${destination}`);
  }
});

test('native app icons and bundled image/font imports retain resolvable paths', () => {
  const config = JSON.parse(read('app/app.json')).expo;
  const paths = [config.icon, config.android.adaptiveIcon.foregroundImage, config.web.favicon, config.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen')[1].image];
  for (const path of paths) assert(existsSync(resolve(root, 'app', path)), `Missing Expo asset: ${path}`);
  for (const file of ['app/app/_layout.tsx', 'app/app/onboarding.tsx', 'app/app/(auth)/auth.tsx', 'app/plugins/core/terminal/Panel.tsx']) {
    for (const [, path] of read(file).matchAll(/require\(["']([^"']+\.(?:png|ttf))["']\)/g)) {
      const target = path.startsWith('@/') ? resolve(root, 'app', path.slice(2)) : resolve(root, dirname(file), path);
      assert(existsSync(target), `${file}: missing ${path}`);
    }
  }
});

test('local output is ignored without hiding distributable source or assets', () => {
  const unwanted = ['output/proof.png', 'app/components/.example.swp', 'landing/assets/reference/git.png', 'check_goplausible.py', 'coverage/index.html', 'scripts/__pycache__/example.pyc'];
  const wanted = ['app/.env.example', 'app/.env.hotupdater.example', 'landing/public/assets/media/agents.png', 'landing/src/product-interactions.jsx', 'cli/package-lock.json', 'proxy/bun.lock', 'pty/Cargo.lock', 'docs/HelixBox_PRISM_Integration_Specification.docx', 'scripts/repository.test.mjs'];
  const result = spawnSync('git', ['check-ignore', '--no-index', '--stdin'], { cwd: root, input: [...unwanted, ...wanted].join('\n') + '\n', encoding: 'utf8' });
  assert([0, 1].includes(result.status), result.stderr);
  const ignored = new Set(result.stdout.trim().split(/\r?\n/));
  for (const path of unwanted) assert(ignored.has(path), `Local artifact is not ignored: ${path}`);
  for (const path of wanted) assert(!ignored.has(path), `Important file is accidentally ignored: ${path}`);
});

test('Makefile commands only enter local projects that actually exist', () => {
  for (const [, directory] of read('Makefile').matchAll(/^\s*cd ([\w/-]+) &&/gm)) {
    assert(existsSync(resolve(root, directory)), `Make target enters absent project: ${directory}`);
  }
});

test('README local links and screenshots remain available', () => {
  for (const file of ['README.md', 'app/README.md', 'cli/README.md']) {
    const source = read(file);
    const paths = [...source.matchAll(/src="([^"#]+)"/g), ...source.matchAll(/\]\(([^)#]+)\)/g)].map(match => match[1]);
    for (const path of paths.filter(path => !/^[a-z]+:/i.test(path))) {
      assert(existsSync(resolve(root, dirname(file), path)), `${file}: missing ${path}`);
    }
  }
});
