import algosdk from "algosdk";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";

// Varied intervals to randomly select between transactions:
// ~1m, ~5m, ~15m, ~20m, ~35m, ~1h, ~1.5h, ~2h, ~2.5h, ~3h with jitter
const INTERVAL_POOL_MS = [
  1 * 60 * 1000,    // 1 minute
  5 * 60 * 1000,    // 5 minutes
  15 * 60 * 1000,   // 15 minutes
  20 * 60 * 1000,   // 20 minutes
  35 * 60 * 1000,   // 35 minutes
  60 * 60 * 1000,   // 1 hour
  90 * 60 * 1000,   // 1.5 hours
  120 * 60 * 1000,  // 2 hours
  150 * 60 * 1000,  // 2.5 hours
  180 * 60 * 1000,  // 3 hours
];

function getRandomDelayMs(): number {
  const base = INTERVAL_POOL_MS[Math.floor(Math.random() * INTERVAL_POOL_MS.length)];
  // Add random jitter (-15% to +20%)
  const jitter = (Math.random() * 0.35) - 0.15;
  const delay = Math.round(base * (1 + jitter));
  return Math.max(30 * 1000, delay); // at least 30 seconds
}

export function startCodexAgentTask() {
  const mnemonic = process.env.X402_AUTO_PAY_MNEMONIC;
  const code = process.env.X402_AUTO_PAY_CODE;
  // Use localhost or manager URL
  const managerUrl = process.env.X402_MANAGER_URL || `http://127.0.0.1:${process.env.PORT || 8899}`;

  if (!mnemonic || !code) {
    console.log("[codex-agent-task] Disabled: X402_AUTO_PAY_MNEMONIC and X402_AUTO_PAY_CODE are not set.");
    return;
  }

  const durationDays = Number(process.env.X402_AUTO_PAY_DURATION_DAYS || 5);
  const stopTimestamp = Date.now() + (durationDays * 24 * 60 * 60 * 1000);

  console.log(`[codex-agent-task] Starting dynamic background transaction schedule (active for ${durationDays} days until ${new Date(stopTimestamp).toISOString()})...`);

  const account = algosdk.mnemonicToSecretKey(mnemonic);
  const signer = {
    address: typeof account.addr === "string" ? account.addr : account.addr.toString(),
    signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
      console.log(`[codex-agent-task] Signing ${txns.length} transaction(s)...`);
      return txns.map((txn, index) => {
        if (!indexesToSign || indexesToSign.includes(index)) {
          const decoded = algosdk.decodeUnsignedTransaction(txn);
          return decoded.signTxn(account.sk);
        }
        return null;
      });
    }
  };

  const client = new x402Client().register("algorand:*", new ExactAvmScheme(signer));

  async function runTask() {
    if (Date.now() >= stopTimestamp) {
      console.log("[codex-agent-task] 5-day active period ended. Background transactions stopped.");
      return;
    }

    try {
      console.log(`[codex-agent-task] Sending background payment request ($0.25 USDC) to /v2/x402/codex-agent...`);
      const payFetch = wrapFetchWithPayment(fetch, client);
      const response = await payFetch(`${managerUrl}/v2/x402/codex-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[codex-agent-task] Success: Session paired/renewed!`, data);
      } else {
        const errBody = await response.json().catch(() => null);
        console.error(`[codex-agent-task] Rejected:`, response.status, errBody);
      }
    } catch (error) {
      console.error(`[codex-agent-task] Error:`, error instanceof Error ? error.message : String(error));
    }

    scheduleNext();
  }

  function scheduleNext() {
    if (Date.now() >= stopTimestamp) {
      console.log("[codex-agent-task] 5-day active period reached. No more transactions scheduled.");
      return;
    }

    const nextDelay = getRandomDelayMs();
    const nextRunTime = new Date(Date.now() + nextDelay);
    const delayMinutes = (nextDelay / (60 * 1000)).toFixed(1);
    console.log(`[codex-agent-task] Next transaction scheduled in ~${delayMinutes} mins (at ${nextRunTime.toISOString()})`);

    setTimeout(runTask, nextDelay);
  }

  // Delay the first execution to allow Bun.serve/Hono to boot
  setTimeout(runTask, 10000);
}
