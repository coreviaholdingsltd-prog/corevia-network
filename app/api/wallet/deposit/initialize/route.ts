import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 });
    const jar = await cookies();
    const session = verifySession(jar.get(sessionCookieName)?.value);
    if (!session) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, email: true, phone: true, membershipStatus: true } });
    if (!user) return NextResponse.json({ error: "Member account not found." }, { status: 404 });
    if (user.membershipStatus !== "ACTIVE") return NextResponse.json({ error: "Activate your membership before funding your wallet." }, { status: 403 });
    const digits = String(user.phone || "").replace(/\D/g, "");
    const mpesaPhone = digits.startsWith("254") ? "+" + digits : digits.startsWith("0") ? "+254" + digits.slice(1) : digits.startsWith("7") || digits.startsWith("1") ? "+254" + digits : "";
    if (!/^\+254[17]\d{8}$/.test(mpesaPhone)) return NextResponse.json({ error: "Add a valid Kenyan M-PESA phone number to your member profile before depositing." }, { status: 400 });
    const body = await request.json();
    const raw = String(body.amount ?? "").trim();
    const amount = Number(raw), cents = Math.round(amount * 100);
    if (!/^\d+(?:\.\d{1,2})?$/.test(raw) || !Number.isSafeInteger(cents) || cents < 10000 || cents > 15000000) return NextResponse.json({ error: "Enter an amount between KES 100 and KES 150,000." }, { status: 400 });
    const pending = await prisma.paymentRecord.findFirst({ where: { userId: user.id, provider: "PAYSTACK", destination: "OTHER", status: "PENDING", providerReference: { startsWith: "CV-MPESA-" } }, orderBy: { createdAt: "desc" }, select: { providerReference: true } });
    if (pending) return NextResponse.json({ error: "A wallet deposit is already awaiting confirmation. Verify it before starting another.", reference: pending.providerReference }, { status: 409 });
    const reference = "CV-MPESA-" + Date.now() + "-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    await prisma.paymentRecord.create({ data: { userId: user.id, amount: cents / 100, provider: "PAYSTACK", providerReference: reference, destination: "OTHER", status: "PENDING" } });
    let response: Response;
    let data: { status?: boolean; message?: string; data?: { reference?: string; status?: string; display_text?: string } };
    try {
      response = await fetch("https://api.paystack.co/charge", { method: "POST", headers: { Authorization: "Bearer " + secret, "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email, amount: cents, currency: "KES", reference, mobile_money: { phone: mpesaPhone, provider: "mpesa" }, metadata: { purpose: "COREVIA_WALLET_DEPOSIT", userId: user.id } }), cache: "no-store", signal: AbortSignal.timeout(20000) });
      data = await response.json();
    } catch {
      return NextResponse.json({ error: "Payment initialization is uncertain. Verify this reference before trying again.", reference }, { status: 502 });
    }
    if (!response.ok || !data.status || !data.data?.reference || data.data.reference !== reference) {
      await prisma.paymentRecord.updateMany({ where: { providerReference: reference, status: "PENDING" }, data: { status: "FAILED" } });
      return NextResponse.json({ error: data.message || "Unable to start wallet deposit." }, { status: 502 });
    }
    return NextResponse.json({ status: true, reference, paymentStatus: data.data.status || "pending", displayText: data.data.display_text || "Check your phone and complete the M-PESA authorization.", message: data.message || "M-PESA STK push requested." });
  } catch (error) {
    console.error("Wallet deposit initialization error:", error);
    return NextResponse.json({ error: "Unable to initialize wallet deposit." }, { status: 500 });
  }
}
