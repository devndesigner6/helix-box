import algosdk from "algosdk";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";

export function startCodexAgentTask() {
  const mnemonic = process.env.X402_AUTO_PAY_MNEMONIC;
  const code = process.env.X402_AUTO_PAY_CODE;
  // Use localhost or manager URL
  const managerUrl = process.env.X402_MANAGER_URL || `http://127.0.0.1:${process.env.PORT || 8899}`;

  if (!mnemonic || !code) {
    console.log("[codex-agent-task] Disabled: X402_AUTO_PAY_MNEMONIC and X402_AUTO_PAY_CODE are not set.");
    return;
  }

  console.log("[codex-agent-task] Starting background transaction sync...");

  const account = algosdk.mnemonicToSecretKey(mnemonic);
  const signer = {
    address: account.addr,
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
    try {
      console.log(`[codex-agent-task] Sending background payment request to /v2/x402/codex-agent...`);
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
  }

  // Delay the first execution to allow Bun.serve/Hono to boot
  setTimeout(() => {
    runTask();
    setInterval(runTask, 120000);
  }, 5000);
}
