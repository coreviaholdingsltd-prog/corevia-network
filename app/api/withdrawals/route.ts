import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import { isPaystackPayoutEnabled } from "@/lib/paystack-payout-guard.mjs";

const WITHDRAWAL_FEE_RATE = 0.005;
const COREVIA_TILL_NUMBER = "6959300";
// Keep live transfers hard-disabled until reconciliation and end-to-end payout tests are complete.
const PAYOUT_TRANSFER_LIFECYCLE_VERIFIED = false;
async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  const session = verifySession(token);

  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      membershipStatus: true,
    },
  });
}

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        fee: true,
        netAmount: true,
        status: true,
        reference: true,
        paymentReference: true,
        createdAt: true,
        processedAt: true,
      },
    });

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
      select: { balance: true },
    });

    return NextResponse.json({
      status: true,
      balance: Number(wallet?.balance ?? 0),
      payoutPhone: user.phone,
      withdrawals,
    });
  } catch (error) {
    console.error("Withdrawal history error:", error);

    return NextResponse.json(
      { error: "Unable to load withdrawals." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Keep disabled until Paystack test-mode lifecycle tests and production
    // balance/float checks have been completed and signed off.
    if (!isPaystackPayoutEnabled(process.env, PAYOUT_TRANSFER_LIFECYCLE_VERIFIED)) {
      return NextResponse.json(
        { error: "Automated M-PESA withdrawals are not enabled yet. Your wallet has not been debited." },
        { status: 503 },
      );
    }

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
    const payoutReference = "cvp-" + idempotencyHash.slice(0, 40);

    const existing = await prisma.withdrawal.findUnique({
      where: { reference },
      select: { id: true, amount: true, fee: true, netAmount: true, status: true, reference: true, createdAt: true, payoutReference: true },
    });
    if (existing) {
      return NextResponse.json({
        status: true,
        message: "This withdrawal request has already been received. It will not be submitted a second time.",
        withdrawal: existing,
      }, { status: 202 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Paystack is not configured. Your wallet has not been debited." }, { status: 503 });
    }

    // Create the recipient before reserving member funds. The phone is sourced
    // from the signed-in member profile, not an arbitrary request parameter.
    const recipientResponse = await fetch("https://api.paystack.co/transferrecipient", {
      method: "POST",
      headers: { Authorization: "Bearer " + secretKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "mobile_money",
        name: user.name,
        account_number: beneficiaryPhone,
        bank_code: "MPESA",
        currency: "KES",
        email: user.email,
      }),
      cache: "no-store",
    });
    const recipientPayload = await recipientResponse.json().catch(() => null);
    const recipientCode = recipientPayload?.data?.recipient_code;
    if (!recipientResponse.ok || recipientPayload?.status !== true || typeof recipientCode !== "string") {
      console.error("Paystack recipient creation failed:", {
        status: recipientResponse.status,
        message: recipientPayload?.message,
      });
      return NextResponse.json({ error: "Paystack could not register this M-PESA recipient. Your wallet has not been debited." }, { status: 502 });
    }

    const reserved = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId: user.id },
        select: { balance: true },
      });
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
          status: "PROCESSING",
          reference,
          beneficiaryPhone,
          recipientCode,
          payoutReference,
          processorStatus: "reserved",
          initiatedAt: new Date(),
        },
        select: { id: true, amount: true, fee: true, netAmount: true, status: true, reference: true, createdAt: true, payoutReference: true },
      });

      await tx.ledgerEntry.create({
        data: { ownerType: "MEMBER", userId: user.id, amount: -fee, type: "WITHDRAWAL_FEE", reference: reference + "-fee-member", description: "0.50% Corevia withdrawal fee on " + reference },
      });
      await tx.ledgerEntry.create({
        data: { ownerType: "COREVIA", amount: fee, type: "WITHDRAWAL_FEE", reference: reference + "-fee-corevia", description: "0.50% withdrawal fee earned by Corevia. Till " + COREVIA_TILL_NUMBER },
      });
      await tx.walletTransaction.create({
        data: { userId: user.id, type: "WITHDRAWAL", status: "PENDING", amount: normalizedAmount, reference: reference + "-wallet", description: "Paystack M-PESA payout " + reference },
      });
      return { withdrawal, remainingBalance: available - normalizedAmount };
    });

    // A deterministic provider reference is persisted before calling Paystack.
    // If the network response is ambiguous, leave funds reserved and reconcile
    // this same reference; never create a fresh transfer on a retry.
    let transferResponse: Response;
    let transferPayload: { status?: boolean; message?: string; data?: { status?: string; transfer_code?: string } } | null;
    try {
      transferResponse = await fetch("https://api.paystack.co/transfer", {
        method: "POST",
        headers: { Authorization: "Bearer " + secretKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "balance",
          amount: Math.round(netAmount * 100),
          recipient: recipientCode,
          reference: payoutReference,
          currency: "KES",
          reason: "Corevia Network member wallet withdrawal",
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });
      transferPayload = await transferResponse.json().catch(() => null);
    } catch (error) {
      console.error("Paystack transfer response is ambiguous:", error);
      return NextResponse.json({
        status: true,
        message: "Your payout request is reserved and awaiting Paystack confirmation. Do not submit it again.",
        withdrawal: reserved.withdrawal,
        remainingBalance: reserved.remainingBalance,
      }, { status: 202 });
    }

    if (transferResponse.status >= 500) {
      console.error("Paystack transfer server response is ambiguous:", transferResponse.status);
      return NextResponse.json({
        status: true,
        message: "Your payout is awaiting provider reconciliation. Do not submit it again.",
        withdrawal: reserved.withdrawal,
        remainingBalance: reserved.remainingBalance,
      }, { status: 202 });
    }

    if (!transferResponse.ok || transferPayload?.status !== true || !transferPayload?.data) {
      const providerMessage = String(transferPayload?.message ?? "Paystack rejected the transfer.");
      await prisma.$transaction(async (tx) => {
        const changed = await tx.withdrawal.updateMany({
          where: { id: reserved.withdrawal.id, status: "PROCESSING" },
          data: { status: "FAILED", processorStatus: "rejected", settledAt: new Date(), processedAt: new Date() },
        });
        if (changed.count !== 1) return;
        await tx.wallet.update({ where: { userId: user.id }, data: { balance: { increment: normalizedAmount } } });
        await tx.ledgerEntry.create({
          data: { ownerType: "MEMBER", userId: user.id, amount: normalizedAmount, type: "ADJUSTMENT", reference: reference + "-payout-refund-member", description: "Refund of rejected Paystack payout " + payoutReference },
        });
        await tx.ledgerEntry.create({
          data: { ownerType: "COREVIA", amount: -fee, type: "ADJUSTMENT", reference: reference + "-payout-refund-corevia", description: "Reverse Corevia fee for rejected payout " + payoutReference },
        });
        await tx.walletTransaction.updateMany({ where: { reference: reference + "-wallet", status: "PENDING" }, data: { status: "FAILED", completedAt: new Date() } });
      });
      return NextResponse.json({ error: "Paystack rejected the payout: " + providerMessage + ". The wallet reservation has been restored." }, { status: 502 });
    }

    await prisma.withdrawal.updateMany({
      where: { id: reserved.withdrawal.id, status: "PROCESSING" },
      data: {
        processorStatus: String(transferPayload.data.status ?? "pending"),
        transferCode: typeof transferPayload.data.transfer_code === "string" ? transferPayload.data.transfer_code : undefined,
        initiatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: true,
      message: "Paystack accepted the M-PESA payout. Final settlement will be confirmed by Paystack's signed webhook.",
      withdrawal: reserved.withdrawal,
      remainingBalance: reserved.remainingBalance,
    }, { status: 202 });
  } catch (error) {
    console.error("Withdrawal request error:", error);
    const message = error instanceof Error ? error.message : "Unable to submit withdrawal request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
