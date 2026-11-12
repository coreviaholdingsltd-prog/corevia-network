import { findAcademyCourse } from "@/lib/academy-catalog";
import type { AcademyCourse } from "@/lib/academy-catalog";

export const RETIRED_DUPLICATE_ACADEMY_COURSE_IDS = new Set([
  "cloud-storage-onedrive-sharepoint",
]);

export function isRetiredDuplicateAcademyCourse(courseId: string): boolean {
  return RETIRED_DUPLICATE_ACADEMY_COURSE_IDS.has(courseId);
}

/**
 * Resolve the canonical learning record. The OneDrive & SharePoint short
 * course is consolidated into Computer Basics & Microsoft 365: retain its
 * original lesson IDs/content inside the canonical course so progress records
 * remain stable, while excluding the duplicate course card from new enrolment.
 */
export function getAcademyCourseForLearning(courseId: string): AcademyCourse | null {
  const course = findAcademyCourse(courseId);
  if (!course) return null;

  if (course.id !== "computer-office-skills") return course;

  const cloudCourse = findAcademyCourse("cloud-storage-onedrive-sharepoint");
  if (!cloudCourse) return course;

  const existingLessonIds = new Set(course.lessons.map((lesson) => lesson.id));
  const consolidatedLessons = cloudCourse.lessons.filter(
    (lesson) => !existingLessonIds.has(lesson.id),
  );

  return {
    ...course,
    lessons: [...course.lessons, ...consolidatedLessons],
  };
}
