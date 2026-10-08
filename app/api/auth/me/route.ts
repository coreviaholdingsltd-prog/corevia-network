import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(sessionCookieName)?.value;

    const session = verifySession(token);

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        referralCode: true,
        membershipStatus: true,
        membershipPaidAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Member account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: true,
      user,
    });
  } catch (error) {
    console.error("Session lookup error:", error);

    return NextResponse.json(
      { error: "Unable to verify session." },
      { status: 500 }
    );
  }
}