import { useConnection } from "@/contexts/ConnectionContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { openPeraCheckout } from "@/lib/pera-checkout";
import { saveWalletStatus } from "@/lib/wallet-status";
import { ArrowLeft, CheckCircle2, Wallet } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

const MANAGER_URL = process.env.EXPO_PUBLIC_MANAGER_URL || "https://helixbox-manager.onrender.com";
type Plan = "hour" | "week";

export default function Payment() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  const { connect, getPairedSessions, resumeSession } = useConnection();
  const { colors, fonts } = useTheme();
  const [address, setAddress] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activatePaidSession = async () => {
    if (!code) throw new Error("CLI pairing code is missing");
    const pairedSession = (await getPairedSessions()).find((session) => session.sessionCode === code);
    if (pairedSession) await resumeSession(pairedSession);
    else await connect(code);
    router.replace({ pathname: "/workspace", params: { code } });
  };

  const connectWallet = async () => {
    if (Platform.OS !== "web") return;
    setBusy(true); setError(null);
    try {
      const { PeraWalletConnect } = await import("@perawallet/connect");
      const health = await fetch(`${MANAGER_URL}/v2/x402/health`).then((response) => response.json() as Promise<{ network?: string }>);
      const pera = new PeraWalletConnect({ chainId: health.network?.includes("SGO1GKS") ? 416002 : 416001, shouldShowSignTxnToast: false });
      const accounts = await pera.reconnectSession().catch(() => [] as string[]);
      const connected = accounts[0] ? accounts : await pera.connect();
      if (!connected[0]) throw new Error("No Pera account was selected");
      (globalThis as typeof globalThis & { helixboxPera?: typeof pera }).helixboxPera = pera;
      setAddress(connected[0]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pera connection failed");
    } finally { setBusy(false); }
  };

  const pay = async (plan: Plan) => {
    if (!code) return;
    setBusy(true); setError(null);
    try {
      if (Platform.OS !== "web") {
        await saveWalletStatus(await openPeraCheckout(code));
        await activatePaidSession();
        return;
      }

      const pera = (globalThis as typeof globalThis & { helixboxPera?: any }).helixboxPera;
      if (!address || !pera) throw new Error("Connect Pera Wallet first");
      const [{ x402Client }, { wrapFetchWithPayment }, { ExactAvmScheme }, algosdk] = await Promise.all([
        import("@x402/fetch"), import("@x402/fetch"), import("@x402/avm/exact/client"), import("algosdk"),
      ]);
      const signer = {
        address,
        signTransactions: async (txns: Uint8Array[], indexesToSign?: number[]) => {
          const signed = await pera.signTransaction([txns.map((txn: Uint8Array, index: number) => ({
            txn: algosdk.decodeUnsignedTransaction(txn),
            signers: !indexesToSign || indexesToSign.includes(index) ? [address] : [],
          }))]);
          let signedIndex = 0;
          return txns.map((_: Uint8Array, index: number) => !indexesToSign || indexesToSign.includes(index) ? signed[signedIndex++] ?? null : null);
        },
      };
      const client = new x402Client().register("algorand:*", new ExactAvmScheme(signer));
      const path = plan === "hour" ? "/v2/x402/cli/hour" : "/v2/x402/premium/week";
      const response = await wrapFetchWithPayment(fetch, client)(`${MANAGER_URL}${path}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null) as { error?: string } | null)?.error || `Payment failed (${response.status})`);
      await activatePaidSession();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Payment failed");
    } finally { setBusy(false); }
  };

  const canPay = Platform.OS !== "web" || Boolean(address);
  return <View style={{ flex: 1, backgroundColor: colors.bg.base, padding: 24, justifyContent: "center", gap: 16 }}>
    <Pressable onPress={() => router.back()} hitSlop={10} style={{ position: "absolute", top: 52, left: 20 }}><ArrowLeft color={colors.fg.default} size={22} /></Pressable>
    <View style={{ gap: 8 }}>
      <Wallet color={colors.fg.default} size={28} />
      <Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold, fontSize: 25 }}>Activate HelixBox</Text>
      <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: 14, lineHeight: 21 }}>Choose access for your connected CLI session. Your editor stays free until you start an agent session.</Text>
    </View>
    {Platform.OS === "web" && (address ? <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}><CheckCircle2 color={colors.fg.default} size={16} /><Text style={{ color: colors.fg.muted, fontFamily: fonts.mono.regular, fontSize: 12 }}>{address}</Text></View> : <Pressable disabled={busy} onPress={connectWallet} style={{ backgroundColor: colors.bg.raised, borderRadius: 12, padding: 15, opacity: busy ? .55 : 1 }}><Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold, textAlign: "center" }}>{busy ? "Connecting Pera..." : "Connect Pera Wallet"}</Text></Pressable>)}
    {canPay && <View style={{ gap: 10 }}>
      <Pressable disabled={busy} onPress={() => pay("hour")} style={{ backgroundColor: colors.bg.raised, borderRadius: 12, padding: 15, opacity: busy ? .55 : 1 }}><Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold }}>Pay $0.25 USDC / 1 hour</Text></Pressable>
      <Pressable disabled={busy} onPress={() => pay("week")} style={{ backgroundColor: colors.bg.raised, borderRadius: 12, padding: 15, opacity: busy ? .55 : 1 }}><Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold }}>Pay $2 USDC / 7 days</Text></Pressable>
    </View>}
    {error && <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: 13 }}>{error}</Text>}
  </View>;
}
