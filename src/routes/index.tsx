import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  PROJECTS,
  PRIMARY_CATEGORIES,
  SECONDARY_CATEGORIES,
  TRACKS,
  type Project,
} from "@/data/projects";
import { RotatingBackdrop } from "@/components/RotatingBackdrop";
import { SiteHeader } from "@/components/SiteHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDetails } from "@/components/ProjectDetails";
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
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search, X, LayoutGrid, Table2, Rows3, SlidersHorizontal, ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Project Ideas Hub — 313 Real-World Project Briefs" },
      { name: "description", content: "Searchable hub of fully-specified project ideas across AI, web, mobile, security, databases and more — for teachers, students and builders." },
      { property: "og:title", content: "Project Ideas Hub" },
      { property: "og:description", content: "Browse 313 curated, course-aligned project briefs." },
    ],
  }),
  component: Index,
});

type ViewMode = "card" | "table" | "bento";
const PAGE_SIZES = [12, 24, 48, 96];

type DetailItem = Project & { dateAdded: string };

function Index() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [track, setTrack] = useState<string>("all");
  const [view, setView] = useState<ViewMode>("card");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [open, setOpen] = useState<DetailItem | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set([...PRIMARY_CATEGORIES, ...SECONDARY_CATEGORIES])).sort(),
    [],
  );

  // multi-token, multi-field search (space = AND, comma = OR within token)
  const tokens = useMemo(() => {
    return query
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => t.split(",").map((s) => s.trim()).filter(Boolean));
  }, [query]);

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (track !== "all" && p.track !== track) return false;
      if (selectedTags.length) {
        const tags = [p.primaryCategory, ...(p.secondaryCategories ?? [])];
        if (!selectedTags.every((t) => tags.includes(t))) return false;
      }
      if (!tokens.length) return true;
      const blob = [
        p.name, p.shortDescription, p.primaryCategory, p.track,
        ...(p.secondaryCategories ?? []),
        ...(p.features ?? []),
        ...(p.requirements?.stakeholders ?? []),
        ...(p.requirements?.endUsers ?? []),
        ...(p.requirements?.operational ?? []),
        ...(p.requirements?.regulatory ?? []),
        p.impact?.social ?? "", p.impact?.economic ?? "",
        p.impact?.environmental ?? "", p.impact?.technological ?? "",
      ].join(" ").toLowerCase();
      return tokens.every((alts) => alts.some((a) => blob.includes(a)));
    });
  }, [tokens, selectedTags, track]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleTag = (t: string) => {
    setPage(1);
    setSelectedTags((cur) => cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]);
  };
  const clearAll = () => { setQuery(""); setSelectedTags([]); setTrack("all"); setPage(1); };

  return (
    <div className="min-h-screen relative">
      <RotatingBackdrop />
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-hero opacity-90" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,oklch(1_0_0/0.35),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center text-white">
          <Badge className="bg-white/15 text-white border-white/30 backdrop-blur mb-4">
            {PROJECTS.length} curated project briefs
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Build something <span className="italic">real</span>.
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-white/85 text-lg">
            A searchable hub of fully-specified project ideas for teachers, students and developers.
          </p>
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white/95 text-foreground rounded-2xl shadow-2xl p-2">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by name, feature, stakeholder, impact… (space = AND, comma = OR)"
                className="border-0 focus-visible:ring-0 shadow-none text-base h-11 bg-transparent"
              />
              {query && (
                <Button size="icon" variant="ghost" onClick={() => setQuery("")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs">
              <span className="text-white/70">Try:</span>
              {["ai", "blockchain", "mobile, web", "supply chain", "farmer", "privacy"].map((s) => (
                <button key={s} onClick={() => { setQuery(s); setPage(1); }} className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main id="explore" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Filter bar */}
        <div className="card-surface rounded-2xl p-4 md:p-5 border border-border/60">
          <div className="flex flex-wrap items-center gap-3">
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

            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Tags {selectedTags.length > 0 && <Badge variant="secondary" className="ml-1">{selectedTags.length}</Badge>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] max-h-[420px] overflow-y-auto p-3">
                <div className="text-xs font-semibold mb-2 text-muted-foreground">Filter by tag (AND)</div>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((t) => {
                    const active = selectedTags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleTag(t)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all capitalize ${
                          active ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent border-border"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>

            {(selectedTags.length > 0 || query || track !== "all") && (
              <Button size="sm" variant="ghost" onClick={clearAll} className="text-destructive">
                <X className="h-3.5 w-3.5 mr-1" /> Clear all
              </Button>
            )}

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

          {selectedTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedTags.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className="text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground inline-flex items-center gap-1 capitalize"
                >
                  {t} <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View tabs */}
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList className="bg-secondary/70 backdrop-blur">
              <TabsTrigger value="card"><LayoutGrid className="h-4 w-4 mr-1.5" />Card</TabsTrigger>
              <TabsTrigger value="bento"><Rows3 className="h-4 w-4 mr-1.5" />Bento</TabsTrigger>
              <TabsTrigger value="table"><Table2 className="h-4 w-4 mr-1.5" />Table</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">
              {filtered.length} of {PROJECTS.length} projects
            </div>
          </div>

          {/* CARD (default) */}
          <TabsContent value="card" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {slice.map((p) => (
                <ProjectCard key={p.id} project={p} variant="card" onOpen={() => setOpen(p)} />
              ))}
            </div>
            <Pager page={safePage} totalPages={totalPages} setPage={setPage} />
          </TabsContent>

          {/* BENTO — name + short desc only */}
          <TabsContent value="bento" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
              {slice.map((p, i) => (
                <div key={p.id} className={i % 9 === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
                  <ProjectCard project={p} variant="bento" onOpen={() => setOpen(p)} />
                </div>
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
                    <TableHead>Primary</TableHead>
                    <TableHead className="hidden md:table-cell">Tags</TableHead>
                    <TableHead className="text-right">Details</TableHead>
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
                      <TableCell className="hidden md:table-cell text-xs capitalize text-muted-foreground">
                        {(p.secondaryCategories ?? []).join(", ")}
                      </TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="inline h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Pager page={safePage} totalPages={totalPages} setPage={setPage} />
          </TabsContent>
        </Tabs>

        {filtered.length === 0 && (
          <div className="card-surface rounded-2xl p-10 text-center border border-border/60">
            <div className="text-lg font-semibold mb-1">No projects match</div>
            <div className="text-sm text-muted-foreground">Try clearing filters or a different search term.</div>
            <Button className="mt-4" onClick={clearAll}>Clear filters</Button>
          </div>
        )}
      </main>

      <footer className="border-t border-border/60 mt-16 py-8 text-center text-xs text-muted-foreground">
        Project Ideas Hub · A curated catalog for builders & educators
      </footer>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{open?.name}</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {open && <ProjectDetails project={open} />}
          </div>
        </DialogContent>
      </Dialog>
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
