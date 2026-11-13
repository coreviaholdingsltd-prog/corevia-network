import crypto from "node:crypto";

/**
 * Validate Paystack's HMAC-SHA512 signature.
 * Reject malformed hex before timingSafeEqual so untrusted input cannot
 * trigger a buffer-length exception and turn an authentication failure
 * into a server error.
 */
export function isValidPaystackSignature(
  rawBody: string,
  signature: string | null,
  secretKey: string,
): boolean {
  if (!signature || !/^[a-f0-9]{128}$/i.test(signature)) return false;

  const expected = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest();

  const received = Buffer.from(signature, "hex");
  return received.length === expected.length &&
    crypto.timingSafeEqual(received, expected);
}
