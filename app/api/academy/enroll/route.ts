
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";
import { processAcademyCoursePayment } from "@/lib/academy-payments";
import { isRetiredDuplicateAcademyCourse } from "@/lib/academy-catalog-policy";

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

    if (isRetiredDuplicateAcademyCourse(courseId)) {
      const legacyEnrollment = await prisma.academyEnrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
      });
      if (legacyEnrollment && ["ACTIVE", "COMPLETED"].includes(legacyEnrollment.status)) {
        return NextResponse.json({
          status: true,
          alreadyEnrolled: true,
          courseId,
          enrollmentStatus: legacyEnrollment.status,
          message: "Your existing access to this course is preserved. New enrolments are available through the consolidated Computer Basics & Microsoft 365 course.",
        });
      }
      return NextResponse.json(
        { error: "This course has been consolidated into Computer Basics & Microsoft 365. Please select the consolidated course instead." },
        { status: 410 },
      );
    }

    if (course.prerequisiteCourseId) {
      const prerequisiteCourse = findAcademyCourse(course.prerequisiteCourseId);
      const prerequisiteEnrollment = await prisma.academyEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.prerequisiteCourseId,
          },
        },
        include: { completion: true },
      });
      if (
        !prerequisiteCourse ||
        !prerequisiteEnrollment ||
        prerequisiteEnrollment.status !== "COMPLETED" ||
        !prerequisiteEnrollment.completion
      ) {
        return NextResponse.json(
          {
            error: "Complete the " + (prerequisiteCourse?.title ?? "previous programme stage") + " and pass its assessment before enrolling in this stage.",
            prerequisiteCourseId: course.prerequisiteCourseId,
            prerequisiteTitle: prerequisiteCourse?.title ?? "Previous programme stage",
          },
          { status: 403 },
        );
      }
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

    // Reconcile an earlier attempt before opening another checkout. This prevents
    // a repeat click from creating a second charge while the first is unresolved.
    const pendingPayment = await prisma.academyPayment.findFirst({
      where: {
        enrollmentId: enrollment.id,
        provider: "PAYSTACK",
        status: "PENDING",
      },
      orderBy: { createdAt: "desc" },
    });

    if (pendingPayment) {
      let verifyResponse: Response;
      let verifyData: {
        status?: boolean;
        message?: string;
        data?: {
          reference?: string;
          amount?: number;
          currency?: string;
          status?: string;
          paid_at?: string | null;
          metadata?: Record<string, unknown> | null;
        };
      };

      try {
        verifyResponse = await fetch(
          `https://api.paystack.co/transaction/verify/${encodeURIComponent(pendingPayment.providerReference)}`,
          {
            headers: { Authorization: `Bearer ${secretKey}` },
            cache: "no-store",
            signal: AbortSignal.timeout(15000),
          },
        );
        verifyData = await verifyResponse.json();
      } catch {
        return NextResponse.json(
          {
            error: "An earlier course payment is still being checked. Do not start another payment yet. Retry verification shortly.",
            reference: pendingPayment.providerReference,
          },
          { status: 409 },
        );
      }

      if (
        !verifyResponse.ok ||
        !verifyData.status ||
        !verifyData.data ||
        verifyData.data.reference !== pendingPayment.providerReference
      ) {
        return NextResponse.json(
          {
            error: "An earlier course payment could not yet be verified. Do not pay again until its status is checked. Retry verification shortly.",
            reference: pendingPayment.providerReference,
          },
          { status: 409 },
        );
      }

      const previous = verifyData.data;
      if (previous.status === "success") {
        const processed = await processAcademyCoursePayment(
          {
            reference: String(previous.reference),
            amount: Number(previous.amount),
            currency: String(previous.currency),
            status: String(previous.status),
            paid_at: previous.paid_at ?? null,
            metadata: previous.metadata ?? null,
          },
          user.id,
        );
        return NextResponse.json({
          status: true,
          enrolled: true,
          alreadyProcessed: processed.alreadyProcessed,
          courseId: course.id,
          enrollmentStatus: "ACTIVE",
          message: "Your earlier payment is confirmed. Your course is ready.",
        });
      }

      if (previous.status === "failed" || previous.status === "abandoned") {
        await prisma.academyPayment.updateMany({
          where: { id: pendingPayment.id, status: "PENDING" },
          data: { status: "FAILED" },
        });
      } else {
        return NextResponse.json(
          {
            error: "A payment attempt for this course is still pending. Finish the existing checkout or retry verification before starting another payment.",
            reference: pendingPayment.providerReference,
          },
          { status: 409 },
        );
      }
    }

    // Paid programme stages stay closed until the latest academic decision is
    // APPROVED and at least three subject- and stage-specific references are verified.
    // This is a server-side payment gate; hiding a checkout button is not sufficient.
    if (course.isProgrammeStage) {
      const stageKey = String(course.programmeLevel ?? "FOUNDATION")
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_");
      const [latestSignoff, verifiedReferenceCount] = await Promise.all([
        prisma.academyAcademicSignoff.findFirst({
          where: { courseId: course.id, stageKey },
          orderBy: [{ signedAt: "desc" }, { createdAt: "desc" }],
          select: { decision: true },
        }),
        prisma.academyAcademicReference.count({
          where: { courseId: course.id, stageKey, verified: true },
        }),
      ]);

      if (latestSignoff?.decision !== "APPROVED" || verifiedReferenceCount < 3) {
        return NextResponse.json(
          {
            error: "This programme stage is still under academic review and is not yet open for paid enrolment. No new payment has been initiated.",
            academicApprovalStatus: "IN_DEVELOPMENT",
            verifiedReferences: verifiedReferenceCount,
            requiredVerifiedReferences: 3,
          },
          { status: 409 },
        );
      }
    }

    const candidateReference = `CV-ACADEMY-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    // Lock the enrollment while reserving a payment. A second tab/request will
    // see the first pending record rather than creating another Paystack charge.
    const reservation = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "AcademyEnrollment" WHERE "id" = ${enrollment.id} FOR UPDATE
      `;

      const existingPending = await tx.academyPayment.findFirst({
        where: {
          enrollmentId: enrollment.id,
          provider: "PAYSTACK",
          status: "PENDING",
        },
        orderBy: { createdAt: "desc" },
      });

      if (existingPending) return { existingPending, payment: null };

      const payment = await tx.academyPayment.create({
        data: {
          userId: user.id,
          enrollmentId: enrollment.id,
          courseId: course.id,
          amount: course.priceKsh,
          provider: "PAYSTACK",
          providerReference: candidateReference,
          status: "PENDING",
        },
      });
      return { existingPending: null, payment };
    });

    if (reservation.existingPending || !reservation.payment) {
      return NextResponse.json(
        {
          error: "Another payment attempt for this course is already in progress. Do not pay again; retry verification for the existing reference.",
          reference: reservation.existingPending?.providerReference,
        },
        { status: 409 },
      );
    }

    const reference = reservation.payment.providerReference;

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

      // The provider gave an explicit rejection, so this attempt can be retried.
      // Network/timeout errors above remain pending because their outcome is uncertain.
      await prisma.academyPayment.updateMany({
        where: { providerReference: reference, status: "PENDING" },
        data: { status: "FAILED" },
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
