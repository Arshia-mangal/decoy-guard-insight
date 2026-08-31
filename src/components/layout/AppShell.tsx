import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  FileText,
  Fingerprint,
  LayoutDashboard,
  Menu,
  PlayCircle,
  Radar,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LiveDot } from "@/components/kit/Badges";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/incidents", label: "Incidents", icon: ShieldAlert },
  { to: "/sessions", label: "Attack Sessions", icon: Radar },
  { to: "/decoys", label: "Decoy Assets", icon: Boxes },
  { to: "/evidence", label: "Evidence", icon: Fingerprint },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/replay", label: "Attack Replay", icon: PlayCircle },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="min-h-screen w-full bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <span className="grid size-9 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary">
            <Radar className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[0.18em]">CHAKRAVYUH</p>
            <p className="truncate text-[11px] text-muted-foreground">Deception Intelligence</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive(item.to)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <item.icon className={cn("size-4", isActive(item.to) && "text-primary")} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <LiveDot />
          <p className="mt-3 text-[11px] text-muted-foreground">
            Mock telemetry · v0.9.4
          </p>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="lg:pl-[248px]">
        <header className="glass sticky top-0 z-30 flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-semibold tracking-[0.18em]">CHAKRAVYUH</span>
          <LiveDot className="ml-auto" label="LIVE" />
        </header>
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
