import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserTableSkeletonProps {
  rows?: number;
}

export default function UserTableSkeleton({ rows = 5 }: UserTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-3 w-40 rounded" />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24 rounded" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-24 rounded-xl" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
