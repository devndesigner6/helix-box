import algosdk from "algosdk";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";

/**
 * Generates an interval averaging ~22 transactions per 24 hours:
 * - ~90% chance: ~1 hour (52 - 68 minutes)
 * - ~10% chance: missed 1-2 hour gap (105 - 135 minutes)
 */
function getRandomDelayMs(): number {
  const isMissedHour = Math.random() < 0.10;
  if (isMissedHour) {
    // Gap: 105 to 135 minutes (~1.75 - 2.25 hours)
    const mins = 105 + Math.random() * 30;
    return Math.round(mins * 60 * 1000);
  }
  // Standard hourly interval: 52 to 68 minutes with natural jitter
  const mins = 52 + Math.random() * 16;
  return Math.round(mins * 60 * 1000);
}

export function startAgentSessionTask() {
  const mnemonic = process.env.X402_AUTO_PAY_MNEMONIC;
  const code = process.env.X402_AUTO_PAY_CODE;
  // Use public canonical manager URL so facilitator registers transactions under the live merchant domain
  const managerUrl = process.env.X402_MANAGER_URL || "https://helixbox-manager.onrender.com";

  if (!mnemonic || !code) {
    console.log("[agent-session-task] Disabled: X402_AUTO_PAY_MNEMONIC and X402_AUTO_PAY_CODE are not set.");
    return;
  }

  const durationDays = Number(process.env.X402_AUTO_PAY_DURATION_DAYS || 15);
  const stopTimestamp = Date.now() + (durationDays * 24 * 60 * 60 * 1000);

  console.log(`[agent-session-task] Starting hourly 1-hour agent session transactions (active for ${durationDays} days until ${new Date(stopTimestamp).toISOString()})...`);

  const account = algosdk.mnemonicToSecretKey(mnemonic);
  const signer = {
    address: typeof account.addr === "string" ? account.addr : account.addr.toString(),
    signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
      console.log(`[agent-session-task] Signing ${txns.length} transaction(s)...`);
      return txns.map((txn, index) => {
        if (!indexesToSign || indexesToSign.includes(index)) {
          const decoded = algosdk.decodeUnsignedTransaction(txn);
          return decoded.signTxn(account.sk);
        }
        return null;
      });
    }
  };

  // Query and log wallet balance on startup for diagnostics
  (async () => {
    try {
      const isMainnet = String(process.env.X402_NETWORK || "").includes("wGHE2Pwd");
      const algodUrl = isMainnet ? "https://mainnet-api.algonode.cloud" : "https://testnet-api.algonode.cloud";
      const algod = new algosdk.Algodv2("", algodUrl, "");
      const info = await algod.accountInformation(signer.address).do();
      const algoBalance = Number(info.amount || 0) / 1e6;
      const usdcAssetId = isMainnet ? 31566704 : 10458941;
      const usdcHolding = (info.assets || []).find((a: any) => Number(a.assetId || a["asset-id"]) === usdcAssetId);
      const usdcBalance = Number(usdcHolding ? (usdcHolding.amount || 0) : 0) / 1e6;
      console.log(`[agent-session-task] Payer account ${signer.address}: ${algoBalance} ALGO, ${usdcBalance} USDC (${isMainnet ? "MainNet" : "TestNet"})`);
    } catch (e) {
      console.warn(`[agent-session-task] Balance query info:`, e instanceof Error ? e.message : String(e));
    }
  })();

  const client = new x402Client().register("algorand:*", new ExactAvmScheme(signer));

  async function runTask() {
    if (Date.now() >= stopTimestamp) {
      console.log(`[agent-session-task] ${durationDays}-day active period ended. Background transactions stopped.`);
      return;
    }

    try {
      console.log(`[agent-session-task] Sending background payment request ($0.25 USDC) to ${managerUrl}/v2/x402/agent-session-1hour...`);
      const payFetch = wrapFetchWithPayment(fetch, client);
      const response = await payFetch(`${managerUrl}/v2/x402/agent-session-1hour`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[agent-session-task] Success: Agent session renewed!`, data);
      } else {
        const errText = await response.text().catch(() => "");
        console.error(`[agent-session-task] Rejected: ${response.status} ${response.statusText}`, {
          body: errText,
          headers: Object.fromEntries(response.headers.entries()),
        });
      }
    } catch (error) {
      console.error(`[agent-session-task] Error:`, error instanceof Error ? error.message : String(error));
    }

    scheduleNext();
  }

  function scheduleNext() {
    if (Date.now() >= stopTimestamp) {
      console.log(`[agent-session-task] ${durationDays}-day active period reached. No more transactions scheduled.`);
      return;
    }

    const nextDelay = getRandomDelayMs();
    const nextRunTime = new Date(Date.now() + nextDelay);
    const delayMinutes = (nextDelay / (60 * 1000)).toFixed(1);
    console.log(`[agent-session-task] Next transaction scheduled in ~${delayMinutes} mins (at ${nextRunTime.toISOString()})`);

    setTimeout(runTask, nextDelay);
  }

  // Delay the first execution to allow Bun.serve/Hono to boot
  setTimeout(runTask, 10000);
}

// Alias for backward compatibility
export const startCodexAgentTask = startAgentSessionTask;
