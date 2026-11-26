import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/50 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <h3 className="font-heading mb-2 text-xl font-semibold text-foreground">
        {title}
      </h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {action ??
        (actionLabel && actionHref ? (
          <Button
            asChild
            className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null)}
    </div>
  );
}
