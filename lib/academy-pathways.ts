import type { AcademyCourse } from "@/lib/academy-catalog";
import { getSubjectCurriculum } from "@/lib/academy-subject-content";

type ProgrammeStage = {
  label: "Certificate" | "Diploma" | "Degree" | "Masters" | "PhD";
  learnerLabel: string;
  priceKsh: number;
  focus: string;
  outcome: string;
  project: string;
  research: string;
  verb: string;
  depth: string;
};

const STAGES: ProgrammeStage[] = [
  { label: "Certificate", learnerLabel: "Certificate", priceKsh: 1500, focus: "foundational concepts, essential terminology, safe procedures and guided practical competence", outcome: "accurately explain key principles and complete a defined task using a supplied procedure", project: "a guided practical demonstration with annotated evidence and a short reflection", research: "use introductory textbooks, authoritative guidance and trustworthy sources; distinguish evidence from assumption", verb: "explain and demonstrate", depth: "accurate foundational understanding and reliable execution" },
  { label: "Diploma", learnerLabel: "Diploma", priceKsh: 3500, focus: "technical application, workflow planning, troubleshooting, documentation and quality control", outcome: "independently plan and deliver a multi-step task, justify choices and document quality checks", project: "an independently planned case study with a working output, records, risk review and improvement plan", research: "compare methods, assess source quality and support recommendations with relevant evidence", verb: "apply, implement and troubleshoot", depth: "independent applied competence and defensible professional decisions" },
  { label: "Degree", learnerLabel: "Degree", priceKsh: 7500, focus: "disciplinary theory, analytical frameworks, research literacy, evidence-based decisions and integrated practice", outcome: "analyse a complex case, apply a suitable framework, evaluate alternatives and defend a reasoned conclusion", project: "a substantial applied project with a structured report, analysis, evidence and evaluation", research: "form a focused research question, critically evaluate relevant literature and justify a suitable methodology", verb: "analyse, evaluate and justify", depth: "integrated theoretical understanding, critical analysis and research-informed practice" },
  { label: "Masters", learnerLabel: "Masters", priceKsh: 12500, focus: "advanced critical analysis, specialist literature, strategic design, complex problem-solving and research synthesis", outcome: "critically compare competing approaches, design an advanced solution and evaluate limitations, impact and implementation", project: "an advanced capstone with a strategy, implementation plan, evaluation framework and critical reflection", research: "synthesise specialist literature, justify research design, interpret evidence and acknowledge methodological limitations", verb: "critically synthesise, design and evaluate", depth: "advanced independent judgement, specialist insight and rigorous evaluation" },
  { label: "PhD", learnerLabel: "Doctoral Research Preparation", priceKsh: 20000, focus: "original inquiry, research-gap identification, rigorous methodology, independent scholarship and contribution to knowledge", outcome: "develop and defend an original, evidence-led contribution while documenting ethics, limitations and reproducibility", project: "a substantial original research portfolio, thesis-style report, contribution statement and oral defence presentation", research: "map and critique prior scholarship, establish a defensible gap, justify a rigorous method and present a scrutinizable contribution", verb: "investigate, contribute and defend", depth: "doctoral-level originality, methodological rigour and independent scholarly contribution" },
];

const UNIT_TITLES = [
  "Disciplinary foundations and key concepts",
  "Principles, methods and specialist tools",
  "Application, analysis and problem-solving",
  "Ethics, standards, risk and quality assurance",
  "Independent project and evidence portfolio",
  "Critical synthesis, communication and progression",
];



function compactUnique(values: string[], limit: number): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const raw of values) {
    const value = raw.replace(/\s+/g, " ").trim();
    if (!value || seen.has(value.toLowerCase())) continue;
    seen.add(value.toLowerCase());
    output.push(value);
    if (output.length >= limit) break;
  }
  return output;
}

function sourceMaterial(subject: AcademyCourse): string[] {
  // Reuse the original course's own lesson material so the advanced pathway
  // builds on actual subject content rather than only reusing lesson headings.
  return compactUnique(
    subject.lessons.flatMap((lesson) => [
      lesson.title,
      ...(Array.isArray(lesson.content) ? lesson.content : []),
    ]),
    120,
  );
}

