import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { getWalletStatus, type WalletStatus } from "@/lib/wallet-status";
import { useFocusEffect, useRouter } from "expo-router";
import { Wallet } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";

export default function WalletSettingsPage() {
  const { colors, fonts } = useTheme();
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletStatus | null>(null);
  useFocusEffect(useCallback(() => { void getWalletStatus().then(setWallet); }, []));
  return <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
    <Header title="Wallet Connection" colors={colors} onBack={() => router.back()} />
    <View style={{ margin: 16, padding: 16, gap: 10, backgroundColor: colors.bg.raised, borderRadius: 10 }}>
      <Wallet color={colors.accent.default} size={22} />
      <Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold, fontSize: 16 }}>{wallet ? "Pera Wallet connected" : "No wallet connected"}</Text>
      <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: 13, lineHeight: 19 }}>{wallet ? `${wallet.network} · ${wallet.address}` : "A wallet is saved here only after a successful Pera payment."}</Text>
    </View>
  </View>;
}
