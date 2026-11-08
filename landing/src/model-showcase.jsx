import React, { useEffect, useState } from 'react';
import { LogoMarquee } from './components/interior/logo-marquee';
import { buildModelShowcase } from './model-showcase.js';

const kinds = [['chat', 'Chat'], ['image', 'Image'], ['voice', 'Speech']];
const logos = { openai: '/assets/logos/codex.png', anthropic: '/assets/logos/claude.png' };

export function ModelShowcase() {
  const [catalog, setCatalog] = useState(null);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    setFailed(false);
    fetch('/api/models', { signal: controller.signal, credentials: 'omit', headers: { Accept: 'application/json' } })
      .then(response => { if (!response.ok) throw new Error('Catalog unavailable'); return response.json(); })
      .then(payload => {
        const groups = buildModelShowcase(payload);
        if (!Object.values(groups).some(models => models.length)) throw new Error('Empty catalog');
        if (!controller.signal.aborted) setCatalog({ groups, partial: Boolean(payload.warnings?.length), count: payload.models.length });
      })
      .catch(() => setFailed(true))
      .finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [attempt]);

  if (!catalog) return <div className="model-catalog-status" role="status">{failed ? <>Live models are temporarily unavailable. <button type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></> : 'Loading live models and catalog prices…'}</div>;
  return <div className="model-showcase">
    <div className="model-showcase-header"><p className="eyebrow">{catalog.count} MODEL CATALOG / STELLAR USDC</p><button className="marquee-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Resume model rows' : 'Pause model rows'}</button></div>
    {kinds.map(([kind, label], index) => catalog.groups[kind].length > 0 && <div className={`model-row model-row--${kind}`} key={kind}>
      <p className="model-kind"><span aria-hidden="true" />{label}</p>
      <LogoMarquee label={`${label} models and example prices`} speed={22 + index * 3} direction={index % 2 ? 'right' : 'left'} gap={12} paused={paused} className="product-model-marquee" items={catalog.groups[kind].map(model => ({
        id: model.id, label: `${model.name}, ${model.price}, ${model.unit}`, href: '#download',
        mark: <span className="model-chip" title={model.id}><span className="model-maker">{logos[model.maker] ? <img src={logos[model.maker]} alt="" width="24" height="24" /> : <span>{model.maker.slice(0, 2).toUpperCase()}</span>}</span><span><strong>{model.name}</strong><small>{model.price}<span> / {model.unit}</span></small></span></span>,
      }))} />
    </div>)}
    <p className="model-price-note">Catalog estimates, not payment quotes. Chat examples use 1K input tokens + 512 output tokens; speech uses 100 characters. Estimates include the service margin and minimum charge. Availability and the final bounded price are checked in the app before payment.</p>
    {catalog.partial && <p className="model-price-note" role="status">Part of the model catalog is temporarily unavailable.</p>}
  </div>;
}
