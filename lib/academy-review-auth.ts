import { getAcademyUser } from "@/lib/academy-auth";

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

  if (!allowed.includes(user.email.toLowerCase())) {
    return { user: null, response: { error: "You are not authorised to review Academy work.", status: 403 } as const };
  }

  return { user, response: null };
}
