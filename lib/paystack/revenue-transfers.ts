import { prisma } from "@/lib/prisma";
import {
  createKenyaMpesaTillRecipient,
  getPaystackKesBalanceSubunits,
  initiateKenyaMpesaTransfer,
  verifyPaystackTransfer,
} from "@/lib/paystack/transfers";

const POOL_LOCK = "corevia-paystack-client-funds-pool";
const PROVIDER_FEE_AND_SAFETY_RESERVE_SUBUNITS = 20000;
const MIN_TILL_TRANSFER_KSH = 10;
const MAX_BATCH_SOURCES = 100;

type RevenueSource = {
  id: string;
  reference: string;
  amount: unknown;
  type: "WALLET_TRANSFER_FEE" | "WITHDRAWAL_FEE" | "ADJUSTMENT";
};

function attemptDescription(reference: string, amountKsh: number, attempt: number) {
  return `COREVIA_TILL_ATTEMPT|${reference}|${amountKsh.toFixed(2)}|${attempt}`;
}

function parseAttempt(description: string | null | undefined) {
  if (!description?.startsWith("COREVIA_TILL_ATTEMPT|")) return null;
  const [, reference, amount, attempt] = description.split("|");
  if (!reference || !/^cvrev_[a-z0-9]{24,40}$/.test(reference)) return null;
  const amountKsh = Number(amount);
  const attemptNumber = Number(attempt);
  if (!Number.isFinite(amountKsh) || amountKsh <= 0 || !Number.isInteger(attemptNumber)) return null;
  return { reference, amountKsh, attemptNumber };
}

async function isEligibleSource(source: RevenueSource) {
  if (source.type !== "WITHDRAWAL_FEE") return true;
  const withdrawalReference = source.reference.replace(/-FEE-COREVIA$/, "");
  if (withdrawalReference === source.reference) return false;
  const withdrawal = await prisma.withdrawal.findUnique({
    where: { reference: withdrawalReference },
    select: { status: true },
  });
  return withdrawal?.status === "PAID";
}

