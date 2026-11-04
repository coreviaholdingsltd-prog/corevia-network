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
  assertB2CRecipientAllowed,
  submitB2CPayment,
} from "@/lib/mpesa/b2c";
import { settleWithdrawalFailure } from "@/lib/mpesa/settlement";
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

    const mpesaEnvironment = (process.env.MPESA_ENV || "sandbox").toLowerCase();
    const isProductionDeployment = process.env.VERCEL_ENV === "production";
    if (
      (isProductionDeployment || mpesaEnvironment === "production") &&
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

    const requestedProvider = (process.env.COREVIA_WITHDRAWAL_PROVIDER || "auto").toLowerCase();
    if (!["auto", "daraja", "paystack"].includes(requestedProvider)) {
      return NextResponse.json({ error: "Withdrawal provider configuration is invalid." }, { status: 503 });
    }
    const phone = normalizeMpesaPhone(user.phone);
    let payoutProvider: "daraja" | "paystack" | null = null;
    let config: ReturnType<typeof getDarajaConfig> | null = null;
    let accessToken: string | null = null;
    let paystackRecipientCode: string | null = null;
    let paystackKesBalanceSubunits: number | null = null;
    const providerOrder = requestedProvider === "auto"
      ? (process.env.COREVIA_WITHDRAWAL_PROVIDER_ORDER || "paystack,daraja")
          .split(",").map((value) => value.trim().toLowerCase()).filter(Boolean)
      : [requestedProvider];
    const providerFailures: string[] = [];

    // Provider preflight happens before any wallet debit. Auto mode may try the
    // other rail only when the first rail has not been asked to send money.
    for (const candidate of providerOrder) {
      if (candidate !== "paystack" && candidate !== "daraja") continue;
      try {
        if (candidate === "paystack") {
          if (
            process.env.COREVIA_PAYSTACK_WITHDRAWALS_ENABLED !== "true" ||
            process.env.COREVIA_PAYSTACK_NO_OTP_CONFIRMED !== "true"
          ) {
            throw new Error("Paystack Transfers or no-OTP automated approval is not confirmed.");
          }
          if (isProductionDeployment && (
            process.env.COREVIA_PAYSTACK_LIVE_READY !== "true" ||
            process.env.COREVIA_PAYSTACK_FLOAT_READY !== "true"
          )) {
            throw new Error("Paystack live transfer approval or funded KES float is not confirmed.");
          }
          const recipient = await createKenyaMpesaRecipient({ name: user.name, phone });
          if (recipient.active !== true || recipient.currency !== "KES" || recipient.type !== "mobile_money") {
            throw new Error("Paystack did not return an active Kenyan M-PESA recipient.");
          }
          payoutProvider = "paystack";
          paystackRecipientCode = recipient.recipient_code;
          paystackKesBalanceSubunits = await getPaystackKesBalanceSubunits();
          break;
        }

        if (isProductionDeployment && (
          mpesaEnvironment !== "production" ||
          process.env.COREVIA_DARAJA_LIVE_READY !== "true" ||
          process.env.COREVIA_DARAJA_FLOAT_READY !== "true"
        )) {
          throw new Error("Safaricom B2C production approval, credentials, or Utility float is not confirmed.");
        }
        config = getDarajaConfig();
        assertB2CRecipientAllowed(config.environment, phone);
        accessToken = await getDarajaAccessToken(config);
        payoutProvider = "daraja";
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Provider preflight failed.";
        providerFailures.push(`${candidate}: ${message}`);
        config = null;
        accessToken = null;
        paystackRecipientCode = null;
        paystackKesBalanceSubunits = null;
      }
    }

    if (!payoutProvider) {
      console.error("No withdrawal provider passed preflight:", providerFailures);
      return NextResponse.json({
        error: "No M-PESA payout provider is currently ready. Your wallet has not been debited. Please try again later.",
      }, { status: 503 });
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
        error: "The maximum M-PESA withdrawal payout is KES 150,000. The maximum wallet deduction is KES 150,753.77 including the 0.50% fee.",
      }, { status: 400 });
    }

    // Check the Paystack KES balance before touching the member wallet. If the
    // preferred rail is short, auto mode may prepare Daraja as a pre-debit fallback.
    if (
      payoutProvider === "paystack" &&
      paystackKesBalanceSubunits !== null &&
      paystackKesBalanceSubunits < Math.round(netAmount * 100)
    ) {
      if (requestedProvider !== "auto") {
        return NextResponse.json({ error: "Paystack's available KES balance is below this payout. Your wallet has not been debited." }, { status: 503 });
      }
      try {
        if (isProductionDeployment && (
          mpesaEnvironment !== "production" ||
          process.env.COREVIA_DARAJA_LIVE_READY !== "true" ||
          process.env.COREVIA_DARAJA_FLOAT_READY !== "true"
        )) {
          throw new Error("Safaricom B2C production approval, credentials, or Utility float is not confirmed.");
        }
        const fallbackConfig = getDarajaConfig();
        assertB2CRecipientAllowed(fallbackConfig.environment, phone);
        const fallbackToken = await getDarajaAccessToken(fallbackConfig);
        config = fallbackConfig;
        accessToken = fallbackToken;
        payoutProvider = "daraja";
        paystackRecipientCode = null;
        paystackKesBalanceSubunits = null;
      } catch (error) {
        console.error("Both payout rails failed balance/preflight checks:", error);
        return NextResponse.json({ error: "Neither Paystack nor Daraja has sufficient verified payout readiness. Your wallet has not been debited." }, { status: 503 });
      }
    }
    if (payoutProvider === "daraja" && netAmountCents % 100 !== 0) {
      return NextResponse.json({
        error: "Daraja B2C pays whole shillings only. Adjust the withdrawal amount so the payout after the 0.50% fee is a whole KES amount.",
      }, { status: 400 });
    }

    const reference = `CV-WD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const originatorConversationId = payoutProvider === "daraja" ? makeOriginatorConversationId() : null;
    const paystackReference = payoutProvider === "paystack"
      ? `cvps_${crypto.randomBytes(16).toString("hex")}`
      : null;

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
          originatorConversationId,
          paymentReference: paystackReference,
        },
        select: { id: true, amount: true, fee: true, netAmount: true, status: true, reference: true, createdAt: true },
      });

      // Production B2C payouts must be backed by a separately funded Utility-account float.
      // Sandbox can exercise the Daraja callback flow without real-money float reservations.
      const enforcePayoutFloat = payoutProvider === "daraja" && (
        mpesaEnvironment === "production" ||
        process.env.COREVIA_PAYOUT_FLOAT_ENFORCED === "true"
      );
      if (enforcePayoutFloat) {
        const floatReserved = await tx.payoutFloatAccount.updateMany({
          where: { id: "primary", availableBalance: { gte: netAmount } },
          data: {
            availableBalance: { decrement: netAmount },
            reservedBalance: { increment: netAmount },
          },
        });
        if (floatReserved.count !== 1) {
          throw new Error("Insufficient available M-PESA payout float. Your wallet has not been debited; fund and reconcile the Safaricom Utility account first.");
        }

        await tx.payoutFloatReservation.create({
          data: {
            accountId: "primary",
            withdrawalId: withdrawal.id,
            amount: netAmount,
            status: "RESERVED",
          },
        });
        await tx.payoutFloatEntry.create({
          data: {
            accountId: "primary",
            reference: `${reference}-FLOAT-RESERVE`,
            type: "RESERVATION",
            amount: netAmount,
            description: `Reserved M-PESA Utility payout float for ${reference}`,
          },
        });
      }

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
          description: `${payoutProvider === "paystack" ? "Paystack M-PESA transfer" : "Daraja B2C payout"} to ${phone}; reference ${reference}`,
        },
      });

      return { withdrawal, remainingBalance: available - normalizedAmount };
    });

    if (payoutProvider === "paystack") {
      try {
        const transfer = await initiateKenyaMpesaTransfer({
          recipientCode: paystackRecipientCode!,
          amountKsh: netAmount,
          reference: paystackReference!,
          reason: `Corevia Network withdrawal ${reference}`,
        });
        // The initiation response is an acknowledgement, not our settlement
        // authority. Only a signed terminal webhook or an independent verify
        // request in the reconciliation worker may mark this withdrawal terminal.
        return NextResponse.json({
          status: true,
          message: transfer.status === "otp"
            ? "Paystack requires an approval step. Your withdrawal remains processing and will not be sent through Daraja automatically."
            : "Paystack received the M-PESA transfer request. Your withdrawal remains processing until a verified terminal result is received.",
          withdrawal: created.withdrawal,
          remainingBalance: created.remainingBalance,
        }, { status: 202 });
      } catch (error) {
        // A network timeout or provider error after transfer submission is ambiguous.
        // Keep the wallet debit and provider lock; never send the same withdrawal to Daraja.
        console.error("Paystack transfer submission outcome is uncertain:", error);
        return NextResponse.json({
          status: true,
          message: "Paystack's transfer outcome is being reconciled. Do not submit the withdrawal again.",
          withdrawal: created.withdrawal,
          remainingBalance: created.remainingBalance,
        }, { status: 202 });
      }
    }

    if (!config || !accessToken || !originatorConversationId) {
      throw new Error("Daraja payout was not fully initialized.");
    }
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

    const responseCode = acknowledgement?.ResponseCode;
    if (typeof responseCode !== "string" || !/^\d+$/.test(responseCode)) {
      // An invalid acknowledgement is ambiguous. Never refund or retry automatically.
      console.error("Daraja returned a malformed B2C acknowledgement; leaving withdrawal processing.", {
        reference,
        responseCode,
      });
      return NextResponse.json({
        status: true,
        message: "M-PESA returned an unclear acknowledgement. Your withdrawal remains processing for reconciliation. Do not submit it again.",
        withdrawal: created.withdrawal,
        remainingBalance: created.remainingBalance,
      }, { status: 202 });
    }

    if (responseCode !== "0") {
      const rejectionCode = Number(responseCode);
      const rejectionDescription = typeof acknowledgement.ResponseDescription === "string" && acknowledgement.ResponseDescription.trim()
        ? acknowledgement.ResponseDescription
        : "Safaricom rejected the B2C request.";
      await settleWithdrawalFailure(reference, rejectionCode, rejectionDescription);
      return NextResponse.json({
        error: `${rejectionDescription} Your wallet will be refunded only after the rejection is recorded.`,
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
        : message.startsWith("An existing withdrawal") ||
          message.startsWith("Insufficient available M-PESA payout float")
          ? 409
          : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
