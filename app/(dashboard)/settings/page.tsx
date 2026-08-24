import { redirect } from "next/navigation";
import { KeyRound, Settings2, ShieldCheck, UserRound } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  UserRoleBadge,
  UserStatusBadge,
} from "@/components/admin/admin-status-badge";
import { AvatarUploader } from "@/components/settings/avatar-uploader";
import { PasswordForm } from "@/components/settings/password-form";
import { ProfileForm } from "@/components/settings/profile-form";
import {
  SettingsRow,
  SettingsSection,
} from "@/components/settings/settings-section";
import { formatDate } from "@/lib/format";
import { getMe } from "@/service/getMe";

export const metadata = {
  title: "Settings - RentNest",
  description: "Manage your profile, photo and password on RentNest.",
};

export default async function SettingsPage() {
  const user = await getMe();

  // The proxy already gates this route, but guard here too so `user` is never
  // null past this point (and a stale cookie lands on login, not a crash).
  if (!user) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <AdminPageHeader
        icon={Settings2}
        title="Settings"
        description="Update your profile, change your photo, and keep your account secure."
      />

      <div className="space-y-6">
        <SettingsSection
          icon={UserRound}
          title="Profile photo"
          description="Shown across RentNest — in the navbar, on your listings and requests."
        >
          <AvatarUploader user={user} />
        </SettingsSection>

        <SettingsSection
          icon={Settings2}
          title="Your details"
          description="Your name and contact details, visible to people you rent with."
        >
          <ProfileForm user={user} />
        </SettingsSection>

        <SettingsSection
          icon={ShieldCheck}
          title="Account"
          description="Read-only facts about your account."
          accent="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        >
          <div className="space-y-0">
            <SettingsRow label="Email">{user.email}</SettingsRow>
            <SettingsRow label="Role">
              <UserRoleBadge role={user.role} />
            </SettingsRow>
            <SettingsRow label="Status">
              <UserStatusBadge status={user.status} />
            </SettingsRow>
            <SettingsRow label="Member since">
              {formatDate(user.createdAt)}
            </SettingsRow>
          </div>
        </SettingsSection>

        <SettingsSection
          icon={KeyRound}
          title="Password"
          description="Change the password you use to sign in."
          accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        >
          <PasswordForm />
        </SettingsSection>
      </div>
    </div>
  );
}
