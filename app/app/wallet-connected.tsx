import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function WalletConnectedScreen() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/auth");
  }, []);

  return null;
}
