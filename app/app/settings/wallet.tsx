import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { openPeraWalletConnection } from "@/lib/pera-checkout";
import { getWalletStatus, saveWalletStatus, type WalletStatus } from "@/lib/wallet-status";
import { useFocusEffect, useRouter } from "expo-router";
import { Wallet } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function WalletSettingsPage() {
  const { colors, fonts } = useTheme();
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(useCallback(() => { void getWalletStatus().then(setWallet); }, []));
  const connectWallet = async () => {
    setBusy(true); setError(null);
    try { const connected = await openPeraWalletConnection(); await saveWalletStatus(connected); setWallet(connected); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Pera Wallet connection failed"); }
    finally { setBusy(false); }
  };
  return <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
    <Header title="Wallet Connection" colors={colors} onBack={() => router.back()} />
    <View style={{ margin: 16, padding: 16, gap: 10, backgroundColor: colors.bg.raised, borderRadius: 10 }}>
      <Wallet color={colors.accent.default} size={22} />
      <Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold, fontSize: 16 }}>{wallet ? "Pera Wallet connected" : "No wallet connected"}</Text>
      <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: 13, lineHeight: 19 }}>{wallet ? `${wallet.network} · ${wallet.address}` : "Connect Pera once before paying for an agent session."}</Text>
      {!wallet ? <Pressable disabled={busy} onPress={connectWallet} style={{ backgroundColor: colors.accent.default, borderRadius: 10, padding: 12, opacity: busy ? .6 : 1 }}><Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold, textAlign: "center" }}>{busy ? "Connecting Pera..." : "Connect Pera Wallet"}</Text></Pressable> : null}
      {error ? <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: 12 }}>{error}</Text> : null}
    </View>
  </View>;
}
