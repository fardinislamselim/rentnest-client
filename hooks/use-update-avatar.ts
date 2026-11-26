"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accountApi } from "@/lib/account-api";
import { extractApiErrorMessage } from "@/lib/api-error";
import { validateImageFile } from "@/lib/upload-image";
import type { User } from "@/types/user";

/**
 * Uploads a profile picture file directly as `multipart/form-data` (`avatar`
 * field) to `PATCH /api/v1/user/profile/picture` via the `/api/account` proxy.
 */
export const useUpdateAvatar = () => {
  const [isBusy, setIsBusy] = useState(false);
  const queryClient = useQueryClient();

  const updateAvatarFile = async (file: File): Promise<User | null> => {
    const problem = validateImageFile(file);
    if (problem) {
      toast.error(problem);
      return null;
    }

    setIsBusy(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const user = await accountApi.patch<User>("profile/picture", formData);
      queryClient.setQueryData(["me"], user);
      toast.success("Profile photo updated");
      return user;
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Couldn't update your photo."),
      );
      return null;
    } finally {
      setIsBusy(false);
    }
  };

  return {
    updateAvatarFile,
    isBusy,
  };
};
