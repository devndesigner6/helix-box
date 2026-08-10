import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@helixbox_wallet";
export type WalletStatus = { address: string; network: "Testnet" | "Mainnet" };
export const getWalletStatus = async (): Promise<WalletStatus | null> => {
  const value = await AsyncStorage.getItem(KEY);
  if (!value) return null;
  try { return JSON.parse(value) as WalletStatus; } catch { return null; }
};
export const saveWalletStatus = (status: WalletStatus) => AsyncStorage.setItem(KEY, JSON.stringify(status));
export const removeWalletStatus = () => AsyncStorage.removeItem(KEY);

