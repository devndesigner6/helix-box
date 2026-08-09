import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import type { WalletStatus } from "@/lib/wallet-status";

const CHECKOUT_URL = process.env.EXPO_PUBLIC_CHECKOUT_URL || "https://helix-box.vercel.app/checkout";
export async function openPeraCheckout(code: string): Promise<WalletStatus> {
  if (Platform.OS === "web") throw new Error("Use the web checkout controls");
  const checkout = new URL(CHECKOUT_URL);
  checkout.searchParams.set("code", code);
  const result = await WebBrowser.openAuthSessionAsync(checkout.toString(), Linking.createURL("payment-complete"));
  if (result.type !== "success") throw new Error("Payment was not completed. Return to HelixBox after approving it in Pera Wallet.");
  const callback = new URL(result.url);
  const address = callback.searchParams.get("address");
  const network = callback.searchParams.get("network");
  if (callback.protocol !== "helixbox:" || callback.hostname !== "payment-complete" || callback.searchParams.get("status") !== "paid" || callback.searchParams.get("code") !== code || !address || (network !== "Testnet" && network !== "Mainnet")) throw new Error("Invalid payment return from checkout");
  return { address, network };
}
