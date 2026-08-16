import React from "react";
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 bg-background p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Loading RentNest...
        </h2>
        <p className="text-xs text-muted-foreground">
          Please wait while we load your page.
        </p>
      </div>
    </div>
  );
}