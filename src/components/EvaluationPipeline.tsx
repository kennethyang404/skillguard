import { useState, useEffect, useRef } from "react";
import { getScore, EVALUATION_KEYS } from "@/lib/types";
import type { EvaluationScores } from "@/lib/types";
import {
  Shield, Puzzle, Sparkles, FileSearch, Binary, Network,
  CheckCircle2, Loader2, Clock, ChevronRight, Circle, XCircle,
  KeyRound,
} from "lucide-react";
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
    sublabel: "SKILL.md + bash structure",
    icon: FileSearch,
    subSteps: [
      "Parsing markdown AST",
      "Validating section headers",
      "Extracting procedure steps",
      "Parsing bash script (if provided)",
      "Checking schema compliance",
    ],
    durationMs: 1800,
  },
  {
    id: "security",
    label: "Security & Safety",
    sublabel: "Injection, RCE, obfuscation",
    icon: Shield,
    subSteps: [
      "Scanning for curl|bash / wget|sh patterns",
      "Detecting prompt injection vectors",
      "Checking for obfuscated scripts (base64, eval)",
      "Analyzing unsafe command execution",
      "Detecting remote code download patterns",
    ],
    durationMs: 2800,
  },
  {
    id: "credentials",
    label: "Credential Handling",
    sublabel: "Secrets & key management",
    icon: KeyRound,
    subSteps: [
      "Checking for secrets in chat/CLI history",
      "Validating env var / secret manager usage",
      "Detecting secrets printed to stdout",
      "Verifying credential scope minimization",
    ],
    durationMs: 1800,
  },
  {
    id: "compatibility",
    label: "Enterprise Compatibility",
    sublabel: "Corp environment readiness",
    icon: Puzzle,
    subSteps: [
      "Checking for sudo/root requirements",
      "Detecting system config modifications",
      "Validating proxy/cert compatibility",
      "Assessing restricted package installs",
    ],
    durationMs: 2200,
  },
  {
    id: "quality",
    label: "Quality & Capability",
    sublabel: "Scope, clarity, alignment",
    icon: Sparkles,
    subSteps: [
      "Evaluating persona & scope definition",
      "Checking constraint clarity",
      "Verifying SKILL.md ↔ bash alignment",
      "Assessing auditability & safe defaults",
    ],
    durationMs: 2400,
  },
  {
    id: "networkEgress",
    label: "Network Egress & Data Disclosure",
    sublabel: "Outbound traffic analysis",
    icon: Network,
    subSteps: [
      "Enumerating outbound network actions",
      "Classifying download vs upload vs RCE",
      "Checking documentation alignment",
      "Flagging undisclosed data transmission",
    ],
    durationMs: 2000,
  },
  {
    id: "report",
    label: "Generate Report",
    sublabel: "Final synthesis",
    icon: Binary,
    subSteps: [
      "Aggregating category scores",
      "Generating per-section explanations",
      "Computing overall assessment",
      "Finalizing evaluation report",
    ],
    durationMs: 1600,
  },
];

type StepStatus = "pending" | "running" | "complete" | "failed";

interface EvaluationPipelineProps {
  scores: EvaluationScores;
  status: "approved" | "pending" | "rejected";
  variant?: "full" | "compact";
}

