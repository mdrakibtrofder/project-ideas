import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="h-9 w-9 rounded-xl grid place-items-center text-primary-foreground shadow-md"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold gradient-text">Project Ideas Hub</span>
            <span className="text-[11px] text-muted-foreground">For learners, teachers & builders</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#explore" className="text-muted-foreground hover:text-foreground transition-colors">Explore</a>
        </nav>
      </div>
    </header>
  );
}
