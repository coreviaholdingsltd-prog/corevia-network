import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

function referralCode() {
  return "CV" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim() || null;
    const password = String(body.password ?? "");
    const code = String(body.referralCode ?? "").trim().toUpperCase();

    if (!name || !email || password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Name, email and a password of at least 8 characters are required.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with that email or phone already exists." },
        { status: 409 }
      );
    }

    const referrer = code
      ? await prisma.user.findUnique({
          where: { referralCode: code },
        })
      : null;

    if (code && !referrer) {
      return NextResponse.json(
        { error: "Referral code not found." },
        { status: 400 }
      );
    }

    let generated = referralCode();

    while (
      await prisma.user.findUnique({
        where: { referralCode: generated },
      })
    ) {
      generated = referralCode();
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashPassword(password),
        referralCode: generated,
        referredById: referrer?.id,
        wallet: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        membershipStatus: true,
      },
    });

    return NextResponse.json({
      status: true,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Unable to create account." },
      { status: 500 }
    );
  }
}