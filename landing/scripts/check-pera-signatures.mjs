import assert from "node:assert/strict";
import { alignPeraSignatures } from "../src/pera-signatures.js";

const payment = new Uint8Array([1]);
assert.deepEqual(alignPeraSignatures([new Uint8Array([0]), payment], [1], [payment]), [null, payment]);
console.log("Pera signatures align with the x402 transaction group");
