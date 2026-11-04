import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionCookieName, verifySession } from "@/lib/session";
import { processWalletDeposit } from "@/lib/wallet-deposits";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 });
    const jar = await cookies();
    const session = verifySession(jar.get(sessionCookieName)?.value);
    if (!session) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    const body = await request.json();
    const reference = String(body.reference ?? "").trim();
    if (!reference) return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });
    const response = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference), { headers: { Authorization: "Bearer " + secret }, cache: "no-store", signal: AbortSignal.timeout(15000) });
    const data = await response.json();
    if (!response.ok || !data.status || !data.data) return NextResponse.json({ error: data.message || "Unable to verify wallet deposit." }, { status: 502 });
    if (data.data.reference !== reference) return NextResponse.json({ error: "Paystack reference did not match." }, { status: 400 });
    if (data.data.status !== "success") {
      const terminalFailure = data.data.status === "failed" || data.data.status === "abandoned";
      if (terminalFailure) {
        await (await import("@/lib/prisma")).prisma.paymentRecord.updateMany({
          where: { providerReference: reference, userId: session.userId, provider: "PAYSTACK", destination: "OTHER", status: "PENDING" },
          data: { status: "FAILED" },
        });
      }
      return NextResponse.json({
        error: terminalFailure
          ? "Paystack confirms this deposit did not complete. You can start a fresh STK push."
          : "Payment has not completed yet. Complete the M-PESA prompt on your phone.",
        paymentStatus: data.data.status,
        terminal: terminalFailure,
      }, { status: 409 });
    }
    const result = await processWalletDeposit({ reference: String(data.data.reference), amount: Number(data.data.amount), currency: String(data.data.currency), status: String(data.data.status), paid_at: data.data.paid_at ?? null, metadata: data.data.metadata ?? null }, session.userId);
    return NextResponse.json({ status: true, ...result, message: "Wallet deposit confirmed." });
  } catch (error) {
    console.error("Wallet deposit verification error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to verify wallet deposit." }, { status: 400 });
  }
}
