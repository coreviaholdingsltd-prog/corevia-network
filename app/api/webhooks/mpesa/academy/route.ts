import { NextResponse } from "next/server";
import { processAcademyMpesaCallback } from "@/lib/academy-mpesa";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await processAcademyMpesaCallback(payload);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted", result });
  } catch (error) {
    console.error("Academy M-PESA callback could not be reconciled:", error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Callback reconciliation pending" }, { status: 500 });
  }
}
