"use client";

import {
  Ban,
  CheckCircle,
  Clock,
  DoorOpen,
  KeyRound,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types/admin";
import type { RentalStatus } from "@/types/rental";
import type { UserRole, UserStatus } from "@/types/user";

/**
 * Status is never carried by color alone — every badge pairs its tint with an
 * icon and a text label, which is also what keeps them readable in forced-colors
 * mode and in print.
 */

type BadgeConfig = {
  color: string;
  bgColor: string;
  icon: React.ElementType;
  label: string;
};

const RENTAL_STATUS_CONFIG: Record<RentalStatus, BadgeConfig> = {
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
    icon: KeyRound,
    label: "Active",
  },
  COMPLETED: {
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    icon: CheckCircle,
    label: "Completed",
  },
};

const PROPERTY_STATUS_CONFIG: Record<PropertyStatus, BadgeConfig> = {
  AVAILABLE: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    icon: DoorOpen,
    label: "Available",
  },
  RENTED: {
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    icon: KeyRound,
    label: "Rented",
  },
  UNAVAILABLE: {
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    icon: XCircle,
    label: "Unavailable",
  },
};

const USER_STATUS_CONFIG: Record<UserStatus, BadgeConfig> = {
  ACTIVE: {
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    icon: CheckCircle,
    label: "Active",
  },
  BANNED: {
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    icon: Ban,
    label: "Banned",
  },
};

const ROLE_CONFIG: Record<UserRole, BadgeConfig> = {
  ADMIN: {
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-500/10",
    icon: ShieldCheck,
    label: "ADMIN",
  },
  LANDLORD: {
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    icon: KeyRound,
    label: "LANDLORD",
  },
  TENANT: {
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-500/10",
    icon: Sparkles,
    label: "TENANT",
  },
};

function ConfigBadge({ config }: { config: BadgeConfig }) {
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1.5 border-0 text-xs font-medium",
        config.bgColor,
        config.color,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {config.label}
    </Badge>
  );
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return <ConfigBadge config={RENTAL_STATUS_CONFIG[status] ?? RENTAL_STATUS_CONFIG.PENDING} />;
}

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <ConfigBadge
      config={PROPERTY_STATUS_CONFIG[status] ?? PROPERTY_STATUS_CONFIG.UNAVAILABLE}
    />
  );
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <ConfigBadge config={USER_STATUS_CONFIG[status] ?? USER_STATUS_CONFIG.ACTIVE} />;
}

export function UserRoleBadge({ role }: { role: UserRole }) {
  return <ConfigBadge config={ROLE_CONFIG[role] ?? ROLE_CONFIG.TENANT} />;
}
