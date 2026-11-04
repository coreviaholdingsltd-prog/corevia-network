import { prisma } from "@/lib/prisma";

function mpesaConfig() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE || "6959300";
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_ACADEMY_CALLBACK_URL;
  const environment = process.env.MPESA_ENV === "production" ? "production" : "sandbox";
  if (!consumerKey || !consumerSecret || !passkey || !callbackUrl) {
    throw new Error("M-PESA Academy collection is not configured. Add the Daraja credentials and callback URL in Vercel.");
  }
  if (!callbackUrl.startsWith("https://")) throw new Error("The M-PESA callback URL must use HTTPS.");
  return {
    consumerKey, consumerSecret, shortcode, passkey, callbackUrl, environment,
    baseUrl: environment === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke",
    till: process.env.MPESA_TILL_NUMBER || shortcode,
    transactionType: process.env.MPESA_TRANSACTION_TYPE || "CustomerBuyGoodsOnline",
  };
}

export function normalizeMpesaPhone(value: unknown) {
  const digits = String(value ?? "").replace(/\\D/g, "");
  const normalized = digits.startsWith("0") ? `254${digits.slice(1)}` : digits.startsWith("7") || digits.startsWith("1") ? `254${digits}` : digits;
  return /^254[17]\\d{8}$/.test(normalized) ? normalized : null;
}

export async function initiateAcademyMpesaPush(input: {
  paymentId: string;
  reference: string;
  phone: string;
  amount: number;
  courseTitle: string;
}) {
  const config = mpesaConfig();
  const auth = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const tokenResponse = await fetch(`${config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }, cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) throw new Error("Unable to authenticate with Safaricom Daraja.");

  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Nairobi", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";\n  const timestamp = `${part("year")}${part("month")}${part("day")}${part("hour")}${part("minute")}${part("second")}`;
  const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");
  const phone = normalizeMpesaPhone(input.phone);
  if (!phone) throw new Error("Enter a valid Kenyan M-PESA phone number.");

  const pushResponse = await fetch(`${config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenData.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: config.transactionType,
      Amount: Math.round(input.amount),
      PartyA: phone,
      PartyB: config.till,
      PhoneNumber: phone,
      CallBackURL: config.callbackUrl,
      AccountReference: input.reference.slice(0, 12),
      TransactionDesc: `Academy ${input.courseTitle}`.slice(0, 13),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  const pushData = await pushResponse.json();
  if (!pushResponse.ok || String(pushData.ResponseCode) !== "0" || !pushData.CheckoutRequestID) {
    throw new Error(pushData.errorMessage || pushData.ResponseDescription || "Safaricom did not accept the STK Push request.");
  }

  await prisma.academyPayment.update({
    where: { id: input.paymentId },
    data: {
      providerCheckoutId: String(pushData.CheckoutRequestID),
      merchantRequestId: pushData.MerchantRequestID ? String(pushData.MerchantRequestID) : null,
      payerPhone: phone,
    },
  });
  return { checkoutRequestId: String(pushData.CheckoutRequestID), customerMessage: String(pushData.CustomerMessage || "STK Push sent.") };
}

export async function processAcademyMpesaCallback(payload: unknown) {
  const root = payload as {
    Body?: { stkCallback?: {
      CheckoutRequestID?: string;
      MerchantRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: { Item?: Array<{ Name?: string; Value?: string | number }> };
    } };
  };
  const callback = root?.Body?.stkCallback;
  const checkoutId = String(callback?.CheckoutRequestID ?? "").trim();
  if (!checkoutId) throw new Error("M-PESA callback is missing CheckoutRequestID.");

  const payment = await prisma.academyPayment.findFirst({
    where: { provider: "MPESA", providerCheckoutId: checkoutId },
    include: { enrollment: true },
  });
  if (!payment) throw new Error("M-PESA Academy payment reference was not found.");

  if (payment.status === "COMPLETED" || payment.status === "FAILED") {
    return { alreadyProcessed: true, status: payment.status };
  }

  const resultCode = Number(callback?.ResultCode);
  if (resultCode !== 0) {
    await prisma.academyPayment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: { status: "FAILED" },
    });
    return { alreadyProcessed: false, status: "FAILED" };
  }

  const items = callback?.CallbackMetadata?.Item ?? [];
  const value = (name: string) => items.find((item) => item.Name === name)?.Value;
  const amount = Number(value("Amount"));
  const receipt = String(value("MpesaReceiptNumber") ?? "").trim();
  const phone = String(value("PhoneNumber") ?? payment.payerPhone ?? "");
  if (!receipt || !Number.isFinite(amount) || amount !== Math.round(Number(payment.amount))) {
    throw new Error("M-PESA receipt or amount does not match the Academy payment record.");
  }

  return prisma.$transaction(async (tx) => {
    const current = await tx.academyPayment.findUnique({ where: { id: payment.id }, include: { enrollment: true } });
    if (!current) throw new Error("Academy payment record disappeared.");
    if (current.status === "COMPLETED") return { alreadyProcessed: true, status: "COMPLETED" };
    await tx.academyPayment.update({
      where: { id: current.id },
      data: {
        status: "COMPLETED",
        verifiedAt: new Date(),
        mpesaReceiptNumber: receipt,
        payerPhone: phone,
      },
    });
    await tx.academyEnrollment.update({
      where: { id: current.enrollmentId },
      data: {
        status: current.enrollment.status === "COMPLETED" ? "COMPLETED" : "ACTIVE",
        amountPaid: current.amount,
      },
    });
    return { alreadyProcessed: false, status: "COMPLETED", receipt };
  });
}
