import { useState, useEffect, useMemo } from "react";
import { getScore } from "@/lib/types";
import type { EvaluationScores } from "@/lib/types";
import { Shield, Puzzle, Sparkles, FileSearch, Binary, Network, CheckCircle2, Loader2, AlertTriangle, Cpu, Scan, Lock, GitBranch, Fingerprint, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineStep {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  subSteps: string[];
  durationMs: number;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "parse",
    label: "Parse & Validate",
    sublabel: "SKILL.md structure",
    icon: FileSearch,
    subSteps: [
      "Parsing markdown AST...",
      "Validating section headers...",
      "Extracting procedure steps...",
      "Checking schema compliance...",
    ],
    durationMs: 1800,
  },
  {
    id: "security",
    label: "Security Analysis",
    sublabel: "Threat & risk scan",
    icon: Shield,
    subSteps: [
      "Scanning for injection vectors...",
      "Analyzing permission boundaries...",
      "Checking data exposure risks...",
      "Evaluating credential handling...",
      "Assessing sandboxing requirements...",
    ],
    durationMs: 2800,
  },
  {
    id: "compatibility",
    label: "Compatibility Check",
    sublabel: "Enterprise readiness",
    icon: Puzzle,
    subSteps: [
      "Testing platform integrations...",
      "Validating API contract schemas...",
      "Checking version constraints...",
      "Assessing cross-environment portability...",
    ],
    durationMs: 2200,
  },
  {
    id: "quality",
    label: "Quality Assessment",
    sublabel: "Capability scoring",
    icon: Sparkles,
    subSteps: [
      "Measuring procedure completeness...",
      "Evaluating verification criteria...",
      "Analyzing edge case coverage...",
      "Computing quality confidence score...",
    ],
    durationMs: 2400,
  },
  {
    id: "report",
    label: "Generate Report",
    sublabel: "Final synthesis",
    icon: Binary,
    subSteps: [
      "Aggregating category scores...",
      "Generating explanations...",
      "Computing overall assessment...",
      "Finalizing evaluation report...",
    ],
    durationMs: 1600,
  },
];

type StepStatus = "pending" | "running" | "complete";

interface EvaluationPipelineProps {
  scores: EvaluationScores;
  status: "approved" | "pending" | "rejected";
  /** "full" = animated pipeline on detail page; "compact" = mini indicator on cards */
  variant?: "full" | "compact";
}

