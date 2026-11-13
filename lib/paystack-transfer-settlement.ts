import type { Prisma } from "@/app/generated/prisma/client";

type SettlementWithdrawal = {
  id: string;
  userId: string;
  amount: number;
  fee: number;
  reference: string;
};

type TransferOutcome = "success" | "failed" | "reversed";

/** Apply provider settlement once, regardless of whether a webhook or recovery job observed it. */
export async function applyPaystackTransferOutcome(
  tx: Prisma.TransactionClient,
  withdrawal: SettlementWithdrawal,
  outcome: TransferOutcome,
  transferCode?: string,
) {
  const current = await tx.withdrawal.findUnique({
    where: { id: withdrawal.id },
    select: { status: true },
  });

  if (!current) throw new Error("Withdrawal disappeared during settlement.");

  if (outcome === "success") {
    const changed = await tx.withdrawal.updateMany({
      where: { id: withdrawal.id, status: { in: ["PENDING", "PROCESSING"] } },
      data: {
        status: "PAID",
        processorStatus: "success",
        transferCode,
        settledAt: new Date(),
        processedAt: new Date(),
      },
    });
    if (changed.count !== 1) return { processed: false, outcome: "already_settled" };

    await tx.walletTransaction.updateMany({
      where: { reference: `${withdrawal.reference}-wallet`, status: "PENDING" },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    return { processed: true, outcome: "success" };
  }

  const isReversal = outcome === "reversed";
  const canRefund = current.status === "PENDING" ||
    current.status === "PROCESSING" ||
    (isReversal && current.status === "PAID");

  if (!canRefund) return { processed: false, outcome: "already_settled" };

  const changed = await tx.withdrawal.updateMany({
    where: { id: withdrawal.id, status: current.status },
    data: {
      status: "FAILED",
      processorStatus: outcome,
      transferCode,
      settledAt: new Date(),
      processedAt: new Date(),
    },
  });
  if (changed.count !== 1) return { processed: false, outcome: "already_settled" };

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
      description: `Wallet refund for ${isReversal ? "reversed" : "unsuccessful"} Paystack payout`,
    },
  });
  await tx.ledgerEntry.create({
    data: {
      ownerType: "COREVIA",
      amount: withdrawal.fee * -1,
      type: "ADJUSTMENT",
      reference: `${withdrawal.reference}-PAYOUT-REFUND-COREVIA-FEE`,
      description: `Reverse Corevia withdrawal fee for ${isReversal ? "reversed" : "unsuccessful"} Paystack payout`,
    },
  });
  await tx.walletTransaction.updateMany({
    where: {
      reference: `${withdrawal.reference}-wallet`,
      status: isReversal ? { in: ["PENDING", "COMPLETED"] } : "PENDING",
    },
    data: { status: isReversal ? "REVERSED" : "FAILED", completedAt: new Date() },
  });

  return { processed: true, outcome, refunded: true };
}
