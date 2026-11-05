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
import { settlePaystackWithdrawal } from "@/lib/paystack/withdrawal-settlement";

export const maxDuration = 60;

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
          reference: true, paymentReference: true,
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
        process.env.COREVIA_TILL_FEE_TRANSFER_READY !== "true" ||
        process.env.COREVIA_PAYSTACK_MANUAL_PAYOUTS_CONFIRMED !== "true"
      )
    ) {
      return NextResponse.json({
        error: "Live withdrawals are locked until Paystack Settled-to-Balance, available payout float, and the automated Corevia Till revenue route are confirmed. Member payouts remain fully automated.",
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
      return NextResponse.json({ error: "The automated Paystack payout channel is not currently confirmed ready. Your wallet has not been debited." }, { status: 503 });
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
    if (netAmountCents % 100 !== 0) {
      return NextResponse.json({
        error: "The M-PESA payout must be a whole KES amount. Adjust the withdrawal amount; your wallet has not been debited.",
      }, { status: 400 });
    }

    // Validate local wallet funds before creating a Paystack recipient or making
    // provider calls. The transaction below repeats the authoritative balance check.
    const walletPrecheck = await prisma.wallet.findUnique({
      where: { userId: user.id },
      select: { balance: true },
    });
    if (!walletPrecheck || Number(walletPrecheck.balance) < normalizedAmount) {
      return NextResponse.json({
        error: "Insufficient wallet balance. Available balance is KES " + Number(walletPrecheck?.balance ?? 0).toFixed(2) + ".",
      }, { status: 400 });
    }

    let recipientCode: string;
    try {
      const recipient = await createKenyaMpesaRecipient({ name: user.name, phone });
      if (recipient.active !== true || recipient.currency !== "KES" || recipient.type !== "mobile_money") throw new Error("Paystack did not return an active Kenyan M-PESA recipient.");
      recipientCode = recipient.recipient_code;
    } catch (error) {
      console.error("Paystack withdrawal recipient preflight failed:", error);
      return NextResponse.json({ error: "Paystack could not validate the M-PESA recipient. Your wallet has not been debited." }, { status: 503 });
    }

    const reference = `CV-WD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const paystackReference = `cvps_${crypto.randomBytes(16).toString("hex")}`;

    const created = await prisma.$transaction(async (tx) => {
      // Serialize the entire shared Paystack client-funds pool, not only one member.
      // This prevents simultaneous withdrawals from spending the same pooled balance.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('corevia-paystack-client-funds-pool'))::text AS lock_acquired`;
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${user.id}))::text AS lock_acquired`;
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

      // Wallet balances are client liabilities held against one pooled Paystack
      // balance. Protect every member's balance before authorizing this payout.
      // Existing PROCESSING withdrawals are counted as reserved client claims
      // until a terminal Paystack result is confirmed (conservative on timeouts).
      const [walletTotals, processingTotals, pendingDepositTotals, paystackBalanceSubunits] = await Promise.all([
        tx.wallet.aggregate({ _sum: { balance: true } }),
        tx.withdrawal.aggregate({
          where: { status: "PROCESSING" },
          _sum: { netAmount: true },
        }),
        tx.paymentRecord.aggregate({
          where: {
            provider: "PAYSTACK",
            destination: "OTHER",
            status: "PENDING",
            providerReference: { startsWith: "CV-WALLET-" },
          },
          _sum: { amount: true },
        }),
        getPaystackKesBalanceSubunits(),
      ]);
      const allMemberWalletLiabilities = Number(walletTotals._sum.balance ?? 0);
      const existingProcessingPayouts = Number(processingTotals._sum.netAmount ?? 0);
      // A Paystack-successful wallet charge can reach the pooled balance before
      // its webhook/verification credits the member wallet. Reserve every
      // unresolved CV-WALLET payment so revenue or another withdrawal cannot
      // spend that unallocated client principal.
      const pendingWalletDepositClaims = Number(pendingDepositTotals._sum.amount ?? 0);

      // Apply Paystack Kenya Tier 1 integration-wide limits across both member
      // M-PESA payouts and company M-PESA Till settlements.
      const hourlyCutoff = new Date(Date.now() - 60 * 60 * 1000);
      const dailyCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const [hourlyMemberTotals, dailyMemberTotals, recentRevenueAttempts] = await Promise.all([
        tx.withdrawal.aggregate({
          where: { status: { in: ["PROCESSING", "PAID"] }, createdAt: { gte: hourlyCutoff } },
          _sum: { netAmount: true },
        }),
        tx.withdrawal.aggregate({
          where: { status: { in: ["PROCESSING", "PAID"] }, createdAt: { gte: dailyCutoff } },
          _sum: { netAmount: true },
        }),
        tx.ledgerEntry.findMany({
          where: {
            ownerType: "COREVIA",
            description: { startsWith: "COREVIA_TILL_ATTEMPT|" },
            createdAt: { gte: dailyCutoff },
          },
          select: { description: true, createdAt: true },
        }),
      ]);
      const seenRevenueReferences = new Set<string>();
      let hourlyRevenueCommitted = 0;
      let dailyRevenueCommitted = 0;
      for (const attempt of recentRevenueAttempts) {
        const parts = attempt.description?.split("|") ?? [];
        const reference = parts[1];
        const amount = Number(parts[2]);
        if (!reference || !/^cvrev_[a-f0-9]{32}$/.test(reference) ||
            !Number.isFinite(amount) || amount <= 0 || seenRevenueReferences.has(reference)) continue;
        seenRevenueReferences.add(reference);
        dailyRevenueCommitted += amount;
        if (attempt.createdAt >= hourlyCutoff) hourlyRevenueCommitted += amount;
      }
      const hourlyCommitted =
        Number(hourlyMemberTotals._sum.netAmount ?? 0) + hourlyRevenueCommitted;
      const dailyCommitted =
        Number(dailyMemberTotals._sum.netAmount ?? 0) + dailyRevenueCommitted;
      if (hourlyCommitted + netAmount > 2_500_000 || dailyCommitted + netAmount > 5_000_000) {
        throw new Error("PAYSTACK_TRANSFER_LIMIT");
      }

      const postRequestClientClaims =
        Math.max(0, allMemberWalletLiabilities - normalizedAmount) +
        existingProcessingPayouts +
        pendingWalletDepositClaims +
        netAmount;
      // Paystack's Kenya M-PESA transfer fee can reach KES 180 in the
      // applicable amount band; retain a KES 200 company-revenue buffer.
      const providerFeeBufferSubunits = 20000;
      const protectedPoolRequiredSubunits =
        Math.round(postRequestClientClaims * 100) + providerFeeBufferSubunits;
      if (paystackBalanceSubunits < protectedPoolRequiredSubunits) {
        throw new Error("INSUFFICIENT_CLIENT_FUNDS_POOL");
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
    }, { maxWait: 30000, timeout: 60000 });

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
        if (transfer.status === "otp" || transfer.status === "failed" || transfer.status === "reversed") {
          // Corevia never routes member withdrawals to a manual approval queue.
          // An OTP-gated transfer is rejected and the member's full debit is
          // restored through the same idempotent settlement path.
          await settlePaystackWithdrawal({
              reference: paystackReference,
              status: "failed",
              amountSubunits: transfer.amount,
              currency: transfer.currency,
              transferCode: transfer.transfer_code,
          });
          return NextResponse.json({
            error: transfer.status === "otp"
              ? "Paystack did not accept this as an automated no-OTP payout. Your wallet has been restored; no manual approval is required."
              : "Paystack rejected the transfer. Your wallet has been restored; you may retry when the payout channel is ready.",
          }, { status: 503 });
        }
        return NextResponse.json({
          status: true,
          message: "Paystack received the automated M-PESA transfer request. Your withdrawal remains processing until a verified terminal result is received.",
          withdrawal: created.withdrawal,
          remainingBalance: created.remainingBalance,
        }, { status: 202 });
      } catch (error) {
        // A network timeout or provider 5xx after transfer submission is ambiguous.
        // Keep the wallet debit and provider lock; never resubmit an uncertain payout.
        const providerStatus = error instanceof Error
          ? (error as Error & { statusCode?: number }).statusCode
          : undefined;
        if (providerStatus && providerStatus >= 400 && providerStatus < 500) {
          await settlePaystackWithdrawal({
            reference: paystackReference,
            status: "failed",
            amountSubunits: netAmountCents,
            currency: "KES",
          });
          return NextResponse.json({
            error: "Paystack rejected the payout request. Your wallet has been restored; no manual payout is queued.",
          }, { status: 502 });
        }
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
    const rawMessage = error instanceof Error ? error.message : "Unable to submit withdrawal request.";
    const message = rawMessage === "INSUFFICIENT_CLIENT_FUNDS_POOL"
      ? "The available Paystack funds do not currently cover all members' wallet balances, unresolved deposits and this withdrawal, plus the transfer-fee reserve. No wallet debit was made."
      : rawMessage === "PAYSTACK_TRANSFER_LIMIT"
        ? "Paystack's current Kenya transfer limit has been reached. Your wallet has not been debited; the system will accept the request when the limit resets."
        : rawMessage;
    const status = rawMessage.startsWith("Missing server environment variable") || rawMessage.includes("callback URLs")
      ? 503
      : rawMessage === "INSUFFICIENT_CLIENT_FUNDS_POOL"
        ? 503
        : rawMessage === "PAYSTACK_TRANSFER_LIMIT"
          ? 429
          : rawMessage.includes("authentication failed")
          ? 502
          : rawMessage.startsWith("An existing withdrawal") ||
            rawMessage.startsWith("Insufficient available M-PESA payout float")
            ? 409
            : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
