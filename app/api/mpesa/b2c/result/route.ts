import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settleWithdrawalFailure, settleWithdrawalSuccess } from "@/lib/mpesa/settlement";

export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.MPESA_B2C_CALLBACK_TOKEN;
  if (!expected) return false;
  const url = new URL(request.url);
  const supplied = url.searchParams.get("token") || "";
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && require("node:crypto").timingSafeEqual(a, b);
}

function resultParameter(result: Record<string, unknown>, key: string) {
  const params = result.ResultParameters as { ResultParameter?: Array<{ Key?: string; Value?: unknown }> } | undefined;
  return params?.ResultParameter?.find((item) => item.Key === key)?.Value;
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized callback." }, { status: 401 });

  try {
    const body = await request.json();
    const result = body?.Result as Record<string, unknown> | undefined;
    if (!result) return NextResponse.json({ Result: "Ignored: missing result payload." });

    const originatorId = String(result.OriginatorConversationID || "");
    const conversationId = String(result.ConversationID || "");
    const withdrawal = await prisma.withdrawal.findFirst({
      where: {
        OR: [
          ...(originatorId ? [{ originatorConversationId: originatorId }] : []),
          ...(conversationId ? [{ conversationId }] : []),
        ],
      },
      select: { reference: true },
    });
    if (!withdrawal) {
      console.warn("Daraja callback did not match a withdrawal.", { originatorId, conversationId });
      return NextResponse.json({ Result: "Accepted: no matching withdrawal." });
    }

    const resultCode = Number(result.ResultCode);
    const resultDescription = String(result.ResultDesc || "Safaricom B2C result received.");
    if (resultCode === 0) {
      const receipt = resultParameter(result, "TransactionReceipt");
      await settleWithdrawalSuccess(withdrawal.reference, {
        resultCode,
        resultDescription,
        receiptNumber: receipt == null ? null : String(receipt),
        conversationId: conversationId || null,
      });
    } else {
      await settleWithdrawalFailure(withdrawal.reference, resultCode, resultDescription);
    }

    return NextResponse.json({ Result: "Accepted" });
  } catch (error) {
    console.error("Daraja B2C result callback error:", error);
    return NextResponse.json({ error: "Callback processing failed." }, { status: 500 });
  }
}
