import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as Record<string, unknown>;
    const payload =
      input.data && typeof input.data === "object"
        ? (input.data as Record<string, unknown>)
        : input;

    const reference =
      typeof payload.reference === "string" ? payload.reference.trim() : "";
    const amount = Number(payload.amount);
    const currency =
      typeof payload.currency === "string"
        ? payload.currency.toUpperCase()
        : "";
    const source =
      typeof payload.source === "string" ? payload.source.toLowerCase() : "";
    const reason =
      typeof payload.reason === "string" ? payload.reason : "";

    if (!reference || !Number.isFinite(amount)) {
      return NextResponse.json({ approved: false }, { status: 400 });
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { reference },
      select: {
        reference: true,
        netAmount: true,
        status: true,
      },
    });

    if (!withdrawal || withdrawal.status !== "PROCESSING") {
      return NextResponse.json({ approved: false }, { status: 400 });
    }

    const expectedAmount = Math.round(Number(withdrawal.netAmount) * 100);
    if (amount !== expectedAmount) {
      return NextResponse.json({ approved: false }, { status: 400 });
    }

    if (currency && currency !== "KES") {
      return NextResponse.json({ approved: false }, { status: 400 });
    }

    if (source && source !== "balance") {
      return NextResponse.json({ approved: false }, { status: 400 });
    }

    if (reason && reason !== "Corevia Network withdrawal " + reference) {
      return NextResponse.json({ approved: false }, { status: 400 });
    }

    return NextResponse.json({ approved: true }, { status: 200 });
  } catch (error) {
    console.error("Paystack transfer approval error:", error);
    return NextResponse.json(
      { approved: false },
      { status: 500 },
    );
  }
}
