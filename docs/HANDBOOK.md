# HelixBox handbook

HelixBox connects an Android phone to a development workspace on your laptop.
Files, dependencies, agent processes and running apps stay on that laptop.
The phone gives you access to them while you are away from your desk.

## Get started

1. Install the Android app from [GitHub Releases](https://github.com/devndesigner6/helix-box/releases/latest).
2. Open a terminal in the project you want to work on.
3. Run `npx helixbox-cli` and scan the QR code with HelixBox.
4. Open the workspace. Keep the laptop awake and its CLI running while you use it.
5. To use an AI agent, start a paid session and choose an available agent.

The pairing workflow does not require creating a HelixBox account. Agent
providers still require their own authentication. Published builds are Android;
the iOS and web scripts in the repository are development targets.

## Resume a workspace

When the app opens, it can reconnect to a saved valid session. You can also
select it from Past Sessions. Resuming returns to the paired workspace; it does
not create a new project or buy another agent session.

If the CLI says a session already exists, open that session in the app. The
laptop and CLI must be reachable. Closing the phone app does not make the laptop
available indefinitely, and a saved pairing is separate from paid access.

To intentionally replace the pairing and display a new QR code, run:

```bash
npx helixbox-cli --new
```

Use this when starting a new pairing, not as the first step for every reconnect.
Pairing codes currently have a seven-day lifetime. Paid agent access has its own
expiry, described below.

## Workspace tools

| Tool | What you can do |
| --- | --- |
| Explorer and editor | Browse project files, open and edit code |
| Terminal | Run commands and inspect their output on the laptop |
| Browser | Preview a running app through its exposed port and inspect it with DevTools |
| Git | Inspect diffs and status; use repository operations such as commits, branches, pull and push |
| Agents | Send instructions and follow the agent's output and proposed file changes |
| API client | Send HTTP requests and inspect responses |
| Ports | See listening ports and manage the processes behind them |
| Processes | Inspect running processes and stop them when appropriate |
| Monitor | Check resource usage on the connected laptop |
| Tools | Use the app's utility panels |
| Brainrot | Open a distraction while an agent works and return to the workspace |

Voice input is available for agent instructions. Appearance, fonts, language and
panel settings are in the app settings. Remote commands, file changes and process
controls use the laptop's permissions. Review destructive commands and Git changes
before executing them.

## Coding agents

The supported providers are Codex, OpenCode, Claude Code and Hermes. Install and
authenticate the providers you want on the laptop, in the environment used to
launch the HelixBox CLI. HelixBox reports the providers it successfully initializes.

An agent listed in the panel is not proof that its CLI is usable on your machine.
If one is unavailable:

- Check that you can run the provider in the same terminal where you start HelixBox.
- Finish the provider's own login or API configuration.
- Open a new terminal if installation changed your PATH.
- Restart the HelixBox CLI after installing or updating a provider, then reconnect
  the app to the saved session.

HelixBox access does not include a provider subscription or unlimited model tokens.
Those charges and usage limits belong to the provider account on the laptop.

## MainNet payments

Pairing and basic workspace tools are free. Paid agent access uses x402 with USDC
on Algorand MainNet:

| Access | Price | Period |
| --- | --- | --- |
| Agent session | $0.25 USDC | One hour |
| Developer pass | $2 USDC | Seven days, with fair-use limits |

Tap Start Session, choose access, and approve checkout in Pera Wallet. The backend
verifies and settles the payment before granting access. Return to HelixBox after
wallet approval and check the active session state. Wallet connection alone does
not mean a payment has settled.

The access period lets you work within the session without paying for each prompt.
It does not keep a sleeping laptop online or extend a provider's own quota. When
paid access expires, renewal is separate from reconnecting the workspace.

The API client is available now. A separate $0.10 USDC x402-paid API-testing flow
is planned and is not live.

Published MainNet receiving address:

```text
AQYWNHO6QWB4AB4SHIVMNZL2QN2ZQIYYO3Z27DJCUOILZ43YGGZUIPAURY
```

### Backend payment routes

| Route | Purpose |
| --- | --- |
| `POST /v2/x402/cli/hour` | One-hour access |
| `POST /v2/x402/premium/week` | Seven-day access |
| `POST /v2/x402/agent-session-1hour` | Agent-session access endpoint |
| `GET /v2/x402/health` | Payment-service health |
| `GET /v2/x402/agent-status` | Background-agent diagnostics |

An unpaid protected request receives an HTTP 402 payment requirement. The caller
supplies the requested payment proof; the service verifies and settles it through
GoPlausible before delivering paid access. External integrations must associate
the settled payment with the correct session and follow the endpoint's request
contract. A transaction hash or wallet connection by itself is not authorization.

## How the projects fit together

| Project | Responsibility |
| --- | --- |
| `app/` | Expo/React Native app, workspace panels, saved sessions and wallet callbacks |
| `cli/` | Laptop bridge for files, Git, processes, terminals and coding agents |
| `manager/` | Session control plane and x402 payment/access handling |
| `proxy/` | WebSocket relay between the phone and workstation |
| `pty/` | Rust terminal runtime |
| `landing/` | Product website and browser checkout |

The CLI connects outward to the manager and relay. Workspace actions run on the
laptop. The app coordinates the controls and displays responses. Keep session
credentials private because pairing grants access to the workstation.

Relevant implementation references:

- [CLI entrypoint](../cli/src/index.ts) and [agent registry](../cli/src/ai/index.ts).
- [Connection context](../app/contexts/ConnectionContext.tsx) and [session registry](../app/contexts/SessionRegistry.tsx).
- [Core panels](../app/plugins/core/index.ts) and [extra panels](../app/plugins/extra/index.ts).
- [Manager](../manager/src/index.ts) and [payment configuration](../manager/src/x402-payment.ts).

## Develop locally

Use Node.js 22 and npm for the app, CLI and website; Bun for the manager and proxy;
and the Rust toolchain for the PTY. Run the following from the repository root:

| Project | Install | Run or build |
| --- | --- | --- |
| App | `npm --prefix app ci --legacy-peer-deps` | `npm --prefix app start` |
| CLI | `npm --prefix cli ci` | `npm --prefix cli run build` |
| Website | `npm --prefix landing ci` | `npm --prefix landing run dev` or `npm --prefix landing run build` |
| Manager | In `manager/`: `bun install` | `bun run dev` |
| Proxy | In `proxy/`: `bun install` | `bun run dev` |
| PTY | Install Rust | `cargo build --release --manifest-path pty/Cargo.toml` |

After building the CLI, run `node cli/dist/index.js` from the project directory
you want to pair, using the appropriate path to the built entrypoint.

The app's public service settings are in [app/.env.example](../app/.env.example):
`EXPO_PUBLIC_GATEWAY_URL` and `EXPO_PUBLIC_MANAGER_URL`. CLI overrides use
`HELIXBOX_PROXY_URL` and `HELIXBOX_MANAGER_URL`. Set them to your own services when
testing locally. `EXPO_PUBLIC_` values are bundled into the app and must not
contain secrets.

For production payment configuration, explicitly set the manager's `X402_NETWORK`
to `algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=`, `X402_ASSET_ID` to
`31566704`, and `X402_PAY_TO` to the receiving wallet. `X402_FACILITATOR_URL` must
use HTTPS. Do not assume an unset environment selects MainNet. Check health and
the returned payment requirements before approving a production transaction.

## Build Android

Use a development build for native modules; Expo Go does not support every feature.
From `app/`:

```bash
npm run android
npm run build -- --platform android
npx eas-cli build --platform android --profile preview
```

These are different steps: `android` builds/runs a local native app, `build`
exports JavaScript and assets, and EAS `preview` produces an APK for internal
distribution. The `production` EAS profile is the store build configuration and
requires your signing setup. See [app/README.md](../app/README.md) and
[app/eas.json](../app/eas.json).

Keep the generated editor WebView bundle: the app imports it. When editing its
entrypoint, regenerate it with `npm --prefix app run build:editor-webview` and
review the resulting changes.

## Checks before a release

```bash
node --test scripts/repository.test.mjs
npm --prefix landing test
node landing/scripts/check-product.mjs
npm --prefix landing run build
npm --prefix cli run build
node cli/scripts/test-ai-backends.mjs
node app/scripts/check-pera-callback.mjs
```

Also run the app lint/export and backend tests appropriate to your change.
On an installed Android build, test pairing, saved-session resume, agent
availability, file editing, terminal output, browser preview and Git diffs.

For payment changes, check a real MainNet settlement with an authorized wallet:
the approved amount, receiving address, confirmed transaction, access activation,
expiry and renewal. Keep receipts outside the repository. Do not repeat a pending
payment simply because the wallet has not returned to the app yet.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| CLI says a session already exists | Open Past Sessions; use `--new` only for a fresh pairing |
| Saved workspace will not reconnect | Laptop awake, CLI running, network available and pairing still valid |
| Installed agent is unavailable | Same-terminal PATH, provider login and CLI restart |
| Wallet approved but access is inactive | Return callback, settlement status and the associated session; do not assume success from approval alone |
| Agent access expired | Renew access; pairing and paid-access expiry are independent |
| Browser preview is blank | App running on the laptop, correct exposed port and healthy relay connection |
| Git push fails | Laptop repository remotes, credentials and provider permissions |
| Website asset is missing | Check the source and public assets in `landing/`, then rebuild |

When reporting a bug, include the app/CLI versions, OS, failing action and sanitized
logs. Redact pairing codes, tokens, wallet secrets and private project contents.
Report through [GitHub Issues](https://github.com/devndesigner6/helix-box/issues).

## Safety and current limits

- Never share a wallet recovery phrase or private key with HelixBox.
- Keep server secrets and signing material out of Git, app bundles and screenshots.
- Back up the manager database and keep payment/session records private.
- Review agent diffs, commands and process termination before applying them.
- The laptop must stay available; HelixBox does not host the project for you.
- Model-provider billing is separate from HelixBox session billing.
- Planned integrations and the paid API-testing flow are not part of the current
  supported agent list or live pricing.
