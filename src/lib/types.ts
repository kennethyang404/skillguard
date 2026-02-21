export type SkillStatus = "approved" | "pending" | "rejected";
export type SubmissionMethod = "template" | "upload";

export interface EvaluationScores {
  security: number;
  compatibility: number;
  quality: number;
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
