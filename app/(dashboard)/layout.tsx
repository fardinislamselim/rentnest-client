import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { getMe } from "@/service/getMe";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();
  const userRole = user?.role ?? "TENANT";
  const gradientBg =
    userRole === "LANDLORD"
      ? "bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10"
      : userRole === "ADMIN"
        ? "bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/10 dark:to-pink-950/10"
        : "bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/10 dark:to-teal-950/10";

  return (
    <div className={cn("flex min-h-screen flex-col", gradientBg)}>
      <Navbar user={user} variant="dashboard" />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar user={user} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 md:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
