import { PeraWalletConnect } from "@perawallet/connect";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import algosdk from "algosdk";
import { alignPeraSignatures } from "./pera-signatures";

const managerUrl = import.meta.env.VITE_MANAGER_URL || "https://helixbox-manager.onrender.com";
const code = new URLSearchParams(window.location.search).get("code") || "";
const root = document.querySelector("#root");

root.innerHTML = `<section style="max-width:420px;margin:0 auto;padding:32px 20px 48px;display:grid;gap:16px;font-family:Inter,system-ui,sans-serif;color:#111"><div style="font-size:13px;color:#666">HELIXBOX</div><h1 style="margin:0;font-size:28px">Start your agent session</h1><p style="margin:0;color:#666;line-height:1.5">Your editor stays free. Pay only when you start an agent session connected to your laptop CLI.</p><div style="padding:16px;border:1px solid #e5e5e5;border-radius:12px;background:#f7f7f7;display:grid;gap:8px"><strong style="font-size:14px">What this unlocks</strong><span style="color:#666;font-size:13px;line-height:1.45">Secure CLI-to-mobile agent access for the selected time. Access begins only after Pera Wallet approves and the x402 payment settles.</span></div><details style="border:1px solid #e5e5e5;border-radius:12px;padding:14px;background:#fff"><summary style="cursor:pointer;font-weight:700;font-size:14px">How your payment works</summary><ol style="margin:12px 0 0;padding-left:20px;color:#666;font-size:13px;line-height:1.6"><li>Choose an access period below.</li><li>Pera Wallet opens so you can approve the USDC transaction.</li><li>HelixBox receives settlement confirmation and activates this paired CLI session.</li></ol></details><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:12px;color:#666">Payment network</span><span id="network" style="font-size:12px;font-weight:700;color:#111">Checking...</span></div><button data-plan="hour" style="padding:16px;border:0;border-radius:12px;background:#f3f3f3;color:#111;font-size:16px;font-weight:700;cursor:pointer">Pay $0.25 USDC &middot; 1 hour</button><button data-plan="week" style="padding:16px;border:0;border-radius:12px;background:#f3f3f3;color:#111;font-size:16px;font-weight:700;cursor:pointer">Pay $2 USDC &middot; 7 days</button><p id="status" role="status" style="margin:0;color:#666;font-size:14px"></p></section>`;

const status = root.querySelector("#status");
const networkLabel = root.querySelector("#network");
const setStatus = (message) => { status.textContent = message; };

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

async function pay(plan) {
  if (!code) throw new Error("This checkout link is missing its CLI pairing code");
  setStatus("Connecting Pera Wallet...");
  const network = await getNetwork();
  const pera = new PeraWalletConnect({ chainId: network.chainId, shouldShowSignTxnToast: false });
  const existing = await pera.reconnectSession().catch(() => []);
  const accounts = existing.length ? existing : await pera.connect();
  const address = accounts[0];
  if (!address) throw new Error("No Pera account was selected");
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

for (const button of root.querySelectorAll("button[data-plan]")) button.addEventListener("click", async () => {
  root.querySelectorAll("button").forEach((item) => { item.disabled = true; item.style.opacity = "0.6"; });
  try { await pay(button.dataset.plan); }
  catch (error) { setStatus(error instanceof Error ? error.message : "Payment could not be completed"); root.querySelectorAll("button").forEach((item) => { item.disabled = false; item.style.opacity = "1"; }); }
});
