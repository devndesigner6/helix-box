import assert from "node:assert/strict";
import test from "node:test";
import { ALGORAND_TESTNET_CAIP2 } from "@x402/avm";

import { createX402Config } from "../src/x402-payment.ts";

const VALID_ALGORAND_ADDRESS = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";

test("keeps an explicit Testnet network and Testnet USDC asset", () => {
  const config = createX402Config({
    X402_NETWORK: "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
    X402_ASSET_ID: "10458941",
    X402_PAY_TO: VALID_ALGORAND_ADDRESS,
  });

  assert.equal(config.network, ALGORAND_TESTNET_CAIP2);
  assert.equal(config.asset, "10458941");
});

test("rejects placeholder payment addresses", () => {
  assert.throws(
    () => createX402Config({ X402_PAY_TO: "PLACEHOLDER_ALGO_ADDRESS" }),
    /X402_PAY_TO/
  );
});

test("rejects an ASA that does not belong to the selected network", () => {
  assert.throws(
    () => createX402Config({ X402_PAY_TO: VALID_ALGORAND_ADDRESS, X402_ASSET_ID: "31566704" }),
    /X402_ASSET_ID/
  );
});
