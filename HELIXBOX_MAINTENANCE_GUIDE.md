# HelixBox Maintenance Guide

## Page 1: Purpose and scope

HelixBox is an Android-first mobile development environment that pairs a phone with a developer's laptop CLI. It is not a cloud IDE that takes custody of a developer's project or private keys. The main product value is a QR-based pairing flow that exposes a local terminal, files, Git, and AI-session controls on a phone while the developer's workstation remains the execution environment.

This guide is for maintaining the product. It intentionally does not cover x402 Challenge submission strategy. It does explain the production x402 implementation because it is part of the product architecture.

## Page 2: Repository map

```text
lunel/
  app/       Expo React Native Android/iOS application
  cli/       local workstation CLI and QR pairing client
  proxy/     relay for outbound client connections
  manager/   API, session manager, x402-protected services
  landing/   Vite checkout/marketing application
  pty/       terminal runtime integration
  assets/    root static-site assets, including helixbox.png
  *.html     root Vercel static pages such as About and Roadmap
```

Do not move components between these folders just to make the tree look tidy. Their deployment and trust boundaries differ.

## Page 3: System boundaries

The phone never needs inbound access to the workstation. The workstation CLI opens an outbound connection to HelixBox relay infrastructure. The app scans a one-time QR code or accepts a pairing code, then asks the manager to associate the mobile session with the connected CLI. The manager coordinates session state; the proxy relays traffic; the local CLI performs local operations.

Treat pairing codes as credentials. Do not log them, expose them in analytics, or reuse them.

## Page 4: The mobile application

The Expo project is in `app/`. Its package identity is `xyz.helixbox.app` and its deep-link scheme is `helixbox`. Expo Router handles routes, including the wallet return pages:

- `/workspace` is the session workspace.
- `/settings/wallet` shows the locally saved wallet state.
- `/wallet-connected` accepts a successful wallet connection return.
- `/payment-complete` accepts a successful paid-session return.

Native builds must be made from this folder. Do not test deep links only in a browser and assume an installed APK behaves the same way.

## Page 5: CLI pairing lifecycle

1. The developer runs the HelixBox CLI on their laptop.
2. The CLI registers a temporary pairing session through the relay/manager.
3. It displays a QR code and pairing code.
4. The mobile app scans or enters the code.
5. The manager validates the code and binds the mobile session.
6. The workspace can use the paired CLI connection.

If a QR scan reaches the workspace but no session appears, inspect the CLI process and manager logs before changing the mobile UI. The UI cannot restore a connection that the CLI never registered.

## Page 6: Manager service

`manager/` is the operational backend. It owns API routes, payment challenge routes, session coordination, and health endpoints. The deployed service currently has a health route at:

`https://helixbox-manager.onrender.com/v2/x402/health`

Use this endpoint to confirm the configured network and service status. Do not expose any secret, mnemonic, API key, or wallet private key in a health response.

## Page 7: Proxy and transport

The proxy exists so the developer's workstation only makes outbound relay connections. Keep this boundary clear:

- The CLI owns workstation access.
- The proxy moves authorized traffic.
- The manager authorizes sessions and exposes APIs.
- The mobile app renders the session and sends user input.

Changes to terminal transport need a real device test, a CLI test, and a reconnect test. A web build alone does not validate the transport.

## Page 8: Terminal and workspace safety

HelixBox can control a local shell through the paired CLI. That makes safe defaults important:

- Require a valid pairing session before commands are relayed.
- Expire disconnected sessions.
- Preserve an explicit user action before destructive commands.
- Do not persist terminal output unnecessarily.
- Never place local filesystem credentials into frontend bundles.

The product's privacy claim should be limited to behavior the code can demonstrate. Do not claim end-to-end encryption unless the exact full transport design has been independently verified.

## Page 9: GitHub maintenance

GitHub is the source of truth for code and Android release artifacts.

Before a change is merged or pushed:

```powershell
cd "C:\Users\hp\open ai hack\lunel"
git status
git diff
```

Keep environment files out of Git. Commit source, test changes, deployment configuration, and documentation. Release APKs should be attached to a GitHub Release rather than committed into the repository.

## Page 10: Vercel deployment

Vercel serves the public landing/checkout experience and the root static pages. The root `vercel.json` has clean URLs, so static files such as `about.html` become `/about`.

The static root pages use `/assets/helixbox.png` as their favicon because the asset lives in `assets/`. The Vite landing project has its own `landing/public/helixbox.png` source. When changing a title or favicon, check both deployment surfaces; they are distinct.

## Page 11: Render deployment

Render runs the manager as a Docker web service. Configure secrets in Render's Environment screen, never in code. At minimum, payment configuration needs:

```text
X402_NETWORK
X402_ASSET_ID
X402_PAY_TO
X402_FACILITATOR_URL
X402_PRICE_MICRO_USDC
```

The exact values must match the selected Algorand network. A MainNet asset ID with a Testnet network, or the reverse, is a broken payment configuration.

## Page 12: Expo release operation

Install dependencies and build from `app/`. The local CLI is more reliable than ad-hoc npm download commands on this machine:

