"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Link2, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateAvatar } from "@/hooks/use-update-avatar";
import { initialsOf } from "@/lib/format";
import { IMAGE_ACCEPT_ATTR, MAX_AVATAR_BYTES } from "@/lib/upload-image";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

const ROLE_ACCENT: Record<User["role"], string> = {
  LANDLORD: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ADMIN: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  TENANT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const maxMb = Math.round(MAX_AVATAR_BYTES / (1024 * 1024));

/**
 * Profile photo picker.
 *
 * The photo saves as soon as a file is picked — there is no separate submit —
 * because the two-step flow (host the file, then store its URL) has nothing
 * useful to defer. A local object URL stands in while the round trip runs so the
 * new face appears immediately, and is dropped again if the save fails.
 */
export function AvatarUploader({ user }: { user: User }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  const { updateAvatarFile, updateAvatarUrl, phase, isBusy } = useUpdateAvatar();

  // Release the last object URL when this unmounts.
  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const showLocalPreview = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreview(url);
  };

  const dropLocalPreview = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreview(null);
  };

  const handleFile = async (file: File) => {
    showLocalPreview(file);

    const updated = await updateAvatarFile(file);
    if (updated) {
      setAvatarUrl(updated.avatar);
      // Re-render the server shell so the navbar and sidebar avatars follow.
      router.refresh();
    }

    dropLocalPreview();
  };

  const submitUrl = async () => {
    const trimmed = urlDraft.trim();

    if (!/^https?:\/\/\S+$/i.test(trimmed)) {
      toast.error("Please paste a full image link starting with http:// or https://");
      return;
    }

    const updated = await updateAvatarUrl(trimmed);
    if (updated) {
      setAvatarUrl(updated.avatar);
      setUrlDraft("");
      setShowUrlField(false);
      router.refresh();
    }
  };

  const displayed = preview ?? avatarUrl;
  const busyLabel = phase === "uploading" ? "Uploading…" : "Saving…";

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!isBusy) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (isBusy) return;
          const file = event.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        className={cn(
          "flex flex-col gap-4 rounded-2xl border border-dashed border-border/60 p-4 transition-colors sm:flex-row sm:items-center",
          isDragging && "border-blue-500 bg-blue-500/5",
        )}
      >
        <div className="relative shrink-0 self-start sm:self-center">
          <Avatar className="h-20 w-20 border border-border/60">
            {displayed ? (
              <AvatarImage src={displayed} alt={`${user.name}'s profile photo`} />
            ) : (
              <AvatarFallback
                className={cn("text-lg font-bold", ROLE_ACCENT[user.role])}
              >
                {initialsOf(user.name)}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Loading state: cover the avatar so the spinner reads as "this image". */}
          {isBusy ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70 backdrop-blur-sm">
              <Loader2
                className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              aria-label="Change profile photo"
              title="Change profile photo"
            >
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground" aria-live="polite">
            {isBusy ? busyLabel : displayed ? "Profile photo" : "No photo yet"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Drag an image here, or choose a file. JPG, PNG, WebP or GIF up to{" "}
            {maxMb} MB. Saves as soon as you pick it.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl border-border/60"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
            >
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              {displayed ? "Replace photo" : "Upload photo"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-xl text-muted-foreground"
              onClick={() => setShowUrlField((open) => !open)}
              disabled={isBusy}
            >
              <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
              {showUrlField ? "Hide link field" : "Use a link"}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={IMAGE_ACCEPT_ATTR}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            // Clear the input so picking the same file twice still fires.
            event.target.value = "";
            if (file) void handleFile(file);
          }}
        />
      </div>

      {showUrlField ? (
        <div className="space-y-1.5 rounded-2xl border border-border/60 bg-muted/30 p-4">
          <Label htmlFor="avatarUrl">Image link</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="avatarUrl"
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void submitUrl();
                }
              }}
              placeholder="https://example.com/photo.jpg"
              disabled={isBusy}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                className="h-10 rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700"
                onClick={() => void submitUrl()}
                disabled={isBusy || urlDraft.trim() === ""}
              >
                {isBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : null}
                Save photo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="h-10 w-10 rounded-xl text-muted-foreground"
                onClick={() => {
                  setUrlDraft("");
                  setShowUrlField(false);
                }}
                disabled={isBusy}
                aria-label="Cancel image link"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Handy if your photo is already hosted somewhere.
          </p>
        </div>
      ) : null}
    </div>
  );
}
