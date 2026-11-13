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

    // Only remit the withdrawal fee after Paystack confirms the member payout.
    // A reserved or failed payout must never create company Till revenue.
    const feeLedgerEntry = await tx.ledgerEntry.findUnique({
      where: { reference: `${withdrawal.reference}-fee-corevia` },
      select: { id: true, amount: true },
    });
    if (feeLedgerEntry && Number(feeLedgerEntry.amount) > 0) {
      await tx.coreviaTillSettlement.upsert({
        where: { ledgerEntryId: feeLedgerEntry.id },
        create: {
          ledgerEntryId: feeLedgerEntry.id,
          amount: feeLedgerEntry.amount,
          reference: `cvt-withdrawal-fee-${withdrawal.reference}`,
        },
        update: {},
      });
    }
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

  if (isReversal) {
    const feeLedgerEntry = await tx.ledgerEntry.findUnique({
      where: { reference: `${withdrawal.reference}-fee-corevia` },
      select: { id: true },
    });
    if (feeLedgerEntry) {
      const tillSettlement = await tx.coreviaTillSettlement.findUnique({
        where: { ledgerEntryId: feeLedgerEntry.id },
        select: { id: true, status: true },
      });
      if (tillSettlement?.status === "PENDING") {
        await tx.coreviaTillSettlement.updateMany({
          where: { id: tillSettlement.id, status: "PENDING" },
          data: {
            status: "REVERSED",
            settledAt: new Date(),
            lastError: "Underlying member payout was reversed before company Till remittance.",
          },
        });
      } else if (
        tillSettlement &&
        ["PROCESSING", "REVIEW", "SETTLED"].includes(tillSettlement.status)
      ) {
        // Do not send a second automatic transfer to undo this. Hold the
        // company queue and require reconciliation of the already-submitted
        // or completed Till remittance against the reversed member fee.
        await tx.coreviaTillSettlement.updateMany({
          where: { id: tillSettlement.id, status: tillSettlement.status },
          data: {
            status: "REVIEW",
            lastError: "Underlying member payout was reversed after company Till remittance was queued or submitted; manual reconciliation required.",
          },
        });
      }
    }
  }

  return { processed: true, outcome, refunded: true };
}
