export function resolveTheme(saved, prefersDark) {
  return saved === 'light' || saved === 'dark' ? saved : prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme, root, controls = []) {
  root.dataset.theme = theme;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  for (const control of controls) {
    control.setAttribute('aria-pressed', String(control.dataset.themeChoice === theme));
  }
}

export function initTheme() {
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('theme'); } catch { /* Storage may be disabled. */ }
  const button = document.getElementById('themeToggle');
  let controls = [];
  if (button) {
    const group = document.createElement('div');
    group.className = 'theme-controls';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Color theme');
    group.innerHTML = `<button type="button" data-theme-choice="light" aria-label="Use light theme" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg></button><button type="button" data-theme-choice="dark" aria-label="Use dark theme" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z"/></svg></button>`;
    button.replaceWith(group);
    controls = [...group.querySelectorAll('[data-theme-choice]')];
  }
  function update(theme) {
    applyTheme(theme, root, controls);
  }
  update(resolveTheme(saved, system.matches));
  controls.forEach(control => control.addEventListener('click', () => {
    saved = control.dataset.themeChoice;
    update(saved);
    try { localStorage.setItem('theme', saved); } catch { /* Switching still works. */ }
  }));
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
