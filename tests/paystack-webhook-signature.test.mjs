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


test("accepts a valid timestamped Paystack signing-secret header", async () => {
  const { isValidPaystackSigningSecretSignature } = await import("../lib/paystack-webhook-signature.ts");
  const signingSecret = "whsec_test-secret";
  const timestamp = 1760270400;
  const digest = crypto.createHmac("sha512", signingSecret)
    .update(`${timestamp}.${body}`).digest("hex");
  const header = `t=${timestamp},v1=whk_test123:${digest}`;
  assert.equal(isValidPaystackSigningSecretSignature(body, header, signingSecret, timestamp), true);
});

test("accepts any matching v1 signature during secret rotation", async () => {
  const { isValidPaystackSigningSecretSignature } = await import("../lib/paystack-webhook-signature.ts");
  const signingSecret = "whsec_test-secret";
  const timestamp = 1760270400;
  const digest = crypto.createHmac("sha512", signingSecret)
    .update(`${timestamp}.${body}`).digest("hex");
  const header = `t=${timestamp},v1=whk_old:${"a".repeat(128)},v1=whk_new:${digest}`;
  assert.equal(isValidPaystackSigningSecretSignature(body, header, signingSecret, timestamp), true);
});

test("rejects expired, malformed, wrong-secret and modified-body timestamped signatures", async () => {
  const { isValidPaystackSigningSecretSignature } = await import("../lib/paystack-webhook-signature.ts");
  const signingSecret = "whsec_test-secret";
  const timestamp = 1760270400;
  const digest = crypto.createHmac("sha512", signingSecret)
    .update(`${timestamp}.${body}`).digest("hex");
  const validHeader = `t=${timestamp},v1=whk_test123:${digest}`;
  assert.equal(isValidPaystackSigningSecretSignature(body, validHeader, signingSecret, timestamp + 301), false);
  assert.equal(isValidPaystackSigningSecretSignature(body, validHeader, "wrong-secret", timestamp), false);
  assert.equal(isValidPaystackSigningSecretSignature(body + " ", validHeader, signingSecret, timestamp), false);
  assert.equal(isValidPaystackSigningSecretSignature(body, `t=x,v1=whk_test123:${digest}`, signingSecret, timestamp), false);
  assert.equal(isValidPaystackSigningSecretSignature(body, null, signingSecret, timestamp), false);
});
