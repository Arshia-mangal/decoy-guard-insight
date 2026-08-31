import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Download, FileText, PenLine, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EvidenceRef, ReportBadge } from "@/components/kit/Badges";
import { Panel } from "@/components/kit/Panel";
import { EmptyState, PageHeader, TableSkeleton } from "@/components/kit/States";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApproveReport, useReports } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { dateTimeOf } from "@/lib/format";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — CHAKRAVYUH" },
      {
        name: "description",
        content: "Evidence-referenced incident reports with attack chain, MITRE mapping and a mandatory human approval step.",
      },
      { property: "og:title", content: "Reports — CHAKRAVYUH" },
      { property: "og:description", content: "Evidence-referenced incident reports awaiting human approval." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { data, isLoading } = useReports();
  const approve = useApproveReport();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!activeId && data?.length) setActiveId(data[0]!.id);
  }, [data, activeId]);

  const report = data?.find((r) => r.id === activeId);

  if (isLoading) return <Panel bodyClassName="p-0"><TableSkeleton rows={6} cols={4} /></Panel>;
  if (!data?.length)
    return <EmptyState icon={FileText} title="No reports yet" description="Generate a report from an incident to begin." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Every factual statement is anchored to a verified evidence reference."
      />

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Panel title="Report queue" bodyClassName="p-0">
            <ul className="divide-y divide-border">
              {data.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => { setActiveId(r.id); setEditing(false); }}
                    className={cn(
                      "w-full px-5 py-3 text-left transition-colors hover:bg-surface-2/60",
                      r.id === activeId && "bg-surface-2/70",
                    )}
                  >
                    <p className="font-mono text-sm">{r.incidentId}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.org}</p>
                    <ReportBadge value={r.status} className="mt-2" />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          {report && (
            <Panel title="Readiness checklist">
              <ul className="space-y-3">
                {report.checklist.map((c) => (
                  <li key={c.label} className="flex items-center gap-3 text-sm">
                    {c.done ? (
                      <CheckCircle2 className="size-4 shrink-0 text-verified" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-warn" />
                    )}
                    <span className={cn(!c.done && "text-warn")}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>

        {report && (
          <Panel
            title="CERT-In-READY INCIDENT REPORT"
            subtitle={`${report.incidentId} · ${report.org} · generated ${dateTimeOf(report.generatedAt)}`}
            action={<ReportBadge value={report.status} />}
          >
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setEditing(!editing)}>
                  <PenLine className="size-4" /> {editing ? "DONE EDITING" : "EDIT REPORT"}
                </Button>
                <Button
                  disabled={report.status === "APPROVED" || approve.isPending}
                  onClick={() =>
                    approve.mutate(report.id, {
                      onSuccess: () =>
                        toast.success(`${report.incidentId} report approved`, {
                          description: "Approval recorded against A. Mehra — Security Lead.",
                        }),
                    })
                  }
                >
                  <ShieldCheck className="size-4" />
                  {report.status === "APPROVED" ? "APPROVED" : approve.isPending ? "APPROVING…" : "APPROVE REPORT"}
                </Button>
                <Button variant="outline" onClick={() => toast("PDF export queued", { description: "A synthetic export will be produced from this draft." })}>
                  <Download className="size-4" /> EXPORT PDF
                </Button>
              </div>

              {report.status === "APPROVED" && (
                <div className="rounded-lg border border-verified/30 bg-verified/8 px-4 py-3 text-sm text-verified">
                  Approved by {report.approvedBy}. This report is ready for submission to the relevant authority.
                </div>
              )}

              <article className="space-y-6 rounded-lg border border-border bg-surface-2/40 p-6">
                <header className="border-b border-border pb-4">
                  <p className="label-xs text-muted-foreground">Report {report.id}</p>
                  <h3 className="mt-2 text-xl font-semibold">Incident Report — {report.incidentId}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Prepared in a CERT-In-ready structure for human review. Not a certification or compliance statement.
                  </p>
                </header>

                {report.sections.map((s) => (
                  <section key={s.title}>
                    <h4 className="label-xs text-primary">{s.title}</h4>
                    {editing ? (
                      <Textarea
                        className="mt-2 min-h-28 font-sans text-sm"
                        value={drafts[`${report.id}-${s.title}`] ?? s.body}
                        onChange={(e) => setDrafts({ ...drafts, [`${report.id}-${s.title}`]: e.target.value })}
                      />
                    ) : (
                      <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                        {drafts[`${report.id}-${s.title}`] ?? s.body}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">Evidence:</span>
                      {s.evidenceRefs.map((id) => (
                        <EvidenceRef key={id} id={id} />
                      ))}
                    </div>
                  </section>
                ))}
              </article>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
