# Official Interior components

Source files come from Interior's official registry, not recreated implementations.
All are verbatim except BlurUpImage's optional `fetchPriority` attribute, which
is omitted when unset and uses the lowercase HTML attribute for React 18 compatibility.

- https://www.interior.dev/docs/copy-button
- https://www.interior.dev/docs/accordion
- https://www.interior.dev/docs/text-reveal
- https://www.interior.dev/docs/lightbox
- https://www.interior.dev/docs/filter-grid
- https://www.interior.dev/docs/icon-morph
- https://www.interior.dev/docs/blur-up-image
- https://www.interior.dev/docs/logo-marquee
- https://www.interior.dev/docs/popover

Retrieved October 4, 2026. `scripts/install-interior.mjs` refreshes the source from the matching `https://www.interior.dev/r/<name>.json` registry item. Dependencies: React and Motion, already present in this project.

HelixBox-specific content, fonts, responsive sizing, and theme colors are applied at the integration layer. No checkout payment logic is changed.
