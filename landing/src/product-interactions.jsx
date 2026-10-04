import React, { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CopyButton } from './components/interior/copy-button';
import { Accordion } from './components/interior/accordion';
import { TextReveal } from './components/interior/text-reveal';
import { Lightbox } from './components/interior/lightbox';
import { FilterGrid } from './components/interior/filter-grid';
import { IconMorph } from './components/interior/icon-morph';
import { BlurUpImage } from './components/interior/blur-up-image';
import { LogoMarquee } from './components/interior/logo-marquee';
import { Popover } from './components/interior/popover';
import { AnimatedBeam } from './components/magicui/animated-beam';
import { BorderBeam } from './components/magicui/border-beam';
import { BlurFade } from './components/magicui/blur-fade';
import { useReducedMotion } from 'motion/react';
import { togglePreview } from './preview-controls';
import '../interior.css';
import '../enhancements.css';

function MenuControl({ initialOpen }) {
  const [open, setOpen] = useState(initialOpen);
  const slot = useRef(null);
  useLayoutEffect(() => {
    const button = slot.current.querySelector('button');
    button.id = 'menuToggle';
    button.setAttribute('aria-controls', 'primaryNav');
    const update = event => setOpen(event.detail);
    document.addEventListener('helixbox:menu-state', update);
    return () => document.removeEventListener('helixbox:menu-state', update);
  }, []);
  return <span ref={slot}><IconMorph preset="menu-close" active={open} semantics="expanded" labels={['Open navigation', 'Close navigation']} onActiveChange={index => document.dispatchEvent(new CustomEvent('helixbox:menu-request', { detail: index === 1 }))} className="interior-menu-control" /></span>;
}
const nativeMenu = document.getElementById('menuToggle');
if (nativeMenu) {
  const slot = document.createElement('span');
  slot.className = 'menu-control-slot';
  const initialOpen = nativeMenu.getAttribute('aria-expanded') === 'true';
  nativeMenu.replaceWith(slot);
  createRoot(slot).render(<MenuControl initialOpen={initialOpen} />);
}

function PreviewControl({ video }) {
  const [playing, setPlaying] = useState(!video.paused);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const update = () => setPlaying(!video.paused);
    video.addEventListener('play', update);
    video.addEventListener('pause', update);
    video.addEventListener('error', update);
    return () => ['play', 'pause', 'error'].forEach(event => video.removeEventListener(event, update));
  }, [video]);
  const toggle = async () => {
    setBusy(true);
    const status = document.getElementById('mediaStatus');
    if (status) status.textContent = '';
    await togglePreview(video, () => {
      if (status) status.textContent = 'Preview could not start. Watch the full walkthrough on YouTube.';
    });
    setPlaying(!video.paused);
    setBusy(false);
  };
  return <IconMorph preset="play-pause" active={playing} semantics="pressed" labels={['Play preview', 'Pause preview']} showLabel disabled={busy} onActiveChange={toggle} className="interior-preview-control" />;
}
const nativePreview = document.getElementById('demoMotion');
const previewVideo = document.querySelector('.demo-screen video');
if (nativePreview && previewVideo) {
  const slot = document.createElement('div');
  slot.className = 'preview-control-slot';
  nativePreview.replaceWith(slot);
  createRoot(slot).render(<PreviewControl video={previewVideo} />);
}

// Enhance existing product content, rather than replacing it with demo content.
document.querySelectorAll('[data-copy]').forEach(button => {
  const slot = document.createElement('span');
  const value = button.dataset.copy;
  button.replaceWith(slot);
  createRoot(slot).render(<CopyButton value={value} label="Copy CLI" copiedLabel="Copied" errorLabel="Failed" className="interior-copy" />);
});

document.querySelectorAll('[data-heading-reveal]').forEach(slot => {
  const text = slot.textContent;
  createRoot(slot).render(<TextReveal text={text} by="word" stagger={0.08} className="interior-heading" />);
});

