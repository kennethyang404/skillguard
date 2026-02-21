export type SkillStatus = "approved" | "pending" | "rejected";
export type SubmissionMethod = "template" | "upload";

export interface EvaluationCategory {
  score: number;
  explanation: string;
}

export interface EvaluationScores {
  security: number | EvaluationCategory;
  compatibility: number | EvaluationCategory;
  quality: number | EvaluationCategory;
  summary?: string;
}

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
  status: SkillStatus;
  evaluationScores: EvaluationScores;
  downloads: number;
  rating: number;
  submissionMethod: SubmissionMethod;
  submittedAt: string;
  adminNotes?: string;
}
