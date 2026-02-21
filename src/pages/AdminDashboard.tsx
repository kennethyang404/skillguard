import { useState, useMemo } from "react";
import { getScore, getExplanation, EVALUATION_KEYS, EVALUATION_LABELS } from "@/lib/types";
import { useSkills } from "@/lib/skills-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skill, SkillStatus } from "@/lib/types";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Target, BookOpen, Package, Check, X, KeyRound, Lock } from "lucide-react";
import { getSeverityColor, getSeverityLabel } from "@/lib/types";
import { EvaluationPipeline } from "@/components/EvaluationPipeline";

const statusColors: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const EVAL_ICONS: Record<string, React.ElementType> = {
  purposeCapability: Target,
  instructionScope: BookOpen,
  installMechanism: Package,
  credentials: KeyRound,
  persistencePrivilege: Lock,
};

const AdminDashboard = () => {
  const { skills, updateSkillStatus } = useSkills();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return skills;
    return skills.filter((s) => s.status === statusFilter);
  }, [skills, statusFilter]);

  const handleApprove = (skill: Skill) => {
    updateSkillStatus(skill.id, "approved", adminNotes || undefined);
    toast.success(`"${skill.title}" approved.`);
    setSelectedSkill(null);
    setAdminNotes("");
  };

  const handleReject = (skill: Skill) => {
    updateSkillStatus(skill.id, "rejected", adminNotes || undefined);
    toast.error(`"${skill.title}" rejected.`);
    setSelectedSkill(null);
    setAdminNotes("");
  };

  const counts = useMemo(() => ({
    all: skills.length,
    pending: skills.filter((s) => s.status === "pending").length,
    approved: skills.filter((s) => s.status === "approved").length,
    rejected: skills.filter((s) => s.status === "rejected").length,
  }), [skills]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Review Dashboard</h1>
        <p className="text-muted-foreground mt-1">Review and manage submitted skills.</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map((s) => (
          <Card
            key={s}
            className={`cursor-pointer transition-shadow hover:shadow-md ${statusFilter === s ? "ring-2 ring-primary" : ""}`}
            onClick={() => setStatusFilter(s)}
          >
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground capitalize">{s}</p>
              <p className="text-2xl font-bold">{counts[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((skill) => (
              <TableRow key={skill.id} className="cursor-pointer" onClick={() => { setSelectedSkill(skill); setAdminNotes(skill.adminNotes || ""); }}>
                <TableCell className="font-medium">{skill.title}</TableCell>
                <TableCell>{skill.author}</TableCell>
                <TableCell>{skill.category}</TableCell>
                <TableCell className="capitalize">{skill.submissionMethod}</TableCell>
                <TableCell>
                  <Badge className={statusColors[skill.status]}>{skill.status}</Badge>
                </TableCell>
                <TableCell>{new Date(skill.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {skill.status === "pending" && (
                    <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" className="h-7 text-emerald-600 hover:text-emerald-700" onClick={() => { updateSkillStatus(skill.id, "approved"); toast.success("Approved"); }}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-red-600 hover:text-red-700" onClick={() => { updateSkillStatus(skill.id, "rejected"); toast.error("Rejected"); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSkill} onOpenChange={(open) => { if (!open) setSelectedSkill(null); }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedSkill && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedSkill.title}
                  <Badge className={statusColors[selectedSkill.status]}>{selectedSkill.status}</Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Author:</span> {selectedSkill.author}</div>
                  <div><span className="text-muted-foreground">Version:</span> v{selectedSkill.version}</div>
                  <div><span className="text-muted-foreground">Category:</span> {selectedSkill.category}</div>
                </div>

                {/* Evaluation Pipeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Evaluation Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EvaluationPipeline scores={selectedSkill.evaluationScores} status={selectedSkill.status} variant="full" />
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Score Breakdown</CardTitle>
                      {(() => {
                        const scores = EVALUATION_KEYS.map((k) => getScore(selectedSkill.evaluationScores[k]));
                        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                        const c = avg > 0 ? getSeverityColor(avg) : "text-muted-foreground";
                        return <span className={`text-sm font-bold ${c}`}>{avg > 0 ? `Avg: ${avg}/100` : "Pending"}</span>;
                      })()}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedSkill.evaluationScores.summary && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        {selectedSkill.evaluationScores.summary}
                      </p>
                    )}
                    {EVALUATION_KEYS.map((key) => {
                      const Icon = EVAL_ICONS[key];
                      const val = selectedSkill.evaluationScores[key];
                      const score = getScore(val);
                      const explanation = getExplanation(val);
                      const color = score > 0 ? getSeverityColor(score) : "text-muted-foreground";
                      return (
                        <div key={key} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-1.5"><Icon className="h-4 w-4 text-muted-foreground" />{EVALUATION_LABELS[key]}</span>
                            <span className={`font-semibold ${color}`}>{score > 0 ? `${score}/100 · ${getSeverityLabel(score)}` : "Pending"}</span>
                          </div>
                          <Progress value={score} className="h-2" />
                          {explanation && (
                            <p className="text-xs text-muted-foreground leading-relaxed pl-5">{explanation}</p>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-sm">SKILL.md Preview</CardTitle></CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{selectedSkill.markdownContent}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                {selectedSkill.bashScript && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm">Bash Script</CardTitle></CardHeader>
                    <CardContent>
                      <pre className="bg-muted rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {selectedSkill.bashScript}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Optional notes..." rows={2} />
                </div>

                {selectedSkill.status === "pending" && (
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => handleApprove(selectedSkill)}>
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedSkill)}>
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
