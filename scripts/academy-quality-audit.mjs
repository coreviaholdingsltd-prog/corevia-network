#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const catalogPath = path.join(root, "lib/academy-catalog.ts");
const pathwaysPath = path.join(root, "lib/academy-pathways.ts");
const schemaPath = path.join(root, "prisma/schema.prisma");
const read = (file) => fs.readFileSync(file, "utf8");
const source = (file) => ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const unwrap = (node) => {
  while (node && (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node))) node = node.expression;
  return node;
};
const propName = (node) => node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : "";
const property = (node, name) => {
  node = unwrap(node);
  if (!node || !ts.isObjectLiteralExpression(node)) return undefined;
  const item = node.properties.find((entry) => ts.isPropertyAssignment(entry) && propName(entry) === name);
  return item ? unwrap(item.initializer) : undefined;
};
const literal = (node) => {
  node = unwrap(node);
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    const result = {};
    for (const entry of node.properties) if (ts.isPropertyAssignment(entry)) result[propName(entry)] = literal(entry.initializer);
    return result;
  }
  return undefined;
};
const findConstArray = (file, name) => {
  const sf = source(file);
  for (const statement of sf.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(sf) === name) {
        const value = unwrap(declaration.initializer);
        return value && ts.isArrayLiteralExpression(value) ? value.elements : [];
      }
    }
  }
  return [];
};
const words = (value) => String(value || "").toLowerCase().match(/[a-z0-9]{3,}/g) || [];
const compact = (values) => [...new Set(values.map((v) => String(v || "").trim()).filter(Boolean))];
const errors = [];
const warnings = [];
const courses = findConstArray(catalogPath, "ACADEMY_COURSES")
  .map((node) => literal(node))
  .filter((course) => course && course.published === true);
const ids = new Set();
const courseResults = [];
let totalLessons = 0;
let totalQuestions = 0;
let totalWords = 0;
let coursesWithTraceableSources = 0;

if (courses.length !== 30) errors.push(`Expected 30 published base subjects; found ${courses.length}.`);

for (const course of courses) {
  const label = course.title || course.id || "Untitled course";
  if (!course.id || !course.title) errors.push(`${label}: missing stable course ID or title.`);
  if (ids.has(course.id)) errors.push(`${label}: duplicate course ID ${course.id}.`);
  ids.add(course.id);
  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
  const questions = Array.isArray(course.questions) ? course.questions : [];
  totalLessons += lessons.length;
  totalQuestions += questions.length;
  const lessonTitles = compact(lessons.map((lesson) => lesson.title));
  const lessonText = lessons.flatMap((lesson) => Array.isArray(lesson.content) ? lesson.content : []);
  const body = lessonText.join("\n");
  const courseWords = words([course.description, ...lessonTitles, ...lessonText].join(" ")).length;
  totalWords += courseWords;
  const sourceMarkers = /https?:\/\/|doi\s*:|doi\.org\/|isbn\s*:|bibliograph|reference list|further reading|reading list/i.test(body);
  if (sourceMarkers) coursesWithTraceableSources += 1;
  const questionIds = new Set();
  const promptWords = words([course.title, course.category, course.description].join(" "));
  const covered = questions.filter((q) => {
    const prompt = String(q.prompt || "").toLowerCase();
    return promptWords.some((term) => term.length > 4 && prompt.includes(term));
  }).length;
  const issues = [];
  if (lessons.length < 3) issues.push(`only ${lessons.length} lessons (minimum 3)`);
  if (lessonTitles.length !== lessons.length) issues.push("missing or duplicate lesson titles");
  if (lessonText.some((item) => String(item).trim().length < 20)) issues.push("one or more lesson content items are too short");
  if (courseWords < 900) issues.push(`thin source material (${courseWords} words; review threshold 900)`);
  if (questions.length < 4) issues.push(`only ${questions.length} assessment questions (minimum 4)`);
  for (const q of questions) {
    if (!q.id || questionIds.has(q.id)) issues.push("missing or duplicate question ID");
    questionIds.add(q.id);
    if (!Array.isArray(q.options) || q.options.length < 2 || !Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length) issues.push(`invalid options or answer key in ${q.id || "question"}`);
    if (!String(q.explanation || "").trim()) issues.push(`missing explanation in ${q.id || "question"}`);
  }
  if (!sourceMarkers) warnings.push(`${label}: no identifiable bibliography/reference marker or source link found in lesson text; verify a real reading list manually.`);
  if (questions.length && covered / questions.length < 0.5) warnings.push(`${label}: fewer than half of question prompts visibly contain course-specific terms; inspect assessment relevance.`);
  if (issues.length) errors.push(`${label}: ${issues.join("; ")}.`);
  courseResults.push({ id: course.id, title: label, category: course.category, lessons: lessons.length, questions: questions.length, wordCount: courseWords, sourceMarkerFound: sourceMarkers, subjectTermQuestionCoverage: questions.length ? Number((covered / questions.length).toFixed(2)) : 0, structuralIssues: issues });
}

