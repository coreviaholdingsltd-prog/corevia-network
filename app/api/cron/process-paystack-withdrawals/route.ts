import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyPaystackTransferOutcome } from "@/lib/paystack-transfer-settlement";
import { evaluateCoreviaTillFloat } from "@/lib/corevia-till-settlement";
import {
  isPaystackPayoutEnabled,
  isPayoutLifecycleVerified,
  isPaystackPreviewTestMode,
} from "@/lib/paystack-payout-guard.mjs";
import { isPaystackKeyCompatibleWithDeployment } from "@/lib/paystack-key-environment.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PaystackPayload = {
  status?: boolean;
  message?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    recipient_code?: string;
    transfer_code?: string;
  };
};

const money = (value: unknown) => Math.round(Number(value) * 100) / 100;

/**
 * Process at most one queued member withdrawal per invocation.
 * Production requires explicit lifecycle approval. Preview may run only an
 * isolated Paystack sandbox test when VERCEL_ENV=preview, the dedicated
 * test-mode switch is true, and the configured key is a compatible sk_test
 * key. Every operational flag and the protected-float check still apply.
 * Ambiguous provider responses remain PROCESSING for reconciliation.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const deploymentEnv = process.env.VERCEL_ENV;
  const keyCompatible = Boolean(secretKey) &&
    isPaystackKeyCompatibleWithDeployment(deploymentEnv, secretKey!);
  const previewTestMode = keyCompatible &&
    isPaystackPreviewTestMode(process.env, deploymentEnv, secretKey);
  const lifecycleApproved = isPayoutLifecycleVerified(process.env) || previewTestMode;

  if (!isPaystackPayoutEnabled(process.env, lifecycleApproved)) {
    return NextResponse.json({
      enabled: false,
      mode: previewTestMode ? "preview_test" : "production",
      message: "Member payout processor is disabled by operational safeguards.",
    });
  }

  const feeReserve = Number(process.env.COREVIA_TILL_TRANSFER_FEE_RESERVE_KSH);
  if (!secretKey || !keyCompatible) {
    return NextResponse.json({ error: "A Paystack key compatible with this deployment is required." }, { status: 503 });
  }
  if (!Number.isFinite(feeReserve) || feeReserve <= 0) {
    return NextResponse.json({ error: "A positive transfer-fee reserve is required." }, { status: 503 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const locks = await tx.$queryRaw<Array<{ locked: boolean }>>`
        SELECT pg_try_advisory_xact_lock(724190112) AS locked
      `;
      if (!locks[0]?.locked) return { skipped: "another_worker_running" };

      // Never submit a second transfer while any earlier member transfer is unresolved.
      const unresolved = await tx.withdrawal.findFirst({
        where: { status: "PROCESSING", payoutReference: { not: null } },
        orderBy: { initiatedAt: "asc" },
        select: { reference: true, payoutReference: true },
      });
      if (unresolved) return { skipped: "existing_member_transfer_requires_reconciliation", reference: unresolved.reference };

      const candidate = await tx.withdrawal.findFirst({
        where: { status: "PENDING", payoutReference: null, OR: [{ processorStatus: null }, { processorStatus: "queued" }] },
        orderBy: { createdAt: "asc" },
        select: {
          id: true, userId: true, amount: true, fee: true, netAmount: true,
          reference: true, beneficiaryPhone: true,
          user: { select: { name: true, email: true } },
        },
      });
      if (!candidate) return { skipped: "no_pending_member_withdrawals" };

      const amount = money(candidate.amount);
      const netAmount = money(candidate.netAmount);
      const phone = String(candidate.beneficiaryPhone ?? "");
      const fee = money(candidate.fee);
      if (!Number.isFinite(amount) || amount < 500 || !Number.isFinite(fee) ||
          fee < 0 || !Number.isFinite(netAmount) || netAmount <= 0 ||
          Math.abs(amount - fee - netAmount) > 0.01 ||
          !/^254[17]\d{8}$/.test(phone)) {
        await tx.withdrawal.updateMany({
          where: { id: candidate.id, status: "PENDING" },
          data: { processorStatus: "invalid_queue_record_manual_review" },
        });
        return { skipped: "invalid_queue_record_manual_review", reference: candidate.reference };
      }

      const [balanceResponse, walletLiabilities, pendingPayouts, queuedTill] = await Promise.all([
        fetch("https://api.paystack.co/balance", {
          headers: { Authorization: "Bearer " + secretKey },
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
      const floatCheck = evaluateCoreviaTillFloat({
        balanceSubunits,
        walletLiabilitiesKsh: Number(walletLiabilities._sum.balance ?? 0),
        pendingPayoutsKsh: Number(pendingPayouts._sum.netAmount ?? 0),
        queuedTillSettlementsKsh: Number(queuedTill._sum.amount ?? 0),
        feeReserveKsh: feeReserve,
      });
      if (balancePayload?.status !== true || !floatCheck.ok) {
        return {
          skipped: floatCheck.reason ?? "insufficient_protected_float",
          availableKsh: floatCheck.availableKsh,
          requiredKsh: floatCheck.requiredKsh,
        };
      }

      // Register the recipient before claiming a transfer reference. A
      // recipient-registration ambiguity creates no payout and leaves request
      // queued for operator review rather than risking duplicate money movement.
      const recipientResponse = await fetch("https://api.paystack.co/transferrecipient", {
        method: "POST",
        headers: { Authorization: "Bearer " + secretKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mobile_money",
          name: candidate.user.name,
          account_number: phone,
          bank_code: "MPESA",
          currency: "KES",
          email: candidate.user.email,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      const recipientPayload = await recipientResponse.json().catch(() => null) as PaystackPayload | null;
      const recipientCode = recipientPayload?.data?.recipient_code;
      if (!recipientResponse.ok || recipientPayload?.status !== true || !recipientCode) {
        await tx.withdrawal.updateMany({
          where: { id: candidate.id, status: "PENDING" },
          data: { processorStatus: "recipient_registration_review" },
        });
        return { skipped: "recipient_registration_review", reference: candidate.reference };
      }

      const payoutReference = "cvp-" + candidate.reference.replace(/[^a-zA-Z0-9_-]/g, "").slice(-40);
      const claimed = await tx.withdrawal.updateMany({
        where: { id: candidate.id, status: "PENDING", payoutReference: null },
        data: {
          status: "PROCESSING",
          processorStatus: "submitting",
          recipientCode,
          payoutReference,
          initiatedAt: new Date(),
        },
      });
      if (claimed.count !== 1) return { skipped: "withdrawal_claim_lost" };

      let response: Response;
      let payload: PaystackPayload | null;
      try {
        response = await fetch("https://api.paystack.co/transfer", {
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
        payload = await response.json().catch(() => null) as PaystackPayload | null;
      } catch {
        return { outcome: "provider_response_ambiguous_reconcile_by_reference", reference: payoutReference };
      }

      if (!response.ok || payload?.status !== true || !payload.data?.reference) {
        const providerMessage = String(payload?.message ?? "").toLowerCase();
        const duplicateReference = providerMessage.includes("reference") &&
          (providerMessage.includes("already") || providerMessage.includes("exist") || providerMessage.includes("duplicate"));
        if (response.status >= 400 && response.status < 500 && payload?.status === false && !duplicateReference) {
          const refunded = await applyPaystackTransferOutcome(tx, {
            id: candidate.id,
            userId: candidate.userId,
            amount,
            fee: money(candidate.fee),
            reference: candidate.reference,
          }, "failed");
          return { outcome: "provider_rejected", reference: payoutReference, refunded: refunded.refunded === true };
        }
        return { outcome: "provider_response_ambiguous_reconcile_by_reference", reference: payoutReference };
      }

      if (
        payload.data.reference !== payoutReference ||
        Number(payload.data.amount) !== Math.round(netAmount * 100) ||
        String(payload.data.currency ?? "KES").toUpperCase() !== "KES"
      ) {
        await tx.withdrawal.updateMany({
          where: { id: candidate.id, status: "PROCESSING" },
          data: { processorStatus: "provider_response_mismatch_review" },
        });
        return { outcome: "provider_response_mismatch_manual_review", reference: payoutReference };
      }

      await tx.withdrawal.updateMany({
        where: { id: candidate.id, status: "PROCESSING", payoutReference },
        data: {
          processorStatus: String(payload.data.status ?? "pending"),
          transferCode: payload.data.transfer_code ?? undefined,
        },
      });
      return { outcome: "submitted_pending_provider_confirmation", reference: payoutReference, amountKsh: netAmount };
    }, { maxWait: 10000, timeout: 45000 });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Member withdrawal queue worker failed safely:", error);
    return NextResponse.json({ error: "Withdrawal queue worker failed safely; unresolved transfers remain reserved for reconciliation." }, { status: 500 });
  }
}
