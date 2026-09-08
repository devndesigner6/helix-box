import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAssembleSessionStatus,
  createAssembledPayload,
} from "../src/assemble-session.ts";

const baseSession = {
  code: "PAIR123",
  createdAt: 100,
  expiresAt: 10_000,
  paidUntil: 5_000,
  password: "secret",
  appWs: {},
  cliWs: null,
  appAcked: false,
  cliAcked: false,
};

test("reports an externally paid session without requiring a wallet", () => {
  assert.deepEqual(buildAssembleSessionStatus(baseSession, 1_000), {
    code: "PAIR123",
    exists: true,
    paid: true,
    paidUntil: 5_000,
    expiresAt: 10_000,
    appConnected: true,
    cliConnected: false,
  });
});

test("does not report an expired entitlement as paid", () => {
  const status = buildAssembleSessionStatus(baseSession, 5_000);
  assert.equal(status.paid, false);
  assert.equal(status.exists, true);
});

test("replays the existing assembled credentials to a late socket", () => {
  assert.equal(
    createAssembledPayload(baseSession),
    JSON.stringify({ type: "assembled", code: "PAIR123", password: "secret" }),
  );
});
