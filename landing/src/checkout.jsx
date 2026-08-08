import { PeraWalletConnect } from "@perawallet/connect";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import algosdk from "algosdk";

const managerUrl = import.meta.env.VITE_MANAGER_URL || "https://helixbox-manager.onrender.com";
const query = new URLSearchParams(window.location.search);
const code = query.get("code") || "";
const root = document.querySelector("#root");

root.innerHTML = `
  <section style="max-width:420px;margin:0 auto;padding:48px 24px;display:grid;gap:16px">
    <div style="font-size:13px;color:#a1a1aa">HELIXBOX</div>
    <h1 style="margin:0;font-size:28px">Start your agent session</h1>
    <p style="margin:0;color:#a1a1aa;line-height:1.5">Pera Wallet opens to approve a real Algorand x402 payment. Your CLI session starts only after settlement.</p>
    <button data-plan="hour" style="padding:14px;border:0;border-radius:10px;background:#f4f4f5;color:#111827;font-size:15px;font-weight:700;cursor:pointer">Pay $0.25 USDC · 1 hour</button>
    <button data-plan="week" style="padding:14px;border:1px solid #3f3f46;border-radius:10px;background:#18181b;color:#f4f4f5;font-size:15px;font-weight:700;cursor:pointer">Pay $2 USDC · 7 days</button>
    <p id="status" role="status" style="margin:0;color:#a1a1aa;font-size:14px"></p>
  </section>`;

const status = root.querySelector("#status");
const setStatus = (message) => { status.textContent = message; };

async function getChainId() {
  const response = await fetch(`${managerUrl}/v2/x402/health`);
  const body = await response.json();
  if (!response.ok || typeof body.network !== "string") throw new Error("HelixBox payments are unavailable right now");
  return body.network.includes("SGO1GKS") ? 416002 : 416001;
}

async function pay(plan) {
  if (!code) throw new Error("This checkout link is missing its CLI pairing code");
  setStatus("Connecting Pera Wallet...");
  const pera = new PeraWalletConnect({ chainId: await getChainId(), shouldShowSignTxnToast: false });
  const existing = await pera.reconnectSession().catch(() => []);
  const accounts = existing.length ? existing : await pera.connect();
  const address = accounts[0];
  if (!address) throw new Error("No Pera account was selected");

  setStatus("Approve the payment in Pera Wallet...");
  const signer = {
    address,
    signTransactions: async (txns, indexesToSign) => {
      const signed = await pera.signTransaction([txns.map((txn, index) => ({
        txn: algosdk.decodeUnsignedTransaction(txn),
        signers: !indexesToSign || indexesToSign.includes(index) ? [address] : [],
      }))]);
      return txns.map((_, index) => !indexesToSign || indexesToSign.includes(index) ? signed[index] : null);
    },
  };
  const client = new x402Client().register("algorand:*", new ExactAvmScheme(signer));
  const response = await wrapFetchWithPayment(fetch, client)(`${managerUrl}/v2/x402/cli/${plan}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Payment failed (${response.status})`);
  }
  setStatus("Payment settled. Returning to HelixBox...");
  window.location.assign(`helixbox://payment-complete?status=paid&code=${encodeURIComponent(code)}`);
}

for (const button of root.querySelectorAll("button[data-plan]")) {
  button.addEventListener("click", async () => {
    root.querySelectorAll("button").forEach((item) => { item.disabled = true; item.style.opacity = "0.6"; });
    try {
      await pay(button.dataset.plan);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Payment could not be completed");
      root.querySelectorAll("button").forEach((item) => { item.disabled = false; item.style.opacity = "1"; });
    }
  });
}
