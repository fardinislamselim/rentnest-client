"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user?: User | null;
  showDetails?: boolean;
  className?: string;
}

export function UserAvatar({ user, showDetails = true, className }: UserAvatarProps) {
  const actualUser = (user as { data?: User } | null)?.data ?? user;

  const initials = actualUser?.name
    ? actualUser.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const roleColor =
    actualUser?.role === "LANDLORD"
      ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
      : actualUser?.role === "ADMIN"
        ? "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400"
        : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400";

  if (!actualUser) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className={cn("h-10 w-10", className)}>
          <AvatarFallback className="bg-muted">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        {showDetails && (
          <>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">Guest</span>
              <span className="text-xs text-muted-foreground">Sign in</span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <Link
      href={
        actualUser.role === "LANDLORD"
          ? "/landlord-dashboard"
          : actualUser.role === "ADMIN"
            ? "/admin-dashboard"
            : "/dashboard"
      }
      className="flex items-center gap-3"
    >
      <Avatar className={cn("h-10 w-10 border border-border/60", className)}>
        {actualUser.avatar ? (
          <AvatarImage src={actualUser.avatar} alt={actualUser.name} />
        ) : (
          <AvatarFallback className={roleColor}>{initials}</AvatarFallback>
        )}
      </Avatar>
      {showDetails && (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{actualUser.name}</span>
          <span className="text-xs text-muted-foreground">{actualUser.email}</span>
        </div>
      )}
    </Link>
  );
}
