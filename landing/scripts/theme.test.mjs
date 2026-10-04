import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveTheme, applyTheme } from '../theme.js';

test('invalid saved preference falls back to the system theme', () => {
  assert.equal(resolveTheme('invalid', true), 'dark');
  assert.equal(resolveTheme(null, false), 'light');
  assert.equal(resolveTheme('light', true), 'light');
  assert.equal(resolveTheme('dark', false), 'dark');
});

test('theme updates both legacy routes and Interior components', () => {
  const classes = new Set();
  const root = { dataset: {}, style: {}, classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } } };
  applyTheme('dark', root);
  assert.equal(root.dataset.theme, 'dark');
  assert.equal(classes.has('dark'), true);
  assert.equal(root.style.colorScheme, 'dark');
  applyTheme('light', root);
  assert.equal(root.dataset.theme, 'light');
  assert.equal(classes.has('dark'), false);
  assert.equal(root.style.colorScheme, 'light');
});
