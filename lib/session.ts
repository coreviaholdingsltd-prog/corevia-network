import crypto from "crypto";

const COOKIE_NAME = "corevia_session";
const SESSION_DAYS = 7;

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured.");
  }

  return secret;
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("hex");
}

export function createSession(userId: string) {
  const payload = JSON.stringify({
    userId,
    expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  });

  const encoded = Buffer.from(payload).toString("base64url");

  return `${encoded}.${sign(encoded)}`;
}

export function verifySession(token: string | undefined) {
  if (!token) return null;

  const [encoded, signature] = token.split(".");

  if (!encoded || !signature) return null;

  const expected = sign(encoded);

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    );

    if (!payload.userId || Date.now() > payload.expiresAt) {
      return null;
    }

    return {
      userId: String(payload.userId),
    };
  } catch {
    return null;
  }
}

export const sessionCookieName = COOKIE_NAME;