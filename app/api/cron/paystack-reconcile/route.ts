import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { verifyPaystackTransfer } from "@/lib/paystack/transfers";
import { settlePaystackWithdrawal } from "@/lib/paystack/withdrawal-settlement";
import { dispatchCoreviaRevenueTransfers, reconcileCoreviaRevenueTransfers } from "@/lib/paystack/revenue-transfers";

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

  const pending = await prisma.withdrawal.findMany({
    where: {
      status: "PROCESSING",
      paymentReference: { startsWith: "cvps_" },
    },
    orderBy: { createdAt: "asc" },
    take: 50,
    select: { id: true, reference: true, paymentReference: true, netAmount: true },
  });

  let checked = 0;
  let settled = 0;
  let inconclusive = 0;
  let errors = 0;

  for (const withdrawal of pending) {
    if (!withdrawal.paymentReference) continue;
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

      if (transfer.status === "success" || transfer.status === "failed" || transfer.status === "reversed" || transfer.status === "otp") {
        const result = await settlePaystackWithdrawal({
          reference: withdrawal.paymentReference,
          status: transfer.status === "success" ? "success" : "failed",
          amountSubunits: transfer.amount,
          currency: transfer.currency,
          transferCode: transfer.transfer_code,
        });
        if (result.updated) settled += 1;
      } else {
        inconclusive += 1;
      }
    } catch (error) {
      const providerStatus = error instanceof Error
        ? (error as Error & { statusCode?: number }).statusCode
        : undefined;
      if (providerStatus === 404 && withdrawal.paymentReference) {
        const result = await settlePaystackWithdrawal({
          reference: withdrawal.paymentReference,
          status: "failed",
          amountSubunits: Math.round(Number(withdrawal.netAmount) * 100),
          currency: "KES",
        });
        if (result.updated) settled += 1;
        continue;
      }
      errors += 1;
      console.error("Paystack withdrawal reconciliation failed:", {
        withdrawalId: withdrawal.id,
        reference: withdrawal.reference,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const revenueReconciliation = await reconcileCoreviaRevenueTransfers();
  const revenueDispatch = await dispatchCoreviaRevenueTransfers();

  return NextResponse.json({
    checked,
    settled,
    inconclusive,
    errors,
    revenueReconciliation,
    revenueDispatch,
  });
}
