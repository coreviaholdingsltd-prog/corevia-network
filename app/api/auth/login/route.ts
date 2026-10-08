import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, sessionCookieName } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        referralCode: true,
        membershipStatus: true,
        passwordHash: true,
      },
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = createSession(user.id);

    const response = NextResponse.json({
      status: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        membershipStatus: user.membershipStatus,
      },
    });

    response.cookies.set({
      name: sessionCookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Unable to sign in." },
      { status: 500 }
    );
  }
}