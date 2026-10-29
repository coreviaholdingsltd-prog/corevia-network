
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

const TRANSFER_FEE_RATE = 0.005;
const MIN_TRANSFER_CENTS = 100;

function money(cents: number) {
  return Number((cents / 100).toFixed(2));
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function POST(request: Request) {
  let senderId: string | null = null;
  let requestKey: string | null = null;
  let recipientCode = "";
  let amountCents = 0;

  try {
    const cookieStore = await cookies();
    const session = verifySession(
      cookieStore.get(sessionCookieName)?.value,
    );

    if (!session) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    senderId = session.userId;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Send a valid JSON request." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid transfer details." },
        { status: 400 },
      );
    }

    const input = body as {
      recipientCode?: unknown;
      amount?: unknown;
      requestKey?: unknown;
    };

    recipientCode =
      typeof input.recipientCode === "string"
        ? input.recipientCode.trim().toUpperCase()
        : "";

    requestKey =
      typeof input.requestKey === "string"
        ? input.requestKey.trim()
        : null;

    const amount =
      typeof input.amount === "number" ||
      typeof input.amount === "string"
        ? Number(input.amount)
        : Number.NaN;

    if (!recipientCode || recipientCode.length > 64) {
      return NextResponse.json(
        { error: "Enter the recipient's referral code." },
        { status: 400 },
      );
    }

    if (
      !requestKey ||
      requestKey.length < 8 ||
      requestKey.length > 128
    ) {
      return NextResponse.json(
        { error: "A valid transfer request key is required." },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 100000000
    ) {
      return NextResponse.json(
        { error: "Enter a valid transfer amount." },
        { status: 400 },
      );
    }

    const scaledAmount = amount * 100;
    const roundedCents = Math.round(scaledAmount);

    if (Math.abs(scaledAmount - roundedCents) > 0.0000001) {
      return NextResponse.json(
        { error: "Use no more than two decimal places for the transfer amount." },
        { status: 400 },
      );
    }

    amountCents = roundedCents;

    if (amountCents < MIN_TRANSFER_CENTS) {
      return NextResponse.json(
        { error: "The minimum transfer is KES 1.00." },
        { status: 400 },
      );
    }

    const feeCents = Math.round(
      amountCents * TRANSFER_FEE_RATE,
    );
    const totalDebitCents = amountCents + feeCents;

    const transferAmount = money(amountCents);
    const fee = money(feeCents);
    const totalDebit = money(totalDebitCents);

    const result = await prisma.$transaction(async (tx) => {
      const sender = await tx.user.findUnique({
        where: { id: senderId! },
        select: {
          id: true,
          membershipStatus: true,
        },
      });

      if (!sender) throw new Error("ACCOUNT_NOT_FOUND");

      // Resolve retries before checking current eligibility.
      const previous = await tx.walletTransfer.findUnique({
        where: {
          senderId_requestKey: {
            senderId: sender.id,
            requestKey: requestKey!,
          },
        },
        include: {
          recipient: {
            select: {
              id: true,
              name: true,
              referralCode: true,
            },
          },
        },
      });

      if (previous) {
        if (
          previous.recipient.referralCode !== recipientCode ||
          Math.round(Number(previous.amount) * 100) !== amountCents
        ) {
          throw new Error("REQUEST_KEY_REUSED");
        }

        if (previous.status !== "COMPLETED") {
          throw new Error("TRANSFER_NOT_COMPLETED");
        }

        const currentWallet = await tx.wallet.findUnique({
          where: { userId: sender.id },
          select: { balance: true },
        });

        return {
          reference: previous.reference,
          recipient: {
            name: previous.recipient.name,
            referralCode: previous.recipient.referralCode,
          },
          amount: Number(previous.amount),
          fee: Number(previous.fee),
          totalDebited: Number(previous.totalDebit),
          remainingBalance: currentWallet
            ? Number(currentWallet.balance)
            : null,
          alreadyProcessed: true,
        };
      }

      if (sender.membershipStatus !== "ACTIVE") {
        throw new Error("MEMBERSHIP_INACTIVE");
      }

      const recipient = await tx.user.findUnique({
        where: { referralCode: recipientCode },
        select: {
          id: true,
          name: true,
          referralCode: true,
          membershipStatus: true,
        },
      });

      if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");
      if (recipient.id === sender.id) {
        throw new Error("SELF_TRANSFER");
      }
      if (recipient.membershipStatus !== "ACTIVE") {
        throw new Error("RECIPIENT_INACTIVE");
      }

      const senderWallet = await tx.wallet.findUnique({
        where: { userId: sender.id },
        select: { balance: true },
      });

      if (!senderWallet) throw new Error("WALLET_NOT_FOUND");

      const available = Number(senderWallet.balance);

      if (available < totalDebit) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      // Conditional debit protects against concurrent overspending.
      const debit = await tx.wallet.updateMany({
        where: {
          userId: sender.id,
          balance: { gte: totalDebit },
        },
        data: {
          balance: { decrement: totalDebit },
        },
      });

      if (debit.count !== 1) {
        throw new Error("BALANCE_CHANGED");
      }

      await tx.wallet.upsert({
        where: { userId: recipient.id },
        create: {
          userId: recipient.id,
          balance: transferAmount,
        },
        update: {
          balance: { increment: transferAmount },
        },
      });

      const completedAt = new Date();
      const reference =
        `CV-TX-${Date.now()}-${cryptoRandomPart()}`;

      // The transfer record and all balance/ledger changes commit together.
      await tx.walletTransfer.create({
        data: {
          senderId: sender.id,
          recipientId: recipient.id,
          requestKey: requestKey!,
          reference,
          amount: transferAmount,
          fee,
          totalDebit,
          status: "COMPLETED",
          completedAt,
        },
      });

      await tx.walletTransaction.createMany({
        data: [
          {
            userId: sender.id,
            type: "WALLET_TRANSFER_SENT",
            status: "COMPLETED",
            amount: transferAmount,
            reference: `${reference}-SENT`,
            description:
              `Transfer to ${recipient.referralCode}; fee KES ${fee.toFixed(2)}`,
            completedAt,
          },
          {
            userId: recipient.id,
            type: "WALLET_TRANSFER_RECEIVED",
            status: "COMPLETED",
            amount: transferAmount,
            reference: `${reference}-RECEIVED`,
            description: "Transfer received from member",
            completedAt,
          },
          {
            userId: sender.id,
            type: "WALLET_TRANSFER_FEE",
            status: "COMPLETED",
            amount: fee,
            reference: `${reference}-FEE`,
            description: "0.50% Corevia wallet transfer fee",
            completedAt,
          },
        ],
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            ownerType: "MEMBER",
            userId: sender.id,
            amount: -transferAmount,
            type: "WALLET_TRANSFER_SENT",
            reference: `${reference}-SENT-MEMBER`,
            description:
              `Wallet transfer to ${recipient.referralCode}`,
          },
          {
            ownerType: "MEMBER",
            userId: recipient.id,
            amount: transferAmount,
            type: "WALLET_TRANSFER_RECEIVED",
            reference: `${reference}-RECEIVED-MEMBER`,
            description: "Wallet transfer received",
          },
          {
            ownerType: "MEMBER",
            userId: sender.id,
            amount: -fee,
            type: "WALLET_TRANSFER_FEE",
            reference: `${reference}-FEE-MEMBER`,
            description: "0.50% Corevia wallet transfer fee",
          },
          {
            ownerType: "COREVIA",
            amount: fee,
            type: "WALLET_TRANSFER_FEE",
            reference: `${reference}-FEE-COREVIA`,
            description:
              "Corevia revenue from wallet transfer fee",
          },
        ],
      });

      const updatedSenderWallet = await tx.wallet.findUnique({
        where: { userId: sender.id },
        select: { balance: true },
      });

      if (!updatedSenderWallet) throw new Error("WALLET_NOT_FOUND");

      return {
        reference,
        recipient: {
          name: recipient.name,
          referralCode: recipient.referralCode,
        },
        amount: transferAmount,
        fee,
        totalDebited: totalDebit,
        remainingBalance: Number(updatedSenderWallet.balance),
        alreadyProcessed: false,
      };
    }, {
      maxWait: 30000,
      timeout: 60000,
    });

    return NextResponse.json({
      status: true,
      message: result.alreadyProcessed
        ? "This transfer was already processed."
        : "Wallet transfer completed successfully.",
      ...result,
    });
  } catch (error) {
    // A simultaneous retry can encounter the unique request-key constraint.
    // Check whether the first request committed before returning an error.
    if (
      senderId &&
      requestKey &&
      (isUniqueConstraintError(error) ||
        (error instanceof Error &&
          ["BALANCE_CHANGED", "INSUFFICIENT_FUNDS"].includes(
            error.message,
          )))
    ) {
      try {
        const previous = await prisma.walletTransfer.findUnique({
          where: {
            senderId_requestKey: { senderId, requestKey },
          },
          include: { recipient: { select: { name: true, referralCode: true } } },
        });

        if (previous) {
          if (
            previous.recipient.referralCode !== recipientCode ||
            Math.round(Number(previous.amount) * 100) !== amountCents
          ) {
            return NextResponse.json(
              { error: "This request key was used for different transfer details." },
              { status: 409 },
            );
          }

          if (previous.status === "COMPLETED") {
            const wallet = await prisma.wallet.findUnique({
              where: { userId: senderId },
              select: { balance: true },
            });

            return NextResponse.json({
              status: true,
              message: "This transfer was already processed.",
              reference: previous.reference,
              recipient: previous.recipient,
              amount: Number(previous.amount),
              fee: Number(previous.fee),
              totalDebited: Number(previous.totalDebit),
              remainingBalance: wallet
                ? Number(wallet.balance)
                : null,
              alreadyProcessed: true,
            });
          }
        }
      } catch (retryCheckError) {
        console.error(
          "Unable to check transfer retry:",
          retryCheckError,
        );
      }
    }

    const code = error instanceof Error ? error.message : "UNKNOWN";

    const messages: Record<string, { status: number; message: string }> = {
      ACCOUNT_NOT_FOUND: { status: 404, message: "Member account not found." },
      MEMBERSHIP_INACTIVE: { status: 403, message: "Your membership must be active to transfer funds." },
      RECIPIENT_NOT_FOUND: { status: 404, message: "No member was found with that referral code." },
      SELF_TRANSFER: { status: 400, message: "You cannot transfer money to yourself." },
      RECIPIENT_INACTIVE: { status: 400, message: "The recipient must have an active membership." },
      WALLET_NOT_FOUND: { status: 400, message: "Your wallet was not found." },
      INSUFFICIENT_FUNDS: { status: 400, message: "Insufficient balance to cover the transfer and 0.50% fee." },
      BALANCE_CHANGED: { status: 409, message: "Your balance changed during this request. Please try again." },
      REQUEST_KEY_REUSED: { status: 409, message: "This request key was already used for different transfer details. Start a new transfer." },
      TRANSFER_NOT_COMPLETED: { status: 409, message: "A previous transfer with this request key is not completed. Contact support before retrying." },
    };

    const known = messages[code];

    if (known) {
      return NextResponse.json(
        { error: known.message },
        { status: known.status },
      );
    }

    console.error("Wallet transfer error:", error);

    return NextResponse.json(
      { error: "Unable to complete the wallet transfer." },
      { status: 500 },
    );
  }
}

function cryptoRandomPart() {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}
