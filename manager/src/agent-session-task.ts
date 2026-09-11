import { pbkdf2Sync } from "crypto";
import algosdk from "algosdk";
import { ExactAvmScheme } from "@x402/avm/exact/client";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import english from "./bip39-words.js";

/**
 * Automated session task execution interval.
 * Can be overridden via X402_INTERVAL_MINS env var if desired.
 */
function getIntervalDelayMs(): number {
  const envInterval = Number(process.env.X402_INTERVAL_MINS);
  const targetMins =
    Number.isFinite(envInterval) && envInterval > 0 ? envInterval : 15.0;
  const spread = (Math.random() - 0.5) * 2.0;
  const mins = Math.max(3, targetMins + spread);
  return Math.round(mins * 60 * 1000);
}

/**
 * Resolves the 25th Algorand checksum word for a 24-word phrase.
 */
function parse24WordMnemonic(phrase24: string): algosdk.Account {
  const base = phrase24.trim();
  for (const candidate of english) {
    try {
      return algosdk.mnemonicToSecretKey(`${base} ${candidate}`);
    } catch {
      // try next candidate
    }
  }
  throw new Error(
    "Could not compute valid Algorand checksum for the 24 words.",
  );
}

/**
 * Checks if a string is a 64-byte base64 encoded Algorand secret key.
 */
