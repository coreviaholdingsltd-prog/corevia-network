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
