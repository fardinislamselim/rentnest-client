"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  IMAGE_ACCEPT_ATTR,
  MAX_IMAGE_BYTES,
  validateImageFile,
} from "@/lib/upload-image";
import { cn } from "@/lib/utils";

export interface SingleImageUploadProps {
  /** Currently selected File or existing remote image URL. */
  value?: File | string | null;
  /** Called with the validated File on pick/drop, or `null` on remove. */
  onChange: (file: File | null) => void;
  /** Optional callback when an existing remote URL is cleared. */
  onRemoveExisting?: () => void;
  /** Preview shape: rectangular cover (default) or circular avatar. */
  previewShape?: "wide" | "circle";
  /** Optional helper text shown in the dropzone. */
  hint?: string;
  /** Disables interaction while an upload/submit is running. */
  disabled?: boolean;
  /** Shows a loading overlay on the preview. */
  isBusy?: boolean;
  /** Accessible label for the upload button / dropzone. */
  label?: string;
  maxBytes?: number;
  className?: string;
}

const DEFAULT_HINT = "JPEG, PNG, WebP or AVIF up to 5 MB.";

export function SingleImageUpload({
  value,
  onChange,
  onRemoveExisting,
  previewShape = "wide",
  hint = DEFAULT_HINT,
  disabled = false,
  isBusy = false,
  label = "Upload image",
  maxBytes = MAX_IMAGE_BYTES,
  className,
}: SingleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const objectUrl = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    return null;
  }, [value]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const previewUrl =
    objectUrl ?? (typeof value === "string" && value.trim() ? value : null);

  const handleFile = (file: File) => {
    const validationError = validateImageFile(file, maxBytes);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onChange(file);
  };

  const handleClear = () => {
    setError(null);
    if (value instanceof File) {
      onChange(null);
    } else if (typeof value === "string") {
      onRemoveExisting?.();
      onChange(null);
    }
  };

  const isDisabled = disabled || isBusy;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!isDisabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (isDisabled) return;
          const file = event.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "relative rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 transition-colors",
          isDragging && "border-blue-500 bg-blue-500/5",
          error && "border-rose-500/70 bg-rose-500/5",
          isDisabled && "opacity-70",
        )}
      >
        {previewUrl ? (
          <div
            className={cn(
              "flex flex-col gap-4 sm:flex-row sm:items-center",
              previewShape === "circle" ? "items-start" : "",
            )}
          >
            <div
              className={cn(
                "relative shrink-0 overflow-hidden border border-border/60 bg-muted",
                previewShape === "circle"
                  ? "h-20 w-20 rounded-full"
                  : "h-32 w-full rounded-xl sm:w-48",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={label}
                className="h-full w-full object-cover"
              />
              {isBusy ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                  <Loader2
                    className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
              ) : null}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <p className="truncate text-sm font-medium text-foreground">
                {value instanceof File ? value.name : "Current image"}
              </p>
              <p className="text-xs text-muted-foreground">{hint}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border/60"
                  onClick={() => inputRef.current?.click()}
                  disabled={isDisabled}
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-rose-600 hover:bg-rose-500/10 hover:text-rose-600"
                  onClick={handleClear}
                  disabled={isDisabled}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isDisabled}
            className="flex w-full flex-col items-center justify-center gap-2 py-6 text-center focus-visible:outline-none"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {isBusy ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <ImagePlus className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                <span className="text-blue-600 dark:text-blue-400">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground">
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT_ATTR}
          className="hidden"
          disabled={isDisabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) handleFile(file);
          }}
        />
      </div>

      {error ? (
        <p role="alert" className="text-xs font-medium text-rose-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
