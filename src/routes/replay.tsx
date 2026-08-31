import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SeverityBadge } from "@/components/kit/Badges";
import { Panel } from "@/components/kit/Panel";
import { PageHeader, TableSkeleton } from "@/components/kit/States";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useEvents, useSessions } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { dateTimeOf, timeOf } from "@/lib/format";

export const Route = createFileRoute("/replay")({
  head: () => ({
    meta: [
      { title: "Attack Replay — CHAKRAVYUH" },
      {
        name: "description",
        content: "Step through an attacker session event by event on an interactive timeline to understand exactly what happened.",
      },
      { property: "og:title", content: "Attack Replay — CHAKRAVYUH" },
      { property: "og:description", content: "Interactive, step-by-step replay of an attacker session." },
    ],
  }),
  component: ReplayPage,
});

const SPEEDS = [1, 2, 4];

function ReplayPage() {
  const { data: sessions } = useSessions();
  const { data: events, isLoading } = useEvents();
  const [sessionId, setSessionId] = useState<string>("");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!sessionId && sessions?.length) setSessionId(sessions[0]!.id);
  }, [sessions, sessionId]);

  const timeline = useMemo(
    () => (events ?? []).filter((e) => e.sessionId === sessionId),
    [events, sessionId],
  );

  useEffect(() => setIndex(0), [sessionId]);

  useEffect(() => {
    if (!playing || timeline.length === 0) return;
    const t = setInterval(() => {
      setIndex((i) => {
        if (i >= timeline.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1600 / speed);
    return () => clearInterval(t);
  }, [playing, speed, timeline.length]);

  const current = timeline[index];

  if (isLoading) return <Panel bodyClassName="p-0"><TableSkeleton rows={6} cols={4} /></Panel>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attack Replay"
        subtitle="Reconstruct the intrusion moment by moment — exactly as the decoys recorded it."
      />

      <Panel bodyClassName="p-0">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <Select value={sessionId} onValueChange={setSessionId}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Session" /></SelectTrigger>
            <SelectContent>
              {(sessions ?? []).map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.id} · {s.org}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setIndex((i) => Math.max(0, i - 1))}>
              <SkipBack className="size-4" />
            </Button>
            <Button size="icon" onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIndex((i) => Math.min(timeline.length - 1, i + 1))}>
              <SkipForward className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => { setIndex(0); setPlaying(false); }}>
              <RotateCcw className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {SPEEDS.map((s) => (
              <Button key={s} size="sm" variant={speed === s ? "default" : "outline"} onClick={() => setSpeed(s)}>
                {s}x
              </Button>
            ))}
          </div>

          <span className="ml-auto font-mono text-xs text-muted-foreground">
            STEP {timeline.length ? index + 1 : 0} / {timeline.length}
          </span>
        </div>

        <div className="p-6">
          <Slider
            value={[index]}
            max={Math.max(0, timeline.length - 1)}
            step={1}
            onValueChange={([v]) => { setIndex(v ?? 0); setPlaying(false); }}
          />
          <div className="mt-3 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>{timeline[0] ? timeOf(timeline[0].timestamp) : "--:--"}</span>
            <span>{timeline.at(-1) ? timeOf(timeline.at(-1)!.timestamp) : "--:--"}</span>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel title="Timeline" bodyClassName="p-0">
          <ol className="divide-y divide-border">
            {timeline.map((e, i) => (
              <li key={e.id}>
                <button
                  onClick={() => { setIndex(i); setPlaying(false); }}
                  className={cn(
                    "flex w-full items-center gap-4 px-5 py-3.5 text-left transition-all",
                    i === index ? "bg-primary/10" : i < index ? "opacity-100 hover:bg-surface-2/60" : "opacity-45 hover:opacity-80",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      i === index ? "live-dot bg-primary" : i < index ? "bg-verified" : "bg-muted-foreground/40",
                    )}
                  />
                  <span className="font-mono text-xs text-muted-foreground">{timeOf(e.timestamp)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{e.action}</span>
                    <span className="block truncate text-xs text-muted-foreground">{e.assetName} — {e.details}</span>
                  </span>
                  <SeverityBadge value={e.severity} />
                </button>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Frame detail" subtitle={current ? current.id : "No event selected"}>
          {current ? (
            <dl className="space-y-4 text-sm">
              {([
                ["Timestamp", dateTimeOf(current.timestamp)],
                ["Asset", current.assetName],
                ["Action", current.action],
                ["Details", current.details],
                ["Stage", current.stage],
                ["Session", current.sessionId],
              ] as [string, string][]).concat(Object.entries(current.metadata)).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] gap-3">
                  <dt className="label-xs text-muted-foreground">{k}</dt>
                  <dd className="font-mono text-xs break-words">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">Select a session with recorded events.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
