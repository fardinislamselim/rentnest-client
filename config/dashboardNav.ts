import {
  Building2,
  FileText,
  Heart,
  LayoutDashboard,
  PlusCircle,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/types/user";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV_BY_ROLE: Record<UserRole, DashboardNavItem[]> = {
  TENANT: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "My Rentals",
      href: "/dashboard/rental-requests",
      icon: ShoppingCart,
    },
    { label: "Saved Properties", href: "/dashboard/wishlist", icon: Heart },
    {
      label: "Payment History",
      href: "/dashboard/payment-history",
      icon: Wallet,
    },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  LANDLORD: [
    { label: "Overview", href: "/landlord-dashboard", icon: LayoutDashboard },
    {
      label: "Create Property",
      href: "/landlord-dashboard/create-property",
      icon: PlusCircle,
    },
    {
      label: "My Properties",
      href: "/landlord-dashboard/my-properties",
      icon: Building2,
    },
    {
      label: "Rental Requests",
      href: "/landlord-dashboard/requests",
      icon: FileText,
    },
    {
      label: "Payment History",
      href: "/dashboard/payment-history",
      icon: Wallet,
    },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin-dashboard/users", icon: Users },
    {
      label: "Properties",
      href: "/admin-dashboard/properties",
      icon: Building2,
    },
    {
      label: "Rental Requests",
      href: "/admin-dashboard/rentals",
      icon: FileText,
    },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

export const getDashboardNavForRole = (role: UserRole): DashboardNavItem[] =>
  DASHBOARD_NAV_BY_ROLE[role] ?? DASHBOARD_NAV_BY_ROLE.TENANT;

export const getDashboardPageTitle = (
  pathname: string,
  role: UserRole,
): string => {
  const items = getDashboardNavForRole(role);
  const exact = items.find((item) => item.href === pathname);
  if (exact) return exact.label;

  if (pathname.startsWith("/landlord-dashboard/edit-property")) {
    return "Edit Property";
  }
  if (pathname.startsWith("/dashboard/rental-requests/")) {
    return "Rental Details";
  }
  if (pathname.startsWith("/dashboard/payment/")) {
    return "Complete Payment";
  }

  const prefix = items.find(
    (item) => item.href !== "/dashboard" && pathname.startsWith(item.href),
  );
  return prefix?.label ?? "Overview";
};
