function examplePrice(model, policy) {
  const unknown = { price: 'Quote in app', unit: 'verified before payment' };
  if (!policy || model.kind === 'image') return unknown;
  const pricing = model.pricing;
  const rate = value => typeof value === 'string' && /^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value) ? Number(value) : NaN;
  if (!pricing || Object.entries(pricing).some(([key, value]) => !Number.isFinite(rate(value)) || (!['prompt', 'completion', 'request', 'input_cache_read', 'input_cache_write', 'discount'].includes(key) && rate(value) !== 0))) return unknown;
  const prompt = Math.max(rate(pricing.prompt), rate(pricing.input_cache_read ?? '0'), rate(pricing.input_cache_write ?? '0'));
  const completion = rate(pricing.completion), request = rate(pricing.request ?? '0');
  if (model.kind === 'voice' && completion !== 0) return unknown;
  const cost = model.kind === 'chat' ? prompt * 1000 + completion * 512 + request : prompt * 100 + request;
  const { markupBps, minimumAmount, maximumAmount } = policy;
  if (!Number.isInteger(markupBps) || markupBps < 0 || markupBps > 10000 || !/^\d+$/.test(minimumAmount) || !/^\d+$/.test(maximumAmount)) return unknown;
  const micro = Math.max(Number(minimumAmount), Math.ceil(Math.ceil(cost * 1e6) * (10000 + markupBps) / 10000));
  if (!Number.isSafeInteger(micro) || micro < 1 || micro > Number(maximumAmount)) return unknown;
  return { price: `~${(micro / 1e6).toFixed(6).replace(/0+$/, '').replace(/\.$/, '')} USDC`, unit: model.kind === 'chat' ? 'example call' : '100 characters' };
}

export function buildModelShowcase(payload) {
  if (!Array.isArray(payload?.models)) throw new Error('Live catalog is unavailable');
  const groups = {};
  for (const kind of ['chat', 'image', 'voice']) {
    const candidates = payload.models.filter(model => model && model.kind === kind && typeof model.id === 'string' && /^[a-z0-9._-]+\/[a-z0-9._:/-]+$/i.test(model.id) && typeof model.name === 'string' && model.name.trim() && !/openrouter/i.test(`${model.id} ${model.name}`));
    const makers = new Map();
    for (const model of candidates) if (!makers.has(model.id.split('/')[0])) makers.set(model.id.split('/')[0], model);
    const familiar = ['openai', 'anthropic', 'google', 'deepseek', 'meta-llama', 'mistralai', 'qwen', 'liquid'];
    const rank = model => familiar.includes(model.id.split('/')[0]) ? familiar.indexOf(model.id.split('/')[0]) : familiar.length;
    const diverse = [...makers.values()].sort((a, b) => rank(a) - rank(b));
    const seen = new Set();
    groups[kind] = [...diverse, ...candidates].filter(model => !seen.has(model.id) && seen.add(model.id)).slice(0, 12)
      .map(model => ({ id: model.id, name: model.name.replace(/^[^:]+:\s*/, '').slice(0, 90), maker: model.id.split('/')[0], ...examplePrice(model, payload.pricingPolicy) }));
  }
  return groups;
}
