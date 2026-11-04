import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystackTransfer } from "@/lib/paystack/transfers";
import { settlePaystackWithdrawal } from "@/lib/paystack/withdrawal-settlement";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 2 * 60 * 1000);
  const pending = await prisma.withdrawal.findMany({
    where: {
      payoutProvider: "PAYSTACK",
      status: "PROCESSING",
      paymentReference: { not: null },
      createdAt: { lte: cutoff },
    },
    orderBy: { createdAt: "asc" },
    take: 50,
    select: { id: true, reference: true, paymentReference: true },
  });

  const results: Array<{ reference: string; outcome: string }> = [];
  for (const withdrawal of pending) {
    const providerReference = withdrawal.paymentReference;
    if (!providerReference) continue;
    try {
      const transfer = await verifyPaystackTransfer(providerReference);
      if (transfer.status === "success" || transfer.status === "failed" || transfer.status === "reversed") {
        const settled = await settlePaystackWithdrawal({
          reference: providerReference,
          status: transfer.status,
          amountSubunits: transfer.amount,
          currency: transfer.currency,
          transferCode: transfer.transfer_code,
        });
        results.push({ reference: withdrawal.reference, outcome: settled.updated ? transfer.status : "already-settled" });
      } else {
        await prisma.payoutProviderAttempt.updateMany({
          where: { withdrawalId: withdrawal.id, providerReference },
          data: {
            status: "PROCESSING",
            providerTransferId: transfer.transfer_code,
            responsePayload: {
              status: transfer.status,
              amount: transfer.amount,
              currency: transfer.currency,
              transferCode: transfer.transfer_code,
            },
          },
        });
        results.push({ reference: withdrawal.reference, outcome: "still-processing" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message.slice(0, 500) : "Unknown verification error";
      await prisma.payoutProviderAttempt.updateMany({
        where: { withdrawalId: withdrawal.id, providerReference },
        data: { status: "AMBIGUOUS", errorDescription: message, retryCount: { increment: 1 } },
      });
      results.push({ reference: withdrawal.reference, outcome: "verification-error" });
    }
  }

  return NextResponse.json({ checked: results.length, results });
}