/* ─── Compact (cards) ─── */
function CompactPipeline({ scores, status }: { scores: EvaluationScores; status: string }) {
  const scoreValues = EVALUATION_KEYS.map((k) => getScore(scores[k]));
  const overallScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);
  const isPending = status === "pending";
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    if (!isPending) return;
    const id = setInterval(() => setActiveDot((d) => (d + 1) % PIPELINE_STEPS.length), 600);
    return () => clearInterval(id);
  }, [isPending]);

  const icons = PIPELINE_STEPS.map((s) => s.icon);

  if (isPending) {
    return (
      <div className="flex items-center gap-1 mt-2">
        {icons.map((Icon, i) => (
          <div key={i} className="flex items-center">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                i < activeDot ? "bg-primary/20 text-primary"
                  : i === activeDot ? "bg-primary text-primary-foreground animate-pulse"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-2.5 w-2.5" />
            </div>
            {i < icons.length - 1 && (
              <div className={cn("w-2 h-px transition-colors duration-300", i < activeDot ? "bg-primary/40" : "bg-border")} />
            )}
          </div>
        ))}
        <span className="text-[10px] text-muted-foreground ml-1.5 animate-pulse">Evaluating…</span>
      </div>
    );
  }

  const color = overallScore >= 90 ? "bg-emerald-500" : overallScore >= 70 ? "bg-amber-500" : "bg-red-500";
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

/* ─── Elapsed timer ─── */
function ElapsedTimer({ running, startTime }: { running: boolean; startTime: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(Date.now() - startTime), 100);
    return () => clearInterval(id);
  }, [running, startTime]);

  const seconds = running ? (elapsed / 1000).toFixed(1) : ((elapsed || 0) / 1000).toFixed(1);
  return (
    <span className="text-[10px] font-mono text-muted-foreground tabular-nums flex items-center gap-1">
      <Clock className="h-2.5 w-2.5" />
      {seconds}s
    </span>
  );
}

/* ─── GitHub-CI-style status icon ─── */
function StatusIcon({ status, icon: Icon }: { status: StepStatus; icon: React.ElementType }) {
  switch (status) {
    case "complete":
      return (
        <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      );
    case "running":
      return (
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg className="absolute inset-0 w-7 h-7 animate-spin" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="50 26" strokeLinecap="round" />
          </svg>
          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center z-10">
            <Icon className="h-3 w-3" />
          </div>
        </div>
      );
    case "failed":
      return (
        <div className="w-7 h-7 rounded-full bg-red-500/15 text-red-600 flex items-center justify-center">
          <XCircle className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
          <Circle className="h-3 w-3" />
        </div>
      );
  }
}

