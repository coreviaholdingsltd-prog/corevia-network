const REQUIRED_PAYOUT_FLAGS = [
  "COREVIA_WITHDRAWALS_ENABLED",
  "COREVIA_PAYSTACK_WITHDRAWALS_ENABLED",
  "COREVIA_PAYSTACK_FLOAT_READY",
  "COREVIA_PAYSTACK_PAYOUT_PROCESSOR_ENABLED",
  "COREVIA_PAYSTACK_OTP_DISABLED",
];

/**
 * Fail closed unless the code-level lifecycle approval and every operational
 * switch are explicitly enabled. Missing values are always treated as false.
 */
export function isPaystackPayoutEnabled(env, lifecycleVerified) {
  return lifecycleVerified === true &&
    REQUIRED_PAYOUT_FLAGS.every((name) => env[name] === "true");
}


/** Explicit production approval is required after all payout lifecycle checks. */
export function isPayoutLifecycleVerified(env) {
  return env.COREVIA_PAYOUT_LIFECYCLE_VERIFIED === "true";
}


/**
 * Conservatively compare Paystack's available KES balance with member wallet
 * liabilities plus in-flight payout obligations. Invalid/missing data fails closed.
 */
export function evaluatePaystackFloat({ balanceSubunits, walletLiabilitiesKsh, pendingPayoutsKsh }) {
  const rawValues = [balanceSubunits, walletLiabilitiesKsh, pendingPayoutsKsh];
  if (rawValues.some((value) => value === null || value === undefined || value === "")) {
    return { ready: false, availableKsh: null, requiredKsh: null };
  }
  const values = rawValues.map(Number);
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    return { ready: false, availableKsh: null, requiredKsh: null };
  }
  const [balance, wallets, pending] = values;
  const availableKsh = Math.floor(balance) / 100;
  const requiredKsh = Math.round((wallets + pending) * 100) / 100;
  return { ready: availableKsh >= requiredKsh, availableKsh, requiredKsh };
}
