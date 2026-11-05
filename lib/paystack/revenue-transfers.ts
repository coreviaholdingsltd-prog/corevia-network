import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import {
  createKenyaMpesaTillRecipient,
  getPaystackKesBalanceSubunits,
  initiateKenyaMpesaTransfer,
  verifyPaystackTransfer,
} from "@/lib/paystack/transfers";

const POOL_LOCK = "corevia-paystack-client-funds-pool";
const FEE_AND_SAFETY_RESERVE_SUBUNITS = 40000;
const MIN_TILL_TRANSFER_KSH = 10;
const MAX_BATCH_SOURCES = 100;

type RevenueSource = {
  id: string;
  reference: string;
  amount: unknown;
  type: "WALLET_TRANSFER_FEE" | "WITHDRAWAL_FEE" | "ADJUSTMENT";
};

function parseAttempt(description: string | null | undefined) {
  if (!description?.startsWith("COREVIA_TILL_ATTEMPT|")) return null;
  const [, reference, batchTotal, attempt, sourceAmount] = description.split("|");
  if (!reference || !/^cvrev_[a-f0-9]{32}$/.test(reference)) return null;
  const batchTotalKsh = Number(batchTotal);
  const amountKsh = Number(sourceAmount);
  const attemptNumber = Number(attempt);
  if (!Number.isFinite(batchTotalKsh) || batchTotalKsh <= 0 ||
      !Number.isFinite(amountKsh) || amountKsh <= 0 ||
      !Number.isInteger(attemptNumber)) return null;
  return { reference, batchTotalKsh, amountKsh, attemptNumber };
}

function randomReference() {
  return `cvrev_${crypto.randomBytes(16).toString("hex")}`;
}

async function pendingSources() {
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

  const result: RevenueSource[] = [];
  for (const source of sources as RevenueSource[]) {
    if (source.type === "WITHDRAWAL_FEE") {
      const withdrawalReference = source.reference.replace(/-FEE-COREVIA$/, "");
      const withdrawal = await prisma.withdrawal.findUnique({
        where: { reference: withdrawalReference },
        select: { status: true },
      });
      if (withdrawal?.status !== "PAID") continue;
    }

    const markers = await prisma.ledgerEntry.findMany({
      where: { ownerType: "COREVIA", reference: { startsWith: `${source.reference}-TILL-` } },
      select: { reference: true, description: true },
    });
    if (markers.some((entry) => entry.reference === `${source.reference}-TILL-PAID`)) continue;

    const attempts = markers
      .map((entry) => ({ entry, parsed: parseAttempt(entry.description) }))
      .filter((item): item is { entry: typeof markers[number]; parsed: NonNullable<ReturnType<typeof parseAttempt>> } => item.parsed !== null);
    const activeAttempt = attempts.some(({ parsed }) =>
      !markers.some((entry) => entry.reference === `${source.reference}-TILL-FAILED-A${parsed.attemptNumber}`),
    );
    if (activeAttempt) continue;
    result.push(source);
  }
  return result;
}

/**
 * Transfers only earned Corevia revenue to Till 6959300. The same database
 * advisory lock used by member withdrawals protects the shared Paystack pool.
 * Member wallet balances and outstanding member payouts are reserved first.
 */
