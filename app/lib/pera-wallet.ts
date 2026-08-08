import { getRandomBytes } from "expo-crypto";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { Buffer } from "buffer";
import WalletConnect from "@perawallet/walletconnect";
import type { ISessionStorage, IWalletConnectSession } from "@perawallet/walletconnect/types";

const MANAGER_URL = process.env.EXPO_PUBLIC_MANAGER_URL || "https://helixbox-manager.onrender.com";
const SESSION_KEY = "helixbox.pera.walletconnect";
const PERA_CONFIG_URL = "https://wc.perawallet.app/config.json";

type WalletConnector = InstanceType<typeof WalletConnect>;

let session: IWalletConnectSession | null = null;
let loaded = false;
let connector: WalletConnector | null = null;

function ensureRandomValues() {
  const crypto = globalThis.crypto || (globalThis.crypto = {} as Crypto);
  if (!crypto.getRandomValues) {
    crypto.getRandomValues = ((array: ArrayBufferView) => {
      if (!array) return array;
      new Uint8Array(array.buffer, array.byteOffset, array.byteLength).set(getRandomBytes(array.byteLength));
      return array;
    }) as Crypto["getRandomValues"];
  }
}

async function loadSession() {
  if (loaded) return;
  loaded = true;
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  session = raw ? JSON.parse(raw) as IWalletConnectSession : null;
}

const storage: ISessionStorage = {
  getSession: () => session,
  setSession: (next) => {
    session = next;
    void SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(next));
    return next;
  },
  removeSession: () => {
    session = null;
    void SecureStore.deleteItemAsync(SESSION_KEY);
  },
};

export async function getPeraChainId() {
  const response = await fetch(`${MANAGER_URL}/v2/x402/health`);
  const body = await response.json() as { network?: string };
  if (!response.ok || !body.network) throw new Error("HelixBox payments are unavailable right now");
  return body.network.includes("SGO1GKS") ? 416002 : 416001;
}

async function getBridge() {
  const response = await fetch(PERA_CONFIG_URL);
  const body = await response.json() as { bridgeURL?: unknown };
  if (!response.ok || typeof body.bridgeURL !== "string" || !body.bridgeURL.startsWith("https://")) {
    throw new Error("Pera WalletConnect bridge is unavailable");
  }
  return body.bridgeURL;
}

async function getConnector() {
  await loadSession();
  ensureRandomValues();
  if (!globalThis.crypto?.subtle) throw new Error("HelixBox wallet cryptography is not ready");
  if (connector) return connector;
  connector = new WalletConnect({
    bridge: await getBridge(),
    storage,
    clientMeta: {
      name: "HelixBox",
      description: "HelixBox paid CLI relay",
      url: "https://helixbox.xyz",
      icons: ["https://helixbox.xyz/icon.png"],
    },
  });
  return connector;
}

export async function connectPeraWallet() {
  const active = await getConnector();
  if (active.connected && active.accounts[0]) return active.accounts[0];
  const chainId = await getPeraChainId();
  const address = await new Promise<string>((resolve, reject) => {
    active.on("connect", (error, payload) => {
      const account = payload?.params?.[0]?.accounts?.[0];
      if (error) reject(error);
      else if (typeof account === "string") resolve(account);
      else reject(new Error("Pera did not return an account"));
    });
    active.createSession({ chainId })
      .then(() => Linking.openURL(active.uri))
      .catch(reject);
  });
  return address;
}

export async function signWithPera(address: string, txns: Uint8Array[], indexesToSign?: number[]) {
  const active = await getConnector();
  if (!active.connected || active.accounts[0] !== address) throw new Error("Reconnect Pera Wallet to sign this payment");
  const signed = await active.sendCustomRequest({
    method: "algo_signTxn",
    params: [txns.map((txn, index) => ({
      txn: Buffer.from(txn).toString("base64"),
      signers: !indexesToSign || indexesToSign.includes(index) ? [address] : [],
    }))],
  }, { forcePushNotification: true });
  return txns.map((_, index) => {
    if (indexesToSign && !indexesToSign.includes(index)) return null;
    const value = signed[index];
    if (!value) throw new Error("Pera did not sign every required transaction");
    return typeof value === "string" ? new Uint8Array(Buffer.from(value, "base64")) : new Uint8Array(value);
  });
}