const stages = findConstArray(pathwaysPath, "STAGES").length;
const units = findConstArray(pathwaysPath, "UNIT_TITLES").length;
const templates = findConstArray(pathwaysPath, "ASSESSMENT_TEMPLATES").length;
if (stages !== 5) errors.push(`Expected five programme stages; found ${stages}.`);
if (units !== 6) errors.push(`Expected six generated units per stage; found ${units}.`);
if (templates !== 8) errors.push(`Expected eight assessment templates; found ${templates}.`);

const pathwayText = read(pathwaysPath);
const schemaText = read(schemaPath);
const sharedTemplateAssessment = /ASSESSMENT_TEMPLATES/.test(pathwayText);
const persistedProjectWorkflow = /model\s+AcademyProjectSubmission\s*\{/.test(schemaText) && /model\s+AcademyProjectReview\s*\{/.test(schemaText);
const reviewerGovernance = /model\s+AcademyAcademicReviewer\s*\{/.test(schemaText);
const hasStructuredBibliography = /references\??\s*:\s*AcademyReference\[\]/.test(read(catalogPath));
const blockers = [];
if (sharedTemplateAssessment) blockers.push("Generated programme assessments still use a shared generic template bank; each subject-stage requires validated, subject-specific assessment items.");
if (!persistedProjectWorkflow) blockers.push("No persisted project-submission and assessor-review workflow exists in the Prisma schema.");
if (!reviewerGovernance) blockers.push("No structured academic reviewer and sign-off record exists in the Prisma schema.");
if (!hasStructuredBibliography) blockers.push("The course model has no structured, verifiable subject bibliography/reference list.");
if (coursesWithTraceableSources < courses.length) blockers.push(`Only ${coursesWithTraceableSources}/${courses.length} subjects contain an identifiable source/reference marker; every reading list requires manual source verification.`);
blockers.push("The automated audit checks structure and evidence indicators; it cannot certify factual accuracy, pedagogical suitability, professional safety or expert approval.");

const report = {
  generatedAt: new Date().toISOString(),
  repository: "coreviaholdingsltd-prog/corevia-network",
  auditType: "source-structure-and-academic-readiness",
  counts: { publishedBaseSubjects: courses.length, programmeStages: stages, subjectStageCombinations: courses.length * stages, generatedUnitsPerStage: units, genericAssessmentTemplates: templates, sourceLessons: totalLessons, sourceQuestions: totalQuestions, sourceWords: totalWords, subjectsWithSourceMarkers: coursesWithTraceableSources },
  structuralStatus: errors.length ? "FAILED" : "PASSED",
  academicApprovalStatus: "BLOCKED",
  errors,
  warnings,
  blockers,
  courses: courseResults,
};
const outDir = path.join(root, "artifacts");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "academy-quality-audit.json"), JSON.stringify(report, null, 2) + "\n");
const markdown = [
  "# Corevia Academy automated quality audit",
  "",
  `Generated: ${report.generatedAt}`,
  "",
  `- Published subjects: **${courses.length}**`,
  `- Programme stages per subject: **${stages}**`,
  `- Subject-stage combinations: **${courses.length * stages}**`,
  `- Source lessons/questions: **${totalLessons}/${totalQuestions}**`,
  `- Source words: **${totalWords.toLocaleString("en-US")}**`,
  `- Subjects with source markers: **${coursesWithTraceableSources}/${courses.length}**`,
  `- Structural checks: **${report.structuralStatus}**`,
  "- Academic approval: **BLOCKED — not an accreditation or expert-review certificate**",
  "",
  "## Release blockers",
  ...blockers.map((item) => `- [ ] ${item}`),
  "",
  "## Structural errors",
  ...(errors.length ? errors.map((item) => `- ${item}`) : ["- None detected."]),
  "",
  "## Subject-level source audit",
  "| Subject | Lessons | Questions | Source words | Source marker | Question coverage | Structural issues |",
  "|---|---:|---:|---:|---|---:|---|",
  ...courseResults.map((course) => `| ${course.title.replaceAll("|", "\\|")} | ${course.lessons} | ${course.questions} | ${course.wordCount} | ${course.sourceMarkerFound ? "Found — verify" : "Not found"} | ${Math.round(course.subjectTermQuestionCoverage * 100)}% | ${course.structuralIssues.length ? course.structuralIssues.join("; ").replaceAll("|", "\\|") : "None"} |`),
  "",
  "This report is an automated source-level diagnostic. Human subject review remains mandatory before a paid programme is approved.",
  "",
].join("\n");
fs.writeFileSync(path.join(outDir, "academy-quality-audit.md"), markdown);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
console.log(markdown);
if (errors.length) process.exitCode = 1;
if (process.argv.includes("--release-gate") && (errors.length || blockers.length)) process.exitCode = 1;
