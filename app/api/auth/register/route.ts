import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

function createReferralCode() {
  return `CV${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function normalizeKenyanPhone(value: string) {
  const phone = value.replace(/\s+/g, "").trim();

  if (/^07\d{8}$/.test(phone)) {
    return `+254${phone.slice(1)}`;
  }

  if (/^01\d{8}$/.test(phone)) {
    return `+254${phone.slice(1)}`;
  }

  if (/^254\d{9}$/.test(phone)) {
    return `+${phone}`;
  }

  if (/^\+254\d{9}$/.test(phone)) {
    return phone;
  }

  return phone;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const rawPhone = String(body.phone ?? "").trim();
    const phone = normalizeKenyanPhone(rawPhone);

    const password = String(body.password ?? "");

    const referralCode = String(body.referralCode ?? "")
      .trim()
      .toUpperCase();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 },
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (!rawPhone) {
      return NextResponse.json(
        {
          error:
            "Please enter the phone number that will be used for withdrawals.",
        },
        { status: 400 },
      );
    }

    if (!/^\+254\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid Kenyan phone number, for example 0712345678.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with that email or registered phone number already exists.",
        },
        { status: 409 },
      );
    }

    let referrerId: string | undefined;

    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true },
      });

      if (!referrer) {
        return NextResponse.json(
          { error: "Referral code not found." },
          { status: 400 },
        );
      }

      referrerId = referrer.id;
    }

    const passwordHash = hashPassword(password);

    for (let attempt = 0; attempt < 5; attempt++) {
      const generatedReferralCode = createReferralCode();

      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
            phone,
            passwordHash,
            referralCode: generatedReferralCode,
            referredById: referrerId,
            membershipStatus: "PENDING",
            wallet: {
              create: {
                balance: 0,
              },
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            referralCode: true,
            membershipStatus: true,
            createdAt: true,
          },
        });

        return NextResponse.json(
          {
            status: true,
            message:
              "Account created successfully. Activate your membership with the one-time KES 1,000 payment.",
            user,
          },
          { status: 201 },
        );
      } catch (error) {
        const code =
          error &&
          typeof error === "object" &&
          "code" in error
            ? String((error as { code?: unknown }).code)
            : "";

        if (code !== "P2002" || attempt === 4) {
          throw error;
        }
      }
    }

    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { error: "Unable to create account. Please try again." },
      { status: 500 },
    );
  }
}