/** Compact mini-visualization for skill cards */
function CompactPipeline({ scores, status }: { scores: EvaluationScores; status: string }) {
  const overallScore = Math.round(
    [scores.security, scores.compatibility, scores.quality]
      .map(getScore)
      .reduce((a, b) => a + b, 0) / 3
  );
  const isPending = status === "pending";

  // Animated dots for pending
  const [activeDot, setActiveDot] = useState(0);
  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => setActiveDot((d) => (d + 1) % 5), 600);
    return () => clearInterval(interval);
  }, [isPending]);

  const icons = [FileSearch, Shield, Puzzle, Sparkles, Binary];

  if (isPending) {
    return (
      <div className="flex items-center gap-1 mt-2">
        {icons.map((Icon, i) => (
          <div key={i} className="flex items-center">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                i < activeDot
                  ? "bg-primary/20 text-primary"
                  : i === activeDot
                  ? "bg-primary text-primary-foreground animate-pulse"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-2.5 w-2.5" />
            </div>
            {i < icons.length - 1 && (
              <div
                className={cn(
                  "w-2 h-px transition-colors duration-300",
                  i < activeDot ? "bg-primary/40" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
        <span className="text-[10px] text-muted-foreground ml-1.5 animate-pulse">
          Evaluating...
        </span>
      </div>
    );
  }

  // Completed: show tiny score bar
  const color =
    overallScore >= 90
      ? "bg-emerald-500"
      : overallScore >= 70
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex items-center gap-0.5">
        {icons.map((Icon, i) => (
          <div key={i} className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Icon className="h-2 w-2" />
            </div>
            {i < icons.length - 1 && <div className="w-1.5 h-px bg-primary/30" />}
          </div>
        ))}
      </div>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${overallScore}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground">{overallScore}</span>
    </div>
  );
}

/** Full animated pipeline visualization */
function FullPipeline({ scores, status }: { scores: EvaluationScores; status: string }) {
  const isPending = status === "pending";
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    isPending ? PIPELINE_STEPS.map(() => "pending") : PIPELINE_STEPS.map(() => "complete")
  );
  const [activeSubStep, setActiveSubStep] = useState("");
  const [logLines, setLogLines] = useState<string[]>([]);

  // Animate the pipeline for pending skills
  useEffect(() => {
    if (!isPending) {
      // For completed skills, show all as complete with full logs
      const completedLogs = PIPELINE_STEPS.flatMap((step) => [
        `▸ ${step.label}`,
        ...step.subSteps.map((s) => `  ✓ ${s.replace("...", " — done")}`),
      ]);
      setLogLines(completedLogs);
      return;
    }

    let cancelled = false;
    const runPipeline = async () => {
      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        if (cancelled) return;
        const step = PIPELINE_STEPS[i];

        // Start this step
        setStepStatuses((prev) => prev.map((s, idx) => (idx === i ? "running" : s)));
        setLogLines((prev) => [...prev, `▸ ${step.label}`]);

        // Animate sub-steps
        for (let j = 0; j < step.subSteps.length; j++) {
          if (cancelled) return;
          setActiveSubStep(step.subSteps[j]);
          setLogLines((prev) => [...prev, `  ◦ ${step.subSteps[j]}`]);
          await new Promise((r) => setTimeout(r, step.durationMs / step.subSteps.length));
          if (cancelled) return;
          setLogLines((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = `  ✓ ${step.subSteps[j].replace("...", " — done")}`;
            return updated;
          });
        }

        // Complete this step
        setStepStatuses((prev) => prev.map((s, idx) => (idx === i ? "complete" : s)));
        setActiveSubStep("");
      }
    };

    runPipeline();
    return () => {
      cancelled = true;
    };
  }, [isPending]);

  const overallScore = Math.round(
    [scores.security, scores.compatibility, scores.quality]
      .map(getScore)
      .reduce((a, b) => a + b, 0) / 3
  );

  const decorativeIcons = [Cpu, Scan, Lock, GitBranch, Fingerprint, Zap, Network];

  return (
    <div className="space-y-4">
      {/* Pipeline Steps */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border" />

        <div className="space-y-1">
          {PIPELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            const stepStatus = stepStatuses[i];
            return (
              <div key={step.id} className="relative flex items-start gap-3 py-2">
                {/* Node */}
                <div
                  className={cn(
                    "relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-500",
                    stepStatus === "complete"
                      ? "bg-primary text-primary-foreground"
                      : stepStatus === "running"
                      ? "bg-primary/20 text-primary ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {stepStatus === "complete" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : stepStatus === "running" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium transition-colors",
                          stepStatus === "running" ? "text-primary" : stepStatus === "complete" ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                    </div>
                    {stepStatus === "complete" && (
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {(step.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>

                  {/* Running indicator with sub-step */}
                  {stepStatus === "running" && activeSubStep && (
                    <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
                      <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full animate-pulse" style={{ width: "60%" }} />
                      </div>
                      <span className="text-[10px] text-primary font-mono truncate max-w-[180px]">
                        {activeSubStep}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal-style log output */}
      <div className="bg-foreground/[0.03] border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border bg-muted/50">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-muted-foreground ml-2 font-mono">evaluation-engine v2.4.1</span>
          {isPending && stepStatuses.some((s) => s === "running") && (
            <Loader2 className="h-2.5 w-2.5 animate-spin text-muted-foreground ml-auto" />
          )}
        </div>
        <div className="p-3 max-h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-muted-foreground space-y-0.5 scrollbar-thin">
          {logLines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "transition-opacity duration-200",
                line.startsWith("▸")
                  ? "text-foreground font-semibold mt-1"
                  : line.includes("✓")
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {line}
            </div>
          ))}
          {isPending && stepStatuses.some((s) => s === "running") && (
            <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse" />
          )}
        </div>
      </div>

      {/* Floating decorative network nodes — only when complete */}
      {!isPending && (
        <div className="relative h-10 overflow-hidden opacity-40">
          <div className="absolute inset-0 flex items-center justify-around">
            {decorativeIcons.map((DIcon, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <DIcon className="h-3 w-3 text-muted-foreground" />
              </div>
            ))}
          </div>
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1={`${(i + 0.5) * (100 / 7)}%`}
                y1="50%"
                x2={`${(i + 1.5) * (100 / 7)}%`}
                y2="50%"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

export function EvaluationPipeline({ scores, status, variant = "full" }: EvaluationPipelineProps) {
  if (variant === "compact") {
    return <CompactPipeline scores={scores} status={status} />;
  }
  return <FullPipeline scores={scores} status={status} />;
}
