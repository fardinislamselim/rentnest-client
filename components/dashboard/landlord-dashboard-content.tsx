"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Building2,
  Home,
  XCircle,
  Clock,
  CheckCircle,
  DollarSign,
  FileText,
  PlusCircle,
  List,
  ArrowUpRight,
  User,
} from "lucide-react";
import { useLandlordDashboard } from "@/hooks/use-landlord-dashboard";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import { RentalStatus } from "@/types/rental";
import type { RentalRequest } from "@/types/rental";
import type { Property } from "@/types/property";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

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
    icon: Home,
    label: "Active",
  },
  COMPLETED: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    icon: CheckCircle,
    label: "Completed",
  },
  };

function RecentItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/30 last:border-0">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export default function LandlordDashboardContent() {
  const { data: stats, isLoading: statsLoading } = useLandlordDashboard();
  const [recentRequests, setRecentRequests] = React.useState<RentalRequest[]>([]);
  const [recentProperties, setRecentProperties] = React.useState<Property[]>([]);
  const [requestsLoading, setRequestsLoading] = React.useState(true);
  const [propertiesLoading, setPropertiesLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const { data } = await api.get("/rentals/requests");
        if (data.success) {
          setRecentRequests(data.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch recent requests:", err);
      } finally {
        setRequestsLoading(false);
      }
    };

    const fetchRecentProperties = async () => {
      try {
        const { data } = await api.get("/properties/my-properties");
        if (data.success) {
          setRecentProperties(data.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch recent properties:", err);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchRecentRequests();
    fetchRecentProperties();
  }, []);

  const statCards = [
    {
      label: "Total Properties",
      value: stats?.totalProperties ?? 0,
      icon: Building2,
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400",
    },
    {
      label: "Available Properties",
      value: stats?.available ?? 0,
      icon: Home,
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
    },
    {
      label: "Unavailable Properties",
      value: stats?.rented ?? 0,
      icon: XCircle,
      color: "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400",
    },
    {
      label: "Pending Requests",
      value: stats?.pendingRequests ?? 0,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
    },
    {
      label: "Approved Requests",
      value: stats?.approvedRentals ?? 0,
      icon: CheckCircle,
      color: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400",
    },
    {
      label: "Total Earnings",
      value: stats?.totalIncome ?? 0,
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
      isCurrency: true,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Stats Cards */}
      {statsLoading ? (
        <DashboardSkeleton count={6} columns="lg" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: statCards.indexOf(stat) * 0.08 }}
                className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      {stat.label}
                    </span>
                    <span className="font-heading text-2xl font-bold text-foreground">
                      {stat.isCurrency
                        ? formatCurrency(stat.value)
                        : stat.value}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Rental Requests */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Recent Rental Requests
          </h2>
          <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            <Link href="/landlord-dashboard/requests" className="flex items-center gap-1">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="p-6">
          {requestsLoading ? (
            Array.from({ length: 5 }).map((_, i) => <RecentItemSkeleton key={i} />)
          ) : recentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                No rental requests yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Rental requests from tenants will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {recentRequests.map((request) => {
                const statusConfig =
                  STATUS_CONFIG[request.status as RentalStatus] ||
                  STATUS_CONFIG.PENDING;
                const StatusIcon = statusConfig.icon;
                const tenantName =
                  request.tenant?.name || "Unknown Tenant";
                const propertyTitle =
                  request.property?.title || "Unknown Property";

                return (
                  <div
                    key={request.id}
                    className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground line-clamp-1">
                        {tenantName}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {propertyTitle}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Properties */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Recent Properties
          </h2>
          <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            <Link href="/landlord-dashboard/my-properties" className="flex items-center gap-1">
              View All <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="p-6">
          {propertiesLoading ? (
            Array.from({ length: 5 }).map((_, i) => <RecentItemSkeleton key={i} />)
          ) : recentProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                No properties yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Start by posting your first property listing.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80"}
                      alt={property.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground line-clamp-1">
                      {property.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {property.location}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(property.price)}/mo
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 cursor-pointer">
            <Link href="/landlord-dashboard/create-property" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Post New Property
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl gap-2 cursor-pointer">
               <Link href="/landlord-dashboard/my-properties" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Manage Properties
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl gap-2 cursor-pointer">
            <Link href="/landlord-dashboard/requests" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Review Requests
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
