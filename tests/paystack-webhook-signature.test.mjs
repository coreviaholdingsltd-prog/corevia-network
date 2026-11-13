import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { isValidPaystackSignature } from "../lib/paystack-webhook-signature.ts";

const secret = "test-secret-never-used-in-production";
const body = JSON.stringify({ event: "transfer.success", data: { reference: "test-ref" } });
const signature = crypto.createHmac("sha512", secret).update(body).digest("hex");

test("accepts a valid Paystack HMAC-SHA512 signature for the exact raw body", () => {
  assert.equal(isValidPaystackSignature(body, signature, secret), true);
});

test("rejects a signature when the raw body changes", () => {
  assert.equal(isValidPaystackSignature(body + " ", signature, secret), false);
});

test("rejects signatures created with a different secret", () => {
  const wrong = crypto.createHmac("sha512", "wrong-secret").update(body).digest("hex");
  assert.equal(isValidPaystackSignature(body, wrong, secret), false);
});

test("rejects missing, malformed, non-hex and incorrect-length signatures safely", () => {
  for (const candidate of [null, "", "not-a-signature", "g".repeat(128), "a".repeat(127), "💥".repeat(64)]) {
    assert.equal(isValidPaystackSignature(body, candidate, secret), false);
  }
});
