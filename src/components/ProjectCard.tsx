import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Layers, Users, Building2, Sparkles } from "lucide-react";
import type { Project } from "@/data/projects";

interface Props {
  project: Project & { dateAdded: string };
  variant?: "card" | "compact" | "bento";
  onClick?: () => void;
}

const trackColor: Record<string, string> = {
  business: "bg-blue-100 text-blue-800 border-blue-200",
  enterprise: "bg-indigo-100 text-indigo-800 border-indigo-200",
  engineering: "bg-sky-100 text-sky-800 border-sky-200",
};

export function ProjectCard({ project, variant = "card", onClick }: Props) {
  const compact = variant === "compact";
  const bento = variant === "bento";

  return (
    <Card
      onClick={onClick}
      className={`card-surface hover-lift cursor-pointer overflow-hidden border-border/60 ${
        bento ? "p-5 h-full" : "p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className={`font-semibold tracking-tight ${bento ? "text-xl" : "text-lg"} gradient-text`}>
            {project.name}
          </h3>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge variant="outline" className={trackColor[project.track] ?? ""}>
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

      <p className={`text-sm text-muted-foreground ${compact ? "line-clamp-3" : ""}`}>
        {project.shortDescription}
      </p>

      {!compact && (
        <>
          <div className="mt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Features
            </div>
            <ol className="space-y-1.5 list-decimal list-inside text-sm text-foreground/85">
              {project.features.map((f, i) => (
                <li key={i} className="leading-snug">{f}</li>
              ))}
            </ol>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <Section icon={<Users className="h-3.5 w-3.5" />} title="Stakeholders" items={project.requirements?.stakeholders} />
            <Section icon={<Users className="h-3.5 w-3.5" />} title="End Users" items={project.requirements?.endUsers} />
            <Section icon={<Building2 className="h-3.5 w-3.5" />} title="Operational" items={project.requirements?.operational} />
            <Section icon={<Building2 className="h-3.5 w-3.5" />} title="Regulatory" items={project.requirements?.regulatory} />
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 mb-2">
              <Layers className="h-3.5 w-3.5 text-primary" /> Impact
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              {(["social", "economic", "environmental", "technological"] as const).map((k) =>
                project.impact?.[k] ? (
                  <div key={k} className="rounded-md border border-border/60 bg-secondary/40 p-2">
                    <div className="font-medium capitalize text-foreground/80">{k}</div>
                    <div className="text-muted-foreground">{project.impact[k]}</div>
                  </div>
                ) : null,
              )}
            </div>
          </div>

          {project.secondaryCategories?.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.secondaryCategories.map((s) => (
                <Badge key={s} variant="outline" className="capitalize text-[10px]">{s}</Badge>
              ))}
            </div>
          ) : null}
        </>
      )}
    </Card>
  );
}

function Section({ icon, title, items }: { icon: React.ReactNode; title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 mb-1">
        {icon} {title}
      </div>
      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
        {items.map((it, i) => (<li key={i}>{it}</li>))}
      </ul>
    </div>
  );
}
