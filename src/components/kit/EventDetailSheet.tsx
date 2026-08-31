import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SeverityBadge } from "@/components/kit/Badges";
import { dateTimeOf } from "@/lib/format";
import type { DecoyEvent } from "@/types";

interface Props {
  event: DecoyEvent | null;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailSheet({ event, onOpenChange }: Props) {
  return (
    <Sheet open={!!event} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-border bg-surface sm:max-w-lg">
        {event && (
          <>
            <SheetHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <SheetTitle className="font-mono text-lg">{event.id}</SheetTitle>
                <SeverityBadge value={event.severity} />
              </div>
              <SheetDescription>{event.details}</SheetDescription>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-8">
              <dl className="grid grid-cols-2 gap-4">
                {[
                  ["Captured", dateTimeOf(event.timestamp)],
                  ["Session", event.sessionId],
                  ["Decoy asset", `${event.assetName} (${event.assetId})`],
                  ["Action", event.action],
                  ["Attack stage", event.stage],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm">{v}</dd>
                  </div>
                ))}
              </dl>

              <div>
                <p className="label-xs text-muted-foreground">Forensic metadata</p>
                <div className="mt-2 divide-y divide-border rounded-lg border border-border">
                  {Object.entries(event.metadata).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 px-3 py-2 text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-right font-mono text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                Synthetic record captured from a decoy asset. No production system, real credential, or real personal
                data is involved.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
