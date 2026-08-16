import React from "react";
import Link from "next/link";
import { Building2, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border/60 bg-card p-8 shadow-xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
          <Building2 className="h-10 w-10" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Error 404
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sorry, the page or rental listing you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
          <Button
            asChild
            className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 cursor-pointer"
          >
            <Link href="/">
              <Home className="h-4 w-4" /> Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto flex-1 rounded-xl gap-2 cursor-pointer"
          >
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4" /> Browse Properties
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}