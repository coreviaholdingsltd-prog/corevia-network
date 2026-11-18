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


/**
 * Validate Paystack's timestamped webhook-signing-secret format.
 * Header format: t=<unix-seconds>,v1=<whk_key_id>:<sha512-hex>
 */
export function isValidPaystackSigningSecretSignature(
  rawBody: string,
  header: string | null,
  signingSecret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  if (!header || !signingSecret) return false;

  let timestamp: number | null = null;
  const signatures: string[] = [];

  for (const part of header.split(",")) {
    const value = part.trim();
    if (value.startsWith("t=")) {
      if (timestamp !== null || !/^t=\d+$/.test(value)) return false;
      timestamp = Number(value.slice(2));
    } else if (value.startsWith("v1=")) {
      const match = /^v1=(whk_[A-Za-z0-9_-]+):([a-f0-9]{128})$/i.exec(value);
      if (match) signatures.push(match[2]);
    }
  }

  if (
    timestamp === null ||
    !Number.isSafeInteger(timestamp) ||
    Math.abs(nowSeconds - timestamp) > 300 ||
    signatures.length === 0
  ) return false;

  const expected = crypto
    .createHmac("sha512", signingSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest();

  return signatures.some((signature) => {
    const received = Buffer.from(signature, "hex");
    return received.length === expected.length &&
      crypto.timingSafeEqual(expected, received);
  });
}
