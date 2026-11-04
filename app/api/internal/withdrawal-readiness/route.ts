import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getDarajaAccessToken, getDarajaConfig } from "@/lib/mpesa/b2c";
import { getPaystackKesBalanceSubunits } from "@/lib/paystack/transfers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!secret) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const liveDeployment = process.env.VERCEL_ENV === "production";
  const withdrawalsEnabled = process.env.COREVIA_WITHDRAWALS_ENABLED === "true";
  const globalLiveApproval = process.env.COREVIA_LIVE_WITHDRAWALS_APPROVED === "true";
  const tillFeeReady = process.env.COREVIA_TILL_FEE_TRANSFER_READY === "true";
  const paystackFeeBuffer = Number(process.env.COREVIA_PAYSTACK_TRANSFER_FEE_BUFFER_KES || "NaN");

  const [paystack, daraja, floatAccounts] = await Promise.all([
    (async () => {
      try {
        const balanceSubunits = await getPaystackKesBalanceSubunits();
        return {
          apiReachable: true,
          kesBalance: balanceSubunits / 100,
          withdrawalsEnabled: process.env.COREVIA_PAYSTACK_WITHDRAWALS_ENABLED === "true",
          noOtpAttested: process.env.COREVIA_PAYSTACK_NO_OTP_CONFIRMED === "true",
          liveApproval: process.env.COREVIA_PAYSTACK_LIVE_READY === "true",
          floatAttested: process.env.COREVIA_PAYSTACK_FLOAT_READY === "true",
          feeBufferConfigured: Number.isFinite(paystackFeeBuffer) && paystackFeeBuffer > 0,
        };
      } catch (error) {
        return {
          apiReachable: false,
          error: error instanceof Error ? error.message : "Paystack API check failed.",
          withdrawalsEnabled: process.env.COREVIA_PAYSTACK_WITHDRAWALS_ENABLED === "true",
          noOtpAttested: process.env.COREVIA_PAYSTACK_NO_OTP_CONFIRMED === "true",
          liveApproval: process.env.COREVIA_PAYSTACK_LIVE_READY === "true",
          floatAttested: process.env.COREVIA_PAYSTACK_FLOAT_READY === "true",
          feeBufferConfigured: Number.isFinite(paystackFeeBuffer) && paystackFeeBuffer > 0,
        };
      }
    })(),
    (async () => {
      try {
        const config = getDarajaConfig();
        await getDarajaAccessToken(config);
        return {
          apiReachable: true,
          environment: config.environment,
          liveApproval: process.env.COREVIA_DARAJA_LIVE_READY === "true",
          floatAttested: process.env.COREVIA_DARAJA_FLOAT_READY === "true",
        };
      } catch (error) {
        return {
          apiReachable: false,
          environment: (process.env.MPESA_ENV || "sandbox").toLowerCase(),
          error: error instanceof Error ? error.message : "Daraja API check failed.",
          liveApproval: process.env.COREVIA_DARAJA_LIVE_READY === "true",
          floatAttested: process.env.COREVIA_DARAJA_FLOAT_READY === "true",
        };
      }
    })(),
    prisma.payoutFloatAccount.findMany({
      orderBy: { provider: "asc" },
      select: { provider: true, availableBalance: true, reservedBalance: true },
    }).then((rows) => rows.map((row) => ({
      provider: row.provider,
      availableBalance: Number(row.availableBalance),
      reservedBalance: Number(row.reservedBalance),
    }))).catch((error) => ({
      schemaReady: false,
      error: error instanceof Error ? error.message : "Provider float tables are unavailable.",
    })),
  ]);

  const databaseReady = Array.isArray(floatAccounts) &&
    floatAccounts.some((row) => row.provider === "DARAJA") &&
    floatAccounts.some((row) => row.provider === "PAYSTACK");

  return NextResponse.json({
    liveDeployment,
    withdrawalsEnabled,
    globalLiveApproval,
    tillFeeReady,
    database: {
      providerFloatSchemaReady: databaseReady,
      accounts: floatAccounts,
    },
    providers: { paystack, daraja },
    activationAllowed: withdrawalsEnabled && (
      !liveDeployment || (
        globalLiveApproval &&
        tillFeeReady &&
        paystack.apiReachable &&
        paystack.withdrawalsEnabled &&
        paystack.noOtpAttested &&
        paystack.liveApproval &&
        paystack.floatAttested &&
        paystack.feeBufferConfigured &&
        daraja.apiReachable &&
        daraja.environment === "production" &&
        daraja.liveApproval &&
        daraja.floatAttested &&
        databaseReady
      )
    ),
    note: "API authentication and environment flags are readiness signals only. They do not prove Safaricom/Paystack payout approval, provider float funding, Till fee settlement, or successful end-to-end callbacks.",
  });
}
