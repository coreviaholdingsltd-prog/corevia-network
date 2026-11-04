export const ACADEMY_QUALIFICATION_LEVELS = {
  CERTIFICATE: { label: "Certificate", feeKsh: 1500 },
  DIPLOMA: { label: "Diploma", feeKsh: 3500 },
  DEGREE: { label: "Degree", feeKsh: 7500 },
  MASTERS: { label: "Master’s", feeKsh: 12500 },
  PHD: { label: "PhD", feeKsh: 20000 },
} as const;

export type AcademyQualificationLevel = keyof typeof ACADEMY_QUALIFICATION_LEVELS;

export function getAcademyQualification(value: unknown) {
  if (typeof value !== "string" || !(value in ACADEMY_QUALIFICATION_LEVELS)) return null;
  return ACADEMY_QUALIFICATION_LEVELS[value as AcademyQualificationLevel];
}
