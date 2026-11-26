"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Images, Upload, X } from "lucide-react";

import {
  IMAGE_ACCEPT_ATTR,
  MAX_IMAGE_BYTES,
  validateImageFile,
} from "@/lib/upload-image";
import { cn } from "@/lib/utils";

export interface MultiImageUploadProps {
  /** Existing remote image URLs preserved on edit. */
  existingUrls?: string[];
  /** Newly selected local files waiting to be uploaded. */
  files: File[];
  /** Called when an existing URL is removed. */
  onExistingUrlsChange?: (urls: string[]) => void;
  /** Called when new files are added or removed. */
  onFilesChange: (files: File[]) => void;
  /** Maximum total images (existing + new). Defaults to 8. */
  maxFiles?: number;
  maxBytes?: number;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export function MultiImageUpload({
  existingUrls = [],
  files,
  onExistingUrlsChange,
  onFilesChange,
  maxFiles = 8,
  maxBytes = MAX_IMAGE_BYTES,
  disabled = false,
  hint,
  className,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filePreviews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const totalCount = existingUrls.length + files.length;
  const remainingSlots = Math.max(0, maxFiles - totalCount);

  const handleFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    if (list.length === 0) return;

    if (remainingSlots <= 0) {
      setError(`You can upload at most ${maxFiles} gallery images.`);
      return;
    }

    const validFiles: File[] = [];
    let firstError: string | null = null;

    for (const file of list) {
      const problem = validateImageFile(file, maxBytes);
      if (problem) {
        if (!firstError) firstError = problem;
        continue;
      }
      if (validFiles.length >= remainingSlots) {
        if (!firstError) {
          firstError = `Only ${maxFiles} gallery images are allowed.`;
        }
        break;
      }
      validFiles.push(file);
    }

    setError(firstError);

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const removeExistingUrl = (index: number) => {
    if (!onExistingUrlsChange) return;
    setError(null);
    onExistingUrlsChange(existingUrls.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setError(null);
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (disabled) return;
          handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border border-dashed border-border/70 bg-muted/20 p-5 transition-colors",
          isDragging && "border-blue-500 bg-blue-500/5",
          error && "border-rose-500/70 bg-rose-500/5",
          disabled && "opacity-70",
        )}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || remainingSlots === 0}
          className="flex w-full flex-col items-center justify-center gap-2 py-4 text-center focus-visible:outline-none disabled:cursor-not-allowed"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Images className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              <span className="text-blue-600 dark:text-blue-400">
                Click to upload
              </span>{" "}
              or drag and drop gallery images
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {hint ??
                `JPEG, PNG, WebP or AVIF up to 5 MB each (${totalCount}/${maxFiles} selected).`}
            </p>
          </div>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground">
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            Choose Images
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_ACCEPT_ATTR}
          multiple
          className="hidden"
          disabled={disabled || remainingSlots === 0}
          onChange={(event) => {
            if (event.target.files) {
              handleFiles(event.target.files);
            }
            event.target.value = "";
          }}
        />
      </div>

      {error ? (
        <p role="alert" className="text-xs font-medium text-rose-500">
          {error}
        </p>
      ) : null}

      {totalCount > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {existingUrls.map((url, index) => (
            <div
              key={`existing-${url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Existing gallery image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-sm">
                Saved
              </span>
              {onExistingUrlsChange ? (
                <button
                  type="button"
                  onClick={() => removeExistingUrl(index)}
                  disabled={disabled}
                  aria-label={`Remove saved image ${index + 1}`}
                  className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ))}

          {filePreviews.map((preview, index) => (
            <div
              key={`new-${files[index]?.name ?? index}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={`New gallery image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-blue-600/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
                New
              </span>
              <button
                type="button"
                onClick={() => removeNewFile(index)}
                disabled={disabled}
                aria-label={`Remove new image ${index + 1}`}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-sm transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
