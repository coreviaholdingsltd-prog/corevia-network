import { prisma } from "@/lib/prisma";

export async function settleWithdrawalFailure(
  reference: string,
  resultCode: number,
  resultDescription: string,
) {
  if (!Number.isInteger(resultCode) || resultCode <= 0 || !resultDescription.trim()) {
    throw new Error("A confirmed non-zero Safaricom result code and description are required to fail a withdrawal.");
  }

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
  if (
    details.resultCode !== 0 ||
    !details.resultDescription.trim() ||
    !details.receiptNumber ||
    !/^[A-Z0-9]{8,20}$/i.test(details.receiptNumber)
  ) {
    throw new Error("A successful Safaricom result, description, and valid M-PESA receipt are required to mark a withdrawal paid.");
  }

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
        mpesaReceiptNumber: details.receiptNumber,
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
