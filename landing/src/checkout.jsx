import { PeraWalletConnect } from "@perawallet/connect";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import algosdk from "algosdk";
import { alignPeraSignatures } from "./pera-signatures";

const managerUrl = import.meta.env.VITE_MANAGER_URL || "https://helixbox-manager.onrender.com";
const query = new URLSearchParams(window.location.search);
const code = query.get("code") || "";
const mode = query.get("mode") === "connect" ? "connect" : "pay";
const root = document.querySelector("#root");
const actions = mode === "connect"
  ? `<button data-connect class="checkout-btn" style="width:100%; display:block; margin-top:8px;">Connect Pera Wallet</button>`
  : `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:8px;">
       <button data-plan="hour" class="checkout-btn" style="width:100%;">Pay $0.25 <br/><span style="font-size:0.65rem; font-weight:normal; text-transform:none;">1 hour session</span></button>
       <button data-plan="week" class="checkout-btn checkout-btn-secondary" style="width:100%;">Pay $2.00 <br/><span style="font-size:0.65rem; font-weight:normal; text-transform:none;">7 day premium</span></button>
     </div>`;

root.innerHTML = `
<style>
  .checkout-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg);
    background-image: radial-gradient(var(--rule-soft) 1px, transparent 1px);
    background-size: 20px 20px;
    padding: 24px;
    box-sizing: border-box;
  }
  .checkout-card {
    max-width: 480px;
    width: 100%;
    border: 2px solid var(--ink);
    box-shadow: 6px 6px 0 var(--ink);
    background: var(--bg-surface);
    padding: 40px 32px;
    display: grid;
    gap: 24px;
    position: relative;
    box-sizing: border-box;
  }
  .checkout-title-label {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    color: var(--blueprint);
    text-transform: uppercase;
    font-weight: 600;
  }
  .checkout-heading {
    margin: 0;
    font-family: var(--font-display);
    font-size: 2.2rem;
    line-height: 1.1;
    color: var(--ink);
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }
  .checkout-desc {
    margin: 0;
    font-family: var(--font-body);
    font-size: 0.96rem;
    line-height: 1.55;
    color: var(--ink-soft);
  }
  .checkout-info-box {
    padding: 20px;
    border: 1px solid var(--rule-soft);
    background: var(--bg);
    display: grid;
    gap: 8px;
    font-family: var(--font-body);
    font-size: 0.88rem;
    line-height: 1.55;
    color: var(--ink-soft);
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.03);
  }
  .checkout-info-title {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-transform: uppercase;
    color: var(--ink);
    letter-spacing: 0.08em;
  }
  .checkout-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 10px 16px;
    border: 2px solid var(--ink);
    background: var(--bg-surface);
    color: var(--ink);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 4px 4px 0 var(--ink);
    transition: background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.15s;
    box-sizing: border-box;
    line-height: 1.3;
  }
  .checkout-btn:hover {
    background: var(--blueprint);
    color: var(--bg);
    box-shadow: 2px 2px 0 var(--ink);
    transform: translate(2px, 2px);
  }
  .checkout-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  .checkout-btn-secondary {
    background: #fafaf5;
    color: var(--ink-soft);
  }
  .checkout-btn-secondary:hover {
    background: var(--ink);
    color: var(--bg);
  }
  .blinking-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: var(--blueprint);
    border-radius: 50%;
    margin-right: 8px;
    animation: dot-pulse 1.06s infinite alternate;
  }
  @keyframes dot-pulse {
    0% { opacity: 0.3; }
    100% { opacity: 1; }
  }
  .checkout-status-pill {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.74rem;
    letter-spacing: 0.04em;
    color: var(--ink-soft);
    line-height: 1.5;
    padding: 12px;
    background: var(--bg);
    border: 1px solid var(--rule-soft);
    border-left: 3px solid var(--blueprint);
    display: none;
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>

<div class="checkout-page">
  <section class="checkout-card animate-fade-in">
    <div style="position: absolute; top: -13px; left: 24px; background: var(--bg-surface); padding: 0 8px; font-family: var(--font-mono); font-size: 0.65rem; border: 1px solid var(--ink); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); z-index: 10;">
      PORT 402 RELAY SYSTEM // SECURE
    </div>
    
    <div style="display:flex; justify-content:center; margin-bottom: 4px;">
      <img src="/helixbox.png" alt="HelixBox Logo" style="height:48px; width:48px; border:1px solid var(--ink); box-shadow: 2px 2px 0 var(--ink);" />
    </div>

    <div class="checkout-title-label" style="text-align: center;">HELIXBOX // SECURE CHECKOUT</div>
    
    <h1 class="checkout-heading" style="text-align: center;">
      ${mode === "connect" ? "Connect Wallet" : "Start Session"}
    </h1>
    
    <p class="checkout-desc" style="text-align: center; max-width: 380px; margin: 0 auto;">
      ${mode === "connect" ? "Save your public wallet address in HelixBox. You approve payments separately in your wallet app." : "Your local editor stays free. Pay only when starting a proxy session connected to your workstation."}
    </p>
    
    <div class="checkout-info-box">
      <strong class="checkout-info-title">
        ${mode === "connect" ? "Saved Details" : "Session Access"}
      </strong>
      <span>
        ${mode === "connect" ? "Your public wallet address and selected network only. HelixBox never receives your private key." : "Secure CLI-to-mobile agent access for the selected time. Access begins only after Pera Wallet approval is settled on-chain."}
      </span>
    </div>
    
    <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px dashed var(--rule-soft); padding-top: 16px; font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-mute);">
      <span>Payment Network</span>
      <span style="font-weight:700; color: var(--blueprint); display: flex; align-items: center;">
        <span class="blinking-dot"></span>
        <span id="network">Checking...</span>
      </span>
    </div>
    
    ${actions}
    
    <p id="status" role="status" class="checkout-status-pill"></p>
  </section>
</div>
`;


