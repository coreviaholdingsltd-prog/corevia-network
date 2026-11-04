import { prisma } from "@/lib/prisma";

export async function processWalletDeposit(payment: { reference: string; amount: number; currency: string; status: string; paid_at?: string | null; metadata?: Record<string, unknown> | null }, expectedUserId?: string) {
  if (payment.status !== "success" || payment.currency !== "KES") throw new Error("Wallet deposit is not a successful KES payment.");
  const reference = String(payment.reference || "").trim();
  const userId = typeof payment.metadata?.userId === "string" ? payment.metadata.userId : "";
  if (!reference || payment.metadata?.purpose !== "COREVIA_WALLET_DEPOSIT" || !userId || (expectedUserId && expectedUserId !== userId)) throw new Error("Wallet deposit metadata is invalid.");
  const paidAt = payment.paid_at && !Number.isNaN(Date.parse(payment.paid_at)) ? new Date(payment.paid_at) : new Date();
  return prisma.$transaction(async (tx) => {
    const record = await tx.paymentRecord.findUnique({ where: { providerReference: reference }, select: { id: true, userId: true, amount: true, destination: true, allocationReference: true } });
    if (!record || record.userId !== userId || record.destination !== "OTHER") throw new Error("Wallet deposit reference was not found for this member.");
    if (Number(payment.amount) !== Math.round(Number(record.amount) * 100)) throw new Error("Paid amount does not match the wallet deposit.");
    const allocation = "WALLET-DEPOSIT-" + reference;
    const claim = await tx.paymentRecord.updateMany({ where: { id: record.id, allocationReference: null, status: "PENDING" }, data: { status: "COMPLETED", verifiedAt: paidAt, allocationReference: allocation } });
    if (claim.count === 0) {
      const latest = await tx.paymentRecord.findUnique({ where: { id: record.id }, select: { allocationReference: true } });
      if (latest?.allocationReference) return { alreadyProcessed: true, reference, amount: Number(record.amount) };
      throw new Error("Wallet deposit could not be claimed for processing.");
    }
    await tx.wallet.upsert({ where: { userId }, create: { userId, balance: record.amount }, update: { balance: { increment: record.amount } } });
    await tx.walletTransaction.create({ data: { userId, type: "ADJUSTMENT", status: "COMPLETED", amount: record.amount, reference: allocation, description: "Paystack wallet deposit", completedAt: paidAt } });
    await tx.ledgerEntry.create({ data: { ownerType: "MEMBER", userId, amount: record.amount, type: "ADJUSTMENT", reference: allocation + "-LEDGER", description: "Member wallet deposit confirmed by Paystack" } });
    return { alreadyProcessed: false, reference, amount: Number(record.amount) };
  });
}
