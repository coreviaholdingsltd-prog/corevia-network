import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";
import { getAcademyQualification } from "@/lib/academy-levels";
import { initiateAcademyMpesaPush, normalizeMpesaPhone } from "@/lib/academy-mpesa";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to enroll." }, { status: 401 });
    const body = await request.json();
    const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
    const qualificationLevel = typeof body.qualificationLevel === "string" ? body.qualificationLevel : "CERTIFICATE";
    const qualification = getAcademyQualification(qualificationLevel);
    const phone = normalizeMpesaPhone(body.phone);
    if (!courseId || !qualification || !phone) {
      return NextResponse.json({ error: "Select a course and qualification, and enter a valid Kenyan M-PESA number." }, { status: 400 });
    }
    const course = findAcademyCourse(courseId);
    if (!course || !course.published) return NextResponse.json({ error: "Course not found or not available." }, { status: 404 });

    const existing = await prisma.academyEnrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });
    if (existing && (existing.status === "ACTIVE" || existing.status === "COMPLETED")) {
      return NextResponse.json({ status: true, alreadyEnrolled: true, message: "You are already enrolled in this course." });
    }

    const enrollment = existing ?? await prisma.academyEnrollment.create({
      data: { userId: user.id, courseId: course.id, status: "PENDING_PAYMENT", amountPaid: 0, qualificationLevel, qualificationFeeKsh: qualification.feeKsh },
    });
    if (existing) await prisma.academyEnrollment.update({
      where: { id: existing.id }, data: { qualificationLevel, qualificationFeeKsh: qualification.feeKsh },
    });

    const pending = await prisma.academyPayment.findFirst({
      where: { enrollmentId: enrollment.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    if (pending) {
      return NextResponse.json({
        error: "An earlier payment is still awaiting confirmation. Do not pay again; retry verification using its reference.",
        reference: pending.providerReference,
      }, { status: 409 });
    }

    const reference = `CVA${Date.now().toString().slice(-9)}${crypto.randomBytes(2).toString("hex").toUpperCase()}`.slice(0, 12);
    const payment = await prisma.academyPayment.create({
      data: {
        userId: user.id,
        enrollmentId: enrollment.id,
        courseId: course.id,
        amount: qualification.feeKsh,
        qualificationLevel,
        provider: "MPESA",
        providerReference: reference,
        status: "PENDING",
      },
    });

    try {
      const push = await initiateAcademyMpesaPush({
        paymentId: payment.id,
        reference,
        phone,
        amount: qualification.feeKsh,
        courseTitle: course.title,
      });
      return NextResponse.json({
        status: true,
        paymentPending: true,
        reference,
        message: `${push.customerMessage} Enter your M-PESA PIN on your phone. Your course unlocks after Safaricom confirms payment.`,
      });
    } catch (error) {
      console.error("Academy M-PESA initiation requires reconciliation:", error);
      return NextResponse.json({
        error: error instanceof Error ? error.message : "M-PESA request could not be confirmed. Do not retry payment until this reference is checked.",
        reference,
      }, { status: 502 });
    }
  } catch (error) {
    console.error("Academy M-PESA enrollment error:", error);
    return NextResponse.json({ error: "Unable to start M-PESA Academy payment." }, { status: 500 });
  }
}
