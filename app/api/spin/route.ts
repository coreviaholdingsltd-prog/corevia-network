
import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sessionCookieName, verifySession } from "@/lib/session";

const TIME_ZONE = "Africa/Nairobi";
const SESSION_POOL_LIMIT = 2000;
const MAX_WIN = 200;

async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  const session = verifySession(token);

  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      membershipStatus: true,
    },
  });
}

function getSpinSession(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  const weekday = values.weekday;
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);
  const hour = Number(values.hour);
  const minute = Number(values.minute);

  const scheduledFor = new Date(
    Date.UTC(year, month - 1, day, 5, 0, 0),
  );

  return {
    scheduledFor,
    sessionKey: `${values.year}-${values.month}-${values.day}`,
    isScheduledDay: weekday === "Mon" || weekday === "Fri",
    isOpen:
      (weekday === "Mon" || weekday === "Fri") &&
      hour === 8 &&
      minute >= 0 &&
      minute < 2,
  };
}

async function getAvailablePool(tx: any) {
  const fees = await tx.ledgerEntry.aggregate({
    where: {
      ownerType: "COREVIA",
      type: "WITHDRAWAL_FEE",
      amount: { gt: 0 },
    },
    _sum: { amount: true },
  });

  const rewards = await tx.ledgerEntry.aggregate({
    where: {
      ownerType: "COREVIA",
      type: "SPIN_REWARD",
      amount: { lt: 0 },
    },
    _sum: { amount: true },
  });

  return Math.max(
    0,
    Number(fees._sum.amount ?? 0) +
      Number(rewards._sum.amount ?? 0),
  );
}

async function getOrCreateEvent(tx: any, scheduledFor: Date) {
  let event = await tx.spinEvent.findFirst({
    where: { scheduledFor },
  });

  if (event) return event;

  const availablePool = await getAvailablePool(tx);
  const allocation = Math.min(SESSION_POOL_LIMIT, availablePool);

  event = await tx.spinEvent.create({
    data: {
      scheduledFor,
      status: "OPEN",
      totalAllocation: allocation,
      maxWin: MAX_WIN,
    },
  });

  return event;
}

function drawPrize(): number {
  const draw = randomInt(100);

  if (draw < 70) return 0;
  if (draw < 85) return 20;
  if (draw < 93) return 50;
  if (draw < 98) return 100;
  return 200;
}

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to continue." },
        { status: 401 },
      );
    }

    if (user.membershipStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "Spin is available to active members only." },
        { status: 403 },
      );
    }

    const session = getSpinSession();
    let hasSpun = false;

    if (session.isOpen) {
      const event = await prisma.spinEvent.findFirst({
        where: { scheduledFor: session.scheduledFor },
      });

      if (event) {
        const entry = await prisma.spinEntry.findFirst({
          where: {
            spinEventId: event.id,
            userId: user.id,
          },
        });

        hasSpun = Boolean(entry);
      }
    }

    return NextResponse.json({
      isOpen: session.isOpen,
      hasSpun,
      nextSession: "Monday and Friday, 8:00 AM–8:02 AM East Africa Time",
      timeZone: TIME_ZONE,
    });
  } catch (error) {
    console.error("Spin status error:", error);

    return NextResponse.json(
      { error: "Unable to check spin status." },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to continue." },
        { status: 401 },
      );
    }

    if (user.membershipStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: "Spin is available to active members only." },
        { status: 403 },
      );
    }

    const session = getSpinSession();

    if (!session.isOpen) {
      return NextResponse.json(
        {
          error:
            "Spin is open only on Mondays and Fridays from 8:00 AM to 8:02 AM Kenya time.",
        },
        { status: 403 },
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // Serialize spin requests so simultaneous members cannot
        // spend the same remaining pool.
        await tx.$queryRaw`
          SELECT pg_advisory_xact_lock(hashtext('corevia-network-spin'))
        `;

        const event = await getOrCreateEvent(
          tx,
          session.scheduledFor,
        );

        const existingEntry = await tx.spinEntry.findFirst({
          where: {
            spinEventId: event.id,
            userId: user.id,
          },
        });

        if (existingEntry) {
          return {
            error: "You have already used your spin for this session.",
            status: 409,
          };
        }

        const totals = await tx.spinEntry.aggregate({
          where: { spinEventId: event.id },
          _sum: { amountWon: true },
        });

        const alreadyAwarded = Number(
          totals._sum.amountWon ?? 0,
        );

        const remainingPool = Math.max(
          0,
          Number(event.totalAllocation) - alreadyAwarded,
        );

        const prize = Math.min(
          drawPrize(),
          MAX_WIN,
          remainingPool,
        );

        const entry = await tx.spinEntry.create({
          data: {
            spinEventId: event.id,
            userId: user.id,
            amountWon: prize,
            isWinner: prize > 0,
          },
        });

        if (prize > 0) {
          const reference = `SPIN-${event.id}-${user.id}`;

          await tx.wallet.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              balance: prize,
            },
            update: {
              balance: { increment: prize },
            },
          });

          await tx.walletTransaction.create({
            data: {
              userId: user.id,
              type: "SPIN_REWARD",
              status: "COMPLETED",
              amount: prize,
              reference: `${reference}-WALLET`,
              description: "Corevia Network promotional spin reward",
              completedAt: new Date(),
            },
          });

          await tx.ledgerEntry.create({
            data: {
              ownerType: "MEMBER",
              userId: user.id,
              amount: prize,
              type: "SPIN_REWARD",
              reference: `${reference}-MEMBER`,
              description: "Promotional spin reward credited to member",
            },
          });

          await tx.ledgerEntry.create({
            data: {
              ownerType: "COREVIA",
              amount: -prize,
              type: "SPIN_REWARD",
              reference: `${reference}-COREVIA`,
              description: "Promotional spin reward paid from collected fee pool",
            },
          });
        }

        return {
          amountWon: Number(entry.amountWon),
          remainingPool: remainingPool - prize,
          status: 200,
        };
      },
      {
        isolationLevel: "Serializable",
      },
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json({
      success: true,
      amountWon: result.amountWon,
      remainingPool: result.remainingPool,
      message:
        result.amountWon > 0
          ? `Congratulations! KES ${result.amountWon} has been credited to your wallet.`
          : "No reward this time. You can try again at the next scheduled session.",
    });
  } catch (error) {
    console.error("Spin request error:", error);

    return NextResponse.json(
      {
        error:
          "Your spin could not be processed. Please refresh and check your status before trying again.",
      },
      { status: 500 },
    );
  }
}
