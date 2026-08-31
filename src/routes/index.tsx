import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  FileCheck2,
  HelpCircle,
  ShieldAlert,
  Siren,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AttackChain } from "@/components/kit/AttackChain";
import { EvidenceRef, LiveDot, SeverityBadge, StatusBadge } from "@/components/kit/Badges";
import { CountdownClock } from "@/components/kit/CountdownClock";
import { EventDetailSheet } from "@/components/kit/EventDetailSheet";
import { KpiCard } from "@/components/kit/KpiCard";
import { Panel } from "@/components/kit/Panel";
import { EmptyState, TableSkeleton } from "@/components/kit/States";
import { DetectionRationale } from "@/components/overview/DetectionRationale";
import { Button } from "@/components/ui/button";
import { useEvents, useIncidents, useKpis } from "@/hooks/useApi";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import { compact, timeOf } from "@/lib/format";
import type { DecoyEvent } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — CHAKRAVYUH Deception Intelligence" },
      {
        name: "description",
        content:
          "Live SOC overview: active deception incidents, reconstructed attack chains, verified evidence and the 6-hour reporting clock.",
      },
      { property: "og:title", content: "Overview — CHAKRAVYUH Deception Intelligence" },
      {
        property: "og:description",
        content: "Active incidents, attack chains and verified deception evidence at a glance.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { data: kpis, isLoading: kpiLoading } = useKpis();
  const { data: incidents, isLoading: incLoading } = useIncidents();
  const { data: events = [] } = useEvents();
  const stream = useLiveEvents(events, 7);

  const [showWhy, setShowWhy] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DecoyEvent | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | undefined>();

  const active = incidents?.find((i) => i.status === "ACTIVE") ?? incidents?.[0];

  return (
    <div className="space-y-6">
      <div className="grid-fade -mx-4 -mt-6 px-4 pt-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-[0.14em]">CHAKRAVYUH</h1>
            <p className="mt-1 text-sm text-muted-foreground">Deception &amp; Incident Intelligence</p>
          </div>
          <LiveDot />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
          {["Attack detected", "Chain reconstructed", "Evidence verified", "6h clock", "Report generated", "Human approval"].map(
            (step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-surface-2/50 px-2.5 py-1">{step}</span>
                {i < arr.length - 1 && <ArrowRight className="size-3 opacity-40" />}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Incidents" value={kpis?.activeIncidents ?? 0} icon={Siren} tone="risk" loading={kpiLoading} delta="2 escalated in last hour" />
        <KpiCard label="High Risk Incidents" value={kpis?.highRiskIncidents ?? 0} icon={ShieldAlert} tone="warn" loading={kpiLoading} delta="Requires report within 6h" />
        <KpiCard label="Events Captured" value={compact(kpis?.eventsCaptured ?? 0)} icon={Activity} loading={kpiLoading} delta="Across 5 decoy assets" />
        <KpiCard label="Reports Generated" value={kpis?.reportsGenerated ?? 0} icon={FileCheck2} tone="verified" loading={kpiLoading} delta="9 approved this month" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Active incident"
          subtitle={active ? `${active.id} · Session ${active.sessionId} · ${active.org}` : undefined}
          action={
            active && (
              <div className="flex items-center gap-2">
                <SeverityBadge value={active.severity} />
                <StatusBadge value={active.status} />
              </div>
            )
          }
        >
          {incLoading ? (
            <TableSkeleton rows={5} cols={3} />
          ) : !active ? (
            <EmptyState title="No active incidents" description="All correlated sessions are closed." />
          ) : (
            <div className="space-y-5">
              <AttackChain
                stages={active.chain}
                selectedId={selectedStage}
                onSelect={(s) => {
                  setSelectedStage(s.id);
                  const ev = events.find((e) => e.id === s.eventIds[0]);
                  if (ev) setSelectedEvent(ev);
                }}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => setShowWhy(true)} className="gap-2">
                  <HelpCircle className="size-4" />
                  WHY WAS THIS DETECTED?
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/incidents/$incidentId" params={{ incidentId: active.id }}>
                    Open investigation
                  </Link>
                </Button>
                <div className="ml-auto flex flex-wrap gap-1.5">
                  {active.evidenceIds.map((id) => (
                    <EvidenceRef
                      key={id}
                      id={id}
                      onClick={(eid) => setSelectedEvent(events.find((e) => e.id === eid) ?? null)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          {active && <CountdownClock deadline={active.deadlineAt} size="lg" />}
          <Panel title="Live event stream" bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {stream.map((e) => (
                <li key={e.id} className="rise-in flex items-start gap-3 px-5 py-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      <span className="font-mono text-xs text-muted-foreground">{e.sessionId}</span> {e.action}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{e.assetName} · {e.details}</p>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{timeOf(e.timestamp)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Event activity" subtitle="Decoy interactions vs verified events">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpis?.activityTrend ?? []}>
                <defs>
                  <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="vfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="events" stroke="var(--color-chart-1)" fill="url(#evGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="verified" stroke="var(--color-chart-2)" fill="url(#vfGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Recent incidents" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {(incidents ?? []).slice(0, 5).map((i) => (
              <li key={i.id}>
                <Link
                  to="/incidents/$incidentId"
                  params={{ incidentId: i.id }}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-2/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm">{i.id}</p>
                    <p className="truncate text-xs text-muted-foreground">{i.org} · {i.stage}</p>
                  </div>
                  <SeverityBadge value={i.severity} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {active && (
        <DetectionRationale open={showWhy} onOpenChange={setShowWhy} incident={active} events={events} />
      )}
      <EventDetailSheet event={selectedEvent} onOpenChange={(o) => !o && setSelectedEvent(null)} />
    </div>
  );
}
