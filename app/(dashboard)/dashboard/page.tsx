import React from "react";
import Container from "@/components/layout/container";
import { getMe } from "@/service/getMe";
import { UserCircle, Building2, Heart, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getMe();

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Welcome Back{user?.name ? `, ${user.name}` : ""}!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage your rental activities, properties, and account settings.
            </p>
          </div>

          {/* User overview card */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Account Role
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    {user?.role || "TENANT"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Email: {user?.email || "N/A"}
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Active Rentals
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    0 Active
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Explore available properties to rent.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Saved Homes
                  </span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    0 Favorites
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Bookmark properties while browsing.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Link href="/properties" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Browse Properties
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Go to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}