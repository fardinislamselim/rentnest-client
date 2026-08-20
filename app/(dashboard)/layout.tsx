import { Navbar } from "@/components/layout/navbar";
import { getMe } from "@/service/getMe";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMe();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} variant="dashboard" />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
