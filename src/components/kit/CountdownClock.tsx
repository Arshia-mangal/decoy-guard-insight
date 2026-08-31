import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";

interface Props {
  deadline: string;
  size?: "sm" | "lg";
  className?: string;
}

export function CountdownClock({ deadline, size = "sm", className }: Props) {
  const c = useCountdown(deadline);
  const urgent = c.totalMs < 2 * 3600_000;
  const tone = c.expired || urgent ? "text-risk" : "text-warn";

  if (size === "lg") {
    return (
      <div className={cn("panel p-6", className)}>
        <div className="flex items-center justify-between">
          <p className="label-xs text-muted-foreground">Reporting deadline</p>
          <span className={cn("label-xs", tone)}>{c.expired ? "Overdue" : "6-hour window"}</span>
        </div>
        <div className={cn("mt-4 flex items-end gap-2 font-mono tabular-nums", tone)}>
          <span className="text-5xl font-semibold tracking-tight">{c.hours}</span>
          <span className="pb-1 text-2xl opacity-50">:</span>
          <span className="text-5xl font-semibold tracking-tight">{c.minutes}</span>
          <span className="pb-1 text-2xl opacity-50">:</span>
          <span className="text-5xl font-semibold tracking-tight">{c.seconds}</span>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", urgent ? "bg-risk" : "bg-warn")}
            style={{ width: `${c.progress}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Time remaining to submit the approved incident report to the relevant authority.
        </p>
      </div>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-sm tabular-nums", tone, className)}>
      <Clock className="size-3.5" />
      {c.hours}:{c.minutes}:{c.seconds}
    </span>
  );
}
