import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import {
  applyPaystackTransferStatus,
  createPaystackMpesaRecipient,
  initiatePaystackMpesaTransfer,
  normalizeKenyanMpesaPhone,
  PaystackApiError,
  setWithdrawalPendingForRetry,
  verifyPaystackTransfer,
} from "@/lib/paystack-transfers";

const WITHDRAWAL_FEE_RATE = 0.005;
const COREVIA_TILL_NUMBER = "6959300";
const MIN_WITHDRAWAL_KSH = 500;
const MAX_MPESA_TRANSFER_KSH = 250000;

class WithdrawalRouteError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "WithdrawalRouteError";
    this.statusCode = statusCode;
  }
}

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

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function serializeWithdrawal(withdrawal: {
  id: string;
  amount: unknown;
  fee: unknown;
  netAmount: unknown;
  status: string;
  reference: string;
  paymentReference: string | null;
  createdAt: Date;
  processedAt: Date | null;
}) {
  return {
    ...withdrawal,
    amount: Number(withdrawal.amount),
    fee: Number(withdrawal.fee),
    netAmount: Number(withdrawal.netAmount),
  };
}

async function withdrawalResponse(
  reference: string,
  message: string,
  httpStatus = 200,
) {
  const withdrawal = await prisma.withdrawal.findUnique({
    where: { reference },
    select: {
      userId: true,
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

  if (!withdrawal) {
    return NextResponse.json(
      { error: "Withdrawal record not found." },
      { status: 404 },
    );
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: withdrawal.userId },
    select: { balance: true },
  });

  const { userId: _userId, ...publicWithdrawal } = withdrawal;

  return NextResponse.json(
    {
      status: true,
      message,
      withdrawal: serializeWithdrawal(publicWithdrawal),
      remainingBalance: Number(wallet?.balance ?? 0),
    },
    { status: httpStatus },
  );
}

function transferMessage(status: string) {
  switch (status.toLowerCase()) {
    case "success":
      return "Paystack confirmed the M-PESA payout as successful.";
    case "failed":
    case "reversed":
    case "abandoned":
    case "blocked":
    case "rejected":
      return "Paystack could not complete the payout. The withdrawal has been reversed and the full amount returned to your wallet.";
    case "otp":
      return "Paystack requires additional account OTP approval. The payout has not been completed; the transfer remains recorded.";
    case "received":
    case "pending":
    default:
      return "The withdrawal has been recorded and pushed to Paystack. It is awaiting transfer confirmation.";
  }
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

    const [withdrawals, wallet] = await Promise.all([
      prisma.withdrawal.findMany({
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
      }),
      prisma.wallet.findUnique({
        where: { userId: user.id },
        select: { balance: true },
      }),
    ]);

    return NextResponse.json({
      status: true,
      balance: Number(wallet?.balance ?? 0),
      payoutPhone: user.phone,
      withdrawals: withdrawals.map(serializeWithdrawal),
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

    let input: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json(
          { error: "Send valid withdrawal details." },
          { status: 400 },
        );
      }
      input = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Send a valid JSON request." },
        { status: 400 },
      );
    }

    if (user.membershipStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your membership must be active before you can withdraw." },
        { status: 403 },
      );
    }

    if (!user.phone || !normalizeKenyanMpesaPhone(user.phone)) {
      return NextResponse.json(
        {
          error:
            "Add a valid Kenyan M-PESA mobile number to your member account before requesting a withdrawal.",
        },
        { status: 400 },
      );
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Paystack transfers are not configured yet. No funds were deducted." },
        { status: 503 },
      );
    }

    const requestKey =
      typeof input.requestKey === "string" ? input.requestKey.trim().toLowerCase() : "";
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        requestKey,
      )
    ) {
      return NextResponse.json(
        { error: "A valid withdrawal request key is required. Please try again." },
        { status: 400 },
      );
    }

    const amountInput =
      typeof input.amount === "number" || typeof input.amount === "string"
        ? Number(input.amount)
        : Number.NaN;

    if (
      !Number.isFinite(amountInput) ||
      amountInput <= 0 ||
      amountInput > 100000000
    ) {
      return NextResponse.json(
        { error: "Enter a valid withdrawal amount." },
        { status: 400 },
      );
    }

    const amountCents = Math.round(amountInput * 100);
    if (Math.abs(amountInput * 100 - amountCents) > 0.000001) {
      return NextResponse.json(
        { error: "Use no more than two decimal places for the withdrawal amount." },
        { status: 400 },
      );
    }

    const normalizedAmount = amountCents / 100;
    if (normalizedAmount < MIN_WITHDRAWAL_KSH) {
      return NextResponse.json(
        { error: "The minimum withdrawal amount is KES 500." },
        { status: 400 },
      );
    }

    const feeCents = Math.round(amountCents * WITHDRAWAL_FEE_RATE);
    const netCents = amountCents - feeCents;
    const fee = feeCents / 100;
    const netAmount = netCents / 100;

    if (netAmount > MAX_MPESA_TRANSFER_KSH) {
      return NextResponse.json(
        { error: "The maximum single Paystack M-PESA withdrawal is KES 250,000 after the Corevia fee." },
        { status: 400 },
      );
    }

    const reference = "cvwd_" + requestKey;
    let withdrawal = await prisma.withdrawal.findUnique({
      where: { reference },
    });
    let createdNow = false;

    if (withdrawal && withdrawal.userId !== user.id) {
      return NextResponse.json(
        { error: "This withdrawal request key is already in use." },
        { status: 409 },
      );
    }

    if (withdrawal && Math.round(Number(withdrawal.amount) * 100) !== amountCents) {
      return NextResponse.json(
        { error: "This request key belongs to a different amount. Start a new withdrawal request." },
        { status: 409 },
      );
    }

    if (!withdrawal) {
      try {
        withdrawal = await prisma.$transaction(async (tx) => {
          const wallet = await tx.wallet.findUnique({
            where: { userId: user.id },
            select: { balance: true },
          });

          if (!wallet) {
            throw new WithdrawalRouteError("Wallet not found.", 404);
          }

          const available = Number(wallet.balance);
          if (normalizedAmount > available) {
            throw new WithdrawalRouteError(
              "Insufficient wallet balance. Available balance is KES " +
                available.toFixed(2) +
                ".",
              400,
            );
          }

          const debit = await tx.wallet.updateMany({
            where: {
              userId: user.id,
              balance: { gte: normalizedAmount },
            },
            data: { balance: { decrement: normalizedAmount } },
          });

          if (debit.count !== 1) {
            throw new WithdrawalRouteError(
              "Your wallet balance changed during this request. Please try again.",
              409,
            );
          }

          const created = await tx.withdrawal.create({
            data: {
              userId: user.id,
              amount: normalizedAmount,
              fee,
              netAmount,
              status: "PENDING",
              reference,
            },
          });

          await tx.ledgerEntry.createMany({
            data: [
              {
                ownerType: "MEMBER",
                userId: user.id,
                amount: -fee,
                type: "WITHDRAWAL_FEE",
                reference: reference + "-FEE-MEMBER",
                description: "0.50% Corevia withdrawal fee on " + reference,
              },
              {
                ownerType: "COREVIA",
                amount: fee,
                type: "WITHDRAWAL_FEE",
                reference: reference + "-FEE-COREVIA",
                description:
                  "0.50% withdrawal fee earned by Corevia. Till " +
                  COREVIA_TILL_NUMBER,
              },
            ],
          });

          await tx.walletTransaction.create({
            data: {
              userId: user.id,
              type: "WITHDRAWAL",
              status: "PENDING",
              amount: normalizedAmount,
              reference: reference + "-WALLET",
              description: "Withdrawal request " + reference,
            },
          });

          return created;
        });
        createdNow = true;
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          withdrawal = await prisma.withdrawal.findUnique({
            where: { reference },
          });
          if (!withdrawal || withdrawal.userId !== user.id) {
            return NextResponse.json(
              { error: "This withdrawal request could not be created safely. Please retry." },
              { status: 409 },
            );
          }
          if (Math.round(Number(withdrawal.amount) * 100) !== amountCents) {
            return NextResponse.json(
              { error: "This request key belongs to a different amount." },
              { status: 409 },
            );
          }
        } else if (error instanceof WithdrawalRouteError) {
          return NextResponse.json(
            { error: error.message },
            { status: error.statusCode },
          );
        } else {
          throw error;
        }
      }
    }

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Unable to create the withdrawal record." },
        { status: 500 },
      );
    }

    if (withdrawal.status === "PAID") {
      return withdrawalResponse(reference, "This withdrawal has already been paid.");
    }
    if (withdrawal.status === "FAILED" || withdrawal.status === "REJECTED") {
      return withdrawalResponse(
        reference,
        "This withdrawal has already failed and the reserved amount has been returned to your wallet.",
      );
    }

    if (!createdNow && withdrawal.status === "PROCESSING") {
      try {
        const verified = await verifyPaystackTransfer(reference);
        if (verified) {
          await applyPaystackTransferStatus({
            reference,
            status: verified.status || "pending",
            amount: verified.amount,
            currency: verified.currency,
            transferCode: verified.transfer_code,
          });
          return withdrawalResponse(
            reference,
            transferMessage(verified.status || "pending"),
          );
        }
      } catch (error) {
        console.error("Paystack withdrawal verification error:", error);
      }

      return withdrawalResponse(
        reference,
        "This withdrawal is already being processed by Paystack. Do not submit a new request; the status will update when Paystack confirms it.",
      );
    }

    if (!createdNow && withdrawal.status === "PENDING") {
      try {
        const verified = await verifyPaystackTransfer(reference);
        if (verified) {
          await applyPaystackTransferStatus({
            reference,
            status: verified.status || "pending",
            amount: verified.amount,
            currency: verified.currency,
            transferCode: verified.transfer_code,
          });
          return withdrawalResponse(
            reference,
            transferMessage(verified.status || "pending"),
          );
        }
      } catch (error) {
        console.error("Paystack withdrawal verification error:", error);
        return withdrawalResponse(
          reference,
          "The withdrawal is safely recorded, but Paystack could not be reached to verify its status. Retry this same request later; do not create a new one.",
        );
      }
    }

    const claimed = await prisma.withdrawal.updateMany({
      where: { id: withdrawal.id, status: "PENDING" },
      data: { status: "PROCESSING" },
    });

    if (claimed.count !== 1) {
      return withdrawalResponse(
        reference,
        "This withdrawal is already being processed. Please wait for the Paystack confirmation.",
      );
    }

    let recipientCode: string;
    try {
      recipientCode = await createPaystackMpesaRecipient({
        name: user.name,
        phone: user.phone!,
      });
    } catch (error) {
      console.error("Paystack M-PESA recipient creation error:", error);

      if (
        error instanceof PaystackApiError &&
        (error.statusCode === 400 || error.statusCode === 422)
      ) {
        await applyPaystackTransferStatus({
          reference,
          status: "failed",
        });
        return withdrawalResponse(
          reference,
          "Paystack rejected the M-PESA recipient details. The withdrawal was reversed and the full amount returned to your wallet.",
        );
      }

      await setWithdrawalPendingForRetry(reference);
      return withdrawalResponse(
        reference,
        "The withdrawal is recorded, but Paystack could not complete recipient setup. Your funds remain reserved. Use Retry after the connection is restored.",
      );
    }

    try {
      const transfer = await initiatePaystackMpesaTransfer({
        amountKsh: netAmount,
        recipientCode,
        reference,
      });

      await applyPaystackTransferStatus({
        reference,
        status: transfer.status || "pending",
        amount: transfer.amount,
        currency: transfer.currency || "KES",
        transferCode: transfer.transfer_code,
      });

      return withdrawalResponse(
        reference,
        transferMessage(transfer.status || "pending"),
      );
    } catch (error) {
      const providerMessage =
        error instanceof Error ? error.message : "Paystack transfer error";
      console.error("Paystack M-PESA transfer initiation error:", error);

      if (/balance is not enough|insufficient balance/i.test(providerMessage)) {
        await setWithdrawalPendingForRetry(reference);
        return withdrawalResponse(
          reference,
          "Your withdrawal is recorded, but the Paystack transfer balance is insufficient. No M-PESA payout has been sent. Your funds remain reserved; use Retry after the Paystack Balance is funded.",
        );
      }

      let verified = null;
      try {
        verified = await verifyPaystackTransfer(reference);
      } catch (verificationError) {
        console.error(
          "Paystack transfer reconciliation error:",
          verificationError,
        );
      }

      if (verified) {
        await applyPaystackTransferStatus({
          reference,
          status: verified.status || "pending",
          amount: verified.amount,
          currency: verified.currency,
          transferCode: verified.transfer_code,
        });
        return withdrawalResponse(
          reference,
          transferMessage(verified.status || "pending"),
        );
      }

      const duplicateReference = /reference already exists|unique reference/i.test(
        providerMessage,
      );
      if (
        error instanceof PaystackApiError &&
        (error.statusCode === 400 || error.statusCode === 422) &&
        !duplicateReference
      ) {
        await applyPaystackTransferStatus({
          reference,
          status: "failed",
        });
        return withdrawalResponse(
          reference,
          "Paystack rejected the transfer request. The withdrawal was reversed and the full amount returned to your wallet.",
        );
      }

      await setWithdrawalPendingForRetry(reference);
      return withdrawalResponse(
        reference,
        "The withdrawal is recorded, but the transfer result could not be confirmed. No new withdrawal was created. Use Retry with this same request after Paystack is reachable.",
      );
    }
  } catch (error) {
    console.error("Withdrawal request error:", error);
    return NextResponse.json(
      { error: "Unable to submit the withdrawal request. Please try again." },
      { status: 500 },
    );
  }
}
