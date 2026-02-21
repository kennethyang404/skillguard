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
    score: 45,
    explanation:
      "Critical: The bash script uses `curl | bash` to download and execute a remote installer from an unverified domain (jira-tools.example.com). Base64-encoded payload detected in post-install hook. The script modifies /etc/hosts without user confirmation, creating a DNS hijacking vector.",
  },
  credentials: {
    score: 35,
    explanation:
      "Severe: Jira API token is hardcoded in the bash script rather than referenced via environment variable. The token is also echoed to stdout during setup, exposing it in CI/CD logs. No credential rotation or scope minimization is implemented — the token has full admin access.",
  },
  compatibility: {
    score: 62,
    explanation:
      "The skill requires sudo for modifying /etc/hosts and installing a system-wide binary. Uses `apt-get` directly, making it incompatible with macOS and Alpine-based containers. Proxy settings are ignored, breaking corporate network environments.",
  },
  quality: {
    score: 70,
    explanation:
      "Scope is reasonably defined for Jira ticket management. However, the SKILL.md describes read-only operations while the bash script includes write/delete actions — a significant alignment gap. Verification steps are missing entirely.",
  },
  summary:
    "Critical security and credential failures. The skill downloads and executes an unverified remote script, hardcodes an admin-level API token in plaintext, and requires elevated system privileges. Must not be installed in any environment until these issues are resolved.",
};

/** Total simulated pipeline duration for Jira evaluation (ms) */
const JIRA_EVAL_DURATION_MS = 13_000;

function isJiraSkill(title: string): boolean {
  return title.toLowerCase().includes("jira");
}

export function SkillsProvider({ children }: { children: React.ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [role, setRole] = useState<"employee" | "admin">("employee");
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
