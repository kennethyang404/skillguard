import { useParams, Link } from "react-router-dom";
import { useSkills } from "@/lib/skills-store";
import { getScore, getExplanation, EVALUATION_KEYS, EVALUATION_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Star, Shield, Puzzle, Sparkles, FileText, KeyRound } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { EvaluationPipeline } from "@/components/EvaluationPipeline";

const statusColors: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const EVAL_ICONS: Record<string, React.ElementType> = {
  security: Shield,
  credentials: KeyRound,
  compatibility: Puzzle,
  quality: Sparkles,
};

const SkillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getSkill, incrementDownloads } = useSkills();
  const skill = getSkill(id!);

  if (!skill) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Skill not found.</p>
        <Link to="/marketplace" className="text-primary underline mt-2 inline-block">Back to marketplace</Link>
      </div>
    );
  }

  const handleInstall = () => {
    incrementDownloads(skill.id);
    const blob = new Blob([skill.markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skill.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`"${skill.title}" downloaded successfully.`);
  };

  const evalItems = EVALUATION_KEYS.map((key) => ({
    key,
    label: EVALUATION_LABELS[key],
    val: skill.evaluationScores[key],
    icon: EVAL_ICONS[key],
  }));

  const overallScore = Math.round(
    evalItems.reduce((sum, item) => sum + getScore(item.val), 0) / evalItems.length
  );
  const overallColor = overallScore >= 90 ? "text-emerald-600" : overallScore >= 70 ? "text-amber-600" : "text-red-600";

  return (
    <div>
      <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
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
                <Link key={tag} to={`/marketplace?search=${encodeURIComponent(tag)}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">{tag}</Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Score Breakdown */}
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
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </span>
                      <span className={`font-semibold ${color}`}>{score}/100</span>
                    </div>
                    <Progress value={score} className="h-2" indicatorClassName={score >= 90 ? "bg-emerald-500" : score >= 70 ? "bg-amber-500" : "bg-red-500"} />
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
              <CardTitle className="text-lg">Skill Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{skill.markdownContent}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {skill.bashScript && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bash Script</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                  {skill.bashScript}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="hidden lg:block h-[4.5rem]" />
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
