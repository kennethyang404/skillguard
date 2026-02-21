import { useParams, Link } from "react-router-dom";
import { useSkills } from "@/lib/skills-store";
import { getScore, getExplanation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Star, Shield, Puzzle, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { EvaluationPipeline } from "@/components/EvaluationPipeline";

const statusColors: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const SkillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getSkill, incrementDownloads } = useSkills();
  const skill = getSkill(id!);

  if (!skill) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Skill not found.</p>
        <Link to="/" className="text-primary underline mt-2 inline-block">Back to marketplace</Link>
      </div>
    );
  }

  const handleInstall = () => {
    incrementDownloads(skill.id);
    toast.success(`"${skill.title}" installed successfully.`);
  };

  const evalItems = [
    { label: "Security & Safety", val: skill.evaluationScores.security, icon: Shield },
    { label: "Enterprise Compatibility", val: skill.evaluationScores.compatibility, icon: Puzzle },
    { label: "Quality & Capability", val: skill.evaluationScores.quality, icon: Sparkles },
  ];

  const overallScore = Math.round(
    evalItems.reduce((sum, item) => sum + getScore(item.val), 0) / evalItems.length
  );
  const overallColor = overallScore >= 90 ? "text-emerald-600" : overallScore >= 70 ? "text-amber-600" : "text-red-600";

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to marketplace
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{skill.title}</h1>
              <Badge className={statusColors[skill.status]}>{skill.status}</Badge>
            </div>
            <p className="text-muted-foreground">
              by {skill.author} · v{skill.version}
            </p>
            <p className="mt-3">{skill.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {skill.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          {/* Score Breakdown — immediately visible */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Score Breakdown</CardTitle>
                <span className={`text-lg font-bold ${overallColor}`}>{overallScore}/100</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {skill.evaluationScores.summary && (
                <>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {skill.evaluationScores.summary}
                  </p>
                  <Separator />
                </>
              )}
              {evalItems.map((item) => {
                const Icon = item.icon;
                const score = getScore(item.val);
                const explanation = getExplanation(item.val);
                const color = score >= 90 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-red-600";
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </span>
                      <span className={`font-semibold ${color}`}>{score}/100</span>
                    </div>
                    <Progress value={score} className="h-2" />
                    {explanation && (
                      <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                        {explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SKILL.md Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{skill.markdownContent}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Button className="w-full" onClick={handleInstall}>
                <Download className="h-4 w-4 mr-2" /> Install Skill
              </Button>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" /> {skill.downloads.toLocaleString()} downloads
                </span>
                {skill.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {skill.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" /> Evaluation Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EvaluationPipeline scores={skill.evaluationScores} status={skill.status} variant="full" />
            </CardContent>
          </Card>

          {skill.adminNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{skill.adminNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
