
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import { processMembershipPayment } from "@/lib/membership-payment";

const PAYSTACK_VERIFY_URL =
  "https://api.paystack.co/transaction/verify";

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
      return NextResponse.json({
        status: true,
        alreadyActive: true,
        membershipStatus: "ACTIVE",
      });
    }

    const pendingPayment =
      await prisma.membershipPayment.findFirst({
        where: {
          userId: user.id,
          status: "PENDING",
          provider: "PAYSTACK",
        },
        orderBy: { createdAt: "desc" },
        select: {
          providerReference: true,
          amount: true,
        },
      });

    if (!pendingPayment) {
      return NextResponse.json(
        {
          error:
            "No pending Paystack membership payment was found. Contact support before paying again.",
        },
        { status: 404 },
      );
    }

    if (Number(pendingPayment.amount) !== 1000) {
      return NextResponse.json(
        { error: "The pending amount does not match KES 1,000." },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(
        pendingPayment.providerReference,
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status || !data.data) {
      return NextResponse.json(
        {
          error:
            "Paystack could not verify this payment. Please try again later.",
        },
        { status: 502 },
      );
    }

    const payment = data.data;

    if (payment.reference !== pendingPayment.providerReference) {
      return NextResponse.json(
        { error: "The payment reference does not match." },
        { status: 400 },
      );
    }

    if (
      payment.status !== "success" ||
      Number(payment.amount) !== 100000 ||
      payment.currency !== "KES"
    ) {
      return NextResponse.json(
        {
          error:
            "Paystack has not confirmed a successful KES 1,000 payment for this reference.",
          paymentStatus: payment.status,
        },
        { status: 400 },
      );
    }

    if (
      payment.metadata?.purpose !==
        "COREVIA_NETWORK_MEMBERSHIP" ||
      payment.metadata?.userId !== user.id
    ) {
      return NextResponse.json(
        {
          error:
            "The verified payment metadata does not match this membership account.",
        },
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
      user.id,
    );

    return NextResponse.json({
      status: true,
      message:
        "Paystack confirmed your payment. Your membership is now active.",
      ...result,
    });
  } catch (error) {
    console.error("Membership payment check error:", error);

    return NextResponse.json(
      { error: "Unable to check your payment right now." },
      { status: 500 },
    );
  }
}
