import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { CodeComparison } from './components/magicui/code-comparison';

export default function GitComparison() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(document.documentElement.dataset.theme || 'light'));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  // forcedTheme controls provider attributes, not useTheme().theme. Pass the
  // selected palette to both props so the official component follows our theme.
  const syntaxTheme = theme === 'dark' ? 'github-dark' : 'github-light';
  return <ThemeProvider forcedTheme={theme} attribute="data-code-theme" enableSystem={false} enableColorScheme={false} storageKey="helixbox-code-theme"><CodeComparison
    filename="validate.ts" language="typescript" lightTheme={syntaxTheme} darkTheme={syntaxTheme}
    beforeCode={'export function isValid(name: string) {\n  return name.length > 0; // [!code --]\n}'}
    afterCode={'export function isValid(name: string) {\n  return name.trim().length > 0; // [!code ++]\n}'}
  /></ThemeProvider>;
}
