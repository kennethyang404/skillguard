import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Puzzle,
  Sparkles,
  ArrowRight,
  Cpu,
  CheckCircle2,
  Scan,
  Lock,
  Eye,
  Layers,
  GitBranch,
  Package,
  KeyRound,
} from "lucide-react";

const methodologySteps = [
  {
    number: "01",
    title: "Submission & Parsing",
    description:
      "Skills are submitted as SKILL.md files with optional bash scripts. Our parser validates the markdown AST, extracts metadata, and normalizes all content for downstream analysis.",
    icon: Package,
  },
  {
    number: "02",
    title: "Security & Safety Scan",
    description:
      "Scans for curl|bash patterns, prompt injection vulnerabilities, obfuscated scripts (base64, eval), unsafe command execution, and remote code download patterns across the entire skill definition.",
    icon: Shield,
  },
  {
    number: "03",
    title: "Credential Handling Review",
    description:
      "Checks whether the skill asks users to paste API keys into chat or CLI history, verifies proper use of environment variables and secret managers, and detects credentials printed to stdout or sent over the network.",
    icon: KeyRound,
  },
  {
    number: "04",
    title: "Enterprise Compatibility Check",
    description:
      "Verifies the skill doesn't require sudo/root, modify system configs, install daemons, or assume consumer services. Ensures it runs in locked-down corporate environments with proxy and cert pinning constraints.",
    icon: Puzzle,
  },
  {
    number: "05",
    title: "Quality & Capability Assessment",
    description:
      "Evaluates persona scope definition, constraint clarity, instruction-to-code alignment, and whether the skill follows corporate best practices like auditable steps and safe defaults.",
    icon: Sparkles,
  },
  {
    number: "06",
    title: "Human Review & Approval",
    description:
      "Admin reviewers receive a detailed evaluation report with per-section severity scores (0–100), explanations, and flagged concerns. They can approve, reject, or request revisions with full context.",
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
    description: "Four independent evaluation categories ensure no single point of failure. Each produces an independent severity score.",
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
          SkillGuard evaluates every agent skill across four security dimensions — from injection vectors and credential handling
          to enterprise compatibility — before it reaches your teams.
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
            Every submitted skill passes through a 6-stage pipeline with 4 independent scoring categories,
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
