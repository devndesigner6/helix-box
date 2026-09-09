# HelixBox Landing and Launch Video Refresh

## Objective

Turn the current curriculum-derived landing pages into a coherent HelixBox product website and create a 30-second animated launch segment that can lead into recorded app footage.

## Product promise

HelixBox lets a developer pair a laptop workspace with a phone, resume that same workspace later, use files, terminal, logs, processes and Git remotely, and start a time-bound AI agent session when needed.

The public story must distinguish two layers:

- Free workspace controls: pairing, saved-session resume, files, terminal, logs, processes and Git.
- Paid agent access: $0.25 USDC for one hour or $2 USDC for seven days with fair-use limits.

## Information architecture

### Home

The homepage leads with the product promise, Android download and GitHub actions, the real `npx helixbox-cli -n` command, and a desktop video position. It then explains the five-step product flow, supported agents, free versus paid access, approval boundaries and a final installation call to action.

The homepage must remove the hidden legacy figure and all unsupported performance claims. It may borrow the reference site's editorial hierarchy, blueprint grid, technical labels, command-card treatment and restrained motion, but its content must remain specific to HelixBox.

### About

Explain why HelixBox exists, how it differs from a cloud editor or remote-screen application, what stays on the laptop, what travels through the session connection, and where user approval remains mandatory.

### Capabilities (`catalog.html`)

Replace the fake CLI catalog with a capability reference. Document files, terminal, Git, logs, processes, browser tools and the four supported agents. Show only verified CLI commands: `npx helixbox-cli`, `npx helixbox-cli -n` and `npx helixbox-cli --help`.

### Product flow (`roadmap.html`)

Explain pairing, saved-session resume, explicit new-session generation, workspace use, agent availability discovery, payment activation, expiry and renewal. Include a short, honest upcoming-work section without challenge or leaderboard language.

### Glossary

Keep the existing URL for compatibility but replace misleading definitions with accurate descriptions of pairing codes, saved sessions, PTY, WebSocket session transport, agent availability, x402 payment requirements and time-bound access.

## Shared navigation and metadata

All informational pages use the same responsive header, mobile menu, theme toggle and footer. Navigation labels are Home, Capabilities, Product flow, About and GitHub. Glossary remains accessible from the footer.

Every page includes accurate title, description, canonical URL, favicon and social metadata. The homepage adds SoftwareApplication structured data. Checkout remains functionally isolated and is not restyled beyond shared metadata when necessary.

## Content constraints

- Do not mention PRISM.
- Do not mention leaderboard placement or challenge participation.
- Do not describe HelixBox as a generic relay product.
- Do not claim two-second pairing, 50ms reconnection, 70% compression, per-second billing or automatic periodic charges.
- Do not present Expo Go as the public distribution method; use Android APK.
- Do not describe OpenCode as DeepSeek OpenCode.
- Do not imply the seven-day pass includes unlimited model or API costs.

## Visual system

Preserve the existing HelixBox blueprint identity:

- Light paper canvas `#fafaf5` and dark navy canvas `#0a0d1a`.
- Blueprint blue `#3553ff` with dark-mode blue `#6b8eff`.
- VT323 for display typography, Source Serif 4 for explanatory copy and JetBrains Mono for technical labels.
- Dot grid, fine rules, compact metadata labels, command blocks and hard-edged technical cards.
- Motion remains fast, restrained and deterministic, with reduced-motion support.

The reference site's latest useful patterns are adapted as product elements: a two-column desktop masthead, stronger action hierarchy, a real animated hero visual, a compact technology strip, modular path cards and a clear closing call to action.

## Launch video

Create a separate HyperFrames project in the workspace rather than inside the application repository. Output is 1920 by 1080, 30 seconds, no narration, with an existing HelixBox product-launch score reused as the audio source.

### Timeline

1. 0–4 seconds: hook contrasting a laptop-bound environment with mobile control.
2. 4–8 seconds: centered HelixBox logo and product reveal.
3. 8–13 seconds: animate `npx helixbox-cli -n`, a pairing code and phone handshake.
4. 13–19 seconds: animate files, terminal, logs, processes and Git as one connected workspace.
5. 19–24 seconds: reveal Codex, OpenCode, Claude Code and Hermes with real CLI availability language.
6. 24–27 seconds: show time-bound agent access and Algorand USDC pricing.
7. 27–30 seconds: end on “Build. Run. Ship. From your phone.” and the HelixBox URL, with a clean handoff frame for recorded footage.

Every scene is center-balanced at its hero frame. All text and UI elements animate independently. Transitions replace slide changes; no static-image slideshow is permitted.

## Verification

### Website

- Run the Vite production build.
- Check internal links and required assets.
- Check all five informational routes at desktop and mobile widths.
- Confirm the mobile menu opens, closes, responds to Escape and closes after link selection.
- Confirm no stale marketing terms remain in visible page copy.

### Video

- Run HyperFrames lint and validation with zero errors.
- Run layout inspection across at least 15 samples.
- Review the animation map for dead zones, off-screen text and collisions.
- Render a high-quality MP4 and inspect representative frames from every scene.

## Expected file scope

Website changes are limited to landing HTML, CSS, JavaScript and Vite inputs plus necessary public metadata assets. The video project is kept outside the HelixBox repository so rendered media and production notes do not bloat the app source tree.
