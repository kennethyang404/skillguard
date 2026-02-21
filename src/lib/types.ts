export type SkillStatus = "approved" | "pending" | "rejected";
export type SubmissionMethod = "template" | "upload";

export interface EvaluationCategory {
  score: number;
  explanation: string;
}

export interface EvaluationScores {
  security: number | EvaluationCategory;
  credentials: number | EvaluationCategory;
  compatibility: number | EvaluationCategory;
  quality: number | EvaluationCategory;
  networkEgress: number | EvaluationCategory;
  summary?: string;
}

/** The 5 evaluation section keys in rubric order */
export const EVALUATION_KEYS: (keyof Omit<EvaluationScores, "summary">)[] = [
  "security",
  "credentials",
  "compatibility",
  "quality",
  "networkEgress",
];

/** Human-readable labels for each evaluation section */
export const EVALUATION_LABELS: Record<string, string> = {
  security: "Security & Safety",
  credentials: "Credential Handling",
  compatibility: "Enterprise Compatibility",
  quality: "Quality & Capability",
  networkEgress: "Network Egress & Data Disclosure",
};

/** Extract numeric score from a category that may be number or EvaluationCategory */
export function getScore(val: number | EvaluationCategory): number {
  return typeof val === "number" ? val : val.score;
}

/** Extract explanation from a category (empty string if just a number) */
export function getExplanation(val: number | EvaluationCategory): string {
  return typeof val === "number" ? "" : val.explanation;
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
