import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isWalletStatus, saveWalletStatus } from "@/lib/wallet-status";

export default function WalletConnectedScreen() {
  const router = useRouter();
  const { address, network, code } = useLocalSearchParams<{ address?: string; network?: string; code?: string }>();
  
  useEffect(() => {
    const wallet = { address, network };
    if (!isWalletStatus(wallet)) {
      router.replace("/auth");
      return;
    }
    void saveWalletStatus(wallet).finally(() => {
      if (code) router.replace({ pathname: "/workspace", params: { code } });
      else router.replace("/auth");
    });
  }, [address, code, network, router]);

  return null;
}
