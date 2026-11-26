"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { SingleImageUpload } from "@/components/shared/ImageUpload";
import { useUpdateAvatar } from "@/hooks/use-update-avatar";
import type { User } from "@/types/user";

/**
 * Profile photo uploader backed by `SingleImageUpload`.
 * Selecting or dropping a valid image immediately submits `multipart/form-data`
 * (`avatar`) to `PATCH /api/v1/user/profile/picture` and refreshes the UI.
 */
export function AvatarUploader({ user }: { user: User }) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar);
  const { updateAvatarFile, isBusy } = useUpdateAvatar();

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setAvatarUrl(null);
      return;
    }

    const updated = await updateAvatarFile(file);
    if (updated) {
      setAvatarUrl(updated.avatar);
      router.refresh();
    }
  };

  return (
    <SingleImageUpload
      value={avatarUrl}
      onChange={(file) => void handleFileChange(file)}
      previewShape="circle"
      isBusy={isBusy}
      label={avatarUrl ? "Replace photo" : "Upload photo"}
      hint="Drag and drop or click to upload. JPEG, PNG, WebP or AVIF up to 5 MB."
    />
  );
}
