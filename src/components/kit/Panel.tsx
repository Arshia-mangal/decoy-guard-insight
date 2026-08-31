import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title?: string;
  subtitle?: string | undefined;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function Panel({ title, subtitle, action, className, bodyClassName, children }: PanelProps) {
  return (
    <section className={cn("panel flex flex-col overflow-hidden", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
          <div>
            {title && <h2 className="label-xs text-muted-foreground">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-foreground/80">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("flex-1 p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
