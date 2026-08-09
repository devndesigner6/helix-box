import {
  USDC_MAINNET_ASA_ID,
  USDC_TESTNET_ASA_ID,
} from "@x402/avm";
import type { Network } from "@x402/core/types";

// GoPlausible advertises the canonical CAIP-2 identifiers below.  The
// currently published @x402/avm aliases omit the Algorand genesis-hash tail,
// which makes facilitator initialization fail before an unpaid request can
// receive its 402 response.
const ALGORAND_MAINNET_CAIP2 = "algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=" as Network;
const ALGORAND_TESTNET_CAIP2 = "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=" as Network;
const LEGACY_MAINNET_CAIP2 = "algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73k";
const LEGACY_TESTNET_CAIP2 = "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe";

export const CLI_HOURLY_PRICE_USDC = "$0.25";
export const PREMIUM_WEEKLY_PRICE_USDC = "$2.00";
export const CODEX_AGENT_PRICE_USDC = "$0.25";
export const CLI_HOURLY_ROUTE = "/v2/x402/cli/hour";
export const PREMIUM_WEEKLY_ROUTE = "/v2/x402/premium/week";
export const CODEX_AGENT_ROUTE = "/v2/x402/codex-agent";

export interface X402Config {
  network: Network;
  asset: string;
  payTo: string;
  facilitatorUrl: string;
}

type Environment = Record<string, string | undefined>;

function canonicalAlgorandNetwork(value: string): Network {
  if (value === ALGORAND_MAINNET_CAIP2 || value === LEGACY_MAINNET_CAIP2) return ALGORAND_MAINNET_CAIP2;
  if (value === ALGORAND_TESTNET_CAIP2 || value === LEGACY_TESTNET_CAIP2) return ALGORAND_TESTNET_CAIP2;
  throw new Error("X402_NETWORK must be Algorand Testnet or Mainnet");
}

export function createX402Config(env: Environment = process.env): X402Config {
  const rawNetwork = env.X402_NETWORK || ALGORAND_TESTNET_CAIP2;
  const network = canonicalAlgorandNetwork(rawNetwork);

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
