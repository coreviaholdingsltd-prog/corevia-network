
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getAcademyUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to enroll." },
        { status: 401 },
      );
    }

    let body: { courseId?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid enrollment request." },
        { status: 400 },
      );
    }

    const courseId =
      typeof body.courseId === "string" ? body.courseId.trim() : "";

    if (!courseId) {
      return NextResponse.json(
        { error: "Please select a course." },
        { status: 400 },
      );
    }

    const course = findAcademyCourse(courseId);

    if (!course || !course.published) {
      return NextResponse.json(
        { error: "Course not found or not available." },
        { status: 404 },
      );
    }

    const existing = await prisma.academyEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (
      existing &&
      (existing.status === "ACTIVE" || existing.status === "COMPLETED")
    ) {
      return NextResponse.json({
        status: true,
        alreadyEnrolled: true,
        courseId: course.id,
        enrollmentStatus: existing.status,
        message: "You are already enrolled in this course.",
      });
    }

    if (course.priceKsh <= 0) {
      const enrollment = await prisma.academyEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
        create: {
          userId: user.id,
          courseId: course.id,
          status: "ACTIVE",
          amountPaid: 0,
        },
        update: {
          status: "ACTIVE",
          amountPaid: 0,
        },
      });

      return NextResponse.json({
        status: true,
        enrolled: true,
        courseId: course.id,
        enrollmentStatus: enrollment.status,
        message: "You're enrolled. Your lessons are ready.",
      });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.error("Academy payment initialization failed: missing configuration.");

      return NextResponse.json(
        {
          error:
            "Academy course payments are not configured. Please contact Corevia support.",
        },
        { status: 503 },
      );
    }

    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ||
      new URL(request.url).origin
    ).replace(/\/$/, "");

    const enrollment =
      existing ??
      (await prisma.academyEnrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          status: "PENDING_PAYMENT",
          amountPaid: 0,
        },
      }));

    const reference = `CV-ACADEMY-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    let response: Response;
    let data: {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string };
    };

    try {
      response = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            amount: Math.round(course.priceKsh * 100),
            currency: "KES",
            reference,
            callback_url: `${siteUrl}/academy?payment=${encodeURIComponent(reference)}`,
            metadata: {
              purpose: "COREVIA_ACADEMY_COURSE",
              userId: user.id,
              courseId: course.id,
              enrollmentId: enrollment.id,
              courseTitle: course.title,
            },
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(15000),
        },
      );

      const responseText = await response.text();

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Academy Paystack initialization returned invalid JSON.", {
          httpStatus: response.status,
        });

        return NextResponse.json(
          { error: "The payment provider returned an invalid response. Please try again." },
          { status: 502 },
        );
      }
    } catch (error) {
      console.error("Academy Paystack request failed.", {
        error: error instanceof Error ? error.message : "Unknown network error",
      });

      return NextResponse.json(
        { error: "Unable to reach the payment provider. Please try again shortly." },
        { status: 502 },
      );
    }

    if (!response.ok || !data.status || !data.data?.authorization_url) {
      console.error("Academy Paystack initialization failed.", {
        httpStatus: response.status,
        providerMessage:
          typeof data.message === "string"
            ? data.message
            : "No provider error message returned",
      });

      return NextResponse.json(
        {
          error:
            typeof data.message === "string" && data.message.trim()
              ? data.message
              : "Unable to start Academy course payment. Please try again.",
        },
        { status: 502 },
      );
    }

    await prisma.academyPayment.create({
      data: {
        userId: user.id,
        enrollmentId: enrollment.id,
        courseId: course.id,
        amount: course.priceKsh,
        provider: "PAYSTACK",
        providerReference: reference,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      status: true,
      paymentRequired: true,
      authorization_url: data.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error("Academy enrollment error:", error);

    return NextResponse.json(
      { error: "Unable to process enrollment right now. Please try again." },
      { status: 500 },
    );
  }
}
