# HelixBox x402 Global Challenge Playbook

## Page 1: Purpose

This is the challenge-specific handoff for HelixBox. It documents how the project demonstrates real Algorand x402 usage, what evidence to gather, and which official resources govern the work. It is not a claim that any unverified payment, leaderboard entry, Bazaar listing, or MainNet deployment is complete.

Always re-check the official challenge page before submitting because eligibility, dates, required fields, and judging details can change.

## Page 2: Project thesis

HelixBox is a mobile IDE that connects a phone to a developer's own laptop CLI through a QR pairing workflow. x402 makes premium agent access a paid service rather than a conventional subscription: a client requests a protected resource, receives an HTTP 402 challenge, approves payment through Pera Wallet, and obtains the resource after verification and settlement.

The strongest demo is not “we added crypto payments.” It is “a mobile developer can pair their laptop, request an agent session, approve a small Algorand payment, and receive time-bounded access only after settlement.”

## Page 3: What makes this x402

x402 is an HTTP payment protocol built around the otherwise-unused HTTP 402 Payment Required status. A protected API endpoint responds with machine-readable payment requirements. A compliant client constructs payment proof, the service verifies it through a facilitator, and the service grants the requested resource after settlement.

For HelixBox, the protected resource is paid agent/CLI access. The payment is not a donation, a manual transfer, or a wallet address pasted into a form. The client must acquire access through an actual 402 challenge and facilitator-backed verification.

## Page 4: Active paid routes

HelixBox currently keeps the scope to two core subscription-like service routes plus the existing Codex route:

| Route | Product purpose | Price intent |
| --- | --- | --- |
| `POST /v2/x402/cli/hour` | one hour of agent/CLI access | $0.25 USDC |
| `POST /v2/x402/premium/week` | seven days of agent/CLI access | $2.00 USDC |
| `POST /v2/x402/codex-agent` | retained Codex agent service | configured paid endpoint |

Do not advertise routes that are not reachable from deployed code. Adding endpoints only to inflate transaction count weakens the product story.

## Page 5: End-to-end payment flow

1. A user pairs their laptop CLI with HelixBox using QR or pairing code.
2. They enter the workspace; ordinary editor access remains free.
3. They select a paid agent session.
4. The installed Android app opens HelixBox checkout in an Android custom tab.
5. Checkout requests a real x402 payment challenge from the manager.
6. Checkout opens Pera Wallet through WalletConnect.
7. Pera asks the user to approve the connection and transaction.
8. The signed payment proof is sent to the manager/facilitator flow.
9. Manager verifies/settles the payment.
10. Checkout deep-links to `helixbox://payment-complete`.
11. The app validates callback data, persists the public wallet record, and activates the corresponding session.

## Page 6: Wallet connection vs payment

Wallet connection and payment are different events.

Connecting Pera authorizes the web checkout origin to request signatures and reveals the selected public address. It does not transfer funds and must not activate a paid entitlement.

Payment is a later signed transaction. Only a successful manager-side verify/settle result may activate the one-hour or seven-day entitlement. A frontend “paid” state alone is never proof.

## Page 7: Why Pera shows the web origin

The installed app uses a custom tab for checkout. WalletConnect therefore originates from the HTTPS checkout page, such as `https://helix-box.vercel.app/checkout`, and Pera displays that origin. This is normal.

The Android app receives the result through its registered `helixbox://` deep link. The source origin shown in Pera must be a real HelixBox-controlled domain, configured in Reown/Pera settings. It is not the payment recipient address.

## Page 8: Who gets paid

The merchant recipient is the address held in the manager's `X402_PAY_TO` environment variable. It must:

- belong to the operator,
- be on the same Algorand network selected by `X402_NETWORK`,
- be opted into the selected USDC asset,
- be supplied only through server environment configuration.

The payer is the Pera-selected account. Pera signs the transaction. The facilitator verifies and settles according to the x402 protocol. HelixBox must not hold or sign a user's private key.

## Page 9: Testnet configuration

Use Testnet to validate flow without spending real USDC. Confirm:

- manager health reports Testnet,
- `X402_NETWORK` is the correct Testnet CAIP-2 identifier,
- the configured Testnet USDC asset ID matches the network,
- the merchant address is opted into that Testnet asset,
- the payer account holds test ALGO for fees and the required test asset,
- the facilitator accepts the payment requirements.

Record the transaction ID, manager log correlation, and entitlement result for the demo.

## Page 10: MainNet promotion

Promote only after a complete Testnet payment has settled and unlocked access. MainNet requires a separate configuration change, not merely a UI switch:

1. Set the MainNet CAIP-2 network.
2. Set MainNet USDC asset ID `31566704`.
3. Set an opted-in MainNet merchant address in `X402_PAY_TO`.
4. Deploy Render configuration.
5. Verify the public health route reflects MainNet.
6. Test one deliberately small payment from a funded MainNet account.
7. Confirm both on-chain transaction and service entitlement.

Never put a mainnet address, seed phrase, or USDC balance in the mobile bundle.

## Page 11: Facilitator role

The facilitator is protocol infrastructure, not a substitute for HelixBox business logic. It receives payment requirements/proof for verification and settlement. HelixBox still owns:

