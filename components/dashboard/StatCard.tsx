import React from "react";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  accentClass?: string;
  valueClass?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  href,
  icon: Icon,
  accentClass = "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
  valueClass = "text-foreground",
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            accentClass,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-muted-foreground/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          aria-hidden="true"
        />
      </div>

      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p
          className={cn(
            "font-heading mt-1 text-2xl font-extrabold tracking-tight tabular-nums",
            valueClass,
          )}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Link>
  );
}
