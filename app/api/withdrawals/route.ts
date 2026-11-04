import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import {
  createKenyaMpesaRecipient,
  initiateKenyaMpesaTransfer,
  getPaystackKesBalanceSubunits,
} from "@/lib/paystack/transfers";

const WITHDRAWAL_FEE_RATE = 0.005;
const MAX_NET_PAYOUT = 150000;
const COREVIA_TILL_NUMBER = "6959300";

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

    const [withdrawals, wallet] = await Promise.all([
      prisma.withdrawal.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true, amount: true, fee: true, netAmount: true, status: true,
          reference: true, paymentReference: true, mpesaReceiptNumber: true,
          resultCode: true, resultDescription: true,
          createdAt: true, processedAt: true,
        },
      }),
      prisma.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } }),
    ]);

    return NextResponse.json({
      status: true,
      balance: Number(wallet?.balance ?? 0),
      withdrawals,
    });
  } catch (error) {
    console.error("Withdrawal history error:", error);
    return NextResponse.json({ error: "Unable to load withdrawals." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (process.env.COREVIA_WITHDRAWALS_ENABLED !== "true") {
      return NextResponse.json({ error: "Withdrawals are temporarily disabled while payout configuration is being verified." }, { status: 503 });
    }

    const isProductionDeployment = process.env.VERCEL_ENV === "production";
    if (
      isProductionDeployment &&
      (
        process.env.COREVIA_LIVE_WITHDRAWALS_APPROVED !== "true" ||
        process.env.COREVIA_TILL_FEE_TRANSFER_READY !== "true"
      )
    ) {
      return NextResponse.json({
        error: "Live withdrawals are locked until company live-payout approval and the separate Corevia Till fee-transfer route are confirmed.",
      }, { status: 503 });
    }
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    if (user.membershipStatus !== "ACTIVE") {
      return NextResponse.json({ error: "Your membership must be active before you can withdraw." }, { status: 403 });
    }
    if (!user.phone) {
      return NextResponse.json({ error: "Add and verify a phone number on your member account before requesting a withdrawal." }, { status: 400 });
    }

    const body = await request.json();
    const requestKey = String(body.requestKey || "");
    if (requestKey.length < 8 || requestKey.length > 100) {
      return NextResponse.json({ error: "A valid withdrawal request key is required. Refresh the page and try again." }, { status: 400 });
    }

    const previous = await prisma.withdrawal.findFirst({
      where: { userId: user.id, requestKey },
      select: {
        id: true, amount: true, fee: true, netAmount: true, status: true,
        reference: true, createdAt: true,
      },
    });
    if (previous) {
      const wallet = await prisma.wallet.findUnique({ where: { userId: user.id }, select: { balance: true } });
      return NextResponse.json({
        status: true,
        message: "This withdrawal request was already received. Its existing status is shown; no second Paystack transfer was submitted.",
        withdrawal: previous,
        remainingBalance: Number(wallet?.balance ?? 0),
      }, { status: 202 });
    }

    const pendingWithdrawal = await prisma.withdrawal.findFirst({
      where: { userId: user.id, status: { in: ["PENDING", "PROCESSING"] } },
      select: { reference: true },
    });
    if (pendingWithdrawal) {
      return NextResponse.json({
        error: `Withdrawal ${pendingWithdrawal.reference} is still processing. Wait for Paystack confirmation before submitting another request.`,
      }, { status: 409 });
    }

    const digits = user.phone.replace(/\D/g, "");
    const phone = digits.startsWith("0") && digits.length === 10 ? `254${digits.slice(1)}`
      : digits.startsWith("254") && digits.length === 12 ? digits
      : digits.length === 9 && /^[17]/.test(digits) ? `254${digits}` : null;
    if (!phone) return NextResponse.json({ error: "The member phone number must be a valid Kenyan M-PESA number." }, { status: 400 });
    if (process.env.COREVIA_PAYSTACK_WITHDRAWALS_ENABLED !== "true" || process.env.COREVIA_PAYSTACK_NO_OTP_CONFIRMED !== "true") {
      return NextResponse.json({ error: "Paystack Transfers and automated no-OTP approval must be confirmed before withdrawals. Your wallet has not been debited." }, { status: 503 });
    }
    if (isProductionDeployment && (process.env.COREVIA_PAYSTACK_LIVE_READY !== "true" || process.env.COREVIA_PAYSTACK_FLOAT_READY !== "true")) {
      return NextResponse.json({ error: "Paystack live transfer approval and funded KES float must be confirmed. Your wallet has not been debited." }, { status: 503 });
    }
    let recipientCode: string;
    let paystackKesBalanceSubunits: number;
    try {
      const recipient = await createKenyaMpesaRecipient({ name: user.name, phone });
      if (recipient.active !== true || recipient.currency !== "KES" || recipient.type !== "mobile_money") throw new Error("Paystack did not return an active Kenyan M-PESA recipient.");
      recipientCode = recipient.recipient_code;
      paystackKesBalanceSubunits = await getPaystackKesBalanceSubunits();
    } catch (error) {
      console.error("Paystack withdrawal preflight failed:", error);
      return NextResponse.json({ error: "Paystack is not ready. Your wallet has not been debited." }, { status: 503 });
    }

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Enter a valid withdrawal amount." }, { status: 400 });
    }

    const grossAmountCents = Math.round(amount * 100);
    const normalizedAmount = grossAmountCents / 100;
    if (normalizedAmount < 500) {
      return NextResponse.json({ error: "The minimum withdrawal amount is KES 500." }, { status: 400 });
    }

    // Calculate in integer cents to avoid floating-point rounding drift.
    const feeCents = Math.round(grossAmountCents * WITHDRAWAL_FEE_RATE);
    const netAmountCents = grossAmountCents - feeCents;
    const fee = feeCents / 100;
    const netAmount = netAmountCents / 100;
    if (netAmount > MAX_NET_PAYOUT) {
      return NextResponse.json({
        error: "The maximum Paystack M-PESA withdrawal payout is KES 150,000. The maximum wallet deduction is KES 150,753.77 including the 0.50% fee.",
      }, { status: 400 });
    }

    if (paystackKesBalanceSubunits < netAmountCents) {
      return NextResponse.json({ error: "Paystack's available KES balance is below this payout. Your wallet has not been debited." }, { status: 503 });
    }

    const reference = `CV-WD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const paystackReference = `cvps_${crypto.randomBytes(16).toString("hex")}`;

    const created = await prisma.$transaction(async (tx) => {
      // Serialize withdrawal creation per member so parallel requests cannot queue two payouts.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${user.id})) IS NULL AS lock_acquired`;
      const pending = await tx.withdrawal.findFirst({
        where: { userId: user.id, status: { in: ["PENDING", "PROCESSING"] } },
        select: { reference: true },
      });
      if (pending) {
        throw new Error(`An existing withdrawal ${pending.reference} is still processing. Wait for its M-PESA result before submitting another request.`);
      }

      const wallet = await tx.wallet.findUnique({
        where: { userId: user.id },
        select: { balance: true },
      });
      if (!wallet) throw new Error("Wallet not found.");

      const available = Number(wallet.balance);
      if (normalizedAmount > available) {
        throw new Error(`Insufficient wallet balance. Available balance is KES ${available.toFixed(2)}.`);
      }

      const changed = await tx.wallet.updateMany({
        where: { userId: user.id, balance: { gte: normalizedAmount } },
        data: { balance: { decrement: normalizedAmount } },
      });
      if (changed.count !== 1) {
        throw new Error("Wallet balance changed. Refresh and try again.");
      }

      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: user.id,
          amount: normalizedAmount,
          fee,
          netAmount,
          status: "PROCESSING",
          reference,
          requestKey,
          phoneNumber: phone,
          paymentReference: paystackReference,
        },
        select: { id: true, amount: true, fee: true, netAmount: true, status: true, reference: true, createdAt: true },
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            ownerType: "MEMBER", userId: user.id, amount: -fee, type: "WITHDRAWAL_FEE",
            reference: `${reference}-FEE-MEMBER`,
            description: `0.50% Corevia withdrawal fee on ${reference}`,
          },
          {
            ownerType: "COREVIA", amount: fee, type: "WITHDRAWAL_FEE",
            reference: `${reference}-FEE-COREVIA`,
            description: `0.50% withdrawal fee accrued to Corevia; external settlement to Till ${COREVIA_TILL_NUMBER} is separate and not confirmed by this ledger entry.`,
          },
        ],
      });

      await tx.walletTransaction.create({
        data: {
          userId: user.id, type: "WITHDRAWAL", status: "PENDING",
          amount: normalizedAmount, reference: `${reference}-WALLET`,
          description: `Paystack M-PESA transfer to ${phone}; reference ${reference}`,
        },
      });

      return { withdrawal, remainingBalance: available - normalizedAmount };
    });

    {
      try {
        const transfer = await initiateKenyaMpesaTransfer({
          recipientCode,
          amountKsh: netAmount,
          reference: paystackReference,
          reason: `Corevia Network withdrawal ${reference}`,
        });
        // The initiation response is an acknowledgement, not our settlement
        // authority. Only a signed terminal webhook or an independent verify
        // request in the reconciliation worker may mark this withdrawal terminal.
        return NextResponse.json({
          status: true,
          message: transfer.status === "otp"
            ? "Paystack requires an approval step. Your withdrawal remains processing until Paystack confirms the transfer."
            : "Paystack received the M-PESA transfer request. Your withdrawal remains processing until a verified terminal result is received.",
          withdrawal: created.withdrawal,
          remainingBalance: created.remainingBalance,
        }, { status: 202 });
      } catch (error) {
        // A network timeout or provider error after transfer submission is ambiguous.
        // Keep the wallet debit and provider lock; never submit a second payout while the provider outcome is uncertain.
        console.error("Paystack transfer submission outcome is uncertain:", error);
        return NextResponse.json({
          status: true,
          message: "Paystack's transfer outcome is being reconciled. Do not submit the withdrawal again.",
          withdrawal: created.withdrawal,
          remainingBalance: created.remainingBalance,
        }, { status: 202 });
      }
    }

  } catch (error) {
    console.error("Withdrawal request error:", error);
    const message = error instanceof Error ? error.message : "Unable to submit withdrawal request.";
    const status = message.startsWith("Missing server environment variable") || message.includes("callback URLs")
      ? 503
      : message.includes("authentication failed")
        ? 502
        : message.startsWith("An existing withdrawal") ||
          message.startsWith("Insufficient available M-PESA payout float")
          ? 409
          : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
