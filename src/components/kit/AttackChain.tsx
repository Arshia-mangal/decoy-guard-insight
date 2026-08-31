import { ArrowDown, Database, FileWarning, KeyRound, LogIn, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeOf } from "@/lib/format";
import type { AttackStage } from "@/types";

const icons: Record<string, LucideIcon> = {
  "Initial Access": LogIn,
  "Admin Discovery": ShieldAlert,
  "Credential Access": KeyRound,
  "Database Enumeration": Database,
  "Sensitive File Access": FileWarning,
};

interface Props {
  stages: AttackStage[];
  selectedId?: string | undefined;
  onSelect?: (stage: AttackStage) => void;
}

export function AttackChain({ stages, selectedId, onSelect }: Props) {
  return (
    <ol className="space-y-0">
      {stages.map((stage, i) => {
        const Icon = icons[stage.name] ?? ShieldAlert;
        const active = selectedId === stage.id;
        return (
          <li key={stage.id}>
            <button
              type="button"
              onClick={() => onSelect?.(stage)}
              className={cn(
                "group flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-all",
                active
                  ? "border-primary/40 bg-primary/8"
                  : "border-transparent hover:border-border hover:bg-surface-2/60",
              )}
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-md border",
                  stage.status === "VERIFIED"
                    ? "border-verified/30 bg-verified/10 text-verified"
                    : stage.status === "IN PROGRESS"
                      ? "border-warn/30 bg-warn/10 text-warn"
                      : "border-border bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{stage.name}</p>
                <p className="truncate text-xs text-muted-foreground">{stage.description}</p>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="font-mono text-xs text-foreground/80">{timeOf(stage.timestamp)}</p>
                <p className="text-[11px] text-muted-foreground">
                  {stage.eventCount} event{stage.eventCount === 1 ? "" : "s"}
                </p>
              </div>
              <span
                className={cn(
                  "hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] tracking-wider uppercase md:inline",
                  stage.status === "VERIFIED"
                    ? "border-verified/30 text-verified"
                    : stage.status === "IN PROGRESS"
                      ? "border-warn/30 text-warn"
                      : "border-border text-muted-foreground",
                )}
              >
                {stage.status}
              </span>
            </button>
            {i < stages.length - 1 && (
              <div className="flex h-5 items-center pl-[2.1rem]">
                <ArrowDown className="size-3.5 text-muted-foreground/50" />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