async function getPendingRevenueSources() {
  const sources = await prisma.ledgerEntry.findMany({
    where: {
      ownerType: "COREVIA",
      amount: { gt: 0 },
      OR: [
        { type: "WALLET_TRANSFER_FEE" },
        { type: "WITHDRAWAL_FEE", reference: { endsWith: "-FEE-COREVIA" } },
        { type: "ADJUSTMENT", reference: { startsWith: "ACADEMY-" } },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: MAX_BATCH_SOURCES,
    select: { id: true, reference: true, amount: true, type: true },
  });

  const eligible: RevenueSource[] = [];
  for (const source of sources) {
    if (!(await isEligibleSource(source as RevenueSource))) continue;
    const markers = await prisma.ledgerEntry.findMany({
      where: { ownerType: "COREVIA", reference: { startsWith: `${source.reference}-TILL-` } },
      select: { reference: true, description: true },
    });
    if (markers.some((entry) => entry.reference === `${source.reference}-TILL-PAID`)) continue;
    const hasInFlight = markers.some((entry) => parseAttempt(entry.description) !== null);
    if (hasInFlight) continue;
    eligible.push(source as RevenueSource);
  }
  return eligible;
}

/**
 * Move only earned Corevia fees to the company's Paystack M-PESA Till recipient.
 * The shared Paystack balance is protected by the same advisory lock as member
 * withdrawals. All outstanding member wallet balances and processing payouts
 * remain reserved before any company revenue is transferred.
 */
export async function dispatchCoreviaRevenueTransfers() {
  if (
    process.env.COREVIA_TILL_FEE_TRANSFER_READY !== "true" ||
    process.env.COREVIA_PAYSTACK_NO_OTP_CONFIRMED !== "true"
  ) {
    return { dispatched: 0, reason: "revenue_transfer_not_enabled" as const };
  }

  const sources = await getPendingRevenueSources();
  if (sources.length === 0) return { dispatched: 0, reason: "no_pending_revenue" as const };

  // Till transfers below KES 10 cannot be sent individually; batching combines
  // small earned fees without ever including client principal.
  const totalKsh = Number(sources.reduce((sum, source) => sum + Number(source.amount), 0).toFixed(2));
  if (totalKsh < MIN_TILL_TRANSFER_KSH) {
    return { dispatched: 0, reason: "below_minimum_till_transfer" as const };
  }

  const recipient = await createKenyaMpesaTillRecipient();
  const providerReference = `cvrev_${cryptoRandomHex(16)}`;
  const batchAccountReference = `COREVIA-${Date.now()}`;

  const reserved = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${POOL_LOCK}))::text AS lock_acquired`;

    const walletTotals = await tx.wallet.aggregate({ _sum: { balance: true } });
    const processingTotals = await tx.withdrawal.aggregate({
      where: { status: "PROCESSING" },
      _sum: { netAmount: true },
    });
    const clientLiabilitiesKsh =
      Number(walletTotals._sum.balance ?? 0) +
      Number(processingTotals._sum.netAmount ?? 0);

    const balanceSubunits = await getPaystackKesBalanceSubunits();
    const requiredSubunits =
      Math.round((clientLiabilitiesKsh + totalKsh) * 100) +
      PROVIDER_FEE_AND_SAFETY_RESERVE_SUBUNITS;
    if (balanceSubunits < requiredSubunits) return false;

    // Recheck all source markers while holding the pool lock. This makes
    // concurrent webhook/cron invocations idempotent.
    const currentSources = await tx.ledgerEntry.findMany({
      where: { id: { in: sources.map((source) => source.id) }, ownerType: "COREVIA", amount: { gt: 0 } },
      select: { id: true, reference: true, amount: true, type: true },
    });
    let batchTotal = 0;
    const toReserve: Array<{ source: RevenueSource; attempt: number }> = [];
    for (const source of currentSources as RevenueSource[]) {
      if (source.type === "WITHDRAWAL_FEE") {
        const withdrawalReference = source.reference.replace(/-FEE-COREVIA$/, "");
        const withdrawal = await tx.withdrawal.findUnique({
          where: { reference: withdrawalReference },
          select: { status: true },
        });
        if (withdrawal?.status !== "PAID") continue;
      }
      const markers = await tx.ledgerEntry.findMany({
        where: { ownerType: "COREVIA", reference: { startsWith: `${source.reference}-TILL-` } },
        select: { reference: true, description: true },
      });
      if (markers.some((entry) => entry.reference === `${source.reference}-TILL-PAID`)) continue;
      if (markers.some((entry) => parseAttempt(entry.description) !== null)) continue;
      const attempts = markers
        .map((entry) => Number(entry.reference.match(/-TILL-FAILED-A(\\d+)$/)?.[1] ?? 0))
        .filter(Number.isInteger);
      const attempt = Math.max(0, ...attempts) + 1;
      toReserve.push({ source, attempt });
      batchTotal += Number(source.amount);
    }
    if (toReserve.length === 0 || batchTotal < MIN_TILL_TRANSFER_KSH) return false;

    const description = (attempt: number) => attemptDescription(providerReference, batchTotal, attempt);
    await tx.ledgerEntry.createMany({
      data: toReserve.map(({ source, attempt }) => ({
        ownerType: "COREVIA",
        amount: 0,
        type: "ADJUSTMENT",
        reference: `${source.reference}-TILL-A${attempt}`,
        description: description(attempt),
      })),
      skipDuplicates: true,
    });
    return true;
  }, { maxWait: 30000, timeout: 60000 });

  if (!reserved) return { dispatched: 0, reason: "client_funds_protected_or_below_minimum" as const };

  try {
    await initiateKenyaMpesaTransfer({
      recipientCode: recipient.recipient_code,
      amountKsh: totalKsh,
      reference: providerReference,
      reason: "Corevia earned transaction and Academy fees to Till 6959300",
      accountReference: batchAccountReference,
    });
    return { dispatched: 1, reference: providerReference, amountKsh: totalKsh };
  } catch (error) {
    // The attempt remains reserved because a timeout may occur after Paystack
    // accepted the transfer. The reconciliation worker verifies this reference
    // before any retry is allowed.
    console.error("Corevia Till revenue transfer outcome is uncertain:", error);
    return { dispatched: 1, reference: providerReference, amountKsh: totalKsh, outcome: "reconciling" as const };
  }
}

export async function settleCoreviaRevenueTransfer(args: {
  reference: string;
  status: "success" | "failed" | "reversed";
  amountSubunits: number;
  currency: string;
}) {
  if (!/^cvrev_[a-z0-9]{24,40}$/.test(args.reference) ||
      !Number.isSafeInteger(args.amountSubunits) || args.amountSubunits <= 0 ||
      args.currency !== "KES") {
    throw new Error("Invalid Corevia Till revenue transfer details.");
  }

  return prisma.$transaction(async (tx) => {
    const attempts = await tx.ledgerEntry.findMany({
      where: {
        ownerType: "COREVIA",
        description: { startsWith: `COREVIA_TILL_ATTEMPT|${args.reference}|` },
      },
      select: { reference: true, amount: true, description: true },
    });
    if (attempts.length === 0) return { updated: false, reason: "unmatched" as const };
    const totalSubunits = Math.round(attempts.reduce((sum, entry) => sum + Number(entry.amount), 0) * 100);
    if (totalSubunits !== args.amountSubunits) throw new Error("Corevia Till transfer amount does not match its reserved revenue batch.");

    const success = args.status === "success";
    const markerRows = attempts.map((entry) => {
      const sourceReference = entry.reference.replace(/-TILL-A\\d+$/, "");
      const attempt = parseAttempt(entry.description)?.attemptNumber ?? 1;
      return {
        ownerType: "COREVIA" as const,
        amount: 0,
        type: "ADJUSTMENT" as const,
        reference: success ? `${sourceReference}-TILL-PAID` : `${sourceReference}-TILL-FAILED-A${attempt}`,
        description: success
          ? `Corevia revenue successfully transferred to Till 6959300; Paystack reference ${args.reference}`
          : `Paystack revenue transfer ${args.status}; eligible for automated retry; reference ${args.reference}`,
      };
    });
    await tx.ledgerEntry.createMany({ data: markerRows, skipDuplicates: true });
    return { updated: true, status: success ? "PAID" as const : "FAILED" as const, sourceCount: attempts.length };
  });
}

export async function reconcileCoreviaRevenueTransfers() {
  const attempts = await prisma.ledgerEntry.findMany({
    where: { ownerType: "COREVIA", description: { startsWith: "COREVIA_TILL_ATTEMPT|" } },
    orderBy: { createdAt: "asc" },
    take: 100,
    select: { description: true },
  });
  const references = [...new Set(attempts.map((entry) => parseAttempt(entry.description)?.reference).filter((value): value is string => Boolean(value)))];
  let checked = 0;
  let settled = 0;
  let inconclusive = 0;
  let errors = 0;

  for (const reference of references) {
    const alreadySettled = await prisma.ledgerEntry.findFirst({
      where: {
        ownerType: "COREVIA",
        description: { contains: reference },
        OR: [
          { reference: { endsWith: "-TILL-PAID" } },
          { reference: { contains: "-TILL-FAILED-A" } },
        ],
      },
      select: { id: true },
    });
    if (alreadySettled) continue;
    checked += 1;
    try {
      const transfer = await verifyPaystackTransfer(reference);
      if (transfer.reference !== reference || transfer.currency !== "KES" ||
          !Number.isSafeInteger(transfer.amount) || transfer.amount <= 0) {
        throw new Error("Paystack returned mismatched Corevia revenue transfer details.");
      }
      if (transfer.status === "success" || transfer.status === "failed" || transfer.status === "reversed") {
        const result = await settleCoreviaRevenueTransfer({
          reference,
          status: transfer.status,
          amountSubunits: transfer.amount,
          currency: transfer.currency,
        });
        if (result.updated) settled += 1;
      } else {
        inconclusive += 1;
      }
    } catch (error) {
      errors += 1;
      console.error("Corevia Till revenue reconciliation failed:", {
        reference,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  return { checked, settled, inconclusive, errors };
}

function cryptoRandomHex(bytes: number) {
  return Array.from({ length: bytes }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("");
}
