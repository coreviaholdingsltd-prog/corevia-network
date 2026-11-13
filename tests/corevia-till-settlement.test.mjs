import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateCoreviaTillFloat,
  matchesTillTransfer,
  resolveTillWebhookStatus,
} from "../lib/corevia-till-settlement.ts";

test("protects member wallet liabilities, pending payouts, company queue and fee reserve", () => {
  const result = evaluateCoreviaTillFloat({
    balanceSubunits: 2500000,
    walletLiabilitiesKsh: 10000,
    pendingPayoutsKsh: 5000,
    queuedTillSettlementsKsh: 9000,
    feeReserveKsh: 1000,
  });
  assert.deepEqual(result, {
    ok: true,
    reason: null,
    availableKsh: 25000,
    requiredKsh: 25000,
  });
});

test("blocks a Till transfer when protected float is short", () => {
  const result = evaluateCoreviaTillFloat({
    balanceSubunits: 2499999,
    walletLiabilitiesKsh: 10000,
    pendingPayoutsKsh: 5000,
    queuedTillSettlementsKsh: 9000,
    feeReserveKsh: 1000,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "insufficient_protected_float");
});

test("fails closed on negative, non-finite float values and missing fee reserve", () => {
  for (const input of [
    { balanceSubunits: -1, walletLiabilitiesKsh: 0, pendingPayoutsKsh: 0, queuedTillSettlementsKsh: 0, feeReserveKsh: 1 },
    { balanceSubunits: 100, walletLiabilitiesKsh: Number.NaN, pendingPayoutsKsh: 0, queuedTillSettlementsKsh: 0, feeReserveKsh: 1 },
    { balanceSubunits: 100, walletLiabilitiesKsh: 0, pendingPayoutsKsh: 0, queuedTillSettlementsKsh: 0, feeReserveKsh: 0 },
  ]) assert.equal(evaluateCoreviaTillFloat(input).ok, false);
});

test("matches Paystack transfer reference, amount in subunits and currency exactly", () => {
  const expected = { reference: "cvt-membership-1", amountKsh: 300, currency: "KES" };
  assert.equal(matchesTillTransfer(expected, { reference: expected.reference, amount: 30000, currency: "KES" }), true);
  assert.equal(matchesTillTransfer(expected, { reference: expected.reference, amount: 29999, currency: "KES" }), false);
  assert.equal(matchesTillTransfer(expected, { reference: "other", amount: 30000, currency: "KES" }), false);
  assert.equal(matchesTillTransfer(expected, { reference: expected.reference, amount: 30000, currency: "USD" }), false);
});

test("accepts successful transfer webhook only for processing or review records", () => {
  assert.equal(resolveTillWebhookStatus("PROCESSING", "transfer.success"), "SETTLED");
  assert.equal(resolveTillWebhookStatus("REVIEW", "transfer.success"), "SETTLED");
  assert.equal(resolveTillWebhookStatus("PENDING", "transfer.success"), null);
  assert.equal(resolveTillWebhookStatus("SETTLED", "transfer.success"), null);
});

test("marks failed transfers terminal only from processing or review", () => {
  assert.equal(resolveTillWebhookStatus("PROCESSING", "transfer.failed"), "FAILED");
  assert.equal(resolveTillWebhookStatus("REVIEW", "transfer.failed"), "FAILED");
  assert.equal(resolveTillWebhookStatus("SETTLED", "transfer.failed"), null);
});

test("accepts a late reversal after settlement and prevents duplicate reversals", () => {
  assert.equal(resolveTillWebhookStatus("SETTLED", "transfer.reversed"), "REVERSED");
  assert.equal(resolveTillWebhookStatus("PROCESSING", "transfer.reversed"), "REVERSED");
  assert.equal(resolveTillWebhookStatus("REVERSED", "transfer.reversed"), null);
});
