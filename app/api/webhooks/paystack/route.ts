import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { processMembershipPayment } from "@/lib/membership-payment";
import { processAcademyCoursePayment } from "@/lib/academy-payments";
import { applyPaystackTransferOutcome } from "@/lib/paystack-transfer-settlement";

type PaystackTransferEvent = "transfer.success" | "transfer.failed" | "transfer.reversed";

async function processTransferWebhook(event: {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    transfer_code?: string;
  };
}, rawBody: string) {
  const eventType = event.event as PaystackTransferEvent;
  const transfer = event.data;
  const reference = String(transfer?.reference ?? "");

  if (!reference || !["transfer.success", "transfer.failed", "transfer.reversed"].includes(eventType)) {
    return { ignored: true };
  }

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { payoutReference: reference },
    select: {
      id: true,
      userId: true,
      amount: true,
      fee: true,
      netAmount: true,
      status: true,
      reference: true,
      payoutReference: true,
    },
  });

  if (!withdrawal) {
    console.warn("Paystack transfer webhook has no matching withdrawal:", reference);
    return { unmatched: true };
  }

  const expectedAmount = Math.round(Number(withdrawal.netAmount) * 100);
  if (
    String(transfer?.currency ?? "").toUpperCase() !== "KES" ||
    Number(transfer?.amount) !== expectedAmount
  ) {
    console.error("Paystack transfer webhook amount/currency mismatch:", {
      reference,
      currency: transfer?.currency,
      amount: transfer?.amount,
    });
    throw new Error("Transfer webhook amount or currency did not match the withdrawal.");
  }

  const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.paystackTransferWebhook.create({
        data: {
          eventType,
          transferReference: reference,
          payloadHash,
        },
      });

      const outcome = eventType === "transfer.success"
        ? "success"
        : eventType === "transfer.reversed" ? "reversed" : "failed";

      return applyPaystackTransferOutcome(tx, {
        id: withdrawal.id,
        userId: withdrawal.userId,
        amount: Number(withdrawal.amount),
        fee: Number(withdrawal.fee),
        reference: withdrawal.reference,
      }, outcome, transfer?.transfer_code ?? undefined);
    });
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
    if (code === "P2002") {
      const existing = await prisma.paystackTransferWebhook.findFirst({
        where: {
          OR: [
            { payloadHash },
            { transferReference: reference, eventType },
          ],
        },
        select: { id: true },
      });
      if (existing) return { duplicate: true };
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack is not configured." },
        { status: 500 },
      );
    }

    const signature = request.headers.get("x-paystack-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing Paystack signature." },
        { status: 401 },
      );
    }

    const rawBody = await request.text();
    const expectedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return NextResponse.json(
        { error: "Invalid Paystack signature." },
        { status: 401 },
      );
    }

    const event = JSON.parse(rawBody);

    if (
      event.event === "transfer.success" ||
      event.event === "transfer.failed" ||
      event.event === "transfer.reversed"
    ) {
      const result = await processTransferWebhook(event, rawBody);
      console.log("Corevia Paystack transfer webhook processed:", result);
    } else if (event.event === "charge.success") {
      const payment = event.data;
      const purpose =
        typeof payment?.metadata?.purpose === "string"
          ? payment.metadata.purpose
          : "";

      if (purpose === "COREVIA_NETWORK_MEMBERSHIP") {
        const result = await processMembershipPayment({
          reference: String(payment.reference ?? ""),
          amount: Number(payment.amount ?? 0),
          currency: String(payment.currency ?? ""),
          status: String(payment.status ?? ""),
          paid_at: payment.paid_at ?? null,
          metadata: payment.metadata ?? null,
        });
        console.log("Corevia membership webhook processed:", result);
      } else if (purpose === "COREVIA_ACADEMY_COURSE") {
        const result = await processAcademyCoursePayment({
          reference: String(payment.reference ?? ""),
          amount: Number(payment.amount ?? 0),
          currency: String(payment.currency ?? ""),
          status: String(payment.status ?? ""),
          paid_at: payment.paid_at ?? null,
          metadata: payment.metadata ?? null,
        });
        console.log("Corevia Academy payment processed:", result);
      } else {
        console.log("Paystack payment ignored:", {
          reference: payment?.reference,
          purpose,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
