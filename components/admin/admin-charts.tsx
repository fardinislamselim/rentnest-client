"use client";

import { useMemo, useState } from "react";
import { Table2, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminDashboardStats, AdminRentalCounts } from "@/types/admin";

/*
 * Chart notes
 * -----------
 * Forms are chosen by the job the numbers do, not by variety:
 *   · role split      → part-to-whole across 3 categories → one 100% stacked bar
 *   · property status → magnitude across nominal categories → plain bars, ONE hue
 *                       (a nominal set must not be given a value ramp)
 *   · rental pipeline → ordered stages → single-hue ordinal ramp, light → dark
 *
 * Colors come from the `--viz-*` tokens in globals.css, which were validated as
 * sets against this app's real card surfaces (#ffffff light, #171717 dark) rather
 * than flipped automatically between modes. The light-mode green sits at 2.82:1
 * against white, which is below the 3:1 line — so every value here is also
 * written out as text, and every chart has a table view. Identity is never
 * carried by color alone.
 */

const percent = (value: number, total: number) =>
  total <= 0 ? 0 : (value / total) * 100;

const formatPercent = (value: number, total: number) => {
  if (total <= 0) return "0%";
  const pct = percent(value, total);
  if (pct > 0 && pct < 1) return "<1%";
  return `${Math.round(pct)}%`;
};

/* ── shared chrome ─────────────────────────────────────────────────────── */

interface ChartCardProps {
  title: string;
  subtitle: string;
  /** Rendered when the reader switches to the table twin. */
  table: React.ReactNode;
  children: React.ReactNode;
  footnote?: React.ReactNode;
}

function ChartCard({ title, subtitle, table, children, footnote }: ChartCardProps) {
  const [asTable, setAsTable] = useState(false);

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 rounded-xl text-muted-foreground"
          onClick={() => setAsTable((current) => !current)}
          aria-pressed={asTable}
        >
          {asTable ? (
            <>
              <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
              Chart
            </>
          ) : (
            <>
              <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
              Table
            </>
          )}
        </Button>
      </header>

      {asTable ? table : children}

      {footnote ? (
        <p className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          {footnote}
        </p>
      ) : null}
    </section>
  );
}

function DataTable({
  head,
  rows,
}: {
  head: [string, string, string];
  rows: { key: string; label: string; value: number; share: string; swatch?: string }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left">
            <th className="pb-2 pr-4 font-medium text-muted-foreground">{head[0]}</th>
            <th className="pb-2 pr-4 text-right font-medium text-muted-foreground">
              {head[1]}
            </th>
            <th className="pb-2 text-right font-medium text-muted-foreground">{head[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-border/40 last:border-0">
              <td className="py-2 pr-4">
                <span className="inline-flex items-center gap-2 text-foreground">
                  {row.swatch ? (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ background: row.swatch }}
                      aria-hidden="true"
                    />
                  ) : null}
                  {row.label}
                </span>
              </td>
              {/* tabular-nums: these two ARE aligned numeric columns. */}
              <td className="py-2 pr-4 text-right tabular-nums text-foreground">
                {formatNumber(row.value)}
              </td>
              <td className="py-2 text-right tabular-nums text-muted-foreground">
                {row.share}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-4 w-full rounded" />
        </div>
      ))}
    </div>
  );
}

/* ── 1. role split — one 100% stacked bar ──────────────────────────────── */

const ROLE_SERIES = [
  { key: "TENANT", label: "Tenants", swatch: "var(--viz-series-1)" },
  { key: "LANDLORD", label: "Landlords", swatch: "var(--viz-series-2)" },
  { key: "ADMIN", label: "Admins", swatch: "var(--viz-series-3)" },
] as const;

