"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Home,
  List,
  PlusCircle,
  Settings,
  ShieldCheck,
  User as UserIcon,
  XCircle,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { DashboardStatsSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLandlordDashboard } from "@/hooks/use-landlord-dashboard";
import { api } from "@/lib/axios";
import type { Property } from "@/types/property";
import type { RentalRequest, RentalStatus } from "@/types/rental";
import type { User } from "@/types/user";

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

const QUICK_ACTIONS = [
  {
    href: "/landlord-dashboard/create-property",
    label: "Post New Property",
    description: "Publish a new rental listing",
    icon: PlusCircle,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    href: "/landlord-dashboard/my-properties",
    label: "Manage Properties",
    description: "Edit photos, pricing & availability",
    icon: List,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/landlord-dashboard/requests",
    label: "Review Requests",
    description: "Approve, reject or complete stays",
    icon: FileText,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    href: "/settings",
    label: "Account & Security Settings",
    description: "Update profile photo and password",
    icon: Settings,
    accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

export default function LandlordDashboardContent({
  user,
}: {
  user?: User | null;
}) {
  const { data: stats, isLoading: statsLoading } = useLandlordDashboard();
  const [recentRequests, setRecentRequests] = React.useState<RentalRequest[]>(
    [],
  );
  const [recentProperties, setRecentProperties] = React.useState<Property[]>(
    [],
  );
  const [requestsLoading, setRequestsLoading] = React.useState(true);
  const [propertiesLoading, setPropertiesLoading] = React.useState(true);
  const [requestsError, setRequestsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const { data } = await api.get("/rentals/requests");
        if (data.success) {
          setRecentRequests(data.data.slice(0, 5));
        }
      } catch {
        setRequestsError("Failed to load rental requests");
      } finally {
        setRequestsLoading(false);
      }
    };

    const fetchRecentProperties = async () => {
      try {
        const { data } = await api.get("/properties/my-properties");
        if (data.success) {
          setRecentProperties(data.data.slice(0, 4));
        }
      } finally {
        setPropertiesLoading(false);
      }
    };

    void fetchRecentRequests();
    void fetchRecentProperties();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* 4-Card Primary KPI Row */}
      {statsLoading ? (
        <DashboardStatsSkeleton count={4} columns="lg" />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Properties"
            value={stats?.totalProperties ?? 0}
            subtitle="Published listings"
            href="/landlord-dashboard/my-properties"
            icon={Building2}
            accentClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            label="Available Listings"
            value={stats?.available ?? 0}
            subtitle="Open for booking"
            href="/landlord-dashboard/my-properties"
            icon={Home}
            accentClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label="Pending Requests"
            value={stats?.pendingRequests ?? 0}
            subtitle="Awaiting your decision"
            href="/landlord-dashboard/requests"
            icon={Clock}
            accentClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          />
          <StatCard
            label="Total Earnings"
            value={formatCurrency(stats?.totalIncome ?? 0)}
            subtitle="Completed rental income"
            href="/dashboard/payment-history"
            icon={DollarSign}
            accentClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
          />
        </div>
      )}

      {/* Main Content Hierarchy */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Recent Requests & Properties */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-border/60 bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                Recent Rental Requests
              </CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Link
                  href="/landlord-dashboard/requests"
                  className="flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {requestsLoading ? (
                <div className="divide-y divide-border/40">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-3.5">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3 rounded" />
                        <Skeleton className="h-3 w-1/2 rounded" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : requestsError ? (
                <EmptyState
                  icon={AlertCircle}
                  title="Could not load requests"
                  description={requestsError}
                  className="border-0 bg-transparent py-8"
                />
              ) : recentRequests.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No rental requests yet"
                  description="Incoming tenant applications will appear here."
                  className="border-0 bg-transparent py-8"
                />
              ) : (
                <div className="divide-y divide-border/40">
                  {recentRequests.map((request) => {
                    const statusConfig =
                      STATUS_CONFIG[request.status as RentalStatus] ||
                      STATUS_CONFIG.PENDING;
                    const StatusIcon = statusConfig.icon;
                    return (
                      <div
                        key={request.id}
                        className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <UserIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-1 font-semibold text-foreground">
                            {request.tenant?.name || "Unknown Tenant"}
                          </h4>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {request.property?.title || "Unknown Property"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.color}`}
                        >
                          <StatusIcon className="h-3 w-3" aria-hidden="true" />
                          {statusConfig.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                Recent Properties
              </CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                <Link
                  href="/landlord-dashboard/my-properties"
                  className="flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {propertiesLoading ? (
                <div className="divide-y divide-border/40">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-3.5">
                      <Skeleton className="h-12 w-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3 rounded" />
                        <Skeleton className="h-3 w-1/2 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentProperties.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="No properties yet"
                  description="Create your first listing to start receiving rental requests."
                  actionLabel="Post New Property"
                  actionHref="/landlord-dashboard/create-property"
                  className="border-0 bg-transparent py-8"
                />
              ) : (
                <div className="divide-y divide-border/40">
                  {recentProperties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/landlord-dashboard/edit-property/${property.id}`}
                      className="flex items-center gap-4 rounded-xl py-3 transition-colors hover:bg-muted/30 first:pt-0 last:pb-0"
                    >
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={
                            property.primaryImage ||
                            property.images?.[0] ||
                            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={property.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-1 font-semibold text-foreground">
                          {property.title}
                        </h4>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {property.location}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-foreground">
                        {formatCurrency(property.price)}/mo
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Quick Actions & Account Summary */}
        <div className="flex flex-col gap-5">
          <Card className="border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/40 pt-2">
              {QUICK_ACTIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3.5 py-3.5 transition-colors first:pt-2 last:pb-1"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.accent}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.label}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card">
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Account Status
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {user?.role ?? "LANDLORD"} • {user?.status ?? "ACTIVE"}
                  </p>
                </div>
              </div>
              <Link
                href="/settings"
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Manage
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
