import test from "node:test";
import assert from "node:assert/strict";
import { isPaystackKeyCompatibleWithDeployment } from "../lib/paystack-key-environment.mjs";

test("Preview accepts only a test-mode Paystack secret", () => {
  assert.equal(isPaystackKeyCompatibleWithDeployment("preview", "sk_test_example"), true);
  assert.equal(isPaystackKeyCompatibleWithDeployment("preview", "sk_live_example"), false);
});

test("Development accepts only a test-mode Paystack secret", () => {
  assert.equal(isPaystackKeyCompatibleWithDeployment("development", "sk_test_example"), true);
  assert.equal(isPaystackKeyCompatibleWithDeployment(undefined, "sk_test_example"), true);
  assert.equal(isPaystackKeyCompatibleWithDeployment("development", "sk_live_example"), false);
});

test("Production accepts only a live-mode Paystack secret", () => {
  assert.equal(isPaystackKeyCompatibleWithDeployment("production", "sk_live_example"), true);
  assert.equal(isPaystackKeyCompatibleWithDeployment("production", "sk_test_example"), false);
});

test("Unknown environments, missing keys, and unknown key formats fail closed", () => {
  for (const [environment, key] of [
    ["staging", "sk_test_example"],
    ["production", ""],
    ["preview", "pk_test_example"],
    ["preview", "not-a-paystack-key"],
    ["preview", null],
  ]) {
    assert.equal(isPaystackKeyCompatibleWithDeployment(environment, key), false);
  }
});
