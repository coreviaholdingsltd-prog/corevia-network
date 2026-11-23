import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

const WITHDRAWAL_FEE_RATE = 0.005;
async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  const session = verifySession(token);
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, phone: true, membershipStatus: true },
  });
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, amount: true, fee: true, netAmount: true, status: true,
        reference: true, paymentReference: true, createdAt: true, processedAt: true,
      },
    });
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } });
    return NextResponse.json({
      status: true,
      balance: Number(wallet?.balance ?? 0),
      payoutPhone: user.phone,
      withdrawals,
    });
  } catch (error) {
    console.error("Withdrawal history error:", error);
    return NextResponse.json({ error: "Unable to load withdrawals." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    if (user.membershipStatus !== "ACTIVE") {
      return NextResponse.json({ error: "Your membership must be active before you can withdraw." }, { status: 403 });
    }
    if (!user.phone) {
      return NextResponse.json({ error: "Add your M-PESA number to your member account before requesting a withdrawal." }, { status: 400 });
    }

    const body = await request.json();
    if (body.confirmBeneficiary !== true) {
      return NextResponse.json({ error: "Confirm that the M-PESA number on your member profile belongs to you." }, { status: 400 });
    }
    const requestKey = String(body.requestKey ?? "");
    if (!/^[a-zA-Z0-9_-]{16,80}$/.test(requestKey)) {
      return NextResponse.json({ error: "A valid withdrawal request key is required. Please refresh and try again." }, { status: 400 });
    }

    const phoneDigits = user.phone.replace(/[^\d]/g, "");
    const beneficiaryPhone = phoneDigits.startsWith("0")
      ? "254" + phoneDigits.slice(1)
      : phoneDigits.startsWith("7") || phoneDigits.startsWith("1")
        ? "254" + phoneDigits
        : phoneDigits;
    if (!/^254[17]\d{8}$/.test(beneficiaryPhone)) {
      return NextResponse.json({ error: "Your member-profile phone number is not a valid Kenyan M-PESA mobile number. Update it before withdrawing." }, { status: 400 });
    }

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Enter a valid withdrawal amount." }, { status: 400 });
    }
    const normalizedAmount = Math.round(amount * 100) / 100;
    if (normalizedAmount < 500) {
      return NextResponse.json({ error: "The minimum withdrawal amount is KES 500." }, { status: 400 });
    }

    const fee = Math.round(normalizedAmount * WITHDRAWAL_FEE_RATE * 100) / 100;
    const netAmount = Math.round((normalizedAmount - fee) * 100) / 100;
    if (netAmount > 150000) {
      return NextResponse.json({ error: "The maximum M-PESA payout is KES 150,000." }, { status: 400 });
    }

    const idempotencyHash = crypto.createHash("sha256").update(user.id + ":" + requestKey).digest("hex");
    const reference = "cvwd-" + idempotencyHash.slice(0, 32);
    const existing = await prisma.withdrawal.findUnique({
      where: { reference },
      select: { id: true, amount: true, fee: true, netAmount: true, status: true, reference: true, createdAt: true },
    });
    if (existing) {
      return NextResponse.json({
        status: true,
        message: "This withdrawal request has already been received. It will not be reserved a second time.",
        withdrawal: existing,
      }, { status: 202 });
    }

    const queued = await prisma.$transaction(async (tx) => {
      // Serialize reservations so concurrent requests cannot overspend the wallet.
      await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(724190112)) AS lock_result`;
      const duplicate = await tx.withdrawal.findUnique({
        where: { reference },
        select: { id: true, amount: true, fee: true, netAmount: true, status: true, reference: true, createdAt: true },
      });
      if (duplicate) return { withdrawal: duplicate, remainingBalance: null, duplicate: true };

      const wallet = await tx.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } });
      if (!wallet) throw new Error("Wallet not found.");
      const available = Number(wallet.balance);
      if (normalizedAmount > available) {
        throw new Error("Insufficient wallet balance. Available balance is KES " + available.toFixed(2) + ".");
      }
      const changed = await tx.wallet.updateMany({
        where: { userId: user.id, balance: { gte: normalizedAmount } },
        data: { balance: { decrement: normalizedAmount } },
      });
      if (changed.count !== 1) throw new Error("Wallet balance changed. Please try again.");

      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: user.id,
          amount: normalizedAmount,
          fee,
          netAmount,
          status: "PENDING",
          reference,
          beneficiaryPhone,
          processorStatus: "queued",
        },
        select: { id: true, amount: true, fee: true, netAmount: true, status: true, reference: true, createdAt: true },
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            ownerType: "MEMBER", userId: user.id, amount: -fee, type: "WITHDRAWAL_FEE",
            reference: reference + "-fee-member",
            description: "0.50% Corevia withdrawal fee on " + reference,
          },
          {
            ownerType: "COREVIA", amount: fee, type: "WITHDRAWAL_FEE",
            reference: reference + "-fee-corevia",
            description: "0.50% withdrawal fee earned by Corevia. Till 6959300",
          },
          {
            ownerType: "MEMBER", userId: user.id, amount: -netAmount, type: "WITHDRAWAL",
            reference: reference + "-payout-principal-member",
            description: "Member wallet funds reserved for queued M-PESA withdrawal " + reference,
          },
        ],
      });
      await tx.walletTransaction.create({
        data: {
          userId: user.id, type: "WITHDRAWAL", status: "PENDING", amount: normalizedAmount,
          reference: reference + "-wallet",
          description: "Queued M-PESA withdrawal " + reference + "; awaiting payout processing",
        },
      });
      return { withdrawal, remainingBalance: available - normalizedAmount, duplicate: false };
    });

    return NextResponse.json({
      status: true,
      message: queued.duplicate
        ? "This withdrawal request has already been received and remains pending."
        : "Your withdrawal request has been received and reserved. Its status is Pending; no M-PESA payment has been sent yet.",
      withdrawal: queued.withdrawal,
      remainingBalance: queued.remainingBalance,
    }, { status: 202 });
  } catch (error) {
    console.error("Withdrawal request error:", error);
    const message = error instanceof Error ? error.message : "Unable to submit withdrawal request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
