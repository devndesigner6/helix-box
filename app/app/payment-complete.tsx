import { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { isWalletStatus, saveWalletStatus } from "@/lib/wallet-status";

export default function PaymentCompleteScreen() {
  const router = useRouter();
  const { code, status, address, network } = useLocalSearchParams<{ code?: string; status?: string; address?: string; network?: string }>();
  
  useEffect(() => {
    const wallet = { address, network };
    if (!code || status !== "paid" || !isWalletStatus(wallet)) {
      router.replace("/auth");
      return;
    }
    void saveWalletStatus(wallet).finally(() => {
      router.replace({ pathname: "/workspace", params: { code, payment: "paid" } });
    });
  }, [address, code, network, router, status]);

  return null;
}
