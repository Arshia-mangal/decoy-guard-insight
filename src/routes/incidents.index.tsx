import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUpDown, Search, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { ReportBadge, SeverityBadge, StatusBadge } from "@/components/kit/Badges";
import { CountdownClock } from "@/components/kit/CountdownClock";
import { Panel } from "@/components/kit/Panel";
import { EmptyState, PageHeader, TableSkeleton } from "@/components/kit/States";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useIncidents } from "@/hooks/useApi";
import { dateTimeOf } from "@/lib/format";
import type { Incident } from "@/types";

export const Route = createFileRoute("/incidents/")({
  head: () => ({
    meta: [
      { title: "Incidents — CHAKRAVYUH" },
      {
        name: "description",
        content: "Search, filter and triage deception-derived incidents with severity, attack stage and report status.",
      },
      { property: "og:title", content: "Incidents — CHAKRAVYUH" },
      { property: "og:description", content: "Triage deception-derived incidents by severity, stage and report status." },
    ],
  }),
  component: IncidentsPage,
});

type SortKey = "detectedAt" | "severity" | "id";

const severityOrder = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };

function IncidentsPage() {
  const { data, isLoading } = useIncidents();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("detectedAt");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    let list: Incident[] = data ?? [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) =>
        [i.id, i.sessionId, i.org, i.stage].some((f) => f.toLowerCase().includes(q)),
      );
    }
    if (severity !== "all") list = list.filter((i) => i.severity === severity);
    if (status !== "all") list = list.filter((i) => i.status === status);
    return [...list].sort((a, b) => {
      const dir = asc ? 1 : -1;
      if (sort === "severity") return (severityOrder[a.severity] - severityOrder[b.severity]) * dir;
      if (sort === "id") return a.id.localeCompare(b.id) * dir;
      return (new Date(a.detectedAt).getTime() - new Date(b.detectedAt).getTime()) * dir;
    });
  }, [data, query, severity, status, sort, asc]);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setAsc(!asc);
    else {
      setSort(key);
      setAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incidents"
        subtitle="Correlated deception sessions escalated into reportable incidents."
      />

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search incident, session, organisation, stage…"
              className="pl-9"
            />
          </div>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["ACTIVE", "INVESTIGATING", "REPORT READY", "APPROVED", "CLOSED"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => toggleSort("severity")} className="gap-2">
            <ArrowUpDown className="size-3.5" /> Severity
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleSort("detectedAt")} className="gap-2">
            <ArrowUpDown className="size-3.5" /> Detected
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No incidents match this view"
            description="Adjust the search text or clear the severity and status filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Incident ID", "Session", "Detected", "Severity", "Attack Stage", "Status", "Report", "Deadline"].map((h) => (
                    <th key={h} className="label-xs px-5 py-3 text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((i) => (
                  <tr
                    key={i.id}
                    onClick={() => navigate({ to: "/incidents/$incidentId", params: { incidentId: i.id } })}
                    className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
                  >
                    <td className="px-5 py-3 font-mono">{i.id}</td>
                    <td className="px-5 py-3 font-mono text-muted-foreground">{i.sessionId}</td>
                    <td className="px-5 py-3 text-muted-foreground">{dateTimeOf(i.detectedAt)}</td>
                    <td className="px-5 py-3"><SeverityBadge value={i.severity} /></td>
                    <td className="px-5 py-3">{i.stage}</td>
                    <td className="px-5 py-3"><StatusBadge value={i.status} /></td>
                    <td className="px-5 py-3"><ReportBadge value={i.reportStatus} /></td>
                    <td className="px-5 py-3"><CountdownClock deadline={i.deadlineAt} /></td>
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
