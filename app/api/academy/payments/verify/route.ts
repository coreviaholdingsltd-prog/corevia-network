import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";
import { processAcademyCoursePayment } from "@/lib/academy-payments";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = verifySession(cookieStore.get(sessionCookieName)?.value);
    if (!session) return NextResponse.json({ error: "Please sign in to verify your Academy payment." }, { status: 401 });
    const body = await request.json();
    const reference = String(body.reference ?? "").trim();
    if (!reference) return NextResponse.json({ error: "Payment reference is required." }, { status: 400 });

    const saved = await prisma.academyPayment.findUnique({ where: { providerReference: reference } });
    if (!saved) return NextResponse.json({ error: "Academy payment reference was not found." }, { status: 404 });
    if (saved.userId !== session.userId) return NextResponse.json({ error: "This payment belongs to another member." }, { status: 403 });
    if (saved.status === "COMPLETED") return NextResponse.json({ status: true, alreadyProcessed: true, courseId: saved.courseId });

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 });
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` }, cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok || !data.status || !data.data) return NextResponse.json({ error: data.message || "Unable to verify the course payment." }, { status: 502 });
    if (data.data.reference !== reference) return NextResponse.json({ error: "Paystack reference did not match." }, { status: 400 });
    const result = await processAcademyCoursePayment({
      reference: String(data.data.reference),
      amount: Number(data.data.amount),
      currency: String(data.data.currency),
      status: String(data.data.status),
      paid_at: data.data.paid_at ?? null,
      metadata: data.data.metadata ?? null,
    }, session.userId);
    return NextResponse.json({ status: true, ...result, message: "Academy course payment confirmed." });
  } catch (error) {
    console.error("Academy payment verification error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to verify Academy payment." }, { status: 400 });
  }
}
