import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SeverityBadge } from "@/components/kit/Badges";
import { EventDetailSheet } from "@/components/kit/EventDetailSheet";
import { Panel } from "@/components/kit/Panel";
import { EmptyState, PageHeader, TableSkeleton } from "@/components/kit/States";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEvents } from "@/hooks/useApi";
import { timeOf } from "@/lib/format";
import type { DecoyEvent } from "@/types";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence — CHAKRAVYUH" },
      {
        name: "description",
        content: "Forensic-style log of verified decoy interaction events with capture method, session and asset context.",
      },
      { property: "og:title", content: "Evidence — CHAKRAVYUH" },
      { property: "og:description", content: "Forensic log of verified decoy interaction events." },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const { data, isLoading } = useEvents();
  const [query, setQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [selected, setSelected] = useState<DecoyEvent | null>(null);

  const sessions = useMemo(() => Array.from(new Set((data ?? []).map((e) => e.sessionId))), [data]);

  const rows = useMemo(() => {
    let list = data ?? [];
    if (sessionFilter !== "all") list = list.filter((e) => e.sessionId === sessionFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) => [e.id, e.assetName, e.action, e.details].some((f) => f.toLowerCase().includes(q)));
    }
    return list;
  }, [data, query, sessionFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence"
        subtitle="Immutable, synthetic event records — the factual basis for every incident and report."
      />

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search event ID, asset, action…" className="pl-9" />
          </div>
          <Select value={sessionFilter} onValueChange={setSessionFilter}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Session" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sessions</SelectItem>
              {sessions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : rows.length === 0 ? (
          <EmptyState icon={Fingerprint} title="No evidence records" description="No captured events match this filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Event ID", "Timestamp", "Session", "Asset", "Action", "Details", "Severity"].map((h) => (
                    <th key={h} className="label-xs px-5 py-3 text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
                  >
                    <td className="px-5 py-3 font-mono text-primary">{e.id}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{timeOf(e.timestamp)}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{e.sessionId}</td>
                    <td className="px-5 py-3">{e.assetName}</td>
                    <td className="px-5 py-3">{e.action}</td>
                    <td className="max-w-[320px] truncate px-5 py-3 text-muted-foreground">{e.details}</td>
                    <td className="px-5 py-3"><SeverityBadge value={e.severity} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <EventDetailSheet event={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
