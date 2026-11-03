import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const expected = process.env.MPESA_B2C_CALLBACK_TOKEN;
  const supplied = new URL(request.url).searchParams.get("token") || "";
  if (!expected || supplied.length !== expected.length) {
    return NextResponse.json({ error: "Unauthorized callback." }, { status: 401 });
  }

  const { timingSafeEqual } = await import("node:crypto");
  if (!timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return NextResponse.json({ error: "Unauthorized callback." }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.warn("Daraja B2C queue timeout; withdrawal intentionally remains PROCESSING pending reconciliation.", body);
    return NextResponse.json({ Result: "Accepted for reconciliation." });
  } catch {
    return NextResponse.json({ Result: "Accepted." });
  }
}
