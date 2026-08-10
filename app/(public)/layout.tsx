import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getMe } from "@/service/getMe";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  const user = await getMe()
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
