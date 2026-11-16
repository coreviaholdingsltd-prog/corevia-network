/**
 * Prevent Preview/Development deployments from ever using live Paystack
 * credentials, and prevent Production from silently running against test mode.
 * Unknown deployment environments and unknown key formats fail closed.
 */
export function isPaystackKeyCompatibleWithDeployment(vercelEnv, secretKey) {
  if (typeof secretKey !== "string" || secretKey.length === 0) return false;

  const keyMode = secretKey.startsWith("sk_test_")
    ? "test"
    : secretKey.startsWith("sk_live_")
      ? "live"
      : null;

  if (keyMode === null) return false;
  if (vercelEnv === "production") return keyMode === "live";
  if (vercelEnv === "preview" || vercelEnv === "development" || vercelEnv == null || vercelEnv === "") {
    return keyMode === "test";
  }
  return false;
}
