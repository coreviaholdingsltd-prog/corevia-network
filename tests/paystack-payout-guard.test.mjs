import test from "node:test";
import assert from "node:assert/strict";
import {
  isPaystackPayoutEnabled,
  isPayoutLifecycleVerified,
  isPaystackPreviewTestMode,
  evaluatePaystackFloat,
} from "../lib/paystack-payout-guard.mjs";

const enabledEnvironment = {
  COREVIA_WITHDRAWALS_ENABLED: "true",
  COREVIA_PAYSTACK_WITHDRAWALS_ENABLED: "true",
  COREVIA_PAYSTACK_FLOAT_READY: "true",
  COREVIA_PAYSTACK_PAYOUT_PROCESSOR_ENABLED: "true",
  COREVIA_PAYSTACK_OTP_DISABLED: "true",
};

test("payouts remain disabled when code-level lifecycle approval is false", () => {
  assert.equal(isPaystackPayoutEnabled(enabledEnvironment, false), false);
});

test("payouts remain disabled when any required operational flag is absent", () => {
  for (const name of Object.keys(enabledEnvironment)) {
    const env = { ...enabledEnvironment };
    delete env[name];
    assert.equal(isPaystackPayoutEnabled(env, true), false, name);
  }
});

test("payouts remain disabled when any required operational flag is false", () => {
  for (const name of Object.keys(enabledEnvironment)) {
    const env = { ...enabledEnvironment, [name]: "false" };
    assert.equal(isPaystackPayoutEnabled(env, true), false, name);
  }
});

test("payouts enable only when lifecycle approval and every flag are true", () => {
  assert.equal(isPaystackPayoutEnabled(enabledEnvironment, true), true);
});

test("payout flags require the exact string true", () => {
  const env = { ...enabledEnvironment, COREVIA_PAYSTACK_OTP_DISABLED: "TRUE" };
  assert.equal(isPaystackPayoutEnabled(env, true), false);
});

test("payout lifecycle approval requires the exact explicit flag", () => {
  assert.equal(isPayoutLifecycleVerified({}), false);
  assert.equal(isPayoutLifecycleVerified({ COREVIA_PAYOUT_LIFECYCLE_VERIFIED: "false" }), false);
  assert.equal(isPayoutLifecycleVerified({ COREVIA_PAYOUT_LIFECYCLE_VERIFIED: "TRUE" }), false);
  assert.equal(isPayoutLifecycleVerified({ COREVIA_PAYOUT_LIFECYCLE_VERIFIED: "true" }), true);
});

test("Preview sandbox mode requires Preview, explicit test mode, and a test key", () => {
  const env = { COREVIA_PAYOUT_TEST_MODE_ENABLED: "true" };
  assert.equal(isPaystackPreviewTestMode(env, "preview", "sk_test_example"), true);
  assert.equal(isPaystackPreviewTestMode(env, "production", "sk_test_example"), false);
  assert.equal(isPaystackPreviewTestMode(env, "preview", "sk_live_example"), false);
  assert.equal(isPaystackPreviewTestMode({ ...env, COREVIA_PAYOUT_TEST_MODE_ENABLED: "false" }, "preview", "sk_test_example"), false);
  assert.equal(isPaystackPreviewTestMode(env, undefined, "sk_test_example"), false);
});

test("Preview sandbox exception does not override the operational payout flags", () => {
  const sandboxEnv = { ...enabledEnvironment, COREVIA_PAYOUT_TEST_MODE_ENABLED: "true" };
  const sandboxApproved = isPaystackPreviewTestMode(sandboxEnv, "preview", "sk_test_example");
  assert.equal(isPaystackPayoutEnabled(sandboxEnv, sandboxApproved), true);
  assert.equal(isPaystackPayoutEnabled({ ...sandboxEnv, COREVIA_PAYSTACK_FLOAT_READY: "false" }, sandboxApproved), false);
});

test("Paystack float must cover member wallets and in-flight payouts", () => {
  assert.deepEqual(evaluatePaystackFloat({
    balanceSubunits: 25000000,
    walletLiabilitiesKsh: 200000,
    pendingPayoutsKsh: 50000,
  }), { ready: true, availableKsh: 250000, requiredKsh: 250000 });
  assert.equal(evaluatePaystackFloat({
    balanceSubunits: 24999999,
    walletLiabilitiesKsh: 200000,
    pendingPayoutsKsh: 50000,
  }).ready, false);
});

test("missing or invalid Paystack float data fails closed", () => {
  assert.equal(evaluatePaystackFloat({
    balanceSubunits: null,
    walletLiabilitiesKsh: 0,
    pendingPayoutsKsh: 0,
  }).ready, false);
  assert.equal(evaluatePaystackFloat({
    balanceSubunits: 100000,
    walletLiabilitiesKsh: -1,
    pendingPayoutsKsh: 0,
  }).ready, false);
});
