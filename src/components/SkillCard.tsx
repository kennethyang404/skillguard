import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skill } from "@/lib/types";
import { useSkills } from "@/lib/skills-store";
import { Download, Star } from "lucide-react";
import { toast } from "sonner";
import { EvaluationPipeline } from "@/components/EvaluationPipeline";

export function SkillCard({ skill }: { skill: Skill }) {
  const { incrementDownloads } = useSkills();

  const handleInstall = (e: React.MouseEvent) => {
    e.preventDefault();
    incrementDownloads(skill.id);
    toast.success(`"${skill.title}" installed successfully.`);
  };

  return (
    <Link to={`/skill/${skill.id}`} className="block group">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
              {skill.title}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              v{skill.version}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">by {skill.author}</p>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{skill.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {skill.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          <EvaluationPipeline scores={skill.evaluationScores} status={skill.status} variant="compact" />
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-0">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {skill.downloads.toLocaleString()}
            </span>
            {skill.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {skill.rating.toFixed(1)}
              </span>
            )}
          </div>
          <Button size="sm" variant="default" onClick={handleInstall} className="h-7 text-xs">
            Install
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
