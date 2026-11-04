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

    await tx.payoutProviderAttempt.updateMany({
      where: { withdrawalId: withdrawal.id, provider: "DARAJA" },
      data: {
        status: "FAILED",
        errorCode: String(resultCode),
        errorDescription: resultDescription.slice(0, 500),
        completedAt: new Date(),
      },
    });

    await tx.wallet.update({
      where: { userId: withdrawal.userId },
      data: { balance: { increment: withdrawal.amount } },
    });

    await tx.payoutProviderAttempt.updateMany({
      where: { withdrawalId: withdrawal.id, provider: "DARAJA" },
      data: {
        status: "SUCCEEDED",
        completedAt: new Date(),
        responsePayload: {
          resultCode: details.resultCode,
          resultDescription: details.resultDescription.slice(0, 500),
          receiptNumber: details.receiptNumber,
          conversationId: details.conversationId ?? null,
        },
      },
    });

    const reservation = await tx.payoutFloatReservation.findUnique({
      where: { withdrawalId: withdrawal.id },
    });
    if (reservation?.status === "RESERVED") {
      const released = await tx.payoutFloatReservation.updateMany({
        where: { id: reservation.id, status: "RESERVED" },
        data: { status: "RELEASED" },
      });
      if (released.count === 1) {
        const accountUpdated = await tx.payoutFloatAccount.updateMany({
          where: { id: reservation.accountId, reservedBalance: { gte: reservation.amount } },
          data: {
            reservedBalance: { decrement: reservation.amount },
            availableBalance: { increment: reservation.amount },
          },
        });
        if (accountUpdated.count !== 1) {
          throw new Error("Payout float reservation could not be released safely; transaction rolled back.");
        }
        await tx.payoutFloatEntry.create({
          data: {
            accountId: reservation.accountId,
            reference: `${reference}-FLOAT-RELEASE`,
            type: "RELEASE",
            amount: reservation.amount,
            description: `Released reserved M-PESA payout float after confirmed failure of ${reference}`,
          },
        });
      }
    }

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

    const reservation = await tx.payoutFloatReservation.findUnique({
      where: { withdrawalId: withdrawal.id },
    });
    if (reservation?.status === "RESERVED") {
      const settled = await tx.payoutFloatReservation.updateMany({
        where: { id: reservation.id, status: "RESERVED" },
        data: { status: "SETTLED" },
      });
      if (settled.count === 1) {
        const accountUpdated = await tx.payoutFloatAccount.updateMany({
          where: { id: reservation.accountId, reservedBalance: { gte: reservation.amount } },
          data: { reservedBalance: { decrement: reservation.amount } },
        });
        if (accountUpdated.count !== 1) {
          throw new Error("Payout float reservation could not be settled safely; transaction rolled back.");
        }
        await tx.payoutFloatEntry.create({
          data: {
            accountId: reservation.accountId,
            reference: `${reference}-FLOAT-SETTLED`,
            type: "SETTLEMENT",
            amount: reservation.amount,
            description: `Consumed reserved M-PESA Utility payout float after confirmed success of ${reference}`,
          },
        });
      }
    }

    await tx.walletTransaction.updateMany({
      where: { reference: `${reference}-WALLET` },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    return { updated: true };
  });
}
