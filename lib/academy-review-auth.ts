import { getAcademyUser } from "@/lib/academy-auth";
import { prisma } from "@/lib/prisma";

/**
 * Reviewer access is fail-closed. Configure a comma-separated allowlist of
 * existing Academy account email addresses in ACADEMY_REVIEWER_EMAILS.
 */
export async function getAcademyReviewer() {
  const user = await getAcademyUser();
  if (!user) return { user: null, response: { error: "Please sign in first.", status: 401 } as const };

  const allowed = (process.env.ACADEMY_REVIEWER_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const email = user.email.toLowerCase();
  if (!allowed.includes(email)) {
    return { user: null, response: { error: "You are not authorised to review Academy work.", status: 403 } as const };
  }

  const reviewer = await prisma.academyAcademicReviewer.findUnique({ where: { email } });
  if (reviewer && !reviewer.active) {
    return { user: null, response: { error: "Your academic reviewer access has been suspended.", status: 403 } as const };
  }

  return { user, response: null };
}
