import test from 'node:test';
import assert from 'node:assert/strict';

const { buildModelShowcase } = await import('../src/model-showcase.js').catch(() => ({}));
const policy = { markupBps: 2000, minimumAmount: '1000', maximumAmount: '1000000' };
const model = (changes = {}) => ({ id: 'example/text', name: 'Example: Text', kind: 'chat', pricing: { prompt: '0.000002', completion: '0.000004' }, ...changes });
const showcase = models => buildModelShowcase({ models, pricingPolicy: policy });

test('chat example estimates include input, output, service margin and the minimum', () => {
  assert.equal(typeof buildModelShowcase, 'function');
  assert.equal(showcase([model()]).chat[0].price, '~0.004858 USDC');
  assert.equal(showcase([model({ pricing: { prompt: '0', completion: '0' } })]).chat[0].price, '~0.001 USDC');
});

test('unknown or unbounded pricing never becomes a fabricated call price', () => {
  assert.equal(typeof buildModelShowcase, 'function');
  for (const pricing of [{}, { prompt: '-1', completion: '0' }, { prompt: '0', completion: 'NaN' }, { prompt: '0', completion: '0', image: '1' }, { prompt: '1', completion: '1' }]) {
    assert.equal(showcase([model({ pricing })]).chat[0].price, 'Quote in app');
  }
  assert.equal(showcase([model({ kind: 'image', pricing: {} })]).image[0].price, 'Quote in app');
});

test('speech estimates need bounded text pricing, not an unknown audio duration', () => {
  assert.equal(typeof buildModelShowcase, 'function');
  assert.equal(showcase([model({ kind: 'voice', pricing: { prompt: '0.000015', completion: '0' } })]).voice[0].price, '~0.0018 USDC');
  assert.equal(showcase([model({ kind: 'voice', pricing: { prompt: '0.000015', completion: '0.1' } })]).voice[0].price, 'Quote in app');
});

test('showcase uses live entries only, deduplicates and includes different model makers', () => {
  assert.equal(typeof buildModelShowcase, 'function');
  const result = showcase([model(), model(), model({ id: 'other/text', name: 'Other: Text' }), model({ id: 'bad', name: '' }), model({ id: 'openrouter/auto', name: 'OpenRouter: Auto' })]);
  assert.deepEqual(result.chat.map(item => item.id), ['example/text', 'other/text']);
  assert.deepEqual(result.image, []);
  assert.deepEqual(result.voice, []);
});

test('missing catalog fails closed rather than substituting demo models', () => {
  assert.equal(typeof buildModelShowcase, 'function');
  assert.throws(() => buildModelShowcase({}), /catalog/i);
  assert.equal(buildModelShowcase({ models: [model()] }).chat[0].price, 'Quote in app');
});

test('recognizable makers remain visible even when the upstream catalog order changes', () => {
  const many = Array.from({ length: 15 }, (_, index) => model({ id: `maker${index}/text` }));
  const result = showcase([...many, model({ id: 'anthropic/reviewer' }), model({ id: 'openai/reviewer' })]);
  assert.equal(result.chat.length, 12);
  assert.deepEqual(result.chat.slice(0, 2).map(item => item.id), ['openai/reviewer', 'anthropic/reviewer']);
});
