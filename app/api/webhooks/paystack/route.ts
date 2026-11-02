import { NextResponse } from "next/server";
import crypto from "crypto";
import { processMembershipPayment } from "@/lib/membership-payment";
import { processAcademyCoursePayment } from "@/lib/academy-payments";
import { applyPaystackTransferStatus } from "@/lib/paystack-transfers";

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
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      return NextResponse.json(
        { error: "Invalid Paystack signature." },
        { status: 401 },
      );
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
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
    } else if (
      event.event === "transfer.success" ||
      event.event === "transfer.failed" ||
      event.event === "transfer.reversed"
    ) {
      const transfer = event.data ?? {};
      const reference =
        typeof transfer.reference === "string" ? transfer.reference : "";

      if (!reference) {
        throw new Error("Paystack transfer webhook is missing its reference.");
      }

      const result = await applyPaystackTransferStatus({
        reference,
        status: String(event.event).replace("transfer.", ""),
        amount:
          transfer.amount === undefined ? undefined : Number(transfer.amount),
        currency:
          typeof transfer.currency === "string" ? transfer.currency : undefined,
        transferCode:
          typeof transfer.transfer_code === "string"
            ? transfer.transfer_code
            : null,
      });

      console.log("Corevia Paystack transfer webhook processed:", {
        reference,
        result,
      });
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