export async function dispatchCoreviaRevenueTransfers() {
  if (
    process.env.COREVIA_TILL_FEE_TRANSFER_READY !== "true" ||
    process.env.COREVIA_PAYSTACK_NO_OTP_CONFIRMED !== "true"
  ) {
    return { dispatched: 0, reason: "revenue_transfer_not_enabled" as const };
  }

  const sources = await pendingSources();
  if (sources.length === 0) return { dispatched: 0, reason: "no_pending_revenue" as const };

  const recipient = await createKenyaMpesaTillRecipient();
  const providerReference = randomReference();
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

    const currentSources = await tx.ledgerEntry.findMany({
      where: { id: { in: sources.map((source) => source.id) }, ownerType: "COREVIA", amount: { gt: 0 } },
      select: { id: true, reference: true, amount: true, type: true },
    });
    const toReserve: Array<{ source: RevenueSource; attempt: number }> = [];
    let batchTotalKsh = 0;

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

      const parsedAttempts = markers
        .map((entry) => ({ entry, parsed: parseAttempt(entry.description) }))
        .filter((item): item is { entry: typeof markers[number]; parsed: NonNullable<ReturnType<typeof parseAttempt>> } => item.parsed !== null);
      const activeAttempt = parsedAttempts.some(({ parsed }) =>
        !markers.some((entry) => entry.reference === `${source.reference}-TILL-FAILED-A${parsed.attemptNumber}`),
      );
      if (activeAttempt) continue;

      const previousNumbers = markers
        .map((entry) => Number(entry.reference.match(/-TILL-FAILED-A(\d+)$/)?.[1] ?? 0))
        .filter((value) => Number.isInteger(value) && value >= 0);
      const attempt = Math.max(0, ...previousNumbers) + 1;
      toReserve.push({ source, attempt });
      batchTotalKsh += Number(source.amount);
    }

    batchTotalKsh = Number(batchTotalKsh.toFixed(2));
    if (toReserve.length === 0 || batchTotalKsh < MIN_TILL_TRANSFER_KSH) return null;
    if (batchTotalKsh > 50000000) return null;

    const requiredSubunits =
      Math.round((clientLiabilitiesKsh + batchTotalKsh) * 100) +
      FEE_AND_SAFETY_RESERVE_SUBUNITS;
    if (balanceSubunits < requiredSubunits) return null;

    await tx.ledgerEntry.createMany({
      data: toReserve.map(({ source, attempt }) => ({
        ownerType: "COREVIA",
        amount: 0,
        type: "ADJUSTMENT",
        reference: `${source.reference}-TILL-A${attempt}`,
        description: `COREVIA_TILL_ATTEMPT|${providerReference}|${batchTotalKsh.toFixed(2)}|${attempt}|${Number(source.amount).toFixed(2)}`,
      })),
      skipDuplicates: true,
    });

    return { amountKsh: batchTotalKsh, sourceCount: toReserve.length };
  }, { maxWait: 30000, timeout: 60000 });

  if (!reserved) return { dispatched: 0, reason: "client_funds_protected_or_below_minimum" as const };

  try {
    const transfer = await initiateKenyaMpesaTransfer({
      recipientCode: recipient.recipient_code,
      amountKsh: reserved.amountKsh,
      reference: providerReference,
      reason: "Corevia earned transaction and Academy fees to Till 6959300",
      accountReference: `COREVIA-${Date.now()}`,
      businessTill: true,
    });
    if (transfer.status === "otp" || transfer.status === "failed" || transfer.status === "reversed") {
      await settleCoreviaRevenueTransfer({
        reference: providerReference,
        status: "failed",
        amountSubunits: transfer.amount,
        currency: transfer.currency,
      });
      return { dispatched: 1, reference: providerReference, outcome: "rejected_no_manual_approval" as const };
    }
    return { dispatched: 1, reference: providerReference, amountKsh: reserved.amountKsh, sourceCount: reserved.sourceCount };
  } catch (error) {
    const providerStatus = error instanceof Error
      ? (error as Error & { statusCode?: number }).statusCode
      : undefined;
    if (providerStatus && providerStatus >= 400 && providerStatus < 500) {
      await settleCoreviaRevenueTransfer({
        reference: providerReference,
        status: "failed",
        amountSubunits: Math.round(reserved.amountKsh * 100),
        currency: "KES",
      });
      return { dispatched: 1, reference: providerReference, outcome: "provider_rejected_retry_queued" as const };
    }
    // Keep the attempt reserved: a timeout or 5xx may occur after Paystack
    // accepted the transfer. Reconciliation verifies before any retry.
    console.error("Corevia Till revenue transfer outcome is uncertain:", error);
    return { dispatched: 1, reference: providerReference, amountKsh: reserved.amountKsh, outcome: "reconciling" as const };
  }
}

export async function settleCoreviaRevenueTransfer(args: {
  reference: string;
  status: "success" | "failed" | "reversed";
  amountSubunits: number;
  currency: string;
}) {
  if (!/^cvrev_[a-f0-9]{32}$/.test(args.reference) ||
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

    const parsedBatch = attempts.map((entry) => parseAttempt(entry.description));
    const totalSubunits = Math.round(parsedBatch.reduce((sum, attempt) => sum + (attempt?.amountKsh ?? 0), 0) * 100);
    const firstAttempt = parsedBatch[0];
    if (!firstAttempt || totalSubunits !== args.amountSubunits ||
        Math.round(firstAttempt.batchTotalKsh * 100) !== args.amountSubunits) {
      throw new Error("Paystack transfer amount does not match its reserved Corevia revenue batch.");
    }

    const success = args.status === "success";
    const markerRows = attempts.map((entry) => {
      const sourceReference = entry.reference.replace(/-TILL-A\d+$/, "");
      const attempt = parseAttempt(entry.description)?.attemptNumber ?? 1;
      return {
        ownerType: "COREVIA" as const,
        amount: 0,
        type: "ADJUSTMENT" as const,
        reference: success ? `${sourceReference}-TILL-PAID` : `${sourceReference}-TILL-FAILED-A${attempt}`,
        description: success
          ? `Corevia revenue successfully transferred to Till 6959300; Paystack reference ${args.reference}`
          : `Paystack revenue transfer ${args.status}; eligible for automated retry; Paystack reference ${args.reference}`,
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
    take: 200,
    select: { description: true },
  });
  const references = [...new Set(
    attempts.map((entry) => parseAttempt(entry.description)?.reference)
      .filter((value): value is string => Boolean(value)),
  )];

  let checked = 0;
  let settled = 0;
  let inconclusive = 0;
  let errors = 0;

  for (const reference of references) {
    const alreadySettled = await prisma.ledgerEntry.findFirst({
      where: {
        ownerType: "COREVIA",
        description: { contains: `Paystack reference ${reference}` },
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
