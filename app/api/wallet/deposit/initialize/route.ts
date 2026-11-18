import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

const PAYSTACK_URL = "https://api.paystack.co/transaction/initialize";
const MIN_DEPOSIT = 100;
const MAX_DEPOSIT = 150000;

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Paystack is not configured." }, { status: 500 });
    const cookieStore = await cookies();
    const session = verifySession(cookieStore.get(sessionCookieName)?.value);
    if (!session) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

    const body = await request.json();
    const amountText = String(body.amount ?? "").trim();
    const amount = Number(amountText);
    if (!/^\d+(?:\.\d{1,2})?$/.test(amountText) || !Number.isFinite(amount) || amount < MIN_DEPOSIT || amount > MAX_DEPOSIT) {
      return NextResponse.json({ error: "Enter a deposit from KES 100 to KES 150,000, with up to two decimal places." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, email: true, membershipStatus: true } });
    if (!user) return NextResponse.json({ error: "Member account not found." }, { status: 404 });
    if (user.membershipStatus !== "ACTIVE") return NextResponse.json({ error: "An active membership is required to deposit wallet funds." }, { status: 403 });

    const cents = Math.round(amount * 100);
    const normalizedAmount = cents / 100;
    const reference = \`CV-WALLET-\${Date.now()}-\${crypto.randomBytes(5).toString("hex").toUpperCase()}\`;
    await prisma.walletTransaction.create({
      data: { userId: user.id, type: "WALLET_DEPOSIT", status: "PENDING", amount: normalizedAmount, reference, description: "Pending Paystack wallet deposit" },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const response = await fetch(PAYSTACK_URL, {
      method: "POST",
      headers: { Authorization: \`Bearer \${secretKey}\`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email, amount: cents, reference, currency: "KES",
        callback_url: \`\${siteUrl}/wallet?deposit=\${encodeURIComponent(reference)}\`,
        metadata: { purpose: "COREVIA_WALLET_DEPOSIT", userId: user.id },
      }),
      cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    if (!response.ok || !data.status || data.data?.reference !== reference || !data.data?.authorization_url) {
      console.error("Wallet deposit initialization failed", { reference, status: response.status, message: data.message });
      return NextResponse.json({ error: "Paystack could not confirm checkout initialization. Check pending wallet transactions before retrying.", reference }, { status: 502 });
    }
    return NextResponse.json({ status: true, authorization_url: data.data.authorization_url, reference });
  } catch (error) {
    console.error("Wallet deposit initialization error:", error);
    return NextResponse.json({ error: "Unable to start wallet deposit." }, { status: 500 });
  }
}
