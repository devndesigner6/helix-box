export function resolveTheme(saved, prefersDark) {
  return saved === 'light' || saved === 'dark' ? saved : prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme, root) {
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function initTheme() {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('theme'); } catch { /* Storage may be disabled. */ }
  const button = document.getElementById('themeToggle');
  function update(theme) {
    applyTheme(theme, root);
    button?.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '☀' : '◐';
  }
  update(resolveTheme(saved, system.matches));
  button?.addEventListener('click', () => {
    saved = root.dataset.theme === 'dark' ? 'light' : 'dark';
    update(saved);
    try { localStorage.setItem('theme', saved); } catch { /* Switching still works. */ }
  });
  system.addEventListener('change', () => {
    if (saved !== 'dark' && saved !== 'light') update(resolveTheme(null, system.matches));
  });
  window.addEventListener('storage', event => {
    if (event.key === 'theme') {
      saved = event.newValue;
      update(resolveTheme(saved, system.matches));
    }
  });
}

if (typeof document !== 'undefined') initTheme();
