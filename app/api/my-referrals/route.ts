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
        { error: "Please sign in first." },
        { status: 401 },
      );
    }

    const clients = await prisma.user.findMany({
      where: { referredById: session.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        membershipStatus: true,
        membershipPaidAt: true,
      },
    });

    const rewards = await prisma.referralReward.findMany({
      where: {
        recipientId: session.userId,
        sourceUserId: { in: clients.map((client) => client.id) },
      },
      select: {
        sourceUserId: true,
        amount: true,
        level: true,
      },
    });

    const clientsWithRewards = clients.map((client) => {
      const clientRewards = rewards.filter(
        (reward) => reward.sourceUserId === client.id,
      );

      return {
        id: client.id,
        name: client.name,
        registeredAt: client.createdAt,
        membershipStatus: client.membershipStatus,
        membershipPaidAt: client.membershipPaidAt,
        rewardEarned: clientRewards.reduce(
          (total, reward) => total + Number(reward.amount),
          0,
        ),
      };
    });

    return NextResponse.json({
      status: true,
      total: clients.length,
      active: clients.filter(
        (client) => client.membershipStatus === "ACTIVE",
      ).length,
      pending: clients.filter(
        (client) => client.membershipStatus === "PENDING",
      ).length,
      clients: clientsWithRewards,
    });
  } catch (error) {
    console.error("Referral list error:", error);

    return NextResponse.json(
      { error: "Unable to load your referrals." },
      { status: 500 },
    );
  }
}
