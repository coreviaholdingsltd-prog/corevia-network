import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaystackVerifyPayload = {
  status?: boolean;
  message?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    transfer_code?: string;
  };
};

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 });
  }

  const staleBefore = new Date(Date.now() - 2 * 60 * 1000);
  const candidates = await prisma.withdrawal.findMany({
    where: {
      status: "PROCESSING",
      payoutReference: { not: null },
      createdAt: { lte: staleBefore },
    },
    orderBy: { createdAt: "asc" },
    take: 25,
    select: {
      id: true,
      userId: true,
      amount: true,
      fee: true,
      netAmount: true,
      status: true,
      reference: true,
      payoutReference: true,
    },
  });

  const outcomes: Array<{ reference: string; outcome: string }> = [];

  for (const withdrawal of candidates) {
    const reference = withdrawal.payoutReference;
    if (!reference) continue;

    try {
      const response = await fetch(
        `https://api.paystack.co/transfer/verify/${encodeURIComponent(reference)}`,
        {
          headers: { Authorization: `Bearer ${secretKey}` },
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        },
      );
      if (!response.ok) {
        outcomes.push({ reference, outcome: "verification_pending" });
        continue;
      }

      const payload = (await response.json()) as PaystackVerifyPayload;
      const transfer = payload.data;
      if (payload.status !== true || !transfer || transfer.reference !== reference) {
        outcomes.push({ reference, outcome: "verification_unconfirmed" });
        continue;
      }

      const expectedAmount = Math.round(Number(withdrawal.netAmount) * 100);
      if (
        String(transfer.currency ?? "").toUpperCase() !== "KES" ||
        Number(transfer.amount) !== expectedAmount
      ) {
        console.error("Paystack reconciliation mismatch:", {
          reference,
          currency: transfer.currency,
          amount: transfer.amount,
        });
        outcomes.push({ reference, outcome: "manual_review_mismatch" });
        continue;
      }

      const providerStatus = String(transfer.status ?? "").toLowerCase();
      if (providerStatus === "pending" || providerStatus === "otp" || providerStatus === "processing") {
        outcomes.push({ reference, outcome: providerStatus });
        continue;
      }

      if (providerStatus === "success") {
        const result = await prisma.$transaction(async (tx) => {
          const changed = await tx.withdrawal.updateMany({
            where: { id: withdrawal.id, status: "PROCESSING" },
            data: {
              status: "PAID",
              processorStatus: "success",
              transferCode: transfer.transfer_code ?? undefined,
              settledAt: new Date(),
              processedAt: new Date(),
            },
          });
          if (changed.count !== 1) return "already_settled";
          await tx.walletTransaction.updateMany({
            where: { reference: `${withdrawal.reference}-wallet`, status: "PENDING" },
            data: { status: "COMPLETED", completedAt: new Date() },
          });
          return "success";
        });
        outcomes.push({ reference, outcome: result });
        continue;
      }

      if (providerStatus === "failed" || providerStatus === "reversed") {
        const result = await prisma.$transaction(async (tx) => {
          const changed = await tx.withdrawal.updateMany({
            where: { id: withdrawal.id, status: "PROCESSING" },
            data: {
              status: "FAILED",
              processorStatus: providerStatus,
              transferCode: transfer.transfer_code ?? undefined,
              settledAt: new Date(),
              processedAt: new Date(),
            },
          });
          if (changed.count !== 1) return "already_settled";

          await tx.wallet.update({
            where: { userId: withdrawal.userId },
            data: { balance: { increment: withdrawal.amount } },
          });
          await tx.ledgerEntry.create({
            data: {
              ownerType: "MEMBER",
              userId: withdrawal.userId,
              amount: withdrawal.amount,
              type: "ADJUSTMENT",
              reference: `${withdrawal.reference}-PAYOUT-REFUND-MEMBER`,
              description: `Wallet refund for unsuccessful Paystack payout ${reference}`,
            },
          });
          await tx.ledgerEntry.create({
            data: {
              ownerType: "COREVIA",
              amount: Number(withdrawal.fee) * -1,
              type: "ADJUSTMENT",
              reference: `${withdrawal.reference}-PAYOUT-REFUND-COREVIA-FEE`,
              description: `Reverse Corevia withdrawal fee for unsuccessful payout ${reference}`,
            },
          });
          await tx.walletTransaction.updateMany({
            where: { reference: `${withdrawal.reference}-wallet`, status: "PENDING" },
            data: { status: "FAILED", completedAt: new Date() },
          });
          return "refunded";
        });
        outcomes.push({ reference, outcome: result });
        continue;
      }

      outcomes.push({ reference, outcome: "unrecognized_status" });
    } catch (error) {
      console.error("Paystack payout reconciliation failed:", reference, error);
      outcomes.push({ reference, outcome: "retry_later" });
    }
  }

  return NextResponse.json({
    checked: candidates.length,
    outcomes,
  });
}
