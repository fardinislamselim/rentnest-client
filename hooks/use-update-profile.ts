"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { accountApi } from "@/lib/account-api";
import { friendlyError } from "@/lib/api-error";
import type { User } from "@/types/user";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
}

/**
 * Updates the caller's own profile (name / phone / bio) via
 * `PATCH /user/profile`, then refreshes the cached `me` so the sidebar, navbar
 * and this form all reflect the new values without a reload.
 */
export const useUpdateProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const updateProfile = async (
    payload: UpdateProfilePayload,
  ): Promise<User | null> => {
    setIsSaving(true);

    try {
      const user = await accountApi.patch<User>("profile", payload);
      queryClient.setQueryData(["me"], user);
      toast.success("Profile updated");
      return user;
    } catch (error) {
      toast.error(friendlyError(error, { fallback: "Couldn't save your changes." }));
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { updateProfile, isSaving };
};
