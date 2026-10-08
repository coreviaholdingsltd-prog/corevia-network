import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

const WITHDRAWAL_FEE_RATE = 0.005;
const COREVIA_TILL_NUMBER = "6959300";

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
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    if (user.membershipStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your membership must be active before you can withdraw." },
        { status: 403 },
      );
    }

    if (!user.phone) {
      return NextResponse.json(
        {
          error:
            "Add and verify a phone number on your member account before requesting a withdrawal.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Enter a valid withdrawal amount." },
        { status: 400 },
      );
    }

    const normalizedAmount = Math.round(amount * 100) / 100;
    const fee = Math.round(normalizedAmount * WITHDRAWAL_FEE_RATE * 100) / 100;
    const netAmount = Math.round((normalizedAmount - fee) * 100) / 100;
    const reference =
      `CV-WD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const result = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId: user.id },
        select: { balance: true },
      });

      if (!wallet) {
        throw new Error("Wallet not found.");
      }

      const available = Number(wallet.balance);

      if (normalizedAmount > available) {
        throw new Error(
          `Insufficient wallet balance. Available balance is KES ${available.toFixed(2)}.`,
        );
      }

      const changed = await tx.wallet.updateMany({
        where: {
          userId: user.id,
          balance: {
            gte: normalizedAmount,
          },
        },
        data: {
          balance: {
            decrement: normalizedAmount,
          },
        },
      });

      if (changed.count !== 1) {
        throw new Error(
          "Withdrawal could not be completed because the wallet balance changed. Please try again.",
        );
      }

      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: user.id,
          amount: normalizedAmount,
          fee,
          netAmount,
          status: "PENDING",
          reference,
        },
        select: {
          id: true,
          amount: true,
          fee: true,
          netAmount: true,
          status: true,
          reference: true,
          createdAt: true,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          ownerType: "MEMBER",
          userId: user.id,
          amount: -fee,
          type: "WITHDRAWAL_FEE",
          reference: `${reference}-FEE-MEMBER`,
          description: `0.50% Corevia withdrawal fee on ${reference}`,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          ownerType: "COREVIA",
          amount: fee,
          type: "WITHDRAWAL_FEE",
          reference: `${reference}-FEE-COREVIA`,
          description: `0.50% withdrawal fee earned by Corevia. Till ${COREVIA_TILL_NUMBER}`,
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: user.id,
          type: "WITHDRAWAL",
          status: "PENDING",
          amount: normalizedAmount,
          reference: `${reference}-WALLET`,
          description: `Withdrawal request ${reference}`,
        },
      });

      return {
        withdrawal,
        remainingBalance: available - normalizedAmount,
      };
    });

    return NextResponse.json({
      status: true,
      message: "Withdrawal request submitted successfully.",
      withdrawal: result.withdrawal,
      remainingBalance: result.remainingBalance,
    });
  } catch (error) {
    console.error("Withdrawal request error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to submit withdrawal request.";

    return NextResponse.json(
      { error: message },
      { status: 400 },
    );
  }
}

