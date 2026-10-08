import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import { processMembershipPayment } from "@/lib/membership-payment";

const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack is not configured." },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(sessionCookieName)?.value;
    const session = verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const reference = String(body.reference ?? "").trim();

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required." },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          error:
            data.message || "Unable to verify Paystack payment.",
        },
        { status: response.status || 502 },
      );
    }

    const payment = data.data;

    if (payment.status !== "success") {
      return NextResponse.json(
        {
          error: "Payment has not been completed.",
          paymentStatus: payment.status,
        },
        { status: 400 },
      );
    }

    if (Number(payment.amount) !== 100000 || payment.currency !== "KES") {
      return NextResponse.json(
        { error: "Invalid membership payment amount or currency." },
        { status: 400 },
      );
    }

    const metadataUserId =
      typeof payment.metadata?.userId === "string"
        ? payment.metadata.userId
        : "";

    if (metadataUserId && metadataUserId !== session.userId) {
      return NextResponse.json(
        { error: "This payment belongs to another member." },
        { status: 403 },
      );
    }

    const paymentRecord = await prisma.paymentRecord.findUnique({
      where: { providerReference: reference },
      select: { userId: true },
    });

    if (paymentRecord && paymentRecord.userId !== session.userId) {
      return NextResponse.json(
        { error: "This payment belongs to another member." },
        { status: 403 },
      );
    }

    const result = await processMembershipPayment(
      {
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paid_at: payment.paid_at,
        metadata: payment.metadata,
      },
      session.userId,
    );

    return NextResponse.json({
      status: true,
      ...result,
    });
  } catch (error) {
    console.error("Paystack verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 },
    );
  }
}
