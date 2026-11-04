import { prisma } from "@/lib/prisma";

/**
 * Settles a Paystack M-PESA withdrawal only from a signed, terminal transfer
 * webhook. Paystack's transfer reference is stored in Withdrawal.paymentReference;
 * it is deliberately not written into mpesaReceiptNumber (that field is Daraja-only).
 */
export async function settlePaystackWithdrawal(args: {
  reference: string;
  status: "success" | "failed" | "reversed";
  amountSubunits: number;
  currency: string;
  transferCode?: string | null;
}) {
  if (!/^cvps_[a-z0-9_-]{16,45}$/.test(args.reference)) {
    throw new Error("Invalid Corevia Paystack withdrawal reference.");
  }
  if (!Number.isSafeInteger(args.amountSubunits) || args.amountSubunits <= 0 || args.currency !== "KES") {
    throw new Error("Invalid Paystack withdrawal amount or currency.");
  }

  return prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findFirst({
      where: { paymentReference: args.reference },
    });
    if (!withdrawal) return { updated: false, reason: "unmatched" as const };

    const expectedSubunits = Math.round(Number(withdrawal.netAmount) * 100);
    if (args.amountSubunits !== expectedSubunits) {
      throw new Error("Paystack transfer amount does not match the withdrawal's promised net payout.");
    }

    // A reversal can arrive after a success webhook; restore the member balance once.
    if (withdrawal.status === "FAILED" || withdrawal.status === "REJECTED") {
      return { updated: false, reason: "already_terminal" as const };
    }
    if (withdrawal.status === "PAID" && args.status !== "reversed") {
      return { updated: false, reason: "already_terminal" as const };
    }

    const now = new Date();
    const success = args.status === "success";
    await tx.payoutProviderAttempt.updateMany({
      where: { withdrawalId: withdrawal.id, providerReference: args.reference },
      data: {
        status: success ? "SUCCEEDED" : args.status === "reversed" ? "REVERSED" : "FAILED",
        providerTransferId: args.transferCode ?? undefined,
        completedAt: now,
        responsePayload: {
          status: args.status,
          amount: args.amountSubunits,
          currency: args.currency,
          transferCode: args.transferCode ?? null,
        },
      },
    });
    const allowedStatuses: ("PENDING" | "PROCESSING" | "PAID")[] = args.status === "reversed"
      ? ["PENDING", "PROCESSING", "PAID"]
      : ["PENDING", "PROCESSING"];
    const changed = await tx.withdrawal.updateMany({
      where: {
        id: withdrawal.id,
        status: { in: allowedStatuses },
        paymentReference: args.reference,
      },
      data: {
        status: success ? "PAID" : "FAILED",
        resultCode: success ? 0 : args.status === "reversed" ? 2 : 1,
        resultDescription: success
          ? "Paystack confirmed the M-PESA transfer as successful."
          : "Paystack confirmed the M-PESA transfer as " + args.status + ".",
        processedAt: now,
      },
    });
    if (changed.count !== 1) return { updated: false, reason: "raced" as const };

    const reservation = await tx.payoutFloatReservation.findUnique({
      where: { withdrawalId: withdrawal.id },
    });
    if (reservation && (reservation.status === "RESERVED" || (args.status === "reversed" && reservation.status === "SETTLED"))) {
      const released = await tx.payoutFloatReservation.updateMany({
        where: {
          id: reservation.id,
          status: reservation.status,
        },
        data: { status: "RELEASED" },
      });
      if (released.count === 1) {
        const accountUpdated = reservation.status === "RESERVED"
          ? await tx.payoutFloatAccount.updateMany({
              where: { id: reservation.accountId, reservedBalance: { gte: reservation.amount } },
              data: {
                reservedBalance: { decrement: reservation.amount },
                availableBalance: { increment: reservation.amount },
              },
            })
          : await tx.payoutFloatAccount.updateMany({
              where: { id: reservation.accountId },
              data: { availableBalance: { increment: reservation.amount } },
            });
        if (accountUpdated.count !== 1) {
          throw new Error("Paystack float reservation could not be released safely; transaction rolled back.");
        }
        await tx.payoutFloatEntry.create({
          data: {
            accountId: reservation.accountId,
            reference: `${withdrawal.reference}-PAYSTACK-FLOAT-RELEASE`,
            type: "RELEASE",
            amount: reservation.amount,
            description: `Released Paystack payout float after terminal ${args.status} for ${withdrawal.reference}`,
          },
        });
      }
    } else if (reservation?.status === "RESERVED" && success) {
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
          throw new Error("Paystack float reservation could not be settled safely; transaction rolled back.");
        }
        await tx.payoutFloatEntry.create({
          data: {
            accountId: reservation.accountId,
            reference: `${withdrawal.reference}-PAYSTACK-FLOAT-SETTLED`,
            type: "SETTLEMENT",
            amount: reservation.amount,
            description: `Consumed reserved Paystack payout float after confirmed success of ${withdrawal.reference}`,
          },
        });
      }
    }

    if (!success) {
      // A failed or reversed Paystack transfer is terminal. Restore the single
      // wallet debit and reverse the Corevia fee accrual exactly once.
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
            reference: `${withdrawal.reference}-FEE-REFUND-MEMBER`,
            description: `Refund of Corevia withdrawal fee after Paystack ${args.status} for ${withdrawal.reference}`,
          },
          {
            ownerType: "COREVIA",
            amount: withdrawal.fee.negated(),
            type: "WITHDRAWAL_FEE",
            reference: `${withdrawal.reference}-FEE-REFUND-COREVIA`,
            description: `Reversal of Corevia fee accrual after Paystack ${args.status} for ${withdrawal.reference}`,
          },
        ],
        skipDuplicates: true,
      });
      await tx.walletTransaction.updateMany({
        where: { reference: `${withdrawal.reference}-WALLET` },
        data: { status: "FAILED" },
      });
    } else {
      await tx.walletTransaction.updateMany({
        where: { reference: `${withdrawal.reference}-WALLET` },
        data: { status: "COMPLETED", completedAt: now },
      });
    }

    return { updated: true, status: success ? "PAID" as const : "FAILED" as const };
  });
}
