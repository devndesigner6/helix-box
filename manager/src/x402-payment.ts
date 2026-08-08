import {
  ALGORAND_MAINNET_CAIP2,
  ALGORAND_TESTNET_CAIP2,
  USDC_MAINNET_ASA_ID,
  USDC_TESTNET_ASA_ID,
  normalizeAlgorandNetwork,
} from "@x402/avm";
import type { Network } from "@x402/core/types";

export const CLI_HOURLY_PRICE_USDC = "$0.25";
export const PREMIUM_WEEKLY_PRICE_USDC = "$2.00";

export interface X402Config {
  network: Network;
  asset: string;
  payTo: string;
  facilitatorUrl: string;
}

type Environment = Record<string, string | undefined>;

export function createX402Config(env: Environment = process.env): X402Config {
  const rawNetwork = env.X402_NETWORK || ALGORAND_TESTNET_CAIP2;
  const network = normalizeAlgorandNetwork(rawNetwork);
  if (network !== ALGORAND_TESTNET_CAIP2 && network !== ALGORAND_MAINNET_CAIP2) {
    throw new Error("X402_NETWORK must be Algorand Testnet or Mainnet");
  }

  const expectedAsset = network === ALGORAND_MAINNET_CAIP2 ? USDC_MAINNET_ASA_ID : USDC_TESTNET_ASA_ID;
  if (env.X402_ASSET_ID && env.X402_ASSET_ID !== expectedAsset) {
    throw new Error(`X402_ASSET_ID must be ${expectedAsset} for the selected network`);
  }

  const payTo = (env.X402_PAY_TO || "").trim();
  if (!/^[A-Z2-7]{58}$/.test(payTo)) {
    throw new Error("X402_PAY_TO must be a valid Algorand address");
  }

  const facilitatorUrl = (env.X402_FACILITATOR_URL || "https://facilitator.goplausible.xyz").replace(/\/+$/, "");
  if (!/^https:\/\//.test(facilitatorUrl)) {
    throw new Error("X402_FACILITATOR_URL must use HTTPS");
  }

  return { network, asset: expectedAsset, payTo, facilitatorUrl };
}
