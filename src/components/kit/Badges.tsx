import { cn } from "@/lib/utils";
import type { IncidentStatus, ReportStatus, Severity } from "@/types";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase whitespace-nowrap";

const severityStyles: Record<Severity, string> = {
  LOW: "border-border bg-muted/60 text-muted-foreground",
  MEDIUM: "border-warn/30 bg-warn/10 text-warn",
  HIGH: "border-risk/40 bg-risk/12 text-risk",
  CRITICAL: "border-risk/60 bg-risk/20 text-risk",
};

export function SeverityBadge({ value, className }: { value: Severity; className?: string }) {
  return <span className={cn(base, severityStyles[value], className)}>{value}</span>;
}

const statusStyles: Record<IncidentStatus, string> = {
  ACTIVE: "border-risk/40 bg-risk/12 text-risk",
  INVESTIGATING: "border-warn/30 bg-warn/10 text-warn",
  "REPORT READY": "border-primary/40 bg-primary/12 text-primary",
  APPROVED: "border-verified/40 bg-verified/12 text-verified",
  CLOSED: "border-border bg-muted/60 text-muted-foreground",
};

export function StatusBadge({ value, className }: { value: IncidentStatus; className?: string }) {
  return <span className={cn(base, statusStyles[value], className)}>{value}</span>;
}

const reportStyles: Record<ReportStatus, string> = {
  "NOT STARTED": "border-border bg-muted/60 text-muted-foreground",
  DRAFTING: "border-border bg-muted/60 text-muted-foreground",
  "AI DRAFT": "border-info/40 bg-info/12 text-info",
  "AWAITING APPROVAL": "border-warn/30 bg-warn/10 text-warn",
  APPROVED: "border-verified/40 bg-verified/12 text-verified",
};

export function ReportBadge({ value, className }: { value: ReportStatus; className?: string }) {
  return <span className={cn(base, reportStyles[value], className)}>{value}</span>;
}

export function LiveDot({ label = "SYSTEM LIVE", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-verified/25 bg-verified/8 px-3 py-1 text-[11px] font-medium tracking-[0.16em] text-verified uppercase",
        className,
      )}
    >
      <span className="live-dot size-1.5 rounded-full bg-verified" />
      {label}
    </span>
  );
}

export function EvidenceRef({ id, onClick }: { id: string; onClick?: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] text-primary transition-colors hover:bg-primary/20"
    >
      [{id}]
    </button>
  );
}
