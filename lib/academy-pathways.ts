import type { AcademyCourse } from "@/lib/academy-catalog";

type ProgrammeStage = {
  label: "Certificate" | "Diploma" | "Degree" | "Masters" | "PhD";
  priceKsh: number;
  focus: string;
  standard: string;
  project: string;
  research: string;
};

const STAGES: ProgrammeStage[] = [
  {
    label: "Certificate",
    priceKsh: 1500,
    focus: "core concepts, essential vocabulary, safe procedures and reliable practical performance",
    standard: "complete a clearly defined task correctly, explain the main decisions and check the result against a checklist",
    project: "a guided practical demonstration and a short evidence portfolio",
    research: "locate trustworthy introductory sources and distinguish evidence from assumption",
  },
  {
    label: "Diploma",
    priceKsh: 3500,
    focus: "independent application, workflow planning, troubleshooting, documentation and quality control",
    standard: "plan and deliver a multi-step task independently, justify the method and document quality checks",
    project: "an independently planned case study with a working output, records and improvement plan",
    research: "compare methods, assess source quality and support recommendations with relevant evidence",
  },
  {
    label: "Degree",
    priceKsh: 7500,
    focus: "theory, analytical frameworks, research methods, evidence-based decisions and integrated practice",
    standard: "analyse a complex case, apply an appropriate framework, evaluate alternatives and defend a reasoned conclusion",
    project: "a substantial applied project supported by a structured report and evidence",
    research: "form a focused research question, evaluate literature and explain a defensible methodology",
  },
  {
    label: "Masters",
    priceKsh: 12500,
    focus: "advanced critical analysis, strategic design, complex problem-solving, evaluation and research synthesis",
    standard: "critically compare competing approaches, design an advanced solution and evaluate its limitations and impact",
    project: "an advanced capstone with a strategy, implementation plan, evaluation framework and critical reflection",
    research: "synthesise specialist literature, justify research design and interpret evidence with explicit limitations",
  },
  {
    label: "PhD",
    priceKsh: 20000,
    focus: "original inquiry, a defensible contribution, rigorous methodology, independent scholarship and research communication",
    standard: "develop and defend an original, evidence-led contribution while documenting limitations, ethics and reproducibility",
    project: "a substantial original research portfolio, thesis-style report and oral defence presentation",
    research: "identify a research gap, critically map prior work, justify a rigorous method and communicate a contribution that can be scrutinised",
  },
];

const UNIT_TITLES = [
  "Core concepts and disciplinary foundations",
  "Methods, tools and professional practice",
  "Applied analysis and problem-solving",
  "Quality, ethics, risk and responsible decisions",
  "Independent project and evidence portfolio",
  "Critical review, communication and next steps",
];

const QUESTION_BANK = [
  {
    prompt: "Which approach best demonstrates sound understanding of this subject?",
    correct: "Explain the key concept, apply it to a relevant example and check the result against evidence.",
    wrong: ["Repeat terminology without understanding its use.", "Choose the quickest option without checking its suitability.", "Treat an assumption as a verified result."],
  },
  {
    prompt: "What should guide the selection of a method or tool?",
    correct: "The task requirements, available evidence, risks, context and a clear way to evaluate the outcome.",
    wrong: ["Personal preference alone, regardless of the task.", "A method chosen before the problem is understood.", "The appearance of a result rather than its accuracy."],
  },
  {
    prompt: "How should a learner respond when a result does not meet the required standard?",
    correct: "Inspect the process, identify the cause, correct it and record how the revised result was checked.",
    wrong: ["Hide the result and report success.", "Repeat the same steps without reviewing them.", "Change the acceptance criteria after seeing the result."],
  },
  {
    prompt: "Which evidence is strongest when presenting a practical conclusion?",
    correct: "Relevant, traceable evidence with its source, context, method and limitations clearly stated.",
    wrong: ["An unsupported opinion presented confidently.", "A single unverified statement copied from an unknown source.", "A result with no explanation of how it was produced."],
  },
  {
    prompt: "What is the purpose of documenting decisions and revisions?",
    correct: "To make the work understandable, reviewable, reproducible and easier to improve.",
    wrong: ["To make the project appear longer.", "To avoid explaining the reasoning behind a decision.", "To conceal earlier errors from reviewers."],
  },
  {
    prompt: "Which practice supports responsible work in this discipline?",
    correct: "Respect privacy, safety, applicable rules, intellectual work and the people affected by decisions.",
    wrong: ["Ignore foreseeable harm if a task is technically possible.", "Use private information without permission.", "Present another person's work as original."],
  },
  {
    prompt: "How should competing solutions be evaluated?",
    correct: "Compare them against explicit criteria, evidence, cost, risk, constraints and likely outcomes.",
    wrong: ["Select the first available option.", "Choose the option with the most impressive description.", "Ignore trade-offs and implementation constraints."],
  },
  {
    prompt: "What makes a final project or research submission credible?",
    correct: "A clear question or objective, a justified method, traceable evidence, a checked result and honest limitations.",
    wrong: ["A conclusion without supporting work.", "A copied template with no subject-specific analysis.", "A claim of certainty where the evidence is incomplete."],
  },
];

