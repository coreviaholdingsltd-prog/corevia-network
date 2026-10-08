import { prisma } from "@/lib/prisma";

const MEMBERSHIP_AMOUNT = 1000;
const COREVIA_SHARE = 300;
const REFERRER_SHARE = 500;
const UPLINE_SHARE = 200;

export async function processMembershipPayment(
  payment: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paid_at?: string | null;
    metadata?: Record<string, unknown> | null;
  },
  expectedUserId?: string,
) {
  if (payment.status !== "success") {
    throw new Error("Payment is not successful.");
  }

  if (payment.currency !== "KES") {
    throw new Error("Payment must be in KES.");
  }

  if (Number(payment.amount) !== 100000) {
    throw new Error("Membership payment must be KES 1,000.");
  }

  const reference = String(payment.reference || "").trim();

  if (!reference) {
    throw new Error("Payment reference is missing.");
  }

  const existing = await prisma.paymentRecord.findUnique({
    where: { providerReference: reference },
    select: {
      id: true,
      userId: true,
      amount: true,
      allocationReference: true,
    },
  });

  if (existing?.allocationReference) {
    return {
      alreadyProcessed: true,
      userId: existing.userId,
      reference,
      membershipStatus: "ACTIVE",
    };
  }

  if (existing && Number(existing.amount) !== MEMBERSHIP_AMOUNT) {
    throw new Error("Payment amount does not match the membership fee.");
  }

  const metadataUserId =
    typeof payment.metadata?.userId === "string"
      ? payment.metadata.userId
      : "";

  const userId = expectedUserId || existing?.userId || metadataUserId;

  if (!userId) {
    throw new Error("Unable to identify the member.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      referredById: true,
      referredBy: {
        select: {
          id: true,
          referredById: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Member account not found.");
  }

  const paidAt = payment.paid_at
    ? new Date(payment.paid_at)
    : new Date();

  const allocationReference = `MEMBERSHIP-${reference}`;

  return prisma.$transaction(async (tx) => {
    const check = await tx.paymentRecord.findUnique({
      where: { providerReference: reference },
      select: {
        id: true,
        userId: true,
        amount: true,
        allocationReference: true,
      },
    });

    if (check?.allocationReference) {
      return {
        alreadyProcessed: true,
        userId: check.userId,
        reference,
        membershipStatus: "ACTIVE",
      };
    }

    if (check && check.userId !== user.id) {
      throw new Error("Payment belongs to another member.");
    }

    if (check && Number(check.amount) !== MEMBERSHIP_AMOUNT) {
      throw new Error("Stored payment amount does not match membership fee.");
    }

    const paymentRecord = check
      ? check
      : await tx.paymentRecord.create({
          data: {
            userId: user.id,
            amount: MEMBERSHIP_AMOUNT,
            provider: "PAYSTACK",
            providerReference: reference,
            destination: "COREVIA_TILL",
            status: "COMPLETED",
            verifiedAt: paidAt,
          },
          select: {
            id: true,
            userId: true,
            amount: true,
            allocationReference: true,
          },
        });

    const referrerId = user.referredById;
    const uplineId = user.referredBy?.referredById ?? null;

    const coreviaAmount = referrerId
      ? uplineId
        ? COREVIA_SHARE
        : MEMBERSHIP_AMOUNT - REFERRER_SHARE
      : MEMBERSHIP_AMOUNT;

    await tx.ledgerEntry.create({
      data: {
        ownerType: "COREVIA",
        amount: coreviaAmount,
        type: "MEMBERSHIP_PAYMENT",
        reference: `${allocationReference}-COREVIA`,
        description: `Corevia share from ${reference}`,
      },
    });

    if (referrerId) {
      await tx.referralReward.create({
        data: {
          recipientId: referrerId,
          sourceUserId: user.id,
          level: 1,
          amount: REFERRER_SHARE,
          transactionRef: `${allocationReference}-REFERRER`,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          ownerType: "MEMBER",
          userId: referrerId,
          amount: REFERRER_SHARE,
          type: "REFERRAL_REWARD",
          reference: `${allocationReference}-REFERRER-LEDGER`,
          description: `Direct referral reward from ${user.email}`,
        },
      });

      await tx.wallet.upsert({
        where: { userId: referrerId },
        create: {
          userId: referrerId,
          balance: REFERRER_SHARE,
        },
        update: {
          balance: { increment: REFERRER_SHARE },
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: referrerId,
          type: "REFERRAL_REWARD",
          status: "COMPLETED",
          amount: REFERRER_SHARE,
          reference: `${allocationReference}-REFERRER-WALLET`,
          description: `Direct referral reward from ${user.email}`,
          completedAt: paidAt,
        },
      });
    }

    if (uplineId) {
      await tx.referralReward.create({
        data: {
          recipientId: uplineId,
          sourceUserId: user.id,
          level: 2,
          amount: UPLINE_SHARE,
          transactionRef: `${allocationReference}-UPLINE`,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          ownerType: "MEMBER",
          userId: uplineId,
          amount: UPLINE_SHARE,
          type: "REFERRAL_REWARD",
          reference: `${allocationReference}-UPLINE-LEDGER`,
          description: `Second-level referral reward from ${user.email}`,
        },
      });

      await tx.wallet.upsert({
        where: { userId: uplineId },
        create: {
          userId: uplineId,
          balance: UPLINE_SHARE,
        },
        update: {
          balance: { increment: UPLINE_SHARE },
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: uplineId,
          type: "REFERRAL_REWARD",
          status: "COMPLETED",
          amount: UPLINE_SHARE,
          reference: `${allocationReference}-UPLINE-WALLET`,
          description: `Second-level referral reward from ${user.email}`,
          completedAt: paidAt,
        },
      });
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        membershipStatus: "ACTIVE",
        membershipPaidAt: paidAt,
      },
    });

    await tx.paymentRecord.update({
      where: { id: paymentRecord.id },
      data: {
        status: "COMPLETED",
        verifiedAt: paidAt,
        allocationReference,
      },
    });

    await tx.membershipPayment.upsert({
      where: { providerReference: reference },
      create: {
        userId: user.id,
        amount: MEMBERSHIP_AMOUNT,
        provider: "PAYSTACK",
        providerReference: reference,
        status: "COMPLETED",
        verifiedAt: paidAt,
      },
      update: {
        status: "COMPLETED",
        verifiedAt: paidAt,
      },
    });

    return {
      alreadyProcessed: false,
      userId: user.id,
      reference,
      corevia: coreviaAmount,
      referrer: referrerId ? REFERRER_SHARE : 0,
      upline: uplineId ? UPLINE_SHARE : 0,
      membershipStatus: "ACTIVE",
    };
  });
}
