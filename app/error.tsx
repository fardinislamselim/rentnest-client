"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-destructive/30 bg-destructive/5 p-8 shadow-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            Something Went Wrong!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error?.message || "An unexpected application error has occurred. Please try again or return home."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto flex-1 rounded-xl gap-2 cursor-pointer"
          >
            <Link href="/">
              <Home className="h-4 w-4" /> Go to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}