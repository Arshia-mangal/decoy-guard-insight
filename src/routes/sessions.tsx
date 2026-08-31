import { createFileRoute, Link } from "@tanstack/react-router";
import { Radar, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SeverityBadge } from "@/components/kit/Badges";
import { Panel } from "@/components/kit/Panel";
import { EmptyState, PageHeader, TableSkeleton } from "@/components/kit/States";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSessions } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { dateTimeOf, timeOf } from "@/lib/format";

export const Route = createFileRoute("/sessions")({
  head: () => ({
    meta: [
      { title: "Attack Sessions — CHAKRAVYUH" },
      {
        name: "description",
        content: "Correlated attacker sessions across decoy assets, with event counts, risk scoring and linked incidents.",
      },
      { property: "og:title", content: "Attack Sessions — CHAKRAVYUH" },
      { property: "og:description", content: "Correlated attacker sessions across your deception estate." },
    ],
  }),
  component: SessionsPage,
});

function SessionsPage() {
  const { data, isLoading } = useSessions();
  const [query, setQuery] = useState("");
  const [live, setLive] = useState(false);

  const rows = useMemo(() => {
    let list = data ?? [];
    if (live) list = list.filter((s) => s.status === "LIVE");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) => [s.id, s.org, s.sourceRegion].some((f) => f.toLowerCase().includes(q)));
    }
    return list;
  }, [data, query, live]);

  return (
    <div className="space-y-6">
      <PageHeader title="Attack Sessions" subtitle="Every interaction sequence correlated into a single actor session." />

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search session or organisation…" className="pl-9" />
          </div>
          <Button variant={live ? "default" : "outline"} size="sm" onClick={() => setLive(!live)}>
            Live only
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : rows.length === 0 ? (
          <EmptyState icon={Radar} title="No sessions" description="No correlated sessions match this filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Session", "Organisation", "Started", "Last seen", "Events", "Assets", "Risk", "Incident"].map((h) => (
                    <th key={h} className="label-xs px-5 py-3 text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-surface-2/60">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2 font-mono">
                        <span className={cn("size-1.5 rounded-full", s.status === "LIVE" ? "live-dot bg-verified" : "bg-muted-foreground/50")} />
                        {s.id}
                      </span>
                    </td>
                    <td className="px-5 py-3">{s.org}</td>
                    <td className="px-5 py-3 text-muted-foreground">{dateTimeOf(s.startedAt)}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{timeOf(s.lastSeenAt)}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">{s.eventCount}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">{s.assetsTouched}</td>
                    <td className="px-5 py-3"><SeverityBadge value={s.risk} /></td>
                    <td className="px-5 py-3">
                      {s.incidentId ? (
                        <Link
                          to="/incidents/$incidentId"
                          params={{ incidentId: s.incidentId }}
                          className="font-mono text-primary hover:underline"
                        >
                          {s.incidentId}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
