import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

export const runtime = "nodejs";
export async function GET() {
  try {
    const jar = await cookies();
    const session = verifySession(jar.get(sessionCookieName)?.value);
    if (!session) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    const pending = await prisma.paymentRecord.findFirst({
      where: { userId: session.userId, provider: "PAYSTACK", destination: "OTHER", status: "PENDING" },
      orderBy: { createdAt: "desc" },
      select: { providerReference: true, amount: true, createdAt: true },
    });
    return NextResponse.json({ status: true, pending: pending ? { reference: pending.providerReference, amount: Number(pending.amount), createdAt: pending.createdAt } : null });
  } catch (error) {
    console.error("Pending wallet deposit lookup error:", error);
    return NextResponse.json({ error: "Unable to check pending wallet deposits." }, { status: 500 });
  }
}
