import React, { createContext, useContext, useState, useCallback } from "react";
import { Skill, SkillStatus } from "./types";
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

export function SkillsProvider({ children }: { children: React.ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [role, setRole] = useState<"employee" | "admin">("employee");

  const addSkill = useCallback(
    (skill: Omit<Skill, "id" | "downloads" | "rating" | "status" | "submittedAt">) => {
      const newSkill: Skill = {
        ...skill,
        id: String(Date.now()),
        downloads: 0,
        rating: 0,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };
      setSkills((prev) => [newSkill, ...prev]);
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
