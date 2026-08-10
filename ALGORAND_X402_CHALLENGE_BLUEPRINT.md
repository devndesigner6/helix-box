# Helix Box — Algorand x402 Global Challenge Blueprint

**Project Name**: Helix Box  
**Submission Category**: Composite Project (Multi-Endpoint x402 Architecture)  
**Target Blockchain**: Algorand (TestNet & MainNet)  
**Primary Currency**: USDC (Algorand Standard Asset) & Native ALGO  
**Facilitator & Registry**: GoPlausible x402 Facilitator & Bazaar Discovery  
**Challenge Tag**: `x402-global-challenge`  
**Target Competition**: $100K USDC + 500K ALGO Prize Pool | Devcon 8 India Finalist  

---

## 1. Executive Summary & Vision

Helix Box is a mobile-first Web/Native IDE and interactive PTY terminal emulator that pairs local developer environments with mobile devices via zero-trust, end-to-end encrypted relays.

By natively integrating the **Algorand x402 Payment Required Protocol**, Helix Box replaces rigid monthly cloud subscriptions with a hyper-efficient, pay-per-use micropayment model. Developers pay fractional cents ($0.01 – $0.25 USDC) for transient terminal session relaying, AI-assisted code completions, and instant Docker container sandboxing. Settled natively on Algorand in under 1 second with near-zero transaction fees, Helix Box unlocks true permissionless developer compute globally.

---

## 2. Project Classification: Composite Category

Helix Box enters the challenge under the **Composite Category**, deploying three distinct paid service endpoints that route all incoming x402 micro-transactions to a single, unified Algorand `payTo` receiving vault address.

### Strategic Advantages of Composite Architecture:
- **Triple Volume Multiplier**: Diversifies payment streams across session passes, AI calls, and container sandboxes.
- **Maximized Bazaar Visibility**: Registers 3 active services under `x402-global-challenge` in the GoPlausible Bazaar directory.
- **Rapid Leaderboard Progression**: Accelerates transaction volume and active MainNet payment proofs to secure a position in the Top 50 Leaderboard.

---

## 3. Endpoints & Pricing Architecture

```
+-----------------------------------------------------------------------------------+
|                            HELIX BOX COMPOSITE ENDPOINTS                          |
+-----------------------------------------------------------------------------------+
| 1. POST /v2/x402/session/mint   --> $0.10 USDC / 0.5 ALGO  (1-Hour Session Pass)   |
| 2. POST /v2/x402/ai/completion  --> $0.01 USDC / 0.05 ALGO (Pay-per-Request AI)   |
| 3. POST /v2/x402/sandbox/spawn  --> $0.25 USDC / 1.0 ALGO  (Ephemeral Container)  |
+-----------------------------------------------------------------------------------+
```

### Endpoint 1: Transient PTY Session Pass
- **Route**: `POST /v2/x402/session/mint`
- **Price**: `$0.10 USDC` (or `0.5 ALGO`)
- **Service Description**: Issues a 1-hour high-bandwidth WebSocket relay token enabling full mobile terminal control, live stdout/stderr streaming, and PTY interaction.
- **Payment Frequency**: Once per active pairing session.

### Endpoint 2: Pay-Per-Request AI Terminal Completion
- **Route**: `POST /v2/x402/ai/completion`
- **Price**: `$0.01 USDC` (or `0.05 ALGO`)
- **Service Description**: Invokes high-performance LLM code generation (Cerebras / Llama-3 / OpenAI) to analyze terminal logs, write shell scripts, and debug stack traces directly inside the mobile CLI.
- **Payment Frequency**: Micro-transaction per individual AI prompt execution.

### Endpoint 3: Ephemeral Container Sandbox Spawn
- **Route**: `POST /v2/x402/sandbox/spawn`
- **Price**: `$0.25 USDC` (or `1.0 ALGO`)
- **Service Description**: Provisions an isolated, cloud-hosted Docker container environment for running untrusted scripts or isolated integration tests remotely.
- **Payment Frequency**: Per sandbox instance creation.

---

## 4. Technical Architecture & x402 Protocol Flow

Helix Box implements the standard **HTTP 402 Payment Required** handshake tailored for Algorand:

```
[Mobile App / CLI Client]                    [Helix Box Manager]                   [Algorand MainNet]
          |                                          |                                     |
          |-------- 1. POST /v2/x402/ai/completion -->|                                     |
          |                                          |                                     |
          |<------- 2. HTTP 402 Payment Required ----|                                     |
          |           X-PAYMENT-REQUEST Header       |                                     |
          |                                          |                                     |
          |-- 3. Construct & Sign Algorand Txn -------------------------------------------->|
          |                                                                                |
          |<-- 4. Txn Confirmed (< 1 sec) -------------------------------------------------|
          |                                          |                                     |
          |-------- 5. Retry POST request ---------->|                                     |
          |           X-PAYMENT-RESPONSE Header      |                                     |
          |           (txId, signedTxn)              |                                     |
          |                                          |-- 6. Verify via AlgoNode Indexer -->|
          |                                          |<-- 7. Txn Validated ----------------|
          |                                          |                                     |
          |<------- 8. HTTP 200 OK (AI Result) ------|                                     |
```

### Protocol Header Specification

#### Step A: Server Challenge (`X-PAYMENT-REQUEST`)
When a client requests a paid resource without valid payment headers, Manager returns `HTTP 402`:
```http
HTTP/1.1 402 Payment Required
Content-Type: application/json
X-PAYMENT-REQUEST: scheme=algorand-x402, version=1.0, network=mainnet, recipient=HELIXBOX...ALGO_ADDR, amount=10000, assetId=31566704, note=hb_ai_nonce_8f92a1, expiresAt=1784850000
```

