import { NextResponse } from "next/server";

const PAYSTACK_URL = "https://api.paystack.co/transaction/initialize";

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

    const email = String(body.email ?? "").trim().toLowerCase();
    const amount = Number(body.amount ?? 0);
    const reference = String(body.reference ?? "").trim();

    if (!email || !reference || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Email, amount and reference are required." },
        { status: 400 },
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(PAYSTACK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        reference,
        callback_url: `${siteUrl}/wallet`,
        metadata: {
          purpose: "COREVIA_NETWORK_MEMBERSHIP",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          error: data.message || "Unable to initialize Paystack payment.",
        },
        { status: response.status || 502 },
      );
    }

    return NextResponse.json({
      status: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);

    return NextResponse.json(
      { error: "Unable to initialize payment." },
      { status: 500 },
    );
  }
}