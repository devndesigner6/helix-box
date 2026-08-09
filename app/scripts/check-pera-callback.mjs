import assert from "node:assert/strict";
import { parsePeraCallback } from "../lib/pera-callback.js";

const address = "AQYWNHO6QWB4AB4SHIVMNZL2QN2ZQIYYO3Z27DJCUOILZ43YGGZUIPAURY";
assert.deepEqual(
  parsePeraCallback(`helixbox://wallet-connected?address=${address}&network=Testnet`, "wallet-connected"),
  { address, network: "Testnet" },
);
console.log("Pera wallet callback is accepted by the HelixBox app");