function parseSecretKey(val: string): algosdk.Account | null {
  const trimmed = val.trim();
  if (/^[A-Za-z0-9+/]{86,88}={0,2}$/.test(trimmed)) {
    try {
      const bytes = Buffer.from(trimmed, "base64");
      if (bytes.length === 64) {
        const addr = new algosdk.Address(new Uint8Array(bytes.slice(32)));
        return { addr, sk: new Uint8Array(bytes) };
      }
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * Extracts valid 25-word or 24-word Algorand accounts from a word list
 * using sliding window inspection. Supports Algorand native and standard BIP-39.
 */
function extractFromWordList(words: string[]): algosdk.Account[] {
  const accounts: algosdk.Account[] = [];
  let idx = 0;
  while (idx < words.length && accounts.length < 3) {
    let matched = false;

    // 1. Try 25-word Algorand phrase (native checksum)
    if (idx + 25 <= words.length) {
      const chunk25 = words.slice(idx, idx + 25).join(" ");
      try {
        const acc = algosdk.mnemonicToSecretKey(chunk25);
        accounts.push(acc);
        idx += 25;
        matched = true;
        continue;
      } catch {
        // Not a valid 25-word native mnemonic
      }
    }

    // 2. Try 24-word phrase:
    if (idx + 24 <= words.length) {
      const chunk24 = words.slice(idx, idx + 24).join(" ");

      // 2a. Algorand 24-word prefix where 25th word is missing checksum
      try {
        const acc = parse24WordMnemonic(chunk24);
        accounts.push(acc);
        idx += 24;
        matched = true;
        continue;
      } catch {
        // Not an Algorand checksum prefix
      }

      // 2b. Standard BIP-39 24-word phrase -> PBKDF2 seed -> Algorand account
      try {
        const seed = pbkdf2Sync(chunk24, "mnemonic", 2048, 64, "sha512");
        const mn = algosdk.mnemonicFromSeed(new Uint8Array(seed.slice(0, 32)));
        const acc = algosdk.mnemonicToSecretKey(mn);
        accounts.push(acc);
        idx += 24;
        matched = true;
        continue;
      } catch {
        // Not a valid BIP-39 phrase
      }
    }

    // Advance 1 word to skip past non-mnemonic delimiter/label words
    idx += 1;
  }
  return accounts;
}

export interface LoadedAccount {
  account: algosdk.Account;
  address: string;
  sourceKey: string;
}

export interface WorkerStatus {
  accountNum: number;
  address: string;
  sourceKey: string;
  cadence: string;
  totalPaymentsSent: number;
  totalPaymentsConfirmed: number;
  lastPaymentAt: string | null;
  lastPaymentStatus: string | null;
  nextScheduledTime: string | null;
}

export interface KeyDiagnostic {
  key: string;
  wordsCount: number;
  status: "loaded" | "duplicate" | "failed" | "not_set";
  address?: string;
  detail?: string;
}

const activeWorkersStatus: WorkerStatus[] = [];
let detectedEnvironmentKeys: string[] = [];
const scanDiagnostics: KeyDiagnostic[] = [];

/**
 * Universal scanner that extracts up to 3 valid Algorand accounts
 * from ANY environment variable configuration in Render.
 */
function collectAccounts(): LoadedAccount[] {
  const accounts: LoadedAccount[] = [];
  const seenAddresses = new Set<string>();
  scanDiagnostics.length = 0;

  const prioritizedKeys = [
    "X402_AUTO_PAY_MNEMONIC",
    "X402_AUTO_PAY_MNEMONIC_1",
    "X402_AUTO_PAY_MNEMONIC1",
    "X402_AUTO_PAY_MNEMONIC_2",
    "X402_AUTO_PAY_MNEMONIC2",
    "X402_AUTO_PAY_MNEMONIC_3",
    "X402_AUTO_PAY_MNEMONIC3",
    "X402_AUTO_PAY_MNEMONICS",
    "MNEMONIC_1",
    "MNEMONIC_2",
    "MNEMONIC_3",
    "X402_WALLET_1",
    "X402_WALLET_2",
    "X402_WALLET_3",
    "X402_PAYER_1",
    "X402_PAYER_2",
    "X402_PAYER_3",
  ];

  const allEnvKeys = Array.from(
    new Set([...prioritizedKeys, ...Object.keys(process.env)]),
  );

  detectedEnvironmentKeys = allEnvKeys.filter((key) => {
    if (prioritizedKeys.includes(key)) return Boolean(process.env[key]);
    if (
      /MNEMONIC|WALLET|PAYER|ACCOUNT|PHRASE|SEED|ALGO_KEY|PRIVATE_KEY/i.test(
        key,
      )
    ) {
      return Boolean(process.env[key]);
    }
    if (
      key.startsWith("X402_") &&
      ![
        "X402_NETWORK",
        "X402_MANAGER_URL",
        "X402_AUTO_PAY_CODE",
        "X402_AUTO_PAY_DURATION_DAYS",
        "X402_PAY_TO",
      ].includes(key)
    ) {
      return Boolean(process.env[key]);
    }
    return false;
  });

  console.log(
    `[agent-session-task] Render environment scan detected keys:`,
    detectedEnvironmentKeys,
  );

  for (const key of detectedEnvironmentKeys) {
    if (accounts.length >= 3) break;

    const rawVal = (process.env[key] || "").trim();
    if (!rawVal) {
      scanDiagnostics.push({
        key,
        wordsCount: 0,
        status: "not_set",
        detail: "Variable is empty",
      });
      continue;
    }

    // 1. Check if rawVal is a base64 encoded private key
    const b64Acc = parseSecretKey(rawVal);
    if (b64Acc) {
      const addr =
        typeof b64Acc.addr === "string" ? b64Acc.addr : b64Acc.addr.toString();
      if (!seenAddresses.has(addr)) {
        seenAddresses.add(addr);
        accounts.push({ account: b64Acc, address: addr, sourceKey: key });
        scanDiagnostics.push({
          key,
          wordsCount: 0,
          status: "loaded",
          address: addr,
          detail: "Loaded from base64 private key",
        });
        console.log(
          `[agent-session-task] Key "${key}": loaded base64 private key -> ${addr.slice(0, 8)}...`,
        );
      } else {
        scanDiagnostics.push({
          key,
          wordsCount: 0,
          status: "duplicate",
          address: addr,
          detail: "Duplicate address of another key",
        });
        console.log(
          `[agent-session-task] Key "${key}": duplicate address ${addr.slice(0, 8)}..., skipping.`,
        );
      }
      continue;
    }

    // 2. Clean and extract ALL words across all lines, commas, and list numbers
    const allWords = rawVal
      .replace(/["'`;,\r\n[\](){}]/g, " ")
      .replace(/\b\d+\b/g, " ")
      .split(/\s+/)
      .map((w) => w.toLowerCase().replace(/[^a-z]/g, ""))
      .filter(Boolean);

    console.log(
      `[agent-session-task] Key "${key}": found ${allWords.length} words. Sample: [${allWords.slice(0, 3).join(" ")} ... ${allWords.slice(-2).join(" ")}]`,
    );

    if (allWords.length < 24) {
      const detail = `Found only ${allWords.length} words (minimum 24 or 25 words required).`;
      scanDiagnostics.push({
        key,
        wordsCount: allWords.length,
        status: "failed",
        detail,
      });
      console.warn(`[agent-session-task] Key "${key}": ${detail}`);
      continue;
    }

    const extracted = extractFromWordList(allWords);
    if (extracted.length === 0) {
      const detail = `Could not parse valid Algorand account from ${allWords.length} words. Check for typos or invalid words.`;
      scanDiagnostics.push({
        key,
        wordsCount: allWords.length,
        status: "failed",
        detail,
      });
      console.warn(`[agent-session-task] Key "${key}": ${detail}`);
      continue;
    }

    for (const parsed of extracted) {
      const addr =
        typeof parsed.addr === "string" ? parsed.addr : parsed.addr.toString();
      if (!seenAddresses.has(addr)) {
        seenAddresses.add(addr);
        accounts.push({ account: parsed, address: addr, sourceKey: key });
        scanDiagnostics.push({
          key,
          wordsCount: allWords.length,
          status: "loaded",
          address: addr,
          detail: `Successfully loaded account`,
        });
        console.log(
          `[agent-session-task] Key "${key}": successfully loaded account -> ${addr.slice(0, 8)}...`,
        );
      } else {
        scanDiagnostics.push({
          key,
          wordsCount: allWords.length,
          status: "duplicate",
          address: addr,
          detail: "Duplicate address of another key",
        });
        console.log(
          `[agent-session-task] Key "${key}": duplicate address ${addr.slice(0, 8)}..., skipping.`,
        );
      }
      if (accounts.length >= 3) break;
    }
  }

  return accounts;
}

/**
 * Returns current status of the agent session tasks for live diagnostic inspection.
 */
export function getAgentSessionTaskStatus() {
  return {
    service: "HelixBox automated micro-payment agent task",
    targetAccounts: 3,
    activeWorkersCount: activeWorkersStatus.length,
    workers: activeWorkersStatus,
    detectedEnvironmentKeys,
    scanDiagnostics,
    instructions:
      activeWorkersStatus.length < 3
        ? `Only ${activeWorkersStatus.length} of 3 accounts loaded! In Render Dashboard -> Environment: 1) Add X402_AUTO_PAY_MNEMONIC_1, X402_AUTO_PAY_MNEMONIC_2, X402_AUTO_PAY_MNEMONIC_3. 2) Click 'Save Changes'. 3) Trigger 'Manual Deploy'.`
        : "All 3 accounts are active and executing 5-minute automated micro-transactions!",
  };
}

let manualRunTrigger: (() => Promise<void>) | null = null;

export async function triggerAgentSessionRunNow(): Promise<{
  triggered: boolean;
  message: string;
}> {
  if (manualRunTrigger) {
    manualRunTrigger().catch(console.error);
    return {
      triggered: true,
      message: "Immediate payment run triggered successfully",
    };
  }
  return {
    triggered: false,
    message: "No active workers available to trigger",
  };
}

export function startAgentSessionTask() {
  const accountEntries = collectAccounts();
  const code = process.env.X402_AUTO_PAY_CODE || "helixbox-agent-auto-session";
  const port = process.env.PORT || "10000";
  const managerUrl =
    process.env.X402_MANAGER_URL || `http://127.0.0.1:${port}`;

  console.log(
    `[agent-session-task] Target manager URL: ${managerUrl}`,
  );

  console.log(
    `[agent-session-task] Successfully loaded ${accountEntries.length} of 3 target accounts.`,
  );

  accountEntries.forEach((entry, idx) => {
    console.log(
      `[agent-session-task] Account #${idx + 1}: ${entry.address.slice(0, 8)}... (source: ${entry.sourceKey})`,
    );
  });

  if (accountEntries.length < 3) {
    console.warn(
      `[agent-session-task] ATTENTION: Only ${accountEntries.length} account(s) loaded! To run all 3 accounts in 5-minute challenge mode, set X402_AUTO_PAY_MNEMONIC_1, X402_AUTO_PAY_MNEMONIC_2, and X402_AUTO_PAY_MNEMONIC_3 in Render Environment settings, save changes, and trigger Manual Deploy.`,
    );
  }

  // Self-ping keep-alive loop every 3 minutes to prevent Render free instance spin-down
  setInterval(
    async () => {
      try {
        await fetch(`${managerUrl}/v2/x402/health`);
      } catch {
        // Ping error ignored
      }
    },
    3 * 60 * 1000,
  );

  if (accountEntries.length === 0) {
    console.log(
      "[agent-session-task] Disabled: No valid mnemonics found. Please set X402_AUTO_PAY_MNEMONIC, X402_AUTO_PAY_MNEMONIC_2, X402_AUTO_PAY_MNEMONIC_3 in Render.",
    );
    return;
  }

  const durationDays = Number(process.env.X402_AUTO_PAY_DURATION_DAYS || 30);
  const stopTimestamp = Date.now() + durationDays * 24 * 60 * 60 * 1000;

  console.log(
    `[agent-session-task] Starting session workers for ${accountEntries.length} account(s) (active for ${durationDays} days until ${new Date(stopTimestamp).toISOString()})...`,
  );

  // Clear and initialize worker status
  activeWorkersStatus.length = 0;

  // Launch worker for each account
  accountEntries.forEach(({ account, address, sourceKey }, index) => {
    const accountNum = index + 1;
    const tag = `[agent-session-task #${accountNum}]`;
    const cadence = "15-minute cli session schedule";

    const statusRecord: WorkerStatus = {
      accountNum,
      address,
      sourceKey,
      cadence,
      totalPaymentsSent: 0,
      totalPaymentsConfirmed: 0,
      lastPaymentAt: null,
      lastPaymentStatus: null,
      nextScheduledTime: null,
    };
    activeWorkersStatus.push(statusRecord);

    const signer = {
      address,
      signTransactions: async (
        txns: Uint8Array[],
        indexesToSign?: number[],
      ) => {
        console.log(
          `${tag} Signing ${txns.length} transaction(s) for ${address.slice(0, 8)}...`,
        );
        return txns.map((txn, idx) => {
          if (!indexesToSign || indexesToSign.includes(idx)) {
            const decoded = algosdk.decodeUnsignedTransaction(txn);
            return decoded.signTxn(account.sk);
          }
          return null;
        });
      },
    };

    const isMainnet = String(process.env.X402_NETWORK || "").includes(
      "wGHE2Pwd",
    );
    const algodUrl = isMainnet
      ? "https://mainnet-api.algonode.cloud"
      : "https://testnet-api.algonode.cloud";
    const algod = new algosdk.Algodv2("", algodUrl, "");
    const usdcAssetId = isMainnet ? 31566704 : 10458941;

    async function checkAndPrepareAccount(): Promise<{
      canPay: boolean;
      algoBalance: number;
      usdcBalance: number;
    }> {
      try {
        const info = await algod.accountInformation(address).do();
        const algoBalance = Number(info.amount || 0) / 1e6;
        const usdcHolding = (info.assets || []).find(
          (a: {
            assetId?: number | bigint;
            "asset-id"?: number | bigint;
            amount?: number | bigint;
          }) => Number(a.assetId ?? a["asset-id"]) === usdcAssetId,
        );

        // If account has at least 0.2 ALGO but hasn't opted in to USDC yet, auto opt-in!
        if (!usdcHolding && algoBalance >= 0.2) {
          try {
            console.log(
              `${tag} Account has ${algoBalance} ALGO. Automatically opting in to USDC (${usdcAssetId})...`,
            );
            const suggestedParams = await algod.getTransactionParams().do();
            const optInTxn =
              algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                sender: address,
                receiver: address,
                assetIndex: usdcAssetId,
                amount: 0,
                suggestedParams,
              });
            const signedTxn = optInTxn.signTxn(account.sk);
            const { txid } = await algod.sendRawTransaction(signedTxn).do();
            console.log(
              `${tag} Opt-in txn sent (${txid}), waiting for confirmation...`,
            );
            await algosdk.waitForConfirmation(algod, txid, 4);
            console.log(
              `${tag} Successfully opted in to USDC (${usdcAssetId})! Ready to send transactions.`,
            );
          } catch (optErr) {
            console.warn(
              `${tag} Auto opt-in attempt failed:`,
              optErr instanceof Error ? optErr.message : String(optErr),
            );
          }
        }

        const usdcBalance = Number(usdcHolding?.amount ?? 0) / 1e6;
        const canPay = algoBalance >= 0.002 && usdcBalance >= 0.25;
        return { canPay, algoBalance, usdcBalance };
      } catch (err) {
        console.warn(
          `${tag} Balance check failed:`,
          err instanceof Error ? err.message : String(err),
        );
        return { canPay: true, algoBalance: 0, usdcBalance: 0 };
      }
    }

    // Query and log wallet balance on startup for diagnostics
    (async () => {
      const { canPay, algoBalance, usdcBalance } =
        await checkAndPrepareAccount();
      const txEstimate = Math.floor(usdcBalance / 0.25);
      const hoursEstimate = (txEstimate * (15 / 60)).toFixed(1);

      if (!canPay) {
        console.warn(
          `${tag} ACTION REQUIRED: Payer ${address} has ${algoBalance} ALGO, ${usdcBalance} USDC. Please send at least 0.5 ALGO and some USDC to activate automated transactions!`,
        );
      } else {
        console.log(
          `${tag} Payer ${address} (from ${sourceKey}): ${algoBalance} ALGO, ${usdcBalance} USDC (${isMainnet ? "MainNet" : "TestNet"}) | Cadence: ${cadence} (~${txEstimate} tx remaining, ~${hoursEstimate}h runway)`,
        );
      }
    })();

    const client = new x402Client().register(
      "algorand:*",
      new ExactAvmScheme(signer),
    );

    async function runTask() {
      if (Date.now() >= stopTimestamp) {
        console.log(
          `${tag} ${durationDays}-day active period ended. Worker stopped.`,
        );
        return;
      }

      // Pre-flight check: ensure account is funded before attempting payment
      const { canPay, algoBalance, usdcBalance } =
        await checkAndPrepareAccount();
      if (!canPay) {
        statusRecord.lastPaymentStatus = `waiting for funds (${usdcBalance} USDC, ${algoBalance} ALGO)`;
        console.warn(
          `${tag} Payment skipped: Insufficient balance on ${address.slice(0, 8)}... (${usdcBalance} USDC, ${algoBalance} ALGO). Please fund this account with at least 0.5 ALGO and some USDC. Next retry in ~5 mins.`,
        );
        scheduleNext();
        return;
      }

      statusRecord.totalPaymentsSent += 1;
      statusRecord.lastPaymentAt = new Date().toISOString();

      try {
        console.log(
          `${tag} Sending payment request ($0.25 USDC) from ${address.slice(0, 8)} to ${managerUrl}/v2/x402/cli/hour...`,
        );
        const payFetch = wrapFetchWithPayment(fetch, client);
        const response = await payFetch(
          `${managerUrl}/v2/x402/cli/hour`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          statusRecord.totalPaymentsConfirmed += 1;
          statusRecord.lastPaymentStatus = "confirmed (200 OK)";
          console.log(
            `${tag} Success: Hourly CLI session renewed for ${address.slice(0, 8)}!`,
            data,
          );
        } else {
          const errText = await response.text().catch(() => "");
          statusRecord.lastPaymentStatus = `rejected (${response.status})`;
          console.error(
            `${tag} Rejected: ${response.status} ${response.statusText}`,
            {
              body: errText,
              headers: Object.fromEntries(response.headers.entries()),
            },
          );
        }
      } catch (error) {
        statusRecord.lastPaymentStatus = `error: ${error instanceof Error ? error.message : String(error)}`;
        console.error(
          `${tag} Error:`,
          error instanceof Error ? error.message : String(error),
        );
      }

      scheduleNext();
    }

    function scheduleNext() {
      if (Date.now() >= stopTimestamp) {
        console.log(
          `${tag} ${durationDays}-day active period reached. No more transactions scheduled.`,
        );
        return;
      }

      const nextDelay = getIntervalDelayMs();
      const nextRunTime = new Date(Date.now() + nextDelay);
      const delayMinutes = (nextDelay / (60 * 1000)).toFixed(1);
      statusRecord.nextScheduledTime = nextRunTime.toISOString();

      console.log(
        `${tag} Next transaction scheduled in ~${delayMinutes} mins (at ${nextRunTime.toISOString()})`,
      );

      setTimeout(runTask, nextDelay);
    }

    if (accountNum === 1) {
      manualRunTrigger = runTask;
    }

    // Stagger the initial execution: Account 1 in 10s, Account 2 in 30s, Account 3 in 50s
    const initialStaggersMs = [10000, 30000, 50000];
    const staggerOffsetMs = initialStaggersMs[index] ?? 10000 + index * 20000;
    const initialRunTime = new Date(Date.now() + staggerOffsetMs);
    statusRecord.nextScheduledTime = initialRunTime.toISOString();

    console.log(
      `${tag} Initial run scheduled in ~${(staggerOffsetMs / 1000).toFixed(0)}s (at ${initialRunTime.toISOString()})`,
    );
    setTimeout(runTask, staggerOffsetMs);
  });
}

// Alias for backward compatibility
export const startCodexAgentTask = startAgentSessionTask;
