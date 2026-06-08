import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  PROJECTS,
  PRIMARY_CATEGORIES,
  TRACKS,
  COURSE_CATEGORIES,
  projectsForCourse,
  type Project,
} from "@/data/projects";
import { RotatingBackdrop } from "@/components/RotatingBackdrop";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Search, X, LayoutGrid, List as ListIcon, Table2, Tag, GraduationCap, Rows3,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Ideas Hub — 200+ Real-World Project Briefs for Learners & Teachers" },
      { name: "description", content: "Browse a curated hub of full-spec project ideas spanning AI, web, mobile, security, databases, networking, and engineering — built for teachers, students and developers." },
      { property: "og:title", content: "Project Ideas Hub" },
      { property: "og:description", content: "A searchable hub of full-spec project briefs across every major CS course." },
    ],
  }),
  component: Index,
});

type ViewMode = "list" | "table" | "bento" | "carousel" | "tags" | "courses";

const PAGE_SIZES = [6, 12, 24, 48, 96];

function Index() {
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [track, setTrack] = useState<string>("all");
  const [view, setView] = useState<ViewMode>("bento");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [open, setOpen] = useState<(Project & { dateAdded: string }) | null>(null);
  const [activeCourse, setActiveCourse] = useState<string>(COURSE_CATEGORIES[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      if (track !== "all" && p.track !== track) return false;
      if (selectedCats.length) {
        const all = [p.primaryCategory, ...(p.secondaryCategories ?? [])];
        if (!selectedCats.some((c) => all.includes(c))) return false;
      }
      if (!q) return true;
      const blob = [
        p.name, p.shortDescription, p.primaryCategory,
        ...(p.secondaryCategories ?? []),
        ...(p.features ?? []),
      ].join(" ").toLowerCase();
      return blob.includes(q);
    });
  }, [query, selectedCats, track]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleCat = (c: string) => {
    setPage(1);
    setSelectedCats((cur) => cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]);
  };

  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    PROJECTS.forEach((p) => {
      [p.primaryCategory, ...(p.secondaryCategories ?? [])].forEach((t) => {
        m.set(t, (m.get(t) ?? 0) + 1);
      });
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="min-h-screen relative">
      <RotatingBackdrop />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-hero opacity-90" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,oklch(1_0_0/0.35),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center text-white">
          <Badge className="bg-white/15 text-white border-white/30 backdrop-blur mb-4">
            {PROJECTS.length} curated project briefs
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Build something <span className="italic">real</span>.
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-white/85 text-lg">
            A hub of fully-specified, course-aligned project ideas — with stakeholders, features, impact and requirements — for teachers, students, learners and developers.
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white/95 text-foreground rounded-2xl shadow-2xl p-2">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by name, feature, stakeholder, category…"
                className="border-0 focus-visible:ring-0 shadow-none text-base h-11 bg-transparent"
              />
              {query && (
                <Button size="icon" variant="ghost" onClick={() => setQuery("")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main id="explore" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Filter bar */}
        <div className="card-surface rounded-2xl p-4 md:p-5 border border-border/60">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Track</span>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", ...TRACKS] as const).map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={track === t ? "default" : "outline"}
                  onClick={() => { setTrack(t); setPage(1); }}
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Page size</span>
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[90px] h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((s) => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PRIMARY_CATEGORIES.map((c) => {
                const active = selectedCats.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleCat(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                      active
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background hover:bg-accent border-border text-foreground/80"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
              {selectedCats.length > 0 && (
                <button
                  onClick={() => setSelectedCats([])}
                  className="text-xs px-3 py-1.5 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  Clear ({selectedCats.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* View tabs */}
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList className="bg-secondary/70 backdrop-blur">
              <TabsTrigger value="bento"><LayoutGrid className="h-4 w-4 mr-1.5" />Bento</TabsTrigger>
              <TabsTrigger value="list"><ListIcon className="h-4 w-4 mr-1.5" />List</TabsTrigger>
              <TabsTrigger value="table"><Table2 className="h-4 w-4 mr-1.5" />Table</TabsTrigger>
              <TabsTrigger value="carousel"><Rows3 className="h-4 w-4 mr-1.5" />Carousel</TabsTrigger>
              <TabsTrigger value="tags"><Tag className="h-4 w-4 mr-1.5" />Tag Cloud</TabsTrigger>
              <TabsTrigger value="courses"><GraduationCap className="h-4 w-4 mr-1.5" />By Course</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">
              {filtered.length} of {PROJECTS.length} projects
            </div>
          </div>

          {/* BENTO */}
          <TabsContent value="bento" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-fr">
              {slice.map((p, i) => (
                <div key={p.id} className={i % 7 === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
                  <ProjectCard project={p} variant="bento" onClick={() => setOpen(p)} />
                </div>
              ))}
            </div>
            <Pager page={safePage} totalPages={totalPages} setPage={setPage} />
          </TabsContent>

          {/* LIST */}
          <TabsContent value="list" className="mt-6">
            <div className="grid gap-4">
              {slice.map((p) => (
                <ProjectCard key={p.id} project={p} onClick={() => setOpen(p)} />
              ))}
            </div>
            <Pager page={safePage} totalPages={totalPages} setPage={setPage} />
          </TabsContent>

          {/* TABLE */}
          <TabsContent value="table" className="mt-6">
            <div className="card-surface rounded-xl overflow-hidden border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Track</TableHead>
                    <TableHead>Primary Category</TableHead>
                    <TableHead>Secondary</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slice.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-accent/40" onClick={() => setOpen(p)}>
                      <TableCell>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2 max-w-md">{p.shortDescription}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{p.track}</Badge></TableCell>
                      <TableCell className="capitalize">{p.primaryCategory}</TableCell>
                      <TableCell className="text-xs">{(p.secondaryCategories ?? []).join(", ")}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{p.dateAdded}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pager page={safePage} totalPages={totalPages} setPage={setPage} />
          </TabsContent>

          {/* CAROUSEL */}
          <TabsContent value="carousel" className="mt-6">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {filtered.map((p) => (
                  <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/3">
                    <ProjectCard project={p} variant="compact" onClick={() => setOpen(p)} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>

          {/* TAG CLOUD */}
          <TabsContent value="tags" id="tags" className="mt-6">
            <div className="card-surface rounded-2xl p-6 border border-border/60">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Searchable tag cloud — click to filter</h3>
              <div className="flex flex-wrap gap-2">
                {tagCounts
                  .filter(([t]) => !query || t.toLowerCase().includes(query.toLowerCase()))
                  .map(([t, n]) => {
                    const size = Math.min(2.4, 0.85 + n * 0.04);
                    const active = selectedCats.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleCat(t)}
                        className={`px-3 py-1.5 rounded-full border transition-all capitalize ${
                          active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent border-border"
                        }`}
                        style={{ fontSize: `${size * 0.7}rem` }}
                      >
                        {t} <span className="opacity-60">·{n}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {slice.map((p) => <ProjectCard key={p.id} project={p} variant="compact" onClick={() => setOpen(p)} />)}
            </div>
            <Pager page={safePage} totalPages={totalPages} setPage={setPage} />
          </TabsContent>

          {/* COURSES */}
          <TabsContent value="courses" id="courses" className="mt-6">
            <div className="flex flex-wrap gap-2 mb-5">
              {COURSE_CATEGORIES.map((c) => (
                <Button
                  key={c.id}
                  variant={activeCourse === c.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCourse(c.id)}
                >
                  {c.label}
                </Button>
              ))}
            </div>
            <CourseGrid courseId={activeCourse} onOpen={setOpen} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/60 mt-16 py-8 text-center text-xs text-muted-foreground">
        Project Ideas Hub · A curated catalog for builders & educators
      </footer>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text">{open.name}</DialogTitle>
              </DialogHeader>
              <ProjectCard project={open} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CourseGrid({ courseId, onOpen }: { courseId: string; onOpen: (p: Project & { dateAdded: string }) => void }) {
  const list = useMemo(() => projectsForCourse(courseId) as (Project & { dateAdded: string })[], [courseId]);
  if (!list.length) {
    return <div className="text-sm text-muted-foreground p-6 text-center">No projects matched this course yet.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {list.slice(0, 24).map((p) => <ProjectCard key={p.id} project={p} variant="compact" onClick={() => onOpen(p)} />)}
    </div>
  );
}

function Pager({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (n: number) => void }) {
  if (totalPages <= 1) return null;
  const around = 1;
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= around) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <div className="mt-8 flex items-center justify-center gap-1.5 flex-wrap">
      <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={i} className="px-2 text-muted-foreground">…</span>
        ) : (
          <Button key={i} size="sm" variant={p === page ? "default" : "outline"} onClick={() => setPage(p)}>
            {p}
          </Button>
        ),
      )}
      <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
    </div>
  );
}
