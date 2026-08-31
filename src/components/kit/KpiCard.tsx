import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  tone?: "default" | "risk" | "warn" | "verified";
  loading?: boolean;
}

const tones = {
  default: "text-primary bg-primary/10 border-primary/25",
  risk: "text-risk bg-risk/10 border-risk/25",
  warn: "text-warn bg-warn/10 border-warn/25",
  verified: "text-verified bg-verified/10 border-verified/25",
};

export function KpiCard({ label, value, delta, icon: Icon, tone = "default", loading }: KpiCardProps) {
  return (
    <div className="panel rise-in p-5">
      <div className="flex items-start justify-between">
        <p className="label-xs text-muted-foreground">{label}</p>
        <span className={cn("rounded-md border p-1.5", tones[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      {loading ? (
        <div className="mt-4 h-8 w-20 animate-pulse rounded bg-muted" />
      ) : (
        <p className="mt-3 font-mono text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      )}
      {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
    </div>
  );
}
