import React from "react";

import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { cn } from "@/lib/utils";

interface SafeHtmlRendererProps {
  html?: string | null;
  className?: string;
}

export function SafeHtmlRenderer({ html, className }: SafeHtmlRendererProps) {
  if (!html || !html.trim()) {
    return (
      <p className="text-sm text-muted-foreground">
        No description available for this property.
      </p>
    );
  }

  const cleanHtml = sanitizeHtml(html);

  return (
    <div
      className={cn(
        "space-y-3 text-sm leading-relaxed text-muted-foreground",
        "[&_h2]:font-heading [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground",
        "[&_h3]:font-heading [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_p]:leading-relaxed",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_b]:font-semibold [&_b]:text-foreground",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
        "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500/60 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/80",
        "[&_a]:font-medium [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-700 dark:[&_a]:text-blue-400",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
