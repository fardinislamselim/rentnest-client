import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-background relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3.5 py-2 rounded-xl bg-card border border-border/50 shadow-sm backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center gap-2 z-10 text-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Home className="h-5 w-5" />
          </div>
          <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Rent<span className="text-blue-600 dark:text-blue-400">Nest</span>
          </span>
        </Link>
      </div>

      {/* Centered Auth Container */}
      <div className="w-full max-w-md z-10">
        {children}
      </div>
    </div>
  );
}
