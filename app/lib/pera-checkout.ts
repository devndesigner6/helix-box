import * as Linking from "expo-linking";
import { Platform } from "react-native";
import type { WalletStatus } from "@/lib/wallet-status";
import { parsePeraCallback } from "@/lib/pera-callback";

const CHECKOUT_URL = process.env.EXPO_PUBLIC_CHECKOUT_URL || "https://helix-box.vercel.app/checkout";

function openUrlAndWaitForDeepLink(url: string, expectedEvent: string, expectedCode?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let sub: any;
    const cleanup = () => {
      clearTimeout(timeout);
      if (typeof sub?.remove === "function") sub.remove();
      else if (typeof sub === "function") sub();
    };
    const handleUrl = (event: { url: string }) => {
      try {
        parsePeraCallback(event.url, expectedEvent, expectedCode);
        cleanup();
        resolve(event.url);
      } catch { /* Ignore unrelated deep links. */ }
    };
    sub = Linking.addEventListener("url", handleUrl);
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Pera Wallet did not return to HelixBox. Please try again."));
    }, 3 * 60 * 1000);
    Linking.openURL(url).catch((err) => {
      cleanup();
      reject(err);
    });
  });
}

async function openCheckout(mode: "connect" | "pay", code?: string): Promise<WalletStatus> {
  if (Platform.OS === "web") throw new Error("Use the web checkout controls");
  const checkout = new URL(CHECKOUT_URL);
  checkout.searchParams.set("mode", mode);
  if (code) checkout.searchParams.set("code", code);
  const event = mode === "connect" ? "wallet-connected" : "payment-complete";
  const callbackUrl = await openUrlAndWaitForDeepLink(checkout.toString(), event, code);
  return parsePeraCallback(callbackUrl, event, code) as WalletStatus;
}

export const openPeraWalletConnection = (code?: string) => openCheckout("connect", code);
export const openPeraCheckout = (code: string) => openCheckout("pay", code);
