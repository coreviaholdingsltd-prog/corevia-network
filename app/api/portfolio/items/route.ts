import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";

export const runtime = "nodejs";
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

function optionalHttps(value: unknown): string | null | undefined {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || value.trim().length > 300) return undefined;
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password) return undefined;
    return parsed.toString();
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to add a portfolio project." }, { status: 401 });
    let body: Record<string, unknown>;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid project details." }, { status: 400 }); }

    const title = text(body.title);
    const category = text(body.category);
    const description = text(body.description);
    const projectUrl = optionalHttps(body.projectUrl);
    if (title.length < 3 || title.length > 100) return NextResponse.json({ error: "Project title must be 3–100 characters." }, { status: 400 });
    if (category.length > 80) return NextResponse.json({ error: "Category must be 80 characters or fewer." }, { status: 400 });
    if (description.length < 20 || description.length > 1200) return NextResponse.json({ error: "Project description must be 20–1,200 characters." }, { status: 400 });
    if (projectUrl === undefined) return NextResponse.json({ error: "Project links must be valid HTTPS URLs." }, { status: 400 });

    const profile = await prisma.memberProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
      select: { id: true },
    });
    const count = await prisma.portfolioItem.count({ where: { profileId: profile.id } });
    if (count >= 30) return NextResponse.json({ error: "You can add up to 30 portfolio projects." }, { status: 409 });

    const item = await prisma.portfolioItem.create({
      data: { profileId: profile.id, title, category: category || null, description, projectUrl },
    });
    return NextResponse.json({ status: true, item, message: "Project added to your portfolio." }, { status: 201 });
  } catch (error) {
    console.error("Portfolio project create failed:", error);
    return NextResponse.json({ error: "Unable to add this project right now." }, { status: 500 });
  }
}
