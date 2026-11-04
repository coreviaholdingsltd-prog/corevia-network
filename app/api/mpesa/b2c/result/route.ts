import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
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
  return a.length === b.length && timingSafeEqual(a, b);
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
    if (!result) return NextResponse.json({ error: "Missing Safaricom result payload." }, { status: 400 });

    const originatorId = String(result.OriginatorConversationID || "");
    const conversationId = String(result.ConversationID || "");
    const rawResultCode = result.ResultCode;
    const resultCode = typeof rawResultCode === "number"
      ? rawResultCode
      : typeof rawResultCode === "string" && /^\d+$/.test(rawResultCode)
        ? Number(rawResultCode)
        : Number.NaN;

    if (
      !Number.isSafeInteger(resultCode) ||
      resultCode < 0 ||
      (!originatorId && !conversationId)
    ) {
      return NextResponse.json({ error: "Invalid Safaricom result payload." }, { status: 400 });
    }

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

    const resultDescription = typeof result.ResultDesc === "string" ? result.ResultDesc : "";
    if (resultCode === 0) {
      const rawReceipt = resultParameter(result, "TransactionReceipt");
      const receipt = typeof rawReceipt === "string" ? rawReceipt.trim() : "";
      if (!/^[A-Z0-9]{8,20}$/i.test(receipt) || !resultDescription.trim()) {
        console.error("Successful Daraja callback is missing a valid receipt or description.", {
          reference: withdrawal.reference,
          conversationId,
        });
        return NextResponse.json({ error: "Successful result is incomplete; withdrawal remains processing for reconciliation." }, { status: 400 });
      }

      await settleWithdrawalSuccess(withdrawal.reference, {
        resultCode,
        resultDescription,
        receiptNumber: receipt,
        conversationId: conversationId || null,
      });
    } else {
      if (!resultDescription.trim()) {
        return NextResponse.json({ error: "Failure result is missing its description; withdrawal remains processing." }, { status: 400 });
      }
      await settleWithdrawalFailure(withdrawal.reference, resultCode, resultDescription);
    }

    return NextResponse.json({ Result: "Accepted" });
  } catch (error) {
    console.error("Daraja B2C result callback error:", error);
    return NextResponse.json({ error: "Callback processing failed." }, { status: 500 });
  }
}
