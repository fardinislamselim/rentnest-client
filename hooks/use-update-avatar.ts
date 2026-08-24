"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accountApi } from "@/lib/account-api";
import { friendlyError } from "@/lib/api-error";
import {
  imageUploadMessage,
  uploadImage,
  validateImageFile,
} from "@/lib/upload-image";
import type { User } from "@/types/user";

type Phase = "idle" | "uploading" | "saving";

/**
 * Two-step avatar change: upload the picked file to imgbb for a hosted URL, then
 * persist that URL with `PATCH /user/profile/picture`. `updateAvatarUrl` skips
 * the upload for the "paste a link" path. Either way the cached `me` is updated
 * so every avatar in the shell refreshes at once.
 *
 * `phase` lets the UI tell "Uploading…" apart from "Saving…"; both map to the
 * boolean `isBusy`.
 */
export const useUpdateAvatar = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const queryClient = useQueryClient();

  const save = async (avatar: string): Promise<User | null> => {
    setPhase("saving");
    try {
      const user = await accountApi.patch<User>("profile/picture", { avatar });
      queryClient.setQueryData(["me"], user);
      toast.success("Profile photo updated");
      return user;
    } catch (error) {
      toast.error(
        friendlyError(error, { fallback: "Couldn't update your photo." }),
      );
      return null;
    } finally {
      setPhase("idle");
    }
  };

  const updateAvatarFile = async (file: File): Promise<User | null> => {
    const problem = validateImageFile(file);
    if (problem) {
      toast.error(problem);
      return null;
    }

    setPhase("uploading");
    let url: string;
    try {
      url = await uploadImage(file);
    } catch (error) {
      toast.error(imageUploadMessage(error));
      setPhase("idle");
      return null;
    }

    return save(url);
  };

  const updateAvatarUrl = async (url: string): Promise<User | null> => {
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error("Please paste an image link first.");
      return null;
    }
    return save(trimmed);
  };

  return {
    updateAvatarFile,
    updateAvatarUrl,
    phase,
    isBusy: phase !== "idle",
  };
};
