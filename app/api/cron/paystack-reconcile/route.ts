import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { verifyPaystackTransfer } from "@/lib/paystack/transfers";
import { settlePaystackWithdrawal } from "@/lib/paystack/withdrawal-settlement";
import { processWalletDeposit } from "@/lib/wallet-deposits";
import { dispatchCoreviaRevenueTransfers, preflightCoreviaTillRecipient, reconcileCoreviaRevenueTransfers } from "@/lib/paystack/revenue-transfers";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization") || "";
  if (!secret || !supplied.startsWith("Bearer ")) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(supplied);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 });

  let depositChecked = 0;
  let depositCredited = 0;
  let depositFailed = 0;
  let depositInconclusive = 0;
  let depositErrors = 0;

  // Recover successful deposits even when a webhook was delayed or missed.
  // The processor rechecks reference, amount, currency, metadata and ownership,
  // and atomically claims the payment before crediting the member ledger.
  const pendingDeposits = await prisma.paymentRecord.findMany({
    where: {
      provider: "PAYSTACK",
      destination: "OTHER",
      status: "PENDING",
      providerReference: { startsWith: "CV-WALLET-" },
    },
    orderBy: { createdAt: "asc" },
    take: 12,
    select: { id: true, userId: true, providerReference: true },
  });

  // Process at most four provider verifications concurrently. With 12 records
  // and a 10-second per-request timeout, this bounds deposit recovery to three
  // batches rather than allowing 40 serial requests to exceed maxDuration.
  for (let offset = 0; offset < pendingDeposits.length; offset += 4) {
    await Promise.all(pendingDeposits.slice(offset, offset + 4).map(async (deposit) => {
    depositChecked += 1;
    try {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(deposit.providerReference)}`,
        {
          headers: { Authorization: `Bearer ${secret}` },
          cache: "no-store",
          signal: AbortSignal.timeout(10000),
        },
      );
      const payload = await response.json().catch(() => null) as {
        status?: boolean;
        message?: string;
        data?: {
          reference?: string;
          status?: string;
          amount?: number;
          currency?: string;
          paid_at?: string | null;
          metadata?: Record<string, unknown> | null;
        };
      } | null;

      if (!response.ok || payload?.status !== true || !payload.data) {
        const statusCode = response.status;
        if (statusCode === 404 || statusCode === 408 || statusCode === 429 || statusCode >= 500) {
          depositInconclusive += 1;
          return;
        }
        throw new Error(payload?.message || `Paystack verification failed (HTTP ${statusCode}).`);
      }

      const payment = payload.data;
      if (payment.reference !== deposit.providerReference) {
        throw new Error("Paystack deposit reference did not match the pending record.");
      }

      if (payment.status === "success") {
        const result = await processWalletDeposit({
          reference: String(payment.reference),
          amount: Number(payment.amount),
          currency: String(payment.currency ?? ""),
          status: String(payment.status),
          paid_at: payment.paid_at ?? null,
          metadata: payment.metadata ?? null,
        }, deposit.userId);
        if (!result.alreadyProcessed) depositCredited += 1;
      } else if (payment.status === "failed" || payment.status === "abandoned") {
        const changed = await prisma.paymentRecord.updateMany({
          where: { id: deposit.id, userId: deposit.userId, status: "PENDING", allocationReference: null },
          data: { status: "FAILED" },
        });
        if (changed.count === 1) depositFailed += 1;
      } else {
        depositInconclusive += 1;
      }
    } catch (error) {
      depositErrors += 1;
      console.error("Paystack wallet deposit reconciliation failed:", {
        paymentRecordId: deposit.id,
        reference: deposit.providerReference,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
    }));
  }

  const pending = await prisma.withdrawal.findMany({
    where: {
      status: "PROCESSING",
      paymentReference: { startsWith: "cvps_" },
    },
    orderBy: { createdAt: "asc" },
    take: 12,
    select: { id: true, reference: true, paymentReference: true, netAmount: true },
  });

  let checked = 0;
  let settled = 0;
  let inconclusive = 0;
  let errors = 0;

  // Bound provider verification time just like deposit recovery: at most four
  // requests concurrently and twelve withdrawals per run. This prevents a
  // long serial queue from exhausting the function's 60-second execution limit.
  for (let offset = 0; offset < pending.length; offset += 4) {
    await Promise.all(pending.slice(offset, offset + 4).map(async (withdrawal) => {
      if (!withdrawal.paymentReference) return;
      checked += 1;
      try {
        const transfer = await verifyPaystackTransfer(withdrawal.paymentReference);
        if (
          transfer.reference !== withdrawal.paymentReference ||
          transfer.currency !== "KES" ||
          !Number.isSafeInteger(transfer.amount) ||
          transfer.amount <= 0
        ) {
          throw new Error("Paystack verification returned mismatched transfer details.");
        }

        if (transfer.status === "success" || transfer.status === "failed" || transfer.status === "reversed") {
          const result = await settlePaystackWithdrawal({
            reference: withdrawal.paymentReference,
            status: transfer.status === "success" ? "success" : "failed",
            amountSubunits: transfer.amount,
            currency: transfer.currency,
            transferCode: transfer.transfer_code,
          });
          if (result.updated) settled += 1;
        } else {
          // OTP and other non-terminal states retain the wallet reservation.
          // Never refund or release customer funds on an intermediate outcome.
          inconclusive += 1;
        }
      } catch (error) {
        const providerStatus = error instanceof Error
          ? (error as Error & { statusCode?: number }).statusCode
          : undefined;
        // A verification 404 is not proof that a timed-out transfer was rejected.
        // Keep the wallet debit and PROCESSING reservation intact.
        if (providerStatus === 404) {
          inconclusive += 1;
          return;
        }
        errors += 1;
        console.error("Paystack withdrawal reconciliation failed:", {
          withdrawalId: withdrawal.id,
          reference: withdrawal.reference,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }));
  }

  // Verify or create the production Till beneficiary even while revenue
  // transfers remain disabled. This preflight never moves funds.
  const tillRecipientPreflight = await preflightCoreviaTillRecipient();
  const revenueReconciliation = await reconcileCoreviaRevenueTransfers();
  const revenueDispatch = await dispatchCoreviaRevenueTransfers();

  return NextResponse.json({
    deposits: {
      checked: depositChecked,
      credited: depositCredited,
      failed: depositFailed,
      inconclusive: depositInconclusive,
      errors: depositErrors,
    },
    withdrawals: { checked, settled, inconclusive, errors },
    tillRecipientPreflight,
    revenueReconciliation,
    revenueDispatch,
  });
}