```powershell
cd "C:\Users\hp\open ai hack\lunel\app"
npm ci --include=dev --legacy-peer-deps
node_modules\.bin\eas.cmd build --platform android --profile preview
```

After the build finishes, install the APK on a physical Android device. Test QR pairing, wallet return, paid access, and session termination before publishing a GitHub Release.

## Page 13: Pera Wallet connection

Pera Wallet connection is a WalletConnect session created in the checkout web context. The app opens the checkout URL in an Android custom tab, Pera approves the session, and checkout returns with a `helixbox://wallet-connected` deep link. The app validates and saves the public address/network locally.

Pera correctly shows the web origin that initiated the WalletConnect request. It cannot identify the installed APK as the initiating dApp when the checkout is browser-hosted. That is expected, not an indication that funds go to the website.

## Page 14: x402 in HelixBox

x402 is used for paid access to defined services, not as a forced payment for ordinary editor access. The manager exposes protected routes:

- `POST /v2/x402/cli/hour` for one hour of paid CLI/agent access.
- `POST /v2/x402/premium/week` for seven-day access.
- `POST /v2/x402/codex-agent` for the retained Codex agent route.

The first request returns HTTP 402 payment requirements. The client signs the required Algorand transaction through Pera, resubmits payment proof, and the facilitator verifies/settles it. Grant access only after confirmed settlement.

## Page 15: Entitlements and time

An entitlement is recorded by the manager in its `x402_entitlements` SQLite table and is associated with the CLI pairing code and expiry. It is not merely a frontend flag. The app can display remaining time, but the manager must remain the authority that accepts or rejects service use.

For the hourly plan, start the hour at confirmed settlement. For the weekly plan, calculate seven days from confirmed settlement. The correct expiry logic needs server-side persistence before treating the pricing model as production-ready.

The current persistence is local to the manager deployment. Before public scale, add durable backup/recovery, payment receipt storage, and an idempotency/reconciliation record keyed by the facilitator payment result. Do not issue a second entitlement just because a payer retries after a slow mobile return.

## Page 16: Network switching

Testnet and MainNet are separate payment systems. Switching requires all of the following at once:

1. Change `X402_NETWORK`.
2. Use the matching USDC asset ID.
3. Use a recipient address opted into that asset on the selected network.
4. Confirm the facilitator supports the selected network.
5. Build/redeploy the backend and refresh checkout configuration.
6. Run a real small payment and confirm settlement.

Never hardcode a payer's address. The connected Pera account supplies it.

## Page 17: Routine verification

For every release, run:

```powershell
cd "C:\Users\hp\open ai hack\lunel\app"
node_modules\.bin\tsc.cmd --noEmit
node scripts\check-pera-callback.mjs
```

Then manually test on Android:

1. Pair a CLI.
2. Open the workspace.
3. Connect Pera Wallet.
4. Approve one payment.
5. Return to HelixBox.
6. Verify the wallet address and active entitlement display.
7. Verify the manager accepts the paid service only after settlement.

For a MainNet release, also retain the transaction ID, route purchased, settlement time, and receiving-wallet confirmation outside the mobile app. These are operational records, not wallet secrets.

## Page 18: Incident guide

**Literal `{title}` appears:** identify whether the route is served by `landing/` or the root static HTML pages. Search all HTML sources, repair the actual source, deploy, then hard-refresh the browser.

**Favicon missing:** request the exact favicon URL in the browser. Root pages must use `/assets/helixbox.png`; Vite landing pages use their public asset path.

**Pera says transaction pending:** do not create another request. Return to the same browser custom tab and wait for the WalletConnect request to clear.

**Failed to fetch:** inspect browser DevTools/network and Render logs for CORS, sleep/wake latency, endpoint URL, and 402 response shape.

## Page 19: Security checklist

- No mnemonics/private keys in Git, app config, or Render logs.
- Validate WalletConnect callback address, network, and status before persistence.
- Validate payment proof server-side through the facilitator.
- Rate-limit payment and pairing endpoints.
- Use unique, short-lived pairing codes.
- The current x402 middleware allows `Access-Control-Allow-Origin: *` for checkout compatibility. Restrict it to HelixBox-controlled origins once the deployed custom-tab and Pera return flow has been regression-tested.
- Review dependencies before upgrades.
- Do not promote Testnet configuration to MainNet by changing only UI text.

## Page 20: Ownership and next maintenance work

The smallest maintainable next steps are:

1. Keep the two paid x402 endpoints stable.
2. Add a read-only entitlement-status API for the paired session.
3. Add an end-to-end Testnet payment test using a funded test wallet, while retaining a small MainNet smoke-test checklist.
4. Add application monitoring for manager errors and facilitator settlement failures.
5. Back up the entitlement database and record payment receipts/idempotency keys.
6. Record a release checklist in GitHub Issues before each APK release.

Avoid adding new payment SDKs, extra chains, or additional pricing tiers until the existing QR pairing, wallet return, settlement verification, and entitlement expiry flow is reliably demonstrated end to end.
