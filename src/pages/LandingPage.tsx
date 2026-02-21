import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Target,
  BookOpen,
  Package,
  ArrowRight,
  Cpu,
  CheckCircle2,
  Scan,
  Lock,
  Eye,
  Layers,
  GitBranch,
  FileSearch,
  KeyRound,
  Binary,
} from "lucide-react";

const methodologySteps = [
  {
    number: "01",
    title: "Parse & Validate",
    description:
      "Skills are submitted as SKILL.md files with optional bash scripts. Our parser validates the markdown AST, extracts metadata, and normalizes all content for downstream analysis.",
    icon: FileSearch,
  },
  {
    number: "02",
    title: "Purpose & Capability",
    description:
      "Compares name and description to the actual SKILL.md actions and bash behavior. Flags undeclared binaries, env vars, or install steps that don't match the registry metadata.",
    icon: Target,
  },
  {
    number: "03",
    title: "Instruction Scope",
    description:
      "Verifies runtime instructions stay on-topic — no reading unrelated files, accessing unexpected env vars, or directing data to endpoints beyond the stated purpose.",
    icon: BookOpen,
  },
  {
    number: "04",
    title: "Install Mechanism",
    description:
      "Assesses disk and download risk. Flags third-party taps, unverified binary sources, and mismatches between registry-declared installs and what the SKILL.md actually requires.",
    icon: Package,
  },
  {
    number: "05",
    title: "Credentials",
    description:
      "Checks whether secrets are pasted into chat/CLI history, verifies proper use of env vars and secret managers, detects credentials printed to stdout or sent over the network, and validates credential scope minimization.",
    icon: KeyRound,
  },
  {
    number: "06",
    title: "Persistence & Privilege",
    description:
      "Detects sudo/root requirements, system config modifications, daemon installs, always-on flags, and autonomous invocation risks that could widen the agent's attack surface.",
    icon: Lock,
  },
  {
    number: "07",
    title: "Report & Human Review",
    description:
      "Aggregates severity scores (0–100) across all five categories. Admin reviewers receive a detailed report with per-section explanations and can approve, reject, or request revisions.",
    icon: Eye,
  },
];

const principles = [
  {
    icon: Lock,
    title: "Zero Trust by Default",
    description: "Every skill is treated as potentially hostile until proven safe through automated analysis. We do not assume benign intent.",
  },
  {
    icon: Layers,
    title: "Defense in Depth",
    description: "Five independent evaluation categories ensure no single point of failure. Each produces an independent severity score.",
  },
  {
    icon: GitBranch,
    title: "Evidence-Driven Review",
    description: "Every score comes with concrete evidence from the provided inputs — no black-box decisions. Reviewers see exactly why.",
  },
  {
    icon: Scan,
    title: "Conservative by Design",
    description: "Silent uploads, webhook posts, and undocumented telemetry are treated as potential data exfiltration unless explicitly justified.",
  },
];

const LandingPage = () => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Cpu className="h-4 w-4 text-primary" />
          AI-Powered Skill Evaluation Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          Enterprise-grade agent skill
          <br />
          <span className="text-primary">governance & distribution</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          SkillGuard evaluates every agent skill across five security dimensions — from injection vectors and credential handling
          to network egress analysis — before it reaches your teams.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button asChild size="lg">
            <Link to="/marketplace">
              Browse Marketplace <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/submit">Submit a Skill</Link>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Methodology */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Evaluation Methodology</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Every submitted skill passes through a 7-stage pipeline with 5 independent scoring categories,
            designed to catch issues that manual review alone would miss.
          </p>
        </div>

        <div className="relative space-y-0">
          <div className="absolute left-[27px] top-8 bottom-8 w-px bg-border hidden md:block" />

          {methodologySteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex gap-5 py-5">
                <div className="relative z-10 flex-shrink-0 h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground tracking-wider">STAGE {step.number}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Principles */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Core Principles</h2>
          <p className="text-muted-foreground mt-2">
            The design philosophy behind SkillGuard's evaluation engine.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.title} className="bg-card">
                <CardContent className="pt-6 flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Scoring summary */}
      <section className="max-w-3xl mx-auto">
        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Severity Scoring (0–100)</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each of the five evaluation categories produces an independent severity score where <strong>higher means more risk</strong>:{" "}
                  <strong>0–10</strong> minimal risk, <strong>11–25</strong> low risk, <strong>26–45</strong> moderate risk,{" "}
                  <strong>46–65</strong> high risk, <strong>66–85</strong> very high risk, <strong>86–100</strong> critical.{" "}
                  Skills are evaluated across <strong>all five categories</strong> — Purpose & Capability, Instruction Scope,
                  Install Mechanism, Credentials, and Persistence & Privilege — before human reviewers make the final call.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-xl font-semibold mb-2">Ready to contribute?</h2>
        <p className="text-muted-foreground mb-6">Submit your skill and let the pipeline do the heavy lifting.</p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/submit">Submit a Skill</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/marketplace">View Marketplace</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