function buildLessons(subject: AcademyCourse, stage: ProgrammeStage, stageIndex: number) {
  const originalLessons = subject.lessons;
  const sourceNotes = sourceMaterial(subject);
  const subjectCurriculum = getSubjectCurriculum(subject.id);
  const topicTitles = compactUnique(
    originalLessons.map((lesson) => lesson.title),
    12,
  );
  const topics = topicTitles.length ? topicTitles : [subject.title, "Disciplinary methods", "Applied practice", "Evaluation"];
  const sourceNote = (index: number) => sourceNotes.length
    ? sourceNotes[index % sourceNotes.length]
    : subject.description;

  return UNIT_TITLES.map((unit, index) => {
    const tailoredUnit = subjectCurriculum?.[index];
    const topic = tailoredUnit?.title || topics[index % topics.length];
    const unitEvidence = [0, 1, 2, 3, 4].map((offset) =>
      sourceNote(index * 5 + offset),
    );
    const relatedSource = unitEvidence[0];
    const supportingSource = unitEvidence[1];
    const additionalSource = unitEvidence.slice(2);
    const task = [
      "Work through a guided example, reproduce the method accurately and explain the purpose of each step.",
      "Plan and complete the task independently; document decisions, troubleshoot a realistic obstacle and verify the output.",
      "Apply a disciplinary framework to a case, compare at least two approaches and defend the selected conclusion with evidence.",
      "Interrogate assumptions, compare competing interpretations and evaluate consequences, trade-offs and implementation limits.",
      "Design an original and answerable inquiry, critique prior evidence, justify a rigorous method and specify how the contribution will be tested.",
    ][stageIndex];
    const practical = [
      "Complete a small guided exercise and annotate the steps, result and checks.",
      "Produce a case file containing a plan, working output, decision log, quality checks and improvement report.",
      "Develop an applied project and submit a report connecting disciplinary theory, method, evidence and evaluation.",
      "Design an advanced intervention, justify its strategic choices and evaluate measurable outcomes, risks and limitations.",
      "Prepare a research portfolio containing a gap statement, critical literature synthesis, methodology, analysis plan, ethics considerations and defensible original contribution.",
    ][stageIndex];

    const content = [
      "LEARNING OUTCOME — At " + stage.learnerLabel + " level, " + stage.verb + " " + topic + " in " + subject.title + ". You must demonstrate " + stage.depth + ".",
      "SUBJECT FOUNDATION — " + subject.description + " This unit builds directly on the subject's existing lesson material: " + relatedSource,
      ...(tailoredUnit ? [
        "DETAILED SUBJECT STUDY — " + tailoredUnit.study,
        "SUBJECT WORKED EXAMPLE — " + tailoredUnit.workedExample,
        "SUBJECT PRACTICAL TASK — " + tailoredUnit.practical,
        "SUBJECT EVIDENCE STANDARD — " + tailoredUnit.evidence,
        "MEASURABLE SUBJECT OUTCOME — " + tailoredUnit.outcome,
      ] : []),
      "CORE STUDY MATERIAL — Revisit and master this course topic: " + topic + ". Explain its central terms, principles, assumptions and relationship to the wider discipline. Use the original course material as the starting point, then extend it with authoritative books, standards, peer-reviewed research or professional guidance appropriate to this level.",
      "CONCEPTUAL DEVELOPMENT — Connect the topic to this related course material: " + supportingSource + ". Identify where the ideas reinforce one another, where they differ and what conditions affect their application. Do not treat a definition as sufficient evidence of understanding.",
      "SUBJECT KNOWLEDGE READING — Study these additional items from the original " + subject.title + " course: " + additionalSource.join(" | ") + ". For each item, write a clear explanation in your own words, define unfamiliar terms, give a relevant example and explain how it connects to this unit. If an item is unfamiliar, pause and research it before moving on.",
      "FOUNDATION CHECK — Before attempting advanced work, explain the key terms in this unit without copying the notes. Identify what prior knowledge the task assumes. If you cannot explain the basics, revisit the relevant earlier lesson and complete a short practice example first.",
      "METHOD AND REASONING — " + task + " State the problem or research question, define scope and constraints, select a justified approach, preserve working evidence and explain why the method is suitable.",
      "WORKED SUBJECT APPLICATION — Construct a realistic " + subject.title + " case involving " + topic + ". Identify the relevant facts, distinguish facts from assumptions, explain the governing principles, compare possible responses and state what evidence would confirm whether the chosen response worked.",
      "MODEL RESPONSE AND SELF-CHECK — Write a complete response to the worked case: (1) define the problem, (2) explain the relevant subject concepts, (3) show each reasoning or practical step, (4) justify the decision with evidence, and (5) evaluate the result and its limitations. Compare your response with the unit outcome and revise any unsupported or unclear reasoning.",
      "PRACTICAL ASSIGNMENT — " + practical + " Your submission must include the objective, process, output, supporting evidence, quality checks and a reflection on what should be improved.",
      "ACADEMIC AND PROFESSIONAL STANDARDS — Apply relevant disciplinary standards, ethical duties, safety requirements, privacy protections and intellectual-property rules. Cite sources consistently. Never invent data, references, experiments or claims of originality.",
      "EVIDENCE AND READING — Start with the original lesson material, then consult current authoritative sources appropriate to the subject and level. At Certificate level, prioritise reliable introductory texts and official guidance; at Diploma and Degree levels, add technical manuals, scholarly texts and research; at Masters and doctoral research-preparation levels, critically engage with specialist peer-reviewed literature and primary sources. Record author, title, publication date and the exact claim supported.",
      "QUALITY REVIEW — Check accuracy, completeness, internal consistency, relevance, reproducibility and alignment with the stated learning outcome. Identify uncertainty, limitations and possible sources of bias. Explain what additional evidence would change your conclusion.",
      "REFLECTION AND TRANSFER — Summarise the principle learned, justify one important decision, identify a plausible failure mode and explain how the knowledge transfers to a new " + subject.title + " situation.",
      "PROJECT EXPECTATION — " + stage.project + " Submit your objective, methodology, completed work, findings, reflection and supporting evidence through the Corevia Academy practical assessment workspace. An authorised reviewer records a rubric score and written decision. Clearly label any simulated data and never present it as real-world observation.",
      "PRACTICAL ASSESSMENT RUBRIC — Your submitted project is reviewed by an authorised academic reviewer against five equally weighted dimensions: subject knowledge and accuracy (20); application and method (20); evidence and source quality (20); ethics and safety (20); communication and reflection (20). The pass threshold is 75/100. Reviewer feedback may require revision. A knowledge-test pass alone does not complete the course.",
      "ACADEMIC INTEGRITY — Submit original work, cite every borrowed idea or source, disclose permitted assistance and retain notes or working files that demonstrate how the work was produced. Fabricated references, copied submissions, invented research data and plagiarism invalidate the affected work."
    ];
    return {
      id: subject.id + "-" + stage.label.toLowerCase() + "-unit-" + (index + 1),
      title: (tailoredUnit?.title || unit + ": " + topic) + " — " + stage.learnerLabel,
      minutes: [30, 45, 60, 75, 90][stageIndex],
      content,
    };
  });
}

