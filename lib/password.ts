import crypto from "crypto";

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto.scryptSync(
    password,
    salt,
    64
  ).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  stored: string
): boolean {
  const [salt, storedHash] = stored.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = crypto.scryptSync(
    password,
    salt,
    64
  ).toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}