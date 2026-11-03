import { prisma } from "@/lib/prisma";

export async function settleWithdrawalFailure(
  reference: string,
  resultCode: number,
  resultDescription: string,
) {
  return prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({ where: { reference } });
    if (!withdrawal || ["PAID", "FAILED", "REJECTED"].includes(withdrawal.status)) {
      return { updated: false };
    }

    const changed = await tx.withdrawal.updateMany({
      where: { id: withdrawal.id, status: { in: ["PENDING", "PROCESSING"] } },
      data: {
        status: "FAILED",
        resultCode,
        resultDescription: resultDescription.slice(0, 500),
        processedAt: new Date(),
      },
    });
    if (changed.count !== 1) return { updated: false };

    await tx.wallet.update({
      where: { userId: withdrawal.userId },
      data: { balance: { increment: withdrawal.amount } },
    });

    await tx.ledgerEntry.createMany({
      data: [
        {
          ownerType: "MEMBER",
          userId: withdrawal.userId,
          amount: withdrawal.fee,
          type: "WITHDRAWAL_FEE",
          reference: `${reference}-FEE-REFUND-MEMBER`,
          description: `Refund of Corevia withdrawal fee after failed payout ${reference}`,
        },
        {
          ownerType: "COREVIA",
          amount: withdrawal.fee.negated(),
          type: "WITHDRAWAL_FEE",
          reference: `${reference}-FEE-REFUND-COREVIA`,
          description: `Reversal of fee income after failed payout ${reference}`,
        },
      ],
      skipDuplicates: true,
    });

    await tx.walletTransaction.updateMany({
      where: { reference: `${reference}-WALLET` },
      data: { status: "FAILED" },
    });

    return { updated: true };
  });
}

export async function settleWithdrawalSuccess(
  reference: string,
  details: {
    resultCode: number;
    resultDescription: string;
    receiptNumber?: string | null;
    conversationId?: string | null;
  },
) {
  return prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({ where: { reference } });
    if (!withdrawal || ["PAID", "FAILED", "REJECTED"].includes(withdrawal.status)) {
      return { updated: false };
    }

    const changed = await tx.withdrawal.updateMany({
      where: { id: withdrawal.id, status: { in: ["PENDING", "PROCESSING"] } },
      data: {
        status: "PAID",
        resultCode: details.resultCode,
        resultDescription: details.resultDescription.slice(0, 500),
        mpesaReceiptNumber: details.receiptNumber ?? null,
        conversationId: details.conversationId ?? withdrawal.conversationId,
        processedAt: new Date(),
      },
    });
    if (changed.count !== 1) return { updated: false };

    await tx.walletTransaction.updateMany({
      where: { reference: `${reference}-WALLET` },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    return { updated: true };
  });
}
