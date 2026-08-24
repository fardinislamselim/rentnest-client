import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RequestTableSkeletonProps {
  rows?: number;
}

export default function RequestTableSkeleton({
  rows = 5,
}: RequestTableSkeletonProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Rent</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20 rounded" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-36 rounded-xl" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