export function RoleSplitChart({
  stats,
  isLoading,
}: {
  stats: AdminDashboardStats | undefined;
  isLoading: boolean;
}) {
  const segments = useMemo(() => {
    if (!stats) return [];

    const admins = Math.max(
      0,
      stats.totalUsers - stats.totalTenants - stats.totalLandlords,
    );

    const byKey: Record<string, number> = {
      TENANT: stats.totalTenants,
      LANDLORD: stats.totalLandlords,
      ADMIN: admins,
    };

    return ROLE_SERIES.map((series) => ({
      ...series,
      value: byKey[series.key] ?? 0,
    }));
  }, [stats]);

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const visible = segments.filter((segment) => segment.value > 0);

  const table = (
    <DataTable
      head={["Role", "Users", "Share"]}
      rows={segments.map((segment) => ({
        key: segment.key,
        label: segment.label,
        value: segment.value,
        share: formatPercent(segment.value, total),
        swatch: segment.swatch,
      }))}
    />
  );

  return (
    <ChartCard
      title="Who is on the platform"
      subtitle={
        stats ? `${formatNumber(stats.totalUsers)} accounts by role` : "Accounts by role"
      }
      table={table}
    >
      {isLoading || !stats ? (
        <ChartSkeleton rows={2} />
      ) : total === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">No accounts yet.</p>
      ) : (
        <>
          {/* 2px flex gap exposes the card surface between touching fills. */}
          <div
            className="flex h-6 w-full gap-0.5 overflow-hidden rounded"
            role="img"
            aria-label={visible
              .map(
                (segment) =>
                  `${segment.label}: ${formatNumber(segment.value)} (${formatPercent(segment.value, total)})`,
              )
              .join(", ")}
          >
            {visible.map((segment, index) => {
              const width = percent(segment.value, total);
              const isFirst = index === 0;
              const isLast = index === visible.length - 1;

              return (
                <div
                  key={segment.key}
                  className="flex min-w-[3px] items-center justify-center overflow-hidden"
                  style={{
                    width: `${width}%`,
                    background: segment.swatch,
                    borderRadius: `${isFirst ? "4px" : "0"} ${isLast ? "4px" : "0"} ${isLast ? "4px" : "0"} ${isFirst ? "4px" : "0"}`,
                  }}
                  title={`${segment.label}: ${formatNumber(segment.value)} (${formatPercent(segment.value, total)})`}
                >
                  {width >= 12 ? (
                    <span className="px-1 text-[11px] font-semibold text-white/95">
                      {formatPercent(segment.value, total)}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Legend is always present for a multi-series mark, and carries the
              values as text so nothing depends on telling the hues apart. */}
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {segments.map((segment) => (
              <li key={segment.key} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: segment.swatch }}
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{segment.label}</span>
                <span className="font-medium text-foreground">
                  {formatNumber(segment.value)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatPercent(segment.value, total)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </ChartCard>
  );
}

/* ── 2. property status — nominal magnitudes, one hue ──────────────────── */

export function PropertyStatusChart({
  stats,
  isLoading,
}: {
  stats: AdminDashboardStats | undefined;
  isLoading: boolean;
}) {
  const rows = useMemo(() => {
    if (!stats) return [];

    const other = Math.max(
      0,
      stats.totalProperties - stats.availableProperties - stats.rentedProperties,
    );

    return [
      { key: "AVAILABLE", label: "Available", value: stats.availableProperties },
      { key: "RENTED", label: "Rented", value: stats.rentedProperties },
      { key: "UNAVAILABLE", label: "Unavailable", value: other },
    ];
  }, [stats]);

  const total = stats?.totalProperties ?? 0;
  const max = Math.max(1, ...rows.map((row) => row.value));

  const table = (
    <DataTable
      head={["Availability", "Properties", "Share"]}
      rows={rows.map((row) => ({
        key: row.key,
        label: row.label,
        value: row.value,
        share: formatPercent(row.value, total),
      }))}
    />
  );

  return (
    <ChartCard
      title="Listing availability"
      subtitle={
        stats ? `${formatNumber(total)} properties by state` : "Properties by state"
      }
      table={table}
      footnote="Availability is set by the property owner. Admins can review and remove a listing, but cannot flip its availability."
    >
      {isLoading || !stats ? (
        <ChartSkeleton rows={3} />
      ) : total === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">No properties listed yet.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="text-sm font-medium text-foreground">
                  {formatNumber(row.value)}
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    {formatPercent(row.value, total)}
                  </span>
                </span>
              </div>

              <div
                className="h-3 w-full rounded-sm"
                style={{ background: "var(--viz-track)" }}
                role="img"
                aria-label={`${row.label}: ${formatNumber(row.value)} of ${formatNumber(total)}`}
              >
                {/* Data end rounded 4px, baseline end square. */}
                <div
                  className="h-full min-w-[2px]"
                  style={{
                    width: `${percent(row.value, max)}%`,
                    background: "var(--viz-series-1)",
                    borderRadius: "0 4px 4px 0",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}

/* ── 3. rental pipeline — ordered stages, ordinal ramp ─────────────────── */

const PIPELINE_STAGES = [
  { key: "PENDING", label: "Pending", swatch: "var(--viz-ordinal-1)" },
  { key: "APPROVED", label: "Approved", swatch: "var(--viz-ordinal-2)" },
  { key: "ACTIVE", label: "Active", swatch: "var(--viz-ordinal-3)" },
  { key: "COMPLETED", label: "Completed", swatch: "var(--viz-ordinal-4)" },
] as const;

export function RentalPipelineChart({
  counts,
  isLoading,
}: {
  counts: AdminRentalCounts;
  isLoading: boolean;
}) {
  const rows = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    value: counts[stage.key],
  }));

  const inPipeline = rows.reduce((sum, row) => sum + row.value, 0);
  const max = Math.max(1, ...rows.map((row) => row.value));

  const table = (
    <DataTable
      head={["Stage", "Requests", "Share"]}
      rows={[
        ...rows.map((row) => ({
          key: row.key,
          label: row.label,
          value: row.value,
          share: formatPercent(row.value, inPipeline),
          swatch: row.swatch,
        })),
        {
          key: "REJECTED",
          label: "Rejected (off-pipeline)",
          value: counts.REJECTED,
          share: "—",
        },
      ]}
    />
  );

  return (
    <ChartCard
      title="Rental request pipeline"
      subtitle={`${formatNumber(inPipeline)} requests moving through the funnel`}
      table={table}
      footnote={
        <>
          <span className="font-medium text-foreground">
            {formatNumber(counts.REJECTED)}
          </span>{" "}
          rejected requests are excluded — they leave the pipeline rather than
          advancing through it.
        </>
      }
    >
      {isLoading ? (
        <ChartSkeleton rows={4} />
      ) : inPipeline === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">No rental requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="text-sm font-medium text-foreground">
                  {formatNumber(row.value)}
                </span>
              </div>

              <div
                className="h-3 w-full rounded-sm"
                style={{ background: "var(--viz-track)" }}
                role="img"
                aria-label={`${row.label}: ${formatNumber(row.value)} requests`}
              >
                <div
                  className="h-full min-w-[2px]"
                  style={{
                    width: `${percent(row.value, max)}%`,
                    background: row.swatch,
                    borderRadius: "0 4px 4px 0",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}

/* ── layout ────────────────────────────────────────────────────────────── */

export function AdminCharts({
  stats,
  counts,
  isLoading,
  countsLoading,
  className,
}: {
  stats: AdminDashboardStats | undefined;
  counts: AdminRentalCounts;
  isLoading: boolean;
  countsLoading: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-3", className)}>
      <RoleSplitChart stats={stats} isLoading={isLoading} />
      <PropertyStatusChart stats={stats} isLoading={isLoading} />
      <RentalPipelineChart counts={counts} isLoading={countsLoading} />
    </div>
  );
}
