import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Sparkles, Tag } from "lucide-react";
import type { Project } from "@/data/projects";
import { gradientFor } from "@/lib/cardGradients";

interface Props {
  project: Project & { dateAdded: string };
  variant?: "card";
  onOpen: () => void;
}

const trackStyle: Record<string, string> = {
  business: "bg-blue-100 text-blue-800 border-blue-200",
  enterprise: "bg-indigo-100 text-indigo-800 border-indigo-200",
  engineering: "bg-sky-100 text-sky-800 border-sky-200",
};

export function ProjectCard({ project, onOpen }: Props) {
  const g = gradientFor(project.id ?? project.name);
  return (
    <Card
      onClick={onOpen}
      className="card-surface hover-lift cursor-pointer overflow-hidden p-5 h-full flex flex-col group relative border"
      style={{
        borderColor: "transparent",
        backgroundImage: `linear-gradient(var(--card),var(--card)), ${g.bar}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        boxShadow: `0 8px 30px -12px ${g.ring}`,
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: g.bar }} />
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3
            className="font-semibold tracking-tight text-lg"
            style={{
              backgroundImage: g.text,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {project.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge variant="outline" className={trackStyle[project.track] ?? ""}>
              {project.track}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {project.primaryCategory}
            </Badge>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {project.dateAdded}
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3">
        {project.shortDescription}
      </p>

      {project.secondaryCategories?.length ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {project.secondaryCategories.slice(0, 4).map((s) => (
            <span key={s} className="text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
              <Tag className="h-2.5 w-2.5" />{s}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5" />
        {project.features?.length ?? 0} features · {(project.requirements?.stakeholders?.length ?? 0)} stakeholders
      </div>

      <div className="mt-auto pt-4">
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-between transition-colors"
          style={{ color: "white", backgroundImage: g.bar }}
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
        >
          View details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
}