/* ─── Full pipeline (GitHub CI style) ─── */
function FullPipeline({ scores, status }: { scores: EvaluationScores; status: string }) {
  const isPending = status === "pending";
  const isRejected = status === "rejected";

  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    isPending ? PIPELINE_STEPS.map(() => "pending") : PIPELINE_STEPS.map(() => "complete")
  );
  const [activeSubStepIdx, setActiveSubStepIdx] = useState<Record<number, number>>({});
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [stepStartTimes, setStepStartTimes] = useState<Record<number, number>>({});
  const [logLines, setLogLines] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines]);

  useEffect(() => {
    if (!isPending) {
      const completed = PIPELINE_STEPS.flatMap((step) => [
        `▸ ${step.label}`,
        ...step.subSteps.map((s) => `  ✓ ${s} — done`),
      ]);
      setLogLines(completed);
      return;
    }

    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        if (cancelled) return;
        const step = PIPELINE_STEPS[i];
        setStepStatuses((p) => p.map((s, idx) => (idx === i ? "running" : s)));
        setStepStartTimes((p) => ({ ...p, [i]: Date.now() }));
        setExpandedStep(i);
        setLogLines((p) => [...p, `▸ ${step.label}`]);

        for (let j = 0; j < step.subSteps.length; j++) {
          if (cancelled) return;
          setActiveSubStepIdx((p) => ({ ...p, [i]: j }));
          setLogLines((p) => [...p, `  ◦ ${step.subSteps[j]}…`]);
          await new Promise((r) => setTimeout(r, step.durationMs / step.subSteps.length));
          if (cancelled) return;
          setLogLines((p) => {
            const u = [...p];
            u[u.length - 1] = `  ✓ ${step.subSteps[j]} — done`;
            return u;
          });
        }

        setStepStatuses((p) => p.map((s, idx) => (idx === i ? "complete" : s)));
        setActiveSubStepIdx((p) => ({ ...p, [i]: -1 }));
      }
    };
    run();
    return () => { cancelled = true; };
  }, [isPending]);

  const totalDuration = PIPELINE_STEPS.reduce((s, p) => s + p.durationMs, 0);

  return (
    <div className="space-y-3">
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border",
        isPending
          ? "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
          : isRejected
          ? "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
      )}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isRejected ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        <span>
          {isPending ? "Evaluation in progress…" : isRejected ? "Evaluation complete — issues found" : "Evaluation passed"}
        </span>
        <span className="ml-auto text-xs font-mono opacity-70">
          {isPending ? "running" : `${(totalDuration / 1000).toFixed(1)}s total`}
        </span>
      </div>

      <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
        {PIPELINE_STEPS.map((step, i) => {
          const Icon = step.icon;
          const stepStatus = stepStatuses[i];
          const isExpanded = expandedStep === i;
          const subIdx = activeSubStepIdx[i] ?? -1;

          return (
            <div key={step.id}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/50",
                  stepStatus === "running" && "bg-primary/[0.03]"
                )}
                onClick={() => setExpandedStep(isExpanded ? null : i)}
              >
                <StatusIcon status={stepStatus} icon={Icon} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    stepStatus === "running" ? "text-primary" : stepStatus === "complete" ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{step.sublabel}</p>
                </div>

                {stepStatus === "running" && stepStartTimes[i] && (
                  <ElapsedTimer running={true} startTime={stepStartTimes[i]} />
                )}
                {stepStatus === "complete" && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {(step.durationMs / 1000).toFixed(1)}s
                  </span>
                )}

                <ChevronRight className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                  isExpanded && "rotate-90"
                )} />
              </button>

              <div className={cn(
                "overflow-hidden transition-all duration-300",
                isExpanded ? "max-h-[500px]" : "max-h-0"
              )}>
                <div className="px-3 pb-3 pt-1 ml-10 space-y-1.5 border-l-2 border-border ml-[26px]">
                  {step.subSteps.map((sub, j) => {
                    const subDone = stepStatus === "complete" || (stepStatus === "running" && j < subIdx);
                    const subRunning = stepStatus === "running" && j === subIdx;
                    return (
                      <div
                        key={j}
                        className={cn(
                          "flex items-center gap-2 text-xs pl-3 py-1 rounded transition-all",
                          subRunning && "bg-primary/5"
                        )}
                      >
                        {subDone ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                        ) : subRunning ? (
                          <Loader2 className="h-3 w-3 text-primary animate-spin shrink-0" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                        )}
                        <span className={cn(
                          subDone ? "text-muted-foreground" : subRunning ? "text-primary font-medium" : "text-muted-foreground/50"
                        )}>
                          {sub}
                        </span>
                        {subRunning && (
                          <span className="ml-auto">
                            <span className="inline-flex gap-0.5">
                              <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal log */}
      <div className="bg-foreground/[0.03] border border-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border bg-muted/50">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-muted-foreground ml-2 font-mono">evaluation-engine v3.0.0</span>
          {isPending && stepStatuses.some((s) => s === "running") && (
            <Loader2 className="h-2.5 w-2.5 animate-spin text-muted-foreground ml-auto" />
          )}
        </div>
        <div ref={logRef} className="p-3 max-h-32 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-0.5">
          {logLines.map((line, i) => (
            <div
              key={i}
              className={cn(
                line.startsWith("▸") ? "text-foreground font-semibold mt-1"
                  : line.includes("✓") ? "text-emerald-600 dark:text-emerald-400"
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
    </div>
  );
}

export function EvaluationPipeline({ scores, status, variant = "full" }: EvaluationPipelineProps) {
  if (variant === "compact") {
    return <CompactPipeline scores={scores} status={status} />;
  }
  return <FullPipeline scores={scores} status={status} />;
}
