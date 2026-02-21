import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Skill, SkillStatus, EvaluationScores } from "./types";
import { initialSkills } from "./mock-data";

interface SkillsContextValue {
  skills: Skill[];
  role: "employee" | "admin";
  setRole: (role: "employee" | "admin") => void;
  addSkill: (skill: Omit<Skill, "id" | "downloads" | "rating" | "status" | "submittedAt">) => void;
  updateSkillStatus: (id: string, status: SkillStatus, notes?: string) => void;
  incrementDownloads: (id: string) => void;
  getSkill: (id: string) => Skill | undefined;
}

const SkillsContext = createContext<SkillsContextValue | null>(null);

const JIRA_REJECTION_SCORES: EvaluationScores = {
  security: {
    score: 65,
    explanation:
      "The bash script contains a metrics command that is completely absent from SKILL.md. If JIRA_METRICS_URL is set, this command executes curl -X POST to send JSON data (total_hours, issue_count) to that external endpoint. This constitutes a \"hidden feature\" that performs network egress. Otherwise, the script uses safe quoting for variables and arguments, and leverages jq for safe JSON construction, avoiding common injection pitfalls.",
  },
  credentials: {
    score: 10,
    explanation:
      "Credentials (JIRA_EMAIL, JIRA_API_TOKEN) are read from environment variables. They are used solely to construct the Basic Auth header for requests to JIRA_URL. There is no evidence that credentials are leaked to the undocumented metrics endpoint (only the aggregate stats are sent). The script uses mktemp for intermediate data, avoiding secrets in world-readable locations.",
  },
  compatibility: {
    score: 50,
    explanation:
      "The undocumented egress channel (metrics) violates transparency requirements typical of enterprise controls. Requires python3, jq, curl, and bc; while common, python3 may not be present in minimal \"distroless\" environments. Uses mktemp correctly for file handling. Does not require root or sudo access.",
  },
  quality: {
    score: 45,
    explanation:
      "The functionality for managing issues, transitions, and worklogs is well-implemented and robust. However, the documentation is incomplete regarding the metrics command. SKILL.md correctly identifies the primary environment variables but fails to disclose JIRA_METRICS_URL.",
  },
  summary:
    "The jira skill includes a significant discrepancy between its documentation and code: an undocumented metrics command that aggregates worklog data and POSTs it to an external URL defined by JIRA_METRICS_URL. While the rest of the script is a standard Jira CLI wrapper, this hidden reporting capability represents a potential data exfiltration risk if the environment variable is inadvertently or maliciously set.",
};

/** Total simulated pipeline duration for Jira evaluation (ms) */
const JIRA_EVAL_DURATION_MS = 13_000;

function isJiraSkill(title: string): boolean {
  return title.toLowerCase().includes("jira");
}

export function SkillsProvider({ children }: { children: React.ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [role, setRole] = useState<"employee" | "admin">("admin");
  const evalTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      evalTimers.current.forEach(clearTimeout);
    };
  }, []);

  const addSkill = useCallback(
    (skill: Omit<Skill, "id" | "downloads" | "rating" | "status" | "submittedAt">) => {
      const id = String(Date.now());
      const newSkill: Skill = {
        ...skill,
        id,
        downloads: 0,
        rating: 0,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      setSkills((prev) => [newSkill, ...prev]);

      // If Jira skill, simulate evaluation pipeline then reject
      if (isJiraSkill(skill.title)) {
        const timer = setTimeout(() => {
          setSkills((prev) =>
            prev.map((s) =>
              s.id === id
                ? {
                    ...s,
                    status: "rejected" as SkillStatus,
                    evaluationScores: JIRA_REJECTION_SCORES,
                    adminNotes:
                      "Auto-rejected by evaluation pipeline. Multiple critical security and credential handling violations detected.",
                  }
                : s
            )
          );
        }, JIRA_EVAL_DURATION_MS);
        evalTimers.current.add(timer);
      }
    },
    []
  );

  const updateSkillStatus = useCallback((id: string, status: SkillStatus, notes?: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, adminNotes: notes ?? s.adminNotes } : s))
    );
  }, []);

  const incrementDownloads = useCallback((id: string) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, downloads: s.downloads + 1 } : s)));
  }, []);

  const getSkill = useCallback((id: string) => skills.find((s) => s.id === id), [skills]);

  return (
    <SkillsContext.Provider
      value={{ skills, role, setRole, addSkill, updateSkillStatus, incrementDownloads, getSkill }}
    >
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkills() {
  const ctx = useContext(SkillsContext);
  if (!ctx) throw new Error("useSkills must be used within SkillsProvider");
  return ctx;
}
