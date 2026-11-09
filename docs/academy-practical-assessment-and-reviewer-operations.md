# Corevia Academy practical assessment and reviewer operations

## Purpose

Corevia Academy course completion now has two learning checks for new learners:

1. Complete every lesson and pass the knowledge assessment at 75% or higher.
2. Submit a practical project and receive an authorised academic review at 75/100 or higher.

A knowledge-assessment pass alone no longer creates a new completion record. Existing completion and certificate records are preserved. An approved project creates the completion record only when the learner also has a passed knowledge-assessment attempt.

The practical rubric has five equally weighted dimensions (20 points each): subject knowledge and accuracy; application and method; evidence and source quality; ethics and safety; communication and reflection. Reviewers must provide substantive written feedback. Below 75 requires revision unless the reviewer records a rejection.

## Database rollout

The migration is additive:

`prisma/migrations/20261109130000_academy_practical_assessment/migration.sql`

It adds project submissions, review history, a reviewer registry, academic sign-off records and structured course-stage references. It does not delete or rewrite existing enrolments, payments, lesson progress, attempts, completions or certificates.

Before enabling the new workflow in production:
- Run `npx prisma migrate deploy` against the intended production database through the approved deployment process.
- Confirm Prisma client generation and the Academy build.
- Verify project submission, reviewer approval, revision, rejection and certificate issuance in a non-production environment.
- Confirm existing completed learners can still access their existing certificates.

## Reviewer access

Set the Vercel environment variable `ACADEMY_REVIEWER_EMAILS` to a comma-separated list of existing Corevia account email addresses authorised to review. Use the same value in Preview and Production only when the reviewer should have access in both environments. The API fails closed when the variable is missing or the email is not listed.

Reviewer pages:
- `/academy/review` — practical project queue and rubric reviews.
- `/academy/review/standards` — verified references and academic sign-off.

The reviewer registry records reviewer identity and can suspend a previously registered reviewer. Only allowlisted, signed-in users can use reviewer endpoints.

## Reference verification and academic sign-off

A source record must contain authors or issuing body, title, publication, source type, and a DOI or HTTPS URL. The reviewer must add verification notes describing where the source was checked, why it is authoritative and which subject outcomes it supports. A record marked verified represents an explicit reviewer attestation; it is not automatically proven by the software.

Approval of a course-stage is blocked unless:
- all eight academic criteria are explicitly marked as passed;
- at least three verified sources are attached to that exact course-stage; and
- the reviewer provides a substantive written report.

The eight criteria cover subject accuracy, learning outcomes, source quality, assessment validity, practical relevance, ethics and safety, academic-level appropriateness, and accessibility.

## Important limits

The system does not itself create national accreditation, university degree-awarding authority, professional licensing or protected academic titles. Corevia completion certificates attest to completion of Corevia's own learning programme. The Doctoral Research Preparation pathway does not award a PhD.

Automated checks establish source structure and workflow integrity. They do not substitute for qualified human review, factual verification, professional safety review or independent academic judgement. Do not advertise a course-stage as academically approved until its actual sign-off is recorded and its materials have been reviewed.
