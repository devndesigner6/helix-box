import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../style.css', import.meta.url), 'utf8');
const video = html.match(/<div class="masthead-video-slot"[^>]*>([\s\S]*?)<\/div>/)?.[1];

assert.ok(video, 'hero video slot exists');
assert.match(video, /youtube-nocookie\.com\/embed\/2cmHX_T2Qis\?[^"']*autoplay=1[^"']*mute=1/);
assert.match(video, /<a[^>]+href="https:\/\/youtu\.be\/2cmHX_T2Qis"[^>]+target="_blank"/);
assert.match(css, /\.masthead-video-slot iframe\s*\{/);
console.log('Hero demo autoplays muted and links to YouTube.');
