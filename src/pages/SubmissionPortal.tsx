import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSkills } from "@/lib/skills-store";
import { CATEGORIES } from "@/lib/mock-data";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import JSZip from "jszip";
import { Upload, FileText, Loader2, ChevronDown, Shield, Cpu, Puzzle, Sparkles, CheckCircle2, Scan } from "lucide-react";

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
      let fetchUrl = clawhubUrl.trim();

      // Detect ClawHub URL pattern: clawhub.ai/{user}/{skill}
      const clawhubMatch = fetchUrl.match(
        /^https?:\/\/clawhub\.ai\/([^/]+)\/([^/]+)\/?$/
      );

      if (clawhubMatch) {
        const slug = clawhubMatch[2];
        const CONVEX_API = "https://wry-manatee-359.convex.site/api/v1";

        // Helper: try direct fetch, then CORS proxy fallback
        const corsProxyFetch = async (url: string): Promise<Response> => {
          try {
            const direct = await fetch(url);
            if (direct.ok) return direct;
          } catch {
            // CORS blocked, try proxy
          }
          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
          return fetch(proxyUrl);
        };

        // Fetch skill metadata from ClawHub API
        const metaResponse = await corsProxyFetch(`${CONVEX_API}/skills/${slug}`);
        if (!metaResponse.ok) throw new Error("Skill not found on ClawHub.");
        const meta = await metaResponse.json();
        const { skill, owner, latestVersion } = meta;
        const version = latestVersion?.version || "1.0.0";

        // Download the zip and extract SKILL.md
        let skillContent = "";
        try {
          const downloadUrl = `${CONVEX_API}/download?slug=${slug}`;
          const zipResponse = await corsProxyFetch(downloadUrl);
          if (zipResponse.ok) {
            const zipBlob = await zipResponse.blob();
            const zip = await JSZip.loadAsync(zipBlob);

            // Look for SKILL.md in the zip
            const skillFile =
              zip.file("SKILL.md") ||
              zip.file(/SKILL\.md$/i)[0];

            if (skillFile) {
              skillContent = await skillFile.async("string");
            }
          }
        } catch (e) {
          console.warn("Zip download failed, using fallback:", e);
        }

        if (!skillContent) {
          // Fallback: construct from API metadata
          skillContent = `# ${skill.displayName}\n\n${skill.summary || ""}\n\n> Imported from ClawHub. Visit ${fetchUrl} for the full SKILL.md content.`;
        }

        setRawContent(skillContent);
        if (!rawName) setRawName(skill.displayName || slug);
        if (!rawDescription) setRawDescription(skill.summary || "");
        if (!rawAuthor) setRawAuthor(owner?.displayName || owner?.handle || "");
        setRawVersion(version);

        toast.success("Skill imported from ClawHub!");
        return;
      }

      // GitHub URL handling
      const ghMatch = fetchUrl.match(
        /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/
      );
      if (ghMatch) {
        fetchUrl = `https://raw.githubusercontent.com/${ghMatch[1]}/${ghMatch[2]}/${ghMatch[3]}`;
      }
      const gistMatch = fetchUrl.match(
        /^https?:\/\/gist\.github\.com\/([^/]+)\/([a-f0-9]+)\/?$/
      );
      if (gistMatch) {
        fetchUrl = `https://gist.githubusercontent.com/${gistMatch[1]}/${gistMatch[2]}/raw`;
      }

      // For non-ClawHub URLs, try direct fetch then proxy fallback
      let text = "";
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Direct fetch failed");
        text = await response.text();
      } catch {
        const proxyResponse = await fetch(
          `https://corsproxy.io/?${encodeURIComponent(fetchUrl)}`
        );
        if (!proxyResponse.ok) throw new Error(`Failed to fetch (${proxyResponse.status})`);
        text = await proxyResponse.text();
      }

      setRawContent(text);
      const titleMatch = text.match(/^#\s+(.+)$/m);
      if (titleMatch && !rawName) setRawName(titleMatch[1].trim());

      toast.success("Skill imported successfully!");
    } catch (error) {
      console.error("Import error:", error);
      toast.error(
        "Failed to import. Check the URL and try again. Supported: ClawHub URLs, GitHub file URLs, or raw markdown URLs."
      );
    } finally {
      setIsImporting(false);
    }
  };

  /** Convert a rendered HTML element back to approximate markdown */
  const htmlToMarkdown = (el: Element): string => {
    const lines: string[] = [];

    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (text.trim()) lines.push(text);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const tag = (node as Element).tagName.toLowerCase();

      switch (tag) {
        case "h1":
          lines.push(`\n# ${node.textContent?.trim()}`);
          break;
        case "h2":
          lines.push(`\n## ${node.textContent?.trim()}`);
          break;
        case "h3":
          lines.push(`\n### ${node.textContent?.trim()}`);
          break;
        case "p": {
          const parts: string[] = [];
          node.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              parts.push(child.textContent || "");
            } else if (
              child.nodeType === Node.ELEMENT_NODE &&
              (child as Element).tagName.toLowerCase() === "code"
            ) {
              parts.push(`\`${child.textContent}\``);
            } else if (
              child.nodeType === Node.ELEMENT_NODE &&
              (child as Element).tagName.toLowerCase() === "strong"
            ) {
              parts.push(`**${child.textContent}**`);
            } else {
              parts.push(child.textContent || "");
            }
          });
          lines.push(`\n${parts.join("")}`);
          break;
        }
        case "ul": {
          node.childNodes.forEach((li) => {
            if (
              li.nodeType === Node.ELEMENT_NODE &&
              (li as Element).tagName.toLowerCase() === "li"
            ) {
              const parts: string[] = [];
              li.childNodes.forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                  parts.push(child.textContent || "");
                } else if (
                  child.nodeType === Node.ELEMENT_NODE &&
                  (child as Element).tagName.toLowerCase() === "code"
                ) {
                  parts.push(`\`${child.textContent}\``);
                } else {
                  parts.push(child.textContent || "");
                }
              });
              lines.push(`- ${parts.join("").trim()}`);
            }
          });
          break;
        }
        case "ol": {
          let idx = 1;
          node.childNodes.forEach((li) => {
            if (
              li.nodeType === Node.ELEMENT_NODE &&
              (li as Element).tagName.toLowerCase() === "li"
            ) {
              lines.push(`${idx}. ${li.textContent?.trim()}`);
              idx++;
            }
          });
          break;
        }
        case "pre":
          lines.push(`\n\`\`\`\n${node.textContent?.trim()}\n\`\`\``);
          break;
        default:
          node.childNodes.forEach(walk);
      }
    };

    el.childNodes.forEach(walk);
    return lines
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  return (
    <div>
      {/* Evaluation Process Explainer */}
      <Collapsible className="mb-8">
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CollapsibleTrigger className="w-full text-left">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">How are submitted skills evaluated?</CardTitle>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Every submission undergoes a rigorous, multi-stage automated AI evaluation pipeline before human review.
              </p>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-6">
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                {[
                  {
                    icon: Shield,
                    title: "Security & Safety Analysis",
                    steps: [
                      "Injection vector scanning",
                      "Privilege escalation detection",
                      "Data exfiltration pattern matching",
                      "Sandbox escape analysis",
                      "Dependency vulnerability audit",
                    ],
                  },
                  {
                    icon: Puzzle,
                    title: "Enterprise Compatibility",
                    steps: [
                      "Schema conformance validation",
                      "API surface compatibility check",
                      "Version constraint resolution",
                      "Cross-platform runtime testing",
                      "Integration conflict detection",
                    ],
                  },
                  {
                    icon: Sparkles,
                    title: "Quality & Capability",
                    steps: [
                      "Instruction clarity scoring",
                      "Edge-case coverage analysis",
                      "Output consistency benchmarking",
                      "Performance profiling",
                      "Confidence interval computation",
                    ],
                  },
                ].map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.title} className="rounded-lg border bg-card p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">{category.title}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {category.steps.map((step) => (
                          <li key={step} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 mt-0.5 text-primary/50 shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-md bg-muted/50 p-3">
                <Scan className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Each category produces an independent score out of 100. Skills must pass all three evaluations
                  to be approved. The entire pipeline runs autonomously — admin reviewers see the full report
                  with detailed explanations and can override decisions when necessary.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

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