function buildLessons(subject: AcademyCourse, stage: ProgrammeStage, stageIndex: number) {
  const sourceTopics = subject.lessons.slice(0, 4).map((lesson) => lesson.title);
  const topics = sourceTopics.length ? sourceTopics : [subject.title, "Methods and tools", "Applied practice", "Review"];
  return UNIT_TITLES.map((unit, index) => {
    const topic = topics[index % topics.length];
    const levelTask = stageIndex === 0
      ? "Follow the model, complete the guided activity and explain each important step in your own words."
      : stageIndex === 1
        ? "Plan the workflow, complete it independently, record decisions and check the output against stated requirements."
        : stageIndex === 2
          ? "Use an appropriate theoretical or analytical framework, compare alternatives and support your conclusion with evidence."
          : stageIndex === 3
            ? "Critically evaluate assumptions, competing approaches, implementation constraints and the wider consequences of the proposed solution."
            : "Frame an original, answerable inquiry; scrutinise prior evidence; justify a rigorous method; and identify the contribution and its limitations.";
    const practical = stageIndex === 0
      ? "Produce a small, correctly completed example and annotate the steps you followed."
      : stageIndex === 1
        ? "Produce a complete case file with a plan, working output, quality checks and a short improvement report."
        : stageIndex === 2
          ? "Develop an applied project, analyse the evidence and submit a structured report that connects theory to practice."
          : stageIndex === 3
            ? "Design and evaluate an advanced intervention or solution, including a strategy, measurable outcomes and critical reflection."
            : "Prepare a thesis-style research portfolio with a clear gap, literature synthesis, justified methodology, analysis plan and defensible original contribution.";
    const content = [
      "LEARNING OUTCOME — " + unit + " in " + subject.title + " at " + stage.label + " level. By the end of this lesson, you should be able to explain the central ideas, apply them to a new situation and show how you checked your work.",
      "SUBJECT CONTEXT — " + subject.description + " This programme develops that subject beyond an introductory overview. The level-specific expectation is " + stage.focus + ".",
      "KEY TOPIC — " + topic + ". Identify the terms, principles, tools and decisions that shape this topic. Define each important term precisely, distinguish similar concepts and connect them to a realistic example from the subject.",
      "METHOD — " + levelTask + " State the objective first, identify constraints and resources, select a suitable method, carry out the work in a controlled sequence, preserve evidence and evaluate the outcome.",
      "WORKED APPLICATION — Consider a realistic " + subject.title + " situation involving " + topic.toLowerCase() + ". Describe the problem, identify the information required, compare at least two possible approaches, explain why the selected approach fits the context and state what evidence would show that it worked.",
      "PRACTICAL TASK — " + practical + " Include a clear objective, the steps taken, the output, the evidence used to check it and a short note on what you would improve.",
      "PROGRAMME PROJECT EXPECTATION — " + stage.project + " Use a realistic subject-specific scenario, state the scope and constraints, preserve working evidence and explain how the output meets the stated objective.",
      "QUALITY AND RESPONSIBILITY — Check accuracy, completeness, consistency, safety, privacy, ethical conduct and relevant rules. Record assumptions separately from verified facts. Explain any limitation that could affect the reliability or use of the result.",
      "RESEARCH AND EVIDENCE STANDARD — " + stage.research + " Cite sources consistently, distinguish established findings from interpretation and identify gaps or uncertainties that remain.",
      "REFLECTION — Summarise the most important principle, explain one difficult decision, identify a mistake that could occur and describe how you would detect and correct it. Connect this lesson to the next unit."
    ];
    return {
      id: subject.id + "-" + stage.label.toLowerCase() + "-unit-" + (index + 1),
      title: unit + ": " + topic,
      minutes: stageIndex < 2 ? 25 : stageIndex === 2 ? 35 : 45,
      content,
    };
  });
}

function buildQuestions(subject: AcademyCourse, stage: ProgrammeStage) {
  return QUESTION_BANK.map((item, index) => {
    const correctIndex = index % 4;
    const options = [...item.wrong];
    options.splice(correctIndex, 0, item.correct);
    return {
      id: subject.id + "-" + stage.label.toLowerCase() + "-assessment-" + (index + 1),
      prompt: item.prompt.replace("this subject", subject.title + " at " + stage.label + " level"),
      options,
      answerIndex: correctIndex,
      explanation: item.correct + " This is important in " + subject.title + " because the " + stage.label + " programme expects learners to demonstrate " + stage.standard + ".",
    };
  });
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
        title: subject.title + " — " + stage.label + " Programme",
        category: subject.category,
        description: stage.label + "-level study in " + subject.title + ", covering " + stage.focus + ". Complete the lessons, submit the applied project and pass the assessment to earn a separate Corevia Rise Academy certificate of completion.",
        level: stage.label,
        priceKsh: stage.priceKsh,
        published: true,
        lessons: buildLessons(subject, stage, stageIndex),
        questions: buildQuestions(subject, stage),
        pathwayId: subject.id,
        programmeLevel: stage.label,
        programmeOrder: stageIndex + 1,
        prerequisiteCourseId,
        isProgrammeStage: true,
      } as AcademyCourse;
    }),
  );
}
