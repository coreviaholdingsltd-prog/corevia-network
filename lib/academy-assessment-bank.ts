import type { AcademyCourse } from "@/lib/academy-catalog";

type AcademyQuestion = AcademyCourse["questions"][number];

const COMPUTER_MAINTENANCE_QUESTIONS: AcademyQuestion[] = [
  {
    id: "computer-maintenance-it-support-q1",
    prompt: "A user says, “My computer is broken.” What should the technician record first?",
    options: [
      "A replacement part to order before inspecting the device.",
      "The exact symptom, time, affected task, error message and steps that reproduce the issue.",
      "A list of every setting the technician intends to change.",
      "The user's password so the technician can investigate later."
    ],
    answerIndex: 1,
    explanation: "A precise symptom and reproducible record establish evidence, scope and a safe starting point. Never request a user's password."
  },
  {
    id: "computer-maintenance-it-support-q2",
    prompt: "A laptop becomes slow after several applications are opened. Which first check is most useful and low risk?",
    options: [
      "Immediately reinstall Windows.",
      "Delete the user's Downloads folder.",
      "Inspect CPU and memory use, open applications, available storage and recent changes.",
      "Disable antivirus protection to see whether performance improves."
    ],
    answerIndex: 2,
    explanation: "Observe resource use and recent changes before making modifications. Reinstallation, deletion and disabling security controls are disproportionate first steps."
  },
  {
    id: "computer-maintenance-it-support-q3",
    prompt: "Why should a technician change one setting at a time during troubleshooting?",
    options: [
      "So the effect of each change can be identified and reversed if necessary.",
      "Because changing several settings always damages the operating system.",
      "So the technician can avoid recording test results.",
      "Because every computer problem has only one possible cause."
    ],
    answerIndex: 0,
    explanation: "Controlled changes preserve diagnostic evidence and make it easier to identify which action helped or caused a new problem."
  },
  {
    id: "computer-maintenance-it-support-q4",
    prompt: "A printer is not producing a document. What should be checked before reinstalling its driver?",
    options: [
      "Whether the computer's wallpaper is current.",
      "Whether all user accounts can access the internet.",
      "Whether the printer should be replaced immediately.",
      "Power, connection, selected printer, print queue and the displayed error."
    ],
    answerIndex: 3,
    explanation: "Basic power, connectivity, queue and device-selection checks often identify the issue without unnecessary driver changes."
  },
  {
    id: "computer-maintenance-it-support-q5",
    prompt: "Windows Device Manager shows Code 28 for a device. What does this generally indicate?",
    options: [
      "The device is overheating and must be opened immediately.",
      "The drivers for the device are not installed.",
      "The user's files have been permanently deleted.",
      "The device is confirmed to be counterfeit."
    ],
    answerIndex: 1,
    explanation: "Code 28 generally indicates that drivers are not installed. Confirm the device model and obtain the appropriate driver from the device or computer manufacturer's official support source."
  },
  {
    id: "computer-maintenance-it-support-q6",
    prompt: "Before a repair that could affect a user's files, what must be established?",
    options: [
      "That the repair can be completed without telling the user.",
      "That temporary files have all been deleted.",
      "That a usable backup or recovery plan exists and the user has authorised the work.",
      "That the technician has copied the user's password."
    ],
    answerIndex: 2,
    explanation: "Protect data first. Confirm a usable backup or recovery route, explain the proposed work and obtain permission before proceeding."
  },
  {
    id: "computer-maintenance-it-support-q7",
    prompt: "Which practice best reduces electrostatic-discharge risk when handling an internal computer component?",
    options: [
      "Use appropriate ESD protection, such as a correctly grounded wrist strap and suitable work surface.",
      "Place the component on a carpet while preparing the tools.",
      "Touch connector contacts repeatedly to remove dust.",
      "Wear ordinary plastic gloves and assume they provide ESD protection."
    ],
    answerIndex: 0,
    explanation: "Use manufacturer-recommended ESD precautions and handle components by their edges. Follow electrical-safety procedures and do not open power supplies."
  },
  {
    id: "computer-maintenance-it-support-q8",
    prompt: "A technician notices a swollen laptop battery. What is the safest response?",
    options: [
      "Press the battery flat and continue the repair.",
      "Puncture it to release trapped gas.",
      "Keep charging it while monitoring the temperature.",
      "Stop using and charging the device, avoid handling or puncturing the battery, and escalate for qualified service."
    ],
    answerIndex: 3,
    explanation: "A swollen lithium-ion battery is a safety hazard. Stop use and charging, do not compress or puncture it, and arrange qualified handling under manufacturer guidance."
  },
  {
    id: "computer-maintenance-it-support-q9",
    prompt: "A user asks for remote support. What should the technician do before connecting?",
    options: [
      "Connect using any available account because speed is most important.",
      "Explain the session, obtain the user's permission and use an approved, appropriately limited access method.",
      "Ask the user to send their password and one-time code in chat.",
      "Leave remote access permanently enabled after the issue is fixed."
    ],
    answerIndex: 1,
    explanation: "Remote support requires informed permission, approved tools and least-privilege access. Credentials and one-time codes must not be requested or shared."
  },
  {
    id: "computer-maintenance-it-support-q10",
    prompt: "After applying a fix, what is the best way to confirm the issue is resolved?",
    options: [
      "Close the ticket as soon as the device restarts.",
      "Assume the issue is fixed because no new warning appeared.",
      "Repeat the affected task with the user or an agreed test, check related functions and record the result.",
      "Delete the diagnostic notes to keep the record short."
    ],
    answerIndex: 2,
    explanation: "Verify the original symptom is gone, check relevant functions and record evidence. If the issue remains, document the result and next step."
  },
  {
    id: "computer-maintenance-it-support-q11",
    prompt: "When should a support technician escalate an issue?",
    options: [
      "When the risk, required access or technical work exceeds their training, authority or approved procedure.",
      "Whenever a user asks a question that takes more than one minute.",
      "Only after trying every possible change on the device.",
      "Only when the computer can no longer power on."
    ],
    answerIndex: 0,
    explanation: "Escalate early when safety, data protection, permissions or technical complexity exceed the technician's authority. Do not experiment with hazardous or unauthorised repairs."
  },
  {
    id: "computer-maintenance-it-support-q12",
    prompt: "Which information makes a support ticket most useful to the next technician?",
    options: [
      "A personal opinion about the user.",
      "Only the words “fixed” or “not fixed”.",
      "The user's account password and private files.",
      "The symptom, device details, impact, checks performed, results, changes, outcome and any remaining risks."
    ],
    answerIndex: 3,
    explanation: "A useful ticket is factual, reproducible and privacy-conscious. It records actions and evidence while excluding passwords and unnecessary personal information."
  }
];

export function getAcademyQuestions(course: AcademyCourse): AcademyQuestion[] {
  return course.id === "computer-maintenance-it-support"
    ? COMPUTER_MAINTENANCE_QUESTIONS
    : course.questions;
}
