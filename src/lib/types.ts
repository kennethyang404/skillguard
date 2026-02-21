export type SkillStatus = "approved" | "pending" | "rejected";
export type SubmissionMethod = "template" | "upload";

export interface EvaluationCategory {
  score: number;
  explanation: string;
}

export interface EvaluationScores {
  purposeCapability: number | EvaluationCategory;
  instructionScope: number | EvaluationCategory;
  installMechanism: number | EvaluationCategory;
  credentials: number | EvaluationCategory;
  persistencePrivilege: number | EvaluationCategory;
  summary?: string;
}

/** The 5 evaluation section keys in rubric order */
export const EVALUATION_KEYS: (keyof Omit<EvaluationScores, "summary">)[] = [
  "purposeCapability",
  "instructionScope",
  "credentials",
  "installMechanism",
  "persistencePrivilege",
];

/** Human-readable labels for each evaluation section */
export const EVALUATION_LABELS: Record<string, string> = {
  purposeCapability: "Purpose & Capability",
  instructionScope: "Instruction Scope",
  installMechanism: "Install Mechanism",
  credentials: "Credentials",
  persistencePrivilege: "Persistence & Privilege",
};

/** Extract numeric score from a category that may be number or EvaluationCategory */
export function getScore(val: number | EvaluationCategory): number {
  return typeof val === "number" ? val : val.score;
}

/** Extract explanation from a category (empty string if just a number) */
export function getExplanation(val: number | EvaluationCategory): string {
  return typeof val === "number" ? "" : val.explanation;
}

/**
 * Severity scoring rubric (0–100, higher = more risk):
 * 0–10: Minimal risk
 * 11–25: Low risk
 * 26–45: Moderate risk
 * 46–65: High risk
 * 66–85: Very high risk
 * 86–100: Critical
 */
export function getSeverityLabel(score: number): string {
  if (score <= 10) return "Minimal";
  if (score <= 25) return "Low";
  if (score <= 45) return "Moderate";
  if (score <= 65) return "High";
  if (score <= 85) return "Very High";
  return "Critical";
}

export function getSeverityColor(score: number): string {
  if (score <= 10) return "text-emerald-600";
  if (score <= 25) return "text-emerald-500";
  if (score <= 45) return "text-amber-600";
  if (score <= 65) return "text-orange-600";
  if (score <= 85) return "text-red-500";
  return "text-red-700";
}

export interface Skill {
  id: string;
  title: string;
  author: string;
  version: string;
  description: string;
  tags: string[];
  category: string;
  markdownContent: string;
  bashScript?: string;
  status: SkillStatus;
  evaluationScores: EvaluationScores;
  downloads: number;
  rating: number;
  submissionMethod: SubmissionMethod;
  submittedAt: string;
  adminNotes?: string;
}
