"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  ShoppingCart,
  Menu,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMe } from "@/hooks/use-me";
import { logoutAction } from "@/app/(auth)/_action/logoutAction";
import type { User, UserRole } from "@/types/user";
import { UserAvatar } from "@/components/dashboard/user-avatar";
import * as React from "react";

interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const landlordNav: SidebarNavItem[] = [
  { label: "Overview", href: "/landlord-dashboard", icon: LayoutDashboard },
  { label: "Create Property", href: "/landlord-dashboard/create-property", icon: PlusCircle },
  { label: "My Properties", href: "/landlord-dashboard/my-properties", icon: Building2 },
  { label: "Rental Requests", href: "/landlord-dashboard/requests", icon: FileText },
  { label: "Payment History", href: "/dashboard/payment-history", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];

const tenantNav: SidebarNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Rentals", href: "/dashboard/rental-requests", icon: ShoppingCart },
  { label: "Payment History", href: "/dashboard/payment-history", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];

const adminNav: SidebarNavItem[] = [
  { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Building2 },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

function getNavForRole(role: UserRole): SidebarNavItem[] {
  switch (role) {
    case "LANDLORD":
      return landlordNav;
    case "ADMIN":
      return adminNav;
    case "TENANT":
    default:
      return tenantNav;
  }
}

export function DashboardSidebar({ user }: { user?: User | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { data: clientUser } = useMe();
  const currentUser = user ?? clientUser;
  const actualUser = (currentUser as { data?: User } | null)?.data ?? currentUser;
  const userRole = actualUser?.role ?? "TENANT";

  const navItems = getNavForRole(userRole);
  const bgColor =
    userRole === "LANDLORD"
      ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
      : userRole === "ADMIN"
        ? "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400"
        : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400";

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bgColor)}>
            <Home className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold">RentNest</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border/40">
        <UserAvatar user={actualUser} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
              {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border/40">
        <form action={logoutAction} className="m-0">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 z-50 rounded-xl border border-border/60 bg-card md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden w-64 flex-col border-r border-border/40 bg-card md:flex">
        {sidebarContent}
      </div>
    </>
  );
}