const status = root.querySelector("#status");
const networkLabel = root.querySelector("#network");
const setStatus = (message) => {
  status.textContent = message;
  status.style.display = message ? "block" : "none";
};

async function getNetwork() {
  let failure;
  for (let attempt = 0; attempt < 2; attempt += 1) try {
    const response = await fetch(`${managerUrl}/v2/x402/health`);
    const body = await response.json();
    if (!response.ok || typeof body.network !== "string") throw new Error("HelixBox payments are unavailable right now");
    return body.network.includes("SGO1GKS") ? { chainId: 416002, label: "Testnet" } : { chainId: 416001, label: "Mainnet" };
  } catch (error) {
    failure = error;
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw failure;
}

getNetwork().then((network) => { networkLabel.textContent = `Algorand ${network.label}`; }).catch((error) => { networkLabel.textContent = "Unavailable"; setStatus(error instanceof Error ? error.message : "Payments are unavailable"); });

async function connectPera() {
  let phase = "checking HelixBox payments";
  try {
    const network = await getNetwork();
    phase = "connecting Pera Wallet";
    const pera = new PeraWalletConnect({ chainId: network.chainId, shouldShowSignTxnToast: false });
    const existing = await pera.reconnectSession().catch(() => []);
    if (!existing.length) await pera.disconnect().catch(() => undefined);
    const accounts = existing.length ? existing : await pera.connect();
    const address = accounts[0];
    if (!address) throw new Error("No Pera account was selected");
    return { address, network, pera };
  } catch (error) { throw new Error(`${phase}: ${error instanceof Error ? error.message : "failed"}`); }
}

async function connectWallet() {
  setStatus("Connecting Pera Wallet...");
  const { address, network } = await connectPera();
  setStatus("Wallet connected. Returning to HelixBox...");
  window.location.assign(`helixbox://wallet-connected?address=${encodeURIComponent(address)}&network=${network.label}`);
}

async function pay(plan) {
  if (!code) throw new Error("This checkout link is missing its CLI pairing code");
  setStatus("Connecting Pera Wallet...");
  const { address, network, pera } = await connectPera();
  setStatus("Approve the payment in Pera Wallet...");
  const signer = { address, signTransactions: async (txns, indexesToSign) => {
    const signed = await pera.signTransaction([txns.map((txn, index) => ({ txn: algosdk.decodeUnsignedTransaction(txn), signers: !indexesToSign || indexesToSign.includes(index) ? [address] : [] }))]);
    return alignPeraSignatures(txns, indexesToSign, signed);
  }};
  const client = new x402Client().register("algorand:*", new ExactAvmScheme(signer));
  const path = plan === "hour" ? "/v2/x402/cli/hour" : "/v2/x402/premium/week";
  const response = await wrapFetchWithPayment(fetch, client)(`${managerUrl}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Payment failed (${response.status})`);
  }
  setStatus("Payment settled. Returning to HelixBox...");
  window.location.assign(`helixbox://payment-complete?status=paid&code=${encodeURIComponent(code)}&address=${encodeURIComponent(address)}&network=${network.label}`);
}

const connectButton = root.querySelector("button[data-connect]");
if (connectButton) connectButton.addEventListener("click", async () => {
  connectButton.disabled = true; connectButton.style.opacity = "0.6";
  try { await connectWallet(); }
  catch (error) { setStatus(error instanceof Error ? error.message : "Wallet connection could not be completed"); connectButton.disabled = false; connectButton.style.opacity = "1"; }
});
for (const button of root.querySelectorAll("button[data-plan]")) button.addEventListener("click", async () => {
  root.querySelectorAll("button").forEach((item) => { item.disabled = true; item.style.opacity = "0.6"; });
  try { await pay(button.dataset.plan); }
  catch (error) { setStatus(error instanceof Error ? error.message : "Payment could not be completed"); root.querySelectorAll("button").forEach((item) => { item.disabled = false; item.style.opacity = "1"; }); }
});
