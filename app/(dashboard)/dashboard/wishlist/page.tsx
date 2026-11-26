import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  WishlistGridClient,
  type WishlistItem,
} from "@/components/dashboard/wishlist-grid-client";
import { api } from "@/lib/axios";
import { getMe } from "@/service/getMe";
import type { IApiResponse, PaginationMeta } from "@/types/api";

export const metadata = {
  title: "Saved Properties - RentNest",
  description: "View and manage your saved rental properties on RentNest.",
};

export default async function TenantWishlistPage() {
  const user = await getMe();
  if (!user) {
    redirect("/login");
  }

  let initialItems: WishlistItem[] = [];
  let initialMeta: PaginationMeta | undefined;

  try {
    const res = await api.get<IApiResponse<WishlistItem[]>>(
      "/wishlist?page=1&limit=9",
    );
    if (res.data?.success) {
      initialItems = res.data.data ?? [];
      initialMeta = res.data.meta;
    }
  } catch {
    initialItems = [];
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <AdminPageHeader
        icon={Heart}
        title="Saved Properties"
        description="Homes you bookmarked while browsing RentNest."
      />

      <WishlistGridClient
        initialItems={initialItems}
        initialMeta={initialMeta}
      />
    </div>
  );
}
