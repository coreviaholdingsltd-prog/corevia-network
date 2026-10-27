import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";

export const runtime = "nodejs";
const PUBLIC_ORIGIN = "https://network.coreviaholdingltd.com";
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

export async function GET() {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to manage your portfolio." }, { status: 401 });
    const profile = await prisma.memberProfile.findUnique({
      where: { userId: user.id },
      include: { items: { orderBy: { createdAt: "desc" }, take: 30 } },
    });
    return NextResponse.json({
      status: true,
      profile,
      publicUrl: profile?.isPublic ? `${PUBLIC_ORIGIN}/portfolio/${user.id}` : null,
    });
  } catch (error) {
    console.error("Member portfolio load failed:", error);
    return NextResponse.json({ error: "Unable to load your portfolio right now." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to update your portfolio." }, { status: 401 });
    let body: Record<string, unknown>;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid portfolio information." }, { status: 400 }); }

    const headline = text(body.headline);
    const bio = text(body.bio);
    const location = text(body.location);
    const skills = text(body.skills);
    if (headline.length > 100) return NextResponse.json({ error: "Headline must be 100 characters or fewer." }, { status: 400 });
    if (bio.length > 1200) return NextResponse.json({ error: "Bio must be 1,200 characters or fewer." }, { status: 400 });
    if (location.length > 100) return NextResponse.json({ error: "Location must be 100 characters or fewer." }, { status: 400 });
    if (skills.length > 400) return NextResponse.json({ error: "Skills must be 400 characters or fewer." }, { status: 400 });

    const websiteUrl = optionalHttps(body.websiteUrl);
    const linkedinUrl = optionalHttps(body.linkedinUrl);
    const githubUrl = optionalHttps(body.githubUrl);
    if (websiteUrl === undefined || linkedinUrl === undefined || githubUrl === undefined) {
      return NextResponse.json({ error: "Profile links must be valid HTTPS URLs." }, { status: 400 });
    }
    const isPublic = typeof body.isPublic === "boolean" ? body.isPublic : true;
    const profile = await prisma.memberProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, headline, bio, location: location || null, skills, websiteUrl, linkedinUrl, githubUrl, isPublic },
      update: { headline, bio, location: location || null, skills, websiteUrl, linkedinUrl, githubUrl, isPublic },
      include: { items: { orderBy: { createdAt: "desc" }, take: 30 } },
    });
    return NextResponse.json({
      status: true,
      profile,
      publicUrl: profile.isPublic ? `${PUBLIC_ORIGIN}/portfolio/${user.id}` : null,
      message: "Your portfolio profile has been saved.",
    });
  } catch (error) {
    console.error("Member portfolio update failed:", error);
    return NextResponse.json({ error: "Unable to save your profile right now." }, { status: 500 });
  }
}