#### Step B: Client Payment Proof (`X-PAYMENT-RESPONSE`)
The mobile app or CLI signs and broadcasts an Algorand Payment or Asset Transfer Transaction, then attaches proof:
```http
POST /v2/x402/ai/completion HTTP/1.1
Host: helixbox-manager.onrender.com
Content-Type: application/json
X-PAYMENT-RESPONSE: scheme=algorand-x402, txId=2Z7X9K...ALGO_TX_HASH, sender=USER_ALGO_ADDR
```

---

## 5. Algorand Verification & GoPlausible Integration

Helix Box connects directly to the **GoPlausible x402 Facilitator** and **AlgoNode Indexer API** to verify transactions on-chain.

### Verification Engine (`manager/src/algorandVerifier.ts`)
1. **Transaction Existence Check**: Verifies that `txId` exists on Algorand MainNet (`https://mainnet-api.algonode.cloud/v2/transactions/{txId}`).
2. **Recipient Validation**: Ensures receiver matches `recipient` address specified in challenge.
3. **Amount Validation**: Validates `amount >= required_amount` in base units (1 USDC = 1,000,000 microUnits).
4. **Nonce Verification**: Verifies transaction `note` matches the session challenge nonce to prevent replay attacks.
5. **Double-Spend Replay Guard**: Caches verified `txId` values in SQLite (`db.query('INSERT INTO verified_x402_txns...')`).

---

## 6. Mobile App Algorand Wallet Vault (`app/lib/algorand/`)

Helix Box embeds a lightweight, non-custodial Algorand wallet vault inside the mobile application:

### Features
- **Key Generation & Storage**: Generates 25-word Algorand mnemonics encrypted via Expo `SecureStore`.
- **WalletConnect & Pera Support**: Allows developers to connect external wallets (Pera, Defly, WalletConnect) or use internal micro-vault.
- **Auto-Approve Thresholds**: Users can enable "Auto-Approve Micro-Transactions < 0.5 ALGO" for seamless terminal workflow without manual popups for every $0.01 prompt.
- **Live Balance Tracking**: Displays real-time ALGO and USDC balances queried from AlgoNode REST endpoints.

---

## 7. GoPlausible Bazaar & Leaderboard Strategy

To qualify for the **$100K USDC + 500K ALGO** prize pool, Helix Box executes the following submission pipeline:

### Registration Metadata (`x402.json` Manifest)
```json
{
  "name": "Helix Box - Mobile IDE & PTY Micro-Compute",
  "description": "Mobile-first PTY terminal relays and AI agent execution powered by Algorand x402 micropayments.",
  "category": "developer-tools",
  "projectType": "composite",
  "tags": ["x402-global-challenge", "developer-tools", "ai-compute", "pty-sandbox"],
  "payTo": "YOUR_ALGORAND_RECEIVING_ADDRESS",
  "endpoints": [
    {
      "path": "/v2/x402/session/mint",
      "method": "POST",
      "priceUsdc": 0.10,
      "description": "1-Hour Mobile PTY Session Pass"
    },
    {
      "path": "/v2/x402/ai/completion",
      "method": "POST",
      "priceUsdc": 0.01,
      "description": "Pay-per-Request AI Terminal Assist"
    },
    {
      "path": "/v2/x402/sandbox/spawn",
      "method": "POST",
      "priceUsdc": 0.25,
      "description": "Ephemeral Container Sandbox Spawn"
    }
  ]
}
```

### Growth & Volume Execution Plan
1. **Public HTTPS Deployment**: Ensure Render servers maintain 99.9% uptime with public SSL (`https://helixbox-manager.onrender.com`).
2. **Initial MainNet Activation**: Execute initial USDC MainNet transactions to trigger GoPlausible Bazaar discovery indexer.
3. **Developer Distribution**: Distribute Helix Box CLI (`npm i -g helixbox-cli`) to developers and community members to generate sustained MainNet volume.
4. **Leaderboard Tracking**: Monitor rank on the official Algorand x402 Leaderboard through August – October to guarantee a Top 50 placement for Devcon 8 India finalist judging.

---

## 8. Detailed Implementation Timeline & Milestones

### Phase 1: Core Protocol Setup & Endpoints Definition
- Create `shared/x402.ts` for standardized header serialization.
- Define HTTP 402 middleware for Bun/Node HTTP servers.
- Wire `/v2/x402/session/mint`, `/v2/x402/ai/completion`, and `/v2/x402/sandbox/spawn`.

### Phase 2: Algorand On-Chain Verifier & Double-Spend Guard
- Integrate AlgoNode REST API (`algonode.cloud`).
- Implement in-memory & SQLite cache for processed transaction IDs (`txId`).
- Test payment challenge verification on Algorand TestNet.

### Phase 3: Mobile App Wallet Vault & Interceptor
- Integrate `algosdk` in Expo React Native.
- Create `@helixbox_algo_mnemonic` SecureStore manager.
- Implement automatic HTTP 402 interceptor in `ConnectionContext.tsx`.

### Phase 4: MainNet Deployment & Bazaar Directory Registration
- Deploy MainNet build to Render (`https://helixbox-manager.onrender.com`).
- Submit `x402.json` manifest to GoPlausible Facilitator Bazaar.
- Apply mandatory challenge tag: `x402-global-challenge`.

### Phase 5: Usage Drive & Devcon 8 India Finalist Prep
- Complete initial live USDC MainNet payments.
- Track rank on Global x402 Leaderboard.
- Prepare live presentation deck for Devcon 8 India.

---

*Blueprint generated for Helix-Crew — Ready for execution on Algorand MainNet.*
