"use client";

import { useRentalRequests } from "@/hooks/use-rental-requests";
import { useRentalRequestActions } from "@/hooks/use-update-rental-request";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { RentalStatus } from "@/types/rental";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  RentalStatus,
  { color: string; bgColor: string; icon: React.ElementType; label: string }
> = {
  PENDING: {
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    icon: Clock,
    label: "Pending",
  },
  APPROVED: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: {
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    icon: XCircle,
    label: "Rejected",
  },
  ACTIVE: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    icon: CheckCircle,
    label: "Active",
  },
  COMPLETED: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    icon: CheckCircle,
    label: "Completed",
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatusBadge({ status }: { status: RentalStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;
  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 border-0 text-xs font-medium",
        config.bgColor,
        config.color
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function RequestSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-4 w-32 rounded" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16 rounded" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20 rounded" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-8 w-36 rounded-xl" /></TableCell>
    </TableRow>
  );
}

export default function RentalRequestsTable() {
  const { data: requests, isLoading, error } = useRentalRequests();
  const { approveRequest, rejectRequest, isSubmitting } = useRentalRequestActions();

  const handleApprove = async (id: string) => {
    await approveRequest(id);
  };

  const handleReject = async (id: string) => {
    await rejectRequest(id);
  };

  if (isLoading) {
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
            {Array.from({ length: 5 }).map((_, i) => (
              <RequestSkeleton key={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-4">
          <Clock className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Failed to load requests
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          There was an error loading rental requests. Please try again later.
        </p>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-500/10 mb-6">
          <Clock className="h-10 w-10 text-gray-500 dark:text-gray-400" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
          No rental requests yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Rental requests from tenants will appear here when they apply for your
          properties.
        </p>
      </div>
    );
  }

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
          {requests.map((request) => {
            const tenantName = request.tenant?.name || "Unknown Tenant";
            const propertyTitle = request.property?.title || "Unknown Property";
            const rent = request.property?.price || 0;
            const requestDate = request.createdAt
              ? new Date(request.createdAt).toLocaleDateString("en-BD", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A";
            const status = request.status as RentalStatus;
            const isPending = status === "PENDING";

            return (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                      <span className="h-4 w-4 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center text-xs font-bold text-white">
                        {tenantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">{tenantName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {propertyTitle}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatCurrency(rent)}/mo
                </TableCell>
                <TableCell className="text-muted-foreground">{requestDate}</TableCell>
                <TableCell>
                  <StatusBadge status={status} />
                </TableCell>
                <TableCell className="text-right">
                  {isPending ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-green-500/40 text-green-600 hover:bg-green-500/10 cursor-pointer"
                        onClick={() => handleApprove(request.id)}
                        disabled={isSubmitting}
                      >
                        ✅ Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-red-500/40 text-red-600 hover:bg-red-500/10 cursor-pointer"
                        onClick={() => handleReject(request.id)}
                        disabled={isSubmitting}
                      >
                        ❌ Reject
                      </Button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-border/60 hover:bg-muted/60 cursor-pointer"
                    >
                      <Link href={`/rentals/${request.id}`} className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
