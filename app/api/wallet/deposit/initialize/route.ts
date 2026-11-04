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

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, membershipStatus: true },
    });
    if (!user) return NextResponse.json({ error: "Member account not found." }, { status: 404 });
    if (user.membershipStatus !== "ACTIVE") {
      return NextResponse.json({ error: "Activate your membership before funding your wallet." }, { status: 403 });
    }

    const body = await request.json();
    const raw = String(body.amount ?? "").trim();
    const amount = Number(raw);
    const amountSubunits = Math.round(amount * 100);
    if (!/^\d+(?:\.\d{1,2})?$/.test(raw) || !Number.isSafeInteger(amountSubunits) || amountSubunits < 10000 || amountSubunits > 15000000) {
      return NextResponse.json({ error: "Enter an amount between KES 100 and KES 150,000." }, { status: 400 });
    }

    const pending = await prisma.paymentRecord.findFirst({
      where: {
        userId: user.id,
        provider: "PAYSTACK",
        destination: "OTHER",
        status: "PENDING",
        providerReference: { startsWith: "CV-WALLET-" },
      },
      orderBy: { createdAt: "desc" },
      select: { providerReference: true },
    });
    if (pending) {
      return NextResponse.json({
        error: "A wallet checkout is already pending. Verify its status before starting another payment.",
        reference: pending.providerReference,
      }, { status: 409 });
    }

    const reference = "CV-WALLET-" + Date.now() + "-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    await prisma.paymentRecord.create({
      data: {
        userId: user.id,
        amount: amountSubunits / 100,
        provider: "PAYSTACK",
        providerReference: reference,
        destination: "OTHER",
        status: "PENDING",
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    let response: Response;
    let data: {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; access_code?: string; reference?: string };
    };

    try {
      response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + secret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          amount: amountSubunits,
          currency: "KES",
          reference,
          callback_url: siteUrl + "/wallet?deposit=" + encodeURIComponent(reference),
          metadata: {
            purpose: "COREVIA_WALLET_DEPOSIT",
            userId: user.id,
            custom_fields: [{ display_name: "Wallet deposit", variable_name: "wallet_deposit", value: reference }],
          },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });
      data = await response.json();
    } catch {
      return NextResponse.json({
        error: "Paystack initialization timed out. Check this reference before starting another payment.",
        reference,
      }, { status: 502 });
    }

    if (!response.ok || !data.status || data.data?.reference !== reference || !data.data.authorization_url) {
      await prisma.paymentRecord.updateMany({
        where: { providerReference: reference, userId: user.id, status: "PENDING" },
        data: { status: "FAILED" },
      });
      return NextResponse.json({
        error: data.message || "Paystack could not create the wallet checkout.",
      }, { status: 502 });
    }

    return NextResponse.json({
      status: true,
      reference,
      authorizationUrl: data.data.authorization_url,
      message: "Paystack checkout is ready.",
    });
  } catch (error) {
    console.error("Wallet checkout initialization error:", error);
    return NextResponse.json({ error: "Unable to initialize wallet checkout." }, { status: 500 });
  }
}
