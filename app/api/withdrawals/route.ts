import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import {
  getDarajaAccessToken,
  getDarajaConfig,
  makeOriginatorConversationId,
  normalizeMpesaPhone,
  submitB2CPayment,
} from "@/lib/mpesa/b2c";
import { settleWithdrawalFailure } from "@/lib/mpesa/settlement";

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
        message: "This withdrawal request was already received. Its existing status is shown; no second M-PESA payment was submitted.",
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
        error: `Withdrawal ${pendingWithdrawal.reference} is still processing. Wait for its M-PESA result before submitting another request.`,
      }, { status: 409 });
    }

    const config = getDarajaConfig();
    const phone = normalizeMpesaPhone(user.phone);
    // Authenticate before debiting the member wallet.
    const accessToken = await getDarajaAccessToken(config);

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
    if (netAmount > MAX_NET_PAYOUT) {
      return NextResponse.json({
        error: "The maximum M-PESA withdrawal payout is KES 150,000. The maximum wallet deduction is KES 150,753.77 including the 0.50% fee.",
      }, { status: 400 });
    }
    if (!Number.isInteger(netAmount)) {
      return NextResponse.json({
        error: "Daraja B2C pays whole shillings only. Adjust the withdrawal amount so the payout after the 0.50% fee is a whole KES amount.",
      }, { status: 400 });
    }

    const reference = `CV-WD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const originatorConversationId = makeOriginatorConversationId();

    const created = await prisma.$transaction(async (tx) => {
      // Serialize withdrawal creation per member so parallel requests cannot queue two payouts.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${user.id}))`;
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
          originatorConversationId,
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
            description: `0.50% withdrawal fee earned by Corevia. Till ${COREVIA_TILL_NUMBER}`,
          },
        ],
      });

      await tx.walletTransaction.create({
        data: {
          userId: user.id, type: "WITHDRAWAL", status: "PENDING",
          amount: normalizedAmount, reference: `${reference}-WALLET`,
          description: `Daraja B2C payout to ${phone}; reference ${reference}`,
        },
      });

      return { withdrawal, remainingBalance: available - normalizedAmount };
    });

    let acknowledgement;
    try {
      acknowledgement = await submitB2CPayment({
        config, accessToken, amount: netAmount, phone, reference, originatorConversationId,
      });
    } catch (error) {
      // Do not refund on an ambiguous network/HTTP failure: Safaricom may have accepted the payout.
      console.error("Daraja B2C submission outcome is uncertain:", error);
      return NextResponse.json({
        status: true,
        message: "Your withdrawal was submitted and is being reconciled with M-PESA. Do not submit it again.",
        withdrawal: created.withdrawal,
        remainingBalance: created.remainingBalance,
      }, { status: 202 });
    }

    if (String(acknowledgement.ResponseCode) !== "0") {
      await settleWithdrawalFailure(
        reference,
        Number(acknowledgement.ResponseCode) || -1,
        acknowledgement.ResponseDescription || "Safaricom rejected the B2C request.",
      );
      return NextResponse.json({
        error: acknowledgement.ResponseDescription || "Safaricom rejected the withdrawal request. Your wallet has been refunded.",
      }, { status: 502 });
    }

    await prisma.withdrawal.updateMany({
      where: { id: created.withdrawal.id, status: "PROCESSING" },
      data: {
        conversationId: acknowledgement.ConversationID || null,
        paymentReference: acknowledgement.OriginatorConversationID || originatorConversationId,
      },
    });

    return NextResponse.json({
      status: true,
      message: "M-PESA payout request accepted by Safaricom. Your withdrawal will show as PAID only after Safaricom confirms the result.",
      withdrawal: created.withdrawal,
      remainingBalance: created.remainingBalance,
    }, { status: 202 });
  } catch (error) {
    console.error("Withdrawal request error:", error);
    const message = error instanceof Error ? error.message : "Unable to submit withdrawal request.";
    const status = message.startsWith("Missing server environment variable") || message.includes("callback URLs")
      ? 503
      : message.includes("authentication failed")
        ? 502
        : message.startsWith("An existing withdrawal")
          ? 409
          : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
