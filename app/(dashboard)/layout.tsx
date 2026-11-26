import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getMe } from "@/service/getMe";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
