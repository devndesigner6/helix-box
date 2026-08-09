import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import type { WalletStatus } from "@/lib/wallet-status";
import { parsePeraCallback } from "@/lib/pera-callback";

const CHECKOUT_URL = process.env.EXPO_PUBLIC_CHECKOUT_URL || "https://helix-box.vercel.app/checkout";
async function openCheckout(mode: "connect" | "pay", code?: string): Promise<WalletStatus> {
  if (Platform.OS === "web") throw new Error("Use the web checkout controls");
  const checkout = new URL(CHECKOUT_URL);
  checkout.searchParams.set("mode", mode);
  if (code) checkout.searchParams.set("code", code);
  const event = mode === "connect" ? "wallet-connected" : "payment-complete";
  const result = await WebBrowser.openAuthSessionAsync(checkout.toString(), Linking.createURL(event));
  if (result.type !== "success") throw new Error(mode === "connect" ? "Wallet connection was not completed." : "Payment was not completed. Return to HelixBox after approving it in Pera Wallet.");
  return parsePeraCallback(result.url, event, code) as WalletStatus;
}

export const openPeraWalletConnection = () => openCheckout("connect");
export const openPeraCheckout = (code: string) => openCheckout("pay", code);
