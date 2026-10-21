
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAcademyUser } from '@/lib/academy-auth';
import { findAcademyCourse } from '@/lib/academy-catalog';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const user = await getAcademyUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in first.' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId') ?? '';
    const course = findAcademyCourse(courseId);

    if (!course || !course.published) {
      return NextResponse.json(
        { error: 'Course not found.' },
        { status: 404 },
      );
    }

    const enrollment = await prisma.academyEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
      include: {
        completion: true,
        user: { select: { name: true } },
      },
    });

    if (
      !enrollment ||
      enrollment.status !== 'COMPLETED' ||
      !enrollment.completion
    ) {
      return NextResponse.json(
        {
          error:
            'Complete all lessons and pass the assessment before downloading your certificate.',
        },
        { status: 403 },
      );
    }

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([842, 595]);
    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    const navy = rgb(0.04, 0.12, 0.23);
    const teal = rgb(0.02, 0.55, 0.58);
    const ink = rgb(0.18, 0.22, 0.28);

    page.drawRectangle({
      x: 0, y: 0, width: 842, height: 595,
      color: rgb(1, 1, 1),
    });

    page.drawRectangle({
      x: 22, y: 22, width: 798, height: 551,
      borderColor: teal, borderWidth: 2,
    });

    page.drawRectangle({
      x: 32, y: 32, width: 778, height: 531,
      borderColor: navy, borderWidth: 0.7,
    });

    const centered = (
      text: string,
      y: number,
      size: number,
      font = regular,
      color = ink,
    ) => {
      const width = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: (842 - width) / 2,
        y,
        size,
        font,
        color,
      });
    };

    centered('COREVIA ACADEMY', 510, 19, bold, teal);
    centered('CERTIFICATE OF COMPLETION', 455, 27, bold, navy);
    centered('This certificate is proudly presented to', 405, 13);

    const learnerName = (enrollment.user.name || 'Learner').trim().toLowerCase().replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
      .replace(/[^\x20-\x7E]/g, '')
      .slice(0, 75);

    centered(learnerName, 360, 25, bold, navy);

    page.drawLine({
      start: { x: 150, y: 345 },
      end: { x: 692, y: 345 },
      thickness: 1,
      color: teal,
    });

    centered('for successfully completing the course', 315, 13);
    centered(course.title.replace(/[^\x20-\x7E]/g, '').slice(0, 80), 277, 20, bold, navy);
    centered('and passing the required course assessment.', 245, 12);

    centered(
      `Certificate No: ${enrollment.completion.certificateCode}`,
      190, 11, bold,
    );

    centered(
      `Issued: ${enrollment.completion.issuedAt.toISOString().slice(0, 10)}`,
      165, 11,
    );

    centered(
      'Issued by COREVIA ACADEMY | COREVIA HOLDINGS LTD',
      105, 11, bold, teal,
    );

    centered(
      'Course completion record; not an accredited academic qualification or professional licence.',
      76, 8,
    );

    const bytes = await pdf.save();
    const body = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(body).set(bytes);

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          `attachment; filename="Corevia-Certificate-${course.id}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Academy certificate error:', error);

    return NextResponse.json(
      { error: 'Unable to generate certificate.' },
      { status: 500 },
    );
  }
}


