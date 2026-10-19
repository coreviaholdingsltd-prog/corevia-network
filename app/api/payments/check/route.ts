
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import { processMembershipPayment } from "@/lib/membership-payment";

const PAYSTACK_VERIFY_URL =
  "https://api.paystack.co/transaction/verify";

const MEMBERSHIP_AMOUNT = 1000;
const MAX_PENDING_REFERENCES = 20;

type PaystackPayment = {
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paid_at?: string | null;
  metadata?: Record<string, unknown> | null;
};

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

    const pendingPayments =
      await prisma.membershipPayment.findMany({
        where: {
          userId: user.id,
          status: "PENDING",
          provider: "PAYSTACK",
        },
        orderBy: { createdAt: "desc" },
        take: MAX_PENDING_REFERENCES,
        select: {
          providerReference: true,
          amount: true,
        },
      });

    if (pendingPayments.length === 0) {
      return NextResponse.json(
        {
          error:
            "No pending Paystack membership payment was found. Contact support before paying again.",
        },
        { status: 404 },
      );
    }

    for (const pendingPayment of pendingPayments) {
      if (Number(pendingPayment.amount) !== MEMBERSHIP_AMOUNT) {
        continue;
      }

      let response: Response;

      try {
        response = await fetch(
          `${PAYSTACK_VERIFY_URL}/${encodeURIComponent(
            pendingPayment.providerReference,
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${secretKey}`,
            },
            cache: "no-store",
            signal: AbortSignal.timeout(15000),
          },
        );
      } catch (error) {
        console.error(
          "Paystack verification request failed:",
          error,
        );

        return NextResponse.json(
          {
            error:
              "Paystack verification is temporarily unavailable. No payment status or referral balance was changed.",
          },
          { status: 502 },
        );
      }

      let data: {
        status?: boolean;
        data?: PaystackPayment;
      };

      try {
        data = await response.json();
      } catch {
        return NextResponse.json(
          { error: "Paystack returned an invalid response." },
          { status: 502 },
        );
      }

      if (!response.ok || !data.status || !data.data) {
        continue;
      }

      const payment = data.data;

      if (payment.reference !== pendingPayment.providerReference) {
        console.error("Paystack reference mismatch.");
        continue;
      }

      if (
        payment.status !== "success" ||
        Number(payment.amount) !== MEMBERSHIP_AMOUNT * 100 ||
        payment.currency !== "KES"
      ) {
        continue;
      }

      if (
        payment.metadata?.purpose !==
          "COREVIA_NETWORK_MEMBERSHIP" ||
        payment.metadata?.userId !== user.id
      ) {
        console.error(
          "Verified payment metadata did not match the signed-in member.",
        );
        continue;
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
        message: result.alreadyProcessed
          ? "This membership payment was already processed."
          : "Paystack confirmed your payment and membership activation was processed.",
        ...result,
      });
    }

    return NextResponse.json(
      {
        error:
          "None of the pending references was verified as a successful KES 1,000 membership payment for this account. No activation or referral allocation was performed.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Membership payment check error:", error);

    return NextResponse.json(
      { error: "Unable to check your payment right now." },
      { status: 500 },
    );
  }
}
