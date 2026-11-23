import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = verifySession(cookieStore.get(sessionCookieName)?.value);
    if (!session) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

    const body = await request.json();
    const reference = String(body.reference ?? "");
    if (!/^cvwd-[a-f0-9]{32}$/.test(reference)) {
      return NextResponse.json({ error: "A valid withdrawal reference is required." }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Match the request and payout worker lock so cancellation cannot race
      // a transfer claim.
      await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(724190112)) AS lock_result`;
      const withdrawal = await tx.withdrawal.findFirst({
        where: { reference, userId: session.userId },
        select: { id: true, amount: true, fee: true, status: true, payoutReference: true, processorStatus: true },
      });
      if (!withdrawal) return { error: "Withdrawal request not found." };
      if (withdrawal.status === "REJECTED") return { cancelled: true, alreadyCancelled: true };
      if (withdrawal.status !== "PENDING" || withdrawal.payoutReference !== null ||
          ![null, "queued"].includes(withdrawal.processorStatus)) {
        return { error: "This request can no longer be cancelled because payout processing has started or it requires review." };
      }

      const changed = await tx.withdrawal.updateMany({
        where: {
          id: withdrawal.id,
          status: "PENDING",
          payoutReference: null,
          OR: [{ processorStatus: null }, { processorStatus: "queued" }],
        },
        data: { status: "REJECTED", processorStatus: "cancelled_by_member", settledAt: new Date(), processedAt: new Date() },
      });
      if (changed.count !== 1) return { error: "The request changed while cancellation was being processed. Refresh your withdrawal history." };

      const amount = Number(withdrawal.amount);
      const fee = Number(withdrawal.fee);
      if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(fee) || fee < 0 || fee > amount) {
        throw new Error("Withdrawal financial record failed validation; cancellation was rolled back for reconciliation.");
      }

      await tx.wallet.update({
        where: { userId: session.userId },
        data: { balance: { increment: amount } },
      });
      await tx.ledgerEntry.create({
        data: {
          ownerType: "MEMBER", userId: session.userId, amount,
          type: "ADJUSTMENT", reference: reference + "-member-cancel-refund",
          description: "Wallet reservation released after member cancelled pending withdrawal.",
        },
      });
      await tx.ledgerEntry.create({
        data: {
          ownerType: "COREVIA", amount: -fee,
          type: "ADJUSTMENT", reference: reference + "-corevia-cancel-fee-reversal",
          description: "Reverse Corevia withdrawal fee for cancelled pending request.",
        },
      });
      await tx.walletTransaction.updateMany({
        where: { reference: reference + "-wallet", status: "PENDING" },
        data: { status: "FAILED", completedAt: new Date() },
      });
      return { cancelled: true, refundedAmount: amount };
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.error.includes("not found") ? 404 : 409 });
    }
    return NextResponse.json({ status: true, ...result });
  } catch (error) {
    console.error("Withdrawal cancellation failed safely:", error);
    return NextResponse.json({ error: "Unable to cancel this withdrawal safely. No partial wallet changes were committed." }, { status: 500 });
  }
}
