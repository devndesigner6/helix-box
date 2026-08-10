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
  ? `<button data-connect class="btn btn-primary" style="width:100%; display:block; margin-top:8px;">Connect Pera Wallet</button>`
  : `<div style="display:grid; gap:10px; margin-top:8px;"><button data-plan="hour" class="btn btn-primary" style="width:100%;">Pay $0.25 USDC &middot; 1 hour</button><button data-plan="week" class="btn btn-secondary" style="width:100%;">Pay $2 USDC &middot; 7 days</button></div>`;

root.innerHTML = `
<div style="max-width:460px; margin: 80px auto; padding:0 24px;">
  <section style="border: 1px solid var(--ink); box-shadow: var(--shadow-hard-lg); background: var(--bg-surface); padding: 32px 28px; display: grid; gap: 20px;">
    <div style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.16em; color: var(--blueprint); text-transform: uppercase; font-weight: 600;">HELIXBOX // SECURE CHECKOUT</div>
    
    <h1 style="margin:0; font-family: var(--font-display); font-size: 2.2rem; line-height: 1.1; color: var(--ink); text-transform: uppercase;">
      ${mode === "connect" ? "Connect Pera Wallet" : "Start Agent Session"}
    </h1>
    
    <p style="margin:0; font-family: var(--font-body); font-size: 0.98rem; line-height: 1.55; color: var(--ink-soft);">
      ${mode === "connect" ? "Connect once to save your public wallet address in the HelixBox app. You approve payments separately when you start an agent session." : "Your editor stays free. Pay only when you start an agent session connected to your laptop CLI."}
    </p>
    
    <div style="padding: 16px; border: 1px solid var(--rule-soft); background: var(--bg); display: grid; gap: 6px; font-family: var(--font-body); font-size: 0.88rem; line-height: 1.5; color: var(--ink-soft);">
      <strong style="font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; color: var(--ink); letter-spacing: 0.08em;">
        ${mode === "connect" ? "What we save" : "What this unlocks"}
      </strong>
      <span>
        ${mode === "connect" ? "Your public wallet address and selected network only. HelixBox never receives your private key." : "Secure CLI-to-mobile agent access for the selected time. Access begins only after Pera Wallet approves and the x402 payment settles."}
      </span>
    </div>
    
    <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px dashed var(--rule-soft); padding-top: 16px; font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-mute);">
      <span>Payment network</span>
      <span id="network" style="font-weight:700; color: var(--blueprint);">Checking...</span>
    </div>
    
    ${actions}
    
    <p id="status" role="status" style="margin:0; font-family: var(--font-mono); font-size: 0.74rem; letter-spacing: 0.04em; color: var(--ink-soft); line-height: 1.5; padding: 10px; background: var(--code-bg); border-left: 3px solid var(--blueprint); display: none;"></p>
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
