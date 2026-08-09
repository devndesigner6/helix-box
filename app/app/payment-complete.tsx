import { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function PaymentCompleteScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  
  useEffect(() => {
    if (code) {
      router.replace({ pathname: "/workspace", params: { code } });
    } else {
      router.replace("/auth");
    }
  }, [code]);

  return null;
}
