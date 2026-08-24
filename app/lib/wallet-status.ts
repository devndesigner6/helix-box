import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@helixbox_wallet";
export type WalletStatus = { address: string; network: "Testnet" | "Mainnet" };

export const isWalletStatus = (value: unknown): value is WalletStatus => {
  if (!value || typeof value !== "object") return false;
  const { address, network } = value as Partial<WalletStatus>;
  return typeof address === "string" && /^[A-Z2-7]{58}$/.test(address) && (network === "Testnet" || network === "Mainnet");
};

export const getWalletStatus = async (): Promise<WalletStatus | null> => {
  const value = await AsyncStorage.getItem(KEY);
  if (!value) return null;
  try {
    const wallet = JSON.parse(value);
    return isWalletStatus(wallet) ? wallet : null;
  } catch { return null; }
};
export const saveWalletStatus = (status: WalletStatus) => AsyncStorage.setItem(KEY, JSON.stringify(status));
export const removeWalletStatus = () => AsyncStorage.removeItem(KEY);
