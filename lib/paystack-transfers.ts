import { prisma } from "@/lib/prisma";

const PAYSTACK_API_BASE = "https://api.paystack.co";

type PaystackEnvelope<T> = {
  status?: boolean;
  message?: string;
  data?: T;
};

export type PaystackTransferData = {
  reference?: string;
  transfer_code?: string;
  status?: string;
  amount?: number;
  currency?: string;
};

export class PaystackApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "PaystackApiError";
    this.statusCode = statusCode;
  }
}

function getPaystackSecret() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("PAYSTACK_NOT_CONFIGURED");
  return secret;
}

async function paystackRequest<T>(
  path: string,
  method: "GET" | "POST",
  body?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(PAYSTACK_API_BASE + path, {
    method,
    headers: {
      Authorization: "Bearer " + getPaystackSecret(),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const payload = (await response.json().catch(() => null)) as
    | PaystackEnvelope<T>
    | null;

  if (!response.ok || payload?.status !== true || !payload.data) {
    const message =
      typeof payload?.message === "string"
        ? payload.message
        : "Paystack could not process the request.";
    throw new PaystackApiError(message, response.status);
  }

  return payload.data;
}

export function normalizeKenyanMpesaPhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) {
    digits = "0" + digits.slice(3);
  } else if (digits.length === 9 && /^[17]/.test(digits)) {
    digits = "0" + digits;
  }

  if (!/^0[17]\d{8}$/.test(digits)) return null;
  return digits;
}

export async function createPaystackMpesaRecipient(input: {
  name: string;
  phone: string;
}) {
  const phone = normalizeKenyanMpesaPhone(input.phone);
  if (!phone) throw new Error("INVALID_MPESA_PHONE");

  const data = await paystackRequest<{ recipient_code?: string }>(
    "/transferrecipient",
    "POST",
    {
      type: "mobile_money",
      name: input.name,
      account_number: phone,
      bank_code: "MPESA",
      currency: "KES",
    },
  );

  if (!data.recipient_code) {
    throw new Error("Paystack did not return an M-PESA recipient code.");
  }

  return data.recipient_code;
}

export async function initiatePaystackMpesaTransfer(input: {
  amountKsh: number;
  recipientCode: string;
  reference: string;
}) {
  return paystackRequest<PaystackTransferData>("/transfer", "POST", {
    source: "balance",
    amount: Math.round(input.amountKsh * 100),
    recipient: input.recipientCode,
    reference: input.reference,
    reason: "Corevia Network withdrawal " + input.reference,
    currency: "KES",
  });
}

export async function verifyPaystackTransfer(reference: string) {
  const response = await fetch(
    PAYSTACK_API_BASE + "/transfer/verify/" + encodeURIComponent(reference),
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + getPaystackSecret(),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | PaystackEnvelope<PaystackTransferData>
    | null;
  const message =
    typeof payload?.message === "string" ? payload.message : "";

  if (
    response.status === 404 ||
    /transfer not found/i.test(message)
  ) {
    return null;
  }

  if (!response.ok || payload?.status !== true || !payload.data) {
    throw new PaystackApiError(
      message || "Unable to verify the Paystack transfer.",
      response.status,
    );
  }

  return payload.data;
}

export async function setWithdrawalPendingForRetry(reference: string) {
  await prisma.withdrawal.updateMany({
    where: { reference, status: "PROCESSING" },
    data: { status: "PENDING" },
  });
}

export async function applyPaystackTransferStatus(input: {
  reference: string;
  status: string;
  amount?: number;
  currency?: string;
  transferCode?: string | null;
}) {
  const status = input.status.toLowerCase();
  const transferCode = input.transferCode || undefined;

  return prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({
      where: { reference: input.reference },
    });

    if (!withdrawal) {
      return { found: false, status: "UNKNOWN" };
    }

    const expectedMinorAmount = Math.round(Number(withdrawal.netAmount) * 100);

    if (
      typeof input.amount === "number" &&
      Number.isFinite(input.amount) &&
      input.amount !== expectedMinorAmount
    ) {
      throw new Error("Paystack transfer amount does not match the withdrawal.");
    }

    if (input.currency && input.currency.toUpperCase() !== "KES") {
      throw new Error("Paystack transfer currency is not KES.");
    }

    const now = new Date();
    const paymentReference =
      transferCode || withdrawal.paymentReference || null;

    if (status === "success") {
      if (withdrawal.status === "FAILED" || withdrawal.status === "REJECTED") {
        throw new Error(
          "Paystack reported success for a withdrawal that was already refunded. Manual reconciliation is required.",
        );
      }

      const changed = await tx.withdrawal.updateMany({
        where: {
          id: withdrawal.id,
          status: { in: ["PENDING", "PROCESSING"] },
        },
        data: {
          status: "PAID",
          paymentReference,
          processedAt: now,
        },
      });

      if (changed.count === 1) {
        await tx.walletTransaction.update({
          where: { reference: input.reference + "-WALLET" },
          data: { status: "COMPLETED", completedAt: now },
        });
        return { found: true, status: "PAID", alreadyProcessed: false };
      }

      const latest = await tx.withdrawal.findUnique({
        where: { id: withdrawal.id },
        select: { status: true },
      });
      if (latest?.status === "PAID") {
        return { found: true, status: "PAID", alreadyProcessed: true };
      }
      throw new Error("Withdrawal state changed while confirming Paystack success.");
    }

    if (["failed", "reversed", "abandoned", "blocked", "rejected"].includes(status)) {
      if (withdrawal.status === "FAILED" || withdrawal.status === "REJECTED") {
        return { found: true, status: withdrawal.status, alreadyProcessed: true };
      }

      if (withdrawal.status === "PAID" && status !== "reversed") {
        throw new Error(
          "Paystack reported a failed transfer after a successful payout. Manual reconciliation is required.",
        );
      }

      const allowedStatuses =
        withdrawal.status === "PAID"
          ? ["PAID"]
          : ["PENDING", "PROCESSING"];

      const changed = await tx.withdrawal.updateMany({
        where: {
          id: withdrawal.id,
          status: { in: allowedStatuses },
        },
        data: {
          status: "FAILED",
          paymentReference,
          processedAt: now,
        },
      });

      if (changed.count !== 1) {
        const latest = await tx.withdrawal.findUnique({
          where: { id: withdrawal.id },
          select: { status: true },
        });
        if (latest?.status === "FAILED" || latest?.status === "REJECTED") {
          return { found: true, status: latest.status, alreadyProcessed: true };
        }
        throw new Error("Withdrawal state changed while reversing the payout.");
      }

      await tx.wallet.update({
        where: { userId: withdrawal.userId },
        data: { balance: { increment: withdrawal.amount } },
      });

      await tx.walletTransaction.update({
        where: { reference: input.reference + "-WALLET" },
        data: { status: "REVERSED", completedAt: now },
      });

      await tx.walletTransaction.create({
        data: {
          userId: withdrawal.userId,
          type: "ADJUSTMENT",
          status: "COMPLETED",
          amount: withdrawal.amount,
          reference: input.reference + "-REFUND-WALLET",
          description: "Refund for unsuccessful M-PESA withdrawal " + input.reference,
          completedAt: now,
        },
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            ownerType: "MEMBER",
            userId: withdrawal.userId,
            amount: withdrawal.fee,
            type: "ADJUSTMENT",
            reference: input.reference + "-FEE-MEMBER-REVERSAL",
            description: "Reversal of Corevia withdrawal fee after unsuccessful payout.",
          },
          {
            ownerType: "COREVIA",
            amount: withdrawal.fee.negated(),
            type: "ADJUSTMENT",
            reference: input.reference + "-FEE-COREVIA-REVERSAL",
            description: "Reversal of withdrawal fee revenue after unsuccessful payout.",
          },
        ],
      });

      return { found: true, status: "FAILED", refunded: true };
    }

    if (withdrawal.status === "PAID") {
      return { found: true, status: "PAID", alreadyProcessed: true };
    }
    if (withdrawal.status === "FAILED" || withdrawal.status === "REJECTED") {
      return { found: true, status: withdrawal.status, alreadyProcessed: true };
    }

    await tx.withdrawal.updateMany({
      where: {
        id: withdrawal.id,
        status: { in: ["PENDING", "PROCESSING"] },
      },
      data: {
        status: "PROCESSING",
        paymentReference,
      },
    });

    return { found: true, status: "PROCESSING" };
  });
}
