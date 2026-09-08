import Loading from "@/components/Loading";
import PluginBottomBar from "@/components/PluginBottomBar";
import PluginRenderer from "@/components/PluginRenderer";
import { useConnection } from "@/contexts/ConnectionContext";
import { useSessionRegistry } from "@/contexts/SessionRegistry";
import { useTheme } from "@/contexts/ThemeContext";
import { logger } from "@/lib/logger";
import { openPeraCheckout } from "@/lib/pera-checkout";
import { saveWalletStatus } from "@/lib/wallet-status";
import { usePlugins } from "@/plugins";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";


export default function WorkspaceScreen() {
  const { colors, fonts } = useTheme();
  const { isLoading, openTab, openTabs, activeTabId, setActiveTab } = usePlugins();
  const { registry } = useSessionRegistry();
  const { status, sessionState, sessionCode, error, isReconnecting, interactionBlockReason, disconnect, connect, getSessionPaymentStatus, getPairedSessions, resumeSession } = useConnection();
  const router = useRouter();
  const { code, payment } = useLocalSearchParams<{ code?: string; payment?: string }>();
  const drawerStatus = useDrawerStatus();
  const { t } = useTranslation();

  const [bottomBarHeight, setBottomBarHeight] = useState(0);
  const prevSessionStateRef = useRef(sessionState);
  const reconnectAttemptVisibleRef = useRef(false);
  const reconnectFailureAlertVisibleRef = useRef(false);
  const reconnectRefreshRunningRef = useRef(false);
  const shouldRefreshAfterReconnectRef = useRef(false);
  const hasConnectedOnceRef = useRef(false);
  const showConnectionNotice = status === "connecting" || isReconnecting || interactionBlockReason !== null;
  const pendingCode = typeof code === "string" ? code : null;
  const paidCode = pendingCode ?? sessionCode;
  const [externalPaidUntil, setExternalPaidUntil] = useState(0);
  const [paymentStatusChecked, setPaymentStatusChecked] = useState(false);
  const needsPaidSession = Boolean(paidCode) && (
    sessionState === "expired" ||
    (status === "disconnected" && sessionState === "idle")
  ) && paymentStatusChecked && externalPaidUntil <= Date.now();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const completedPaymentRef = useRef<string | null>(null);
  const externalActivationRef = useRef<string | null>(null);

  useEffect(() => {
    setExternalPaidUntil(0);
    setPaymentStatusChecked(false);
    externalActivationRef.current = null;
  }, [paidCode]);

  useEffect(() => {
    if (!paidCode || status === "connected") return;
    let cancelled = false;

    const checkExternalPayment = async () => {
      try {
        const remote = await getSessionPaymentStatus(paidCode);
        if (cancelled) return;
        setPaymentStatusChecked(true);
        if (!remote.paid) return;

        setExternalPaidUntil(remote.paidUntil);
        if (
          status !== "disconnected" ||
          (sessionState !== "idle" && sessionState !== "expired") ||
          externalActivationRef.current === paidCode
        ) {
          return;
        }

        externalActivationRef.current = paidCode;
        // Re-assemble from the pairing code so an external payment can renew
        // an expired local password instead of trying the stale resume token.
        await connect(paidCode);
      } catch (cause) {
        if (!cancelled) {
          setPaymentStatusChecked(true);
          logger.warn("workspace", "external payment status check failed", {
            code: paidCode,
            error: cause instanceof Error ? cause.message : String(cause),
          });
        }
      }
    };

    void checkExternalPayment();
    const interval = setInterval(() => void checkExternalPayment(), 2_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [connect, getSessionPaymentStatus, paidCode, sessionState, status]);
  const startPaidSession = async () => {
    if (!paidCode || isPaying) return;
    setIsPaying(true); setPaymentError(null);
    try {
      const settledWallet = await openPeraCheckout(paidCode);
      await saveWalletStatus(settledWallet);
      const session = (await getPairedSessions()).find((item) => item.sessionCode === paidCode);
      if (session) await resumeSession(session); else await connect(paidCode);
    } catch (cause) { setPaymentError(cause instanceof Error ? cause.message : "Payment failed"); }
    finally { setIsPaying(false); }
  };

  useEffect(() => {
    if (payment !== "paid" || !paidCode || completedPaymentRef.current === paidCode || status !== "disconnected") return;
    completedPaymentRef.current = paidCode;
    void (async () => {
      const session = (await getPairedSessions()).find((item) => item.sessionCode === paidCode);
      if (session) await resumeSession(session); else await connect(paidCode);
    })().catch((cause) => setPaymentError(cause instanceof Error ? cause.message : "Payment was settled, but session activation failed"));
  }, [connect, getPairedSessions, paidCode, payment, resumeSession, status]);

  const handleGoHome = useCallback(() => {
    logger.info("workspace", "navigating back to auth after disconnect");
    router.replace("/auth");
    disconnect();
  }, [disconnect, router]);

  useEffect(() => {
    const prev = prevSessionStateRef.current;
    prevSessionStateRef.current = sessionState;

    logger.info("workspace", "screen state updated", {
      prevSessionState: prev,
      status,
      sessionState,
      error,
      isLoading,
      drawerStatus,
    });

    if (prev !== sessionState && sessionState === "expired" && paidCode) {
      return;
    }

    if (prev !== sessionState && (sessionState === "ended" || sessionState === "expired" || sessionState === "cli_offline_grace")) {
      Alert.alert(
        t('workspace.connectionLostTitle'),
        t('workspace.connectionLostDesc'),
        [{ text: t('workspace.goHome'), style: 'destructive', onPress: handleGoHome }],
        { cancelable: false }
      );
    }
  }, [drawerStatus, error, handleGoHome, isLoading, paidCode, sessionState, status]);

  useEffect(() => {
    if (isLoading) {
      logger.info("workspace", "rendering loading spinner", { status, error });
      return;
    }

    logger.info("workspace", "workspace shell ready", { status, error });
  }, [isLoading, status, error]);

  useEffect(() => {
    const isReconnectingNow = status === "connecting" || isReconnecting || interactionBlockReason !== null;
    if (isReconnectingNow) {
      if (hasConnectedOnceRef.current) {
        shouldRefreshAfterReconnectRef.current = true;
      }
      reconnectAttemptVisibleRef.current = true;
      reconnectFailureAlertVisibleRef.current = false;
      return;
    }

    if (status === "connected") {
      hasConnectedOnceRef.current = true;
    }

    if (reconnectAttemptVisibleRef.current && status !== "connected" && error && !reconnectFailureAlertVisibleRef.current) {
      reconnectFailureAlertVisibleRef.current = true;
      Alert.alert(
        t('workspace.sessionDisconnectedTitle'),
        t('workspace.sessionDisconnectedDesc'),
        [
          { text: t('workspace.goHome'), style: "destructive", onPress: handleGoHome },
        ],
        { cancelable: false }
      );
    }

    if (!isReconnectingNow) {
      reconnectAttemptVisibleRef.current = false;
    }
  }, [error, handleGoHome, interactionBlockReason, isReconnecting, status]);

  useEffect(() => {
    if (status !== "connected" || !shouldRefreshAfterReconnectRef.current || reconnectRefreshRunningRef.current) {
      return;
    }

    const activePluginId = openTabs.find((tab) => tab.id === activeTabId)?.pluginId ?? null;
    shouldRefreshAfterReconnectRef.current = false;
    reconnectRefreshRunningRef.current = true;

    const runRefresh = async () => {
      const refreshSession = async (pluginId: string, sessionId: string) => {
        const registration = registry[pluginId];
        if (!registration?.onReconnectRefreshSession) return;
        try {
          await registration.onReconnectRefreshSession(sessionId);
        } catch (refreshError) {
          logger.warn("workspace", "reconnect session refresh failed", {
            pluginId,
            sessionId,
            error: refreshError instanceof Error ? refreshError.message : String(refreshError),
          });
        }
      };

      const refreshPlugin = async (pluginId: string) => {
        const registration = registry[pluginId];
        if (!registration?.onReconnectRefreshAll) return;
        try {
          await registration.onReconnectRefreshAll();
        } catch (refreshError) {
          logger.warn("workspace", "reconnect plugin refresh failed", {
            pluginId,
            error: refreshError instanceof Error ? refreshError.message : String(refreshError),
          });
        }
      };

      const refreshPluginSessions = async (pluginId: string, skipSessionId?: string | null) => {
        const registration = registry[pluginId];
        if (!registration) return;
        for (const session of registration.sessions) {
          if (session.id === skipSessionId) continue;
          await refreshSession(pluginId, session.id);
        }
      };

      logger.info("workspace", "running reconnect refresh queue", { activePluginId });

      if (activePluginId) {
        const activeRegistration = registry[activePluginId];
        const activeSessionId = activeRegistration?.activeSessionId ?? null;
        if (activeSessionId) {
          await refreshSession(activePluginId, activeSessionId);
        }
        await refreshPluginSessions(activePluginId, activeSessionId);
        await refreshPlugin(activePluginId);
      }

      for (const tab of openTabs) {
        if (tab.pluginId === activePluginId) continue;
        await refreshPluginSessions(tab.pluginId);
        await refreshPlugin(tab.pluginId);
      }
    };

    void runRefresh().finally(() => {
      reconnectRefreshRunningRef.current = false;
    });
  }, [activeTabId, openTabs, registry, status]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;

      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        // Keep users in workspace; let default behavior close the drawer if open.
        if (drawerStatus === "open") return false;
        return true;
      });

      return () => sub.remove();
    }, [drawerStatus])
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
        <Loading color={colors.accent.default} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
      <PluginRenderer paddingBottom={0} bottomBarHeight={bottomBarHeight} />
      <View onLayout={(e) => setBottomBarHeight(e.nativeEvent.layout.height)}>
        <PluginBottomBar
          openTab={openTab}
          setActiveTab={setActiveTab}
        />
      </View>
      {showConnectionNotice ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            minHeight: 24,
            paddingHorizontal: 12,
            paddingVertical: 4,
            backgroundColor: colors.bg.raised,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.main,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
            elevation: 20,
          }}
        >
          <View style={{ width: 20, height: 20 }}>
              <Loading color={colors.fg.default} />
            </View>
            <Text
              style={{
                color: colors.fg.default,
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {interactionBlockReason === "offline" ? t('workspace.offline') : t('workspace.reconnecting')}
            </Text>
            <Text
              style={{
                color: colors.fg.muted,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              {interactionBlockReason === "offline"
                ? t('workspace.waitingConnection')
                : t('workspace.restoringSession')}
            </Text>
        </View>
      ) : null}
      {needsPaidSession && paidCode ? (
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: bottomBarHeight + 16,
            backgroundColor: colors.bg.raised,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border.main,
            padding: 16,
            gap: 10,
          }}
        >
          <Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold, fontSize: 16 }}>
            {sessionState === "expired" ? "Your 1-hour agent session ended" : "Start your first agent session"}
          </Text>
          <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: 13, lineHeight: 19 }}>
            {sessionState === "expired" ? "Pay $0.25 USDC to start another 1-hour agent session, or choose $2 USDC for 7 days." : "Pera Wallet opens to approve your session payment. Choose $0.25 USDC for 1 hour or $2 USDC for 7 days."}
          </Text>
          <Pressable
            disabled={isPaying}
            onPress={startPaidSession}
            style={{ backgroundColor: colors.accent.default, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, opacity: isPaying ? .6 : 1 }}
          >
            <Text style={{ color: colors.fg.default, fontFamily: fonts.sans.semibold, fontSize: 14, textAlign: "center" }}>
              {isPaying ? "Opening Pera..." : sessionState === "expired" ? "Renew access" : "Pay and start agent session"}
            </Text>
          </Pressable>
          {paymentError ? <Text style={{ color: colors.fg.muted, fontFamily: fonts.sans.regular, fontSize: 12 }}>{paymentError}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
