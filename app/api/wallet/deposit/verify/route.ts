import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import { processWalletDeposit } from "@/lib/wallet-deposit";

const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Paystack is not configured." }, { status: 500 });
    const cookieStore = await cookies();
    const session = verifySession(cookieStore.get(sessionCookieName)?.value);
    if (!session) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

    const body = await request.json();
    const reference = String(body.reference ?? "").trim();
    if (!reference || !/^CV-WALLET-[A-Za-z0-9-]+$/.test(reference)) {
      return NextResponse.json({ error: "A valid wallet deposit reference is required." }, { status: 400 });
    }
    const pending = await prisma.walletTransaction.findUnique({ where: { reference }, select: { userId: true, type: true } });
    if (!pending || pending.userId !== session.userId || pending.type !== "WALLET_DEPOSIT") {
      return NextResponse.json({ error: "Wallet deposit not found for this member." }, { status: 404 });
    }

    const response = await fetch(`${PAYSTACK_VERIFY_URL}/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    if (!response.ok || !data.status) return NextResponse.json({ error: data.message || "Unable to verify Paystack payment." }, { status: 502 });
    const payment = data.data;
    if (payment.reference !== reference || payment.status !== "success") {
      return NextResponse.json({ error: "Payment has not been completed.", paymentStatus: payment.status }, { status: 400 });
    }
    const result = await processWalletDeposit({
      reference: payment.reference, amount: Number(payment.amount), currency: String(payment.currency ?? ""),
      status: String(payment.status ?? ""), paid_at: payment.paid_at ?? null, metadata: payment.metadata ?? null,
    });
    return NextResponse.json({ status: true, ...result });
  } catch (error) {
    console.error("Wallet deposit verification error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to verify wallet deposit." }, { status: 400 });
  }
}
