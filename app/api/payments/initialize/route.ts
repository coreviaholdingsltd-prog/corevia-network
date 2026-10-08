import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

const PAYSTACK_URL = "https://api.paystack.co/transaction/initialize";
const MEMBERSHIP_AMOUNT = 1000;

export async function POST() {
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

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        membershipStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Member account not found." },
        { status: 404 },
      );
    }

    if (user.membershipStatus === "ACTIVE") {
      return NextResponse.json(
        { error: "Your membership is already active." },
        { status: 400 },
      );
    }

    const reference =
      `CV-MEM-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    await prisma.paymentRecord.create({
      data: {
        userId: user.id,
        amount: MEMBERSHIP_AMOUNT,
        provider: "PAYSTACK",
        providerReference: reference,
        destination: "COREVIA_TILL",
        status: "PENDING",
      },
    });

    await prisma.membershipPayment.create({
      data: {
        userId: user.id,
        amount: MEMBERSHIP_AMOUNT,
        provider: "PAYSTACK",
        providerReference: reference,
        status: "PENDING",
      },
    });

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(PAYSTACK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: MEMBERSHIP_AMOUNT * 100,
        reference,
        currency: "KES",
        callback_url: `${siteUrl}/wallet?payment=${encodeURIComponent(reference)}`,
        metadata: {
          purpose: "COREVIA_NETWORK_MEMBERSHIP",
          userId: user.id,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          error:
            data.message || "Unable to initialize Paystack payment.",
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
