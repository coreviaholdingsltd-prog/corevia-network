import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { processMembershipPayment } from "@/lib/membership-payment";
import { processAcademyCoursePayment } from "@/lib/academy-payments";
import { settlePaystackWithdrawal } from "@/lib/paystack/withdrawal-settlement";
import { dispatchCoreviaRevenueTransfers, settleCoreviaRevenueTransfer } from "@/lib/paystack/revenue-transfers";
import { processWalletDeposit } from "@/lib/wallet-deposits";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Paystack is not configured." }, { status: 500 });
    }

    const signature = request.headers.get("x-paystack-signature") || "";
    const rawBody = await request.text();
    const expectedSignature = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
    const supplied = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    if (!signature || supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
      return NextResponse.json({ error: "Invalid Paystack signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: Record<string, unknown>;
    };
    const data = event.data;
    const asRecord = (value: unknown): Record<string, unknown> | null =>
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? value as Record<string, unknown>
        : null;
    const asOptionalString = (value: unknown): string | null =>
      typeof value === "string" ? value : null;

    if (event.event === "charge.success") {
      const payment = data;
      const purpose = typeof payment?.metadata === "object" && payment.metadata !== null
        ? String((payment.metadata as Record<string, unknown>).purpose ?? "")
        : "";

      if (purpose === "COREVIA_NETWORK_MEMBERSHIP") {
        const result = await processMembershipPayment({
          reference: String(payment?.reference ?? ""),
          amount: Number(payment?.amount ?? 0),
          currency: String(payment?.currency ?? ""),
          status: String(payment?.status ?? ""),
          paid_at: asOptionalString(payment?.paid_at),
          metadata: asRecord(payment?.metadata),
        });
        console.log("Corevia membership webhook processed:", result);
      } else if (purpose === "COREVIA_ACADEMY_COURSE") {
        const result = await processAcademyCoursePayment({
          reference: String(payment?.reference ?? ""),
          amount: Number(payment?.amount ?? 0),
          currency: String(payment?.currency ?? ""),
          status: String(payment?.status ?? ""),
          paid_at: asOptionalString(payment?.paid_at),
          metadata: asRecord(payment?.metadata),
        });
        console.log("Corevia Academy payment processed:", result);
      } else if (purpose === "COREVIA_WALLET_DEPOSIT") {
        const result = await processWalletDeposit({
          reference: String(payment?.reference ?? ""),
          amount: Number(payment?.amount ?? 0),
          currency: String(payment?.currency ?? ""),
          status: String(payment?.status ?? ""),
          paid_at: asOptionalString(payment?.paid_at),
          metadata: asRecord(payment?.metadata),
        });
        console.log("Corevia wallet deposit processed:", result);
      }
    }

    if (
      event.event === "transfer.success" ||
      event.event === "transfer.failed" ||
      event.event === "transfer.reversed"
    ) {
      const reference = String(data?.reference ?? "");
      const status = event.event === "transfer.success"
        ? "success"
        : event.event === "transfer.failed"
          ? "failed"
          : "reversed";
      const settlement = {
        reference,
        status: status as "success" | "failed" | "reversed",
        amountSubunits: Number(data?.amount),
        currency: String(data?.currency ?? ""),
      };
      const withdrawalResult = reference.startsWith("cvps_")
        ? await settlePaystackWithdrawal({
            ...settlement,
            transferCode: typeof data?.transfer_code === "string" ? data.transfer_code : null,
          })
        : null;
      const revenueResult = reference.startsWith("cvrev_")
        ? await settleCoreviaRevenueTransfer(settlement)
        : null;
      console.log("Corevia Paystack transfer webhook processed:", {
        reference,
        event: event.event,
        withdrawalResult,
        revenueResult,
      });
      // A failed company-fee transfer is retried automatically from the
      // outstanding Corevia revenue ledger after its terminal webhook.
      try {
        await dispatchCoreviaRevenueTransfers();
      } catch (dispatchError) {
        console.error("Corevia Till revenue retry deferred:", dispatchError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
