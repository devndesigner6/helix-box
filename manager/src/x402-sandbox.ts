/**
 * Retired: host-process code execution is intentionally not a HelixBox service.
 * The manager routes all x402 traffic to the paid relay endpoints before this
 * legacy branch can be reached.
 */
import { createX402Config } from "./x402-payment.js";

const config = createX402Config;

export const x402Config = {
  get network() { return config().network; },
  get asset() { return Number(config().asset); },
  get payTo() { return config().payTo; },
  get facilitatorUrl() { return config().facilitatorUrl; },
  priceMicroUSDC: 0,
};

export async function executeSandbox(): Promise<never> {
  throw new Error("Sandbox execution is retired. Use a separately deployed isolated runner.");
}
