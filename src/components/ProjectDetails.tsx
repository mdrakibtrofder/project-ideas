import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Users, Building2, ShieldCheck, ListChecks, Sparkles, Heart, Coins, Leaf, Cpu, Calendar, Tag,
} from "lucide-react";
import type { Project } from "@/data/projects";

const trackStyle: Record<string, string> = {
  business: "bg-blue-100 text-blue-800 border-blue-200",
  enterprise: "bg-indigo-100 text-indigo-800 border-indigo-200",
  engineering: "bg-sky-100 text-sky-800 border-sky-200",
};

const impactIcons = {
  social: Heart,
  economic: Coins,
  environmental: Leaf,
  technological: Cpu,
} as const;

export function ProjectDetails({ project }: { project: Project & { dateAdded: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "var(--gradient-brand)" }}>
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge className="bg-white/20 text-white border-white/30 capitalize">{project.track}</Badge>
          <Badge className="bg-white/20 text-white border-white/30 capitalize">{project.primaryCategory}</Badge>
          {project.secondaryCategories?.map((s) => (
            <Badge key={s} className="bg-white/10 text-white border-white/20 capitalize">{s}</Badge>
          ))}
        </div>
        <p className="mt-4 text-white/90 leading-relaxed text-[15px]">{project.shortDescription}</p>
        <div className="mt-3 text-[11px] text-white/70 flex items-center gap-1">
          <Calendar className="h-3 w-3" /> Added {project.dateAdded}
        </div>
      </div>

      {/* Features */}
      <section className="card-surface rounded-2xl p-5 border border-border/60">
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-4">
          <Sparkles className="h-4 w-4 text-primary" /> Differentiating Features
          <Badge variant="secondary" className="ml-auto">{project.features.length}</Badge>
        </h3>
        <ol className="space-y-2">
          {project.features.map((f, i) => (
            <li
              key={i}
              className="flex gap-3 p-3 rounded-lg bg-secondary/40 border border-border/40 hover:bg-secondary transition-colors animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
            >
              <span className="flex-none h-7 w-7 rounded-md grid place-items-center text-xs font-bold text-primary-foreground" style={{ background: "var(--gradient-brand)" }}>
                {i + 1}
              </span>
              <span className="text-sm leading-snug">{f}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Requirements */}
      <section>
        <Accordion type="multiple" defaultValue={["stakeholders", "endUsers"]} className="space-y-2">
          <ReqItem id="stakeholders" icon={<Building2 className="h-4 w-4" />} title="Stakeholders" items={project.requirements?.stakeholders} />
          <ReqItem id="endUsers" icon={<Users className="h-4 w-4" />} title="End Users" items={project.requirements?.endUsers} />
          <ReqItem id="operational" icon={<ListChecks className="h-4 w-4" />} title="Operational Requirements" items={project.requirements?.operational} />
          <ReqItem id="regulatory" icon={<ShieldCheck className="h-4 w-4" />} title="Regulatory Requirements" items={project.requirements?.regulatory} />
        </Accordion>
      </section>

      {/* Impact */}
      <section>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" /> Impact
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {(["social", "economic", "environmental", "technological"] as const).map((k) => {
            const Icon = impactIcons[k];
            const text = project.impact?.[k];
            if (!text) return null;
            return (
              <div key={k} className="card-surface rounded-xl p-4 border border-border/60 hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-2 text-xs font-semibold capitalize text-foreground/80 mb-1.5">
                  <Icon className="h-4 w-4 text-primary" /> {k}
                </div>
                <div className="text-sm text-muted-foreground leading-snug">{text}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tags footer */}
      {project.secondaryCategories?.length ? (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60">
          <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
            <Tag className="h-3 w-3" /> Tags:
          </span>
          {[project.primaryCategory, ...project.secondaryCategories].map((t) => (
            <Badge key={t} variant="outline" className="capitalize text-[10px]">{t}</Badge>
          ))}
          <Badge variant="outline" className={`${trackStyle[project.track] ?? ""} capitalize text-[10px]`}>{project.track}</Badge>
        </div>
      ) : null}
    </div>
  );
}

function ReqItem({ id, icon, title, items }: { id: string; icon: React.ReactNode; title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <AccordionItem value={id} className="card-surface rounded-xl border border-border/60 px-4">
      <AccordionTrigger className="hover:no-underline">
        <span className="flex items-center gap-2 text-sm font-semibold">
          {icon} {title}
          <Badge variant="secondary" className="ml-2">{items.length}</Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <ul className="grid sm:grid-cols-2 gap-1.5 pt-1">
          {items.map((it, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2 leading-snug">
              <span className="text-primary mt-1">•</span> {it}
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
