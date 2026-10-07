import { NextResponse } from "next/server";

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
          error: data.message || "Unable to verify Paystack payment.",
        },
        { status: response.status || 502 },
      );
    }

    return NextResponse.json({
      status: true,
      reference: data.data.reference,
      paymentStatus: data.data.status,
      amount: Number(data.data.amount) / 100,
      currency: data.data.currency,
      paidAt: data.data.paid_at,
      customer: data.data.customer,
      metadata: data.data.metadata,
    });
  } catch (error) {
    console.error("Paystack verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 },
    );
  }
}