import React from "react";
import Container from "@/components/layout/container";
import { getMe } from "@/service/getMe";
import { ShieldCheck, Users, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const user = await getMe();

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> System Administration
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Admin Console - {user?.name || "Admin"}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage platform users, property verification, and system metrics.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Total Users
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    Platform Admin
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Listings Overview
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    Verified Properties
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Admin Quick Links
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 cursor-pointer">
                <Link href="/properties">Browse All Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}