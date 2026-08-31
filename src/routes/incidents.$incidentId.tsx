import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText, Fingerprint, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AttackChain } from "@/components/kit/AttackChain";
import { EvidenceRef, SeverityBadge, StatusBadge } from "@/components/kit/Badges";
import { CountdownClock } from "@/components/kit/CountdownClock";
import { EventDetailSheet } from "@/components/kit/EventDetailSheet";
import { Panel } from "@/components/kit/Panel";
import { EmptyState, TableSkeleton } from "@/components/kit/States";
import { Button } from "@/components/ui/button";
import { useEvents, useGenerateReport, useIncident } from "@/hooks/useApi";
import { dateTimeOf, timeOf } from "@/lib/format";
import type { DecoyEvent } from "@/types";

export const Route = createFileRoute("/incidents/$incidentId")({
  head: ({ params }) => ({
    meta: [
      { title: `Incident ${params.incidentId} — CHAKRAVYUH` },
      {
        name: "description",
        content: `Investigation view for incident ${params.incidentId}: attack chain, verified evidence, MITRE ATT&CK mapping and reporting countdown.`,
      },
      { property: "og:title", content: `Incident ${params.incidentId} — CHAKRAVYUH` },
      { property: "og:description", content: "Attack chain, verified evidence and MITRE mapping for this incident." },
    ],
  }),
  component: IncidentDetails,
});

function IncidentDetails() {
  const { incidentId } = Route.useParams();
  const navigate = useNavigate();
  const { data: incident, isLoading } = useIncident(incidentId);
  const { data: events = [] } = useEvents();
  const generate = useGenerateReport();
  const [selectedEvent, setSelectedEvent] = useState<DecoyEvent | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | undefined>();

  if (isLoading) return <TableSkeleton rows={8} cols={4} />;
  if (!incident)
    return (
      <EmptyState title="Incident not found" description={`No incident matches ${incidentId} in the current dataset.`} />
    );

  const incidentEvents = events.filter((e) => incident.evidenceIds.includes(e.id));

  return (
    <div className="space-y-6">
      <Link to="/incidents" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All incidents
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold tracking-tight">INCIDENT {incident.id}</h1>
            <SeverityBadge value={incident.severity} />
            <StatusBadge value={incident.status} />
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{incident.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/evidence" search={{ session: incident.sessionId }}>
              <Fingerprint className="size-4" /> VIEW EVIDENCE
            </Link>
          </Button>
          <Button
            onClick={() =>
              generate.mutate(incident.id, {
                onSuccess: () => {
                  toast.success(`AI draft generated for ${incident.id}`, {
                    description: "Human approval is still required before submission.",
                  });
                  navigate({ to: "/reports" });
                },
              })
            }
            disabled={generate.isPending}
          >
            <FileText className="size-4" /> {generate.isPending ? "GENERATING…" : "GENERATE REPORT"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Detection timestamp", dateTimeOf(incident.detectedAt)],
          ["Session ID", incident.sessionId],
          ["Severity", incident.severity],
          ["Organisation", incident.org],
        ].map(([k, v]) => (
          <div key={k} className="panel p-4">
            <p className="label-xs text-muted-foreground">{k}</p>
            <p className="mt-2 text-sm">{v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Attack chain" subtitle="Reconstructed from correlated decoy interactions">
          <AttackChain
            stages={incident.chain}
            selectedId={selectedStage}
            onSelect={(s) => {
              setSelectedStage(s.id);
              const ev = events.find((e) => e.id === s.eventIds[0]);
              if (ev) setSelectedEvent(ev);
            }}
          />
        </Panel>

        <CountdownClock deadline={incident.deadlineAt} size="lg" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Evidence" subtitle={`${incidentEvents.length} verified events`} bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {incidentEvents.map((e) => (
              <li key={e.id}>
                <button
                  onClick={() => setSelectedEvent(e)}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-surface-2/60"
                >
                  <span className="font-mono text-sm text-primary">{e.id}</span>
                  <span className="min-w-0 flex-1 truncate text-sm">{e.action} — {e.details}</span>
                  <span className="font-mono text-xs text-muted-foreground">{timeOf(e.timestamp)}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="MITRE ATT&CK mapping" subtitle="Derived from the verified event sequence" bodyClassName="p-0">
          <ul className="divide-y divide-border">
            {incident.mitre.map((m) => (
              <li key={m.techniqueId} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <span className="grid size-8 place-items-center rounded-md border border-info/30 bg-info/10 text-info">
                  <Target className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-mono text-info">{m.techniqueId}</span> — {m.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.tactic}</p>
                </div>
                <div className="flex gap-1.5">
                  {m.evidenceIds.map((id) => (
                    <EvidenceRef key={id} id={id} onClick={(eid) => setSelectedEvent(events.find((e) => e.id === eid) ?? null)} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <EventDetailSheet event={selectedEvent} onOpenChange={(o) => !o && setSelectedEvent(null)} />
    </div>
  );
}
