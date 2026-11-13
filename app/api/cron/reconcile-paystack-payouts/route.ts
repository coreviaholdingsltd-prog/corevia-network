import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyPaystackTransferOutcome } from "@/lib/paystack-transfer-settlement";

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

  const now = new Date();
  const staleBefore = new Date(now.getTime() - 2 * 60 * 1000);
  const reverifyBefore = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const [processing, paidForReverification] = await Promise.all([
    prisma.withdrawal.findMany({
      where: {
        status: "PROCESSING",
        payoutReference: { not: null },
        createdAt: { lte: staleBefore },
      },
      orderBy: { createdAt: "asc" },
      take: 25,
      select: {
        id: true, userId: true, amount: true, fee: true, netAmount: true,
        status: true, reference: true, payoutReference: true,
      },
    }),
    prisma.withdrawal.findMany({
      where: {
        status: "PAID",
        processorStatus: "success",
        payoutReference: { not: null },
        OR: [{ lastVerifiedAt: null }, { lastVerifiedAt: { lte: reverifyBefore } }],
      },
      orderBy: [{ lastVerifiedAt: "asc" }, { settledAt: "asc" }],
      take: 25,
      select: {
        id: true, userId: true, amount: true, fee: true, netAmount: true,
        status: true, reference: true, payoutReference: true,
      },
    }),
  ]);

  const candidates = [...processing, ...paidForReverification];
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
      if (["pending", "otp", "processing"].includes(providerStatus)) {
        outcomes.push({ reference, outcome: providerStatus });
        continue;
      }

      if (!["success", "failed", "reversed"].includes(providerStatus)) {
        outcomes.push({ reference, outcome: "unrecognized_status" });
        continue;
      }

      const result = await prisma.$transaction(async (tx) => {
        const settlement = await applyPaystackTransferOutcome(
          tx,
          {
            id: withdrawal.id,
            userId: withdrawal.userId,
            amount: Number(withdrawal.amount),
            fee: Number(withdrawal.fee),
            reference: withdrawal.reference,
          },
          providerStatus as "success" | "failed" | "reversed",
          transfer.transfer_code,
        );

        if (withdrawal.status === "PAID" && providerStatus === "failed") {
          return { processed: false, outcome: "manual_review_paid_failed_conflict" };
        }
        if (withdrawal.status === "PAID" && providerStatus === "success") {
          await tx.withdrawal.updateMany({
            where: { id: withdrawal.id, status: "PAID" },
            data: { lastVerifiedAt: new Date() },
          });
          return { ...settlement, outcome: "verified_paid" };
        }
        return settlement;
      });
      outcomes.push({ reference, outcome: result.outcome });
    } catch (error) {
      console.error("Paystack payout reconciliation failed:", reference, error);
      outcomes.push({ reference, outcome: "retry_later" });
    }
  }

  return NextResponse.json({
    checked: candidates.length,
    processingChecked: processing.length,
    paidRechecked: paidForReverification.length,
    outcomes,
  });
}
