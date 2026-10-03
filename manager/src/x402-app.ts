import { Hono, type Context } from "hono";
import { ExactAvmScheme } from "@x402/avm/exact/server";
import { bazaarResourceServerExtension } from "@x402-avm/extensions";
import { HTTPFacilitatorClient, x402ResourceServer } from "@x402/core/server";
import type { ResourceServerExtension } from "@x402/core/types";
import { paymentMiddleware } from "@x402/hono";
import {
  CLI_HOURLY_PRICE_USDC,
  CLI_HOURLY_ROUTE,
  PREMIUM_WEEKLY_PRICE_USDC,
  PREMIUM_WEEKLY_ROUTE,
  AGENT_SESSION_1HOUR_PRICE_USDC,
  AGENT_SESSION_1HOUR_ROUTE,
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
  sessionExists: (code: string) => boolean;
}

const sessionInputSchema = {
  type: "object",
  properties: {
    code: {
      type: "string",
      minLength: 1,
      description: "CLI session code or pairing identifier",
    },
  },
  required: ["code"],
  additionalProperties: false,
};

const sessionOutputSchema = {
  type: "object",
  properties: {
    code: { type: "string" },
    expiresAt: { type: "integer" },
  },
  required: ["code", "expiresAt"],
};

const merchantExtension = {
  info: {
    name: "HelixBox",
    description: "Use your full development environment from your phone with time-bound, micro-billed agent sessions.",
    url: "https://helix-box.vercel.app",
    website: "https://helix-box.vercel.app",
    logo: "https://helix-box.vercel.app/helixbox.png",
    categories: [
      "developer-tools",
      "cli",
      "mobile-ide",
      "agent-sessions",
    ],
  },
  schema: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      url: { type: "string", format: "uri" },
      website: { type: "string", format: "uri" },
      logo: { type: "string", format: "uri" },
      categories: { type: "array", items: { type: "string" } },
    },
    required: ["name"],
  },
};

export function createX402App({ config, redeemSession, sessionExists }: X402AppOptions): Hono {
  const facilitator = new HTTPFacilitatorClient({ url: config.facilitatorUrl });
  const merchantResourceServerExtension: ResourceServerExtension = {
    key: "x402-merchant",
  };
  const resourceServer = new x402ResourceServer(facilitator)
    .register(config.network, new ExactAvmScheme())
    .registerExtension(bazaarResourceServerExtension as unknown as ResourceServerExtension)
    .registerExtension(merchantResourceServerExtension);

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
    extensions: {
      bazaar: {
        info: {
          name: "HelixBox",
          description,
          tags: ["x402-global-challenge", "cli", "mobile-ide", "agent-sessions"],
          input: {
            type: "http" as const,
            method: "POST" as const,
            bodyType: "json" as const,
            body: {
              code: "helixbox-agent-session-pass",
            },
          },
          output: {
            type: "json",
            example: {
              code: "helixbox-agent-session-pass",
              expiresAt: 1790700841000,
            },
          },
        },
        schema: {
          $schema: "https://json-schema.org/draft/2020-12/schema",
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            input: {
              type: "object",
              properties: {
                type: { type: "string", const: "http" },
                method: { type: "string", enum: ["POST"] },
                bodyType: { type: "string", enum: ["json", "form-data", "text"] },
                body: sessionInputSchema,
              },
              required: ["type", "method", "bodyType", "body"],
              additionalProperties: false,
            },
            output: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["json"] },
                example: sessionOutputSchema,
              },
              required: ["type", "example"],
            },
          },
          required: ["input"],
        },
      },
      "x402-merchant": merchantExtension,
    },
  });

  const app = new Hono();
  app.use("*", async (c, next) => {
    await next();
    c.header("Access-Control-Allow-Origin", "*");
    c.header("Access-Control-Expose-Headers", "payment-required, x-payment-required, payment-response, x-payment-response");
    if (c.res.status === 402) {
      const authHeader = c.res.headers.get("payment-required") || c.res.headers.get("x-payment-required");
      if (authHeader) {
        try {
          const decoded = JSON.parse(Buffer.from(authHeader, "base64").toString("utf-8"));
          const newHeaders = new Headers(c.res.headers);
          newHeaders.set("Content-Type", "application/json");
          c.res = new Response(JSON.stringify(decoded, null, 2), {
            status: 402,
            headers: newHeaders,
          });
        } catch {
          // ignore decode error
        }
      }
    }
  });
  app.use(
    paymentMiddleware(
      {
        [`POST ${CLI_HOURLY_ROUTE}`]: paymentOptions(
          CLI_HOURLY_PRICE_USDC,
          "One hour of HelixBox agent session access.",
        ),
        [`POST ${PREMIUM_WEEKLY_ROUTE}`]: paymentOptions(
          PREMIUM_WEEKLY_PRICE_USDC,
          "Seven days of HelixBox premium agent session access.",
        ),
        [`POST ${AGENT_SESSION_1HOUR_ROUTE}`]: paymentOptions(
          AGENT_SESSION_1HOUR_PRICE_USDC,
          "One hour of HelixBox AI agent session and remote CLI access.",
        ),
        [`POST ${CODEX_AGENT_ROUTE}`]: paymentOptions(
          AGENT_SESSION_1HOUR_PRICE_USDC,
          "One hour of HelixBox AI agent session and remote CLI access.",
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
  app.post(AGENT_SESSION_1HOUR_ROUTE, redeem(60 * 60 * 1000));
  app.post(CODEX_AGENT_ROUTE, redeem(60 * 60 * 1000));
  return app;
}
