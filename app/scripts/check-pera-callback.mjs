import assert from "node:assert/strict";
import { parsePeraCallback } from "../lib/pera-callback.js";

const address = "AQYWNHO6QWB4AB4SHIVMNZL2QN2ZQIYYO3Z27DJCUOILZ43YGGZUIPAURY";
assert.deepEqual(
  parsePeraCallback(`helixbox://wallet-connected?address=${address}&network=Testnet`, "wallet-connected"),
  { address, network: "Testnet" },
);
assert.deepEqual(
  parsePeraCallback(`helixbox://payment-complete?status=paid&code=pairing-code&address=${address}&network=Mainnet`, "payment-complete", "pairing-code"),
  { address, network: "Mainnet" },
);
console.log("Pera wallet callback is accepted by the HelixBox app");
