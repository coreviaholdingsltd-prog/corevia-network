export type TillTransferEvent = "transfer.success" | "transfer.failed" | "transfer.reversed";
export type TillSettlementStatus = "PENDING" | "PROCESSING" | "REVIEW" | "SETTLED" | "FAILED" | "REVERSED";

const roundKsh = (value: number) => Math.round(value * 100) / 100;

export function evaluateCoreviaTillFloat(input: {
  balanceSubunits: number;
  walletLiabilitiesKsh: number;
  pendingPayoutsKsh: number;
  queuedTillSettlementsKsh: number;
  feeReserveKsh: number;
}) {
  const values = Object.values(input);
  if (values.some((value) => !Number.isFinite(value) || value < 0)) {
    return { ok: false, reason: "invalid_float_data" as const, availableKsh: null, requiredKsh: null };
  }
  if (input.feeReserveKsh <= 0) {
    return { ok: false, reason: "invalid_fee_reserve" as const, availableKsh: null, requiredKsh: null };
  }
  const availableKsh = Math.floor(input.balanceSubunits) / 100;
  const requiredKsh = roundKsh(
    input.walletLiabilitiesKsh +
    input.pendingPayoutsKsh +
    input.queuedTillSettlementsKsh +
    input.feeReserveKsh
  );
  return {
    ok: availableKsh >= requiredKsh,
    reason: availableKsh >= requiredKsh ? null : "insufficient_protected_float" as const,
    availableKsh,
    requiredKsh,
  };
}

export function matchesTillTransfer(
  expected: { reference: string; amountKsh: number; currency: string },
  actual: { reference?: string; amount?: number; currency?: string },
) {
  return actual.reference === expected.reference &&
    Number(actual.amount) === Math.round(expected.amountKsh * 100) &&
    String(actual.currency ?? "").toUpperCase() === expected.currency.toUpperCase();
}

export function resolveTillWebhookStatus(
  current: TillSettlementStatus,
  event: TillTransferEvent,
): TillSettlementStatus | null {
  if (event === "transfer.failed") {
    return current === "PROCESSING" || current === "REVIEW" ? "FAILED" : null;
  }
  if (event === "transfer.success") {
    return current === "PROCESSING" || current === "REVIEW" ? "SETTLED" : null;
  }
  // A late provider reversal is valid after a prior successful settlement.
  return current === "PROCESSING" || current === "REVIEW" || current === "SETTLED"
    ? "REVERSED"
    : null;
}
