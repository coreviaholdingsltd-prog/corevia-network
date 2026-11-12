import test from "node:test";
import assert from "node:assert/strict";
import { isPaystackPayoutEnabled, isPayoutLifecycleVerified } from "../lib/paystack-payout-guard.mjs";

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


test("payout lifecycle approval requires the exact explicit production flag", () => {
  assert.equal(isPayoutLifecycleVerified({}), false);
  assert.equal(isPayoutLifecycleVerified({ COREVIA_PAYOUT_LIFECYCLE_VERIFIED: "false" }), false);
  assert.equal(isPayoutLifecycleVerified({ COREVIA_PAYOUT_LIFECYCLE_VERIFIED: "TRUE" }), false);
  assert.equal(isPayoutLifecycleVerified({ COREVIA_PAYOUT_LIFECYCLE_VERIFIED: "true" }), true);
});
