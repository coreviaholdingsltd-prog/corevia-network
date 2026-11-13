import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { evaluateCoreviaTillFloat, matchesTillTransfer } from "@/lib/corevia-till-settlement";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TransferPayload = {
  status?: boolean;
  message?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    transfer_code?: string;
  };
};

const money = (value: unknown) => Math.round(Number(value) * 100) / 100;

/**
 * Company Till remittance is deliberately independent of member withdrawals.
 * It is disabled unless an operator has provisioned the Paystack MPTILL
 * recipient and explicitly enabled this worker after float verification.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (process.env.COREVIA_TILL_SETTLEMENT_ENABLED !== "true") {
    return NextResponse.json({ enabled: false, message: "Till settlement worker is disabled." });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const recipientCode = process.env.COREVIA_PAYSTACK_TILL_RECIPIENT_CODE;
  const feeReserve = Number(process.env.COREVIA_TILL_TRANSFER_FEE_RESERVE_KSH);
  if (!secretKey || !recipientCode || !Number.isFinite(feeReserve) || feeReserve <= 0) {
    return NextResponse.json({ error: "Till recipient, Paystack key, and positive transfer-fee reserve are required." }, { status: 503 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const locks = await tx.$queryRaw<Array<{ locked: boolean }>>`
        SELECT pg_try_advisory_xact_lock(hashtext('corevia-till-settlement-worker')) AS locked
      `;
      if (!locks[0]?.locked) return { skipped: "another_worker_running" };

      // Never resubmit PROCESSING rows. A timed-out provider response is
      // reconciled by reference on a later run, preventing duplicate transfers.
      const unresolved = await tx.coreviaTillSettlement.findFirst({
        where: { status: { in: ["PROCESSING", "REVIEW"] } },
        orderBy: { initiatedAt: "asc" },
      });
      if (unresolved?.status === "REVIEW") {
        return { skipped: "manual_review_blocks_further_till_transfers", reference: unresolved.reference };
      }
      if (unresolved) {
        const verification = await fetch(
          `https://api.paystack.co/transfer/verify/${encodeURIComponent(unresolved.reference)}`,
          {
            headers: { Authorization: `Bearer ${secretKey}` },
            cache: "no-store",
            signal: AbortSignal.timeout(15000),
          },
        );
        if (!verification.ok) {
          return { skipped: "existing_transfer_verification_pending", reference: unresolved.reference };
        }
        const verified = await verification.json() as { status?: boolean; data?: { reference?: string; status?: string; amount?: number; currency?: string } };
        const transfer = verified.data;
        if (!transfer || verified.status !== true || !matchesTillTransfer(
          { reference: unresolved.reference, amountKsh: Number(unresolved.amount), currency: unresolved.currency },
          transfer,
        )) {
          return { skipped: "existing_transfer_verification_unconfirmed", reference: unresolved.reference };
        }
        const providerStatus = String(transfer.status ?? "").toLowerCase();
        const terminal = providerStatus === "success" ? "SETTLED"
          : providerStatus === "failed" ? "FAILED"
          : providerStatus === "reversed" ? "REVERSED" : null;
        if (terminal) {
          await tx.coreviaTillSettlement.updateMany({
            where: { id: unresolved.id, status: "PROCESSING" },
            data: { status: terminal, settledAt: new Date(), lastError: null },
          });
          return { outcome: terminal.toLowerCase(), reference: unresolved.reference };
        }
        return { skipped: "existing_transfer_still_pending", reference: unresolved.reference };
      }

      const candidate = await tx.coreviaTillSettlement.findFirst({
        where: { status: "PENDING", currency: "KES" },
        orderBy: { createdAt: "asc" },
      });
      if (!candidate) return { skipped: "no_pending_company_settlements" };

      const amount = money(candidate.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        await tx.coreviaTillSettlement.update({
          where: { id: candidate.id },
          data: { status: "REVIEW", lastError: "Invalid or non-positive settlement amount." },
        });
        return { skipped: "invalid_settlement_amount" };
      }

      const [balanceResponse, walletLiabilities, pendingPayouts, queuedTill] = await Promise.all([
        fetch("https://api.paystack.co/balance", {
          headers: { Authorization: `Bearer ${secretKey}` },
          cache: "no-store",
          signal: AbortSignal.timeout(12000),
        }),
        tx.wallet.aggregate({ _sum: { balance: true } }),
        tx.withdrawal.aggregate({
          where: { status: { in: ["PENDING", "PROCESSING"] } },
          _sum: { netAmount: true },
        }),
        tx.coreviaTillSettlement.aggregate({
          where: { status: { in: ["PENDING", "PROCESSING", "REVIEW"] }, currency: "KES" },
          _sum: { amount: true },
        }),
      ]);

      if (!balanceResponse.ok) return { skipped: "paystack_balance_unavailable" };
      const balancePayload = await balanceResponse.json();
      const kes = Array.isArray(balancePayload?.data)
        ? balancePayload.data.find((item: { currency?: string }) => String(item.currency ?? "").toUpperCase() === "KES")
        : null;
      const balanceSubunits = Number(kes?.balance);
      const wallets = Number(walletLiabilities._sum.balance ?? 0);
      const payouts = Number(pendingPayouts._sum.netAmount ?? 0);
      const companyQueue = Number(queuedTill._sum.amount ?? 0);
      if ([balanceSubunits, wallets, payouts, companyQueue].some((v) => !Number.isFinite(v) || v < 0)) {
        return { skipped: "invalid_float_data" };
      }

      const floatCheck = evaluateCoreviaTillFloat({
        balanceSubunits,
        walletLiabilitiesKsh: wallets,
        pendingPayoutsKsh: payouts,
        queuedTillSettlementsKsh: companyQueue,
        feeReserveKsh: feeReserve,
      });
      if (balancePayload?.status !== true || !floatCheck.ok) {
        return {
          skipped: floatCheck.reason ?? "insufficient_protected_float",
          availableKsh: floatCheck.availableKsh,
          requiredKsh: floatCheck.requiredKsh,
        };
      }

      const claimed = await tx.coreviaTillSettlement.updateMany({
        where: { id: candidate.id, status: "PENDING" },
        data: {
          status: "PROCESSING",
          recipientCode,
          initiatedAt: new Date(),
          attempts: { increment: 1 },
          lastError: null,
        },
      });
      if (claimed.count !== 1) return { skipped: "settlement_claim_lost" };

      // The database advisory lock remains held through this request. On a
      // timeout, keep PROCESSING and verify by reference; never blindly retry.
      const response = await fetch("https://api.paystack.co/transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "balance",
          amount: Math.round(amount * 100),
          recipient: recipientCode,
          reference: candidate.reference,
          reason: "Corevia Holdings Ltd company revenue remittance to Till 6959300",
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });

      let payload: TransferPayload | null = null;
      try { payload = await response.json() as TransferPayload; } catch { /* ambiguous provider response */ }
      if (!response.ok || payload?.status !== true || !payload.data?.reference) {
        // A provider rejection with a definitive HTTP response is held for
        // review; transport/parse ambiguity stays PROCESSING for verification.
        if (response.status >= 400 && response.status < 500 && payload?.status === false) {
          await tx.coreviaTillSettlement.update({
            where: { id: candidate.id },
            data: { status: "REVIEW", lastError: String(payload.message ?? "Paystack rejected Till transfer.") },
          });
          return { outcome: "provider_rejected_review", reference: candidate.reference };
        }
        return { outcome: "provider_response_ambiguous_reconcile_by_reference", reference: candidate.reference };
      }

      if (!matchesTillTransfer(
        { reference: candidate.reference, amountKsh: amount, currency: "KES" },
        { reference: payload.data.reference, amount: payload.data.amount, currency: payload.data.currency ?? "KES" },
      )) {
        await tx.coreviaTillSettlement.update({
          where: { id: candidate.id },
          data: { status: "REVIEW", transferCode: payload.data.transfer_code ?? null, lastError: "Provider response did not match settlement reference, amount, or currency." },
        });
        return { outcome: "provider_response_mismatch_review", reference: candidate.reference };
      }

      await tx.coreviaTillSettlement.update({
        where: { id: candidate.id },
        data: { transferCode: payload.data.transfer_code ?? null, lastError: null },
      });
      return { outcome: "submitted_pending_provider_confirmation", reference: candidate.reference, amountKsh: amount };
    }, { maxWait: 10000, timeout: 45000 });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Corevia Till settlement worker failed:", error);
    return NextResponse.json({ error: "Till settlement worker failed safely. Any submitted transfer remains reserved for reconciliation." }, { status: 500 });
  }
}
