import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Database, FolderLock, KeyRound, Plug, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Panel } from "@/components/kit/Panel";
import { PageHeader, TableSkeleton } from "@/components/kit/States";
import { useAssets } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { dateTimeOf } from "@/lib/format";

export const Route = createFileRoute("/decoys")({
  head: () => ({
    meta: [
      { title: "Decoy Assets — CHAKRAVYUH" },
      {
        name: "description",
        content: "Synthetic decoy assets deployed across the estate: login portals, admin consoles, databases, shares and APIs.",
      },
      { property: "og:title", content: "Decoy Assets — CHAKRAVYUH" },
      { property: "og:description", content: "Synthetic decoy assets and their interaction telemetry." },
    ],
  }),
  component: DecoysPage,
});

const icons: Record<string, LucideIcon> = {
  "DA-01": KeyRound,
  "DA-02": ShieldCheck,
  "DA-03": Database,
  "DA-04": FolderLock,
  "DA-05": Plug,
};

const statusTone = {
  ONLINE: "border-verified/30 bg-verified/10 text-verified",
  DEGRADED: "border-warn/30 bg-warn/10 text-warn",
  OFFLINE: "border-risk/30 bg-risk/10 text-risk",
};

function DecoysPage() {
  const { data, isLoading } = useAssets();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Decoy Assets"
        subtitle="Decoys have no legitimate users — every interaction is signal, never noise."
      />

      {isLoading ? (
        <Panel bodyClassName="p-0"><TableSkeleton rows={4} cols={4} /></Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(data ?? []).map((a) => {
            const Icon = icons[a.id] ?? Boxes;
            return (
              <article key={a.id} className="panel rise-in p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] tracking-wide uppercase", statusTone[a.status])}>
                    {a.status}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-medium">{a.name}</h3>
                <p className="text-xs text-muted-foreground">{a.kind}</p>

                <dl className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="label-xs text-muted-foreground">Interactions</dt>
                    <dd className="mt-1 font-mono text-xl tabular-nums">{a.interactions}</dd>
                  </div>
                  <div>
                    <dt className="label-xs text-muted-foreground">Sessions</dt>
                    <dd className="mt-1 font-mono text-xl tabular-nums">{a.sessions.length}</dd>
                  </div>
                </dl>

                <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Last interaction</span>
                    <span className="font-mono">{dateTimeOf(a.lastInteraction)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Deployed in</span>
                    <span>{a.deployedIn}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {a.sessions.map((s) => (
                      <span key={s} className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
