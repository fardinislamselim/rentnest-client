"use client";

import { LogOut, Menu, Search, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { logoutAction } from "@/app/(auth)/_action/logoutAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useMe } from "@/hooks/use-me";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

interface NavbarProps {
  user?: User | null;
  variant?: "public" | "dashboard";
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ user, variant = "public" }: NavbarProps) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { data: clientUser } = useMe();
  const currentUser = user ?? clientUser;
  const actualUser = (currentUser as { data?: User } | null)?.data ?? currentUser;
  const userRole = actualUser?.role;

  const isDashboard = variant === "dashboard";
  const dashboardHref =
    userRole === "LANDLORD"
      ? "/landlord-dashboard"
      : userRole === "ADMIN"
      ? "/admin-dashboard"
      : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 shadow-sm backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Logo />
        </div>

        {!isDashboard && (
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1.5 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="hidden items-center gap-4 md:flex">
          {!isDashboard && (
            <div className="relative flex items-center">
              <div
                className={cn(
                  "flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 transition-all duration-300",
                  searchOpen
                    ? "w-48 bg-background ring-2 ring-blue-500/10 lg:w-64"
                    : "w-10 cursor-pointer overflow-hidden",
                )}
                onClick={() => !searchOpen && setSearchOpen(true)}
              >
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className={cn(
                    "w-full border-0 bg-transparent pl-2 text-xs outline-none placeholder:text-muted-foreground",
                    !searchOpen && "pointer-events-none opacity-0",
                  )}
                  onBlur={() => setSearchOpen(false)}
                  autoFocus={searchOpen}
                />
              </div>
            </div>
          )}

          <ThemeToggle />

          {currentUser ? (
            <div className="flex items-center gap-3">
              {isDashboard ? (
                <Link
                  href={dashboardHref}
                  className={cn(
                    "rounded-lg border border-border/60 bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/80",
                    pathname === dashboardHref && "bg-blue-600 text-white hover:bg-blue-700",
                  )}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href={dashboardHref}
                  className="rounded-lg border border-border/60 bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/80"
                >
                  Dashboard
                </Link>
              )}

              {userRole === "TENANT" && isDashboard && (
                <>
                  <Link
                    href="/dashboard/rental-requests"
                    className={cn(
                      "rounded-lg border border-border/60 bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/80",
                      pathname.startsWith("/dashboard/rental-requests") && "bg-blue-600 text-white hover:bg-blue-700",
                    )}
                  >
                    Rental Requests
                  </Link>
                  <Link
                    href="/dashboard/payment-history"
                    className={cn(
                      "rounded-lg border border-border/60 bg-muted px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/80",
                      pathname.startsWith("/dashboard/payment-history") && "bg-blue-600 text-white hover:bg-blue-700",
                    )}
                  >
                    Payment History
                  </Link>
                </>
              )}

              <form action={logoutAction} className="m-0">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-lg border-border/60 px-3 py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </form>

              <Avatar size="sm" className="border border-border/60 bg-muted">
                {currentUser?.avatar ? (
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                ) : (
                  <AvatarFallback>
                    {currentUser?.name
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || <UserCircle className="h-4 w-4" />}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                className="cursor-pointer hover:bg-muted/80"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="cursor-pointer rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/10 hover:bg-blue-700"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg border border-border/40 hover:bg-muted/80"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[300px] flex-col justify-between p-6"
            >
              <div className="flex flex-col gap-6">
                <SheetHeader className="border-b border-border/40 pb-4 text-left">
                  <SheetTitle className="flex items-center justify-between">
                    <Logo showText={true} />
                  </SheetTitle>
                </SheetHeader>

                {!isDashboard && (
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "rounded-lg px-2 py-1.5 text-base font-semibold transition-colors duration-200",
                            isActive
                              ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          )}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </nav>
                )}

                {currentUser ? (
                  <div className="flex flex-col gap-3 border-t border-border/40 pt-4">
                    {isDashboard && (
                      <Link
                        href={dashboardHref}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-lg border border-border/60 bg-muted px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/80",
                          pathname === dashboardHref && "bg-blue-600 text-white hover:bg-blue-700",
                        )}
                      >
                        Dashboard
                      </Link>
                    )}
                    {userRole === "TENANT" && isDashboard && (
                      <>
                        <Link
                          href="/dashboard/rental-requests"
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "rounded-lg border border-border/60 bg-muted px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/80",
                            pathname.startsWith("/dashboard/rental-requests") && "bg-blue-600 text-white hover:bg-blue-700",
                          )}
                        >
                          Rental Requests
                        </Link>
                        <Link
                          href="/dashboard/payment-history"
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "rounded-lg border border-border/60 bg-muted px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/80",
                            pathname.startsWith("/dashboard/payment-history") && "bg-blue-600 text-white hover:bg-blue-700",
                          )}
                        >
                          Payment History
                        </Link>
                      </>
                    )}
                    {!isDashboard && (
                      <Link
                        href={dashboardHref}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg border border-border/60 bg-muted px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted/80"
                      >
                        Dashboard
                      </Link>
                    )}
                    <form action={logoutAction} className="m-0">
                      <Button
                        type="submit"
                        className="w-full rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 border-t border-border/40 pt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
