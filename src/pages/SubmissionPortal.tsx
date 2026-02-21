import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkills } from "@/lib/skills-store";
import { CATEGORIES } from "@/lib/mock-data";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Upload, FileText, Loader2 } from "lucide-react";

const SubmissionPortal = () => {
  const { addSkill } = useSkills();

  // Template form state
  const [tTitle, setTTitle] = useState("");
  const [tGoal, setTGoal] = useState("");
  const [tWhenToUse, setTWhenToUse] = useState("");
  const [tInput, setTInput] = useState("");
  const [tOutput, setTOutput] = useState("");
  const [tProcedure, setTProcedure] = useState("");
  const [tVerification, setTVerification] = useState("");
  const [tVersion, setTVersion] = useState("1.0.0");
  const [tAuthor, setTAuthor] = useState("");
  const [tCategory, setTCategory] = useState("");
  const [tTags, setTTags] = useState("");
  const [tDescription, setTDescription] = useState("");

  // Raw upload state
  const [rawContent, setRawContent] = useState("");
  const [rawName, setRawName] = useState("");
  const [rawVersion, setRawVersion] = useState("1.0.0");
  const [rawAuthor, setRawAuthor] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [rawCategory, setRawCategory] = useState("");
  const [rawTags, setRawTags] = useState("");
  const [clawhubUrl, setClawhubUrl] = useState("");

  const generatedMarkdown = useMemo(() => {
    const parts: string[] = [];
    if (tTitle) parts.push(`# ${tTitle}`);
    if (tGoal) parts.push(`\n## Goal\n${tGoal}`);
    if (tWhenToUse) parts.push(`\n## When to Use\n${tWhenToUse}`);
    if (tInput || tOutput) {
      let section = "\n## Input / Output";
      if (tInput) section += `\n**Input:** ${tInput}`;
      if (tOutput) section += `\n**Output:** ${tOutput}`;
      parts.push(section);
    }
    if (tProcedure) parts.push(`\n## Procedure\n${tProcedure}`);
    if (tVerification) parts.push(`\n## Verification\n${tVerification}`);
    return parts.join("\n");
  }, [tTitle, tGoal, tWhenToUse, tInput, tOutput, tProcedure, tVerification]);

  const handleTemplateSubmit = () => {
    if (!tTitle || !tGoal || !tAuthor || !tCategory) {
      toast.error("Please fill in all required fields.");
      return;
    }
    addSkill({
      title: tTitle,
      author: tAuthor,
      version: tVersion,
      description: tDescription || tGoal,
      tags: tTags.split(",").map((t) => t.trim()).filter(Boolean),
      category: tCategory,
      markdownContent: generatedMarkdown,
      evaluationScores: { security: 0, compatibility: 0, quality: 0 },
      submissionMethod: "template",
    });
    toast.success("Skill submitted for review!");
    setTTitle(""); setTGoal(""); setTWhenToUse(""); setTInput(""); setTOutput("");
    setTProcedure(""); setTVerification(""); setTVersion("1.0.0"); setTAuthor("");
    setTCategory(""); setTTags(""); setTDescription("");
  };

  const handleRawSubmit = () => {
    if (!rawName || !rawContent || !rawAuthor || !rawCategory) {
      toast.error("Please fill in all required fields.");
      return;
    }
    addSkill({
      title: rawName,
      author: rawAuthor,
      version: rawVersion,
      description: rawDescription,
      tags: rawTags.split(",").map((t) => t.trim()).filter(Boolean),
      category: rawCategory,
      markdownContent: rawContent,
      evaluationScores: { security: 0, compatibility: 0, quality: 0 },
      submissionMethod: "upload",
    });
    toast.success("Skill submitted for review!");
    setRawContent(""); setRawName(""); setRawVersion("1.0.0"); setRawAuthor("");
    setRawDescription(""); setRawCategory(""); setRawTags(""); setClawhubUrl("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawContent(ev.target?.result as string);
      if (!rawName) setRawName(file.name.replace(/\.md$/i, ""));
    };
    reader.readAsText(file);
  };

  const [isImporting, setIsImporting] = useState(false);

  const handleClawhubImport = async () => {
    if (!clawhubUrl.trim()) return;
    setIsImporting(true);

    try {
      // Convert GitHub URLs to raw content URLs
      let fetchUrl = clawhubUrl.trim();
      const ghMatch = fetchUrl.match(
        /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/
      );
      if (ghMatch) {
        fetchUrl = `https://raw.githubusercontent.com/${ghMatch[1]}/${ghMatch[2]}/${ghMatch[3]}`;
      }
      // Also handle gist URLs
      const gistMatch = fetchUrl.match(
        /^https?:\/\/gist\.github\.com\/([^/]+)\/([a-f0-9]+)\/?$/
      );
      if (gistMatch) {
        fetchUrl = `https://gist.githubusercontent.com/${gistMatch[1]}/${gistMatch[2]}/raw`;
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch (${response.status})`);
      }
      const text = await response.text();
      setRawContent(text);

      // Try to extract title from markdown heading
      const titleMatch = text.match(/^#\s+(.+)$/m);
      if (titleMatch && !rawName) {
        setRawName(titleMatch[1].trim());
      }

      toast.success("Skill imported successfully!");
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        "Failed to import. Make sure the URL points to a publicly accessible raw markdown file or a GitHub file URL."
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Submit a Skill</h1>
        <p className="text-muted-foreground mt-1">
          Submit a new agent skill for review. Use the template form for a consistent format.
        </p>
      </div>

      <Tabs defaultValue="upload">
        <TabsList className="mb-6">
          <TabsTrigger value="template" className="gap-1.5">
            <FileText className="h-4 w-4" /> Template Form
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-1.5">
            <Upload className="h-4 w-4" /> Raw Upload
          </TabsTrigger>
        </TabsList>

        {/* Template Form Tab */}
        <TabsContent value="template">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={tTitle} onChange={(e) => setTTitle(e.target.value)} placeholder="e.g. Code Review Assistant" />
              </div>
              <div className="space-y-2">
                <Label>Goal *</Label>
                <Textarea value={tGoal} onChange={(e) => setTGoal(e.target.value)} placeholder="What does this skill accomplish?" rows={2} />
              </div>
              <div className="space-y-2">
                <Label>When to Use</Label>
                <Textarea value={tWhenToUse} onChange={(e) => setTWhenToUse(e.target.value)} placeholder="Conditions or triggers..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Input</Label>
                  <Textarea value={tInput} onChange={(e) => setTInput(e.target.value)} placeholder="What it expects..." rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Output</Label>
                  <Textarea value={tOutput} onChange={(e) => setTOutput(e.target.value)} placeholder="What it produces..." rows={2} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Procedure</Label>
                <Textarea value={tProcedure} onChange={(e) => setTProcedure(e.target.value)} placeholder="Step-by-step instructions..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Verification</Label>
                <Textarea value={tVerification} onChange={(e) => setTVerification(e.target.value)} placeholder="How to confirm it worked..." rows={2} />
              </div>

              <hr className="my-2" />
              <p className="text-sm font-medium text-muted-foreground">Metadata</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author *</Label>
                  <Input value={tAuthor} onChange={(e) => setTAuthor(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input value={tVersion} onChange={(e) => setTVersion(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input value={tDescription} onChange={(e) => setTDescription(e.target.value)} placeholder="One-line description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={tCategory} onValueChange={setTCategory}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input value={tTags} onChange={(e) => setTTags(e.target.value)} placeholder="comma, separated" />
                </div>
              </div>
              <Button onClick={handleTemplateSubmit} className="w-full">Submit for Review</Button>
            </div>

            {/* Live Preview */}
            <Card className="h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Live Markdown Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedMarkdown ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{generatedMarkdown}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Start filling in the form to see the preview...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Raw Upload Tab */}
        <TabsContent value="upload">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload SKILL.md</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag & drop or click to upload</p>
                  <input type="file" accept=".md,.txt" onChange={handleFileUpload} className="mx-auto block text-sm" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <hr className="flex-1" /> or import from ClawHub <hr className="flex-1" />
              </div>

              <div className="flex gap-2">
                <Input value={clawhubUrl} onChange={(e) => setClawhubUrl(e.target.value)} placeholder="GitHub URL or raw markdown URL" />
                <Button variant="outline" onClick={handleClawhubImport} disabled={isImporting}>
                  {isImporting ? <><Loader2 className="h-4 w-4 animate-spin" /> Importing...</> : "Import"}
                </Button>
              </div>

              {rawContent && (
                <div className="space-y-2">
                  <Label>Markdown Content</Label>
                  <Textarea value={rawContent} onChange={(e) => setRawContent(e.target.value)} rows={8} className="font-mono text-xs" />
                </div>
              )}

              <hr className="my-2" />
              <p className="text-sm font-medium text-muted-foreground">Metadata</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={rawName} onChange={(e) => setRawName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input value={rawVersion} onChange={(e) => setRawVersion(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author *</Label>
                  <Input value={rawAuthor} onChange={(e) => setRawAuthor(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={rawCategory} onValueChange={setRawCategory}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={rawDescription} onChange={(e) => setRawDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input value={rawTags} onChange={(e) => setRawTags(e.target.value)} placeholder="comma, separated" />
              </div>
              <Button onClick={handleRawSubmit} className="w-full">Submit for Review</Button>
            </div>

            {/* Preview */}
            <Card className="h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Markdown Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {rawContent ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{rawContent}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Upload or paste markdown to see preview...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubmissionPortal;
