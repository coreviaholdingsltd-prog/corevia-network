import crypto from "node:crypto";

const PAYSTACK_API = "https://api.paystack.co";

function secretKey() {
  const value = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!value) throw new Error("Missing server environment variable: PAYSTACK_SECRET_KEY");
  return value;
}

async function paystackRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    cache: "no-store",
    signal: init.signal ?? AbortSignal.timeout(12000),
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const payload = await response.json().catch(() => null) as
    | { status?: boolean; message?: string; data?: T }
    | null;
  if (!response.ok || payload?.status !== true || payload.data == null) {
    const error = new Error(
      typeof payload?.message === "string"
        ? `Paystack request failed: ${payload.message}`
        : `Paystack request failed with HTTP ${response.status}.`,
    ) as Error & { statusCode?: number };
    error.statusCode = response.status;
    throw error;
  }
  return payload.data;
}

export function normalizePaystackMpesaPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("7") && digits.length === 9) return `254${digits}`;
  if (digits.startsWith("1") && digits.length === 9) return `254${digits}`;
  throw new Error("The member phone number must be a valid Kenyan M-PESA number.");
}

type RecipientResponse = {
  recipient_code: string;
  active: boolean;
  type: string;
  currency: string;
  domain?: string;
  details?: {
    account_number?: string;
    bank_code?: string;
  };
};

function validateKenyaTillRecipient(recipient: RecipientResponse) {
  const expectedTill = (process.env.COREVIA_TILL_NUMBER || "6959300").replace(/\D/g, "");
  if (
    !/^RCP_[A-Za-z0-9]+$/.test(recipient.recipient_code) ||
    recipient.active !== true ||
    recipient.currency !== "KES" ||
    recipient.type !== "mobile_money_business" ||
    recipient.details?.bank_code !== "MPTILL" ||
    (recipient.details.account_number || "").replace(/\D/g, "") !== expectedTill ||
    (process.env.VERCEL_ENV === "production" && recipient.domain !== "live")
  ) {
    throw new Error("Paystack recipient is not the active production M-PESA Till 6959300 beneficiary.");
  }
  return recipient;
}

export async function fetchKenyaMpesaTillRecipient(recipientCode: string) {
  if (!/^RCP_[A-Za-z0-9]+$/.test(recipientCode)) {
    throw new Error("Invalid saved Paystack Till recipient code.");
  }
  const recipient = await paystackRequest<RecipientResponse>(
    `/transferrecipient/${encodeURIComponent(recipientCode)}`,
    { method: "GET" },
  );
  return validateKenyaTillRecipient(recipient);
}

type TransferResponse = {
  id: number;
  transfer_code: string;
  reference: string;
  status: "pending" | "success" | "failed" | "reversed" | "otp" | string;
  amount: number;
  currency: string;
};

type BalanceResponse = {
  currency: string;
  balance: number;
};

export async function getPaystackKesBalanceSubunits() {
  const balances = await paystackRequest<BalanceResponse[]>("/balance", { method: "GET" });
  const kes = balances.find((entry) => entry.currency === "KES");
  if (!kes || !Number.isSafeInteger(kes.balance) || kes.balance < 0) {
    throw new Error("Paystack did not return a valid KES balance.");
  }
  return kes.balance;
}

export async function createKenyaMpesaRecipient(args: {
  name: string;
  phone: string;
}) {
  const phone = normalizePaystackMpesaPhone(args.phone);
  return paystackRequest<RecipientResponse>("/transferrecipient", {
    method: "POST",
    body: JSON.stringify({
      type: "mobile_money",
      name: args.name.trim().slice(0, 100) || "Corevia Network Member",
      account_number: phone,
      bank_code: "MPESA",
      currency: "KES",
    }),
  });
}

export async function createKenyaMpesaTillRecipient() {
  const tillNumber = process.env.COREVIA_TILL_NUMBER || "6959300";
  const recipient = await paystackRequest<RecipientResponse>("/transferrecipient", {
    method: "POST",
    body: JSON.stringify({
      type: "mobile_money_business",
      name: "COREVIA HOLDINGS LTD",
      account_number: tillNumber,
      bank_code: "MPTILL",
      currency: "KES",
    }),
  });
  return validateKenyaTillRecipient(recipient);
}

export async function initiateKenyaMpesaTransfer(args: {
  recipientCode: string;
  amountKsh: number;
  reference: string;
  reason: string;
  accountReference?: string;
  businessTill?: boolean;
}) {
  const amountSubunits = Math.round(args.amountKsh * 100);
  const maximumSubunits = args.businessTill ? 5000000000 : 25000000;
  if (!Number.isSafeInteger(amountSubunits) || amountSubunits < 1000 || amountSubunits > maximumSubunits) {
    throw new Error(args.businessTill
      ? "Paystack M-PESA Till transfers must be between KES 10 and KES 50,000,000."
      : "Paystack Kenya M-PESA customer transfers must be between KES 10 and KES 250,000.");
  }
  if (args.businessTill && !args.accountReference?.trim()) {
    throw new Error("A unique account reference is required for Kenyan M-PESA Till transfers.");
  }
  if (!/^[a-z0-9_-]{16,50}$/.test(args.reference)) {
    throw new Error("Paystack transfer reference must be 16–50 lowercase letters, digits, hyphens or underscores.");
  }
  if (!args.recipientCode.startsWith("RCP_")) {
    throw new Error("A valid Paystack transfer recipient code is required.");
  }

  // Paystack KES amounts are expressed in cents (KES × 100).
  return paystackRequest<TransferResponse>("/transfer", {
    method: "POST",
    body: JSON.stringify({
      source: "balance",
      amount: amountSubunits,
      recipient: args.recipientCode,
      reference: args.reference,
      reason: args.reason.slice(0, 100),
      currency: "KES",
      ...(args.accountReference ? { account_reference: args.accountReference } : {}),
    }),
  });
}

export async function verifyPaystackTransfer(reference: string) {
  if (!/^[a-z0-9_-]{16,50}$/.test(reference)) {
    throw new Error("Invalid Paystack transfer reference.");
  }
  return paystackRequest<TransferResponse>(
    `/transfer/verify/${encodeURIComponent(reference)}`,
    { method: "GET" },
  );
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string) {
  const secret = secretKey();
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const supplied = Buffer.from(signature);
  const known = Buffer.from(expected);
  return supplied.length === known.length && crypto.timingSafeEqual(supplied, known);
}