- mapping paid route to product entitlement,
- assigning the access duration,
- binding access to the paired CLI/session,
- recording a settlement result,
- denying access on failed/expired payment.

The GoPlausible documentation is the authoritative resource for request/response and dashboard behavior.

## Page 12: Bazaar discovery

The manager contains an x402 discovery manifest at `.well-known/x402.json`. A discoverable service should expose stable metadata that accurately describes the real endpoints, network, pricing, and service identity.

Before considering Bazaar/discovery complete:

1. Fetch the deployed manifest over HTTPS.
2. Confirm it names only working endpoints.
3. Confirm network and asset values match manager environment.
4. Confirm public endpoint URLs are reachable.
5. Follow the facilitator/Bazaar guidance for publication or indexing.

Do not claim listing status without seeing the deployed listing.

## Page 13: Leaderboard interpretation

The facilitator leaderboard can show settled activity it recognizes. It is not proof that all HelixBox product behavior is correct. The real evidence chain is:

```text
Pera approval -> on-chain transaction -> facilitator verification/settlement
-> manager entitlement -> active HelixBox session
```

Capture a screenshot and transaction ID only after the entire chain is confirmed. If a payment is signed but dashboard settlement is missing, inspect the manager's verify/settle call and the exact facilitator response.

## Page 14: Required demo evidence

A credible challenge demo should show:

1. The local CLI producing a QR code.
2. The phone pairing and opening the workspace.
3. An x402-protected API returning a 402 challenge.
4. Pera Wallet showing the exact payment approval.
5. The successful settlement result.
6. The active time-bounded agent session.
7. The relevant facilitator/transaction record.
8. The source code for the manager routes and checkout client.

Redact addresses if desired, but do not fake screenshots or edit transaction evidence.

## Page 15: Demo script

Open with the problem: developers can control their own laptop from a phone without exposing SSH ports, but premium agent usage needs transparent pay-per-use access.

Then demonstrate QR pairing, open the workspace, start an agent session, approve $0.25 USDC on Pera, return to HelixBox, and show access enabled. Finish by showing the endpoint, x402 manifest, payment verification in logs/dashboard, and the reason the service stops when access expires.

Keep the demo under three minutes and test the exact device/browser/Pera path beforehand.

## Page 16: Submission claims to avoid

Avoid these statements unless independently verified at submission time:

- “MainNet is live.”
- “Payments settle in under one second.”
- “Bazaar listing is live.”
- “We are top N on the leaderboard.”
- “End-to-end encrypted” without a verified cryptographic design.
- “No user data is ever stored” if logs/session metadata exist.

Use precise language: “Testnet integration implemented,” “MainNet configuration supported,” or “settlement verified in [specific transaction]” when supported by evidence.

## Page 17: Challenge risk checklist

| Risk | Required response |
| --- | --- |
| Wallet connects but callback is missing | validate Android scheme, custom tab return, and callback route |
| Payment shows pending | do not retry; return to same checkout tab and inspect facilitator/manager status |
| Failed to fetch | check CORS, Render cold start, endpoint URL, and response format |
| 402 cannot be parsed | validate manager response against x402 client expectations |
| On-chain payment but no access | inspect verify/settle response and entitlement persistence |
| Incorrect network/asset | stop testing; fix environment and deploy again |

## Page 18: Official resources

Use these as the source of truth:

- [Algorand Global x402 Challenge](https://algorand.co/global-x402-challenge)
- [The x402 Global Challenge is live: how to build and submit](https://algorand.co/blog/the-x402-global-challenge-is-live-how-to-build-submit-your-entry)
- [GoPlausible facilitator documentation](https://facilitator.goplausible.xyz/docs)
- [GoPlausible facilitator leaderboard](https://facilitator.goplausible.xyz/dashboard/leaderboards)
- [x402: unlocking the agentic commerce era](https://algorand.co/blog/x402-unlocking-the-agentic-commerce-era)
- [Algorand x402 overview](https://algorand.co/agentic-commerce/x402)
- [x402 on Algorand developer resource](https://dev.algorand.co/resources/x402-on-algorand/)

Project references:

- [HelixBox landing/checkout](https://helix-box.vercel.app/)
- [HelixBox GitHub repository](https://github.com/devndesigner6/helix-box)
- [Manager x402 health endpoint](https://helixbox-manager.onrender.com/v2/x402/health)

## Page 19: Final Testnet gate

Do not submit based solely on code review. Require:

- a real Testnet wallet connection,
- a real Testnet transaction approval,
- a real facilitator verification/settlement result,
- manager logs showing the correct paid route,
- a returned deep link to the installed Android app,
- a session that becomes active only after settlement,
- an expiry/renewal test,
- links, video, and repository revision ready for reviewers.

If any gate fails, document it honestly and fix that gap before presenting it as complete.

## Page 20: Post-challenge path

The sustainable roadmap is to make two core paid services reliable before adding more:

1. Hourly agent access.
2. Seven-day premium access.

Then add durable server-side entitlements, idempotent payment processing, observability, rate limits, explicit user receipts, and a MainNet rollout checklist. More endpoints, tokens, chains, or marketing claims should come only after this operational core works repeatedly on real Testnet payments.
