import { CheckCircle2, Link2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { timeOf } from "@/lib/format";
import type { DecoyEvent, Incident } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: Incident;
  events: DecoyEvent[];
}

export function DetectionRationale({ open, onOpenChange, incident, events }: Props) {
  const chainEvents = incident.evidenceIds
    .map((id) => events.find((e) => e.id === id))
    .filter((e): e is DecoyEvent => !!e);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-border bg-surface sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Why was {incident.id} detected?</DialogTitle>
          <DialogDescription>
            This incident was not raised by a single alert. It was raised because five verified decoy interactions
            occurred inside one correlated session, in an order that only an intruder would produce.
          </DialogDescription>
        </DialogHeader>

        <ol className="relative space-y-3 border-l border-border pl-6">
          {chainEvents.map((event, i) => (
            <li key={event.id} className="relative">
              <span className="absolute -left-[1.9rem] top-2 grid size-4 place-items-center rounded-full border border-verified/40 bg-verified/15">
                <CheckCircle2 className="size-2.5 text-verified" />
              </span>
              <div className="rounded-lg border border-border bg-surface-2/50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm text-primary">{event.id}</span>
                  <span className="text-sm font-medium">— {event.action}</span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">{timeOf(event.timestamp)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{event.details}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded border border-border px-1.5 py-0.5">{event.assetName}</span>
                  <span className="rounded border border-border px-1.5 py-0.5">{event.stage}</span>
                  <span className="rounded border border-verified/30 px-1.5 py-0.5 text-verified">Verified</span>
                </div>
              </div>
              {i < chainEvents.length - 1 && (
                <div className="mt-2 flex items-center gap-2 pl-1 text-[11px] text-muted-foreground">
                  <Link2 className="size-3" /> correlated to next event by session {incident.sessionId}
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="rounded-lg border border-primary/25 bg-primary/8 p-4 text-xs text-foreground/80">
          <p className="label-xs text-primary">Detection logic</p>
          <p className="mt-2">
            Sequence correlation: {chainEvents.length} verified events, {new Set(chainEvents.map((e) => e.assetName)).size}{" "}
            distinct decoy assets, single session {incident.sessionId}, monotonic stage progression from initial access
            to sensitive file access. Decoy assets have no legitimate users, so every interaction is unambiguous.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
