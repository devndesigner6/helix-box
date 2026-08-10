import * as Linking from "expo-linking";
import { Platform } from "react-native";
import type { WalletStatus } from "@/lib/wallet-status";
import { parsePeraCallback } from "@/lib/pera-callback";

const CHECKOUT_URL = process.env.EXPO_PUBLIC_CHECKOUT_URL || "https://helix-box.vercel.app/checkout";

function openUrlAndWaitForDeepLink(url: string, expectedEvent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let sub: any;
    const handleUrl = (event: { url: string }) => {
      if (event.url.includes(expectedEvent)) {
        if (sub) {
          if (typeof sub.remove === "function") sub.remove();
          else if (typeof sub === "function") (sub as any)();
        }
        resolve(event.url);
      }
    };
    sub = Linking.addEventListener("url", handleUrl);
    Linking.openURL(url).catch((err) => {
      if (sub) {
        if (typeof sub.remove === "function") sub.remove();
        else if (typeof sub === "function") (sub as any)();
      }
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
  const callbackUrl = await openUrlAndWaitForDeepLink(checkout.toString(), event);
  return parsePeraCallback(callbackUrl, event, code) as WalletStatus;
}

export const openPeraWalletConnection = () => openCheckout("connect");
export const openPeraCheckout = (code: string) => openCheckout("pay", code);
