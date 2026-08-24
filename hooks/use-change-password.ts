"use client";

import { useState } from "react";
import { toast } from "sonner";

import { accountApi } from "@/lib/account-api";
import { friendlyError } from "@/lib/api-error";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/**
 * Changes the caller's password via `PATCH /auth/change-password`.
 *
 * A 401 here does NOT mean the session expired — the backend returns it when the
 * current password is wrong — so it's remapped to that specific copy rather than
 * the shared "please sign in again" wording.
 */
export const useChangePassword = () => {
  const [isSaving, setIsSaving] = useState(false);

  const changePassword = async (
    payload: ChangePasswordPayload,
  ): Promise<boolean> => {
    setIsSaving(true);

    try {
      await accountApi.patch<null>("change-password", payload);
      toast.success("Password changed");
      return true;
    } catch (error) {
      toast.error(
        friendlyError(error, {
          byStatus: {
            400: "Your current password is incorrect.",
            401: "Your current password is incorrect.",
          },
          fallback: "Couldn't change your password.",
        }),
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { changePassword, isSaving };
};
