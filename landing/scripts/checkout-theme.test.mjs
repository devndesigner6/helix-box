import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';

const sheet = postcss.parse(readFileSync(new URL('../style.css', import.meta.url), 'utf8'));
const checkout = readFileSync(new URL('../src/checkout.jsx', import.meta.url), 'utf8');
const buttonSheet = postcss.parse(checkout.match(/<style>([\s\S]*?)<\/style>/)[1]);
const button = {};
buttonSheet.walkRules('.checkout-btn-secondary', rule => rule.walkDecls(declaration => { button[declaration.prop] = declaration.value; }));

function luminance(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i, 'Contrast fixture must resolve to a six-digit color');
  const linear = [1, 3, 5].map(offset => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

for (const theme of ['light', 'dark']) {
  test(`seven-day checkout button retains readable contrast in ${theme} theme`, () => {
    const variables = {};
    for (const selector of theme === 'dark' ? [':root', '[data-theme="dark"]'] : [':root']) {
      sheet.walkRules(selector, rule => rule.walkDecls(declaration => { variables[declaration.prop] = declaration.value; }));
    }
    const resolveColor = value => value.replace(/var\((--[\w-]+)\)/g, (_, name) => variables[name]);
    const background = luminance(resolveColor(button.background));
    const foreground = luminance(resolveColor(button.color));
    const ratio = (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
    assert(ratio >= 4.5, `Text contrast ${ratio.toFixed(2)}:1 is below 4.5:1`);
  });
}
