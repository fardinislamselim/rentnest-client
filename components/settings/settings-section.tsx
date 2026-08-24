import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Shell for one settings section. Deliberately not built on `components/ui/card`,
 * whose header is centered and title sized for the auth pages — a settings form
 * wants left-aligned, quieter section headings.
 *
 * Server-safe: no "use client", so it can wrap either kind of child.
 */
export function SettingsSection({
  id,
  icon: Icon,
  title,
  description,
  accent = "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  className,
  children,
}: {
  id?: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  accent?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-2xl border border-border/60 bg-card",
        className,
      )}
    >
      <header className="flex items-start gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            accent,
          )}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="font-heading text-base font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </header>

      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

/** Label/value row for the read-only account facts. */
export function SettingsRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 py-3 last:border-0 last:pb-0 first:pt-0">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}
