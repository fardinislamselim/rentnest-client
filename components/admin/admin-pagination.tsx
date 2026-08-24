"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AdminPaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Noun for the "Showing 1–10 of 42 users" line. */
  label?: string;
}

/** Windowed page list: 1 … 4 5 6 … 20, so the control never grows unbounded. */
const pageWindow = (page: number, totalPages: number): (number | "gap")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, page]);
  if (page - 1 > 1) pages.add(page - 1);
  if (page + 1 < totalPages) pages.add(page + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) out.push("gap");
    out.push(value);
  });

  return out;
};

export function AdminPagination({
  page,
  limit,
  total,
  onPageChange,
  label = "results",
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (total === 0) return null;

  const first = (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground tabular-nums">
          {formatNumber(first)}–{formatNumber(last)}
        </span>{" "}
        of <span className="font-medium text-foreground tabular-nums">{formatNumber(total)}</span>{" "}
        {label}
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-border/60"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Prev</span>
        </Button>

        {pageWindow(page, totalPages).map((entry, index) =>
          entry === "gap" ? (
            <span
              key={`gap-${index}`}
              className="px-1 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Button
              key={entry}
              variant={entry === page ? "default" : "ghost"}
              size="icon-sm"
              className={cn("rounded-xl tabular-nums", entry !== page && "text-muted-foreground")}
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? "page" : undefined}
              aria-label={`Page ${entry}`}
            >
              {entry}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-border/60"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <span className="sr-only sm:not-sr-only">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}
