// Copy official registry files; adapt HelixBox only at the integration layer.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const components = ['animated-beam', 'border-beam', 'blur-fade', 'code-comparison'];
const destination = resolve(import.meta.dirname, '../src/components/magicui');
await mkdir(destination, { recursive: true });
for (const name of components) {
  const url = `https://magicui.design/r/${name}.json`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const registry = await response.json();
  const file = registry.files.find(entry => entry.path.endsWith(`/${name}.tsx`));
  if (!file?.content) throw new Error(`Official source missing: ${name}`);
  await writeFile(resolve(destination, `${name}.tsx`), file.content);
  console.log(`Installed official ${name} from ${url}; dependencies: ${(registry.dependencies || []).join(', ')}`);
}