function buildQuestions(subject: AcademyCourse, stage: ProgrammeStage, stageIndex: number) {
  // Assessments inherit the actual subject's authored question bank. The
  // stage framing and feedback raise the expected reasoning level without
  // inventing unsupported facts or recycling a cross-subject question bank.
  const sourceQuestions = Array.isArray(subject.questions) ? subject.questions : [];
  const levelFraming = [
    "CERTIFICATE FOUNDATION CHECK — Define and recognise the subject principle. ",
    "DIPLOMA APPLICATION CHECK — Apply the subject principle to a practical task. ",
    "DEGREE ANALYSIS CHECK — Analyse the subject principle and evaluate its implications. ",
    "MASTERS CRITICAL EVALUATION — Critically evaluate the subject principle, assumptions and alternatives. ",
    "DOCTORAL RESEARCH PREPARATION — Critique the evidence and identify what further inquiry is required. ",
  ][stageIndex];

  return sourceQuestions.map((question, index) => ({
    ...question,
    id: subject.id + "-" + stage.label.toLowerCase() + "-subject-assessment-" + (index + 1),
    prompt: levelFraming + question.prompt + " Select the best-supported answer.",
    explanation: (question.explanation?.trim() || "Review the relevant subject lesson and identify the evidence supporting the answer.") + " At " + stage.learnerLabel + " level, demonstrate: " + stage.outcome + ".",
  }));
}

export function buildAcademyPathwayCourses(subjects: AcademyCourse[]): AcademyCourse[] {
  return subjects.filter((subject) => subject.published).flatMap((subject) =>
    STAGES.map((stage, stageIndex) => {
      const id = subject.id + "-" + stage.label.toLowerCase();
      const prerequisiteCourseId = stageIndex === 0
        ? undefined
        : subject.id + "-" + STAGES[stageIndex - 1].label.toLowerCase();
      return {
        id,
        title: subject.title + " — " + stage.learnerLabel + " Learning Programme",
        category: subject.category,
        description: stage.learnerLabel + "-level learning pathway in " + subject.title + ", designed for " + stage.focus + ". Expected outcome: " + stage.outcome + ". Capstone: " + stage.project + ". Learners complete six subject-linked study units, a level-appropriate project and a subject-specific assessment. Corevia Academy issues a certificate of completion for this learning programme only; it is not an accredited university award, professional licence or authority to use a protected academic title. PhD-level content is a doctoral research-preparation pathway and does not confer a PhD degree.",
        level: stage.learnerLabel,
        priceKsh: stage.priceKsh,
        published: true,
        lessons: buildLessons(subject, stage, stageIndex),
        questions: buildQuestions(subject, stage, stageIndex),
        pathwayId: subject.id,
        programmeLevel: stage.learnerLabel,
        programmeOrder: stageIndex + 1,
        prerequisiteCourseId,
        isProgrammeStage: true,
      } as AcademyCourse;
    }),
  );
}
