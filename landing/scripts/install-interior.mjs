// Official registry source, with one React 18 image-attribute compatibility fix.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const components = ['copy-button', 'accordion', 'text-reveal', 'lightbox', 'filter-grid', 'icon-morph', 'blur-up-image', 'logo-marquee', 'popover'];
const destination = resolve(import.meta.dirname, '../src/components/interior');
await mkdir(destination, { recursive: true });
for (const name of components) {
  const url = `https://www.interior.dev/r/${name}.json`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const registry = await response.json();
  const file = registry.files.find(entry => entry.path.endsWith(`/${name}.tsx`));
  if (!file?.content) throw new Error(`Official source missing: ${name}`);
  const content = name === 'blur-up-image'
    ? file.content.replace('fetchPriority={fetchPriority}', '{...(fetchPriority ? { fetchpriority: fetchPriority } : {})}')
    : file.content;
  await writeFile(resolve(destination, `${name}.tsx`), content);
  console.log(`Installed official ${name} from ${url}`);
}
