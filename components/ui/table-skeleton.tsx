import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  avatar?: boolean;
  action?: boolean;
  badge?: boolean;
  striped?: boolean;
}

export default function TableSkeleton({
  columns,
  rows = 5,
  avatar = false,
  action = false,
  badge = false,
  striped = true,
}: TableSkeletonProps) {
  const badgeIndex = action ? columns - 2 : columns - 1;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className={`h-3 ${i === 0 && avatar ? "w-24" : "w-16"} rounded`} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              className={striped && rowIndex % 2 === 1 ? "bg-muted/25" : undefined}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const isFirst = colIndex === 0;
                const isLast = colIndex === columns - 1;
                let widthClass = "w-20";
                if (isFirst && avatar) widthClass = "w-32";
                if (isLast && action) widthClass = "w-20";
                if (badge && colIndex === badgeIndex) widthClass = "w-20";

                return (
                  <TableCell key={colIndex}>
                    {isFirst && avatar ? (
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28 rounded" />
                          <Skeleton className="h-3 w-40 rounded" />
                        </div>
                      </div>
                    ) : isLast && action ? (
                      <div className="flex justify-end">
                        <Skeleton className="h-8 w-20 rounded-xl" />
                      </div>
                    ) : badge && colIndex === badgeIndex ? (
                      <Skeleton className="h-6 w-20 rounded-full" />
                    ) : isFirst ? (
                      <Skeleton className={`h-4 ${widthClass} rounded`} />
                    ) : isLast && !action && !badge ? (
                      <div className="flex justify-end">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    ) : (
                      <Skeleton className={`h-4 ${widthClass} rounded`} />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
