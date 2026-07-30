"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  Search, 
  LogOut, 
  LayoutDashboard, 
  User, 
  ChevronDown,
  ShieldAlert,
  Building,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, initialize, loginMock } = useAuth();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Initialize Auth state on client mount
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const handleMockLogin = (role: "TENANT" | "LANDLORD" | "ADMIN") => {
    loginMock(role);
    toast.success(`Logged in as Mock ${role}!`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out.");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200 py-1.5",
                  isActive 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {/* Active sliding indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Desktop Search, Theme, Auth */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Desktop Search Bar */}
          <div className="relative flex items-center">
            <div 
              className={cn(
                "flex items-center border border-border/60 bg-muted/40 rounded-full transition-all duration-300 px-3 py-1",
                searchOpen ? "w-48 lg:w-64 border-blue-500/50 ring-2 ring-blue-500/10 bg-background" : "w-10 overflow-hidden cursor-pointer"
              )}
              onClick={() => !searchOpen && setSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search properties..."
                className={cn(
                  "bg-transparent border-0 outline-none text-xs w-full pl-2 placeholder:text-muted-foreground",
                  !searchOpen && "pointer-events-none opacity-0"
                )}
                onBlur={() => setSearchOpen(false)}
                autoFocus={searchOpen}
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Authentication Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 outline-none group cursor-pointer">
                  <Avatar className="h-8 w-8 ring-1 ring-border group-hover:ring-blue-500/50 transition-all duration-300">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1.5 p-1.5">
                <DropdownMenuLabel className="p-2 font-normal flex flex-col">
                  <span className="font-semibold text-sm text-foreground">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  <span className="inline-flex w-fit items-center gap-1 mt-1.5 text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {user.role}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard" className="flex items-center gap-2 w-full">
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login dropdown with mock options for testing */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="cursor-pointer hover:bg-muted/80">
                    Login
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-1.5 mt-1.5">
                  <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">Mock Profiles for Demo</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleMockLogin("TENANT")} className="cursor-pointer">
                    <UserCheck className="h-4 w-4 text-blue-500 mr-2" />
                    <span>Tenant Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMockLogin("LANDLORD")} className="cursor-pointer">
                    <Building className="h-4 w-4 text-indigo-500 mr-2" />
                    <span>Landlord Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMockLogin("ADMIN")} className="cursor-pointer">
                    <ShieldAlert className="h-4 w-4 text-amber-500 mr-2" />
                    <span>Admin Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/login" className="flex items-center gap-2 w-full text-blue-600 dark:text-blue-400 font-medium">
                      <User className="h-4 w-4" />
                      <span>Go to Login Route</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-500/10 cursor-pointer">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Header Elements */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-border/40 hover:bg-muted/80">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-[300px] flex flex-col justify-between p-6">
              <div className="flex flex-col gap-6">
                <SheetHeader className="text-left border-b border-border/40 pb-4">
                  <SheetTitle className="flex items-center justify-between">
                    <Logo showText={true} />
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "text-base font-semibold px-2 py-1.5 rounded-lg transition-colors duration-200",
                          isActive
                            ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                  {/* Dashboard link in mobile navbar if logged in */}
                  {user && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "text-base font-semibold px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-2",
                        pathname === "/dashboard"
                          ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                </nav>
              </div>

              {/* Mobile Auth & User Profile Section at bottom */}
              <div className="border-t border-border/40 pt-4 flex flex-col gap-4">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-blue-500/10 text-blue-600">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-foreground truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {user.role}
                      </span>
                    </div>

                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-lg"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-3 gap-1">
                      <Button 
                        variant="outline" 
                        size="xs" 
                        onClick={() => {
                          handleMockLogin("TENANT");
                          setMobileOpen(false);
                        }}
                        className="text-[10px]"
                      >
                        Tenant (Mock)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="xs" 
                        onClick={() => {
                          handleMockLogin("LANDLORD");
                          setMobileOpen(false);
                        }}
                        className="text-[10px]"
                      >
                        Landlord (Mock)
                      </Button>
                      <Button 
                        variant="outline" 
                        size="xs" 
                        onClick={() => {
                          handleMockLogin("ADMIN");
                          setMobileOpen(false);
                        }}
                        className="text-[10px]"
                      >
                        Admin (Mock)
                      </Button>
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login" onClick={() => setMobileOpen(false)}>Login Page</Link>
                    </Button>
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/register" onClick={() => setMobileOpen(false)}>Register</Link>
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
