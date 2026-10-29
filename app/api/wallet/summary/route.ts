
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = verifySession(
      cookieStore.get(sessionCookieName)?.value,
    );

    if (!session) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    const [wallet, transactions] = await Promise.all([
      prisma.wallet.findUnique({
        where: { userId: session.userId },
        select: { balance: true },
      }),
      prisma.walletTransaction.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          type: true,
          status: true,
          amount: true,
          reference: true,
          description: true,
          createdAt: true,
          completedAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      status: true,
      balance: wallet ? Number(wallet.balance) : 0,
      transactions: transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
      })),
    });
  } catch (error) {
    console.error("Wallet summary error:", error);

    return NextResponse.json(
      { error: "Unable to load wallet information right now." },
      { status: 500 },
    );
  }
}
