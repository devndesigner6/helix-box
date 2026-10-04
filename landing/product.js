import { inject } from '@vercel/analytics';
import './theme.js';
import { togglePreview } from './src/preview-controls.js';
inject();

const root = document.documentElement;
root.classList.add('js-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 760px)');
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('primaryNav');
const video = document.querySelector('.demo-screen video');
const motionButton = document.getElementById('demoMotion');

function setMenu(open, returnFocus = false) {
  const toggle = document.getElementById('menuToggle');
  toggle?.setAttribute('aria-expanded', String(open));
  toggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (nav) nav.hidden = mobile.matches && !open;
  if (returnFocus) toggle?.focus();
  document.dispatchEvent(new CustomEvent('helixbox:menu-state', { detail: open }));
}
document.addEventListener('helixbox:menu-request', event => setMenu(event.detail));
setMenu(false);
toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
nav?.addEventListener('click', event => {
  if (event.target.closest('a') && mobile.matches) setMenu(false, true);
});
document.addEventListener('click', event => {
  const toggle = document.getElementById('menuToggle');
  if (mobile.matches && toggle?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.header-content')) setMenu(false);
});
document.addEventListener('keydown', event => {
  const toggle = document.getElementById('menuToggle');
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('focusin', event => {
  const toggle = document.getElementById('menuToggle');
  if (mobile.matches && toggle?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.header-content')) setMenu(false);
});
mobile.addEventListener('change', () => setMenu(false));

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const status = document.getElementById('copyStatus');
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      (button.querySelector('[data-copy-label]') || button).textContent = 'Copied ✓';
      if (status) status.textContent = 'CLI command copied.';
    } catch {
      (button.querySelector('[data-copy-label]') || button).textContent = 'Select command';
      if (status) status.textContent = 'Copy unavailable. Select the displayed CLI command and copy it manually.';
      const code = button.parentElement.querySelector('code');
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    window.setTimeout(() => { (button.querySelector('[data-copy-label]') || button).textContent = 'Copy ↗'; }, 2200);
  });
});

function syncVideoButton() {
  if (!video || !motionButton?.isConnected) return;
  motionButton.querySelector('.play-icon').textContent = video.paused ? '▶' : 'Ⅱ';
  motionButton.querySelector('.motion-label').textContent = video.paused ? 'Play preview' : 'Pause preview';
  motionButton.setAttribute('aria-label', video.paused ? 'Play demo preview' : 'Pause demo preview');
  motionButton.setAttribute('aria-pressed', String(!video.paused));
}
const mediaStatus = document.getElementById('mediaStatus');
function playbackFailed() {
  if (mediaStatus) mediaStatus.textContent = 'Preview could not start. You can watch the full walkthrough on YouTube.';
  syncVideoButton();
}
function respectMotion() {
  if (reducedMotion.matches) {
    root.classList.remove('js-motion');
    video?.pause();
  }
  syncVideoButton();
}
respectMotion();
reducedMotion.addEventListener('change', respectMotion);
video?.addEventListener('pause', syncVideoButton);
video?.addEventListener('play', syncVideoButton);
video?.addEventListener('error', playbackFailed);
if (video && !reducedMotion.matches) video.play().catch(syncVideoButton);
motionButton?.addEventListener('click', async () => {
  if (mediaStatus) mediaStatus.textContent = '';
  await togglePreview(video, playbackFailed);
  syncVideoButton();
});
let pausedInBackground = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pausedInBackground = !!video && !video.paused;
    video?.pause();
  } else if (pausedInBackground && !reducedMotion.matches) {
    pausedInBackground = false;
    video?.play().catch(syncVideoButton);
  }
});

import('./src/product-interactions.jsx').catch(error => {
  console.warn('Enhanced components unavailable; native page controls remain available.', error);
});
