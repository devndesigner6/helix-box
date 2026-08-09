import { Hono, type Context } from "hono";
import { ExactAvmScheme } from "@x402/avm/exact/server";
import { bazaarResourceServerExtension, declareDiscoveryExtension } from "@x402-avm/extensions";
import { HTTPFacilitatorClient, x402ResourceServer } from "@x402/core/server";
import type { ResourceServerExtension } from "@x402/core/types";
import { paymentMiddleware } from "@x402/hono";
import {
  CLI_HOURLY_PRICE_USDC,
  CLI_HOURLY_ROUTE,
  PREMIUM_WEEKLY_PRICE_USDC,
  PREMIUM_WEEKLY_ROUTE,
  CODEX_AGENT_PRICE_USDC,
  CODEX_AGENT_ROUTE,
  type X402Config,
} from "./x402-payment.js";

export interface PurchasedSession {
  code: string;
  expiresAt: number;
}

interface X402AppOptions {
  config: X402Config;
  redeemSession: (code: string, expiresAt: number) => Promise<PurchasedSession>;
}

const sessionOutputSchema = {
  type: "object",
  properties: {
    code: { type: "string" },
    expiresAt: { type: "integer" },
  },
  required: ["code", "expiresAt"],
};

export function createX402App({ config, redeemSession }: X402AppOptions): Hono {
  const facilitator = new HTTPFacilitatorClient({ url: config.facilitatorUrl });
  const resourceServer = new x402ResourceServer(facilitator)
    .register(config.network, new ExactAvmScheme())
    .registerExtension(bazaarResourceServerExtension as unknown as ResourceServerExtension);

  const paymentOptions = (price: string, description: string) => ({
    accepts: {
      scheme: "exact" as const,
      price,
      network: config.network,
      payTo: config.payTo,
      maxTimeoutSeconds: 300,
      extra: { asset: config.asset, tag: "x402-global-challenge" },
    },
    description,
    mimeType: "application/json",
    extensions: declareDiscoveryExtension({
      bodyType: "json",
      output: { schema: sessionOutputSchema },
    }),
  });

  const app = new Hono();
  app.use("*", async (c, next) => {
    await next();
    c.header("Access-Control-Allow-Origin", "*");
    c.header("Access-Control-Expose-Headers", "payment-required, x-payment-required, payment-response, x-payment-response");
  });
  app.use(
    paymentMiddleware(
      {
        [`POST ${CLI_HOURLY_ROUTE}`]: paymentOptions(
          CLI_HOURLY_PRICE_USDC,
          "One hour of HelixBox CLI-to-mobile relay access.",
        ),
        [`POST ${PREMIUM_WEEKLY_ROUTE}`]: paymentOptions(
          PREMIUM_WEEKLY_PRICE_USDC,
          "Seven days of HelixBox premium CLI-to-mobile relay access.",
        ),
        [`POST ${CODEX_AGENT_ROUTE}`]: paymentOptions(
          CODEX_AGENT_PRICE_USDC,
          "Run Codex Agent code diagnostics and sync workspace.",
        ),
      },
      resourceServer,
    ),
  );
  const redeem = (durationMs: number) => async (c: Context) => {
    const body = await c.req.json<{ code?: string }>().catch((): { code?: string } => ({}));
    const code = (body.code || "").trim();
    if (!code) return c.json({ error: "CLI pairing code is required" }, 400);
    return c.json(await redeemSession(code, Date.now() + durationMs));
  };
  app.post(CLI_HOURLY_ROUTE, redeem(60 * 60 * 1000));
  app.post(PREMIUM_WEEKLY_ROUTE, redeem(7 * 24 * 60 * 60 * 1000));
  app.post(CODEX_AGENT_ROUTE, redeem(2 * 60 * 1000));
  return app;
}
