import { prisma } from "@/lib/prisma";

export type WalletDepositPayment = {
  reference: string;
  amount: number;
  currency: string;
  status: string;
  metadata?: Record<string, unknown> | null;
  paid_at?: string | null;
};

/**
 * Credits a member wallet only from a successful, server-verified Paystack
 * charge matching an initialized pending wallet-deposit transaction.
 * Row locking plus the unique transaction reference makes webhook/verify
 * races idempotent.
 */
export async function processWalletDeposit(payment: WalletDepositPayment) {
  const reference = String(payment.reference ?? "").trim();
  if (!reference || payment.status !== "success" || payment.currency !== "KES") {
    throw new Error("Wallet deposit payment is not successful or is not in KES.");
  }
  if (!Number.isSafeInteger(payment.amount) || payment.amount < 10000 || payment.amount > 15000000) {
    throw new Error("Wallet deposit amount is outside the permitted range.");
  }
  if (payment.metadata?.purpose !== "COREVIA_WALLET_DEPOSIT") {
    throw new Error("Payment is not a Corevia wallet deposit.");
  }

  const metadataUserId = typeof payment.metadata?.userId === "string" ? payment.metadata.userId : "";
  if (!metadataUserId) throw new Error("Wallet deposit member reference is missing.");

  const paidAt = payment.paid_at ? new Date(payment.paid_at) : new Date();
  if (Number.isNaN(paidAt.getTime())) throw new Error("Payment date is invalid.");

  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<Array<{ id: string; userId: string; amount: unknown; status: string }>>`
      SELECT "id", "userId", "amount", "status"
      FROM "WalletTransaction"
      WHERE "reference" = ${reference}
      FOR UPDATE
    `;
    const row = rows[0];
    if (!row || row.userId !== metadataUserId) {
      throw new Error("No matching wallet deposit exists for this member.");
    }
    if (Number(row.amount) * 100 !== payment.amount) {
      throw new Error("Verified payment amount does not match the wallet deposit.");
    }
    if (row.status === "COMPLETED") {
      return { alreadyProcessed: true, reference, amount: Number(row.amount) };
    }
    if (row.status !== "PENDING") throw new Error("Wallet deposit is not pending.");

    await tx.wallet.upsert({
      where: { userId: row.userId },
      create: { userId: row.userId, balance: Number(row.amount) },
      update: { balance: { increment: Number(row.amount) } },
    });
    await tx.walletTransaction.update({
      where: { id: row.id },
      data: {
        status: "COMPLETED",
        description: "Verified Paystack wallet deposit",
        completedAt: paidAt,
      },
    });
    return { alreadyProcessed: false, reference, amount: Number(row.amount) };
  });
}
