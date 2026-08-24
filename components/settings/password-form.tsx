"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/use-change-password";
import { cn } from "@/lib/utils";

const MIN_LENGTH = 6;

type FieldKey = "current" | "next" | "confirm";

/**
 * Change-password form. The confirm-match and length checks run here so an
 * obviously-bad submission never leaves the browser; the "current password is
 * wrong" case can only be known by the backend and comes back as a toast.
 */
export function PasswordForm() {
  const { changePassword, isSaving } = useChangePassword();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [shown, setShown] = useState<Record<FieldKey, boolean>>({
    current: false,
    next: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const toggle = (key: FieldKey) =>
    setShown((prev) => ({ ...prev, [key]: !prev[key] }));

  const reset = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Partial<Record<FieldKey, string>> = {};
    if (!current) nextErrors.current = "Enter your current password.";
    if (next.length < MIN_LENGTH)
      nextErrors.next = `Use at least ${MIN_LENGTH} characters.`;
    if (confirm !== next) nextErrors.confirm = "Passwords don't match.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    const ok = await changePassword({
      currentPassword: current,
      newPassword: next,
    });
    if (ok) reset();
  };

  const fields: {
    key: FieldKey;
    id: string;
    label: string;
    value: string;
    setValue: (value: string) => void;
    autoComplete: string;
  }[] = [
    {
      key: "current",
      id: "currentPassword",
      label: "Current password",
      value: current,
      setValue: setCurrent,
      autoComplete: "current-password",
    },
    {
      key: "next",
      id: "newPassword",
      label: "New password",
      value: next,
      setValue: setNext,
      autoComplete: "new-password",
    },
    {
      key: "confirm",
      id: "confirmPassword",
      label: "Confirm new password",
      value: confirm,
      setValue: setConfirm,
      autoComplete: "new-password",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={field.id}>{field.label}</Label>
            <div className="relative">
              <Input
                id={field.id}
                type={shown[field.key] ? "text" : "password"}
                value={field.value}
                onChange={(event) => {
                  field.setValue(event.target.value);
                  if (errors[field.key]) {
                    setErrors((prev) => ({ ...prev, [field.key]: undefined }));
                  }
                }}
                autoComplete={field.autoComplete}
                disabled={isSaving}
                className="pr-10"
                aria-invalid={errors[field.key] ? true : undefined}
              />
              <button
                type="button"
                onClick={() => toggle(field.key)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label={shown[field.key] ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {shown[field.key] ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors[field.key] ? (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {errors[field.key]}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <p
        className={cn(
          "text-xs text-muted-foreground",
          next.length > 0 && next.length < MIN_LENGTH && "text-amber-600 dark:text-amber-400",
        )}
      >
        Use at least {MIN_LENGTH} characters. Choose something you don't use elsewhere.
      </p>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
          disabled={isSaving || !current || !next || !confirm}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          Update password
        </Button>
      </div>
    </form>
  );
}
