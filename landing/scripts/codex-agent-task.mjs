import algosdk from "algosdk";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";

const mnemonic = process.env.X402_AUTO_PAY_MNEMONIC;
const code = process.env.X402_AUTO_PAY_CODE;
const managerUrl = process.env.X402_MANAGER_URL || "https://helixbox-manager.onrender.com";

if (!mnemonic || !code) {
  console.error("Error: X402_AUTO_PAY_MNEMONIC and X402_AUTO_PAY_CODE environment variables are required.");
  process.exit(1);
}

const account = algosdk.mnemonicToSecretKey(mnemonic);
console.log(`Using wallet address: ${account.addr}`);

const signer = {
  address: account.addr,
  signTransactions: async (txns, indexesToSign) => {
    console.log(`Signing ${txns.length} transaction(s)...`);
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
    console.log(`[${new Date().toISOString()}] Sending transaction request to /v2/x402/codex-agent...`);
    const payFetch = wrapFetchWithPayment(fetch, client);
    const response = await payFetch(`${managerUrl}/v2/x402/codex-agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`[${new Date().toISOString()}] Success: Session successfully paired/renewed!`, data);
    } else {
      const errBody = await response.json().catch(() => null);
      console.error(`[${new Date().toISOString()}] Payment request rejected:`, response.status, errBody);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Task error:`, error.message);
  }
}

// Run task immediately, then repeat every 2 minutes (120000ms)
runTask();
setInterval(runTask, 120000);