const faq = document.querySelector('.faq-list');
if (faq) {
  const items = Array.from(faq.querySelectorAll('details'), (detail, index) => ({
    id: `question-${index}`,
    title: detail.querySelector('summary').textContent,
    content: <p>{detail.querySelector('p').textContent}</p>,
  }));
  faq.classList.add('interior-faq');
  createRoot(faq).render(<Accordion items={items} type="single" maxPanelHeight={400} className="product-accordion" />);
}

const gallerySlot = document.createElement('div');
document.body.appendChild(gallerySlot);
const gallery = createRoot(gallerySlot);
function showImage(image, trigger) {
  const close = () => gallery.render(<Lightbox open={false} onClose={close} src={image.src} alt={image.alt} />);
  gallery.render(<Lightbox open onClose={close} src={image.src} alt={image.alt} caption={image.alt} width={image.width} height={image.height} originRef={{ current: trigger }} className="product-lightbox" />);
}
document.querySelectorAll('.feature-media img').forEach(image => {
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'shot-trigger';
  trigger.setAttribute('aria-label', `Enlarge ${image.alt}`);
  image.replaceWith(trigger);
  createRoot(trigger).render(<BlurUpImage src={image.src} alt={image.alt} width={Number(image.getAttribute('width'))} height={Number(image.getAttribute('height'))} radius={14} color="var(--surface)" className="product-shot" />);
  trigger.addEventListener('click', () => showImage(image, trigger));
});

const toolGrid = document.querySelector('.tools-grid');
const filters = [
  { id: 'all', label: 'All tools', match: () => true },
  { id: 'workspace', label: 'Workspace', match: item => item.category === 'workspace' },
  { id: 'runtime', label: 'Runtime', match: item => item.category === 'runtime' },
  { id: 'debug', label: 'Debugging', match: item => item.category === 'debug' },
];
function Tools({ items }) {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  const columns = width < 560 ? 1 : width < 900 ? 2 : 3;
  return <FilterGrid items={items} filters={filters} getKey={item => item.id} label="Explore HelixBox tools" columns={columns} rowHeight={420} maxRows={6} gap={20} className="product-tool-grid" renderItem={item => <article className="tool-card" dangerouslySetInnerHTML={{ __html: item.html }} />} />;
}
if (toolGrid) {
  const categories = ['workspace', 'runtime', 'debug', 'runtime', 'workspace', 'runtime'];
  const items = Array.from(toolGrid.querySelectorAll('.tool-card'), (card, index) => ({ id: `tool-${index}`, category: categories[index], html: card.innerHTML }));
  toolGrid.classList.remove('tools-grid');
  createRoot(toolGrid).render(<Tools items={items} />);
}

function Agents({ items }) {
  const [paused, setPaused] = useState(false);
  return <><LogoMarquee items={items} label="Supported coding agents" speed={22} gap={48} paused={paused} className="product-agent-marquee" /><button className="marquee-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Resume agent logos' : 'Pause agent logos'}</button></>;
}
const agentLineup = document.querySelector('.agent-lineup');
if (agentLineup) {
  const items = Array.from(agentLineup.children, (item, index) => ({
    id: `agent-${index}`, label: item.textContent,
    mark: <span className="agent-mark"><img src={item.querySelector('img').src} alt="" width="28" height="28" />{item.textContent}</span>,
  }));
  agentLineup.className = 'agent-marquee-mount';
  createRoot(agentLineup).render(<Agents items={items} />);
}

