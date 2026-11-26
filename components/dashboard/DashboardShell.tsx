"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  House,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";

import { logoutAction } from "@/app/(auth)/_action/logoutAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  getDashboardNavForRole,
  getDashboardPageTitle,
} from "@/config/dashboardNav";
import { useMe } from "@/hooks/use-me";
import { initialsOf } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { User, UserRole } from "@/types/user";

const ROLE_BADGE: Record<UserRole, string> = {
  LANDLORD: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ADMIN: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  TENANT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function DashboardShell({
  user,
  children,
}: {
  user?: User | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: clientUser } = useMe();

  const currentUser = user ?? clientUser;
  const actualUser =
    (currentUser as { data?: User } | null)?.data ?? currentUser;
  const userRole: UserRole = actualUser?.role ?? "TENANT";
  const navItems = getDashboardNavForRole(userRole);
  const pageTitle = getDashboardPageTitle(pathname, userRole);

  const renderSidebarBody = (isCollapsed: boolean, isMobile = false) => (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border/50",
          isCollapsed ? "justify-center px-2" : "px-5",
        )}
      >
        {isCollapsed ? (
          <Link
            href="/"
            title="RentNest Home"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50/70 text-blue-600 shadow-xs transition-colors hover:border-blue-300 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/20 dark:text-blue-400"
          >
            <House className="h-5 w-5" aria-hidden="true" />
          </Link>
        ) : (
          <Logo />
        )}
      </div>

      {/* Compact User Profile Card */}
      <div
        className={cn(
          "shrink-0 border-b border-border/50",
          isCollapsed ? "flex justify-center p-3" : "p-4",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center",
          )}
          title={
            isCollapsed
              ? `${actualUser?.name || "User"} (${userRole})`
              : undefined
          }
        >
          <Avatar className="h-9 w-9 shrink-0 border border-border/60">
            {actualUser?.avatar ? (
              <AvatarImage
                src={actualUser.avatar}
                alt={actualUser.name || "User"}
              />
            ) : (
              <AvatarFallback
                className={cn("text-xs font-bold", ROLE_BADGE[userRole])}
              >
                {initialsOf(actualUser?.name || "U")}
              </AvatarFallback>
            )}
          </Avatar>
          {!isCollapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {actualUser?.name || "Account"}
              </p>
              <span
                className={cn(
                  "mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  ROLE_BADGE[userRole],
                )}
              >
                {userRole}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Scrollable Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              onClick={() => {
                if (isMobile) setMobileOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isCollapsed && "justify-center px-2",
                isActive
                  ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!isCollapsed ? (
                <>
                  <span className="truncate">{item.label}</span>
                  {isActive ? (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  ) : null}
                </>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="shrink-0 border-t border-border/50 p-3">
        <form action={logoutAction} className="m-0">
          <Button
            type="submit"
            variant="ghost"
            title={isCollapsed ? "Logout" : undefined}
            className={cn(
              "w-full cursor-pointer gap-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400",
              isCollapsed ? "justify-center px-2" : "justify-start px-3",
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!isCollapsed ? <span>Logout</span> : null}
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Static / Collapsible Left Sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-border/50 bg-card transition-all duration-300 lg:flex lg:flex-col",
          collapsed ? "w-20" : "w-64",
        )}
      >
        {renderSidebarBody(collapsed)}
      </aside>

      {/* Right App Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Sticky Top Dashboard Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="h-9 w-9 rounded-xl border border-border/60 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                {renderSidebarBody(false, true)}
              </SheetContent>
            </Sheet>

            {/* Desktop Collapse Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden h-9 w-9 cursor-pointer rounded-xl border border-border/60 lg:inline-flex"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            <h2 className="font-heading truncate text-base font-bold text-foreground sm:text-lg">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden rounded-xl border-border/60 sm:inline-flex"
            >
              <Link href="/properties" className="gap-1.5">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Browse Properties
              </Link>
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="flex cursor-pointer items-center gap-2 rounded-full border border-border/60 p-0.5 transition-colors hover:border-blue-500/40"
                >
                  <Avatar className="h-8 w-8">
                    {actualUser?.avatar ? (
                      <AvatarImage
                        src={actualUser.avatar}
                        alt={actualUser.name || "User"}
                      />
                    ) : (
                      <AvatarFallback
                        className={cn("text-xs font-bold", ROLE_BADGE[userRole])}
                      >
                        {initialsOf(actualUser?.name || "U")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {actualUser?.name || "Account"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {actualUser?.email || ""}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/properties" className="cursor-pointer">
                    <Building2 className="mr-2 h-4 w-4" />
                    Browse Properties
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={logoutAction} className="w-full">
                    <button
                      type="submit"
                      className="flex w-full cursor-pointer items-center text-rose-600 dark:text-rose-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Independently Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
