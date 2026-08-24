"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "@/hooks/use-update-profile";
import type { User } from "@/types/user";

const BIO_MAX = 500;

/** Trim, then treat empty as "unset" so a cleared optional field is sent as "". */
const normalize = (value: string) => value.trim();

/**
 * Name / phone / bio editor. Only the fields that actually changed are sent, so
 * a save that touches just the bio doesn't re-validate the name. The Save button
 * stays disabled until something differs from what's on file.
 */
export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const { updateProfile, isSaving } = useUpdateProfile();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [nameError, setNameError] = useState<string | null>(null);

  const nameChanged = normalize(name) !== user.name;
  const phoneChanged = normalize(phone) !== (user.phone ?? "");
  const bioChanged = normalize(bio) !== (user.bio ?? "");
  const dirty = nameChanged || phoneChanged || bioChanged;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (normalize(name).length < 2) {
      setNameError("Please enter your full name (at least 2 characters).");
      return;
    }
    setNameError(null);

    // Send only what changed — the backend patches partially.
    const payload: { name?: string; phone?: string; bio?: string } = {};
    if (nameChanged) payload.name = normalize(name);
    if (phoneChanged) payload.phone = normalize(phone);
    if (bioChanged) payload.bio = normalize(bio);

    if (Object.keys(payload).length === 0) return;

    const updated = await updateProfile(payload);
    if (updated) {
      // Reset the baseline to the saved values so the form is clean again.
      setName(updated.name);
      setPhone(updated.phone ?? "");
      setBio(updated.bio ?? "");
      // Refresh the server shell so the navbar name/greeting follow.
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(null);
            }}
            placeholder="Your name"
            autoComplete="name"
            disabled={isSaving}
            aria-invalid={nameError ? true : undefined}
          />
          {nameError ? (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {nameError}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="e.g. 01700-000000"
            autoComplete="tel"
            disabled={isSaving}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="bio">Bio</Label>
          <span className="text-xs text-muted-foreground">
            {bio.length}/{BIO_MAX}
          </span>
        </div>
        <Textarea
          id="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value.slice(0, BIO_MAX))}
          placeholder="A short line about you — shown on your public profile."
          rows={4}
          disabled={isSaving}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        {dirty ? (
          <span className="text-xs text-muted-foreground">Unsaved changes</span>
        ) : null}
        <Button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
          disabled={isSaving || !dirty}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : null}
          Save changes
        </Button>
      </div>
    </form>
  );
}