document.querySelectorAll('.price-card:not(:first-child)').forEach((card, index) => {
  const slot = document.createElement('div');
  slot.className = 'pricing-info-slot';
  card.querySelector('.price-period').after(slot);
  createRoot(slot).render(<Popover trigger="What’s included?" label={index === 0 ? 'One-hour session details' : 'Seven-day pass details'} side="bottom" align="start" triggerClassName="pricing-info-trigger" className="product-pricing-popover"><p>{index === 0 ? 'Pay once for one hour of agent access. Questions, diagnosis, tests and patch reviews are included during the active session. Renew after expiry.' : 'One developer and selected projects, for seven days. Agent access has fair-use limits; this is not unlimited usage.'}</p><p>Model subscriptions and API costs stay separate. Risky actions still need your approval.</p></Popover>);
});

function PairingBeam({ container, laptop, phone }) {
  const reduced = useReducedMotion();
  // Finite passes keep the decorative illustration from moving indefinitely.
  return <AnimatedBeam containerRef={{ current: container }} fromRef={{ current: laptop }} toRef={{ current: phone }} startXOffset={laptop.offsetWidth / 2} endXOffset={-phone.offsetWidth / 2} pathColor="#ffffff" pathOpacity={0.5} gradientStartColor="#ffffff" gradientStopColor="#3553ff" duration={reduced ? 0 : 3} repeat={reduced ? 0 : 1} className="product-pairing-beam" />;
}
const pair = document.querySelector('.connect-visual');
if (pair) {
  pair.classList.add('pair-visual');
  const laptop = pair.querySelector('.mini-laptop');
  const phone = pair.querySelector('.mini-phone');
  pair.querySelector('.connection-path').className = 'pairing-gap';
  const slot = document.createElement('div');
  slot.className = 'pairing-beam-slot';
  slot.setAttribute('aria-hidden', 'true');
  pair.appendChild(slot);
  createRoot(slot).render(<PairingBeam container={pair} laptop={laptop} phone={phone} />);
}

function PriceBeam() {
  const reduced = useReducedMotion();
  return reduced ? null : <BorderBeam size={100} duration={5} colorFrom="#3553ff" colorTo="#ab76ff" borderWidth={2} transition={{ repeat: 1 }} className="product-border-beam" />;
}
const featured = document.querySelector('.featured-price');
if (featured) {
  const slot = document.createElement('div');
  slot.className = 'price-beam-slot';
  slot.setAttribute('aria-hidden', 'true');
  featured.appendChild(slot);
  createRoot(slot).render(<PriceBeam />);
}

// Move the existing native content into the official reveal wrapper, keeping
// its copy, IDs, links and separately mounted controls intact.
function RevealContent({ node }) {
  const content = useRef(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => { content.current.appendChild(node); }, [node, reduced]);
  const child = <div ref={content} />;
  return reduced ? child : <BlurFade inView blur="3px" offset={8} duration={0.35} className="product-blur-fade">{child}</BlurFade>;
}
document.querySelectorAll('.section-heading[data-reveal], .feature-copy[data-reveal], .feature-media[data-reveal], .setup-grid > [data-reveal]').forEach(node => {
  const slot = document.createElement('div');
  if (node.classList.contains('feature-copy')) slot.className = 'feature-copy-slot';
  if (node.classList.contains('feature-media')) slot.className = 'feature-media-slot';
  node.replaceWith(slot);
  createRoot(slot).render(<RevealContent node={node} />);
});

// Load syntax highlighting only as the example enters the viewport.
const GitComparison = lazy(() => import('./product-code-comparison.jsx'));
function GitExample() {
  const [visible, setVisible] = useState(false);
  const slot = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(slot.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={slot} className="product-code-example"><p className="eyebrow">ILLUSTRATIVE PATCH / REVIEW BEFORE YOU SHIP</p>{visible && <Suspense fallback={<p>Loading code example…</p>}><GitComparison /></Suspense>}</div>;
}
const gitRow = document.querySelector('.feature-media img[src*="git-demo"]')?.closest('.feature-row') || Array.from(document.querySelectorAll('.feature-row')).at(-1);
if (gitRow) {
  const slot = document.createElement('div');
  gitRow.after(slot);
  createRoot(slot).render(<GitExample />);
}
